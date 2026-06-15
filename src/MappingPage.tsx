/**
 * MappingPage.tsx — Heaven Space
 * Page de mapping en toile — visualisation des relations entre alters
 * Drag & drop, relations typées, légende, adapté aux thèmes
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, X, Save, GitBranch } from 'lucide-react';
import { SavedAlter } from './types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type RelationType =
  | 'partner'
  | 'protector'
  | 'sibling'
  | 'parent'
  | 'friend'
  | 'caretaker'
  | 'tension'
  | 'conflict'
  | 'persecutor'
  | 'distance';

export interface MappingRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  label?: string;
}

export interface MappingNode {
  id: string;
  x: number;
  y: number;
}

export interface MappingData {
  nodes: MappingNode[];
  relations: MappingRelation[];
}

const RELATION_CONFIG: Record<RelationType, {
  label: string;
  labelEn: string;
  color: string;
  dash: string;
  width: number;
  arrow: boolean;
}> = {
  partner:    { label: 'Partenaires / Mariés',  labelEn: 'Partners / Married',    color: '#F472B6', dash: 'none', width: 3,   arrow: false },
  protector:  { label: 'Protecteur / Protégé',  labelEn: 'Protector / Protected', color: '#60A5FA', dash: 'none', width: 2,   arrow: true  },
  sibling:    { label: 'Frère / Sœur',           labelEn: 'Siblings',              color: '#34D399', dash: 'none', width: 2,   arrow: false },
  parent:     { label: 'Parent / Enfant',        labelEn: 'Parent / Child',        color: '#FB923C', dash: 'none', width: 2,   arrow: true  },
  friend:     { label: 'Ami·e',                  labelEn: 'Friend',                color: '#A78BFA', dash: 'none', width: 1.5, arrow: false },
  caretaker:  { label: 'Soignant',               labelEn: 'Caretaker',             color: '#22D3EE', dash: 'none', width: 2,   arrow: true  },
  tension:    { label: 'Tension',                labelEn: 'Tension',               color: '#FCD34D', dash: '6 4', width: 1.5, arrow: false },
  conflict:   { label: 'Conflit',                labelEn: 'Conflict',              color: '#F87171', dash: '4 2', width: 2.5, arrow: false },
  persecutor: { label: 'Persécuteur',            labelEn: 'Persecutor',            color: '#DC2626', dash: '4 2', width: 3,   arrow: true  },
  distance:   { label: 'Distance / Évitement',   labelEn: 'Distance / Avoidance',  color: '#9CA3AF', dash: '2 4', width: 1,   arrow: false },
};

const STORAGE_KEY = 'heaven_space_mapping';

export function loadMapping(): MappingData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { nodes: [], relations: [] };
}

export function saveMapping(data: MappingData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getAlterColor(alter: SavedAlter): string {
  const colors = ['#A78BFA', '#60A5FA', '#34D399', '#FB923C', '#F472B6', '#22D3EE', '#FCD34D'];
  let hash = 0;
  for (let i = 0; i < alter.alterName.length; i++) hash += alter.alterName.charCodeAt(i);
  return colors[hash % colors.length];
}

function getRoleLabel(alter: SavedAlter): string {
  if (!alter.selectedRoles?.length) return '';
  return alter.selectedRoles[0].replace(/_/g, ' ').toLowerCase();
}

interface MappingPageProps {
  savedAlters: SavedAlter[];
  lang: 'fr' | 'en';
}

export default function MappingPage({ savedAlters, lang }: MappingPageProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const panning = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const [mapping, setMapping] = useState<MappingData>(loadMapping);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [newRel, setNewRel] = useState<{ sourceId: string; targetId: string; type: RelationType; label: string }>({
    sourceId: '', targetId: '', type: 'friend', label: '',
  });
  const [selectedRelId, setSelectedRelId] = useState<string | null>(null);

  const t = {
    title: lang === 'fr' ? 'Mapping du Système' : 'System Mapping',
    subtitle: lang === 'fr' ? 'Visualise les relations entre les membres de ton système.' : 'Visualize relationships between system members.',
    addRelation: lang === 'fr' ? 'Ajouter une relation' : 'Add a relation',
    source: lang === 'fr' ? 'Alter source' : 'Source alter',
    target: lang === 'fr' ? 'Alter cible' : 'Target alter',
    relType: lang === 'fr' ? 'Type de relation' : 'Relation type',
    relLabel: lang === 'fr' ? 'Étiquette (optionnel)' : 'Label (optional)',
    save: lang === 'fr' ? 'Enregistrer' : 'Save',
    cancel: lang === 'fr' ? 'Annuler' : 'Cancel',
    legend: lang === 'fr' ? 'Légende' : 'Legend',
    noAlters: lang === 'fr' ? "Aucun alter enregistré. Crée des fiches d'alters pour les voir ici." : 'No alters saved. Create alter cards to see them here.',
    dragHint: lang === 'fr' ? 'Glisse les nœuds pour les repositionner · Clique sur une ligne pour la supprimer' : 'Drag nodes to reposition · Click a line to delete it',
    positiveRels: lang === 'fr' ? 'Relations positives' : 'Positive relationships',
    negativeRels: lang === 'fr' ? 'Relations difficiles' : 'Difficult relationships',
  };

  useEffect(() => {
    setMapping(prev => {
      const existingIds = new Set(prev.nodes.map(n => n.id));
      const newNodes = savedAlters
        .filter(a => !existingIds.has(a.id))
        .map((a, i) => ({
          id: a.id,
          x: 150 + (i % 4) * 170 + Math.random() * 30,
          y: 150 + Math.floor(i / 4) * 170 + Math.random() * 30,
        }));
      const validIds = new Set(savedAlters.map(a => a.id));
      const updated = {
        nodes: [...prev.nodes.filter(n => validIds.has(n.id)), ...newNodes],
        relations: prev.relations.filter(r => validIds.has(r.sourceId) && validIds.has(r.targetId)),
      };
      saveMapping(updated);
      return updated;
    });
  }, [savedAlters]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setCanvasSize({ w: containerRef.current.clientWidth || 800, h: Math.max(500, window.innerHeight - 400) });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Wheel non-passive pour que preventDefault() fonctionne sur PC
  useEffect(() => {
    const svg = canvasRef.current;
    if (!svg) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.min(3, Math.max(0.3, prev - e.deltaY * 0.001)));
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, []);

  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const node = mapping.nodes.find(n => n.id === id);
    if (!node) return;
    dragging.current = {
      id,
      offsetX: (e.clientX - rect.left) / zoom - pan.x - node.x,
      offsetY: (e.clientY - rect.top) / zoom - pan.y - node.y,
    };
  }, [mapping.nodes, zoom, pan]);

  const onNodeTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const node = mapping.nodes.find(n => n.id === id);
    if (!node) return;
    const touch = e.touches[0];
    dragging.current = {
      id,
      offsetX: (touch.clientX - rect.left) / zoom - pan.x - node.x,
      offsetY: (touch.clientY - rect.top) / zoom - pan.y - node.y,
    };
  }, [mapping.nodes, zoom, pan]);

  const touchPan = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const pinch = useRef<{ dist: number; originZoom: number } | null>(null);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragging.current) return;
    panning.current = { startX: e.clientX, startY: e.clientY, originX: pan.x, originY: pan.y };
  }, [pan]);

  const onCanvasTouchStart = useCallback((e: React.TouchEvent) => {
    if (dragging.current) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchPan.current = { startX: t.clientX, startY: t.clientY, originX: pan.x, originY: pan.y };
      pinch.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinch.current = { dist: Math.hypot(dx, dy), originZoom: zoom };
      touchPan.current = null;
    }
  }, [pan, zoom]);

  const rafRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - pan.x - dragging.current.offsetX;
      const y = (e.clientY - rect.top) / zoom - pan.y - dragging.current.offsetY;
      const id = dragging.current.id;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMapping(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => n.id === id ? { ...n, x, y } : n),
        }));
      });
    } else if (panning.current) {
      const dx = (e.clientX - panning.current.startX) / zoom;
      const dy = (e.clientY - panning.current.startY) / zoom;
      setPan({ x: panning.current.originX + dx, y: panning.current.originY + dy });
    }
  }, [zoom, pan]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    // Drag nœud (1 doigt sur un nœud)
    if (dragging.current && canvasRef.current && e.touches.length === 1) {
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / zoom - pan.x - dragging.current.offsetX;
      const y = (touch.clientY - rect.top) / zoom - pan.y - dragging.current.offsetY;
      const id = dragging.current.id;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMapping(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => n.id === id ? { ...n, x, y } : n),
        }));
      });
    // Pan 1 doigt sur le canvas
    } else if (touchPan.current && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = (t.clientX - touchPan.current.startX) / zoom;
      const dy = (t.clientY - touchPan.current.startY) / zoom;
      setPan({ x: touchPan.current.originX + dx, y: touchPan.current.originY + dy });
    // Pinch-to-zoom 2 doigts
    } else if (pinch.current && e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newDist = Math.hypot(dx, dy);
      const ratio = newDist / pinch.current.dist;
      setZoom(Math.min(3, Math.max(0.3, pinch.current.originZoom * ratio)));
    }
  }, [zoom, pan]);

  const onMouseUp = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (dragging.current) {
      setMapping(prev => { saveMapping(prev); return prev; });
    }
    dragging.current = null;
    panning.current = null;
    touchPan.current = null;
    pinch.current = null;
  }, []);

  const zoomIn = () => setZoom(prev => Math.min(3, prev + 0.2));
  const zoomOut = () => setZoom(prev => Math.max(0.3, prev - 0.2));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };



  const handleAddRelation = () => {
    if (!newRel.sourceId || !newRel.targetId || newRel.sourceId === newRel.targetId) return;
    const rel: MappingRelation = {
      id: Math.random().toString(36).substring(2, 11),
      sourceId: newRel.sourceId,
      targetId: newRel.targetId,
      type: newRel.type,
      label: newRel.label.trim() || undefined,
    };
    setMapping(prev => {
      const updated = { ...prev, relations: [...prev.relations, rel] };
      saveMapping(updated);
      return updated;
    });
    setShowAddRelation(false);
    setNewRel({ sourceId: '', targetId: '', type: 'friend', label: '' });
  };

  const handleDeleteRelation = (id: string) => {
    setMapping(prev => {
      const updated = { ...prev, relations: prev.relations.filter(r => r.id !== id) };
      saveMapping(updated);
      return updated;
    });
    setSelectedRelId(null);
  };

  if (savedAlters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-app-muted gap-3">
        <GitBranch className="w-10 h-10 opacity-30" />
        <p className="text-sm">{t.noAlters}</p>
      </div>
    );
  }

  const NODE_R = 38;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-app-text">{t.title}</h2>
          <p className="text-xs text-app-muted mt-1">{t.dragHint}</p>
        </div>
        <button
          onClick={() => setShowAddRelation(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-app-accent text-app-card text-sm font-semibold hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t.addRelation}
        </button>
      </div>

      <div ref={containerRef} className="relative rounded-2xl border border-app-border overflow-hidden bg-app-card" style={{ userSelect: 'none' }}>
        {/* Boutons zoom */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button onClick={zoomIn} className="w-8 h-8 rounded-lg bg-app-card border border-app-border text-app-text text-lg font-bold flex items-center justify-center hover:bg-app-bg transition-all shadow-sm">+</button>
          <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-app-card border border-app-border text-app-text text-lg font-bold flex items-center justify-center hover:bg-app-bg transition-all shadow-sm">−</button>
          <button onClick={resetView} className="w-8 h-8 rounded-lg bg-app-card border border-app-border text-app-muted text-[10px] font-bold flex items-center justify-center hover:bg-app-bg transition-all shadow-sm">⌖</button>
        </div>
        {/* Indicateur zoom */}
        <div className="absolute bottom-3 right-3 z-10 text-[10px] text-app-muted font-mono bg-app-card/80 px-2 py-1 rounded-lg border border-app-border">
          {Math.round(zoom * 100)}%
        </div>
        <svg
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onCanvasTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
          className="w-full"
          style={{ touchAction: 'none', cursor: panning.current ? 'grabbing' : 'default' }}
        >
          <defs>
            {(Object.entries(RELATION_CONFIG) as [RelationType, typeof RELATION_CONFIG[RelationType]][]).map(([type, cfg]) =>
              cfg.arrow ? (
                <marker key={type} id={`arrow-${type}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill={cfg.color} opacity="0.85" />
                </marker>
              ) : null
            )}
          </defs>
          {/* Groupe transformé pour zoom/pan */}
          <g transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}>

          {mapping.relations.map(rel => {
            const source = mapping.nodes.find(n => n.id === rel.sourceId);
            const target = mapping.nodes.find(n => n.id === rel.targetId);
            if (!source || !target) return null;
            const cfg = RELATION_CONFIG[rel.type];
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;
            const x1 = source.x + nx * NODE_R;
            const y1 = source.y + ny * NODE_R;
            const x2 = target.x - nx * (NODE_R + (cfg.arrow ? 10 : 0));
            const y2 = target.y - ny * (NODE_R + (cfg.arrow ? 10 : 0));
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const isSelected = selectedRelId === rel.id;

            return (
              <g key={rel.id} onClick={() => setSelectedRelId(isSelected ? null : rel.id)} style={{ cursor: 'pointer' }}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="16" />
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={cfg.color}
                  strokeWidth={isSelected ? cfg.width + 1.5 : cfg.width}
                  strokeDasharray={cfg.dash === 'none' ? undefined : cfg.dash}
                  opacity={isSelected ? 1 : 0.7}
                  markerEnd={cfg.arrow ? `url(#arrow-${rel.type})` : undefined}
                />
                {rel.label && (
                  <text x={midX} y={midY - 7} textAnchor="middle" fontSize="10" fill={cfg.color} opacity="0.9" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>
                    {rel.label}
                  </text>
                )}
                {isSelected && (
                  <g onClick={e => { e.stopPropagation(); handleDeleteRelation(rel.id); }} style={{ cursor: 'pointer' }}>
                    <circle cx={midX} cy={midY} r="11" fill="var(--color-app-card)" stroke={cfg.color} strokeWidth="1.5" />
                    <text x={midX} y={midY + 4.5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={cfg.color} style={{ pointerEvents: 'none' }}>×</text>
                  </g>
                )}
              </g>
            );
          })}

          {mapping.nodes.map(node => {
            const alter = savedAlters.find(a => a.id === node.id);
            if (!alter) return null;
            const color = getAlterColor(alter);
            const roleLabel = getRoleLabel(alter);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onMouseDown={e => onNodeMouseDown(e, node.id)}
                onTouchStart={e => onNodeTouchStart(e, node.id)}
                style={{ cursor: 'grab' }}
              >
                <circle r={NODE_R + 5} fill={color} opacity="0.07" />
                <circle r={NODE_R} fill="var(--color-app-card)" stroke={color} strokeWidth="2.5" />
                {alter.profileImage ? (
                  <>
                    <clipPath id={`clip-${node.id}`}><circle r={NODE_R - 3} /></clipPath>
                    <image
                      href={alter.profileImage}
                      x={-(NODE_R - 3)} y={-(NODE_R - 3)}
                      width={(NODE_R - 3) * 2} height={(NODE_R - 3) * 2}
                      clipPath={`url(#clip-${node.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </>
                ) : (
                  <text y="6" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>
                    {alter.alterName.charAt(0).toUpperCase()}
                  </text>
                )}
                <text y={NODE_R + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-app-text)" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>
                  {alter.alterName}
                </text>
                {roleLabel && (
                  <text y={NODE_R + 30} textAnchor="middle" fontSize="9" fill="var(--color-app-muted)" style={{ pointerEvents: 'none', fontFamily: 'inherit' }}>
                    {roleLabel}
                  </text>
                )}
              </g>
            );
          })}
          </g>
        </svg>
      </div>

      {/* Légende */}
      <div className="rounded-2xl border border-app-border bg-app-card p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-app-muted">{t.legend}</p>
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-app-muted/60">{t.positiveRels}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(['partner', 'protector', 'sibling', 'parent', 'friend', 'caretaker'] as RelationType[]).map(type => {
              const cfg = RELATION_CONFIG[type];
              return (
                <div key={type} className="flex items-center gap-2">
                  <svg width="36" height="10">
                    <line x1="0" y1="5" x2="36" y2="5" stroke={cfg.color} strokeWidth={cfg.width} strokeDasharray={cfg.dash === 'none' ? undefined : cfg.dash} />
                    {cfg.arrow && <polygon points="28,2 36,5 28,8" fill={cfg.color} />}
                  </svg>
                  <span className="text-xs text-app-muted">{lang === 'fr' ? cfg.label : cfg.labelEn}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-app-muted/60 mt-1">{t.negativeRels}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(['tension', 'conflict', 'persecutor', 'distance'] as RelationType[]).map(type => {
              const cfg = RELATION_CONFIG[type];
              return (
                <div key={type} className="flex items-center gap-2">
                  <svg width="36" height="10">
                    <line x1="0" y1="5" x2="36" y2="5" stroke={cfg.color} strokeWidth={cfg.width} strokeDasharray={cfg.dash === 'none' ? undefined : cfg.dash} />
                    {cfg.arrow && <polygon points="28,2 36,5 28,8" fill={cfg.color} />}
                  </svg>
                  <span className="text-xs text-app-muted">{lang === 'fr' ? cfg.label : cfg.labelEn}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddRelation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-app-card border border-app-border rounded-2xl p-6 w-full max-w-md space-y-4 relative">
            <button onClick={() => setShowAddRelation(false)} className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-text">{t.addRelation}</h3>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{t.source}</label>
              <select value={newRel.sourceId} onChange={e => setNewRel(p => ({ ...p, sourceId: e.target.value }))} className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none">
                <option value="">—</option>
                {savedAlters.map(a => <option key={a.id} value={a.id}>{a.alterName}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{t.target}</label>
              <select value={newRel.targetId} onChange={e => setNewRel(p => ({ ...p, targetId: e.target.value }))} className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none">
                <option value="">—</option>
                {savedAlters.filter(a => a.id !== newRel.sourceId).map(a => <option key={a.id} value={a.id}>{a.alterName}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{t.relType}</label>
              <select value={newRel.type} onChange={e => setNewRel(p => ({ ...p, type: e.target.value as RelationType }))} className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none">
                {(Object.entries(RELATION_CONFIG) as [RelationType, typeof RELATION_CONFIG[RelationType]][]).map(([type, cfg]) => (
                  <option key={type} value={type}>{lang === 'fr' ? cfg.label : cfg.labelEn}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{t.relLabel}</label>
              <input
                type="text"
                value={newRel.label}
                onChange={e => setNewRel(p => ({ ...p, label: e.target.value }))}
                placeholder={lang === 'fr' ? 'ex: protège depuis l\'enfance' : 'ex: close since childhood'}
                className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none placeholder:text-app-muted/40"
              />
            </div>

            {newRel.type && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-app-bg border border-app-border">
                <svg width="40" height="10">
                  <line x1="0" y1="5" x2="40" y2="5" stroke={RELATION_CONFIG[newRel.type].color} strokeWidth={RELATION_CONFIG[newRel.type].width} strokeDasharray={RELATION_CONFIG[newRel.type].dash === 'none' ? undefined : RELATION_CONFIG[newRel.type].dash} />
                  {RELATION_CONFIG[newRel.type].arrow && <polygon points="32,2 40,5 32,8" fill={RELATION_CONFIG[newRel.type].color} />}
                </svg>
                <span className="text-xs text-app-muted">{lang === 'fr' ? RELATION_CONFIG[newRel.type].label : RELATION_CONFIG[newRel.type].labelEn}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAddRelation(false)} className="flex-1 py-2.5 rounded-xl border border-app-border text-sm text-app-muted hover:text-app-text transition-all">
                {t.cancel}
              </button>
              <button
                onClick={handleAddRelation}
                disabled={!newRel.sourceId || !newRel.targetId || newRel.sourceId === newRel.targetId}
                className="flex-1 py-2.5 rounded-xl bg-app-accent text-app-card text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
