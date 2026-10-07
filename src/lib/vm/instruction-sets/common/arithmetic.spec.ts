import test from 'ava';

import type {
  AuthenticationProgramStateBch2026,
  InstructionSet,
} from '../../../lib.js';
import {
  AuthenticationErrorCommon,
  bigIntToVmNumber,
  binToHex,
  createInstructionSetBch2026,
  createOpAdd,
  createVirtualMachine,
  decodeAuthenticationInstructions,
  encodeDataPush,
  flattenBinArray,
  VmNumberError,
} from '../../../lib.js';

const enum Opcodes {
  OP_1ADD = 0x8b,
  OP_NEGATE = 0x8f,
  OP_ADD = 0x93,
  OP_MUL = 0x95,
  OP_WITHIN = 0xa5,
}

/**
 * Evaluate `script`: bigints are pushed as minimally-encoded VM Numbers, byte
 * arrays are pushed as-is, and numbers are opcodes.
 */
const evaluate = (
  instructionSet: InstructionSet<never, never, never>,
  script: (Uint8Array | bigint | number)[],
) => {
  const vm = createVirtualMachine(
    instructionSet as unknown as ReturnType<typeof createInstructionSetBch2026>,
  );
  const program = {
    inputIndex: 0,
    transaction: { inputs: [{ unlockingBytecode: new Uint8Array() }] },
  } as never;
  const initial = vm.stateInitialize(program);
  const instructions = decodeAuthenticationInstructions(
    flattenBinArray(
      script.map((part) =>
        typeof part === 'bigint'
          ? encodeDataPush(bigIntToVmNumber(part))
          : typeof part === 'number'
            ? Uint8Array.of(part)
            : encodeDataPush(part),
      ),
    ),
  );
  const final = vm.stateEvaluate({
    ...initial,
    error: undefined,
    instructions,
    ip: 0,
    program,
    stack: [],
  } as AuthenticationProgramStateBch2026);
  return {
    arithmeticCost: final.metrics.arithmeticCost,
    error: final.error,
    stack: final.stack.map(binToHex).join(','),
  };
};

const bch2026 = createInstructionSetBch2026() as unknown as InstructionSet<
  never,
  never,
  never
>;

test('short-operand arithmetic: results and costs at the fast path edges', (t) => {
  const vectors: [(Uint8Array | bigint | number)[], string, number][] = [
    // a sum of two 31-bit magnitudes needs 5 bytes
    [[2147483647n, 2147483647n, Opcodes.OP_ADD], 'feffffff00', 5],
    [[-2147483647n, 2147483647n, Opcodes.OP_ADD], '', 0],
    // products up to 2^53 - 1 are exact in Number arithmetic...
    [[94906265n, 94906265n, Opcodes.OP_MUL], '71f9eff8ffff1f', 23],
    [[-94906265n, 94906265n, Opcodes.OP_MUL], '71f9eff8ffff9f', 23],
    // ...and larger products are computed as bigints
    [[94906266n, 94906266n, Opcodes.OP_MUL], 'a4484004000020', 23],
    [[2147483647n, 2147483647n, Opcodes.OP_MUL], '01000000ffffff3f', 24],
    // a negative zero result is encoded as zero
    [[0n, -5n, Opcodes.OP_MUL], '', 0],
    [[0n, Opcodes.OP_NEGATE], '', 0],
    [[5n, Opcodes.OP_NEGATE], '85', 1],
    [[5n, 0n, 10n, Opcodes.OP_WITHIN], '01', 0],
  ];
  vectors.forEach(([script, stack, arithmeticCost]) => {
    t.deepEqual(evaluate(bch2026, script), {
      arithmeticCost,
      error: undefined,
      stack,
    });
  });
});

test('short-operand arithmetic: errors match the bigint operations', (t) => {
  const nonMinimalOne = Uint8Array.of(1, 0);
  const nonMinimal = evaluate(bch2026, [nonMinimalOne, Opcodes.OP_1ADD]);
  t.true(nonMinimal.error?.includes(AuthenticationErrorCommon.invalidVmNumber));
  t.true(nonMinimal.error?.includes(VmNumberError.requiresMinimal));

  // With a 4-byte limit, a sum of two 4-byte numbers can overflow.
  const vm = createVirtualMachine(createInstructionSetBch2026());
  const state = vm.stateInitialize({
    inputIndex: 0,
    transaction: { inputs: [{ unlockingBytecode: new Uint8Array() }] },
  } as never);
  const overflow = createOpAdd({ maximumVmNumberByteLength: 4 })({
    ...state,
    stack: [bigIntToVmNumber(2147483647n), bigIntToVmNumber(1n)],
  } as AuthenticationProgramStateBch2026);
  t.true(
    overflow.error?.includes(AuthenticationErrorCommon.overflowsVmNumberRange),
  );
});
