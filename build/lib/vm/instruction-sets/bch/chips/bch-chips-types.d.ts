import type { AuthenticationInstruction, AuthenticationProgramBCH, AuthenticationProgramCommon, AuthenticationProgramStateAlternateStack, AuthenticationProgramStateCodeSeparator, AuthenticationProgramStateControlStack, AuthenticationProgramStateError, AuthenticationProgramStateMinimum, AuthenticationProgramStateSignatureAnalysis, AuthenticationProgramStateStack, AuthenticationProgramStateTransactionContext, AuthenticationVirtualMachine, ResolvedTransactionBCH } from '../../../../lib';
/**
 * Consensus settings for the `BCH_CHIPs` instruction set.
 */
export declare enum ConsensusBCHCHIPs {
    maximumTransactionVersion = 2,
    bannedTransactionSize = 64,
    maximumHashDigestIterations = 660
}
export declare type AuthenticationProgramStateControlStackCHIPs = AuthenticationProgramStateControlStack<boolean | number>;
export interface AuthenticationProgramStateResourceLimitsBCHCHIPs {
    /**
     * An unsigned integer counter used by `OP_UNTIL` to prevent excessive use of
     * loops.
     */
    repeatedBytes: number;
    /**
     * An unsigned integer counter use to count the total number of hash digest
     * iterations that required during this evaluation.
     */
    hashDigestIterations: number;
}
export interface AuthenticationProgramStateBCHCHIPs extends AuthenticationProgramStateMinimum, AuthenticationProgramStateStack, AuthenticationProgramStateAlternateStack, AuthenticationProgramStateControlStackCHIPs, AuthenticationProgramStateError, AuthenticationProgramStateCodeSeparator, AuthenticationProgramStateSignatureAnalysis, AuthenticationProgramStateTransactionContext, AuthenticationProgramStateResourceLimitsBCHCHIPs {
}
export declare type AuthenticationVirtualMachineBCHCHIPs = AuthenticationVirtualMachine<ResolvedTransactionBCH, AuthenticationProgramBCH, AuthenticationProgramStateBCHCHIPs>;
export declare const cloneAuthenticationProgramStateBCHCHIPs: <State extends AuthenticationProgramStateBCHCHIPs>(state: Readonly<State>) => {
    alternateStack: Uint8Array[];
    controlStack: (number | boolean)[];
    hashDigestIterations: State["hashDigestIterations"];
    instructions: AuthenticationInstruction[];
    ip: State["ip"];
    lastCodeSeparator: State["lastCodeSeparator"];
    program: {
        inputIndex: number;
        sourceOutputs: {
            valueSatoshis: bigint;
            token?: {
                nft?: {
                    capability: "none" | "mutable" | "minting";
                    commitment: Uint8Array;
                } | undefined;
                amount: bigint;
                category: Uint8Array;
            } | undefined;
            lockingBytecode: Uint8Array;
        }[];
        transaction: {
            inputs: {
                outpointIndex: number;
                outpointTransactionHash: Uint8Array;
                sequenceNumber: number;
                unlockingBytecode: Uint8Array;
            }[];
            locktime: number;
            outputs: {
                valueSatoshis: bigint;
                token?: {
                    nft?: {
                        capability: "none" | "mutable" | "minting";
                        commitment: Uint8Array;
                    } | undefined;
                    amount: bigint;
                    category: Uint8Array;
                } | undefined;
                lockingBytecode: Uint8Array;
            }[];
            version: number;
        };
    };
    repeatedBytes: State["repeatedBytes"];
    signedMessages: ({
        serialization: Uint8Array;
        digest: Uint8Array;
    } | {
        message: Uint8Array;
        digest: Uint8Array;
    })[];
    stack: Uint8Array[];
    error?: State["error"] | undefined;
};
export declare const createAuthenticationProgramStateBCHCHIPs: ({ program, instructions, stack, }: {
    program: Readonly<AuthenticationProgramCommon>;
    instructions: readonly AuthenticationInstruction[];
    stack: Uint8Array[];
}) => AuthenticationProgramStateBCHCHIPs;
//# sourceMappingURL=bch-chips-types.d.ts.map