/**
 * UnknownProfilePage.tsx — Haven Space
 * « Qui suis-je ? » : accueil bienveillant, court parcours de questions (toutes facultatives), liste des fiches
 * « en attente », et rattachement d'une fiche à Mon Système (système principal, sous-système ou système parallèle).
 * Les fiches en attente vivent À PART de Mon Système (voir unknownProfiles.ts) : rien ici ne touche aux autres listes
 * tant qu'on n'a pas validé le rattachement.
 */

import React, { useState } from 'react';
import { HelpCircle, Trash2 } from 'lucide-react';
import { Subsystem } from './types';
import { Lang, tr, trf, localeOf } from './i18n';
import {
  AnswerValue, AttachTarget, QUESTIONS, QuestionDef, UnknownProfile, createProfile, describeAnswer, profileLabel,
} from './unknownProfiles';

interface Props {
  lang: Lang;
  profiles: UnknownProfile[];
  onProfilesChange: (next: UnknownProfile[]) => void;
  subsystems: Subsystem[];
  parallelSystems: Array<{ id: string; name: string }>;
  mainSystemName?: string;
  onAttach: (profile: UnknownProfile, name: string, target: AttachTarget) => void;
  onOpenSystem: () => void;
  onGoGrounding: () => void;
}

type View = 'home' | 'questions' | 'attach';

const card = 'bg-app-card border border-app-border/40 rounded-2xl p-4 space-y-3';
const cap = 'text-[10px] font-black uppercase tracking-widest text-app-muted';
const primaryBtn = 'px-5 py-3 min-h-[44px] rounded-xl bg-app-accent text-white text-xs font-extrabold uppercase tracking-widest hover:opacity-90 disabled:opacity-40 transition-opacity';
const lightBtn = 'px-5 py-3 min-h-[44px] rounded-xl bg-app-card border border-app-border text-xs font-black uppercase tracking-wider text-app-text hover:border-app-accent/40 transition-colors';
const chipBase = 'px-3.5 py-2.5 min-h-[44px] rounded-full border text-sm font-semibold transition-colors';

export default function UnknownProfilePage({
  lang, profiles, onProfilesChange, subsystems, parallelSystems, mainSystemName, onAttach, onOpenSystem, onGoGrounding,
}: Props) {
  const [view, setView] = useState<View>('home');
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [notice, setNotice] = useState<{ text: string; canOpenSystem?: boolean } | null>(null);
  const [attachId, setAttachId] = useState<string | null>(null);
  const [attachName, setAttachName] = useState('');
  const [attachTarget, setAttachTarget] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fmtDate = (ts: number) => new Date(ts).toLocaleString(localeOf(lang), { dateStyle: 'long', timeStyle: 'short' });
  const setAnswer = (id: string, v: AnswerValue | undefined) =>
    setAnswers(prev => { const next = { ...prev }; if (v === undefined) delete next[id]; else next[id] = v; return next; });

  // --- Questions -------------------------------------------------------------------------------------
  const renderControl = (q: QuestionDef) => {
    const v = answers[q.id];
    if (q.kind === 'slider') {
      const mid = Math.round((q.min + q.max) / 2);
      const shown = typeof v === 'number' ? v : mid;
      return (
        <div className="space-y-2">
          <input
            type="range" min={q.min} max={q.max} step={1} value={shown}
            onChange={e => setAnswer(q.id, Number(e.target.value))}
            aria-label={tr(lang, q.fr, q.en)}
            aria-valuetext={typeof v === 'number' ? describeAnswer(q, v, lang) : tr(lang, 'pas encore répondu', 'not answered yet')}
            className="w-full accent-[#273F4F]"
          />
          <div className="flex justify-between text-xs text-app-muted">
            <span>{tr(lang, q.left.fr, q.left.en)}</span>
            <span>{tr(lang, q.right.fr, q.right.en)}</span>
          </div>
          <div className="text-xs font-bold text-app-text min-h-[1rem]">
            {typeof v === 'number'
              ? (q.rightIsOpenEnded ? describeAnswer(q, v, lang) : `${v} / ${q.max}`)
              : v === undefined ? <span className="text-app-muted font-medium">{tr(lang, 'Pas encore répondu', 'Not answered yet')}</span> : null}
          </div>
          {q.otherOption && (
            <button
              type="button" aria-pressed={v === q.otherOption.id}
              onClick={() => setAnswer(q.id, v === q.otherOption!.id ? undefined : q.otherOption!.id)}
              className={`${chipBase} ${v === q.otherOption.id ? 'bg-app-accent text-white border-transparent' : 'bg-app-card text-app-text border-app-border hover:border-app-accent/40'}`}
            >
              {tr(lang, q.otherOption.fr, q.otherOption.en)}
            </button>
          )}
        </div>
      );
    }
    if (q.kind === 'steps') {
      const shown = typeof v === 'number' ? v : Math.floor(q.steps.length / 2);
      return (
        <div className="space-y-2">
          <input
            type="range" min={0} max={q.steps.length - 1} step={1} value={shown}
            onChange={e => setAnswer(q.id, Number(e.target.value))}
            aria-label={tr(lang, q.fr, q.en)}
            aria-valuetext={typeof v === 'number' ? describeAnswer(q, v, lang) : tr(lang, 'pas encore répondu', 'not answered yet')}
            className="w-full accent-[#273F4F]"
          />
          <div className="flex justify-between gap-1 text-[11px] text-app-muted">
            {q.steps.map(s => <span key={s.id} className="flex-1 text-center">{tr(lang, s.fr, s.en)}</span>)}
          </div>
          <div className="text-xs font-bold text-app-text min-h-[1rem]">
            {typeof v === 'number' ? describeAnswer(q, v, lang) : <span className="text-app-muted font-medium">{tr(lang, 'Pas encore répondu', 'Not answered yet')}</span>}
          </div>
        </div>
      );
    }
    const selected: string[] = q.kind === 'multi' ? (Array.isArray(v) ? v : []) : (typeof v === 'string' ? [v] : []);
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label={tr(lang, q.fr, q.en)}>
        {q.options.map(op => {
          const on = selected.includes(op.id);
          return (
            <button
              key={op.id} type="button" aria-pressed={on}
              onClick={() => {
                if (q.kind === 'single') setAnswer(q.id, on ? undefined : op.id);
                else { const next = on ? selected.filter(x => x !== op.id) : [...selected, op.id]; setAnswer(q.id, next.length ? next : undefined); }
              }}
              className={`${chipBase} ${on ? 'bg-app-accent text-white border-transparent' : 'bg-app-card text-app-text border-app-border hover:border-app-accent/40'}`}
            >
              {tr(lang, op.fr, op.en)}
            </button>
          );
        })}
      </div>
    );
  };

  const saveProfile = () => {
    const created = createProfile(answers, profiles);
    onProfilesChange([...profiles, created]);
    setAnswers({});
    setView('home');
    setNotice({ text: trf(lang, '{0} enregistrée. Elle reste à part de Mon Système tant que tu ne l’as pas rattachée.', '{0} saved. It stays separate from My System until you attach it.', [profileLabel(lang, created.number)]) });
  };

  // --- Rattachement ----------------------------------------------------------------------------------
  const targetOptions: Array<{ key: string; label: string; target: AttachTarget }> = [
    { key: 'main', label: mainSystemName || tr(lang, 'Système principal', 'Main system'), target: { systemId: 'main' } },
    ...subsystems.map(s => {
      const parent = s.systemId && s.systemId !== 'main' ? parallelSystems.find(p => p.id === s.systemId)?.name : undefined;
      return {
        key: `sub:${s.id}`,
        label: trf(lang, 'Sous-système : {0}', 'Subsystem: {0}', [parent ? `${s.name} (${parent})` : s.name]),
        target: { systemId: s.systemId || 'main', subsystemId: s.id },
      };
    }),
    ...parallelSystems.map(p => ({ key: `sys:${p.id}`, label: trf(lang, 'Système parallèle : {0}', 'Parallel system: {0}', [p.name]), target: { systemId: p.id } })),
  ];

  const startAttach = (p: UnknownProfile) => {
    setAttachId(p.id); setAttachName(profileLabel(lang, p.number)); setAttachTarget(''); setView('attach');
  };
  const attachProfile = profiles.find(p => p.id === attachId);
  const confirmAttach = () => {
    const opt = targetOptions.find(t => t.key === attachTarget);
    if (!attachProfile || !opt) return;
    onAttach(attachProfile, attachName, opt.target);
    setView('home'); setAttachId(null);
    setNotice({ text: trf(lang, '{0} fait maintenant partie de Mon Système.', '{0} is now part of My System.', [attachName.trim() || profileLabel(lang, attachProfile.number)]), canOpenSystem: true });
  };

  // --- Rendu -----------------------------------------------------------------------------------------
  if (view === 'questions') {
    return (
      <div className="space-y-4 w-full max-w-xl mx-auto">
        <div>
          <div className={cap}>{tr(lang, 'Qui suis-je ?', 'Who am I?')}</div>
          <p className="text-sm text-app-muted mt-1">{tr(lang, 'Rien n’est obligatoire.', 'Nothing is required.')}</p>
        </div>
        {QUESTIONS.map((q, i) => (
          <div key={q.id} className={card}>
            <div className={cap}>{trf(lang, 'Question {0} sur {1}', 'Question {0} of {1}', [i + 1, QUESTIONS.length])}</div>
            <div className="text-base font-bold text-app-text leading-snug">{tr(lang, q.fr, q.en)}</div>
            {renderControl(q)}
            <button type="button" onClick={() => setAnswer(q.id, undefined)} className="min-h-[44px] text-sm text-app-muted underline underline-offset-2 hover:text-app-text">
              {tr(lang, 'Je ne sais pas / passer', 'I don’t know / skip')}
            </button>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveProfile} className={primaryBtn}>
            {trf(lang, 'Enregistrer comme « {0} » (en attente)', 'Save as “{0}” (pending)', [profileLabel(lang, profiles.reduce((m, p) => Math.max(m, p.number), 0) + 1)])}
          </button>
          <button type="button" onClick={() => { setAnswers({}); setView('home'); }} className={lightBtn}>{tr(lang, 'Annuler', 'Cancel')}</button>
        </div>
      </div>
    );
  }

  if (view === 'attach' && attachProfile) {
    return (
      <div className="space-y-4 w-full max-w-xl mx-auto">
        <div>
          <div className={cap}>{profileLabel(lang, attachProfile.number)} · {tr(lang, 'en attente', 'pending')}</div>
          <h2 className="text-2xl font-black text-app-text mt-1">{tr(lang, 'Elle fait partie de quoi ?', 'What does it belong to?')}</h2>
        </div>
        <label className="block space-y-1.5">
          <span className={cap}>{tr(lang, 'Nom de la fiche', 'Profile name')}</span>
          <input
            type="text" value={attachName} onChange={e => setAttachName(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
          />
        </label>
        <div role="radiogroup" aria-label={tr(lang, 'Rattacher à', 'Attach to')} className="space-y-2">
          {targetOptions.map(t => (
            <button
              key={t.key} type="button" role="radio" aria-checked={attachTarget === t.key}
              onClick={() => setAttachTarget(t.key)}
              className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl border text-sm font-bold transition-colors ${attachTarget === t.key ? 'bg-app-accent text-white border-transparent' : 'bg-app-card text-app-text border-app-border hover:border-app-accent/40'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-app-muted">{tr(lang, 'Tant que tu n’as pas validé, elle n’apparaît pas dans Mon Système.', 'Until you confirm, it does not appear in My System.')}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={confirmAttach} disabled={!attachTarget} className={primaryBtn}>{tr(lang, 'Valider', 'Confirm')}</button>
          <button type="button" onClick={() => { setView('home'); setAttachId(null); }} className={lightBtn}>{tr(lang, 'Je ne sais pas encore', 'I don’t know yet')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      <div className="space-y-3">
        <div className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-app-muted" /><span className={cap}>{tr(lang, 'Qui suis-je ?', 'Who am I?')}</span></div>
        <h2 className="text-3xl font-black text-app-text leading-tight">{tr(lang, 'Tu ne sais pas qui tu es, et c’est OK.', 'You don’t know who you are, and that’s OK.')}</h2>
        <p className="text-base text-app-text/90 leading-relaxed">
          {tr(lang, 'Il n’y a pas de bonne réponse. Réponds seulement à ce que tu veux, et passe le reste. Rien ne sera décidé à ta place.', 'There is no right answer. Only answer what you want, and skip the rest. Nothing will be decided for you.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={() => { setNotice(null); setAnswers({}); setView('questions'); }} className={primaryBtn}>{tr(lang, 'Commencer', 'Start')}</button>
          <button type="button" onClick={onGoGrounding} className={lightBtn}>{tr(lang, 'Ça ne va pas : aller à l’Ancrage', 'I’m not okay: go to Grounding')}</button>
        </div>
        <p className="text-xs text-app-muted">{tr(lang, 'Ce n’est pas un test ni un outil médical. Les réponses restent sur cet appareil.', 'This is not a test or a medical tool. Your answers stay on this device.')}</p>
      </div>

      {notice && (
        <div role="status" className="p-4 rounded-xl bg-app-accent/10 border border-app-accent/30 text-sm text-app-text space-y-2">
          <p>{notice.text}</p>
          {notice.canOpenSystem && <button type="button" onClick={onOpenSystem} className={lightBtn}>{tr(lang, 'Ouvrir Mon Système', 'Open My System')}</button>}
        </div>
      )}

      {profiles.length > 0 && (
        <div className="space-y-3">
          <div className={cap}>{tr(lang, 'Fiches en attente', 'Pending profiles')}</div>
          {[...profiles].sort((a, b) => a.number - b.number).map(p => (
            <div key={p.id} className={card}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-black text-app-text">{profileLabel(lang, p.number)}</div>
                  <div className="text-xs text-app-muted">{fmtDate(p.createdAt)}</div>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[10px] font-black uppercase tracking-wide text-app-text">{tr(lang, 'en attente', 'pending')}</span>
              </div>
              {openId === p.id && (
                <ul className="text-sm text-app-text/90 space-y-1">
                  {QUESTIONS.map(q => { const t = describeAnswer(q, p.answers[q.id], lang); return t ? <li key={q.id}><span className="text-app-muted">{tr(lang, q.fr, q.en)}</span> <b>{t}</b></li> : null; })}
                  {Object.keys(p.answers).length === 0 && <li className="text-app-muted">{tr(lang, '(aucune réponse)', '(no answers)')}</li>}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => startAttach(p)} className={primaryBtn}>{tr(lang, 'Rattacher', 'Attach')}</button>
                <button type="button" onClick={() => setOpenId(openId === p.id ? null : p.id)} className={lightBtn}>
                  {openId === p.id ? tr(lang, 'Masquer les réponses', 'Hide answers') : tr(lang, 'Voir les réponses', 'View answers')}
                </button>
                {confirmDeleteId === p.id ? (
                  <>
                    <button type="button" onClick={() => { onProfilesChange(profiles.filter(x => x.id !== p.id)); setConfirmDeleteId(null); }} className="px-4 py-3 min-h-[44px] rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-wider">{tr(lang, 'Supprimer', 'Delete')}</button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className={lightBtn}>{tr(lang, 'Annuler', 'Cancel')}</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(p.id)} aria-label={tr(lang, 'Supprimer cette fiche', 'Delete this profile')} className="px-3 min-h-[44px] rounded-xl text-app-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
