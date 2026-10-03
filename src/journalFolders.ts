/**
 * journalFolders.ts — Haven Space
 *
 * Classement des notes du journal par alter (« dossiers ») : logique pure, sans React ni stockage.
 *  - Une note peut être liée à plusieurs alters (`authorAlterIds`) : elle apparaît dans le dossier de chacun.
 *  - Une note sans alter (ou dont tous les alters ont été supprimés) est « Commune ».
 *  - Un alter verrouillé par son PIN n'a pas de dossier et n'est pas retrouvable par son nom : sinon son
 *    nom serait visible alors que sa fiche est protégée. (Le texte de la note, lui, reste visible : le
 *    verrou protège la fiche, pas le journal.)
 */

import { JournalEntry, SavedAlter } from './types';

export const isAlterLocked = (alter: SavedAlter, unlockedAlterIds: string[]): boolean =>
  !!alter.lockPinHash && !unlockedAlterIds.includes(alter.id);

/** Clés de dossier : 'all' | 'common' | `alter:<id>`. */
export const alterFolderKey = (alterId: string): string => `alter:${alterId}`;
export const folderAlterId = (folder: string): string | null =>
  folder.startsWith('alter:') ? folder.slice('alter:'.length) : null;

export interface JournalFolders {
  /** Alters liés à une note (ids inconnus ignorés). */
  authorsOf: (entry: JournalEntry) => SavedAlter[];
  commonCount: number;
  countByAlter: Map<string, number>;
  /** Alters ayant au moins une note et pas verrouillés : un dossier chacun, triés par nom. */
  folderAlters: SavedAlter[];
  /** Dossier réellement actif (retombe sur 'all' si le dossier demandé n'existe plus). */
  activeFolder: string;
  filtered: JournalEntry[];
}

export function buildJournalFolders(
  entries: JournalEntry[],
  alters: SavedAlter[],
  unlockedAlterIds: string[],
  folder: string,
  search: string,
): JournalFolders {
  const byId = new Map(alters.map(al => [al.id, al]));
  const authorsOf = (entry: JournalEntry): SavedAlter[] =>
    (entry.authorAlterIds || []).map(id => byId.get(id)).filter((al): al is SavedAlter => !!al);

  const countByAlter = new Map<string, number>();
  let commonCount = 0;
  for (const entry of entries) {
    const authors = authorsOf(entry);
    if (authors.length === 0) commonCount++;
    else for (const al of authors) countByAlter.set(al.id, (countByAlter.get(al.id) || 0) + 1);
  }

  const folderAlters = alters
    .filter(al => countByAlter.has(al.id) && !isAlterLocked(al, unlockedAlterIds))
    .sort((x, y) => (x.alterName || '').localeCompare(y.alterName || ''));

  const folderKeys = new Set<string>(['all', 'common', ...folderAlters.map(al => alterFolderKey(al.id))]);
  const activeFolder = folderKeys.has(folder) ? folder : 'all';

  const q = search.toLowerCase();
  const filtered = entries.filter(entry => {
    const authors = authorsOf(entry);
    const inFolder = activeFolder === 'all'
      || (activeFolder === 'common' ? authors.length === 0 : authors.some(al => alterFolderKey(al.id) === activeFolder));
    if (!inFolder) return false;
    if (!q) return true;
    return entry.title.toLowerCase().includes(q)
      || entry.content.toLowerCase().includes(q)
      || authors.some(al => !isAlterLocked(al, unlockedAlterIds) && (al.alterName || '').toLowerCase().includes(q));
  });

  return { authorsOf, commonCount, countByAlter, folderAlters, activeFolder, filtered };
}
