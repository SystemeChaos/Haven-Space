/**
 * alterImporters.ts — Haven Space
 *
 * Import de FICHES D'ALTERS exportées par d'autres apps (JSON) — logique pure, sans React ni stockage.
 *
 * Principe : un adaptateur par app traduit son JSON vers un format neutre (ImportedAlter), puis un seul
 * convertisseur fabrique les SavedAlter. Ajouter une app = ajouter UNE fonction + une ligne dans ADAPTERS.
 *
 * Sécurité des données existantes : un alter dont le nom (ou l'id PluralKit) existe déjà est IGNORÉ,
 * jamais écrasé — le mode « Fusionner » de l'app fait `{...existant, ...entrant}` et viderait sinon
 * les champs que l'import ne connaît pas (rôles, traits, notes…).
 */

import { Theme, type SavedAlter, type CustomField, type AlterRole, type Gender, type Sexuality, type TraitDecoration } from './types';
import { tr, type Lang } from './i18n';

// ─── Types ────────────────────────────────────────────────────────────────────────────────────────

export type ExternalFormat = 'pluralkit' | 'ourcana' | 'tupperbox' | 'simplyplural' | 'generic';

/** Fiche neutre : ce que TOUTES les apps savent fournir. Les champs sans équivalent vont dans `extra`. */
export interface ImportedAlter {
  externalId?: string;
  /** Id PluralKit (5-6 lettres) quand la fiche en vient : sert à relier la synchro API plus tard. */
  pkId?: string;
  name: string;
  pronouns?: string;
  description?: string;
  /** Hex normalisé « #rrggbb » ou vide. */
  color?: string;
  avatarUrl?: string;
  /** « AAAA-MM-JJ » ou vide. */
  birthday?: string;
  archived?: boolean;
  /** Étiquettes libres (→ SavedAlter.tags). */
  tags?: string[];
  /** Champs sans équivalent dans Haven Space : conservés comme champs personnalisés, jamais perdus. */
  extra: Array<{ label: string; value: string }>;
}

/** Même contrat que parsePluralKitDescription d'App.tsx (le 2e paramètre optionnel est simplement ignoré). */
export type ParseDescription = (desc: string | null) => {
  roles: string[]; genders: string[]; sexualities: string[]; traits: any[]; cleanDescription: string;
};

export interface ExternalImportOptions {
  lang: Lang;
  /** Alters déjà présents (pour détecter les doublons). */
  existing: SavedAlter[];
  /** 'main' ou id d'un système parallèle. */
  systemId: string;
  /** cleanAlterRoles d'App.tsx (passé en paramètre pour éviter un import circulaire). */
  cleanRoles: (roles?: Array<AlterRole | string>) => AlterRole[];
  /** parsePluralKitDescription d'App.tsx : extrait rôles/genre/sexualité/traits d'une description PluralKit. */
  parseDescription?: ParseDescription;
}

export interface ExternalImportResult {
  format: ExternalFormat;
  /** Nom lisible de l'app source. */
  formatLabel: string;
  /** Format non reconnu précisément : lecture « au mieux » des champs usuels. */
  approximate: boolean;
  /** Nombre de fiches lues dans le fichier. */
  total: number;
  /** Fiches NOUVELLES, prêtes à être ajoutées. */
  alters: SavedAlter[];
  /** Noms ignorés (déjà présents ou en double dans le fichier). */
  skippedNames: string[];
}

// ─── Petits utilitaires tolérants (un export peut avoir n'importe quelle forme) ───────────────────

const str = (v: unknown): string =>
  typeof v === 'string' ? v.trim() : typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
const asObj = (v: unknown): Record<string, any> | null =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, any>) : null;
const asArr = (v: unknown): any[] => (Array.isArray(v) ? v : []);

const normColor = (v: unknown): string => {
  const s = str(v).replace(/^#/, '');
  if (/^[0-9a-f]{6}$/i.test(s)) return '#' + s.toLowerCase();
  if (/^[0-9a-f]{3}$/i.test(s)) return '#' + s.split('').map(c => c + c).join('').toLowerCase();
  return '';
};
const normDate = (v: unknown): string => {
  const m = str(v).match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : '';
};
/** Uniquement http(s) ou image en base64 : on n'enregistre jamais un autre type de lien. */
const normUrl = (v: unknown): string => {
  const s = str(v);
  return /^(https?:\/\/|data:image\/)/i.test(s) ? s : '';
};
const named = (e: ImportedAlter): boolean => e.name.length > 0;

/** Clé de comparaison des noms : sans emoji, ponctuation, espaces, accents ni casse (« Frost ❄️ » = « frost »). */
const nameKey = (name: string): string => {
  const k = name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  return k || name.trim().toLowerCase();
};

// ─── Détection ────────────────────────────────────────────────────────────────────────────────────

/** Vrai pour une sauvegarde Haven Space (gérée par le flux d'import existant, pas par ce module). */
export function isHavenBackup(p: any): boolean {
  const o = asObj(p);
  if (!o) return false;
  return ['savedAlters', 'subsystems', 'parallelSystems', 'chatMessages', 'switchLogs', 'journalEntries', 'mainSystemName']
    .some(k => k in o);
}

/** Liste de membres d'un export, selon la clé la plus courante. */
const memberList = (p: any): any[] => {
  if (Array.isArray(p)) return p;
  const o = asObj(p);
  if (!o) return [];
  for (const k of ['members', 'tuppers', 'alters', 'headmates', 'profiles', 'characters']) {
    if (Array.isArray(o[k])) return o[k];
  }
  return [];
};

export function detectExternalFormat(p: any): ExternalFormat | null {
  if (isHavenBackup(p)) return null;
  const o = asObj(p);

  // Ourcana : { format: 'ourcana', graph: { nodes: [ {type:'member', properties} … ], edges } }
  if (o && o.format === 'ourcana' && Array.isArray(asObj(o.graph)?.nodes)) return 'ourcana';

  // Tupperbox : { tuppers: [ { name, brackets, … } ], groups }
  if (o && Array.isArray(o.tuppers)) return 'tupperbox';

  const list = memberList(p);
  const objs = list.map(asObj).filter(Boolean) as Array<Record<string, any>>;
  if (objs.length === 0) return null;

  // SimplyPlural : chaque membre est un document { …, content: { name, desc, … } }
  if (objs.some(m => asObj(m.content) && 'name' in m.content)) return 'simplyplural';

  // PluralKit : membres avec proxy_tags / display_name / uuid (export pk;export ou API /members)
  if (objs.some(m => 'proxy_tags' in m || 'display_name' in m || ('uuid' in m && 'name' in m))) return 'pluralkit';

  // Format inconnu mais ressemblant (liste d'objets avec un « name »)
  if (objs.some(m => str(m.name))) return 'generic';
  return null;
}

// ─── Adaptateurs : un par app ─────────────────────────────────────────────────────────────────────

function fromPluralKit(p: any): ImportedAlter[] {
  return memberList(p).map(asObj).filter(Boolean).map((m: any): ImportedAlter => {
    const name = str(m.name);
    const extra: ImportedAlter['extra'] = [];
    const display = str(m.display_name);
    if (display && display !== name) extra.push({ label: 'Display name', value: display });
    return {
      externalId: str(m.id) || undefined,
      pkId: str(m.id) || undefined,
      name,
      pronouns: str(m.pronouns),
      description: typeof m.description === 'string' ? m.description.trim() : '',
      color: normColor(m.color),
      avatarUrl: normUrl(m.avatar_url) || normUrl(m.webhook_avatar_url),
      birthday: normDate(m.birthday),
      extra,
    };
  }).filter(named);
}

/**
 * Ourcana (format v3) : les fiches sont des nœuds `member` d'un graphe ; les étiquettes sont des nœuds `tag`
 * reliés au membre par une arête `taggedWith` (membre → étiquette). Les champs suivent ceux de PluralKit.
 * Ignorés volontairement : historique de front (frontEvent / *SwitchAtom), préférences, proxy tags.
 */
function fromOurcana(p: any): ImportedAlter[] {
  const g = asObj(asObj(p)?.graph);
  const nodes = asArr(g?.nodes).map(asObj).filter(Boolean) as Array<Record<string, any>>;
  const edges = asArr(g?.edges).map(asObj).filter(Boolean) as Array<Record<string, any>>;

  const tagLabel = new Map<string, string>();
  for (const n of nodes) {
    if (n.type === 'tag') { const l = str(asObj(n.properties)?.label); if (l) tagLabel.set(str(n.id), l); }
  }
  const tagsOf = new Map<string, string[]>();
  for (const e of edges) {
    if (e.type !== 'taggedWith') continue;
    const label = tagLabel.get(str(e.to));
    if (!label) continue;
    const from = str(e.from);
    tagsOf.set(from, [...(tagsOf.get(from) ?? []), label]);
  }

  return nodes.filter(n => n.type === 'member').map((n): ImportedAlter => {
    const m = asObj(n.properties) ?? {};
    const extra: ImportedAlter['extra'] = [];
    const display = str(m.displayName);
    if (display && display !== str(m.name)) extra.push({ label: 'Display name', value: display });
    const pkId = str(m.pkId);
    return {
      externalId: str(m.ourcanaId) || str(n.id) || undefined,
      pkId: pkId || undefined,
      name: str(m.name),
      pronouns: str(m.pronouns),
      description: typeof m.desc === 'string' ? m.desc.trim() : '',
      color: normColor(m.color),
      avatarUrl: normUrl(m.avatarUrl) || normUrl(m.webhookAvatarUrl),
      birthday: normDate(m.birthday),
      archived: m.archived === true,
      tags: tagsOf.get(str(n.id)),
      extra,
    };
  }).filter(named);
}

function fromTupperbox(p: any): ImportedAlter[] {
  return asArr(asObj(p)?.tuppers).map(asObj).filter(Boolean).map((t: any): ImportedAlter => {
    const extra: ImportedAlter['extra'] = [];
    const tag = str(t.tag);
    if (tag) extra.push({ label: 'Tag', value: tag });
    return {
      externalId: str(t.id) || undefined,
      name: str(t.name),
      description: typeof t.description === 'string' ? t.description.trim() : '',
      avatarUrl: normUrl(t.avatar_url),
      birthday: normDate(t.birthday),
      extra,
    };
  }).filter(named);
}

function fromSimplyPlural(p: any): ImportedAlter[] {
  const root = asObj(p);
  // Libellés des champs personnalisés (leurs valeurs sont rangées par id dans member.info)
  const labels: Record<string, string> = {};
  for (const cf of asArr(root?.customFields)) {
    const o = asObj(cf);
    const c = asObj(o?.content) ?? o;
    const id = str(o?.exportedId) || str(o?.id) || str(o?._id);
    const label = str(c?.name);
    if (id && label) labels[id] = label;
  }
  return memberList(p).map(asObj).filter(Boolean).map((m: any): ImportedAlter => {
    const c = asObj(m.content) ?? m; // tolérant : certains exports mettent les champs à plat
    const extra: ImportedAlter['extra'] = [];
    for (const [key, val] of Object.entries(asObj(c.info) ?? {})) {
      const v = str(val);
      if (v) extra.push({ label: labels[key] || 'SimplyPlural', value: v });
    }
    return {
      externalId: str(m.exportedId) || str(m.id) || str(m._id) || undefined,
      name: str(c.name),
      pronouns: str(c.pronouns),
      description: typeof c.desc === 'string' ? c.desc.trim() : '',
      color: normColor(c.color),
      avatarUrl: normUrl(c.avatarUrl),
      birthday: normDate(c.birthday),
      archived: c.archived === true,
      extra,
    };
  }).filter(named);
}

/** Meilleur effort pour une app inconnue : on lit les noms de champs les plus répandus. */
function fromGeneric(p: any): ImportedAlter[] {
  return memberList(p).map(asObj).filter(Boolean).map((m: any): ImportedAlter => {
    const c = asObj(m.content) ?? m;
    const pick = (...keys: string[]) => { for (const k of keys) { const v = str(c[k]); if (v) return v; } return ''; };
    return {
      externalId: pick('id', '_id', 'uuid') || undefined,
      name: pick('name', 'display_name', 'displayName', 'nickname'),
      pronouns: pick('pronouns'),
      description: pick('description', 'desc', 'bio', 'about'),
      color: normColor(pick('color', 'colour')),
      avatarUrl: normUrl(pick('avatar_url', 'avatarUrl', 'avatar', 'image', 'icon')),
      birthday: normDate(pick('birthday', 'birthdate', 'birth_date')),
      extra: [],
    };
  }).filter(named);
}

const ADAPTERS: Record<ExternalFormat, { label: string; read: (p: any) => ImportedAlter[] }> = {
  pluralkit: { label: 'PluralKit', read: fromPluralKit },
  ourcana: { label: 'Ourcana', read: fromOurcana },
  tupperbox: { label: 'Tupperbox', read: fromTupperbox },
  simplyplural: { label: 'SimplyPlural', read: fromSimplyPlural },
  generic: { label: '?', read: fromGeneric },
};

// ─── Conversion vers SavedAlter ───────────────────────────────────────────────────────────────────

const newId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

function toSavedAlter(e: ImportedAlter, format: ExternalFormat, opts: ExternalImportOptions): SavedAlter {
  // Les descriptions PluralKit peuvent contenir rôles/genre/traits : on les extrait si on a le parseur.
  // (Ourcana en fait autant : ses descriptions viennent de PluralKit, donc du même format.)
  const parsed = (format === 'pluralkit' || format === 'ourcana') && opts.parseDescription ? opts.parseDescription(e.description || null) : null;

  const customFields: CustomField[] = e.extra.map(x => ({ id: newId(), label: x.label, value: x.value }));

  return {
    id: newId(),
    alterName: e.name,
    selectedRoles: opts.cleanRoles(parsed?.roles),
    selectedGenders: (parsed?.genders ?? []) as Gender[],
    selectedPronouns: [],
    selectedSexualities: (parsed?.sexualities ?? []) as Sexuality[],
    traitDecorations: (parsed?.traits ?? []) as TraitDecoration[],
    patternLayers: [],
    decorations: [],
    customRoleColors: {},
    customGenderColors: {},
    customPronounColors: {},
    customSexualityColors: {},
    theme: Theme.LIGHT,
    profileImage: e.avatarUrl || '',
    description: parsed ? parsed.cleanDescription : (e.description || ''),
    internalNotes: '',
    frontStatus: 'none',
    pronouns: e.pronouns || '',
    birthday: e.birthday || '',
    alterColor: e.color || undefined,
    // Lien PluralKit : permet la synchro API de retrouver cette fiche plus tard au lieu de la dupliquer.
    ...(e.pkId ? { pkId: e.pkId, pkColor: e.color || '' } : {}),
    ...(e.tags && e.tags.length > 0 ? { tags: e.tags } : {}),
    ...(customFields.length > 0 ? { customFields } : {}),
    ...(e.archived ? { archived: true } : {}),
    systemId: opts.systemId,
  };
}

/**
 * Point d'entrée. Retourne null si le fichier n'est pas un export d'alters reconnu
 * (ou si c'est une sauvegarde Haven Space : dans ce cas, le flux d'import habituel s'applique).
 */
export function importExternalAlters(parsed: any, opts: ExternalImportOptions): ExternalImportResult | null {
  const format = detectExternalFormat(parsed);
  if (!format) return null;

  const adapter = ADAPTERS[format];
  const read = adapter.read(parsed);
  if (read.length === 0) return null;

  const knownNames = new Set(opts.existing.map(a => nameKey(a.alterName)));
  const knownPk = new Set(opts.existing.map(a => a.pkId).filter(Boolean) as string[]);

  const alters: SavedAlter[] = [];
  const skippedNames: string[] = [];
  for (const e of read) {
    const key = nameKey(e.name);
    const dupPk = !!e.pkId && knownPk.has(e.pkId);
    if (knownNames.has(key) || dupPk) { skippedNames.push(e.name); continue; }
    knownNames.add(key); // évite aussi les doublons à l'intérieur du fichier
    alters.push(toSavedAlter(e, format, opts));
  }

  return {
    format,
    formatLabel: format === 'generic' ? tr(opts.lang, 'Format inconnu (lecture approximative)', 'Unknown format (best-effort reading)') : adapter.label,
    approximate: format === 'generic',
    total: read.length,
    alters,
    skippedNames,
  };
}
