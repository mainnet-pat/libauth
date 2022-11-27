import type { AuthenticationTemplate } from '../../lib';
/**
 * A standard single-factor authentication template that uses
 * Pay-to-Public-Key-Hash (P2PKH), the most common authentication scheme in use
 * on the network.
 *
 * This P2PKH template uses BCH Schnorr signatures, reducing the size of
 * transactions.
 *
 * Note, this authentication template uses only a single `Key`. For HD key
 * support, see {@link authenticationTemplateP2pkhHd}.
 */
export declare const authenticationTemplateP2pkhNonHd: AuthenticationTemplate;
/**
 * A standard single-factor authentication template that uses
 * Pay-to-Public-Key-Hash (P2PKH), the most common authentication scheme in use
 * on the network.
 *
 * This P2PKH template uses BCH Schnorr signatures, reducing the size of
 * transactions.
 *
 * Because the template uses a Hierarchical Deterministic (HD) key, it also
 * supports watch-only clients.
 */
export declare const authenticationTemplateP2pkh: AuthenticationTemplate;
//# sourceMappingURL=p2pkh.d.ts.map