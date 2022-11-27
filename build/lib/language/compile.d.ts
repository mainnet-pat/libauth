import type { AuthenticationProgramStateControlStack, AuthenticationProgramStateMinimum, AuthenticationProgramStateStack, CompilationContextBCH, CompilationContextCommon, CompilationData, CompilationResult, CompilerConfiguration } from '../lib';
/**
 * Parse, resolve, and reduce the selected script using the provided `data` and
 * `configuration`.
 *
 * Note, locktime validation only occurs if `compilationContext` is provided in
 * the configuration.
 */
export declare const compileScript: <ProgramState extends AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateMinimum & AuthenticationProgramStateStack<Uint8Array> = AuthenticationProgramStateControlStack<boolean> & AuthenticationProgramStateMinimum & AuthenticationProgramStateStack<Uint8Array>, CompilationContext extends CompilationContextCommon = CompilationContextBCH>(scriptId: string, data: CompilationData<CompilationContext>, configuration: CompilerConfiguration<CompilationContext, import("../lib").CompilerOperationsKeysCommon, import("../lib").CompilerOperationsSigningSerializationCommon, false, false, false, false>) => CompilationResult<ProgramState>;
//# sourceMappingURL=compile.d.ts.map