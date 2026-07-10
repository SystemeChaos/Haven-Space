/**
 * PlanningPage.tsx — Haven Space
 * Planning façon Bullet Journal : vues quotidienne / hebdomadaire / mensuelle,
 * clés BuJo (tâche, événement, rendez-vous, note, important, urgent, idée,
 * anniversaire, effectué, reporté, en cours), projets et sujets par couleur,
 * assignation d'alters. Adapté aux thèmes (y compris le thème personnalisé).
 */

import React, { useState, useMemo } from 'react';
import {
  Plus, X, ChevronLeft, ChevronRight, Trash2, Pencil, Check, Users,
  Lightbulb, Cake, ArrowDown, ArrowLeftRight, Info, Calendar as CalendarIcon, Bell,
} from 'lucide-react';
import { SavedAlter } from './types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type BuJoType =
  | 'task' | 'event' | 'appointment' | 'note' | 'important' | 'urgent'
  | 'idea' | 'birthday' | 'done' | 'postponed' | 'inProgress';

export interface PlanningEntry {
  id: string;
  date: string;           // 'YYYY-MM-DD' — date de début
  endDate?: string;       // 'YYYY-MM-DD' — date de fin optionnelle, pour une période sur plusieurs jours
  time?: string;           // 'HH:MM', optionnel
  type: BuJoType;
  text: string;
  alterIds?: string[];
  projectLabel?: string;
  projectColor?: string;
  topicLabel?: string;
  topicColor?: string;
  reminderMinutes?: number; // délai de rappel avant l'entrée, en minutes (nécessite une heure définie)
  createdAt: number;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

const STORAGE_KEY = 'heaven_space_planning';

export function loadPlanning(systemId: string = 'main'): PlanningEntry[] {
  try {
    const key = systemId === 'main' ? STORAGE_KEY : `${STORAGE_KEY}_${systemId}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function savePlanning(data: PlanningEntry[], systemId: string = 'main') {
  const key = systemId === 'main' ? STORAGE_KEY : `${STORAGE_KEY}_${systemId}`;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Config des clés BuJo ───────────────────────────────────────────────────

const BUJO_CONFIG: Record<BuJoType, { label: string; labelEn: string; color: string }> = {
  task:       { label: 'À faire',      labelEn: 'Task',        color: '#64748B' },
  event:      { label: 'Événement',    labelEn: 'Event',       color: '#60A5FA' },
  appointment:{ label: 'Rendez-vous',  labelEn: 'Appointment', color: '#34D399' },
  note:       { label: 'Note',         labelEn: 'Note',        color: '#9CA3AF' },
  important:  { label: 'Important',    labelEn: 'Important',   color: '#F97316' },
  urgent:     { label: 'Urgent',       labelEn: 'Urgent',      color: '#EF4444' },
  idea:       { label: 'Idée',         labelEn: 'Idea',        color: '#FBBF24' },
  birthday:   { label: 'Anniversaire', labelEn: 'Birthday',    color: '#F472B6' },
  done:       { label: 'Effectué',     labelEn: 'Done',        color: '#22C55E' },
  postponed:  { label: 'Reporté',      labelEn: 'Postponed',   color: '#A78BFA' },
  inProgress: { label: 'En cours',     labelEn: 'In progress', color: '#22D3EE' },
};

const BUJO_ORDER: BuJoType[] = ['task', 'event', 'appointment', 'note', 'important', 'urgent', 'idea', 'birthday', 'done', 'postponed', 'inProgress'];

const REMINDER_OPTIONS: { value: number; label: string; labelEn: string }[] = [
  { value: 5, label: '5 minutes avant', labelEn: '5 minutes before' },
  { value: 15, label: '15 minutes avant', labelEn: '15 minutes before' },
  { value: 30, label: '30 minutes avant', labelEn: '30 minutes before' },
  { value: 60, label: '1 heure avant', labelEn: '1 hour before' },
  { value: 180, label: '3 heures avant', labelEn: '3 hours before' },
  { value: 1440, label: '1 jour avant', labelEn: '1 day before' },
];

export const REMINDED_STORAGE_KEY = 'heaven_space_planning_reminded';

// Petite puce visuelle par type — mélange de formes CSS simples (fidèles au BuJo papier)
// et d'icônes lucide pour les symboles plus figuratifs.
function BuJoBullet({ type, size = 14 }: { type: BuJoType; size?: number }) {
  const color = BUJO_CONFIG[type].color;
  const s = size;
  switch (type) {
    case 'task':
      return <span style={{ width: s * 0.4, height: s * 0.4, backgroundColor: color, borderRadius: '50%', display: 'inline-block' }} />;
    case 'event':
      return <span style={{ width: s * 0.55, height: s * 0.55, backgroundColor: color, display: 'inline-block' }} />;
    case 'appointment':
      return <span style={{ width: s * 0.55, height: s * 0.55, border: `2px solid ${color}`, borderRadius: '50%', display: 'inline-block' }} />;
    case 'note':
      return <span style={{ width: s * 0.65, height: 2, backgroundColor: color, display: 'inline-block' }} />;
    case 'important':
      return <span style={{ color, fontWeight: 900, fontSize: s, lineHeight: 1 }}>!</span>;
    case 'urgent':
      return (
        <svg width={s * 0.7} height={s * 0.7} viewBox="0 0 10 10">
          <polygon points="5,0 10,10 0,10" fill={color} />
        </svg>
      );
    case 'idea':
      return <Lightbulb size={s * 0.85} color={color} fill={color} fillOpacity={0.15} />;
    case 'birthday':
      return <Cake size={s * 0.85} color={color} />;
    case 'done':
      return <X size={s * 0.85} color={color} strokeWidth={3} />;
    case 'postponed':
      return <ArrowDown size={s * 0.85} color={color} strokeWidth={2.5} />;
    case 'inProgress':
      return <ArrowLeftRight size={s * 0.85} color={color} strokeWidth={2.5} />;
    default:
      return null;
  }
}

// ─── Utilitaires date ───────────────────────────────────────────────────────

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // lundi = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6h à 22h

const WEEKDAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const WEEKDAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Composant principal ────────────────────────────────────────────────────

interface PlanningPageProps {
  savedAlters: SavedAlter[];
  lang: 'fr' | 'en';
  activeSystemId?: string;
}

export default function PlanningPage({ savedAlters, lang, activeSystemId = 'main' }: PlanningPageProps) {
  const [entries, setEntries] = useState<PlanningEntry[]>(() => loadPlanning(activeSystemId));
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [refDate, setRefDate] = useState<Date>(() => new Date());
  const [showLegend, setShowLegend] = useState(false);

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formType, setFormType] = useState<BuJoType>('task');
  const [formText, setFormText] = useState('');
  const [formAlterIds, setFormAlterIds] = useState<string[]>([]);
  const [alterSearchInput, setAlterSearchInput] = useState('');
  const [formProjectLabel, setFormProjectLabel] = useState('');
  const [formProjectColor, setFormProjectColor] = useState('#A78BFA');
  const [formTopicLabel, setFormTopicLabel] = useState('');
  const [formTopicColor, setFormTopicColor] = useState('#60A5FA');
  const [formReminderMinutes, setFormReminderMinutes] = useState<number | ''>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [remindedIds, setRemindedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(REMINDED_STORAGE_KEY) || '[]'); } catch { return []; }
  });

  const persist = (next: PlanningEntry[]) => {
    setEntries(next);
    savePlanning(next, activeSystemId);
  };

  React.useEffect(() => {
    localStorage.setItem(REMINDED_STORAGE_KEY, JSON.stringify(remindedIds));
  }, [remindedIds]);

  const t = (fr: string, en: string) => (lang === 'fr' ? fr : en);
  const weekdayNames = lang === 'fr' ? WEEKDAYS_FR : WEEKDAYS_EN;
  const monthNames = lang === 'fr' ? MONTHS_FR : MONTHS_EN;

  // ─── Navigation de date ───────────────────────────────────────────────────
  const shiftDate = (dir: 1 | -1) => {
    const next = new Date(refDate);
    if (viewMode === 'daily') next.setDate(next.getDate() + dir);
    else if (viewMode === 'weekly') next.setDate(next.getDate() + dir * 7);
    else next.setMonth(next.getMonth() + dir);
    setRefDate(next);
  };

  // ─── Formulaire ───────────────────────────────────────────────────────────
  const openNewEntry = (presetDate?: string, presetTime?: string) => {
    setEditingEntryId(null);
    setFormDate(presetDate || toISODate(refDate));
    setFormEndDate('');
    setFormTime(presetTime || '');
    setFormType('task');
    setFormText('');
    setFormAlterIds([]);
    setAlterSearchInput('');
    setFormProjectLabel('');
    setFormProjectColor('#A78BFA');
    setFormTopicLabel('');
    setFormTopicColor('#60A5FA');
    setFormReminderMinutes('');
    setShowEntryForm(true);
  };

  const openEditEntry = (entry: PlanningEntry) => {
    setEditingEntryId(entry.id);
    setFormDate(entry.date);
    setFormEndDate(entry.endDate || '');
    setFormTime(entry.time || '');
    setFormType(entry.type);
    setFormText(entry.text);
    setFormAlterIds(entry.alterIds || []);
    setAlterSearchInput('');
    setFormProjectLabel(entry.projectLabel || '');
    setFormProjectColor(entry.projectColor || '#A78BFA');
    setFormTopicLabel(entry.topicLabel || '');
    setFormTopicColor(entry.topicColor || '#60A5FA');
    setFormReminderMinutes(entry.reminderMinutes ?? '');
    setShowEntryForm(true);
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim() || !formDate) return;
    // Demande la permission de notification dès qu'un rappel est réellement choisi
    if (formReminderMinutes !== '' && formTime && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (editingEntryId) {
      persist(entries.map(en => en.id === editingEntryId ? {
        ...en,
        date: formDate,
        endDate: (formEndDate && formEndDate > formDate) ? formEndDate : undefined,
        time: formTime || undefined,
        type: formType,
        text: formText.trim(),
        alterIds: formAlterIds.length > 0 ? formAlterIds : undefined,
        projectLabel: formProjectLabel.trim() || undefined,
        projectColor: formProjectLabel.trim() ? formProjectColor : undefined,
        topicLabel: formTopicLabel.trim() || undefined,
        topicColor: formTopicLabel.trim() ? formTopicColor : undefined,
        reminderMinutes: (formReminderMinutes !== '' && formTime) ? Number(formReminderMinutes) : undefined,
      } : en));
      setRemindedIds(prev => prev.filter(id => id !== editingEntryId));
    } else {
      const newEntry: PlanningEntry = {
        id: 'pl-' + Math.random().toString(36).slice(2, 10),
        date: formDate,
        endDate: (formEndDate && formEndDate > formDate) ? formEndDate : undefined,
        time: formTime || undefined,
        type: formType,
        text: formText.trim(),
        alterIds: formAlterIds.length > 0 ? formAlterIds : undefined,
        projectLabel: formProjectLabel.trim() || undefined,
        projectColor: formProjectLabel.trim() ? formProjectColor : undefined,
        topicLabel: formTopicLabel.trim() || undefined,
        topicColor: formTopicLabel.trim() ? formTopicColor : undefined,
        reminderMinutes: (formReminderMinutes !== '' && formTime) ? Number(formReminderMinutes) : undefined,
        createdAt: Date.now(),
      };
      persist([...entries, newEntry]);
    }
    setShowEntryForm(false);
  };

  const executeDelete = (id: string) => {
    persist(entries.filter(en => en.id !== id));
    setDeleteConfirmId(null);
  };

  const toggleFormAlter = (alterId: string) => {
    setFormAlterIds(prev => prev.includes(alterId) ? prev.filter(id => id !== alterId) : [...prev, alterId]);
  };

  // ─── Rendu d'une entrée compacte ──────────────────────────────────────────
  const renderEntryRow = (entry: PlanningEntry, compact = false) => {
    const alters = (entry.alterIds || []).map(id => savedAlters.find(a => a.id === id)).filter(Boolean) as SavedAlter[];
    return (
      <div
        key={entry.id}
        onClick={compact ? () => openEditEntry(entry) : undefined}
        className={`group flex items-start gap-2 rounded-xl hover:bg-app-accent/5 transition-colors ${compact ? 'px-1.5 py-1 cursor-pointer' : 'px-2.5 py-2'}`}
      >
        <span className="mt-1 flex-shrink-0 flex items-center justify-center" style={{ width: compact ? 12 : 16, height: compact ? 12 : 16 }}>
          <BuJoBullet type={entry.type} size={compact ? 12 : 16} />
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-app-text leading-snug ${compact ? 'text-[10px] truncate' : 'text-xs'}`}>
            {entry.time && <span className="text-app-muted font-mono mr-1">{entry.time}</span>}
            {entry.text}
          </p>
          {!compact && (entry.projectLabel || entry.topicLabel || alters.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.projectLabel && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ color: entry.projectColor, borderColor: `${entry.projectColor}50`, backgroundColor: `${entry.projectColor}15` }}>
                  {entry.projectLabel}
                </span>
              )}
              {entry.topicLabel && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ color: entry.topicColor, borderColor: `${entry.topicColor}50`, backgroundColor: `${entry.topicColor}15` }}>
                  {entry.topicLabel}
                </span>
              )}
              {alters.map(a => (
                <span key={a.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-app-bg border border-app-border/40 text-app-muted flex items-center gap-1">
                  {a.profileImage
                    ? <img src={a.profileImage} className="w-3 h-3 rounded-full object-cover" alt="" />
                    : <span className="w-3 h-3 rounded-full bg-app-accent/20 flex items-center justify-center text-[7px] text-app-accent font-black">{a.alterName.charAt(0)}</span>
                  }
                  {a.alterName}
                </span>
              ))}
            </div>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => openEditEntry(entry)} className="p-1 text-app-muted hover:text-app-accent transition-colors"><Pencil className="w-3 h-3" /></button>
            <button onClick={() => setDeleteConfirmId(entry.id)} className="p-1 text-app-muted hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
          </div>
        )}
      </div>
    );
  };

  // ─── Vue quotidienne ──────────────────────────────────────────────────────
  const renderDaily = () => {
    const dateStr = toISODate(refDate);
    const dayEntries = entries.filter(en => en.date <= dateStr && (en.endDate || en.date) >= dateStr).sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
    const untimed = dayEntries.filter(en => !en.time);
    const timed = dayEntries.filter(en => en.time);

    return (
      <div className="bg-app-card border border-app-border rounded-3xl p-5 md:p-7 space-y-5">
        {untimed.length > 0 && (
          <div className="space-y-1 pb-4 border-b border-app-border/30">
            <p className="text-[9px] font-black uppercase tracking-widest text-app-muted mb-1">{t('Toute la journée', 'All day')}</p>
            {untimed.map(en => renderEntryRow(en))}
          </div>
        )}
        <div className="space-y-0.5">
          {HOURS.map(h => {
            const hourStr = String(h).padStart(2, '0') + ':00';
            const hourEntries = timed.filter(en => en.time && parseInt(en.time.split(':')[0], 10) === h);
            return (
              <div key={h} className="flex gap-3 border-b border-app-border/20 py-1.5 group/hour">
                <span className="text-[10px] font-mono font-bold text-app-muted w-9 flex-shrink-0 pt-1">{h}h</span>
                <div className="flex-1 min-w-0">
                  {hourEntries.length > 0 ? (
                    <div className="space-y-0.5">{hourEntries.map(en => renderEntryRow(en))}</div>
                  ) : (
                    <button
                      onClick={() => openNewEntry(dateStr, hourStr)}
                      className="w-full text-left text-[10px] text-app-muted/0 group-hover/hour:text-app-muted/60 py-1.5 transition-colors"
                    >
                      + {t('Ajouter', 'Add')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Vue hebdomadaire ─────────────────────────────────────────────────────
  const renderWeekly = () => {
    const start = startOfWeek(refDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {days.map((d, i) => {
          const dateStr = toISODate(d);
          const dayEntries = entries.filter(en => en.date <= dateStr && (en.endDate || en.date) >= dateStr).sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
          const isToday = toISODate(new Date()) === dateStr;
          return (
            <div key={dateStr} className={`bg-app-card border rounded-2xl p-3.5 space-y-1.5 min-h-[9rem] ${isToday ? 'border-app-accent/50 ring-1 ring-app-accent/20' : 'border-app-border'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-app-text">
                  {weekdayNames[i]} <span className="text-app-muted font-mono normal-case">{d.getDate()}</span>
                </p>
                <button onClick={() => openNewEntry(dateStr)} className="text-app-muted hover:text-app-accent transition-colors"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              {dayEntries.length === 0 ? (
                <p className="text-[10px] text-app-muted/50 italic">—</p>
              ) : (
                dayEntries.map(en => renderEntryRow(en, true))
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Vue mensuelle ────────────────────────────────────────────────────────
  const renderMonthly = () => {
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // lundi = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [
      ...Array(leadingBlanks).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="bg-app-card border border-app-border rounded-3xl p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekdayNames.map(w => (
            <div key={w} className="text-center text-[9px] font-black uppercase tracking-widest text-app-muted py-1">{w.slice(0, 3)}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const dateStr = toISODate(d);
            const dayEntries = entries.filter(en => en.date <= dateStr && (en.endDate || en.date) >= dateStr);
            const isToday = toISODate(new Date()) === dateStr;
            return (
              <button
                key={i}
                onClick={() => { setRefDate(d); setViewMode('daily'); }}
                className={`aspect-square rounded-xl border p-1.5 flex flex-col items-start hover:border-app-accent/50 transition-colors text-left ${isToday ? 'border-app-accent bg-app-accent/5' : 'border-app-border/40 bg-app-bg/40'}`}
              >
                <span className={`text-[10px] font-bold ${isToday ? 'text-app-accent' : 'text-app-text'}`}>{d.getDate()}</span>
                <div className="flex flex-wrap gap-0.5 mt-auto">
                  {dayEntries.slice(0, 4).map(en => (
                    <span key={en.id} className="flex items-center justify-center" style={{ width: 7, height: 7 }}>
                      <BuJoBullet type={en.type} size={7} />
                    </span>
                  ))}
                  {dayEntries.length > 4 && <span className="text-[7px] text-app-muted font-bold">+{dayEntries.length - 4}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const dateLabel = useMemo(() => {
    if (viewMode === 'daily') {
      return `${weekdayNames[(refDate.getDay() + 6) % 7]} ${refDate.getDate()} ${monthNames[refDate.getMonth()]} ${refDate.getFullYear()}`;
    }
    if (viewMode === 'weekly') {
      const start = startOfWeek(refDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getDate()} ${monthNames[start.getMonth()]} — ${end.getDate()} ${monthNames[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${monthNames[refDate.getMonth()]} ${refDate.getFullYear()}`;
  }, [viewMode, refDate, lang]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-app-text">{t('Planning', 'Planning')}</h2>
          <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t('Organise ton système, façon Bullet Journal', 'Organize your system, Bullet Journal style')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLegend(o => !o)} className="p-2.5 rounded-xl border border-app-border text-app-muted hover:text-app-text hover:border-app-accent/40 transition-colors">
            <Info className="w-4 h-4" />
          </button>
          <button onClick={() => openNewEntry()} className="flex items-center gap-2 px-4 py-2.5 bg-app-accent text-app-accent-text rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            {t('Ajouter', 'Add')}
          </button>
        </div>
      </div>

      {/* Légende */}
      {showLegend && (
        <div className="bg-app-card border border-app-border rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2.5">
          {BUJO_ORDER.map(type => (
            <div key={type} className="flex items-center gap-2">
              <span className="flex items-center justify-center flex-shrink-0" style={{ width: 16, height: 16 }}>
                <BuJoBullet type={type} size={16} />
              </span>
              <span className="text-[10px] font-bold text-app-text">{lang === 'fr' ? BUJO_CONFIG[type].label : BUJO_CONFIG[type].labelEn}</span>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 md:col-span-4 text-[10px] text-app-muted leading-relaxed pt-1 border-t border-app-border/30 mt-1">
            {t(
              '✦ Projet et Sujet sont des étiquettes de couleur libre, à choisir en ajoutant une entrée, pour classer par thématique.',
              '✦ Project and Topic are free-color labels, chosen when adding an entry, to sort by theme.'
            )}
          </div>
        </div>
      )}

      {/* Sélecteur de vue + navigation de date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-app-card border border-app-border rounded-xl p-1">
          {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === mode ? 'bg-app-accent text-app-accent-text' : 'text-app-muted hover:text-app-text'}`}
            >
              {mode === 'daily' ? t('Quotidien', 'Daily') : mode === 'weekly' ? t('Hebdomadaire', 'Weekly') : t('Mensuel', 'Monthly')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg border border-app-border text-app-muted hover:text-app-text transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setRefDate(new Date())} className="px-3 py-2 rounded-lg border border-app-border text-[10px] font-black uppercase tracking-widest text-app-text hover:border-app-accent/40 transition-colors flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            {t('Aujourd\'hui', 'Today')}
          </button>
          <button onClick={() => shiftDate(1)} className="p-2 rounded-lg border border-app-border text-app-muted hover:text-app-text transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <p className="text-sm font-black uppercase tracking-wider text-app-text">{dateLabel}</p>

      {/* Contenu */}
      {viewMode === 'daily' && renderDaily()}
      {viewMode === 'weekly' && renderWeekly()}
      {viewMode === 'monthly' && renderMonthly()}

      {/* Formulaire d'ajout / édition */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEntryForm(false)}>
          <form
            onSubmit={handleSubmitEntry}
            onClick={e => e.stopPropagation()}
            className="bg-app-card border border-app-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-app-text">
                {editingEntryId ? t('Modifier l\'entrée', 'Edit entry') : t('Nouvelle entrée', 'New entry')}
              </h3>
              <button type="button" onClick={() => setShowEntryForm(false)} className="text-app-muted hover:text-app-text transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Type', 'Type')}</label>
              <div className="grid grid-cols-4 gap-1.5">
                {BUJO_ORDER.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormType(type)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 min-h-[4.5rem] rounded-xl border transition-colors ${formType === type ? 'border-app-accent bg-app-accent/10' : 'border-app-border/40 hover:border-app-accent/30'}`}
                  >
                    <BuJoBullet type={type} size={16} />
                    <span className="text-[8.5px] font-bold text-app-muted leading-tight text-center break-words">{lang === 'fr' ? BUJO_CONFIG[type].label : BUJO_CONFIG[type].labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Texte */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Description', 'Description')}</label>
              <input
                type="text" autoFocus value={formText} onChange={e => setFormText(e.target.value)}
                placeholder={t('Quoi ?', 'What?')}
                className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/20"
              />
            </div>

            {/* Date + heure */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Date', 'Date')}</label>
                <input
                  type="date" value={formDate} onChange={e => setFormDate(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Jusqu\'au (optionnel)', 'Until (optional)')}</label>
                <input
                  type="date" value={formEndDate} min={formDate} onChange={e => setFormEndDate(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Heure (optionnel)', 'Time (optional)')}</label>
                <input
                  type="time" value={formTime} onChange={e => setFormTime(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
            </div>

            {formTime && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted flex items-center gap-1.5">
                  <Bell className="w-3 h-3" /> {t('Rappel (optionnel)', 'Reminder (optional)')}
                </label>
                <select
                  value={formReminderMinutes}
                  onChange={e => setFormReminderMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                >
                  <option value="">{t('Aucun rappel', 'No reminder')}</option>
                  {REMINDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{lang === 'fr' ? opt.label : opt.labelEn}</option>
                  ))}
                </select>
                <p className="text-[9px] text-app-muted">
                  {t('Une notification s\'affiche si l\'app est ouverte au moment du rappel.', 'A notification appears if the app is open at reminder time.')}
                </p>
              </div>
            )}

            {/* Alters assignés */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {t('Alters concernés (optionnel)', 'Alters involved (optional)')}
              </label>

              {formAlterIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formAlterIds.map(id => {
                    const a = savedAlters.find(al => al.id === id);
                    if (!a) return null;
                    return (
                      <button
                        key={id} type="button" onClick={() => toggleFormAlter(id)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-app-accent bg-app-accent/10 text-app-accent text-[10px] font-bold transition-colors"
                      >
                        {a.profileImage
                          ? <img src={a.profileImage} className="w-4 h-4 rounded-full object-cover" alt="" />
                          : <span className="w-4 h-4 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] text-app-accent font-black">{a.alterName.charAt(0)}</span>
                        }
                        {a.alterName}
                        <X className="w-2.5 h-2.5" />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={alterSearchInput}
                  onChange={e => setAlterSearchInput(e.target.value)}
                  placeholder={t('Rechercher un alter...', 'Search an alter...')}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
                {alterSearchInput.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 z-20 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden max-h-40 overflow-y-auto">
                    {savedAlters
                      .filter(a => !formAlterIds.includes(a.id))
                      .filter(a => a.alterName.toLowerCase().includes(alterSearchInput.toLowerCase()))
                      .slice(0, 6)
                      .map(a => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => { toggleFormAlter(a.id); setAlterSearchInput(''); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-app-bg transition-colors text-left text-app-text"
                        >
                          {a.profileImage
                            ? <img src={a.profileImage} className="w-6 h-6 rounded-full object-cover flex-shrink-0" alt="" />
                            : <div className="w-6 h-6 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{a.alterName.charAt(0)}</div>
                          }
                          {a.alterName}
                        </button>
                      ))}
                    {savedAlters.filter(a => !formAlterIds.includes(a.id)).filter(a => a.alterName.toLowerCase().includes(alterSearchInput.toLowerCase())).length === 0 && (
                      <p className="px-3 py-2 text-xs text-app-muted">{t('Aucun résultat', 'No results')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Projet */}
            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Projet (optionnel)', 'Project (optional)')}</label>
                <input
                  type="text" value={formProjectLabel} onChange={e => setFormProjectLabel(e.target.value)}
                  placeholder={t('Nom du projet...', 'Project name...')}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
              <input type="color" value={formProjectColor} onChange={e => setFormProjectColor(e.target.value)} className="w-9 h-9 rounded-xl border border-app-border cursor-pointer" />
            </div>

            {/* Sujet */}
            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{t('Sujet (optionnel)', 'Topic (optional)')}</label>
                <input
                  type="text" value={formTopicLabel} onChange={e => setFormTopicLabel(e.target.value)}
                  placeholder={t('Ex: Travail, Santé...', 'E.g. Work, Health...')}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
              <input type="color" value={formTopicColor} onChange={e => setFormTopicColor(e.target.value)} className="w-9 h-9 rounded-xl border border-app-border cursor-pointer" />
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-app-accent text-app-accent-text rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                <Check className="w-4 h-4" />
                {editingEntryId ? t('Enregistrer', 'Save') : t('Ajouter', 'Add')}
              </button>
              <button type="button" onClick={() => setShowEntryForm(false)} className="px-4 py-2.5 border border-app-border rounded-xl text-xs font-bold uppercase tracking-widest text-app-muted hover:text-app-text transition-colors">
                {t('Annuler', 'Cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation de suppression */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black uppercase tracking-wider text-app-text">{t('Supprimer cette entrée ?', 'Delete this entry?')}</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => executeDelete(deleteConfirmId)} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all">
                {t('Supprimer', 'Delete')}
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all">
                {t('Annuler', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
