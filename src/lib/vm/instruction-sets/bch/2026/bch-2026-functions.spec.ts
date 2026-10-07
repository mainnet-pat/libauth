import test from 'ava';

import type { AuthenticationProgramStateBch2026 } from '../../../../lib.js';
import {
  createInstructionSetBch2026,
  createVirtualMachine,
  decodeAuthenticationInstructions,
  encodeDataPush,
  flattenBinArray,
  isFunctionTableShared,
} from '../../../../lib.js';

import { OpcodesBch2026 } from './bch-2026-opcodes.js';

const vm = createVirtualMachine(createInstructionSetBch2026());

/** A state ready to evaluate the given definitions (each body is OP_1). */
const defineState = (ids: number[]) => {
  const program = {
    inputIndex: 0,
    transaction: { inputs: [{ unlockingBytecode: new Uint8Array() }] },
  };
  const instructions = decodeAuthenticationInstructions(
    flattenBinArray(
      ids.flatMap((id) => [
        encodeDataPush(Uint8Array.of(OpcodesBch2026.OP_1)),
        encodeDataPush(Uint8Array.of(id)),
        Uint8Array.of(OpcodesBch2026.OP_DEFINE),
      ]),
    ),
  );
  return {
    ...vm.stateInitialize(program as never),
    error: undefined,
    instructions,
    ip: 0,
    stack: [],
  } as AuthenticationProgramStateBch2026;
};

test('stateDebug: each snapshot keeps the function table of its step', (t) => {
  const trace = vm.stateDebug(defineState([1, 2, 3]));
  t.deepEqual(
    trace.map((state) => Object.keys(state.functionTable).length),
    [0, 0, 0, 1, 1, 1, 2, 2, 2, 3],
  );
});

test('OP_DEFINE: a cloned state and its source keep separate definitions', (t) => {
  const source = vm.stateEvaluate(defineState([1]));
  const clone = vm.stateClone(source);
  t.is(clone.functionTable, source.functionTable, 'the clone shares the table');
  t.true(isFunctionTableShared(source.functionTable));

  const continueWith = (state: AuthenticationProgramStateBch2026, id: number) =>
    vm.stateEvaluate({
      ...state,
      instructions: defineState([id]).instructions,
      ip: 0,
    });
  const fromClone = continueWith(clone, 2);
  const fromSource = continueWith(source, 3);
  t.deepEqual(Object.keys(source.functionTable), ['01']);
  t.deepEqual(Object.keys(fromClone.functionTable).sort(), ['01', '02']);
  t.deepEqual(Object.keys(fromSource.functionTable).sort(), ['01', '03']);
});

test('OP_DEFINE: copies a shared table once, then defines in place', (t) => {
  const state = vm.stateClone(defineState([1, 2, 3]));
  t.true(isFunctionTableShared(state.functionTable));
  // Each definition is three instructions: two pushes, then OP_DEFINE.
  const defineNext = () => {
    vm.stateStepMutate(state);
    vm.stateStepMutate(state);
    vm.stateStepMutate(state);
    return state.functionTable;
  };
  const afterFirst = defineNext();
  t.false(isFunctionTableShared(afterFirst));
  t.is(defineNext(), afterFirst);
  t.is(defineNext(), afterFirst);
  t.deepEqual(Object.keys(state.functionTable), ['01', '02', '03']);
});

test('OP_DEFINE stores a compact copy of a split function body', (t) => {
  // <0x515253> <1> OP_SPLIT OP_NIP <1> OP_DEFINE: the body is the view 0x5253
  const final = vm.stateEvaluate({
    ...defineState([]),
    instructions: decodeAuthenticationInstructions(
      flattenBinArray([
        encodeDataPush(Uint8Array.of(0x51, 0x52, 0x53)),
        encodeDataPush(Uint8Array.of(1)),
        Uint8Array.of(OpcodesBch2026.OP_SPLIT, OpcodesBch2026.OP_NIP),
        encodeDataPush(Uint8Array.of(1)),
        Uint8Array.of(OpcodesBch2026.OP_DEFINE),
      ]),
    ),
  });
  t.is(final.error, undefined);
  const body = final.functionTable['01'];
  t.deepEqual(body, Uint8Array.of(0x52, 0x53));
  t.is(body?.byteLength, body?.buffer.byteLength, 'the body owns its buffer');
});
