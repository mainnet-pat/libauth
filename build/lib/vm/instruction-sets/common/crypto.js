import { hash256, ripemd160 as internalRipemd160, secp256k1 as internalSecp256k1, sha1 as internalSha1, sha256 as internalSha256, } from '../../../crypto/crypto.js';
import { binToHex } from '../../../format/format.js';
import { combineOperations, pushToStack, useOneStackItem, useOneVmNumber, useThreeStackItems, useTwoStackItems, } from './combinators.js';
import { ConsensusCommon, SigningSerializationTypesBCH } from './consensus.js';
import { decodeBitcoinSignature, isValidSignatureEncodingBCHTransaction, isValidSignatureEncodingDER, } from './encoding.js';
import { applyError, AuthenticationErrorCommon } from './errors.js';
import { opVerify } from './flow-control.js';
import { booleanToVmNumber, encodeAuthenticationInstructions, isValidPublicKeyEncoding, } from './instruction-sets-utils.js';
import { generateSigningSerializationBCH } from './signing-serialization.js';
export const opRipemd160 = ({ ripemd160, } = { ripemd160: internalRipemd160 }) => (state) => useOneStackItem(state, (nextState, [value]) => pushToStack(nextState, ripemd160.hash(value)));
export const opSha1 = ({ sha1, } = { sha1: internalSha1 }) => (state) => useOneStackItem(state, (nextState, [value]) => pushToStack(nextState, sha1.hash(value)));
export const opSha256 = ({ sha256, } = { sha256: internalSha256 }) => (state) => useOneStackItem(state, (nextState, [value]) => pushToStack(nextState, sha256.hash(value)));
export const opHash160 = ({ ripemd160, sha256, } = { ripemd160: internalRipemd160, sha256: internalSha256 }) => (state) => useOneStackItem(state, (nextState, [value]) => pushToStack(nextState, ripemd160.hash(sha256.hash(value))));
export const opHash256 = ({ sha256, } = { sha256: internalSha256 }) => (state) => useOneStackItem(state, (nextState, [value]) => pushToStack(nextState, hash256(value, sha256)));
export const opCodeSeparator = (state) => {
    // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
    state.lastCodeSeparator = state.ip;
    return state;
};
export const opCheckSig = ({ secp256k1, sha256, } = { secp256k1: internalSecp256k1, sha256: internalSha256 }) => (s) => 
// eslint-disable-next-line complexity
useTwoStackItems(s, (state, [bitcoinEncodedSignature, publicKey]) => {
    if (!isValidPublicKeyEncoding(publicKey)) {
        return applyError(state, AuthenticationErrorCommon.invalidPublicKeyEncoding);
    }
    if (!isValidSignatureEncodingBCHTransaction(bitcoinEncodedSignature, SigningSerializationTypesBCH)) {
        return applyError(state, AuthenticationErrorCommon.invalidSignatureEncoding, `Transaction signature (including signing serialization): ${binToHex(bitcoinEncodedSignature)}`);
    }
    const coveredBytecode = encodeAuthenticationInstructions(state.instructions).subarray(state.lastCodeSeparator + 1);
    const { signingSerializationType, signature } = decodeBitcoinSignature(bitcoinEncodedSignature);
    const serialization = generateSigningSerializationBCH(state.program, { coveredBytecode, signingSerializationType }, sha256);
    const digest = hash256(serialization, sha256);
    // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
    state.signedMessages.push({ digest, serialization });
    const useSchnorr = signature.length === ConsensusCommon.schnorrSignatureLength;
    const success = useSchnorr
        ? secp256k1.verifySignatureSchnorr(signature, publicKey, digest)
        : secp256k1.verifySignatureDERLowS(signature, publicKey, digest);
    return !success && signature.length !== 0
        ? applyError(state, AuthenticationErrorCommon.nonNullSignatureFailure)
        : pushToStack(state, booleanToVmNumber(success));
});
// TODO: implement schnorr multisig https://gitlab.com/bitcoin-cash-node/bchn-sw/bitcoincash-upgrade-specifications/-/blob/master/spec/2019-11-15-schnorrmultisig.md
export const opCheckMultiSig = ({ secp256k1, sha256, } = { secp256k1: internalSecp256k1, sha256: internalSha256 }) => (s) => useOneVmNumber(s, (state, publicKeysValue) => {
    const potentialPublicKeys = Number(publicKeysValue);
    if (potentialPublicKeys < 0) {
        return applyError(state, AuthenticationErrorCommon.invalidNaturalNumber);
    }
    if (potentialPublicKeys > 20 /* Multisig.maximumPublicKeys */) {
        return applyError(state, AuthenticationErrorCommon.exceedsMaximumMultisigPublicKeyCount);
    }
    const publicKeys = 
    // eslint-disable-next-line functional/immutable-data
    potentialPublicKeys > 0 ? state.stack.splice(-potentialPublicKeys) : [];
    // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
    state.operationCount += potentialPublicKeys;
    return state.operationCount > ConsensusCommon.maximumOperationCount
        ? applyError(state, AuthenticationErrorCommon.exceededMaximumOperationCount)
        : useOneVmNumber(state, (nextState, approvingKeys) => {
            const requiredApprovingPublicKeys = Number(approvingKeys);
            if (requiredApprovingPublicKeys < 0) {
                return applyError(nextState, AuthenticationErrorCommon.invalidNaturalNumber);
            }
            if (requiredApprovingPublicKeys > potentialPublicKeys) {
                return applyError(nextState, AuthenticationErrorCommon.insufficientPublicKeys);
            }
            const signatures = requiredApprovingPublicKeys > 0
                ? // eslint-disable-next-line functional/immutable-data
                    nextState.stack.splice(-requiredApprovingPublicKeys)
                : [];
            return useOneStackItem(nextState, 
            // eslint-disable-next-line complexity
            (finalState, [protocolBugValue]) => {
                if (protocolBugValue.length !== 0) {
                    return applyError(finalState, AuthenticationErrorCommon.invalidProtocolBugValue);
                }
                const coveredBytecode = encodeAuthenticationInstructions(finalState.instructions).subarray(finalState.lastCodeSeparator + 1);
                let approvingPublicKeys = 0; // eslint-disable-line functional/no-let
                let remainingSignatures = signatures.length; // eslint-disable-line functional/no-let
                let remainingPublicKeys = publicKeys.length; // eslint-disable-line functional/no-let
                // eslint-disable-next-line functional/no-loop-statement
                while (remainingSignatures > 0 &&
                    remainingPublicKeys > 0 &&
                    approvingPublicKeys + remainingPublicKeys >=
                        remainingSignatures &&
                    approvingPublicKeys !== requiredApprovingPublicKeys) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const publicKey = publicKeys[remainingPublicKeys - 1];
                    const bitcoinEncodedSignature = 
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    signatures[remainingSignatures - 1];
                    if (!isValidPublicKeyEncoding(publicKey)) {
                        return applyError(finalState, AuthenticationErrorCommon.invalidPublicKeyEncoding);
                    }
                    if (!isValidSignatureEncodingBCHTransaction(bitcoinEncodedSignature, SigningSerializationTypesBCH)) {
                        return applyError(finalState, AuthenticationErrorCommon.invalidSignatureEncoding, `Transaction signature (including signing serialization type): ${binToHex(bitcoinEncodedSignature)}`);
                    }
                    const { signingSerializationType, signature } = decodeBitcoinSignature(bitcoinEncodedSignature);
                    const serialization = generateSigningSerializationBCH(state.program, { coveredBytecode, signingSerializationType }, sha256);
                    const digest = hash256(serialization, sha256);
                    // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
                    finalState.signedMessages.push({ digest, serialization });
                    if (signature.length ===
                        ConsensusCommon.schnorrSignatureLength) {
                        return applyError(finalState, AuthenticationErrorCommon.schnorrSizedSignatureInCheckMultiSig);
                    }
                    const signed = secp256k1.verifySignatureDERLowS(signature, publicKey, digest);
                    // eslint-disable-next-line functional/no-conditional-statement
                    if (signed) {
                        approvingPublicKeys += 1; // eslint-disable-line functional/no-expression-statement
                        remainingSignatures -= 1; // eslint-disable-line functional/no-expression-statement
                    }
                    remainingPublicKeys -= 1; // eslint-disable-line functional/no-expression-statement
                }
                const success = approvingPublicKeys === requiredApprovingPublicKeys;
                if (!success &&
                    !signatures.every((signature) => signature.length === 0)) {
                    return applyError(finalState, AuthenticationErrorCommon.nonNullSignatureFailure);
                }
                return pushToStack(finalState, booleanToVmNumber(success));
            });
        });
});
export const opCheckSigVerify = ({ secp256k1, sha256, } = { secp256k1: internalSecp256k1, sha256: internalSha256 }) => combineOperations(opCheckSig({ secp256k1, sha256 }), opVerify);
export const opCheckMultiSigVerify = ({ secp256k1, sha256, }) => combineOperations(opCheckMultiSig({ secp256k1, sha256 }), opVerify);
/**
 * Validate the encoding of a raw signature – a signature without a signing
 * serialization type byte (A.K.A. "sighash" byte).
 *
 * @param signature - the raw signature
 */
export const isValidSignatureEncodingBCHRaw = (signature) => signature.length === 0 ||
    signature.length === ConsensusCommon.schnorrSignatureLength ||
    isValidSignatureEncodingDER(signature);
export const opCheckDataSig = ({ secp256k1, sha256, }) => (state) => 
// eslint-disable-next-line complexity
useThreeStackItems(state, (nextState, [signature, message, publicKey]) => {
    if (!isValidSignatureEncodingBCHRaw(signature)) {
        return applyError(nextState, AuthenticationErrorCommon.invalidSignatureEncoding, `Data signature: ${binToHex(signature)}`);
    }
    if (!isValidPublicKeyEncoding(publicKey)) {
        return applyError(nextState, AuthenticationErrorCommon.invalidPublicKeyEncoding);
    }
    const digest = sha256.hash(message);
    // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
    nextState.signedMessages.push({ digest, message });
    const useSchnorr = signature.length === ConsensusCommon.schnorrSignatureLength;
    const success = useSchnorr
        ? secp256k1.verifySignatureSchnorr(signature, publicKey, digest)
        : secp256k1.verifySignatureDERLowS(signature, publicKey, digest);
    return !success && signature.length !== 0
        ? applyError(nextState, AuthenticationErrorCommon.nonNullSignatureFailure)
        : pushToStack(nextState, booleanToVmNumber(success));
});
export const opCheckDataSigVerify = ({ secp256k1, sha256, } = { secp256k1: internalSecp256k1, sha256: internalSha256 }) => combineOperations(opCheckDataSig({ secp256k1, sha256 }), opVerify);
export const opReverseBytes = (state) => useOneStackItem(state, (nextState, [item]) => pushToStack(nextState, item.slice().reverse()));
//# sourceMappingURL=crypto.js.map