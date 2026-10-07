/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import test from 'ava';

import { binToHex, opReverseBytes, opSplit } from '../../../lib.js';

/** A state with every metric field the tested operations may read. */
const makeState = (stack: Uint8Array[]): any => ({
  alternateStack: [],
  controlStack: [],
  error: undefined,
  functionCount: 0,
  functionTable: {},
  instructions: [],
  ip: 0,
  lastCodeSeparator: -1,
  metrics: {
    arithmeticCost: 0,
    definedFunctions: 0,
    densityControlLength: 100,
    evaluatedInstructionCount: 0,
    hashDigestIterations: 0,
    maximumHashDigestIterations: 1_000_000,
    maximumOperationCost: 1_000_000,
    maximumSignatureCheckCount: 1_000_000,
    operationCost: 0,
    signatureCheckCount: 0,
    stackPushedBytes: 0,
  },
  operationCount: 0,
  signedMessages: [],
  stack,
});

test('OP_SPLIT returns views of the split item', (t) => {
  const x = Uint8Array.of(1, 2, 3);
  const state = makeState([x, Uint8Array.of(2)]);
  opSplit(state);
  const [a, b] = state.stack as [Uint8Array, Uint8Array];
  t.is(a.buffer, x.buffer, 'OP_SPLIT first half views the parent');
  t.is(b.buffer, x.buffer, 'OP_SPLIT second half views the parent');
  t.is(a.byteOffset, 0);
  t.is(a.length, 2);
  t.is(b.byteOffset, 2);
  t.is(b.length, 1);
});

test('OP_SPLIT: transforming one half leaves the other half and the item', (t) => {
  const parent = Uint8Array.from({ length: 32 }, (_, i) => (i * 131 + 7) % 256);
  const index = 3;
  const state = makeState([parent, Uint8Array.of(index)]);
  opSplit(state);
  const [a, b] = state.stack as [Uint8Array, Uint8Array];
  const pristineParent = parent.slice();
  const pristineA = a.slice();
  const pristineB = b.slice();

  // transforms the top half (b)
  opReverseBytes(state);

  t.is(binToHex(a), binToHex(pristineA), 'bottom half unchanged');
  t.is(binToHex(b), binToHex(pristineB), 'top half unchanged');
  t.is(binToHex(parent), binToHex(pristineParent), 'parent unchanged');
});
