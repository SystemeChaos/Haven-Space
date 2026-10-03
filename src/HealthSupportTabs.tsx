/**
 * HealthSupportTabs.tsx — Haven Space
 *
 * Deux sous-onglets du carnet de santé :
 *  - « Intervenants » : professionnels de santé et d'accompagnement (nom, rôle, téléphone, note)
 *  - « Aides et stratégies » : aides matérielles (canne, casque anti-bruit…) et stratégies d'adaptation
 *
 * Composant d'affichage : les données et leur sauvegarde (coffre chiffré, export/import JSON) vivent dans
 * App.tsx, comme pour les traitements et les antécédents. Ici, seulement les formulaires et les listes.
 */

import React from 'react';
import { Pencil, Phone, Plus, Trash2 } from 'lucide-react';

export interface HealthProvider {
  id: string;
  name: string;
  /** Spécialité ou rôle : psychiatre, médecin traitant, kiné… */
  role: string;
  phone: string;
  note: string;
}

export type HealthAidKind = 'aid' | 'strategy';

export interface HealthAid {
  id: string;
  name: string;
  /** 'aid' = aide matérielle ; 'strategy' = stratégie d'adaptation. */
  kind: HealthAidKind;
  note: string;
}

interface HealthSupportTabsProps {
  tab: 'intervenants' | 'aides';
  lang: 'fr' | 'en';
  providers: HealthProvider[];
  onProvidersChange: (next: HealthProvider[]) => void;
  aids: HealthAid[];
  onAidsChange: (next: HealthAid[]) => void;
}

const newId = () => Math.random().toString(36).substring(2, 11);

// Ne garde que les chiffres et le « + » pour le lien d'appel : le texte affiché reste tel que saisi.
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

const labelCls = 'text-[10px] font-bold uppercase tracking-wider text-app-muted';
const inputCls = 'w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20';
const primaryBtn = 'flex items-center gap-2 px-4 py-2.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all';

/** Suppression en deux temps, sur place : pas de fenêtre modale à brancher dans App.tsx. */
function RowActions({ lang, onEdit, onDelete }: { lang: 'fr' | 'en'; onEdit: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = React.useState(false);
  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDelete}
          className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          {lang === 'fr' ? 'Supprimer' : 'Delete'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1 rounded-lg bg-app-bg border border-app-border text-[10px] font-bold text-app-muted hover:text-app-text transition-colors"
        >
          {lang === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" onClick={onEdit} className="p-1.5 text-app-muted hover:text-app-accent transition-colors" title={lang === 'fr' ? 'Modifier' : 'Edit'}>
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={() => setConfirming(true)} className="p-1.5 text-app-muted hover:text-red-500 transition-colors" title={lang === 'fr' ? 'Supprimer' : 'Delete'}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ProvidersPanel({ lang, providers, onChange }: { lang: 'fr' | 'en'; providers: HealthProvider[]; onChange: (next: HealthProvider[]) => void }) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [note, setNote] = React.useState('');

  const open = (p?: HealthProvider) => {
    setEditingId(p?.id ?? null);
    setName(p?.name ?? '');
    setRole(p?.role ?? '');
    setPhone(p?.phone ?? '');
    setNote(p?.note ?? '');
    setFormOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    const entry: HealthProvider = { id: editingId ?? newId(), name: name.trim(), role: role.trim(), phone: phone.trim(), note: note.trim() };
    onChange(editingId ? providers.map(p => (p.id === editingId ? entry : p)) : [...providers, entry]);
    setFormOpen(false);
    setEditingId(null);
  };

  const sorted = [...providers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="space-y-4">
      {!formOpen ? (
        <button type="button" onClick={() => open()} className={primaryBtn}>
          <Plus className="w-3.5 h-3.5" />
          {lang === 'fr' ? 'Ajouter un intervenant' : 'Add a provider'}
        </button>
      ) : (
        <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>{lang === 'fr' ? 'Nom' : 'Name'}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls}
              placeholder={lang === 'fr' ? 'Dr Martin, cabinet des Lilas…' : 'Dr Smith, Lakeside clinic…'} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{lang === 'fr' ? 'Rôle' : 'Role'}</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className={inputCls}
              placeholder={lang === 'fr' ? 'Psychiatre, médecin traitant, kiné…' : 'Psychiatrist, GP, physio…'} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls}
              placeholder={lang === 'fr' ? '01 23 45 67 89' : '555 123 4567'} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className={`${inputCls} resize-none`}
              placeholder={lang === 'fr' ? 'Adresse, horaires, prochain rendez-vous… (facultatif)' : 'Address, hours, next appointment… (optional)'} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} disabled={!name.trim()}
              className="flex-1 py-2.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all">
              {lang === 'fr' ? 'Enregistrer' : 'Save'}
            </button>
            <button type="button" onClick={() => { setFormOpen(false); setEditingId(null); }}
              className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors">
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center p-10 bg-app-card/35 rounded-2xl border border-app-border/25 text-app-muted uppercase tracking-widest text-[10px]">
          {lang === 'fr' ? 'Aucun intervenant enregistré.' : 'No providers logged.'}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(p => (
            <div key={p.id} className="p-4 bg-app-card border border-app-border/30 rounded-2xl flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-app-text">{p.name}</span>
                  {p.role && (
                    <span className="px-2 py-0.5 rounded-full bg-app-bg border border-app-border/40 text-[10px] font-bold text-app-muted">{p.role}</span>
                  )}
                </div>
                {p.phone && (
                  <a href={telHref(p.phone)} className="inline-flex items-center gap-1.5 text-xs font-mono text-app-accent hover:underline">
                    <Phone className="w-3 h-3" />
                    {p.phone}
                  </a>
                )}
                {p.note && <p className="text-xs text-app-muted italic whitespace-pre-line">{p.note}</p>}
              </div>
              <RowActions lang={lang} onEdit={() => open(p)} onDelete={() => onChange(providers.filter(x => x.id !== p.id))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AidsPanel({ lang, aids, onChange }: { lang: 'fr' | 'en'; aids: HealthAid[]; onChange: (next: HealthAid[]) => void }) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [kind, setKind] = React.useState<HealthAidKind>('aid');
  const [note, setNote] = React.useState('');

  const kindLabel = (k: HealthAidKind) =>
    k === 'aid' ? (lang === 'fr' ? 'Aide' : 'Aid') : (lang === 'fr' ? 'Stratégie' : 'Strategy');

  const open = (a?: HealthAid) => {
    setEditingId(a?.id ?? null);
    setName(a?.name ?? '');
    setKind(a?.kind ?? 'aid');
    setNote(a?.note ?? '');
    setFormOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    const entry: HealthAid = { id: editingId ?? newId(), name: name.trim(), kind, note: note.trim() };
    onChange(editingId ? aids.map(a => (a.id === editingId ? entry : a)) : [...aids, entry]);
    setFormOpen(false);
    setEditingId(null);
  };

  // Aides d'abord, puis stratégies ; par nom dans chaque groupe.
  const sorted = [...aids].sort((a, b) => (a.kind === b.kind ? (a.name || '').localeCompare(b.name || '') : a.kind === 'aid' ? -1 : 1));

  return (
    <div className="space-y-4">
      {!formOpen ? (
        <button type="button" onClick={() => open()} className={primaryBtn}>
          <Plus className="w-3.5 h-3.5" />
          {lang === 'fr' ? 'Ajouter une aide ou une stratégie' : 'Add an aid or a strategy'}
        </button>
      ) : (
        <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Type</label>
            <div className="flex gap-2">
              {(['aid', 'strategy'] as const).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                    kind === k ? 'bg-app-accent text-white border-transparent' : 'bg-app-card text-app-muted border-app-border hover:border-app-accent/25'
                  }`}
                >
                  {kindLabel(k)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{lang === 'fr' ? 'Nom' : 'Name'}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls}
              placeholder={kind === 'aid'
                ? (lang === 'fr' ? 'Canne, casque anti-bruit, couverture lestée…' : 'Cane, noise-cancelling headphones, weighted blanket…')
                : (lang === 'fr' ? 'Pause au calme, respiration, liste de courses…' : 'Quiet break, breathing, shopping list…')} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className={`${inputCls} resize-none`}
              placeholder={lang === 'fr' ? "Quand et comment l'utiliser… (facultatif)" : 'When and how to use it… (optional)'} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} disabled={!name.trim()}
              className="flex-1 py-2.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all">
              {lang === 'fr' ? 'Enregistrer' : 'Save'}
            </button>
            <button type="button" onClick={() => { setFormOpen(false); setEditingId(null); }}
              className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors">
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center p-10 bg-app-card/35 rounded-2xl border border-app-border/25 text-app-muted uppercase tracking-widest text-[10px]">
          {lang === 'fr' ? 'Aucune aide ou stratégie enregistrée.' : 'No aids or strategies logged.'}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(a => (
            <div key={a.id} className="p-4 bg-app-card border border-app-border/30 rounded-2xl flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-app-text">{a.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-app-bg border border-app-border/40 text-[10px] font-bold text-app-muted">{kindLabel(a.kind)}</span>
                </div>
                {a.note && <p className="text-xs text-app-muted italic whitespace-pre-line">{a.note}</p>}
              </div>
              <RowActions lang={lang} onEdit={() => open(a)} onDelete={() => onChange(aids.filter(x => x.id !== a.id))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HealthSupportTabs({ tab, lang, providers, onProvidersChange, aids, onAidsChange }: HealthSupportTabsProps) {
  return tab === 'intervenants'
    ? <ProvidersPanel lang={lang} providers={providers} onChange={onProvidersChange} />
    : <AidsPanel lang={lang} aids={aids} onChange={onAidsChange} />;
}
