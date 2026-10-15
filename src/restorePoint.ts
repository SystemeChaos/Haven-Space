/**
 * restorePoint.ts — Haven Space
 *
 * « Point de restauration » : juste avant un import qui REMPLACE tes données, l'app garde une photo
 * complète de ton système (le même format que l'export JSON). Si l'import n'était pas le bon, un clic
 * suffit pour revenir en arrière.
 *
 *  - Un seul emplacement : un nouveau point remplace le précédent.
 *  - Même appareil : ça protège d'une erreur d'import, pas d'un téléphone perdu (pour ça : le fichier exporté).
 *  - Les données (potentiellement lourdes, photos comprises) vont dans IndexedDB, chiffrées si le coffre est
 *    activé. Seule une petite fiche (date, compteurs) va dans localStorage pour l'affichage : aucun contenu.
 *  - Une écriture n'est considérée réussie qu'après relecture et vérification : sinon on le dit, au lieu de
 *    laisser croire qu'un filet existe alors qu'il n'existe pas.
 *
 * La logique est pure et testable : le stockage est injecté (voir `createVaultRestoreStore`).
 */

export const RESTORE_POINT_KEY = 'hs-restore-point';
export const RESTORE_POINT_META_KEY = 'hs-restore-point-meta';

export type RestorePointReason = 'import' | 'restore';

export interface BackupCounts { alters: number; journals: number; switches: number }

export interface RestorePointMeta {
  createdAt: number;
  /** Les données ont été écrites chiffrées (coffre déverrouillé à ce moment-là). */
  encrypted: boolean;
  /** Système dont le planning est dans la photo : on y remet le planning à la restauration. */
  planningSystemId: string;
  reason: RestorePointReason;
  counts: BackupCounts;
}

interface StoredRecord { createdAt: number; data: any }

/** Stockage injecté : lecture, écriture (chiffrée ou non selon le coffre) et suppression. */
export interface RestoreStore {
  read<T>(key: string, fallback: T): Promise<T>;
  write(key: string, value: unknown): Promise<void>;
  remove(key: string): Promise<void>;
}

/** Petite fiche d'affichage : n'importe quel objet avec getItem/setItem/removeItem (localStorage). */
export interface MetaStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const defaultMeta = (): MetaStorage => localStorage;

export function summarizeBackup(data: any): BackupCounts {
  const len = (v: unknown) => (Array.isArray(v) ? v.length : 0);
  return { alters: len(data?.savedAlters), journals: len(data?.journalEntries), switches: len(data?.switchLogs) };
}

const isMeta = (m: any): m is RestorePointMeta =>
  !!m && typeof m.createdAt === 'number' && typeof m.encrypted === 'boolean'
  && typeof m.planningSystemId === 'string' && !!m.counts && typeof m.counts.alters === 'number';

export function readRestorePointMeta(meta: MetaStorage = defaultMeta()): RestorePointMeta | null {
  try {
    const raw = meta.getItem(RESTORE_POINT_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isMeta(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export interface SaveOptions {
  store: RestoreStore;
  /** Le coffre est-il déverrouillé (donc l'écriture chiffrée) ? */
  encrypted: boolean;
  planningSystemId: string;
  reason: RestorePointReason;
  now?: number;
  meta?: MetaStorage;
}

/**
 * Écrit la photo, la RELIT pour vérifier, puis seulement écrit la fiche. Jette une erreur si quoi que ce soit
 * cloche : l'appelant décide alors de s'arrêter ou de continuer sans filet, en connaissance de cause.
 */
export async function saveRestorePoint(data: any, opts: SaveOptions): Promise<RestorePointMeta> {
  const meta = opts.meta ?? defaultMeta();
  const createdAt = opts.now ?? Date.now();
  const counts = summarizeBackup(data);

  await opts.store.write(RESTORE_POINT_KEY, { createdAt, data } as StoredRecord);

  const back = await opts.store.read<StoredRecord | null>(RESTORE_POINT_KEY, null);
  const backCounts = summarizeBackup(back?.data);
  const ok = !!back && back.createdAt === createdAt
    && backCounts.alters === counts.alters && backCounts.journals === counts.journals && backCounts.switches === counts.switches;
  if (!ok) throw new Error('restore-point-verify-failed');

  const record: RestorePointMeta = { createdAt, encrypted: opts.encrypted, planningSystemId: opts.planningSystemId, reason: opts.reason, counts };
  meta.setItem(RESTORE_POINT_META_KEY, JSON.stringify(record));
  return record;
}

/** Charge la photo si elle existe ET correspond à la fiche (sinon : incohérent, on l'ignore). */
export async function loadRestorePoint(store: RestoreStore, meta: MetaStorage = defaultMeta()): Promise<{ meta: RestorePointMeta; data: any } | null> {
  const m = readRestorePointMeta(meta);
  if (!m) return null;
  const rec = await store.read<StoredRecord | null>(RESTORE_POINT_KEY, null);
  if (!rec || rec.createdAt !== m.createdAt || !rec.data || typeof rec.data !== 'object') return null;
  return { meta: m, data: rec.data };
}

export async function deleteRestorePoint(store: RestoreStore, meta: MetaStorage = defaultMeta()): Promise<void> {
  try { await store.remove(RESTORE_POINT_KEY); } catch { /* déjà absent : rien à faire */ }
  meta.removeItem(RESTORE_POINT_META_KEY);
}

/**
 * Un point créé AVANT l'activation du coffre est en clair : on le réécrit chiffré dès que le coffre est
 * déverrouillé, pour ne pas laisser une copie lisible de tes données à côté d'un coffre. Renvoie la nouvelle
 * fiche, ou null s'il n'y avait rien à faire.
 */
export async function encryptRestorePointIfNeeded(store: RestoreStore, meta: MetaStorage = defaultMeta()): Promise<RestorePointMeta | null> {
  const m = readRestorePointMeta(meta);
  if (!m || m.encrypted) return null;
  const rec = await store.read<StoredRecord | null>(RESTORE_POINT_KEY, null);
  if (!rec || rec.createdAt !== m.createdAt) return null;
  await store.write(RESTORE_POINT_KEY, rec);
  const back = await store.read<StoredRecord | null>(RESTORE_POINT_KEY, null);
  if (!back || back.createdAt !== m.createdAt) throw new Error('restore-point-verify-failed');
  const next: RestorePointMeta = { ...m, encrypted: true };
  meta.setItem(RESTORE_POINT_META_KEY, JSON.stringify(next));
  return next;
}

/** Branche le stockage chiffré de l'app (vaultStorage.ts). Importé à la demande : la logique ci-dessus reste testable seule. */
export function createVaultRestoreStore(dek: CryptoKey | null, hasVaultActive: boolean): RestoreStore {
  return {
    async read<T>(key: string, fallback: T) {
      const { readMaybeEncrypted } = await import('./vaultStorage');
      return readMaybeEncrypted<T>(key, dek, fallback);
    },
    async write(key: string, value: unknown) {
      const { writeMaybeEncrypted } = await import('./vaultStorage');
      await writeMaybeEncrypted(key, value, dek, hasVaultActive);
    },
    async remove(key: string) {
      const { deleteVaultKey } = await import('./vaultStorage');
      await deleteVaultKey(key);
    },
  };
}
