import React, { useRef } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export interface SpectrumCriterion {
  id: string;
  name: string;
  color: string;
  score: number;
}

interface SpectrumToolProps {
  criteria: SpectrumCriterion[];
  onChange: (criteria: SpectrumCriterion[]) => void;
  lang: 'fr' | 'en';
}

const CX = 260;
const CY = 260;
const MAX_RADIUS = 205;

const polarPoint = (angle: number, radius: number) => ({
  x: CX + Math.cos(angle) * radius,
  y: CY + Math.sin(angle) * radius,
});

const wedgePath = (start: number, end: number, radius: number) => {
  const startPoint = polarPoint(start, radius);
  const endPoint = polarPoint(end, radius);
  return `M ${CX} ${CY} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y} Z`;
};

export default function SpectrumTool({ criteria, onChange, lang }: SpectrumToolProps) {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(criteria[0]?.id || null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const updateScoreFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!wheelRef.current || criteria.length === 0) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 520;
    const y = ((event.clientY - rect.top) / rect.height) * 520;
    const dx = x - CX;
    const dy = y - CY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const sector = Math.floor((angle / (Math.PI * 2)) * criteria.length) % criteria.length;
    const score = Math.max(0, Math.min(10, Math.round((distance / MAX_RADIUS) * 10)));
    const selected = criteria[sector];
    if (!selected) return;
    setActiveId(selected.id);
    onChange(criteria.map(item => item.id === selected.id ? { ...item, score } : item));
  };

  const addCriterion = () => {
    const id = `spectrum-${Date.now()}`;
    onChange([...criteria, { id, name: lang === 'fr' ? 'Nouveau critère' : 'New criterion', color: '#2b8cbe', score: 0 }]);
    setActiveId(id);
    setEditingId(id);
  };

  const updateCriterion = (id: string, patch: Partial<SpectrumCriterion>) => {
    onChange(criteria.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const removeCriterion = (id: string) => {
    onChange(criteria.filter(item => item.id !== id));
    if (activeId === id) setActiveId(criteria.find(item => item.id !== id)?.id || null);
  };

  const labels = lang === 'fr'
    ? { title: 'Spectrum Tool', subtitle: 'Un aperçu évolutif de la vie du système', edit: 'Critères', add: 'Ajouter un critère', empty: 'Ajoutez un critère pour commencer', hint: 'Cliquez ou glissez dans la roue pour noter de 0 à 10.' }
    : { title: 'Spectrum Tool', subtitle: 'A living snapshot of the system', edit: 'Criteria', add: 'Add a criterion', empty: 'Add a criterion to begin', hint: 'Click or drag in the wheel to score from 0 to 10.' };

  return (
    <section className="border-t border-app-border/20 pt-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-black text-app-accent">{labels.title}</p>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider mt-1">{labels.subtitle}</h2>
          <a
            href="https://partielles.com/tpa"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-[10px] text-app-muted underline underline-offset-2 hover:text-app-accent transition-colors"
          >
            The Plural Spectrum Tool — The Plural Association Nonprofit (partielles.com/tpa)
          </a>
        </div>
        <p className="text-xs text-app-muted max-w-sm">{labels.hint}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,390px)] gap-8 items-start">
        <div className="bg-app-card/65 border border-app-border/30 rounded-2xl p-3 sm:p-6">
          {criteria.length === 0 ? (
            <div className="min-h-80 flex items-center justify-center text-sm text-app-muted">{labels.empty}</div>
          ) : (
            <svg
              ref={wheelRef}
              viewBox="0 0 520 520"
              className="w-full max-w-[620px] mx-auto touch-none select-none"
              onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); updateScoreFromPointer(event); }}
              onPointerMove={event => { if (event.buttons) updateScoreFromPointer(event); }}
              role="img"
              aria-label={labels.title}
            >
              <circle cx={CX} cy={CY} r={MAX_RADIUS} fill="var(--color-app-bg)" opacity="0.35" />
              {Array.from({ length: 10 }, (_, index) => (
                <circle key={index} cx={CX} cy={CY} r={(MAX_RADIUS / 10) * (index + 1)} fill="none" stroke="var(--color-app-text)" strokeOpacity="0.18" strokeWidth="1.5" />
              ))}
              {criteria.map((criterion, index) => {
                const start = (index / criteria.length) * Math.PI * 2 - Math.PI / 2;
                const end = ((index + 1) / criteria.length) * Math.PI * 2 - Math.PI / 2;
                const radius = MAX_RADIUS * (criterion.score / 10);
                const labelPoint = polarPoint((start + end) / 2, MAX_RADIUS + 22);
                return (
                  <g key={criterion.id}>
                    <line x1={CX} y1={CY} x2={polarPoint(start, MAX_RADIUS).x} y2={polarPoint(start, MAX_RADIUS).y} stroke="var(--color-app-text)" strokeOpacity="0.28" strokeWidth="1.5" />
                    {radius > 0 && <path d={wedgePath(start, end, radius)} fill={criterion.color} fillOpacity="0.78" stroke={criterion.color} strokeWidth="2" />}
                    <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="var(--color-app-text)" className="pointer-events-none">{criterion.score}</text>
                  </g>
                );
              })}
              <circle cx={CX} cy={CY} r="4" fill="var(--color-app-text)" opacity="0.6" />
            </svg>
          )}
        </div>

        <div className="bg-app-card/65 border border-app-border/30 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Pencil className="w-4 h-4" />{labels.edit}</h3>
            <button onClick={addCriterion} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-app-accent text-xs font-black uppercase tracking-wide hover:opacity-90 transition-opacity"><Plus className="w-3.5 h-3.5" />{labels.add}</button>
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {criteria.map(criterion => (
              <div key={criterion.id} className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${activeId === criterion.id ? 'border-app-accent/50 bg-app-accent/5' : 'border-app-border/20'}`} onClick={() => setActiveId(criterion.id)}>
                <input aria-label={criterion.name} type="color" value={criterion.color} onChange={event => updateCriterion(criterion.id, { color: event.target.value })} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer p-0.5" />
                {editingId === criterion.id ? (
                  <input autoFocus value={criterion.name} onChange={event => updateCriterion(criterion.id, { name: event.target.value })} onBlur={() => setEditingId(null)} onKeyDown={event => { if (event.key === 'Enter') setEditingId(null); }} className="min-w-0 flex-1 bg-app-bg border border-app-accent/40 rounded-lg px-2 py-1.5 text-xs text-app-text focus:outline-none" />
                ) : (
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{criterion.name}</span>
                )}
                <span className="w-7 text-center text-xs font-black text-app-muted">{criterion.score}</span>
                <button onClick={() => setEditingId(criterion.id)} className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg" title={lang === 'fr' ? 'Renommer' : 'Rename'}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => removeCriterion(criterion.id)} className="p-1.5 rounded-lg text-app-muted hover:text-red-500 hover:bg-red-500/10" title={lang === 'fr' ? 'Supprimer' : 'Delete'}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}