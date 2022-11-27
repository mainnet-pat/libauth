import test from 'ava';
import { stringifyTestVector, vmbTestGroupToVmbTests } from '../lib.js';
/* spell-checker: disable */
test('vmbTestGroupToVmbTests', (t) => {
    const result = vmbTestGroupToVmbTests([
        'Test set',
        [
            [
                'OP_0',
                'OP_SIZE <0> OP_EQUAL',
                'OP_0 (A.K.A. OP_PUSHBYTES_0, OP_FALSE): zero is represented by an empty stack item',
            ],
            [
                'OP_PUSHBYTES_1',
                'OP_SIZE <1> OP_EQUAL',
                'OP_PUSHBYTES_1 with missing bytes',
                ['invalid', 'p2sh_ignore'],
            ],
        ],
    ]);
    t.deepEqual(result, [
        [
            [
                'lqhcn',
                'Test set: OP_0 (A.K.A. OP_PUSHBYTES_0, OP_FALSE): zero is represented by an empty stack item (nonP2SH)',
                'OP_0',
                'OP_SIZE <0> OP_EQUAL',
                '020000000201000000000000000000000000000000000000000000000000000000000000000000000064417dfb529d352908ee0a88a0074c216b09793d6aa8c94c7640bb4ced51eaefc75d0aef61f7685d0307491e2628da3d4f91e86329265a4a58ca27a41ec0b8910779c32103a524f43d6166ad3567f18b0a5c769c6ab4dc02149f4d5095ccf4e8ffa293e785000000000100000000000000000000000000000000000000000000000000000000000000010000000100000000000100000000000000000a6a08766d625f7465737400000000',
                '0210270000000000001976a91460011c6bf3f1dd98cff576437b9d85de780f497488ac102700000000000003820087',
                ['2022_nonstandard'],
                1,
            ],
            [
                'y0ql2',
                'Test set: OP_0 (A.K.A. OP_PUSHBYTES_0, OP_FALSE): zero is represented by an empty stack item (P2SH20)',
                'OP_0',
                'OP_SIZE <0> OP_EQUAL',
                '020000000201000000000000000000000000000000000000000000000000000000000000000000000064417dfb529d352908ee0a88a0074c216b09793d6aa8c94c7640bb4ced51eaefc75d0aef61f7685d0307491e2628da3d4f91e86329265a4a58ca27a41ec0b8910779c32103a524f43d6166ad3567f18b0a5c769c6ab4dc02149f4d5095ccf4e8ffa293e78500000000010000000000000000000000000000000000000000000000000000000000000001000000050003820087000000000100000000000000000a6a08766d625f7465737400000000',
                '0210270000000000001976a91460011c6bf3f1dd98cff576437b9d85de780f497488ac102700000000000017a9146b14122b4b3cb280c9ec66f8e2827cf3384010a387',
                ['2022_standard'],
                1,
            ],
        ],
        [
            [
                '7j2u2',
                'Test set: OP_PUSHBYTES_1 with missing bytes (nonP2SH)',
                'OP_PUSHBYTES_1',
                'OP_SIZE <1> OP_EQUAL',
                '020000000201000000000000000000000000000000000000000000000000000000000000000000000064417dfb529d352908ee0a88a0074c216b09793d6aa8c94c7640bb4ced51eaefc75d0aef61f7685d0307491e2628da3d4f91e86329265a4a58ca27a41ec0b8910779c32103a524f43d6166ad3567f18b0a5c769c6ab4dc02149f4d5095ccf4e8ffa293e785000000000100000000000000000000000000000000000000000000000000000000000000010000000101000000000100000000000000000a6a08766d625f7465737400000000',
                '0210270000000000001976a91460011c6bf3f1dd98cff576437b9d85de780f497488ac102700000000000003825187',
                ['2022_invalid'],
                1,
            ],
        ],
    ], `Stringified test vector:\n${stringifyTestVector(result)}`);
});
//# sourceMappingURL=bch-vmb-test-utils.spec.js.map