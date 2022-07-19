import test from 'ava';
import { fc, testProp } from 'ava-fast-check';

import {
  bigIntToBinUint256BEClamped,
  bigIntToBinUint64LE,
  bigIntToBinUint64LEClamped,
  bigIntToBinUintLE,
  bigIntToCompactSize,
  binToBigIntUint256BE,
  binToBigIntUint64LE,
  binToBigIntUintBE,
  binToBigIntUintLE,
  binToHex,
  binToNumberInt16LE,
  binToNumberInt32LE,
  binToNumberUint16LE,
  binToNumberUint32LE,
  binToNumberUintLE,
  hexToBin,
  numberToBinInt16LE,
  numberToBinInt32LE,
  numberToBinInt32TwosCompliment,
  numberToBinUint16BE,
  numberToBinUint16LE,
  numberToBinUint16LEClamped,
  numberToBinUint32BE,
  numberToBinUint32LE,
  numberToBinUint32LEClamped,
  numberToBinUintLE,
  compactSizePrefixToSize,
  compactSizeToBigInt,
} from '../lib.js';

test('numberToBinUint16LE', (t) => {
  t.deepEqual(numberToBinUint16LE(0), Uint8Array.from([0, 0]));
  t.deepEqual(numberToBinUint16LE(1), Uint8Array.from([1, 0]));
  t.deepEqual(numberToBinUint16LE(0x1234), Uint8Array.from([0x34, 0x12]));
});

test('numberToBinUint16BE', (t) => {
  t.deepEqual(numberToBinUint16BE(0), Uint8Array.from([0, 0]));
  t.deepEqual(numberToBinUint16BE(1), Uint8Array.from([0, 1]));
  t.deepEqual(numberToBinUint16BE(0x1234), Uint8Array.from([0x12, 0x34]));
});

test('numberToBinUint16LE vs. numberToBinUint16LEClamped: behavior on overflow', (t) => {
  t.deepEqual(
    numberToBinUint16LE(0x01_0000),
    numberToBinUint16LE(0x01_0000 % (0xffff + 1))
  );
  t.deepEqual(
    numberToBinUint16LEClamped(0x01_0000),
    Uint8Array.from([0xff, 0xff])
  );
});

test('numberToBinUint16LE vs. numberToBinUint16LEClamped: behavior on negative numbers', (t) => {
  t.deepEqual(numberToBinUint16LE(-2), numberToBinUint16LE(0xffff - 1));
  t.deepEqual(numberToBinUint16LEClamped(-2), Uint8Array.from([0, 0]));
});

test('numberToBinUint32LE', (t) => {
  t.deepEqual(numberToBinUint32LE(0), Uint8Array.from([0, 0, 0, 0]));
  t.deepEqual(numberToBinUint32LE(1), Uint8Array.from([1, 0, 0, 0]));
  t.deepEqual(numberToBinUint32LE(0x1234), Uint8Array.from([0x34, 0x12, 0, 0]));
  t.deepEqual(
    numberToBinUint32LE(0x12345678),
    Uint8Array.from([0x78, 0x56, 0x34, 0x12])
  );
});

test('numberToBinUint32BE', (t) => {
  t.deepEqual(numberToBinUint32BE(0), Uint8Array.from([0, 0, 0, 0]));
  t.deepEqual(numberToBinUint32BE(1), Uint8Array.from([0, 0, 0, 1]));
  t.deepEqual(numberToBinUint32BE(0x1234), Uint8Array.from([0, 0, 0x12, 0x34]));
  t.deepEqual(
    numberToBinUint32BE(0x12345678),
    Uint8Array.from([0x12, 0x34, 0x56, 0x78])
  );
});

test('numberToBinUint32LE vs. numberToBinUint32LEClamped: behavior on overflow', (t) => {
  t.deepEqual(
    numberToBinUint32LE(0x01_0000_0000),
    numberToBinUint32LE(0x01_0000_0000 % (0xffffffff + 1))
  );
  t.deepEqual(
    numberToBinUint32LEClamped(0x01_0000_0000),
    Uint8Array.from([0xff, 0xff, 0xff, 0xff])
  );
});

test('numberToBinUint32LE: behavior on negative numbers', (t) => {
  t.deepEqual(numberToBinUint32LE(-2), numberToBinUint32LE(0xffffffff - 1));
  t.deepEqual(numberToBinUint32LEClamped(-2), Uint8Array.from([0, 0, 0, 0]));
});

test('numberToBinUintLE', (t) => {
  t.deepEqual(
    numberToBinUintLE(Number.MAX_SAFE_INTEGER),
    Uint8Array.from([255, 255, 255, 255, 255, 255, 31])
  );
});

test('numberToBinInt16LE', (t) => {
  t.deepEqual(numberToBinInt16LE(0), Uint8Array.from([0, 0]));
  t.deepEqual(numberToBinInt16LE(1), Uint8Array.from([1, 0]));
  t.deepEqual(numberToBinInt16LE(0x1234), Uint8Array.from([0x34, 0x12]));
  t.deepEqual(numberToBinInt16LE(-0x1234), Uint8Array.from([0xcc, 0xed]));
});

test('numberToBinInt32LE', (t) => {
  t.deepEqual(numberToBinInt32LE(0), Uint8Array.from([0, 0, 0, 0]));
  t.deepEqual(numberToBinInt32LE(1), Uint8Array.from([1, 0, 0, 0]));
  t.deepEqual(numberToBinInt32LE(0x1234), Uint8Array.from([0x34, 0x12, 0, 0]));
  t.deepEqual(
    numberToBinInt32LE(-0x1234),
    Uint8Array.from([0xcc, 0xed, 0xff, 0xff])
  );
  t.deepEqual(
    numberToBinUint32LE(0x12345678),
    Uint8Array.from([0x78, 0x56, 0x34, 0x12])
  );
  t.deepEqual(
    numberToBinInt32LE(-0x12345678),
    Uint8Array.from([0x88, 0xa9, 0xcb, 0xed])
  );
});

test('numberToBinInt32TwosCompliment', (t) => {
  t.deepEqual(numberToBinInt32TwosCompliment(0), Uint8Array.from([0, 0, 0, 0]));
  t.deepEqual(numberToBinInt32TwosCompliment(1), Uint8Array.from([1, 0, 0, 0]));
  t.deepEqual(
    numberToBinInt32TwosCompliment(-0xffffffff),
    Uint8Array.from([1, 0, 0, 0])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(0xffffffff),
    Uint8Array.from([255, 255, 255, 255])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(-1),
    Uint8Array.from([255, 255, 255, 255])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(0xffff),
    Uint8Array.from([255, 255, 0, 0])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(-0xffff),
    Uint8Array.from([1, 0, 255, 255])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(1234567890),
    Uint8Array.from([210, 2, 150, 73])
  );
  t.deepEqual(
    numberToBinInt32TwosCompliment(-1234567890),
    Uint8Array.from([46, 253, 105, 182])
  );
});

test('bigIntToBinUint64LE', (t) => {
  t.deepEqual(
    bigIntToBinUint64LE(0n),
    Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0])
  );
  t.deepEqual(
    bigIntToBinUint64LE(0x01n),
    Uint8Array.from([0x01, 0, 0, 0, 0, 0, 0, 0])
  );
  t.deepEqual(
    bigIntToBinUint64LE(0x12345678n),
    Uint8Array.from([0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0])
  );
  t.deepEqual(
    bigIntToBinUint64LE(BigInt(Number.MAX_SAFE_INTEGER)),
    Uint8Array.from([255, 255, 255, 255, 255, 255, 31, 0])
  );
  t.deepEqual(
    bigIntToBinUint64LE(0xffffffffffffffffn),
    Uint8Array.from([255, 255, 255, 255, 255, 255, 255, 255])
  );
});

test('bigIntToBinUint64LE vs. bigIntToBinUint64LEClamped: behavior on overflow', (t) => {
  t.deepEqual(
    bigIntToBinUint64LE(0x010000000000000000n),
    bigIntToBinUint64LE(0x010000000000000000n % (0xffffffffffffffffn + 1n))
  );
  t.deepEqual(
    bigIntToBinUint64LEClamped(0x010000000000000000n),
    Uint8Array.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
  );
});

test('bigIntToBinUint64LE vs. bigIntToBinUint64LEClamped: behavior on negative numbers', (t) => {
  t.deepEqual(
    bigIntToBinUint64LE(-1n),
    Uint8Array.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
  );
  t.deepEqual(
    bigIntToBinUint64LEClamped(-1n),
    Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0])
  );
});

test('bigIntToCompactSize: larger values return modulo result after opcode', (t) => {
  t.deepEqual(
    bigIntToCompactSize(0x010000000000000001n),
    Uint8Array.from([0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  );
});

test('binToNumberUintLE', (t) => {
  t.deepEqual(binToNumberUintLE(Uint8Array.from([0x12])), 0x12);
  t.deepEqual(binToNumberUintLE(Uint8Array.from([0x34, 0x12])), 0x1234);
  t.deepEqual(
    binToNumberUintLE(Uint8Array.from([0x78, 0x56, 0x34, 0x12])),
    0x12345678
  );
  t.deepEqual(
    binToNumberUintLE(Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12])),
    0x1234567890
  );
  t.deepEqual(
    binToNumberUintLE(Uint8Array.from([255, 255, 255, 255, 255, 255, 31])),
    Number.MAX_SAFE_INTEGER
  );
  t.deepEqual(binToNumberUintLE(Uint8Array.from([0x56, 0x34, 0x12])), 0x123456);
  const data = Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12]);
  const view = data.subarray(2);
  t.deepEqual(binToNumberUintLE(view), 0x123456);
  t.throws(() => {
    binToNumberUintLE(Uint8Array.of(0x12), 2);
  });
});

testProp(
  '[fast-check] numberToBinUintLE <-> binToNumberUintLE',
  [fc.integer({ max: Number.MAX_SAFE_INTEGER, min: 0 })],
  (t, maxSafeInt) =>
    t.deepEqual(binToNumberUintLE(numberToBinUintLE(maxSafeInt)), maxSafeInt)
);

test('binToNumberUint16LE', (t) => {
  t.deepEqual(binToNumberUint16LE(Uint8Array.from([0x34, 0x12])), 0x1234);
  const data = Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12, 0x00]);
  const view = data.subarray(2, 4);
  t.deepEqual(binToNumberUint16LE(view), 0x3456);
});

test('binToNumberInt16LE', (t) => {
  t.deepEqual(binToNumberInt16LE(Uint8Array.from([0x34, 0x12])), 0x1234);
  t.deepEqual(binToNumberInt16LE(Uint8Array.from([0xcc, 0xed])), -0x1234);
});

test('binToNumberInt32LE', (t) => {
  t.deepEqual(
    binToNumberInt32LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12])),
    0x12345678
  );

  t.deepEqual(
    binToNumberInt32LE(Uint8Array.from([0x88, 0xa9, 0xcb, 0xed])),
    -0x12345678
  );
});

test('binToNumberUint16LE: ignores bytes after the 2nd', (t) => {
  t.deepEqual(
    binToNumberUint16LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12, 0xff])),
    0x5678
  );
});

test('binToNumberUint32LE', (t) => {
  t.deepEqual(
    binToNumberUint32LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12])),
    0x12345678
  );
  const data = Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12, 0x00]);
  const view = data.subarray(2);
  t.deepEqual(binToNumberUint32LE(view), 0x123456);
});

test('binToNumberUint32LE: ignores bytes after the 4th', (t) => {
  t.deepEqual(
    binToNumberUint32LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12, 0xff])),
    0x12345678
  );
});

test('binToBigIntUintBE', (t) => {
  t.deepEqual(binToBigIntUintBE(Uint8Array.from([0x12])), 0x12n);
  t.deepEqual(binToBigIntUintBE(Uint8Array.from([0x12, 0x34])), 0x1234n);
  t.deepEqual(
    binToBigIntUintBE(Uint8Array.from([0x12, 0x34, 0x56])),
    0x123456n
  );
  t.deepEqual(
    binToBigIntUintBE(Uint8Array.from([0x12, 0x34, 0x56, 0x78])),
    0x12345678n
  );
  t.deepEqual(
    binToBigIntUintBE(Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x90])),
    0x1234567890n
  );
  t.deepEqual(
    binToBigIntUintBE(
      Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef])
    ),
    0x1234567890abcdefn
  );
  t.deepEqual(
    binToBigIntUintBE(Uint8Array.from([0x56, 0x78, 0x90, 0xab, 0xcd, 0xef])),
    0x567890abcdefn
  );
  const d = Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]);
  const view = d.subarray(2);
  t.deepEqual(binToBigIntUintBE(view), 0x567890abcdefn);
  t.throws(() => {
    binToBigIntUintBE(Uint8Array.of(0x12), 2);
  });
});

test('binToBigIntUint256BE and bigIntToBinUint256BEClamped', (t) => {
  t.deepEqual(binToBigIntUint256BE(new Uint8Array(32)), 0n);
  t.deepEqual(bigIntToBinUint256BEClamped(0n), new Uint8Array(32));
  t.deepEqual(bigIntToBinUint256BEClamped(-1n), new Uint8Array(32));
  const secp256k1OrderNHex =
    'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141';
  const secp256k1OrderNBin = hexToBin(secp256k1OrderNHex);
  const secp256k1OrderN = BigInt(`0x${secp256k1OrderNHex}`);
  t.deepEqual(binToBigIntUint256BE(secp256k1OrderNBin), secp256k1OrderN);
  t.deepEqual(bigIntToBinUint256BEClamped(secp256k1OrderN), secp256k1OrderNBin);
  const max = new Uint8Array(32);
  max.fill(255);
  const overMax = new Uint8Array(33);

  overMax[0] = 255;
  t.deepEqual(
    bigIntToBinUint256BEClamped(BigInt(`0x${binToHex(overMax)}`)),
    max
  );
});

testProp(
  '[fast-check] binToBigIntUint256BE <-> bigIntToBinUint256BEClamped',
  [fc.bigUintN(256)],
  (t, uint256) =>
    t.deepEqual(
      binToBigIntUint256BE(bigIntToBinUint256BEClamped(uint256)),
      uint256
    )
);

test('binToBigIntUintLE', (t) => {
  t.deepEqual(binToBigIntUintLE(Uint8Array.from([0x12])), 0x12n);
  t.deepEqual(binToBigIntUintLE(Uint8Array.from([0x34, 0x12])), 0x1234n);
  t.deepEqual(
    binToBigIntUintLE(Uint8Array.from([0x56, 0x34, 0x12])),
    0x123456n
  );
  t.deepEqual(
    binToBigIntUintLE(Uint8Array.from([0x78, 0x56, 0x34, 0x12])),
    0x12345678n
  );
  t.deepEqual(
    binToBigIntUintLE(Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12])),
    0x1234567890n
  );
  t.deepEqual(
    binToBigIntUintLE(
      Uint8Array.from([0xef, 0xcd, 0xab, 0x90, 0x78, 0x56, 0x34, 0x12])
    ),
    0x1234567890abcdefn
  );
  t.deepEqual(
    binToBigIntUintLE(Uint8Array.from([0xab, 0x90, 0x78, 0x56, 0x34, 0x12])),
    0x1234567890abn
  );
  const d = Uint8Array.from([0xef, 0xcd, 0xab, 0x90, 0x78, 0x56, 0x34, 0x12]);
  const view = d.subarray(2);
  t.deepEqual(binToBigIntUintLE(view), 0x1234567890abn);
  t.throws(() => {
    binToBigIntUintLE(Uint8Array.of(0x12), 2);
  });
});

testProp(
  '[fast-check] bigIntToBinUintLE <-> binToBigIntUintBE -> reverse',
  [fc.bigUintN(256)],
  (t, uint256) => {
    const bin = bigIntToBinUintLE(uint256);
    const binReverse = bin.slice().reverse();
    t.deepEqual(binToBigIntUintBE(binReverse), binToBigIntUintLE(bin));
  }
);

testProp(
  '[fast-check] bigIntToBinUintLE <-> binToBigIntUintLE',
  [fc.bigUintN(65)],
  (t, uint65) =>
    t.deepEqual(binToBigIntUintLE(bigIntToBinUintLE(uint65)), uint65)
);

test('binToBigIntUint64LE', (t) => {
  t.deepEqual(
    binToBigIntUint64LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0])),
    0x12345678n
  );
  t.deepEqual(
    binToBigIntUint64LE(
      Uint8Array.from([0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01])
    ),
    0x0123456789abcdefn
  );
  t.deepEqual(
    binToBigIntUint64LE(
      Uint8Array.from([
        0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01, 0x00, 0x00,
      ])
    ),
    0x0123456789abcdefn
  );
  const data = Uint8Array.from([0x90, 0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0, 0]);
  const view = data.subarray(2);
  t.deepEqual(binToBigIntUint64LE(view), 0x123456n);
  t.throws(() =>
    binToBigIntUint64LE(Uint8Array.from([0x78, 0x56, 0x34, 0x12]))
  );
});

test('compactSizeToBigInt: index is optional', (t) => {
  t.deepEqual(compactSizeToBigInt(hexToBin('00')), {
    nextIndex: 1,
    value: 0x00n,
  });
});

const compactSizeVector = test.macro<
  [string, bigint, number, number?, string?]
>({
  // eslint-disable-next-line max-params
  exec: (t, hex, value, nextIndex, start = 0, expected = hex) => {
    t.deepEqual(compactSizeToBigInt(hexToBin(hex), start), {
      nextIndex,
      value,
    });
    t.deepEqual(bigIntToCompactSize(value), hexToBin(expected));
  },
  title: (_, string) => `compactSizeToBigInt/bigIntToCompactSize: ${string}`,
});

/* spell-checker: disable */
test(compactSizeVector, '00', 0x00n, 1);
test(compactSizeVector, '01', 0x01n, 1);
test(compactSizeVector, '12', 0x12n, 1);
test(compactSizeVector, '6a', 0x6an, 1);
test(compactSizeVector, '00006a', 0x6an, 3, 2, '6a');
test(compactSizeVector, 'fc', 0xfcn, 1);
test(compactSizeVector, 'fdfd00', 0x00fdn, 3);
test(compactSizeVector, '000000fdfd00', 0xfdn, 6, 3, 'fdfd00');
test(compactSizeVector, 'fdfe00', 0x00fen, 3);
test(compactSizeVector, 'fdff00', 0x00ffn, 3);
test(compactSizeVector, 'fd1111', 0x1111n, 3);
test(compactSizeVector, 'fd1234', 0x3412n, 3);
test(compactSizeVector, 'fdfeff', 0xfffen, 3);
test(compactSizeVector, 'fdffff', 0xffffn, 3);
test(compactSizeVector, 'fe00000100', 0x010000n, 5);
test(compactSizeVector, '00fe00000100', 0x010000n, 6, 1, 'fe00000100');
test(compactSizeVector, 'fe01000100', 0x010001n, 5);
test(compactSizeVector, 'fe11111111', 0x11111111n, 5);
test(compactSizeVector, 'fe12345678', 0x78563412n, 5);
test(compactSizeVector, 'feffffffff', 0xffffffffn, 5);
test(compactSizeVector, 'ff0000000001000000', 0x0100000000n, 9);
/* spell-checker: enable */

test(
  compactSizeVector,
  '0000ff0000000001000000',
  0x0100000000n,
  11,
  2,
  'ff0000000001000000'
);
test(compactSizeVector, 'ff0100000001000000', 0x0100000001n, 9);
test(compactSizeVector, 'ff1111111111111111', 0x1111111111111111n, 9);
test(compactSizeVector, 'ff1234567890abcdef', 0xefcdab9078563412n, 9);

testProp(
  '[fast-check] bigIntToCompactSize <-> compactSizeToBigInt',
  [fc.bigUintN(64)],
  (t, uint64) => {
    const compactSize = bigIntToCompactSize(uint64);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const expectedIndex = compactSizePrefixToSize(compactSize[0]!);
    const result = compactSizeToBigInt(compactSize);
    t.deepEqual(result, { nextIndex: expectedIndex, value: uint64 });
  }
);
