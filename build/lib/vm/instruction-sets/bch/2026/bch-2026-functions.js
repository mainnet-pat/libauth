import { binToHex } from '../../../../format/format.js';
import { isFunctionTableShared } from '../../../virtual-machine.js';
import { applyError, authenticationInstructionsAreMalformed, decodeAuthenticationInstructions, disassembleAuthenticationInstructionMalformed, pushToControlStack, useOneStackItem, } from '../../common/common.js';
import { ConsensusBch2026 } from './bch-2026-consensus.js';
import { AuthenticationErrorBch2026 } from './bch-2026-errors.js';
import { OpcodesBch2026 } from './bch-2026-opcodes.js';
export const createOpDefine = ({ maximumFunctionIdentifierLength = ConsensusBch2026.maximumFunctionIdentifierLength, } = {}) => (state) => useOneStackItem(state, (nextState, [functionIdentifier]) => {
    const functionTableKey = binToHex(functionIdentifier);
    if (functionIdentifier.length > maximumFunctionIdentifierLength) {
        return applyError(nextState, AuthenticationErrorBch2026.functionIdentifierExcessiveLength, `Function identifier has excessive length. Maximum length: ${maximumFunctionIdentifierLength}. Provided length: ${functionIdentifier.length}. Provided identifier: 0x${functionTableKey}.`);
    }
    if (nextState.functionTable[functionTableKey] !== undefined) {
        return applyError(nextState, AuthenticationErrorBch2026.functionIdentifierPreviouslyDefined, `Function identifier: 0x${functionTableKey}. Existing contents: ${binToHex(nextState.functionTable[functionTableKey])}.`);
    }
    return useOneStackItem(nextState, (finalState, [functionBody]) => {
        /*
         * A cloned program state shares its function table with the state it
         * was cloned from, so copy a shared table before adding to it.
         */
        // eslint-disable-next-line functional/no-conditional-statements
        if (isFunctionTableShared(finalState.functionTable)) {
            // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
            finalState.functionTable = { ...finalState.functionTable };
        }
        /*
         * Store a compact copy: a body split from a larger item (OP_SPLIT
         * returns views) would otherwise keep that whole item in memory.
         */
        // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
        finalState.functionTable[functionTableKey] = functionBody.slice();
        // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
        finalState.functionCount += 1;
        return finalState;
    });
});
/**
 * Decoded instructions by function body. A body is never modified once
 * OP_DEFINE stores it, and the VM never modifies an instruction list, so each
 * body is decoded on its first OP_INVOKE and its instructions are reused by
 * every later invocation.
 */
const decodedFunctionBodies = new WeakMap();
const decodeFunctionBody = (functionBody) => {
    const cached = decodedFunctionBodies.get(functionBody);
    if (cached !== undefined)
        return cached;
    const decoded = decodeAuthenticationInstructions(functionBody);
    // eslint-disable-next-line functional/no-expression-statements
    decodedFunctionBodies.set(functionBody, decoded);
    return decoded;
};
export const opInvoke = (state) => useOneStackItem(state, (nextState, [functionIdentifier]) => {
    const functionTableKey = binToHex(functionIdentifier);
    const functionBody = nextState.functionTable[functionTableKey];
    if (functionBody === undefined) {
        return applyError(nextState, AuthenticationErrorBch2026.functionIdentifierUndefined, `Function identifier: 0x${functionTableKey}.`);
    }
    const newInstructions = decodeFunctionBody(functionBody);
    if (authenticationInstructionsAreMalformed(newInstructions)) {
        return applyError(nextState, AuthenticationErrorBch2026.malformedFunction, `Malformed instruction: ${disassembleAuthenticationInstructionMalformed(OpcodesBch2026, newInstructions[newInstructions.length - 1])}.`);
    }
    const manuallyAdvance = 1;
    const finalState = pushToControlStack(nextState, {
        instructions: nextState.instructions,
        ip: nextState.ip + manuallyAdvance,
    });
    finalState.ip = 0 - manuallyAdvance; // eslint-disable-line functional/no-expression-statements, functional/immutable-data
    finalState.instructions = newInstructions; // eslint-disable-line functional/no-expression-statements, functional/immutable-data
    return finalState;
});
//# sourceMappingURL=bch-2026-functions.js.map