import type { AuthenticationProgramStateError } from '../../../lib';
export declare const opNop: <State>(state: State) => State;
export declare const opNopDisallowed: <State>(state: State) => State;
/**
 * "Disabled" operations are explicitly forbidden from occurring anywhere in VM
 * bytecode, even within an unexecuted branch.
 */
export declare const disabledOperation: <State extends AuthenticationProgramStateError>(state: State) => State;
//# sourceMappingURL=nop.d.ts.map