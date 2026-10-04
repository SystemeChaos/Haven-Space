/**
 * SwitchCalendar.tsx — Haven Space
 * « Calendrier de front » : une colonne par alter (avatar en haut), des barres verticales pour les périodes
 * de front, le temps qui défile vers le bas (le plus récent en haut), une plage de dates du → au.
 * Un clic sur une barre ouvre le détail du switch, avec un bouton pour le modifier.
 * Tout est calculé à l'affichage depuis les switchs (voir ../switchCalendar.ts) : rien n'est stocké.
 */

import React, { useMemo, useState } from 'react';
import { Calendar, Lock, Minus, Pencil, Plus, X } from 'lucide-react';
import { SavedAlter, SwitchLog } from '../types';
import { isAlterLocked } from '../journalFolders';
import {
  DAY_MS, ZOOM_LEVELS, buildAxisTicks, buildCalendarColumns, buildFrontIntervals, formatDuration,
  pxPerHourFor, resolveRange, toDateInput,
} from '../switchCalendar';

interface SwitchCalendarProps {
  switchLogs: SwitchLog[];
  savedAlters: SavedAlter[];
  unlockedAlterIds: string[];
  lang: 'fr' | 'en';
  t: any;
  onEditLog?: (log: SwitchLog) => void;
}

const GUTTER = 56;
const COL_MIN = 76;
const PALETTE = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
const BLEND_BG = 'linear-gradient(180deg, #a855f7, #ec4899, #6366f1)';
const LOCKED_COLOR = '#9CA3AF';

export default function SwitchCalendar({ switchLogs, savedAlters, unlockedAlterIds, lang, t, onEditLog }: SwitchCalendarProps) {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const [now] = useState(() => Date.now());
  const [from, setFrom] = useState(() => toDateInput(now - 6 * DAY_MS));
  const [to, setTo] = useState(() => toDateInput(now));
  const [zoom, setZoom] = useState(2);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const range = useMemo(() => resolveRange(from, to, now), [from, to, now]);
  const pxPerHour = range ? pxPerHourFor(range, zoom) : 28;

  const { columns, bodyHeight } = useMemo(() => {
    if (!range) return { columns: [], bodyHeight: 0 };
    return buildCalendarColumns(buildFrontIntervals(switchLogs, now), range, pxPerHour);
  }, [switchLogs, range, pxPerHour, now]);
  const ticks = useMemo(() => (range ? buildAxisTicks(range, pxPerHour) : []), [range, pxPerHour]);

  const alterById = useMemo(() => new Map(savedAlters.map(a => [a.id, a])), [savedAlters]);
  const selectedLog = selectedLogId ? switchLogs.find(l => l.id === selectedLogId) : undefined;

  const fmtDay = (ts: number) => new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const fmtFull = (ts: number) => `${fmtDay(ts)} ${fmtTime(ts)}`;

  const setQuick = (days: number) => {
    setFrom(toDateInput(now - (days - 1) * DAY_MS));
    setTo(toDateInput(now));
    setSelectedLogId(null);
  };

  const gridCols = `${GUTTER}px repeat(${Math.max(columns.length, 1)}, minmax(${COL_MIN}px, 1fr))`;

  const columnInfo = (key: string, alterId: string | undefined, index: number) => {
    if (key === 'blend') {
      return { label: lang === 'fr' ? 'Flou' : 'Blend', color: LOCKED_COLOR, background: BLEND_BG, locked: false, image: '' };
    }
    const alter = alterId ? alterById.get(alterId) : undefined;
    if (!alter) return { label: lang === 'fr' ? 'Alter supprimé' : 'Deleted alter', color: LOCKED_COLOR, background: LOCKED_COLOR, locked: false, image: '' };
    if (isAlterLocked(alter, unlockedAlterIds)) {
      return { label: lang === 'fr' ? 'Verrouillé' : 'Locked', color: LOCKED_COLOR, background: LOCKED_COLOR, locked: true, image: '' };
    }
    const color = alter.alterColor || PALETTE[index % PALETTE.length];
    return { label: alter.alterName || '?', color, background: color, locked: false, image: alter.profileImage || '' };
  };

  const detailNames = (log: SwitchLog): string => {
    if (log.alterIds.length === 0) return lang === 'fr' ? 'Flou / Blend' : 'Blur / Blend';
    return log.alterIds
      .map(id => {
        const al = alterById.get(id);
        if (!al) return lang === 'fr' ? 'Alter supprimé' : 'Deleted alter';
        return isAlterLocked(al, unlockedAlterIds) ? (lang === 'fr' ? 'Fiche verrouillée' : 'Locked profile') : al.alterName;
      })
      .join(', ');
  };

  const chip = (active: boolean) =>
    `px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${
      active ? 'bg-[#273F4F] text-white' : 'bg-app-card hover:bg-app-bg text-[#273F4F]/70 border border-app-border/15'
    }`;
  const dateInput = 'bg-app-card border border-app-border/30 rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20';

  return (
    <div className="space-y-4">
      {/* Plage de dates, raccourcis et zoom */}
      <div className="flex flex-wrap items-center gap-3 bg-app-card/35 px-4 py-3 rounded-xl border border-app-border/15">
        <Calendar className="w-4 h-4 text-[#273F4F] shrink-0" />
        <input type="date" value={from} max={to} onChange={e => { setFrom(e.target.value); setSelectedLogId(null); }} className={dateInput} aria-label={lang === 'fr' ? 'Du' : 'From'} />
        <span className="text-app-muted text-xs">→</span>
        <input type="date" value={to} min={from} max={toDateInput(now)} onChange={e => { setTo(e.target.value); setSelectedLogId(null); }} className={dateInput} aria-label={lang === 'fr' ? 'Au' : 'To'} />
        <div className="flex gap-1">
          <button type="button" onClick={() => setQuick(1)} className={chip(false)}>{lang === 'fr' ? "Aujourd'hui" : 'Today'}</button>
          <button type="button" onClick={() => setQuick(7)} className={chip(false)}>{lang === 'fr' ? '7 j' : '7 d'}</button>
          <button type="button" onClick={() => setQuick(30)} className={chip(false)}>{lang === 'fr' ? '30 j' : '30 d'}</button>
        </div>
        <div className="flex items-center gap-1 ml-auto" role="group" aria-label="Zoom">
          <button type="button" onClick={() => setZoom(z => Math.max(0, z - 1))} disabled={zoom === 0} className="p-1.5 rounded-lg border border-app-border/20 bg-app-card text-app-muted hover:text-app-text disabled:opacity-30" aria-label={lang === 'fr' ? 'Dézoomer' : 'Zoom out'}><Minus className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={() => setZoom(z => Math.min(ZOOM_LEVELS.length - 1, z + 1))} disabled={zoom === ZOOM_LEVELS.length - 1} className="p-1.5 rounded-lg border border-app-border/20 bg-app-card text-app-muted hover:text-app-text disabled:opacity-30" aria-label={lang === 'fr' ? 'Zoomer' : 'Zoom in'}><Plus className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {!range ? (
        <div className="text-center py-10 text-app-muted text-xs font-semibold">
          {lang === 'fr' ? 'Choisis une plage de dates valide (pas dans le futur).' : 'Pick a valid date range (not in the future).'}
        </div>
      ) : columns.length === 0 ? (
        <div className="text-center py-10 bg-app-bg/30 rounded-xl border border-dashed border-app-border/40 text-app-muted text-xs font-semibold">
          {lang === 'fr' ? 'Aucun front sur cette période.' : 'No fronting on this period.'}
        </div>
      ) : (
        <div className="overflow-auto max-h-[620px] rounded-xl border border-app-border/20 bg-app-card/50">
          <div style={{ minWidth: GUTTER + columns.length * COL_MIN }}>
            {/* En-tête collant : un avatar par colonne */}
            <div className="sticky top-0 z-20 grid bg-app-card border-b border-app-border/20" style={{ gridTemplateColumns: gridCols }}>
              <div />
              {columns.map((col, i) => {
                const info = columnInfo(col.key, col.alterId, i);
                return (
                  <div key={col.key} className="flex flex-col items-center gap-1 py-2 px-1 min-w-0">
                    {info.image ? (
                      <img src={info.image} alt="" className="w-9 h-9 rounded-xl object-cover border border-app-border/30" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: info.background }}>
                        {info.locked ? <Lock className="w-4 h-4" /> : info.label.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-app-text truncate max-w-full">{info.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Corps : graduations + colonnes de barres */}
            <div className="relative grid" style={{ gridTemplateColumns: gridCols, height: bodyHeight }}>
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {ticks.map(tk => (
                  <div
                    key={tk.ts}
                    style={{ position: 'absolute', left: 0, right: 0, top: tk.y, borderTop: `1px ${tk.isMidnight ? 'solid' : 'dashed'} var(--color-app-border)`, opacity: tk.isMidnight ? 0.7 : 0.35 }}
                  />
                ))}
              </div>

              <div className="relative">
                <div style={{ position: 'absolute', top: 2, left: 6 }} className="text-[10px] font-black text-app-muted">{fmtDay(range.end)}</div>
                {ticks.map(tk => {
                  if (!tk.isMidnight && tk.y < 16) return null;
                  return (
                    <div key={tk.ts} style={{ position: 'absolute', top: tk.y + 2, left: 6 }} className={`text-[10px] font-mono ${tk.isMidnight ? 'font-black text-app-text' : 'text-app-muted'}`}>
                      {tk.isMidnight ? fmtDay(tk.ts) : `${String(tk.hour).padStart(2, '0')}:00`}
                    </div>
                  );
                })}
              </div>

              {columns.map((col, i) => {
                const info = columnInfo(col.key, col.alterId, i);
                return (
                  <div key={col.key} className="relative">
                    {col.bars.map(bar => {
                      const selected = bar.logId === selectedLogId;
                      const label = `${info.label} — ${fmtFull(bar.start)} → ${bar.ongoing ? (lang === 'fr' ? 'en cours' : 'ongoing') : fmtFull(bar.end)}`;
                      return (
                        <button
                          key={`${bar.logId}-${bar.top}`}
                          type="button"
                          title={label}
                          aria-label={label}
                          aria-pressed={selected}
                          onClick={() => setSelectedLogId(selected ? null : bar.logId)}
                          className="absolute transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                          style={{
                            left: '14%',
                            width: '72%',
                            top: bar.top,
                            height: bar.height,
                            background: info.background,
                            opacity: selectedLogId && !selected ? 0.4 : 0.92,
                            borderRadius: `${bar.clippedTop ? 0 : 8}px ${bar.clippedTop ? 0 : 8}px ${bar.clippedBottom ? 0 : 8}px ${bar.clippedBottom ? 0 : 8}px`,
                            boxShadow: selected ? '0 0 0 2px var(--color-app-text)' : undefined,
                            borderTop: bar.ongoing ? '3px dotted rgba(255,255,255,0.8)' : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Détail du switch sélectionné */}
      {selectedLog && (
        <div className="p-4 bg-app-card/65 rounded-xl border border-app-border/30 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="text-sm font-black text-app-text">{detailNames(selectedLog)}</div>
              {selectedLog.status && selectedLog.status !== 'none' && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-app-bg border border-app-border/40 text-[10px] font-bold text-app-muted">
                  {t?.frontStatuses?.[selectedLog.status] || selectedLog.status}
                </span>
              )}
            </div>
            <button type="button" onClick={() => setSelectedLogId(null)} className="p-1 text-app-muted hover:text-app-text" aria-label={lang === 'fr' ? 'Fermer' : 'Close'}>
              <X className="w-4 h-4" />
            </button>
          </div>
          {(() => {
            const iv = buildFrontIntervals(switchLogs, now).find(x => x.logId === selectedLog.id);
            return (
              <div className="text-[11px] font-mono text-app-muted space-y-0.5">
                <div>↓ {fmtFull(selectedLog.timestamp)}</div>
                {iv && <div>↑ {iv.ongoing ? (lang === 'fr' ? 'en cours' : 'ongoing') : fmtFull(iv.end)} · {formatDuration(iv.end - iv.start, lang)}</div>}
              </div>
            );
          })()}
          {selectedLog.notes && (
            <p className="text-xs text-app-text/80 leading-relaxed bg-app-bg/40 p-2.5 rounded-lg border border-app-border/10 whitespace-pre-line">{selectedLog.notes}</p>
          )}
          {onEditLog && (
            <button
              type="button"
              onClick={() => onEditLog(selectedLog)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-app-accent text-white text-[10px] font-extrabold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <Pencil className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Modifier ce switch' : 'Edit this switch'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
