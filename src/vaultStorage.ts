/**
 * vaultStorage.ts — Haven Space
 *
 * Couche de stockage chiffré partagée par App.tsx et les pages annexes (Mapping,
 * Planning, Innerworld). Extrait d'App.tsx pour éviter de dupliquer cette logique
 * dans chaque fichier qui a besoin de lire/écrire des données protégées par le coffre.
 */

import { encryptData, decryptData, EncryptedPayload } from './cryptoEngine';

// Marqueur qui distingue une valeur chiffrée (nouveau format) d'une valeur en
// clair (ancien format, données d'avant le chiffrement). Permet de lire les
// deux sans casser les utilisateurs déjà en place.
export const HS_ENCRYPTED_MARKER = '__hsEncrypted';

interface HsEncryptedRecord { __hsEncrypted: true; payload: EncryptedPayload; }

// Le chiffré vit dans IndexedDB, pas localStorage : localStorage plafonne à 5-10 Mo
// selon le navigateur, et entre plusieurs alters avec avatars et le surcoût du
// chiffrement (~30% avec l'encodage base64), ce plafond saute vite. IndexedDB a des
// quotas bien plus larges (des centaines de Mo).
const HS_IDB_NAME = 'haven-space-vault';
const HS_IDB_STORE = 'encrypted';

function openVaultDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(HS_IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(HS_IDB_STORE)) req.result.createObjectStore(HS_IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key: string): Promise<HsEncryptedRecord | null> {
  const db = await openVaultDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HS_IDB_STORE, 'readonly');
    const req = tx.objectStore(HS_IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: HsEncryptedRecord): Promise<void> {
  const db = await openVaultDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HS_IDB_STORE, 'readwrite');
    tx.objectStore(HS_IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetAllKeys(): Promise<string[]> {
  const db = await openVaultDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HS_IDB_STORE, 'readonly');
    const req = tx.objectStore(HS_IDB_STORE).getAllKeys();
    req.onsuccess = () => resolve((req.result as string[]) || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openVaultDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HS_IDB_STORE, 'readwrite');
    tx.objectStore(HS_IDB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Liste toutes les clés commençant par un préfixe donné — combine IndexedDB (chiffré,
// nouveau format) et localStorage (résiduel, clés pas encore migrées). Utile pour les
// données à clé dynamique (une entrée par page Innerworld, par exemple), qu'on ne peut
// pas connaître à l'avance comme pour une clé fixe.
export async function listVaultKeys(prefix: string): Promise<string[]> {
  const keys = new Set<string>();
  try {
    const idbKeys = await idbGetAllKeys();
    for (const k of idbKeys) if (k.startsWith(prefix)) keys.add(k);
  } catch (e) {
    console.warn('[Haven Space] Lecture des clés IndexedDB impossible :', e);
  }
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) keys.add(k);
  }
  return Array.from(keys);
}

// Supprime une clé partout où elle pourrait exister (IndexedDB et localStorage).
export async function deleteVaultKey(key: string): Promise<void> {
  try { await idbDelete(key); } catch (e) { console.warn(`[Haven Space] Suppression IndexedDB impossible pour "${key}" :`, e); }
  if (localStorage.getItem(key)) localStorage.removeItem(key);
}


// Lit une clé potentiellement chiffrée : regarde d'abord dans IndexedDB (nouveau
// format). Si rien là-bas, retombe sur localStorage — soit de l'ancien clair pas
// encore migré, soit (résiduel) une ancienne version chiffrée d'avant le passage à
// IndexedDB. Si le coffre est verrouillé (dek = null) et que la donnée trouvée est
// chiffrée, on NE PEUT PAS lire — on renvoie le fallback, rien n'est perdu.
export async function readMaybeEncrypted<T>(key: string, dek: CryptoKey | null, fallback: T): Promise<T> {
  try {
    const idbRecord = await idbGet(key);
    if (idbRecord && idbRecord[HS_ENCRYPTED_MARKER]) {
      if (!dek) return fallback;
      try {
        const plaintext = await decryptData(dek, idbRecord.payload);
        return JSON.parse(plaintext) as T;
      } catch (e) {
        console.warn(`[Haven Space] "${key}" trouvé chiffré dans IndexedDB mais impossible à déchiffrer avec la clé actuelle du coffre :`, e);
        return fallback;
      }
    }
  } catch (e) {
    console.warn(`[Haven Space] Lecture IndexedDB impossible pour "${key}", repli sur localStorage :`, e);
  }
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed[HS_ENCRYPTED_MARKER]) {
      if (!dek) return fallback;
      try {
        const plaintext = await decryptData(dek, (parsed as HsEncryptedRecord).payload);
        return JSON.parse(plaintext) as T;
      } catch (e) {
        console.warn(`[Haven Space] "${key}" trouvé chiffré dans localStorage mais impossible à déchiffrer avec la clé actuelle du coffre :`, e);
        return fallback;
      }
    }
    return parsed as T; // ancien format en clair (avant chiffrement, ou coffre jamais activé)
  } catch (e) {
    console.warn(`[Haven Space] Lecture localStorage impossible pour "${key}" :`, e);
    return fallback;
  }
}

// Force la migration d'une clé du clair vers le chiffré, même si rien ne l'a jamais
// relue/réécrite depuis le déverrouillage. Nécessaire pour les données qui ne se
// sauvegardent que sur édition explicite (Planning, Eisenhower, Innerworld) — sans ça,
// une clé jamais modifiée après le passage au chiffrement resterait en clair pour toujours.
export async function migrateKeyIfNeeded(key: string, dek: CryptoKey | null): Promise<void> {
  if (!dek) return;
  const raw = localStorage.getItem(key);
  if (!raw || raw.includes(HS_ENCRYPTED_MARKER)) return;
  try {
    const value = JSON.parse(raw);
    await writeMaybeEncrypted(key, value, dek, true);
  } catch {
    // valeur illisible : on laisse telle quelle plutôt que de risquer de la perdre
  }
}


// Écrit une valeur : chiffrée dans IndexedDB si le coffre est déverrouillé (et on
// nettoie l'éventuel clair résiduel dans localStorage, pour libérer sa place) ; en
// clair dans localStorage si aucun coffre n'a jamais été activé (comportement
// historique inchangé). Si le coffre existe mais est verrouillé, on n'écrit RIEN —
// sinon on écraserait des données chiffrées valides par du vide.
export async function writeMaybeEncrypted<T>(key: string, value: T, dek: CryptoKey | null, hasVaultActive: boolean): Promise<void> {
  if (dek) {
    const payload = await encryptData(dek, JSON.stringify(value));
    const record: HsEncryptedRecord = { __hsEncrypted: true, payload };
    await idbSet(key, record);
    if (localStorage.getItem(key)) localStorage.removeItem(key);
  } else if (!hasVaultActive) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  // sinon : coffre actif mais verrouillé → écriture ignorée volontairement
}
