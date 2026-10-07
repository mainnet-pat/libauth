/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import test from 'ava';

import {
  binToHex,
  op2Dup,
  op2Over,
  op3Dup,
  opAnd,
  opBin2Num,
  opCat,
  opDup,
  opHash160,
  opHash256,
  opIfDup,
  opNum2Bin,
  opOr,
  opOver,
  opPick,
  opReverseBytes,
  opRipemd160,
  opSha1,
  opSha256,
  opTuck,
  opXor,
} from '../../../lib.js';
import {
  createOpLShiftNum,
  createOpRShiftNum,
  opInvert,
  opLShiftBin,
  opRShiftBin,
} from '../bch/2026/bch-2026-bitwise.js';

const item = Uint8Array.from({ length: 32 }, (_, i) => (i * 131 + 7) % 256);
const operand = Uint8Array.from({ length: 32 }, (_, i) => (i * 17 + 3) % 256);
// minimal VM number 2
const number = Uint8Array.of(2);
const bitCount = Uint8Array.of(1);

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

test('duplicating operations push references to the existing items', (t) => {
  const x = Uint8Array.of(1, 2, 3);
  const y = Uint8Array.of(4, 5, 6);
  const z = Uint8Array.of(7, 8, 9);

  t.is(opDup(makeState([x])).stack[1], x, 'OP_DUP pushes the same reference');
  const dup2 = op2Dup(makeState([x, y])).stack;
  t.is(dup2[2], x, 'OP_2DUP reuses the first item');
  t.is(dup2[3], y, 'OP_2DUP reuses the second item');
  const dup3 = op3Dup(makeState([x, y, z])).stack;
  t.is(dup3[3], x);
  t.is(dup3[4], y);
  t.is(dup3[5], z);
  t.is(opOver(makeState([x, y])).stack[2], x, 'OP_OVER reuses the item');
  const over2 = op2Over(makeState([x, y, z, x])).stack;
  t.is(over2[4], x);
  t.is(over2[5], y);
  const tuck = opTuck(makeState([x, y])).stack;
  t.is(tuck[0], y);
  t.is(tuck[2], y);
  const ifdup = opIfDup(makeState([Uint8Array.of(1)])).stack;
  t.is(ifdup[0], ifdup[1], 'OP_IFDUP pushes the same reference when truthy');
  const pick = opPick(makeState([x, new Uint8Array()])).stack;
  t.is(pick[1], x, 'OP_PICK pushes the picked item by reference');
});

test('transforming operations leave aliased inputs unchanged', (t) => {
  const cases: {
    name: string;
    run: (state: any) => unknown;
    stack: Uint8Array[];
  }[] = [
    {
      name: 'OP_REVERSEBYTES',
      run: (s) => opReverseBytes(s),
      stack: [item, item],
    },
    { name: 'OP_INVERT', run: (s) => opInvert(s), stack: [item, item] },
    { name: 'OP_SHA1', run: (s) => opSha1()(s), stack: [item, item] },
    { name: 'OP_SHA256', run: (s) => opSha256()(s), stack: [item, item] },
    { name: 'OP_HASH160', run: (s) => opHash160()(s), stack: [item, item] },
    { name: 'OP_HASH256', run: (s) => opHash256()(s), stack: [item, item] },
    { name: 'OP_RIPEMD160', run: (s) => opRipemd160()(s), stack: [item, item] },
    { name: 'OP_BIN2NUM', run: (s) => opBin2Num(s), stack: [number, number] },
    {
      name: 'OP_NUM2BIN',
      run: (s) => opNum2Bin(s),
      stack: [number, number, Uint8Array.of(4)],
    },
    { name: 'OP_CAT', run: (s) => opCat(s), stack: [item, item, operand] },
    { name: 'OP_AND', run: (s) => opAnd(s), stack: [item, item, operand] },
    { name: 'OP_OR', run: (s) => opOr(s), stack: [item, item, operand] },
    { name: 'OP_XOR', run: (s) => opXor(s), stack: [item, item, operand] },
    {
      name: 'OP_LSHIFTBIN',
      run: (s) => opLShiftBin(s),
      stack: [item, item, bitCount],
    },
    {
      name: 'OP_RSHIFTBIN',
      run: (s) => opRShiftBin(s),
      stack: [item, item, bitCount],
    },
    {
      name: 'OP_LSHIFTNUM',
      run: (s) => createOpLShiftNum()(s),
      stack: [number, number, bitCount],
    },
    {
      name: 'OP_RSHIFTNUM',
      run: (s) => createOpRShiftNum()(s),
      stack: [number, number, bitCount],
    },
  ];

  cases.forEach(({ name, run, stack }) => {
    const pristine = stack[0]!.slice();
    const state = makeState(stack);
    run(state);
    t.is(binToHex(stack[0]!), binToHex(pristine), `${name} leaves its input`);
  });
});
