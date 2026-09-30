/**
 * orgChart.ts — Haven Space
 *
 * Logique pure de l'organigramme (aucun React, aucun stockage) : à partir des alters
 * et de leurs rôles, calcule la structure Hôte → Co-hôtes → catégories de fonction.
 * Rien n'est sauvegardé : l'organigramme se recalcule à chaque affichage, donc il reste
 * toujours à jour et n'ajoute aucune donnée en clair.
 *
 * Trois familles de rôles :
 *  - « status »  (Hôte, Co-hôte, Front-Runner) → décident des niveaux du haut
 *  - fonctions   (Protection, Persécution, Soin, …) → créent les bandes de catégories
 *  - « nature »  (Fictif, Non-humain, Little, Porteur de traumatisme, …) → ignorées ici
 */

import { AlterRole, CustomRole, RoleFamily, SavedAlter, Subsystem } from './types';

export type FunctionFamily = Exclude<RoleFamily, 'status' | 'nature'>;

// Record<AlterRole, …> (et non Partial) : si un rôle est ajouté à l'enum AlterRole sans
// être classé ici, TypeScript refuse de compiler. Impossible d'oublier un rôle en silence.
export const ROLE_FAMILY: Record<AlterRole, RoleFamily> = {
  // Statut
  [AlterRole.HOST]: 'status',
  [AlterRole.CO_HOST]: 'status',
  [AlterRole.FRONT_RUNNER]: 'status',
  // Protection
  [AlterRole.PROTECTOR]: 'protection',
  [AlterRole.PROTECTOR_PHYSICAL]: 'protection',
  [AlterRole.PROTECTOR_EMOTIONAL]: 'protection',
  [AlterRole.AVENGER]: 'protection',
  // Persécution
  [AlterRole.PERSECUTOR]: 'persecution',
  [AlterRole.PROSECUTOR]: 'persecution',
  [AlterRole.SABOTEUR]: 'persecution',
  [AlterRole.ABUSER]: 'persecution',
  [AlterRole.DYSFUNCTIONAL_PROTECTOR]: 'persecution',
  // Soin
  [AlterRole.CAREGIVER]: 'care',
  [AlterRole.SOOTHER]: 'care',
  [AlterRole.ANESTHETIC]: 'care',
  // Gardiens et gestion
  [AlterRole.GATEKEEPER]: 'keeping',
  [AlterRole.MANAGER]: 'keeping',
  [AlterRole.ARCHIVIST]: 'keeping',
  [AlterRole.MEMORY_HOLDER]: 'keeping',
  [AlterRole.SECRET_KEEPER]: 'keeping',
  [AlterRole.ARCHITECT]: 'keeping',
  [AlterRole.PROFESSIONAL]: 'keeping',
  [AlterRole.ERASER]: 'keeping',
  // Ancres et médiateurs
  [AlterRole.MEDIATOR]: 'anchor',
  [AlterRole.MESSENGER]: 'anchor',
  [AlterRole.TRANSLATOR]: 'anchor',
  [AlterRole.RELAY_ALTER]: 'anchor',
  [AlterRole.ANCHOR]: 'anchor',
  [AlterRole.OBSERVER]: 'anchor',
  [AlterRole.INTERNAL_SELF_HELPER]: 'anchor',
  // Social
  [AlterRole.SOCIAL]: 'social',
  // Alters sexuels
  [AlterRole.SEXUAL_ALTER]: 'sexual',
  // Nature / état : ignorés dans l'organigramme
  [AlterRole.FICTIVE]: 'nature',
  [AlterRole.FACTIVE]: 'nature',
  [AlterRole.INTROJECT]: 'nature',
  [AlterRole.NON_HUMAN]: 'nature',
  [AlterRole.EP]: 'nature',
  [AlterRole.ANP]: 'nature',
  [AlterRole.SHELL]: 'nature',
  [AlterRole.FRAGMENT]: 'nature',
  [AlterRole.FUNCTIONAL_FRAGMENT]: 'nature',
  [AlterRole.LITTLE]: 'nature',
  [AlterRole.MIDDLE]: 'nature',
  [AlterRole.TEEN]: 'nature',
  [AlterRole.INFANT]: 'nature',
  [AlterRole.ELDER]: 'nature',
  [AlterRole.AGE_SLIDER]: 'nature',
  [AlterRole.TRAUMA_HOLDER]: 'nature',
  [AlterRole.SYMPTOM_HOLDER]: 'nature',
  [AlterRole.PAIN_HOLDER]: 'nature',
};

// Ordre d'affichage des bandes, de haut en bas.
export const FAMILY_ORDER: FunctionFamily[] = [
  'protection', 'persecution', 'care', 'keeping', 'anchor', 'social', 'sexual',
];

export type BandId = FunctionFamily | 'other' | 'locked';

export const BAND_META: Record<BandId, { fr: string; en: string; color: string }> = {
  protection:  { fr: 'Protecteurs',            en: 'Protectors',            color: '#3B82F6' },
  persecution: { fr: 'Persécuteurs',           en: 'Persecutors',           color: '#EF4444' },
  care:        { fr: 'Soignants',              en: 'Caregivers',            color: '#F472B6' },
  keeping:     { fr: 'Gardiens et gestion',    en: 'Keepers & management',  color: '#8B5CF6' },
  anchor:      { fr: 'Ancres et médiateurs',   en: 'Anchors & mediators',   color: '#14B8A6' },
  social:      { fr: 'Social',                 en: 'Social',                color: '#F59E0B' },
  sexual:      { fr: 'Alters sexuels',         en: 'Sexual alters',         color: '#BE185D' },
  other:       { fr: 'Sans rôle de fonction',  en: 'No function role',      color: '#9CA3AF' },
  locked:      { fr: 'Fiches verrouillées',    en: 'Locked profiles',       color: '#6B7280' },
};


/** Libellés de toutes les familles (y compris statut et nature), pour l'UI du créateur. */
export const FAMILY_LABEL: Record<RoleFamily, { fr: string; en: string }> = {
  status:      { fr: 'Statut',            en: 'Status' },
  protection:  { fr: BAND_META.protection.fr,  en: BAND_META.protection.en },
  persecution: { fr: BAND_META.persecution.fr, en: BAND_META.persecution.en },
  care:        { fr: BAND_META.care.fr,        en: BAND_META.care.en },
  keeping:     { fr: BAND_META.keeping.fr,     en: BAND_META.keeping.en },
  anchor:      { fr: BAND_META.anchor.fr,      en: BAND_META.anchor.en },
  social:      { fr: BAND_META.social.fr,      en: BAND_META.social.en },
  sexual:      { fr: BAND_META.sexual.fr,      en: BAND_META.sexual.en },
  nature:      { fr: 'Nature (ignorée)',  en: 'Nature (ignored)' },
};

export interface OrgNode {
  alter: SavedAlter;
  /** Fiche protégée par son PIN individuel et pas déverrouillée : nom et rôles cachés. */
  locked: boolean;
  /** Rôle (fixe ou id de rôle perso) qui a décidé du placement — affiché sous le nom. */
  roleKey?: string;
}

const isStandardRole = (key: string): key is AlterRole =>
  Object.prototype.hasOwnProperty.call(ROLE_FAMILY, key);

/**
 * Ordre de priorité final à partir d'un éventuel ordre mémorisé (`order`) et des rôles
 * réellement attribués : on garde l'ordre mémorisé pour ceux qui y sont encore, puis on
 * ajoute à la fin les rôles nouvellement attribués. Sans `order`, on retombe sur
 * [rôles fixes, rôles perso], ce qui ne demande aucune migration des fiches existantes.
 */
export function reconcileRoleOrder(
  order: string[] | undefined,
  selectedRoles: readonly string[] | undefined,
  customRoleIds: readonly string[] | undefined,
): string[] {
  const base: string[] = Array.from(new Set([...(selectedRoles || []), ...(customRoleIds || [])]));
  if (!order || order.length === 0) return base;
  const ordered = order.filter(k => base.includes(k));
  const rest = base.filter(k => !ordered.includes(k));
  return [...ordered, ...rest];
}

/** Rôles de l'alter dans l'ordre de priorité (le premier compte le plus). */
export function getRoleKeys(alter: SavedAlter): string[] {
  return reconcileRoleOrder(alter.roleOrder, alter.selectedRoles, alter.customRoleIds);
}

/** Famille d'un rôle fixe ou perso. Un rôle perso sans famille est traité comme « nature » (ignoré). */
export function getRoleFamily(key: string, customRoles: CustomRole[]): RoleFamily {
  if (isStandardRole(key)) return ROLE_FAMILY[key];
  return customRoles.find(r => r.id === key)?.family ?? 'nature';
}

export type OrgLevel = 'host' | 'coHost' | FunctionFamily | 'other';

export interface Placement {
  level: OrgLevel;
  /** Rôle (fixe ou id de rôle perso) qui décide du placement ; absent si aucun rôle de fonction. */
  roleKey?: string;
}

/**
 * Règle unique de placement, partagée par l'organigramme et par le créateur de fiches
 * (qui affiche « Catégorie dans l'organigramme » en direct) :
 *  1. le statut passe avant tout, quel que soit son rang : Hôte > Co-hôte > Front-Runner ;
 *  2. sinon le premier rôle de fonction dans l'ordre de priorité décide de la bande ;
 *  3. sinon « other » (aucun rôle de fonction).
 */
export function placeAlter(keys: string[], customRoles: CustomRole[]): Placement {
  if (keys.includes(AlterRole.HOST)) return { level: 'host', roleKey: AlterRole.HOST };
  if (keys.includes(AlterRole.CO_HOST)) return { level: 'coHost', roleKey: AlterRole.CO_HOST };
  if (keys.includes(AlterRole.FRONT_RUNNER)) return { level: 'coHost', roleKey: AlterRole.FRONT_RUNNER };
  for (const key of keys) {
    const family = getRoleFamily(key, customRoles);
    if (family === 'status' || family === 'nature') continue;
    return { level: family, roleKey: key };
  }
  return { level: 'other' };
}

export type OrgMode = 'primary' | 'multi';

export interface OrgBand {
  id: BandId;
  nodes: OrgNode[];
}

/** Un niveau de sous-système (ou la racine, `id === null`) avec ses bandes et ses sous-blocs. */
export interface OrgBlock {
  id: string | null;
  name: string;
  bands: OrgBand[];
  children: OrgBlock[];
  /** Alters distincts dans ce bloc et ses sous-blocs (hôtes et co-hôtes exclus : ils sont en haut). */
  count: number;
}

export interface OrgChart {
  hosts: OrgNode[];
  coHosts: OrgNode[];
  root: OrgBlock;
  hasSubsystems: boolean;
  /** Nombre d'alters distincts affichés (archivés exclus). */
  total: number;
}

/**
 * Mode « toutes les catégories » : une entrée par famille de fonction présente dans les rôles,
 * avec le premier rôle (dans l'ordre de priorité) de chaque famille.
 */
export function getFunctionPlacements(
  keys: string[],
  customRoles: CustomRole[],
): Array<{ family: FunctionFamily; roleKey: string }> {
  const seen = new Set<FunctionFamily>();
  const out: Array<{ family: FunctionFamily; roleKey: string }> = [];
  for (const key of keys) {
    const family = getRoleFamily(key, customRoles);
    if (family === 'status' || family === 'nature' || seen.has(family)) continue;
    seen.add(family);
    out.push({ family, roleKey: key });
  }
  return out;
}

const byName = (a: OrgNode, b: OrgNode) =>
  (a.alter.alterName || '').localeCompare(b.alter.alterName || '');

/**
 * Construit l'organigramme.
 *  - Hôtes et co-hôtes sont toujours en haut, pour tout le système (quel que soit leur sous-système).
 *  - Le reste est rangé par sous-système (arbre `parentId`), puis par bande de fonction.
 *  - mode 'primary' : un alter = une bande (son premier rôle de fonction).
 *  - mode 'multi'   : un alter apparaît dans chaque bande dont il a un rôle ; les hôtes/co-hôtes
 *                     apparaissent aussi dans les bandes de leurs rôles de fonction.
 *  - Sous-systèmes : un parent inconnu, un parent = soi-même ou un cycle ne font rien disparaître,
 *    le sous-système est simplement rattaché à la racine. Un alter dont le sous-système est
 *    inconnu est rangé à la racine.
 *  - Fiche verrouillée : toujours à la racine, dans la bande masquée (ni nom, ni rôle, ni sous-système).
 */
export function buildOrgChart(
  alters: SavedAlter[],
  customRoles: CustomRole[],
  unlockedAlterIds: string[] = [],
  subsystems: Subsystem[] = [],
  mode: OrgMode = 'primary',
): OrgChart {
  const hosts: OrgNode[] = [];
  const coHosts: OrgNode[] = [];
  const validIds = new Set(subsystems.map(sub => sub.id));

  const bandsOf = new Map<string | null, Map<BandId, OrgNode[]>>();
  const idsOf = new Map<string | null, Set<string>>();
  const push = (blockId: string | null, band: BandId, node: OrgNode) => {
    let m = bandsOf.get(blockId);
    if (!m) { m = new Map(); bandsOf.set(blockId, m); }
    const list = m.get(band);
    if (list) list.push(node); else m.set(band, [node]);
    let ids = idsOf.get(blockId);
    if (!ids) { ids = new Set(); idsOf.set(blockId, ids); }
    ids.add(node.alter.id);
  };

  const everyone = new Set<string>();
  for (const alter of alters) {
    if (alter.archived) continue;
    everyone.add(alter.id);

    if (alter.lockPinHash && !unlockedAlterIds.includes(alter.id)) {
      push(null, 'locked', { alter, locked: true });
      continue;
    }

    const keys = getRoleKeys(alter);
    const blockId = alter.subsystemId && validIds.has(alter.subsystemId) ? alter.subsystemId : null;
    const placement = placeAlter(keys, customRoles);
    const isHost = placement.level === 'host';
    const isCoHost = placement.level === 'coHost';
    if (isHost || isCoHost) {
      (isHost ? hosts : coHosts).push({ alter, locked: false, roleKey: placement.roleKey });
    }

    if (mode === 'multi') {
      const places = getFunctionPlacements(keys, customRoles);
      if (places.length > 0) {
        for (const pl of places) push(blockId, pl.family, { alter, locked: false, roleKey: pl.roleKey });
      } else if (!isHost && !isCoHost) {
        push(blockId, 'other', { alter, locked: false });
      }
    } else if (placement.level !== 'host' && placement.level !== 'coHost') {
      push(blockId, placement.level, { alter, locked: false, roleKey: placement.roleKey });
    }
  }

  hosts.sort(byName);
  coHosts.sort(byName);

  // Arbre des sous-systèmes (parents invalides et cycles rattachés à la racine)
  const childrenOf = new Map<string | null, Subsystem[]>();
  for (const sub of subsystems) {
    const parent = sub.parentId && sub.parentId !== sub.id && validIds.has(sub.parentId) ? sub.parentId : null;
    const list = childrenOf.get(parent);
    if (list) list.push(sub); else childrenOf.set(parent, [sub]);
  }
  const reached = new Set<string>();
  const walk = (id: string | null) => {
    for (const sub of childrenOf.get(id) || []) {
      if (reached.has(sub.id)) continue;
      reached.add(sub.id);
      walk(sub.id);
    }
  };
  walk(null);
  for (const sub of subsystems) {
    if (reached.has(sub.id)) continue;
    const rootList = childrenOf.get(null);
    if (rootList) rootList.push(sub); else childrenOf.set(null, [sub]);
    reached.add(sub.id);
    walk(sub.id);
  }

  const order: BandId[] = [...FAMILY_ORDER, 'other', 'locked'];
  const makeBands = (id: string | null): OrgBand[] => {
    const m = bandsOf.get(id);
    const bands: OrgBand[] = [];
    if (!m) return bands;
    for (const bandId of order) {
      const nodes = m.get(bandId);
      if (nodes && nodes.length > 0) bands.push({ id: bandId, nodes: nodes.sort(byName) });
    }
    return bands;
  };

  const buildBlock = (id: string | null, name: string, path: Set<string>): { block: OrgBlock; ids: Set<string> } => {
    const nextPath = id ? new Set(path).add(id) : path;
    const kids = (childrenOf.get(id) || [])
      .filter(sub => !nextPath.has(sub.id))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const built = kids.map(sub => buildBlock(sub.id, sub.name, nextPath));
    const ids = new Set(idsOf.get(id) || []);
    built.forEach(b => b.ids.forEach(x => ids.add(x)));
    return {
      block: { id, name, bands: makeBands(id), children: built.map(b => b.block), count: ids.size },
      ids,
    };
  };

  const root = buildBlock(null, '', new Set()).block;
  return { hosts, coHosts, root, hasSubsystems: subsystems.length > 0, total: everyone.size };
}
