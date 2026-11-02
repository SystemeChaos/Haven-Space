/**
 * unknownProfiles.ts — Haven Space
 *
 * « Qui suis-je ? » : pour les alters qui ne savent pas encore qui ils sont. Un court parcours de questions
 * crée une fiche « en attente » (Fiche 1, Fiche 2…) qui vit À PART de Mon Système : elle n'apparaît ni dans les
 * listes d'alters, ni dans l'organigramme, ni dans le mapping, tant qu'on ne l'a pas rattachée au système
 * principal, à un sous-système ou à un système parallèle.
 *
 * Logique pure : pas de React, pas de stockage. Les QUESTIONS sont des données (modifiables sans toucher à l'interface).
 */

import { SavedAlter, Theme } from './types';
import { Lang, tr, trf, localeOf } from './i18n';

export const UNKNOWN_PROFILES_KEY = 'hs-unknown-profiles';

/** Réponse d'une question. Une question passée ou « je ne sais pas » est simplement absente de `answers`. */
export type AnswerValue = number | string | string[];

export interface UnknownProfile {
  id: string;
  /** « Fiche N » : jamais deux fois le même numéro tant que la plus récente existe. */
  number: number;
  createdAt: number;
  answers: Record<string, AnswerValue>;
}

export interface Option { id: string; fr: string; en: string }

export type QuestionDef =
  | { id: string; kind: 'slider'; fr: string; en: string; min: number; max: number; left: Option; right: Option; rightIsOpenEnded?: boolean; otherOption?: Option }
  | { id: string; kind: 'steps'; fr: string; en: string; steps: Option[] }
  | { id: string; kind: 'single' | 'multi'; fr: string; en: string; options: Option[] };

const o = (id: string, fr: string, en: string): Option => ({ id, fr, en });

export const QUESTIONS: QuestionDef[] = [
  {
    id: 'gender', kind: 'slider', fr: 'Là, tu te sens dans quel genre ?', en: 'Right now, which gender do you feel?',
    min: 0, max: 10, left: o('l', 'Plutôt masculin', 'More masculine'), right: o('r', 'Plutôt féminin', 'More feminine'),
    otherOption: o('other', 'Ni l’un ni l’autre / autre', 'Neither / other'),
  },
  {
    id: 'age', kind: 'slider', fr: 'Tu estimes avoir quel âge ?', en: 'How old do you think you are?',
    min: 0, max: 100, left: o('l', '0', '0'), right: o('r', '100 +', '100 +'), rightIsOpenEnded: true,
  },
  {
    id: 'dissociation', kind: 'slider', fr: 'Comment tu situes ton niveau de dissociation en ce moment ?', en: 'How would you rate your level of dissociation right now?',
    min: 0, max: 10, left: o('l', 'Pas du tout', 'Not at all'), right: o('r', 'Énormément', 'A great deal'),
  },
  {
    id: 'recognize', kind: 'slider', fr: 'Est-ce que tu reconnais cet endroit et ce corps ?', en: 'Do you recognize this place and this body?',
    min: 0, max: 10, left: o('l', 'Rien', 'Nothing'), right: o('r', 'Tout', 'Everything'),
  },
  {
    id: 'since', kind: 'single', fr: 'Depuis quand tu es là ?', en: 'How long have you been here?',
    options: [o('minutes', 'Quelques minutes', 'A few minutes'), o('today', 'Aujourd’hui', 'Today'), o('days', 'Plusieurs jours', 'Several days')],
  },
  {
    id: 'help', kind: 'multi', fr: 'Qu’est-ce qui t’aiderait ?', en: 'What would help you?',
    options: [o('understand', 'Comprendre où je suis', 'Understanding where I am'), o('reassured', 'Être rassuré·e', 'Being reassured'),
      o('talk', 'Parler à quelqu’un', 'Talking to someone'), o('nothing', 'Rien pour l’instant', 'Nothing right now')],
  },
  {
    id: 'memory', kind: 'steps',
    fr: 'As-tu accès aux souvenirs de la mémoire commune pour t’aider à comprendre ce qui se passe ?',
    en: 'Do you have access to the shared memory to help you understand what is going on?',
    steps: [o('0', 'Pas du tout', 'Not at all'), o('1', 'Un peu', 'A little'), o('2', 'Partiellement', 'Partially'), o('3', 'En majorité', 'Mostly'), o('4', 'La totalité', 'Everything')],
  },
];

export const questionById = (id: string): QuestionDef | undefined => QUESTIONS.find(q => q.id === id);

// --- Numérotation ------------------------------------------------------------------------------------------
export function nextProfileNumber(profiles: ReadonlyArray<Pick<UnknownProfile, 'number'>>): number {
  return profiles.reduce((max, p) => Math.max(max, p.number), 0) + 1;
}

export const profileLabel = (lang: Lang, number: number): string => trf(lang, 'Fiche {0}', 'Profile {0}', [number]);

export function createProfile(
  answers: Record<string, AnswerValue>,
  existing: ReadonlyArray<UnknownProfile>,
  now: number = Date.now(),
): UnknownProfile {
  return { id: `unk-${now}-${Math.random().toString(36).slice(2, 8)}`, number: nextProfileNumber(existing), createdAt: now, answers: cleanAnswers(answers) };
}

/** Ne garde que des réponses valides pour les questions connues (une valeur hors bornes ou d'un mauvais type est ignorée). */
export function cleanAnswers(raw: Record<string, AnswerValue>): Record<string, AnswerValue> {
  const out: Record<string, AnswerValue> = {};
  for (const q of QUESTIONS) {
    const v = raw?.[q.id];
    if (v === undefined || v === null) continue;
    if (q.kind === 'slider') {
      if (typeof v === 'number' && Number.isFinite(v) && v >= q.min && v <= q.max) out[q.id] = Math.round(v);
      else if (typeof v === 'string' && q.otherOption && v === q.otherOption.id) out[q.id] = v;
    } else if (q.kind === 'steps') {
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < q.steps.length) out[q.id] = v;
    } else if (q.kind === 'single') {
      if (typeof v === 'string' && q.options.some(x => x.id === v)) out[q.id] = v;
    } else if (q.kind === 'multi') {
      const list = Array.isArray(v) ? v.filter(x => q.options.some(op => op.id === x)) : [];
      if (list.length > 0) out[q.id] = Array.from(new Set(list));
    }
  }
  return out;
}

// --- Lecture des réponses ---------------------------------------------------------------------------------------
/** Texte lisible d'UNE réponse, dans la langue donnée (vide si la question n'a pas de réponse). */
export function describeAnswer(q: QuestionDef, value: AnswerValue | undefined, lang: Lang): string {
  if (value === undefined) return '';
  if (q.kind === 'slider') {
    if (value === q.otherOption?.id) return tr(lang, q.otherOption.fr, q.otherOption.en);
    if (typeof value !== 'number') return '';
    if (q.rightIsOpenEnded && value >= q.max) return tr(lang, q.right.fr, q.right.en);
    return q.rightIsOpenEnded ? String(value) : `${value}/${q.max} (${tr(lang, q.left.fr, q.left.en)} ← → ${tr(lang, q.right.fr, q.right.en)})`;
  }
  if (q.kind === 'steps') {
    const s = typeof value === 'number' ? q.steps[value] : undefined;
    return s ? tr(lang, s.fr, s.en) : '';
  }
  if (q.kind === 'single') {
    const op = q.options.find(x => x.id === value);
    return op ? tr(lang, op.fr, op.en) : '';
  }
  const ids = Array.isArray(value) ? value : [];
  return q.options.filter(op => ids.includes(op.id)).map(op => tr(lang, op.fr, op.en)).join(', ');
}

/** Résumé en texte brut, une ligne par question répondue — c'est ce qui est copié dans les notes internes au rattachement. */
export function summarizeAnswers(profile: UnknownProfile, lang: Lang): string {
  const when = new Date(profile.createdAt).toLocaleString(localeOf(lang), { dateStyle: 'long', timeStyle: 'short' });
  const lines = QUESTIONS
    .map(q => ({ q, text: describeAnswer(q, profile.answers[q.id], lang) }))
    .filter(x => x.text)
    .map(x => `• ${tr(lang, x.q.fr, x.q.en)} ${x.text}`);
  const header = trf(lang, 'Questionnaire « Qui suis-je ? » du {0}', 'Questionnaire “Who am I?” from {0}', [when]);
  return [header, ...(lines.length ? lines : [tr(lang, '(aucune réponse)', '(no answers)')])].join('\n');
}

// --- Rattachement à Mon Système --------------------------------------------------------------------------------
export interface AttachTarget {
  /** 'main' ou l'id d'un système parallèle. */
  systemId: string;
  /** Sous-système (appartient au système indiqué). */
  subsystemId?: string;
}

/**
 * Fabrique la vraie fiche d'alter. Rien n'est DÉDUIT des réponses (pas de genre, pas de rôle) : tout est copié, en
 * texte, dans les notes internes ; seul l'âge estimé préremplit le champ « âge ». Aucun rôle n'est attribué non plus
 * (en particulier pas « Hôte »).
 */
export function buildAlterFromProfile(
  profile: UnknownProfile,
  opts: { name: string; target: AttachTarget; lang: Lang; now?: number },
): SavedAlter {
  const age = profile.answers.age;
  const alter: SavedAlter = {
    id: `${opts.now ?? Date.now()}${Math.random().toString(36).slice(2, 9)}`,
    alterName: opts.name.trim() || profileLabel(opts.lang, profile.number),
    selectedRoles: [],
    selectedGenders: [],
    selectedPronouns: [],
    selectedSexualities: [],
    traitDecorations: [],
    patternLayers: [],
    decorations: [],
    customRoleColors: {},
    customGenderColors: {},
    customPronounColors: {},
    customSexualityColors: {},
    theme: Theme.LIGHT,
    profileImage: '',
    description: '',
    internalNotes: summarizeAnswers(profile, opts.lang),
    frontStatus: 'none',
    archived: false,
    systemId: opts.target.systemId,
    subsystemId: opts.target.subsystemId,
  };
  if (typeof age === 'number') {
    const q = questionById('age');
    alter.alterAge = q && q.kind === 'slider' && age >= q.max ? '100+' : String(age);
  }
  return alter;
}
