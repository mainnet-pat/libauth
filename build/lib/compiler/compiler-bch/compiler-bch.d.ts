import type { AnyCompilerConfiguration, AuthenticationTemplate, CompilationContextBCH, CompilationData, CompilerConfiguration, CompilerOperationResult, Sha256 } from '../../lib';
export declare type CompilerOperationsKeyBCH = 'data_signature' | 'public_key' | 'schnorr_data_signature' | 'schnorr_signature' | 'signature';
export declare enum SigningSerializationAlgorithmIdentifier {
    /**
     * A.K.A. `SIGHASH_ALL|SIGHASH_FORKID`
     */
    allOutputs = "all_outputs",
    /**
     * A.K.A. `SIGHASH_ALL|SIGHASH_UTXOS|SIGHASH_FORKID`
     */
    allOutputsAllUtxos = "all_outputs_all_utxos",
    /**
     * A.K.A. `SIGHASH_ALL|SIGHASH_FORKID|ANYONECANPAY`
     */
    allOutputsSingleInput = "all_outputs_single_input",
    /**
     * A.K.A. `SIGHASH_ALL|SIGHASH_UTXOS|SIGHASH_FORKID|ANYONECANPAY`
     */
    allOutputsSingleInputInvalidAllUtxos = "all_outputs_single_input_INVALID_all_utxos",
    /**
     * A.K.A. `SIGHASH_SINGLE|SIGHASH_FORKID`
     */
    correspondingOutput = "corresponding_output",
    /**
     * A.K.A. `SIGHASH_SINGLE|SIGHASH_UTXOS|SIGHASH_FORKID`
     */
    correspondingOutputAllUtxos = "corresponding_output_all_utxos",
    /**
     * A.K.A. `SIGHASH_SINGLE|SIGHASH_FORKID|ANYONECANPAY`
     */
    correspondingOutputSingleInput = "corresponding_output_single_input",
    /**
     * A.K.A. `SIGHASH_SINGLE|SIGHASH_UTXOS|SIGHASH_FORKID|ANYONECANPAY`
     */
    correspondingOutputSingleInputInvalidAllUtxos = "corresponding_output_single_input_INVALID_all_utxos",
    /**
     * An alias for `all_outputs_all_utxos`
     * (A.K.A. `SIGHASH_ALL|SIGHASH_UTXOS|SIGHASH_FORKID`),
     * the most secure signing serialization algorithm.
     *
     * Note that as of 2022, `all_outputs` (A.K.A. `SIGHASH_ALL|SIGHASH_FORKID`)
     * is more commonly used and is therefore a better choice for privacy in
     * common, existing contract types.
     */
    default = "default",
    /**
     * A.K.A `SIGHASH_NONE|SIGHASH_FORKID`
     */
    noOutputs = "no_outputs",
    /**
     * A.K.A `SIGHASH_NONE|SIGHASH_UTXOS|SIGHASH_FORKID`
     */
    noOutputsAllUtxos = "no_outputs_all_utxos",
    /**
     * A.K.A `SIGHASH_NONE|SIGHASH_FORKID|ANYONECANPAY`
     */
    noOutputsSingleInput = "no_outputs_single_input",
    /**
     * A.K.A. `SIGHASH_NONE|SIGHASH_UTXOS|SIGHASH_FORKID|ANYONECANPAY`
     */
    noOutputsSingleInputInvalidAllUtxos = "no_outputs_single_input_INVALID_all_utxos"
}
export declare const compilerOperationHelperComputeSignatureBCH: ({ coveredBytecode, identifier, compilationContext, operationName, privateKey, sha256, sign, }: {
    coveredBytecode: Uint8Array;
    identifier: string;
    privateKey: Uint8Array;
    compilationContext: CompilationContextBCH;
    operationName: string;
    sign: (privateKey: Uint8Array, messageHash: Uint8Array) => Uint8Array | string;
    sha256: {
        hash: Sha256['hash'];
    };
}) => CompilerOperationResult;
export declare const compilerOperationHelperHdKeySignatureBCH: ({ operationName, secp256k1Method, }: {
    operationName: string;
    secp256k1Method: keyof NonNullable<CompilerConfiguration['secp256k1']>;
}) => import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHdKeyEcdsaSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHdKeySchnorrSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHelperKeySignatureBCH: ({ operationName, secp256k1Method, }: {
    operationName: string;
    secp256k1Method: keyof NonNullable<CompilerConfiguration['secp256k1']>;
}) => import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationKeyEcdsaSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationKeySchnorrSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHelperComputeDataSignatureBCH: <Data extends CompilationData<CompilationContextBCH>, Configuration extends AnyCompilerConfiguration<CompilationContextBCH>>({ data, configuration, identifier, operationName, privateKey, sha256, sign, }: {
    data: Data;
    configuration: Configuration;
    identifier: string;
    privateKey: Uint8Array;
    operationName: string;
    sign: (privateKey: Uint8Array, messageHash: Uint8Array) => Uint8Array | string;
    sha256: {
        hash: Sha256['hash'];
    };
}) => CompilerOperationResult;
export declare const compilerOperationHelperKeyDataSignatureBCH: ({ operationName, secp256k1Method, }: {
    operationName: string;
    secp256k1Method: keyof NonNullable<CompilerConfiguration['secp256k1']>;
}) => import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationKeyEcdsaDataSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationKeySchnorrDataSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHelperHdKeyDataSignatureBCH: ({ operationName, secp256k1Method, }: {
    operationName: string;
    secp256k1Method: keyof NonNullable<CompilerConfiguration['secp256k1']>;
}) => import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHdKeyEcdsaDataSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationHdKeySchnorrDataSignatureBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationSigningSerializationFullBCH: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
export declare const compilerOperationsBCH: {
    hdKey: {
        data_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        public_key: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        schnorr_data_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        schnorr_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    };
    key: {
        data_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        public_key: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        schnorr_data_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        schnorr_signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        signature: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    };
    signingSerialization: {
        full_all_outputs: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_all_outputs_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_all_outputs_single_input: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_all_outputs_single_input_INVALID_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_corresponding_output: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_corresponding_output_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_corresponding_output_single_input: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_corresponding_output_single_input_INVALID_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_default: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_no_outputs: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_no_outputs_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_no_outputs_single_input: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        full_no_outputs_single_input_INVALID_all_utxos: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        corresponding_output: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        corresponding_output_hash: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        covered_bytecode: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        covered_bytecode_length: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        locktime: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        outpoint_index: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        outpoint_transaction_hash: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        output_value: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        sequence_number: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_outpoints: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_outpoints_hash: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_outputs: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_outputs_hash: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_sequence_numbers: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        transaction_sequence_numbers_hash: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
        version: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    };
    addressData: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    currentBlockHeight: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    currentBlockTime: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
    walletData: import("../compiler-types.js").CompilerOperation<CompilationContextBCH, false, CompilationData<CompilationContextBCH>, CompilerConfiguration<CompilationContextBCH, import("../compiler-types.js").CompilerOperationsKeysCommon, import("../compiler-types.js").CompilerOperationsSigningSerializationCommon, false, false, false, false>>;
};
export declare type CompilerConfigurationBCH = CompilerConfiguration<CompilationContextBCH, CompilerOperationsKeyBCH>;
/**
 * Create a compiler using the default BCH compiler configuration.
 *
 * Internally instantiates the necessary crypto and VM implementations – use
 * {@link compilerConfigurationToCompilerBCH} for more control.
 *
 * @param configuration - a compiler configuration from which properties
 * will be used to override properties of the default BCH configuration – must
 * include the `scripts` property
 */
export declare const createCompilerBCH: <Configuration extends AnyCompilerConfiguration<CompilationContextBCH>, ProgramState extends import("../../lib").AuthenticationProgramStateCommon>(configuration: Configuration) => import("../compiler-types.js").Compiler<CompilationContextBCH, Configuration, ProgramState>;
export declare const createCompiler: <Configuration extends AnyCompilerConfiguration<CompilationContextBCH>, ProgramState extends import("../../lib").AuthenticationProgramStateCommon>(configuration: Configuration) => import("../compiler-types.js").Compiler<CompilationContextBCH, Configuration, ProgramState>;
/**
 * Create a BCH `Compiler` from an `AuthenticationTemplate` and an optional set
 * of overrides.
 * @param template - the `AuthenticationTemplate` from which to create the BCH
 * compiler
 * @param overrides - a compiler configuration from which properties will be
 * used to override properties of the default BCH configuration
 */
export declare const authenticationTemplateToCompilerBCH: <Configuration extends AnyCompilerConfiguration<CompilationContextBCH>, ProgramState extends import("../../lib").AuthenticationProgramStateCommon>(template: AuthenticationTemplate, overrides?: Configuration | undefined) => import("../compiler-types.js").Compiler<CompilationContextBCH, Configuration, ProgramState>;
//# sourceMappingURL=compiler-bch.d.ts.map