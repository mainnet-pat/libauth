import type { AnyCompilerConfiguration, AuthenticationProgramCommon, AuthenticationProgramStateCommon, AuthenticationVirtualMachine, CompilationContext, Compiler, Input, Output, ResolvedTransactionCommon, TransactionCommon } from '../../../../lib';
export declare type ResolvedTransactionBCH = ResolvedTransactionCommon;
export declare type ResolvedTransaction = ResolvedTransactionBCH;
export declare type AuthenticationProgramBCH = AuthenticationProgramCommon;
export declare type AuthenticationProgram = AuthenticationProgramBCH;
export declare type AuthenticationProgramStateBCH = AuthenticationProgramStateCommon;
export declare type AuthenticationProgramState = AuthenticationProgramStateBCH;
export declare type AuthenticationVirtualMachineBCH = AuthenticationVirtualMachine<ResolvedTransactionBCH, AuthenticationProgramBCH, AuthenticationProgramStateBCH>;
export declare type TransactionBCH<InputType = Input, OutputType = Output> = TransactionCommon<InputType, OutputType>;
export declare type Transaction<InputType = Input, OutputType = Output> = TransactionBCH<InputType, OutputType>;
export declare type CompilationContextBCH = CompilationContext<TransactionBCH<Input<Uint8Array | undefined>>>;
export declare type CompilerBCH = Compiler<CompilationContextBCH, AnyCompilerConfiguration<CompilationContextBCH>, AuthenticationProgramStateBCH>;
export declare const createTestAuthenticationProgramBCH: ({ lockingBytecode, valueSatoshis, unlockingBytecode, }: Output & Pick<Input, 'unlockingBytecode'>) => {
    inputIndex: number;
    sourceOutputs: Output<Uint8Array, Uint8Array>[];
    transaction: TransactionBCH<Input<Uint8Array, Uint8Array>, Output<Uint8Array, Uint8Array>>;
};
//# sourceMappingURL=bch-2022-types.d.ts.map