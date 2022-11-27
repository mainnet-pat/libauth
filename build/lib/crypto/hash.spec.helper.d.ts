import type { HashFunction } from '../lib';
export declare const testHashFunction: <T extends HashFunction>({ abcHash, libauthHash, getEmbeddedBinary, hashFunctionName, instantiate, instantiateBytes, nodeJsAlgorithm, testHash, }: {
    hashFunctionName: string;
    getEmbeddedBinary: () => ArrayBuffer;
    instantiate: () => Promise<T>;
    instantiateBytes: (webassemblyBytes: ArrayBuffer) => Promise<T>;
    abcHash: Uint8Array;
    testHash: Uint8Array;
    libauthHash: Uint8Array;
    nodeJsAlgorithm: 'ripemd160' | 'sha1' | 'sha256' | 'sha512';
}) => void;
//# sourceMappingURL=hash.spec.helper.d.ts.map