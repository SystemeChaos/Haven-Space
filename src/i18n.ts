/**
 * i18n.ts — Haven Space
 *
 * Langues de l'app et traduction des phrases écrites dans le code.
 *
 *  - `Lang` : 'fr' | 'en' | 'es' | 'de' | 'it'.
 *  - `tr(lang, fr, en)` remplace l'ancien motif `lang === 'fr' ? fr : en`. Pour le français et l'anglais,
 *    le résultat est EXACTEMENT celui d'avant. Pour les autres langues, on cherche la phrase dans le
 *    catalogue de la langue, avec le texte ANGLAIS comme clé ; sans traduction, on affiche l'anglais
 *    (jamais le français, jamais une clé brute, jamais de plantage).
 *  - `translations.ts` (le gros dictionnaire `t`) reçoit ses versions es/de/it avec `mergeDeep` : l'anglais
 *    sert de base, et chaque traduction n'a qu'à écraser les clés qu'elle couvre.
 *
 * Ajouter une phrase traduite = une ligne dans `locales/<langue>.ts`, rien d'autre.
 */

import { es } from './locales/es';
import { de } from './locales/de';
import { it } from './locales/it';

export type Lang = 'fr' | 'en' | 'es' | 'de' | 'it';

export interface LanguageInfo {
  code: Lang;
  /** Nom de la langue dans cette langue (affiché tel quel dans le sélecteur). */
  native: string;
  /** Traduction encore en cours : affiché « bêta » dans le sélecteur. */
  beta?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'fr', native: 'Français' },
  { code: 'en', native: 'English' },
  { code: 'es', native: 'Español', beta: true },
  { code: 'de', native: 'Deutsch', beta: true },
  { code: 'it', native: 'Italiano', beta: true },
];

export const DEFAULT_LANG: Lang = 'fr';
export const LANG_STORAGE_KEY = 'hs-lang';

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && LANGUAGES.some(l => l.code === v);

/** Langue enregistrée, ou le français par défaut (valeur inconnue ou stockage indisponible comprises). */
export function readStoredLang(storage: Pick<Storage, 'getItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined): Lang {
  try {
    const v = storage?.getItem(LANG_STORAGE_KEY);
    return isLang(v) ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

const LOCALES: Record<Lang, { default: string; hour24: string }> = {
  fr: { default: 'fr-FR', hour24: 'fr-FR' },
  en: { default: 'en-US', hour24: 'en-GB' }, // en-GB : heures sur 24 h
  es: { default: 'es-ES', hour24: 'es-ES' },
  de: { default: 'de-DE', hour24: 'de-DE' },
  it: { default: 'it-IT', hour24: 'it-IT' },
};

/** Locale pour les dates et les heures (`toLocaleDateString`…). `hour24` : heures sur 24 h, comme l'ancien 'en-GB'. */
export function localeOf(lang: Lang, opts?: { hour24?: boolean }): string {
  return (LOCALES[lang] || LOCALES[DEFAULT_LANG])[opts?.hour24 ? 'hour24' : 'default'];
}

// --- Noms de jours et de mois (es / de / it : fournis par le navigateur, aucune traduction à maintenir) ------------
const capitalize = (s: string, lang: Lang) => (s ? s.charAt(0).toLocaleUpperCase(localeOf(lang)) + s.slice(1) : s);

/** Lundi → dimanche, noms complets, première lettre en majuscule. */
export function weekdayNamesOf(lang: Lang): string[] {
  const f = new Intl.DateTimeFormat(localeOf(lang), { weekday: 'long' });
  return Array.from({ length: 7 }, (_, i) => capitalize(f.format(new Date(2024, 0, 1 + i)), lang)); // 1er janv. 2024 = lundi
}

/** Janvier → décembre, noms complets, première lettre en majuscule. */
export function monthNamesOf(lang: Lang): string[] {
  const f = new Intl.DateTimeFormat(localeOf(lang), { month: 'long' });
  return Array.from({ length: 12 }, (_, i) => capitalize(f.format(new Date(2024, i, 1)), lang));
}

// --- Catalogues ---------------------------------------------------------------------------------------------
export type Catalog = Record<string, string>;
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export interface LocalePack {
  /** Phrases écrites dans le code, clé = texte anglais. */
  strings: Catalog;
  /** Surcharges du dictionnaire `translations.ts` (l'anglais sert de base). */
  dict: Record<string, unknown>;
}

export const LOCALE_PACKS: Record<'es' | 'de' | 'it', LocalePack> = { es, de, it };

export function tr<T extends string | readonly string[]>(lang: Lang, fr: T, en: T): T {
  if (lang === 'fr') return fr;
  if (lang === 'en') return en;
  // Listes (ex. étapes d'un exercice) : pas de traduction par catalogue pour l'instant, repli sur l'anglais.
  if (typeof en !== 'string') return en;
  const strings = LOCALE_PACKS[lang]?.strings;
  // hasOwnProperty : un texte anglais comme « constructor » ne doit jamais retomber sur l'objet Object.prototype.
  return (strings && Object.prototype.hasOwnProperty.call(strings, en) && typeof strings[en] === 'string' ? strings[en] : en) as T;
}

/**
 * Phrase avec variables : `{0}`, `{1}`… sont remplacés par `args`. Le texte anglais AVEC les marqueurs est la clé du
 * catalogue (ex. « Member {0} updated on PluralKit »), ce qui rend ces phrases traduisibles comme les autres.
 */
export function trf(lang: Lang, fr: string, en: string, args: ReadonlyArray<unknown>): string {
  return tr(lang, fr, en).replace(/\{(\d+)\}/g, (m, i) => (Number(i) < args.length ? String(args[Number(i)]) : m));
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Fusion profonde : les objets sont fusionnés clé par clé, tout le reste (chaînes, tableaux) est remplacé. */
export function mergeDeep<T>(base: T, over: DeepPartial<T> | Record<string, unknown> | undefined): T {
  if (!isPlainObject(base) || !isPlainObject(over)) return base;
  const overObj: Record<string, unknown> = over;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overObj)) {
    const o = overObj[key];
    const b = out[key];
    out[key] = isPlainObject(b) && isPlainObject(o) ? mergeDeep(b, o) : o === undefined ? b : o;
  }
  return out as T;
}
