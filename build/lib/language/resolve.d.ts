import type { AnyCompilerConfiguration, AuthenticationProgramStateControlStack, AuthenticationProgramStateMinimum, AuthenticationProgramStateStack, CashAssemblyScriptSegment, CompilationData, CompilationResultSuccess, CompilerConfiguration, CompilerOperationResult, IdentifierResolutionFunction, ResolvedScript } from '../lib';
import type { CompilationResult } from './language-types.js';
export declare const resolveScriptSegment: (segment: CashAssemblyScriptSegment, resolveIdentifiers: IdentifierResolutionFunction) => ResolvedScript;
export declare enum BuiltInVariables {
    currentBlockTime = "current_block_time",
    currentBlockHeight = "current_block_height",
    signingSerialization = "signing_serialization"
}
/**
 * If the identifier can be successfully resolved as a variable, the result is
 * returned as a Uint8Array. If the identifier references a known variable, but
 * an error occurs in resolving it, the error is returned as a string.
 * Otherwise, the identifier is not recognized as a variable, and this method
 * simply returns `false`.
 *
 * @param identifier - The full identifier used to describe this operation, e.g.
 * `owner.signature.all_outputs`.
 * @param data - The {@link CompilationData} provided to the compiler
 * @param configuration - The {@link CompilerConfiguration} provided to
 * the compiler
 */
export declare const resolveVariableIdentifier: <CompilationContext, Environment extends AnyCompilerConfiguration<CompilationContext>>({ data, configuration, identifier, }: {
    data: CompilationData<CompilationContext>;
    configuration: Environment;
    identifier: string;
}) => CompilerOperationResult<true>;
/**
 * A text-formatting method to pretty-print the list of expected inputs
 * (`Encountered unexpected input while parsing script. Expected ...`). If
 * present, the `EOF` expectation is always moved to the end of the list.
 * @param expectedArray - the alphabetized list of expected inputs produced by
 * `parseScript`
 */
export declare const describeExpectedInput: (expectedArray: string[]) => string;
export declare const createEmptyRange: () => {
    endColumn: number;
    endLineNumber: number;
    startColumn: number;
    startLineNumber: number;
};
/**
 * This method is generally for internal use. The {@link compileScript} method
 * is the recommended API for direct compilation.
 */
export declare const compileScriptRaw: <ProgramState extends AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateMinimum & AuthenticationProgramStateStack<Uint8Array> = AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateMinimum & AuthenticationProgramStateStack<Uint8Array>, CompilationContext = unknown>({ data, configuration, scriptId, }: {
    data: CompilationData<CompilationContext>;
    configuration: CompilerConfiguration<CompilationContext, import("../lib").CompilerOperationsKeysCommon, import("../lib").CompilerOperationsSigningSerializationCommon, false, false, false, false>;
    scriptId: string;
}) => CompilationResult<ProgramState>;
/**
 * Compile an internal script identifier.
 *
 * @remarks
 * If the identifier can be successfully resolved as a script, the script is
 * compiled and returned as a {@link CompilationResultSuccess}. If an error
 * occurs in compiling it, the error is returned as a string.
 *
 * Otherwise, the identifier is not recognized as a script, and this method
 * simply returns `false`.
 */
export declare const resolveScriptIdentifier: <CompilationContext, ProgramState>({ data, configuration, identifier, }: {
    /**
     * The identifier of the script to be resolved
     */
    identifier: string;
    /**
     * The provided {@link CompilationData}
     */
    data: CompilationData<CompilationContext>;
    /**
     * the provided {@link CompilerConfiguration}
     */
    configuration: CompilerConfiguration<CompilationContext, import("../lib").CompilerOperationsKeysCommon, import("../lib").CompilerOperationsSigningSerializationCommon, false, false, false, false>;
}) => string | false | CompilationResultSuccess<ProgramState>;
/**
 * Return an {@link IdentifierResolutionFunction} for use in
 * {@link resolveScriptSegment}.
 *
 * @param scriptId - the `id` of the script for which the resulting
 * `IdentifierResolutionFunction` will be used.
 */
export declare const createIdentifierResolver: <CompilationContext>({ data, configuration, }: {
    /**
     * The actual variable values (private keys, shared wallet data, shared
     * address data, etc.) to use in resolving variables.
     */
    data: CompilationData<CompilationContext>;
    /**
     * A snapshot of the configuration around `scriptId`, see
     * {@link CompilerConfiguration} for details
     */
    configuration: CompilerConfiguration<CompilationContext, import("../lib").CompilerOperationsKeysCommon, import("../lib").CompilerOperationsSigningSerializationCommon, false, false, false, false>;
}) => IdentifierResolutionFunction;
/**
 * This method is generally for internal use. The {@link compileScript} method
 * is the recommended API for direct compilation.
 */
export declare const compileScriptContents: <ProgramState extends AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateStack<Uint8Array> = AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateStack<Uint8Array>, CompilationContext = unknown>({ data, configuration, script, }: {
    script: string;
    data: CompilationData<CompilationContext>;
    configuration: CompilerConfiguration<CompilationContext, import("../lib").CompilerOperationsKeysCommon, import("../lib").CompilerOperationsSigningSerializationCommon, false, false, false, false>;
}) => CompilationResult<ProgramState>;
//# sourceMappingURL=resolve.d.ts.map