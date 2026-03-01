import "server-only";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

function getKey(salt: Buffer): Buffer {
  const secret = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) throw new Error("ENCRYPTION_KEY or AUTH_SECRET must be set");
  return scryptSync(secret, salt, 32);
}

/** Encrypt a plaintext string. Returns base64-encoded ciphertext. */
export function encrypt(plaintext: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const key = getKey(salt);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  // salt:iv:tag:ciphertext — all hex-encoded
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted,
  ].join(":");
}

/** Decrypt a string produced by encrypt(). */
export function decrypt(encoded: string): string {
  const [saltHex, ivHex, tagHex, ciphertext] = encoded.split(":");
  if (!saltHex || !ivHex || !tagHex || !ciphertext) {
    throw new Error("Invalid encrypted data format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const key = getKey(salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/** Encrypt a JSON-serializable object. */
export function encryptJson<T>(data: T): string {
  return encrypt(JSON.stringify(data));
}

/** Decrypt back to a typed object. */
export function decryptJson<T>(encoded: string): T {
  return JSON.parse(decrypt(encoded)) as T;
}
