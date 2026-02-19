// ========================================
// Verepo — Server-side wallet signature verification
// ========================================

import nacl from "tweetnacl";
import bs58 from "bs58";

const SIGN_MESSAGE_PREFIX = "Parity Verepo: verify wallet ownership\n\nTimestamp: ";

/**
 * Build the message that the frontend will ask the wallet to sign.
 * Includes a timestamp to prevent replay attacks (valid for 5 minutes).
 */
export function buildSignMessage(timestamp: number): string {
    return `${SIGN_MESSAGE_PREFIX}${timestamp}`;
}

/**
 * Verify a wallet signature server-side.
 * Returns true if the signature is valid and not expired.
 */
export function verifyWalletSignature(
    wallet: string,
    signature: string,
    timestamp: number
): boolean {
    // Check timestamp freshness (5 minute window)
    const now = Date.now();
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
        return false;
    }

    try {
        const message = new TextEncoder().encode(buildSignMessage(timestamp));
        const signatureBytes = bs58.decode(signature);
        const publicKeyBytes = bs58.decode(wallet);

        return nacl.sign.detached.verify(message, signatureBytes, publicKeyBytes);
    } catch {
        return false;
    }
}
