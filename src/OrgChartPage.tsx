/**
 * OrgChartPage.tsx — Haven Space
 * Organigramme du système, généré automatiquement à partir des rôles des alters :
 * Hôte en haut, puis co-hôtes, puis une bande par catégorie de fonction.
 * Lecture seule : tout se calcule à l'affichage (voir orgChart.ts), rien n'est stocké.
 */

import React, { useMemo } from 'react';
import { Lock, Network } from 'lucide-react';
import { CustomRole, SavedAlter } from './types';
import { BAND_META, OrgNode, buildOrgChart } from './orgChart';

interface OrgChartPageProps {
  savedAlters: SavedAlter[];
  customRoles: CustomRole[];
  unlockedAlterIds: string[];
  lang: 'fr' | 'en';
  getRoleName: (roleId: string) => string;
  getRoleColor: (roleId: string) => string;
}

const TRUNK_X = 8;      // position du tronc vertical (px, dans le conteneur des bandes)
const BAND_GAP = 12;    // espace entre deux bandes (px)
const STUB_Y = 24;      // hauteur du petit embranchement vers la bande (px)
const LINE = 'var(--color-app-border)';

function AlterCard({ node, lang, getRoleName, getRoleColor }: {
  node: OrgNode;
  lang: 'fr' | 'en';
  getRoleName: (roleId: string) => string;
  getRoleColor: (roleId: string) => string;
}) {
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
        {roleKey && (
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

export default function OrgChartPage({
  savedAlters, customRoles, unlockedAlterIds, lang, getRoleName, getRoleColor,
}: OrgChartPageProps) {
  const chart = useMemo(
    () => buildOrgChart(savedAlters, customRoles, unlockedAlterIds),
    [savedAlters, customRoles, unlockedAlterIds],
  );

  const cardProps = { lang, getRoleName, getRoleColor };

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

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
          <Network className="w-6 h-6" />
          {lang === 'fr' ? 'Organigramme' : 'Org chart'}
        </h2>
        <p className="text-xs text-app-muted mt-1">
          {lang === 'fr'
            ? "Hôte, puis co-hôtes, puis catégories. Le premier rôle de fonction d'un alter décide de sa catégorie."
            : "Host, then co-hosts, then categories. An alter's first function role decides its category."}
        </p>
      </div>

      {/* Niveau 0 : hôte(s) */}
      <div>
        <LevelLabel>{lang === 'fr' ? (chart.hosts.length > 1 ? 'Hôtes' : 'Hôte') : (chart.hosts.length > 1 ? 'Hosts' : 'Host')}</LevelLabel>
        <div className="flex flex-wrap justify-center gap-2">
          {chart.hosts.length > 0 ? (
            chart.hosts.map(n => <AlterCard key={n.alter.id} node={n} {...cardProps} />)
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
              {chart.coHosts.map(n => <AlterCard key={n.alter.id} node={n} {...cardProps} />)}
            </div>
          </div>
        </div>
      )}

      {/* Bandes de catégories : tronc à gauche, un embranchement par bande */}
      {chart.bands.length > 0 && (
        <div>
          {hasTop && <div className="-mt-6"><Stem /></div>}
          <div className="relative pl-6" style={{ paddingTop: BAND_GAP }}>
            {/* Raccord horizontal entre la tige centrale et le tronc */}
            {hasTop && (
              <div style={{ position: 'absolute', top: 0, left: TRUNK_X, right: '50%', height: 2, background: LINE }} />
            )}
            <div className="flex flex-col" style={{ gap: BAND_GAP }}>
              {chart.bands.map((band, i) => {
                const meta = BAND_META[band.id];
                const isLast = i === chart.bands.length - 1;
                return (
                  <div
                    key={band.id}
                    className="relative rounded-2xl border border-app-border bg-app-card p-3"
                  >
                    {/* Tronc vertical (rejoint le segment de la bande précédente) */}
                    <div style={{
                      position: 'absolute',
                      left: -(24 - TRUNK_X),
                      top: -BAND_GAP,
                      width: 2,
                      height: isLast ? BAND_GAP + STUB_Y : `calc(100% + ${BAND_GAP}px)`,
                      background: LINE,
                    }} />
                    {/* Embranchement vers la bande */}
                    <div style={{
                      position: 'absolute',
                      left: -(24 - TRUNK_X),
                      top: STUB_Y,
                      width: 24 - TRUNK_X,
                      height: 2,
                      background: LINE,
                    }} />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
                      <span className="text-xs font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? meta.fr : meta.en}
                      </span>
                      <span className="text-[10px] font-bold text-app-muted">{band.nodes.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {band.nodes.map(n => <AlterCard key={n.alter.id} node={n} {...cardProps} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
