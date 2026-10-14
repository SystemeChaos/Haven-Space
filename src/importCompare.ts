/**
 * importCompare.ts — Haven Space
 *
 * Aide à l'import d'une sauvegarde JSON (logique pure, sans React ni stockage) :
 *  - compare, section par section, ce que contient le fichier et ce que tu as actuellement,
 *    pour repérer un fichier plus pauvre que ton système (mauvais fichier, vieille sauvegarde) ;
 *  - liste les sections ABSENTES du fichier : « Écraser » ne les touche pas (une sauvegarde faite avant
 *    l'arrivée d'une fonctionnalité ne doit pas vider cette fonctionnalité).
 */

type Lang = 'fr' | 'en';
type Kind = 'array' | 'object';

const isPresent = (data: any, field: string, kind: Kind): boolean => {
  const v = data?.[field];
  return kind === 'array' ? Array.isArray(v) : !!v && typeof v === 'object' && !Array.isArray(v);
};

/** Une section de la sauvegarde = un ou plusieurs champs JSON de premier niveau. */
interface SectionDef { label: { fr: string; en: string }; fields: Array<[field: string, kind: Kind]> }

export const BACKUP_SECTIONS: SectionDef[] = [
  { label: { fr: 'Alters', en: 'Alters' }, fields: [['savedAlters', 'array']] },
  { label: { fr: 'Sous-systèmes', en: 'Subsystems' }, fields: [['subsystems', 'array']] },
  { label: { fr: 'Systèmes parallèles', en: 'Parallel systems' }, fields: [['parallelSystems', 'array']] },
  { label: { fr: 'Mini-chats', en: 'Chats' }, fields: [['chatMessages', 'array']] },
  { label: { fr: 'Messages privés', en: 'Private messages' }, fields: [['conversations', 'array'], ['directMessages', 'array']] },
  { label: { fr: 'Switchs', en: 'Switches' }, fields: [['switchLogs', 'array']] },
  { label: { fr: 'Journal', en: 'Journal' }, fields: [['journalEntries', 'array']] },
  { label: { fr: 'Habitudes', en: 'Habits' }, fields: [['habits', 'array'], ['habitLogs', 'array']] },
  {
    label: { fr: 'Éléments personnalisés', en: 'Custom items' },
    fields: [['customRoles', 'array'], ['customTraits', 'array'], ['customDisorders', 'array'], ['customGenders', 'array'], ['customPronouns', 'array'], ['customSexualities', 'array']],
  },
  { label: { fr: 'Traitements', en: 'Medications' }, fields: [['medications', 'array']] },
  { label: { fr: 'Antécédents', en: 'History' }, fields: [['healthHistory', 'array']] },
  { label: { fr: 'Intervenants', en: 'Providers' }, fields: [['healthProviders', 'array']] },
  { label: { fr: 'Aides et stratégies', en: 'Aids & strategies' }, fields: [['healthAids', 'array']] },
  { label: { fr: 'Urgence', en: 'Emergency' }, fields: [['emergencyInfo', 'object']] },
  { label: { fr: 'Planning', en: 'Planning' }, fields: [['planningEntries', 'array']] },
  { label: { fr: 'Matrice d\'Eisenhower', en: 'Eisenhower matrix' }, fields: [['eisenhowerTasks', 'array']] },
  { label: { fr: 'Mapping', en: 'Mapping' }, fields: [['mappingData', 'object']] },
  { label: { fr: 'Portefeuille', en: 'Wallet' }, fields: [['walletEntries', 'array'], ['walletCustomCategories', 'array']] },
  { label: { fr: 'Spectrum Tool', en: 'Spectrum Tool' }, fields: [['spectrumBySystem', 'object']] },
  { label: { fr: 'Éco-Système', en: 'Eco-System' }, fields: [['ecoSystem', 'object']] },
  { label: { fr: 'Innerworld', en: 'Innerworld' }, fields: [['innerworldData', 'object']] },
];

/** Sections dont AUCUN champ n'est dans le fichier : elles seront conservées telles quelles à l'import « Écraser ». */
export function missingSectionLabels(data: any, lang: Lang): string[] {
  return BACKUP_SECTIONS
    .filter(s => s.fields.every(([field, kind]) => !isPresent(data, field, kind)))
    .map(s => s.label[lang]);
}

// --- Comparaison fichier / système actuel ----------------------------------------------------------
export type CountKey = 'alters' | 'subsystems' | 'chats' | 'switches' | 'journals' | 'health' | 'wallet' | 'innerworld' | 'spectrum';

export interface CompareRow {
  key: CountKey;
  label: { fr: string; en: string };
  /** Dans le fichier (0 si la section est absente). */
  incoming: number;
  /** Actuellement dans l'app (pour la santé : seulement les listes présentes dans le fichier, pour comparer à armes égales). */
  current: number;
  /** La section est dans le fichier (sinon « Écraser » la laisse intacte). */
  present: boolean;
  /** Le fichier en contient MOINS que ce que tu as : l'écrasement ferait perdre la différence. */
  lower: boolean;
}

export interface CurrentState {
  savedAlters: ArrayLike<unknown>;
  subsystems: ArrayLike<unknown>;
  chatMessages: ArrayLike<unknown>;
  switchLogs: ArrayLike<unknown>;
  journalEntries: ArrayLike<unknown>;
  medications: ArrayLike<unknown>;
  healthHistory: ArrayLike<unknown>;
  healthProviders: ArrayLike<unknown>;
  healthAids: ArrayLike<unknown>;
  walletEntries: ArrayLike<unknown>;
  /** Pages Innerworld actuellement enregistrées. */
  innerworldPlaces: number;
  /** Critères du Spectrum Tool, tous systèmes confondus. */
  spectrumCriteria: number;
}

const INNERWORLD_PLACE_PREFIX = 'haven_innerworld_place_';

export function countSpectrumCriteria(bySystem: unknown): number {
  if (!bySystem || typeof bySystem !== 'object') return 0;
  return Object.values(bySystem as Record<string, unknown>).reduce<number>((sum, c) => sum + (Array.isArray(c) ? c.length : 0), 0);
}

export function compareBackup(data: any, current: CurrentState): CompareRow[] {
  const len = (v: unknown) => (Array.isArray(v) ? v.length : 0);
  const row = (key: CountKey, label: { fr: string; en: string }, present: boolean, incoming: number, cur: number): CompareRow =>
    ({ key, label, incoming, current: cur, present, lower: present && incoming < cur });

  // Santé : on ne compare que les listes réellement présentes dans le fichier (une vieille sauvegarde sans
  // « Intervenants » ne doit pas déclencher une fausse alerte, puisque cette liste sera conservée).
  const healthLists: Array<[string, ArrayLike<unknown>]> = [
    ['medications', current.medications], ['healthHistory', current.healthHistory],
    ['healthProviders', current.healthProviders], ['healthAids', current.healthAids],
  ];
  const presentHealth = healthLists.filter(([f]) => Array.isArray(data?.[f]));

  const innerworldPresent = isPresent(data, 'innerworldData', 'object');
  const innerworldIncoming = innerworldPresent
    ? Object.keys(data.innerworldData).filter(k => k.startsWith(INNERWORLD_PLACE_PREFIX)).length
    : 0;

  return [
    row('alters', { fr: 'Alters', en: 'Alters' }, Array.isArray(data?.savedAlters), len(data?.savedAlters), current.savedAlters.length),
    row('subsystems', { fr: 'Sous-systèmes', en: 'Subsystems' }, Array.isArray(data?.subsystems), len(data?.subsystems), current.subsystems.length),
    row('chats', { fr: 'Mini-chats', en: 'Chats' }, Array.isArray(data?.chatMessages), len(data?.chatMessages), current.chatMessages.length),
    row('switches', { fr: 'Switchs', en: 'Switches' }, Array.isArray(data?.switchLogs), len(data?.switchLogs), current.switchLogs.length),
    row('journals', { fr: 'Notes Journal', en: 'Journal' }, Array.isArray(data?.journalEntries), len(data?.journalEntries), current.journalEntries.length),
    row('health', { fr: 'Santé', en: 'Health' }, presentHealth.length > 0,
      presentHealth.reduce((s, [f]) => s + len(data[f]), 0), presentHealth.reduce((s, [, cur]) => s + cur.length, 0)),
    row('wallet', { fr: 'Portefeuille', en: 'Wallet' }, Array.isArray(data?.walletEntries), len(data?.walletEntries), current.walletEntries.length),
    row('innerworld', { fr: 'Innerworld', en: 'Innerworld' }, innerworldPresent, innerworldIncoming, current.innerworldPlaces),
    row('spectrum', { fr: 'Spectrum Tool', en: 'Spectrum Tool' }, isPresent(data, 'spectrumBySystem', 'object'),
      countSpectrumCriteria(data?.spectrumBySystem), current.spectrumCriteria),
  ];
}
