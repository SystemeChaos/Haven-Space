/**
 * switchLogic.ts — Haven Space
 * Règles pures du registre des switchs (testables sans React).
 */

/** Format attendu par <input type="datetime-local"> : heure LOCALE, sans fuseau. */
export function toDateTimeLocal(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Un nouveau switch décrit-il le front ACTUEL ?
 * Non s'il est antérieur au dernier switch enregistré (rétrodatage) ou s'il est déjà terminé : c'est de
 * l'historique, il ne doit ni écraser qui est au front maintenant, ni déclencher une notification.
 */
export function isCurrentFront(
  existingLogs: ReadonlyArray<{ timestamp: number }>,
  startTs: number,
  endTs: number | undefined,
  now: number,
): boolean {
  const isLatest = !existingLogs.some(l => l.timestamp > startTs);
  return isLatest && (endTs === undefined || endTs > now);
}

export type SwitchTimeCheck = 'ok' | 'invalid' | 'end-before-start';

/** Valide début/fin saisis (déjà convertis en timestamps, NaN si illisibles). */
export function checkSwitchTimes(startTs: number, endTs: number | undefined): SwitchTimeCheck {
  if (Number.isNaN(startTs) || (endTs !== undefined && Number.isNaN(endTs))) return 'invalid';
  if (endTs !== undefined && endTs <= startTs) return 'end-before-start';
  return 'ok';
}
