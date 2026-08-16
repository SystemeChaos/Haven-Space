/**
 * cryptoEngine.ts — Haven Space
 *
 * Chiffrement local des données sensibles, en "chiffrement en enveloppe" :
 * - Une clé de données aléatoire (DEK) sert à chiffrer/déchiffrer le contenu réel.
 * - Cette DEK n'est JAMAIS stockée en clair : elle est "enveloppée" (chiffrée)
 *   séparément par le PIN et par la réponse à la question de sécurité.
 * - Le PIN ou la question, indépendamment l'un de l'autre, permettent de
 *   retrouver la même DEK et donc de déverrouiller les données.
 *
 * Aucune dépendance externe : tout repose sur la Web Crypto API, native au
 * navigateur (disponible partout où Haven Space tourne).
 *
 * Ce module est autonome et ne touche à rien d'autre dans l'app pour l'instant.
 */

// ─── Utilitaires d'encodage (Uint8Array <-> base64, pour stocker en JSON) ───
//
// Note technique : selon la version de TypeScript utilisée par le projet,
// `Uint8Array` peut être un type générique distinguant un ArrayBuffer "normal"
// d'un SharedArrayBuffer — une distinction que la Web Crypto API applique
// strictement, ce qui provoque des erreurs de type sur certains environnements
// même quand les données sont, en pratique, toujours de simples tableaux qu'on
// alloue nous-mêmes. Plutôt que de dépendre de ce comportement (qui varie d'une
// version de TS à l'autre), on caste explicitement en `BufferSource` — le type
// que la spec Web Crypto attend réellement — à chaque appel `crypto.subtle.*`.
// C'est sûr : ces données ne sont jamais adossées à un SharedArrayBuffer.

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// ─── Dérivation de clé depuis un secret (PIN ou réponse à la question) ─────

// Nombre d'itérations PBKDF2 : plus c'est élevé, plus un essai de force brute
// est lent. 300 000 est un bon compromis (quelques centaines de ms sur un
// téléphone récent, imperceptible pour l'utilisateur légitime).
const PBKDF2_ITERATIONS = 300_000;

async function deriveWrappingKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  // .trim().toLowerCase() : évite qu'un espace ou une casse différente entre
  // deux saisies du même PIN/réponse fasse échouer le déverrouillage.
  const secretBytes = new TextEncoder().encode(secret.trim().toLowerCase());
  const baseKey = await crypto.subtle.importKey('raw', secretBytes as BufferSource, 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false, // non exportable : cette clé dérivée ne peut jamais être lue en clair, même par notre propre code
    ['wrapKey', 'unwrapKey']
  );
}

// ─── Génération et enveloppe de la clé de données (DEK) ────────────────────

async function generateDataKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export interface WrappedKey {
  salt: string;    // base64 — sel unique pour cette enveloppe (pas secret)
  iv: string;      // base64 — vecteur d'initialisation (pas secret)
  wrapped: string; // base64 — la DEK chiffrée, illisible sans le bon secret
}

async function wrapDataKey(dek: CryptoKey, secret: string): Promise<WrappedKey> {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const wrappingKey = await deriveWrappingKey(secret, salt);
  const wrapped = await crypto.subtle.wrapKey('raw', dek, wrappingKey, { name: 'AES-GCM', iv: iv as BufferSource });
  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    wrapped: toBase64(new Uint8Array(wrapped)),
  };
}

// Si le secret fourni est incorrect, AES-GCM refuse le déchiffrement (son tag
// d'authentification ne correspond plus) : ça sert naturellement de vérification,
// pas besoin d'un mécanisme séparé pour détecter un mauvais PIN.
async function unwrapDataKey(wrappedKey: WrappedKey, secret: string): Promise<CryptoKey> {
  const salt = fromBase64(wrappedKey.salt);
  const iv = fromBase64(wrappedKey.iv);
  const wrappingKey = await deriveWrappingKey(secret, salt);
  try {
    return await crypto.subtle.unwrapKey(
      'raw',
      fromBase64(wrappedKey.wrapped) as BufferSource,
      wrappingKey,
      { name: 'AES-GCM', iv: iv as BufferSource },
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  } catch {
    throw new Error('WRONG_SECRET');
  }
}

// ─── Le "coffre" : la même DEK, accessible par PIN OU par question de sécurité ─

export interface VaultMetadata {
  pinWrap: WrappedKey;
  securityAnswerWrap: WrappedKey;
  createdAt: number;
}

/** Crée un nouveau coffre : génère la DEK, l'enveloppe avec le PIN et avec la réponse. */
export async function createVault(pin: string, securityAnswer: string): Promise<{ metadata: VaultMetadata; dek: CryptoKey }> {
  const dek = await generateDataKey();
  const pinWrap = await wrapDataKey(dek, pin);
  const securityAnswerWrap = await wrapDataKey(dek, securityAnswer);
  return { metadata: { pinWrap, securityAnswerWrap, createdAt: Date.now() }, dek };
}

/** Retrouve la DEK à partir du PIN. Lève une erreur si le PIN est incorrect. */
export async function unlockWithPin(metadata: VaultMetadata, pin: string): Promise<CryptoKey> {
  return unwrapDataKey(metadata.pinWrap, pin);
}

/** Retrouve la DEK à partir de la réponse de sécurité. Lève une erreur si elle est incorrecte. */
export async function unlockWithSecurityAnswer(metadata: VaultMetadata, answer: string): Promise<CryptoKey> {
  return unwrapDataKey(metadata.securityAnswerWrap, answer);
}

/** Change le PIN sans toucher aux données : ré-enveloppe juste la DEK avec le nouveau PIN. */
export async function changePin(metadata: VaultMetadata, dek: CryptoKey, newPin: string): Promise<VaultMetadata> {
  const pinWrap = await wrapDataKey(dek, newPin);
  return { ...metadata, pinWrap };
}

/** Change la réponse de sécurité sans toucher aux données. */
export async function changeSecurityAnswer(metadata: VaultMetadata, dek: CryptoKey, newAnswer: string): Promise<VaultMetadata> {
  const securityAnswerWrap = await wrapDataKey(dek, newAnswer);
  return { ...metadata, securityAnswerWrap };
}

// ─── Chiffrement / déchiffrement des données réelles, avec la DEK déverrouillée ─

export interface EncryptedPayload {
  iv: string;
  ciphertext: string;
}

export async function encryptData(dek: CryptoKey, plaintext: string): Promise<EncryptedPayload> {
  const iv = randomBytes(12);
  const data = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, dek, data as BufferSource);
  return { iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) };
}

export async function decryptData(dek: CryptoKey, payload: EncryptedPayload): Promise<string> {
  const iv = fromBase64(payload.iv);
  const ciphertext = fromBase64(payload.ciphertext);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, dek, ciphertext as BufferSource);
  return new TextDecoder().decode(plaintext);
}
