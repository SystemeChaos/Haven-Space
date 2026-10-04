/**
 * switchCalendar.ts — Haven Space
 *
 * Logique pure du « Calendrier de front » (colonnes par alter, temps qui défile verticalement, le plus
 * récent en haut) : sans React, sans stockage, testable seule.
 *
 * Règle de durée d'un switch — la MÊME que la chronologie (ribbon) et la durée affichée dans l'historique :
 *   fin = « sortie » saisie si elle est valide, sinon début du switch suivant, sinon maintenant.
 * Un switch « none » (retrait du front) ne dessine rien : il sert uniquement de borne de fin.
 */

import { SwitchLog } from './types';

export const HOUR_MS = 3_600_000;
export const DAY_MS = 86_400_000;

export interface FrontInterval {
  logId: string;
  alterIds: string[];
  /** « Flou / Blend » : pas d'alter précis, une colonne dédiée. */
  isBlend: boolean;
  status?: string;
  start: number;
  end: number;
  /** Toujours en cours : pas de sortie et pas de switch suivant (ou sortie dans le futur). */
  ongoing: boolean;
}

export function buildFrontIntervals(logs: ReadonlyArray<SwitchLog>, now: number): FrontInterval[] {
  const sorted = [...logs].sort((a, b) => a.timestamp - b.timestamp);
  const out: FrontInterval[] = [];
  sorted.forEach((log, i) => {
    if (log.status === 'none') return;
    const isBlend = log.status === 'blend' && log.alterIds.length === 0;
    if (!isBlend && log.alterIds.length === 0) return; // personne : rien à dessiner
    const next = sorted[i + 1];
    const explicitEnd = log.endTimestamp !== undefined && log.endTimestamp > log.timestamp ? log.endTimestamp : undefined;
    const rawEnd = explicitEnd ?? next?.timestamp ?? now;
    const end = Math.min(rawEnd, now); // le calendrier ne montre jamais le futur
    if (end <= log.timestamp) return;
    const ongoing = explicitEnd === undefined ? !next : explicitEnd > now;
    out.push({ logId: log.id, alterIds: log.alterIds, isBlend, status: log.status, start: log.timestamp, end, ongoing });
  });
  return out;
}

// --- Plage de dates ----------------------------------------------------------------------------------
export const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** « YYYY-MM-DD » (champ <input type="date">) → minuit local ; NaN si illisible. */
export function parseDateInput(value: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!m) return NaN;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0).getTime();
}

export function toDateInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export interface CalendarRange { start: number; end: number }

/**
 * Plage affichée : du début du jour « du » jusqu'à la fin du jour « au » (inclus), sans dépasser « maintenant ».
 * Dates inversées : on les remet dans l'ordre. Dates illisibles ou entièrement dans le futur : null.
 */
export function resolveRange(fromStr: string, toStr: string, now: number): CalendarRange | null {
  let a = parseDateInput(fromStr);
  let b = parseDateInput(toStr);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  if (a > b) [a, b] = [b, a];
  const start = a;
  const nextMidnight = new Date(b);
  nextMidnight.setDate(nextMidnight.getDate() + 1); // fin de journée correcte même aux changements d'heure
  const end = Math.min(nextMidnight.getTime(), now);
  if (end <= start) return null;
  return { start, end };
}

// --- Échelle ---------------------------------------------------------------------------------------------
export const ZOOM_LEVELS = [8, 16, 28, 48]; // pixels par heure
const MAX_BODY_PX = 30_000; // garde-fou : une plage énorme ne doit pas fabriquer une page infinie

export function pxPerHourFor(range: CalendarRange, zoomIndex: number): number {
  const base = ZOOM_LEVELS[Math.max(0, Math.min(ZOOM_LEVELS.length - 1, zoomIndex))];
  const hours = (range.end - range.start) / HOUR_MS;
  return Math.max(1, Math.min(base, MAX_BODY_PX / Math.max(hours, 1)));
}

export interface AxisTick {
  ts: number;
  /** Position verticale en pixels depuis le haut (haut = fin de plage). */
  y: number;
  hour: number;
  isMidnight: boolean;
  /** Étiquette horaire affichée ? (les minuits sont toujours affichés comme jour.) */
  labelled: boolean;
}

const LABEL_STEPS = [1, 2, 3, 6, 12, 24];

export function buildAxisTicks(range: CalendarRange, pxPerHour: number): AxisTick[] {
  const step = LABEL_STEPS.find(s => s * pxPerHour >= 40) ?? 24;
  const ticks: AxisTick[] = [];
  const d = new Date(range.end);
  d.setMinutes(0, 0, 0);
  for (let guard = 0; d.getTime() >= range.start && guard < 24 * 400; guard++) {
    const ts = d.getTime();
    const hour = d.getHours();
    const isMidnight = hour === 0;
    if (ts <= range.end && (isMidnight || hour % step === 0)) {
      ticks.push({ ts, y: ((range.end - ts) / HOUR_MS) * pxPerHour, hour, isMidnight, labelled: isMidnight || hour % step === 0 });
    }
    d.setHours(d.getHours() - 1);
  }
  return ticks;
}

// --- Colonnes et barres ------------------------------------------------------------------------------------
export interface CalendarBar {
  logId: string;
  status?: string;
  ongoing: boolean;
  start: number; // début réel (non rogné)
  end: number;   // fin réelle (non rognée)
  top: number;
  height: number;
  /** La barre déborde de la plage vers le haut / vers le bas. */
  clippedTop: boolean;
  clippedBottom: boolean;
}

export interface CalendarColumn {
  key: string; // 'alter:<id>' | 'blend'
  alterId?: string;
  totalMs: number;
  bars: CalendarBar[];
}

const MIN_BAR_PX = 4;

export function buildCalendarColumns(
  intervals: ReadonlyArray<FrontInterval>,
  range: CalendarRange,
  pxPerHour: number,
): { columns: CalendarColumn[]; bodyHeight: number } {
  const byKey = new Map<string, CalendarColumn>();
  const bodyHeight = ((range.end - range.start) / HOUR_MS) * pxPerHour;

  const add = (key: string, alterId: string | undefined, iv: FrontInterval) => {
    const s = Math.max(iv.start, range.start);
    const e = Math.min(iv.end, range.end);
    if (e <= s) return;
    let col = byKey.get(key);
    if (!col) { col = { key, alterId, totalMs: 0, bars: [] }; byKey.set(key, col); }
    col.totalMs += e - s;
    col.bars.push({
      logId: iv.logId,
      status: iv.status,
      ongoing: iv.ongoing,
      start: iv.start,
      end: iv.end,
      top: ((range.end - e) / HOUR_MS) * pxPerHour,
      height: Math.max(MIN_BAR_PX, ((e - s) / HOUR_MS) * pxPerHour),
      clippedTop: iv.end > range.end,
      clippedBottom: iv.start < range.start,
    });
  };

  for (const iv of intervals) {
    if (iv.isBlend) add('blend', undefined, iv);
    else for (const id of iv.alterIds) add(`alter:${id}`, id, iv);
  }

  // Colonnes les plus présentes d'abord ; le flou en dernier ; à égalité, par clé (ordre stable).
  const columns = [...byKey.values()].sort((x, y) => {
    if (x.key === 'blend') return 1;
    if (y.key === 'blend') return -1;
    return y.totalMs - x.totalMs || x.key.localeCompare(y.key);
  });
  return { columns, bodyHeight };
}

export function formatDuration(ms: number, lang: 'fr' | 'en'): string {
  const mins = Math.max(0, Math.round(ms / 60000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const rest = mins % 60;
  if (days > 0) return `${days}${lang === 'fr' ? ' j' : 'd'} ${hours}h`;
  if (hours > 0) return `${hours}h ${String(rest).padStart(2, '0')}m`;
  return `${rest} ${lang === 'fr' ? 'min' : 'min'}`;
}
