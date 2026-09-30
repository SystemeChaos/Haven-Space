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

import { AlterRole, CustomRole, RoleFamily, SavedAlter } from './types';

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

export interface OrgNode {
  alter: SavedAlter;
  /** Fiche protégée par son PIN individuel et pas déverrouillée : nom et rôles cachés. */
  locked: boolean;
  /** Rôle (fixe ou id de rôle perso) qui a décidé du placement — affiché sous le nom. */
  roleKey?: string;
}

export interface OrgBand {
  id: BandId;
  nodes: OrgNode[];
}

export interface OrgChart {
  hosts: OrgNode[];
  coHosts: OrgNode[];
  bands: OrgBand[];
  /** Nombre d'alters affichés (archivés exclus). */
  total: number;
}

const isStandardRole = (key: string): key is AlterRole =>
  Object.prototype.hasOwnProperty.call(ROLE_FAMILY, key);

/**
 * Rôles de l'alter dans l'ordre de priorité (le premier compte le plus).
 * Si `roleOrder` existe on le suit ; sinon on retombe sur [rôles fixes, rôles perso],
 * ce qui ne demande aucune migration des fiches existantes.
 */
export function getRoleKeys(alter: SavedAlter): string[] {
  const base: string[] = Array.from(new Set([
    ...((alter.selectedRoles || []) as string[]),
    ...(alter.customRoleIds || []),
  ]));
  if (!alter.roleOrder || alter.roleOrder.length === 0) return base;
  const ordered = alter.roleOrder.filter(k => base.includes(k));
  const rest = base.filter(k => !ordered.includes(k));
  return [...ordered, ...rest];
}

/** Famille d'un rôle fixe ou perso. Un rôle perso sans famille est traité comme « nature » (ignoré). */
export function getRoleFamily(key: string, customRoles: CustomRole[]): RoleFamily {
  if (isStandardRole(key)) return ROLE_FAMILY[key];
  return customRoles.find(r => r.id === key)?.family ?? 'nature';
}

const byName = (a: OrgNode, b: OrgNode) =>
  (a.alter.alterName || '').localeCompare(b.alter.alterName || '');

export function buildOrgChart(
  alters: SavedAlter[],
  customRoles: CustomRole[],
  unlockedAlterIds: string[] = [],
): OrgChart {
  const hosts: OrgNode[] = [];
  const coHosts: OrgNode[] = [];
  const byFamily = new Map<BandId, OrgNode[]>();
  const push = (id: BandId, node: OrgNode) => {
    const list = byFamily.get(id);
    if (list) list.push(node); else byFamily.set(id, [node]);
  };

  let total = 0;
  for (const alter of alters) {
    if (alter.archived) continue;
    total++;

    // Fiche verrouillée : on ne révèle ni son nom ni son rôle, donc pas de placement.
    if (alter.lockPinHash && !unlockedAlterIds.includes(alter.id)) {
      push('locked', { alter, locked: true });
      continue;
    }

    const keys = getRoleKeys(alter);

    // Le statut passe avant tout, quel que soit son rang dans la liste de rôles.
    if (keys.includes(AlterRole.HOST)) {
      hosts.push({ alter, locked: false, roleKey: AlterRole.HOST });
      continue;
    }
    const coKey = keys.includes(AlterRole.CO_HOST)
      ? AlterRole.CO_HOST
      : keys.includes(AlterRole.FRONT_RUNNER) ? AlterRole.FRONT_RUNNER : null;
    if (coKey) {
      coHosts.push({ alter, locked: false, roleKey: coKey });
      continue;
    }

    // Sinon : le premier rôle de fonction (dans l'ordre de priorité) décide de la bande.
    let placed = false;
    for (const key of keys) {
      const family = getRoleFamily(key, customRoles);
      if (family === 'status' || family === 'nature') continue;
      push(family, { alter, locked: false, roleKey: key });
      placed = true;
      break;
    }
    if (!placed) push('other', { alter, locked: false });
  }

  hosts.sort(byName);
  coHosts.sort(byName);

  const bands: OrgBand[] = [];
  const order: BandId[] = [...FAMILY_ORDER, 'other', 'locked'];
  for (const id of order) {
    const nodes = byFamily.get(id);
    if (nodes && nodes.length > 0) bands.push({ id, nodes: nodes.sort(byName) });
  }

  return { hosts, coHosts, bands, total };
}
