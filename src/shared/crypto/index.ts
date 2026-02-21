/**
 * Hashing, signing, and other crypto helpers. Used by auth and config.
 * No business logic; only pure crypto utilities.
 */

/**
 * Placeholder: hash a string (e.g. for tokens or secrets). Replace with real implementation (e.g. crypto.scrypt) when needed.
 */
export async function hash(value: string): Promise<string> {
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
