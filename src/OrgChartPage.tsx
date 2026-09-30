/**
 * OrgChartPage.tsx — Haven Space
 * Organigramme du système, généré automatiquement à partir des rôles des alters :
 * Hôte en haut, puis co-hôtes, puis une bande par catégorie de fonction, rangée par
 * sous-système (arbre imbriqué). Tout se calcule à l'affichage (voir orgChart.ts) : rien
 * n'est stocké, sauf deux préférences d'affichage (mode et rôles visibles), non chiffrées.
 *
 * Un système parallèle est indépendant du principal (ses propres alters et sous-systèmes) :
 * la page suit donc simplement le système actif choisi dans l'en-tête de l'app.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Download, Eye, EyeOff, Layers, Loader2, Lock, Network } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CustomRole, SavedAlter, Subsystem } from './types';
import { BAND_META, OrgBand, OrgBlock, OrgMode, OrgNode, buildOrgChart } from './orgChart';

interface OrgChartPageProps {
  savedAlters: SavedAlter[];
  customRoles: CustomRole[];
  subsystems: Subsystem[];          // déjà filtrés sur le système actif
  unlockedAlterIds: string[];
  lang: 'fr' | 'en';
  systemName?: string;              // affiché seulement s'il existe des systèmes parallèles
  getRoleName: (roleId: string) => string;
  getRoleColor: (roleId: string) => string;
}

const TRUNK_X = 8;      // position du tronc vertical (px, dans le conteneur des branches)
const BRANCH_PAD = 24;  // retrait des branches (px) — le tronc est à TRUNK_X dans ce retrait
const BAND_GAP = 12;    // espace entre deux branches (px)
const STUB_Y = 24;      // hauteur de l'embranchement vers la boîte (px)
const LINE = 'var(--color-app-border)';

const LS_MODE = 'haven_space_orgchart_mode';
const LS_ROLES = 'haven_space_orgchart_roles';
const PIXEL_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

// Préférences d'affichage : simples, non sensibles, donc hors coffre (comme les autres préférences d'affichage).
function readPref(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writePref(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* stockage indisponible : on ignore */ }
}

interface CardCommon {
  lang: 'fr' | 'en';
  showRoles: boolean;
  getRoleName: (roleId: string) => string;
  getRoleColor: (roleId: string) => string;
}

function AlterCard({ node, lang, showRoles, getRoleName, getRoleColor }: CardCommon & { node: OrgNode }) {
  if (node.locked) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-app-border bg-app-card px-3 py-2 min-w-[130px]">
        <Lock className="w-4 h-4 text-app-muted shrink-0" />
        <span className="text-xs font-bold text-app-muted">
          {lang === 'fr' ? 'Fiche verrouillée' : 'Locked profile'}
        </span>
      </div>
    );
  }

  const { alter, roleKey } = node;
  const accent = roleKey ? getRoleColor(roleKey) : '#9CA3AF';
  const name = alter.alterName || (lang === 'fr' ? 'Sans nom' : 'Unnamed');

  return (
    <div
      className="flex items-center gap-2 rounded-xl border border-app-border bg-app-card px-3 py-2 min-w-[130px] max-w-[220px]"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      {alter.profileImage ? (
        <img src={alter.profileImage} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
      ) : (
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black text-white"
          style={{ background: accent }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-sm font-bold text-app-text truncate">{name}</div>
        {showRoles && roleKey && (
          <div className="text-[10px] uppercase tracking-wider text-app-muted truncate">
            {getRoleName(roleKey)}
          </div>
        )}
      </div>
    </div>
  );
}

function LevelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-black uppercase tracking-widest text-app-muted text-center mb-2">
      {children}
    </div>
  );
}

function Stem() {
  return <div className="mx-auto" style={{ width: 2, height: 24, background: LINE }} />;
}

/**
 * Pile de branches : un tronc vertical à gauche et un embranchement par élément.
 *  - start 'stem'   : raccord horizontal avec la tige centrale du dessus (sous les co-hôtes)
 *  - start 'header' : le tronc remonte vers un en-tête juste au-dessus (bloc de sous-système)
 *  - start 'none'   : rien au-dessus, le tronc démarre au premier élément
 */
function Branches({ items, start }: { items: Array<{ key: string; node: React.ReactNode }>; start: 'stem' | 'header' | 'none' }) {
  return (
    <div className="relative" style={{ paddingLeft: BRANCH_PAD, paddingTop: start === 'none' ? 0 : BAND_GAP }}>
      {start === 'stem' && (
        <div style={{ position: 'absolute', top: 0, left: TRUNK_X, right: '50%', height: 2, background: LINE }} />
      )}
      <div className="flex flex-col" style={{ gap: BAND_GAP }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const top = i === 0 && start === 'none' ? 0 : -BAND_GAP;
          return (
            <div key={item.key} className="relative">
              <div style={{
                position: 'absolute',
                left: -(BRANCH_PAD - TRUNK_X),
                top,
                width: 2,
                height: isLast ? STUB_Y - top : `calc(100% + ${-top}px)`,
                background: LINE,
              }} />
              <div style={{
                position: 'absolute',
                left: -(BRANCH_PAD - TRUNK_X),
                top: STUB_Y,
                width: BRANCH_PAD - TRUNK_X,
                height: 2,
                background: LINE,
              }} />
              {item.node}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BandBox({ band, lang, ...card }: CardCommon & { band: OrgBand }) {
  const meta = BAND_META[band.id];
  return (
    <div className="rounded-2xl border border-app-border bg-app-card p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
        <span className="text-xs font-black uppercase tracking-wider text-app-text">
          {lang === 'fr' ? meta.fr : meta.en}
        </span>
        <span className="text-[10px] font-bold text-app-muted">{band.nodes.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {band.nodes.map(n => <AlterCard key={n.alter.id} node={n} lang={lang} {...card} />)}
      </div>
    </div>
  );
}

function BlockBox({ block, lang, ...card }: CardCommon & { block: OrgBlock }) {
  const items: Array<{ key: string; node: React.ReactNode }> = [
    ...block.bands.map(b => ({ key: `band-${b.id}`, node: <BandBox band={b} lang={lang} {...card} /> })),
    ...block.children.map(c => ({ key: `sub-${c.id}`, node: <BlockBox block={c} lang={lang} {...card} /> })),
  ];
  return (
    <div className="rounded-2xl border border-dashed border-app-border bg-app-card/40 p-3">
      <div className="flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-app-muted" />
        <span className="text-xs font-black uppercase tracking-wider text-app-text">{block.name}</span>
        <span className="text-[10px] font-bold text-app-muted">{block.count}</span>
      </div>
      {items.length > 0 ? (
        <Branches items={items} start="header" />
      ) : (
        <p className="text-[11px] text-app-muted mt-2">
          {lang === 'fr'
            ? "Aucun alter à ce niveau (l'hôte et les co-hôtes sont affichés en haut)."
            : 'No alters at this level (the host and co-hosts are shown at the top).'}
        </p>
      )}
    </div>
  );
}

export default function OrgChartPage({
  savedAlters, customRoles, subsystems, unlockedAlterIds, lang, systemName, getRoleName, getRoleColor,
}: OrgChartPageProps) {
  const [mode, setModeState] = useState<OrgMode>(() => (readPref(LS_MODE, 'primary') === 'multi' ? 'multi' : 'primary'));
  const [showRoles, setShowRolesState] = useState<boolean>(() => readPref(LS_ROLES, '1') !== '0');
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const setMode = (m: OrgMode) => { setModeState(m); writePref(LS_MODE, m); };
  const toggleRoles = () => { const next = !showRoles; setShowRolesState(next); writePref(LS_ROLES, next ? '1' : '0'); };

  const chart = useMemo(
    () => buildOrgChart(savedAlters, customRoles, unlockedAlterIds, subsystems, mode),
    [savedAlters, customRoles, unlockedAlterIds, subsystems, mode],
  );

  const card: CardCommon = { lang, showRoles, getRoleName, getRoleColor };

  const handleExport = async () => {
    const node = exportRef.current;
    if (!node || exporting) return;
    setExporting(true);
    try {
      // Laisse le navigateur finir la mise en page avant la capture.
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const themeBg = getComputedStyle(document.documentElement).getPropertyValue('--color-app-bg').trim() || '#ffffff';
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: themeBg,
        skipAutoScale: true,
        // Les boutons (data-no-export) ne doivent pas apparaître dans l'image.
        filter: (n) => !(n instanceof HTMLElement && n.dataset.noExport === 'true'),
        // Une image cassée ne doit pas faire échouer tout l'export.
        imagePlaceholder: PIXEL_PLACEHOLDER,
      });
      const slug = (systemName || 'systeme').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'systeme';
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `organigramme-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[Haven Space] Export de l\'organigramme impossible :', err);
      alert(lang === 'fr'
        ? "L'export a échoué. Réessaie, et si ça persiste, vérifie qu'aucune extension du navigateur ne bloque le téléchargement."
        : 'The export failed. Try again, and if it keeps happening, check that no browser extension is blocking the download.');
    } finally {
      setExporting(false);
    }
  };

  if (chart.total === 0) {
    return (
      <div className="text-center py-16 text-app-muted">
        <Network className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm font-bold">
          {lang === 'fr' ? 'Aucun alter à afficher pour le moment.' : 'No alters to show yet.'}
        </p>
      </div>
    );
  }

  const hasTop = chart.hosts.length > 0 || chart.coHosts.length > 0;

  // Éléments sous la tige centrale : bandes de la racine + blocs de sous-systèmes.
  // S'il existe des sous-systèmes, les alters « sans sous-système » forment leur propre bloc.
  const rootItems: Array<{ key: string; node: React.ReactNode }> = [];
  if (!chart.hasSubsystems) {
    chart.root.bands.forEach(b => rootItems.push({ key: `band-${b.id}`, node: <BandBox band={b} {...card} /> }));
  } else {
    if (chart.root.bands.length > 0) {
      const ownIds = new Set(chart.root.bands.flatMap(b => b.nodes.map(n => n.alter.id)));
      const own: OrgBlock = {
        ...chart.root,
        name: lang === 'fr' ? 'Sans sous-système' : 'No subsystem',
        children: [],
        count: ownIds.size,
      };
      rootItems.push({ key: 'root-own', node: <BlockBox block={own} {...card} /> });
    }
    chart.root.children.forEach(c => rootItems.push({ key: `sub-${c.id}`, node: <BlockBox block={c} {...card} /> }));
  }

  const segBtn = (active: boolean) =>
    `px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
      active ? 'bg-app-text text-app-bg' : 'bg-app-card text-app-muted hover:text-app-text'
    }`;
  const toolBtn =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-app-border bg-app-card text-app-muted hover:text-app-text text-[10px] font-black uppercase tracking-widest transition-colors';

  return (
    <div ref={exportRef} className="space-y-6 w-full p-4 rounded-2xl" style={{ background: 'var(--color-app-bg)' }}>
      <div>
        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2 flex-wrap">
          <Network className="w-6 h-6" />
          {lang === 'fr' ? 'Organigramme' : 'Org chart'}
          {systemName && <span className="text-app-muted text-base font-bold normal-case tracking-normal">— {systemName}</span>}
        </h2>
        <p className="text-xs text-app-muted mt-1" data-no-export="true">
          {mode === 'primary'
            ? (lang === 'fr'
                ? "Hôte, puis co-hôtes, puis catégories. Le premier rôle de fonction d'un alter décide de sa catégorie."
                : "Host, then co-hosts, then categories. An alter's first function role decides its category.")
            : (lang === 'fr'
                ? "Un alter apparaît dans chaque catégorie dont il a un rôle, hôte et co-hôtes compris."
                : 'An alter appears in every category it has a role in, host and co-hosts included.')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2" data-no-export="true">
        <div role="group" className="inline-flex rounded-xl border border-app-border overflow-hidden">
          <button type="button" onClick={() => setMode('primary')} className={segBtn(mode === 'primary')} aria-pressed={mode === 'primary'}>
            {lang === 'fr' ? 'Une catégorie' : 'One category'}
          </button>
          <button type="button" onClick={() => setMode('multi')} className={segBtn(mode === 'multi')} aria-pressed={mode === 'multi'}>
            {lang === 'fr' ? 'Toutes' : 'All'}
          </button>
        </div>
        <button type="button" onClick={toggleRoles} className={toolBtn} aria-pressed={showRoles}>
          {showRoles ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {lang === 'fr' ? 'Rôles sous les noms' : 'Roles under names'}
        </button>
        <button type="button" onClick={handleExport} disabled={exporting} className={`${toolBtn} disabled:opacity-50`}>
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          PNG
        </button>
      </div>

      {/* Niveau 0 : hôte(s) */}
      <div>
        <LevelLabel>
          {lang === 'fr'
            ? (chart.hosts.length > 1 ? 'Hôtes' : 'Hôte')
            : (chart.hosts.length > 1 ? 'Hosts' : 'Host')}
        </LevelLabel>
        <div className="flex flex-wrap justify-center gap-2">
          {chart.hosts.length > 0 ? (
            chart.hosts.map(n => <AlterCard key={n.alter.id} node={n} {...card} />)
          ) : (
            <div className="rounded-xl border border-dashed border-app-border px-4 py-3 text-xs text-app-muted font-bold">
              {lang === 'fr' ? 'Aucun hôte défini' : 'No host defined'}
            </div>
          )}
        </div>
      </div>

      {/* Niveau 1 : co-hôtes (et front-runners) */}
      {chart.coHosts.length > 0 && (
        <div>
          <div className="-mt-6"><Stem /></div>
          <div>
            <LevelLabel>{lang === 'fr' ? 'Co-hôtes' : 'Co-hosts'}</LevelLabel>
            <div className="flex flex-wrap justify-center gap-2">
              {chart.coHosts.map(n => <AlterCard key={n.alter.id} node={n} {...card} />)}
            </div>
          </div>
        </div>
      )}

      {/* Catégories et sous-systèmes : tronc à gauche, un embranchement par élément */}
      {rootItems.length > 0 && (
        <div>
          {hasTop && <div className="-mt-6"><Stem /></div>}
          <Branches items={rootItems} start={hasTop ? 'stem' : 'none'} />
        </div>
      )}
    </div>
  );
}
