/**
 * InnerworldPage.tsx — Haven Space
 * Monde intérieur : une page "Front Room" (optionnelle, commune) + une page par alter,
 * chacune sous forme de moodboard modulaire (bannière, texte, galerie, audio).
 * Accès par tuiles (photo + nom) depuis un hub, avec vue secondaire "par source".
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Home, Plus, X, Trash2, Tag, Image as ImageIcon, Type as TypeIcon,
  Images, Music, ExternalLink, Sparkles, Layers, Users, Upload, Search, Link2,
} from 'lucide-react';
import { SavedAlter } from './types';
import { readMaybeEncrypted, writeMaybeEncrypted } from './vaultStorage';

// ─── Types ──────────────────────────────────────────────────────────────────

export const FRONT_ROOM_ID = '__frontroom__';

export type InnerworldBlockType = 'banner' | 'text' | 'gallery' | 'audio';

export interface InnerworldBlock {
  id: string;
  type: InnerworldBlockType;
  title?: string;
  content: string; // banner: url image · text: texte libre · gallery: urls séparées par \n · audio: url
}

export interface InnerworldPlace {
  ownerId: string; // alter.id ou FRONT_ROOM_ID
  source?: string;
  visitorIds?: string[]; // uniquement pour le Front Room : alters qui le fréquentent
  blocks: InnerworldBlock[];
  updatedAt: number;
}

// ─── Stockage (par système, par alter/front room) ──────────────────────────

const indexKey = (systemId: string) => `haven_innerworld_index_${systemId}`;
const placeKey = (systemId: string, ownerId: string) => `haven_innerworld_place_${systemId}_${ownerId}`;

async function loadIndex(systemId: string, dek: CryptoKey | null): Promise<string[]> {
  return readMaybeEncrypted<string[]>(indexKey(systemId), dek, []);
}

async function addToIndex(systemId: string, ownerId: string, dek: CryptoKey | null, hasVaultActive: boolean): Promise<void> {
  const idx = await loadIndex(systemId, dek);
  if (!idx.includes(ownerId)) {
    idx.push(ownerId);
    await writeMaybeEncrypted(indexKey(systemId), idx, dek, hasVaultActive);
  }
}

export async function loadPlace(systemId: string, ownerId: string, dek: CryptoKey | null): Promise<InnerworldPlace> {
  return readMaybeEncrypted<InnerworldPlace>(placeKey(systemId, ownerId), dek, { ownerId, blocks: [], updatedAt: Date.now() });
}

export async function savePlace(systemId: string, place: InnerworldPlace, dek: CryptoKey | null, hasVaultActive: boolean): Promise<void> {
  await writeMaybeEncrypted(placeKey(systemId, place.ownerId), { ...place, updatedAt: Date.now() }, dek, hasVaultActive);
  await addToIndex(systemId, place.ownerId, dek, hasVaultActive);
}

// ─── Détection de plateforme audio (pour un rendu plus soigné que l'URL brute) ─

interface AudioPlatform {
  name: string;
  color: string;
  embedUrl?: string;
  embedHeight?: number;
}

function detectAudioPlatform(url: string): AudioPlatform {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');

    if (host.includes('spotify.com')) {
      const m = url.match(/open\.spotify\.com\/(track|album|playlist|episode|artist|show)\/([a-zA-Z0-9]+)/);
      return { name: 'Spotify', color: '#1DB954', embedUrl: m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : undefined, embedHeight: 152 };
    }
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let id: string | null = null;
      const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      const long = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      id = short?.[1] || long?.[1] || embed?.[1] || null;
      return { name: 'YouTube', color: '#FF0000', embedUrl: id ? `https://www.youtube.com/embed/${id}` : undefined, embedHeight: 200 };
    }
    if (host.includes('soundcloud.com')) {
      return { name: 'SoundCloud', color: '#FF5500', embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&show_comments=false&visual=false`, embedHeight: 166 };
    }
    if (host.includes('suno.com')) return { name: 'Suno', color: '#9333EA' };
    if (host.includes('music.apple.com')) return { name: 'Apple Music', color: '#FA243C' };
    if (host.includes('deezer.com')) return { name: 'Deezer', color: '#A238FF' };
    if (host.includes('bandcamp.com')) return { name: 'Bandcamp', color: '#1DA0C3' };
    return { name: host, color: '#8A8578' };
  } catch {
    return { name: 'Lien', color: '#8A8578' };
  }
}

// ─── Upload depuis l'appareil (compression + base64, même logique que le reste de l'app) ─

function compressImageFiles(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return Promise.resolve([]);
  const promises = Array.from(files).map(file => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_size) { height *= max_size / width; width = max_size; }
          } else {
            if (height > max_size) { width *= max_size / height; height = max_size; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  });
  return Promise.all(promises);
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface InnerworldPageProps {
  savedAlters: SavedAlter[];
  lang: 'fr' | 'en';
  activeSystemId?: string;
  /** Alter dont on veut ouvrir directement la page (arrivée depuis la fiche alter). */
  initialAlterId?: string | null;
  /** Callback pour rebondir vers la fiche d'un alter depuis sa page Innerworld. */
  onOpenAlterFiche?: (alterId: string) => void;
  dek?: CryptoKey | null;
  vaultActive?: boolean;
}

const BLOCK_TYPES: { type: InnerworldBlockType; icon: React.ComponentType<any>; label: string; labelEn: string }[] = [
  { type: 'banner', icon: ImageIcon, label: 'Image / Bannière', labelEn: 'Image / Banner' },
  { type: 'text', icon: TypeIcon, label: 'Texte libre', labelEn: 'Free text' },
  { type: 'gallery', icon: Images, label: 'Galerie photos', labelEn: 'Photo gallery' },
  { type: 'audio', icon: Music, label: 'Audio / Playlist', labelEn: 'Audio / Playlist' },
];

export default function InnerworldPage({ savedAlters, lang, activeSystemId = 'main', initialAlterId = null, onOpenAlterFiche, dek = null, vaultActive = false }: InnerworldPageProps) {
  const [view, setView] = useState<'hub' | 'place'>(initialAlterId ? 'place' : 'hub');
  const [hubMode, setHubMode] = useState<'alters' | 'sources'>('alters');
  const [activeOwnerId, setActiveOwnerId] = useState<string | null>(initialAlterId || null);
  const [place, setPlace] = useState<InnerworldPlace | null>(null);
  const [placeIndex, setPlaceIndex] = useState<string[]>([]);
  const [addBlockMenuOpen, setAddBlockMenuOpen] = useState(false);
  const [sourceDraft, setSourceDraft] = useState('');
  const [visitorPickerOpen, setVisitorPickerOpen] = useState(false);
  const [alterSearch, setAlterSearch] = useState('');
  const [alterSuggestOpen, setAlterSuggestOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceSuggestOpen, setSourceSuggestOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [urlInputOpenFor, setUrlInputOpenFor] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState('');

  const t = {
    title: lang === 'fr' ? 'Innerworld' : 'Innerworld',
    subtitle: lang === 'fr' ? "Le monde intérieur du système, lieu par lieu." : "The system's inner world, place by place.",
    tabAlters: lang === 'fr' ? 'Alters' : 'Alters',
    tabSources: lang === 'fr' ? 'Sources' : 'Sources',
    frontRoom: lang === 'fr' ? 'Front Room' : 'Front Room',
    frontRoomDesc: lang === 'fr' ? 'Transits, espace commun, inner partagé…' : 'Transits, shared space, common inner…',
    noAlters: lang === 'fr' ? "Aucun alter enregistré. Crée des fiches d'alters pour les voir ici." : 'No alters saved. Create alter cards to see them here.',
    back: lang === 'fr' ? 'Retour' : 'Back',
    viewFiche: lang === 'fr' ? 'Voir la fiche' : 'View profile',
    source: lang === 'fr' ? 'Source (univers d\u2019origine, optionnel)' : 'Source (origin universe, optional)',
    sourcePlaceholder: lang === 'fr' ? 'ex : Univers de [Jeu/Série]' : 'e.g. [Show/Game] universe',
    addBlock: lang === 'fr' ? 'Ajouter un bloc' : 'Add a block',
    empty: lang === 'fr' ? "Cette page est vide pour l'instant. Ajoute un bloc pour commencer à la personnaliser." : 'This page is empty for now. Add a block to start customizing it.',
    noSource: lang === 'fr' ? 'Sans source' : 'No source',
    sourcesHint: lang === 'fr' ? "Renseigne une source sur la page d'un alter pour le voir apparaître ici, groupé par univers." : "Set a source on an alter's page to see it appear here, grouped by universe.",
    visitors: lang === 'fr' ? 'Alters qui fréquentent cet espace' : 'Alters who frequent this space',
    addVisitor: lang === 'fr' ? 'Ajouter' : 'Add',
    imgUrl: lang === 'fr' ? "URL de l'image" : 'Image URL',
    textPlaceholder: lang === 'fr' ? 'Souvenirs, ambiance, description…' : 'Memories, mood, description…',
    galleryPlaceholder: lang === 'fr' ? 'Une URL d\u2019image par ligne' : 'One image URL per line',
    audioPlaceholder: lang === 'fr' ? 'Lien (playlist, morceau…)' : 'Link (playlist, track…)',
    blockTitlePlaceholder: lang === 'fr' ? 'Titre du bloc (optionnel)' : 'Block title (optional)',
    open: lang === 'fr' ? 'Ouvrir' : 'Open',
    uploadFromDevice: lang === 'fr' ? 'Depuis l\u2019appareil' : 'From device',
    or: lang === 'fr' ? 'ou' : 'or',
    searchAlterPlaceholder: lang === 'fr' ? 'Rechercher un alter…' : 'Search an alter…',
    searchSourcePlaceholder: lang === 'fr' ? 'Rechercher une source…' : 'Search a source…',
    noResults: lang === 'fr' ? 'Aucun résultat' : 'No results',
    addPhotos: lang === 'fr' ? 'Ajouter des photos' : 'Add photos',
    addPhoto: lang === 'fr' ? 'Ajouter une photo' : 'Add a photo',
    addByUrl: lang === 'fr' ? 'Ajouter par URL' : 'Add by URL',
    replace: lang === 'fr' ? 'Remplacer' : 'Replace',
    urlInputPlaceholder: lang === 'fr' ? 'Coller un lien d\u2019image…' : 'Paste an image link…',
    add: lang === 'fr' ? 'Ajouter' : 'Add',
    cancel: lang === 'fr' ? 'Annuler' : 'Cancel',
    noPhotosYet: lang === 'fr' ? 'Aucune photo pour l\u2019instant.' : 'No photos yet.',
    audioEmptyPlaceholder: lang === 'fr' ? 'Colle un lien Spotify, YouTube, SoundCloud, Suno…' : 'Paste a Spotify, YouTube, SoundCloud, Suno link…',
    edit: lang === 'fr' ? 'Modifier' : 'Edit',
    remove: lang === 'fr' ? 'Retirer' : 'Remove',
  };

  useEffect(() => {
    let cancelled = false;
    loadIndex(activeSystemId, dek).then(idx => { if (!cancelled) setPlaceIndex(idx); });
    return () => { cancelled = true; };
  }, [activeSystemId, dek]);

  useEffect(() => {
    if (initialAlterId) {
      setActiveOwnerId(initialAlterId);
      setView('place');
    }
  }, [initialAlterId]);

  useEffect(() => {
    if (view === 'place' && activeOwnerId) {
      let cancelled = false;
      loadPlace(activeSystemId, activeOwnerId, dek).then(p => {
        if (cancelled) return;
        setPlace(p);
        setSourceDraft(p.source || '');
      });
      return () => { cancelled = true; };
    }
  }, [view, activeOwnerId, activeSystemId, dek]);

  const [sourceByOwnerId, setSourceByOwnerId] = useState<Record<string, string>>({});

  // Précalcule la source de chaque page (pour le regroupement "Sources") — remplace
  // l'ancien appel synchrone à loadPlace() pendant le rendu, impossible maintenant que
  // la lecture passe par le coffre chiffré (asynchrone).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        placeIndex.map(async ownerId => {
          const p = await loadPlace(activeSystemId, ownerId, dek);
          return [ownerId, p.source || ''] as const;
        })
      );
      if (cancelled) return;
      const map: Record<string, string> = {};
      for (const [ownerId, source] of entries) if (source) map[ownerId] = source;
      setSourceByOwnerId(map);
    })();
    return () => { cancelled = true; };
  }, [placeIndex, activeSystemId, dek]);

  const persist = useCallback((next: InnerworldPlace) => {
    setPlace(next);
    savePlace(activeSystemId, next, dek, vaultActive).then(() => {
      loadIndex(activeSystemId, dek).then(setPlaceIndex);
    });
  }, [activeSystemId, dek, vaultActive]);

  const openPlace = (ownerId: string) => {
    setActiveOwnerId(ownerId);
    setView('place');
  };

  const backToHub = () => {
    setView('hub');
    setActiveOwnerId(null);
    setPlace(null);
    setAddBlockMenuOpen(false);
  };

  const addBlock = (type: InnerworldBlockType) => {
    if (!place) return;
    const block: InnerworldBlock = { id: `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type, content: '' };
    persist({ ...place, blocks: [...place.blocks, block] });
    setAddBlockMenuOpen(false);
  };

  const updateBlock = (id: string, patch: Partial<InnerworldBlock>) => {
    if (!place) return;
    persist({ ...place, blocks: place.blocks.map(b => (b.id === id ? { ...b, ...patch } : b)) });
  };

  const removeBlock = (id: string) => {
    if (!place) return;
    persist({ ...place, blocks: place.blocks.filter(b => b.id !== id) });
  };

  const commitSource = () => {
    if (!place) return;
    persist({ ...place, source: sourceDraft.trim() || undefined });
  };

  const toggleVisitor = (alterId: string) => {
    if (!place) return;
    const current = place.visitorIds || [];
    const next = current.includes(alterId) ? current.filter(id => id !== alterId) : [...current, alterId];
    persist({ ...place, visitorIds: next });
  };

  const alters = [...savedAlters].filter(a => !a.archived).sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang));

  const filteredAlters = alterSearch.trim()
    ? alters.filter(a => (a.alterName || '').toLowerCase().includes(alterSearch.trim().toLowerCase()))
    : alters;

  const alterSuggestions = alterSearch.trim()
    ? alters.filter(a => (a.alterName || '').toLowerCase().includes(alterSearch.trim().toLowerCase())).slice(0, 6)
    : [];

  // ─── Regroupement par source (vue "Sources") ─────────────────────────────
  const sourceGroups = (() => {
    const groups: Record<string, SavedAlter[]> = {};
    for (const a of alters) {
      if (!placeIndex.includes(a.id)) continue;
      const source = sourceByOwnerId[a.id];
      if (!source) continue;
      if (!groups[source]) groups[source] = [];
      groups[source].push(a);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, lang));
  })();

  const filteredSourceGroups = sourceSearch.trim()
    ? sourceGroups.filter(([source]) => source.toLowerCase().includes(sourceSearch.trim().toLowerCase()))
    : sourceGroups;

  const sourceSuggestions = sourceSearch.trim()
    ? sourceGroups.filter(([source]) => source.toLowerCase().includes(sourceSearch.trim().toLowerCase())).map(([source]) => source).slice(0, 6)
    : [];

  // ─── Rendu : HUB ──────────────────────────────────────────────────────────
  if (view === 'hub') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto w-full animate-fade-in duration-300">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-app-accent" />
            {t.title}
          </h2>
          <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.subtitle}</p>
        </div>

        {/* Toggle Alters / Sources */}
        <div className="inline-flex p-1 rounded-2xl bg-app-card/65 border border-app-border/30">
          <button
            onClick={() => setHubMode('alters')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${hubMode === 'alters' ? 'bg-app-accent text-app-accent-text shadow-sm' : 'text-app-muted hover:text-app-text'}`}
          >
            <Layers className="w-3.5 h-3.5" /> {t.tabAlters}
          </button>
          <button
            onClick={() => setHubMode('sources')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${hubMode === 'sources' ? 'bg-app-accent text-app-accent-text shadow-sm' : 'text-app-muted hover:text-app-text'}`}
          >
            <Tag className="w-3.5 h-3.5" /> {t.tabSources}
          </button>
        </div>

        {hubMode === 'alters' ? (
          <div className="space-y-6">
            {/* Recherche par alter */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  value={alterSearch}
                  onChange={e => { setAlterSearch(e.target.value); setAlterSuggestOpen(true); }}
                  onFocus={() => setAlterSuggestOpen(true)}
                  onBlur={() => setTimeout(() => setAlterSuggestOpen(false), 150)}
                  placeholder={t.searchAlterPlaceholder}
                  className="w-full bg-app-card/65 border border-app-border/30 rounded-2xl pl-10 pr-9 py-3 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40"
                />
                {alterSearch && (
                  <button onClick={() => setAlterSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {alterSuggestOpen && alterSearch.trim() && (
                <div className="absolute left-0 right-0 mt-1 z-20 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {alterSuggestions.length > 0 ? alterSuggestions.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => { openPlace(a.id); setAlterSearch(''); setAlterSuggestOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left text-app-text"
                    >
                      {a.profileImage
                        ? <img src={a.profileImage} className="w-6 h-6 rounded-full object-cover flex-shrink-0" alt="" referrerPolicy="no-referrer" />
                        : <div className="w-6 h-6 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName || '?').charAt(0)}</div>
                      }
                      {a.alterName}
                    </button>
                  )) : (
                    <p className="px-4 py-3 text-xs text-app-muted">{t.noResults}</p>
                  )}
                </div>
              )}
            </div>

            {/* Front Room — tuile épinglée */}
            <button
              onClick={() => openPlace(FRONT_ROOM_ID)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-app-accent/8 border border-app-accent/25 hover:border-app-accent/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-app-accent/15 border border-app-accent/30 flex items-center justify-center text-app-accent shrink-0 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-sm text-app-text uppercase tracking-wide">{t.frontRoom}</p>
                <p className="text-xs text-app-muted">{t.frontRoomDesc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-app-muted group-hover:text-app-accent transition-colors shrink-0" />
            </button>

            {/* Grille de tuiles alters */}
            {alters.length === 0 ? (
              <p className="text-xs text-app-muted text-center py-10">{t.noAlters}</p>
            ) : filteredAlters.length === 0 ? (
              <p className="text-xs text-app-muted text-center py-10">{t.noResults}</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredAlters.map(a => (
                  <button
                    key={a.id}
                    onClick={() => openPlace(a.id)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-app-card/65 border border-transparent hover:border-app-border/30 transition-all group"
                  >
                    {a.profileImage ? (
                      <img src={a.profileImage} alt={a.alterName} className="w-14 h-14 rounded-full object-cover border-2 border-app-border/30 group-hover:border-app-accent/50 transition-colors" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-app-accent/15 border-2 border-app-accent/25 flex items-center justify-center text-app-text font-black text-xs">
                        {a.alterName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-app-text text-center leading-tight truncate w-full">{a.alterName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Recherche par source */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={e => { setSourceSearch(e.target.value); setSourceSuggestOpen(true); }}
                  onFocus={() => setSourceSuggestOpen(true)}
                  onBlur={() => setTimeout(() => setSourceSuggestOpen(false), 150)}
                  placeholder={t.searchSourcePlaceholder}
                  className="w-full bg-app-card/65 border border-app-border/30 rounded-2xl pl-10 pr-9 py-3 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40"
                />
                {sourceSearch && (
                  <button onClick={() => setSourceSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {sourceSuggestOpen && sourceSearch.trim() && (
                <div className="absolute left-0 right-0 mt-1 z-20 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {sourceSuggestions.length > 0 ? sourceSuggestions.map(source => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => { setSourceSearch(source); setSourceSuggestOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left text-app-text"
                    >
                      <Tag className="w-3.5 h-3.5 text-app-accent flex-shrink-0" />
                      {source}
                    </button>
                  )) : (
                    <p className="px-4 py-3 text-xs text-app-muted">{t.noResults}</p>
                  )}
                </div>
              )}
            </div>

            {sourceGroups.length === 0 ? (
              <p className="text-xs text-app-muted text-center py-10">{t.sourcesHint}</p>
            ) : filteredSourceGroups.length === 0 ? (
              <p className="text-xs text-app-muted text-center py-10">{t.noResults}</p>
            ) : (
              filteredSourceGroups.map(([source, members]) => (
                <div key={source} className="p-4 rounded-2xl bg-app-card/65 border border-app-border/30 space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-app-accent flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {source}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {members.map(a => (
                      <button
                        key={a.id}
                        onClick={() => openPlace(a.id)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-app-bg border border-app-border/30 hover:border-app-accent/40 transition-all text-xs font-semibold text-app-text"
                      >
                        {a.profileImage
                          ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                          : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent">{a.alterName.charAt(0)}</div>
                        }
                        {a.alterName}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Rendu : PAGE (moodboard d'un alter ou du Front Room) ────────────────
  const isFrontRoom = activeOwnerId === FRONT_ROOM_ID;
  const alter = !isFrontRoom ? alters.find(a => a.id === activeOwnerId) : null;
  const displayName = isFrontRoom ? t.frontRoom : (alter?.alterName || '');

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full animate-fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={backToHub} className="p-2 rounded-xl border border-app-border/30 hover:border-app-accent/40 transition-all text-app-muted hover:text-app-text shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        {isFrontRoom ? (
          <div className="w-11 h-11 rounded-xl bg-app-accent/15 border border-app-accent/30 flex items-center justify-center text-app-accent shrink-0">
            <Home className="w-5 h-5" />
          </div>
        ) : alter?.profileImage ? (
          <img src={alter.profileImage} alt={displayName} className="w-11 h-11 rounded-xl object-cover border border-app-border/30 shrink-0" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-text font-black shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black uppercase tracking-wider text-app-text truncate">{displayName}</h2>
          {isFrontRoom && <p className="text-[10px] text-app-muted uppercase tracking-widest font-bold">{t.frontRoomDesc}</p>}
        </div>
        {!isFrontRoom && alter && onOpenAlterFiche && (
          <button
            onClick={() => onOpenAlterFiche(alter.id)}
            className="px-3 py-2 rounded-xl border border-app-border/40 hover:border-app-accent/50 text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-text transition-all flex items-center gap-1.5 shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {t.viewFiche}
          </button>
        )}
      </div>

      {/* Source (alters) ou Visiteurs (front room) */}
      {!isFrontRoom ? (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> {t.source}
          </label>
          <input
            type="text"
            value={sourceDraft}
            onChange={e => setSourceDraft(e.target.value)}
            onBlur={commitSource}
            placeholder={t.sourcePlaceholder}
            className="w-full bg-app-card/65 border border-app-border/30 rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Users className="w-3 h-3" /> {t.visitors}
          </label>
          <div className="flex flex-wrap gap-2">
            {(place?.visitorIds || []).map(id => {
              const a = alters.find(x => x.id === id);
              if (!a) return null;
              return (
                <span key={id} className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-app-card/65 border border-app-border/30 text-xs font-semibold text-app-text">
                  {a.profileImage
                    ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                    : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent">{a.alterName.charAt(0)}</div>
                  }
                  {a.alterName}
                  <button onClick={() => toggleVisitor(id)} className="text-app-muted hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              );
            })}
            <button
              onClick={() => setVisitorPickerOpen(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-app-border/40 text-xs font-semibold text-app-muted hover:text-app-text hover:border-app-accent/40 transition-all"
            >
              <Plus className="w-3 h-3" /> {t.addVisitor}
            </button>
          </div>
          {visitorPickerOpen && (
            <div className="p-3 rounded-xl bg-app-card/65 border border-app-border/30 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {alters.filter(a => !(place?.visitorIds || []).includes(a.id)).map(a => (
                <button
                  key={a.id}
                  onClick={() => { toggleVisitor(a.id); }}
                  className="px-2.5 py-1 rounded-full bg-app-bg border border-app-border/30 hover:border-app-accent/40 text-xs font-semibold text-app-text transition-all"
                >
                  {a.alterName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blocs */}
      <div className="space-y-4">
        {place && place.blocks.length === 0 && (
          <p className="text-xs text-app-muted text-center py-8 border border-dashed border-app-border/30 rounded-2xl">{t.empty}</p>
        )}

        {place?.blocks.map(block => {
          const cfg = BLOCK_TYPES.find(b => b.type === block.type)!;
          const Icon = cfg.icon;
          return (
            <div key={block.id} className="p-4 rounded-2xl bg-app-card/65 border border-app-border/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-app-accent shrink-0" />
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={e => updateBlock(block.id, { title: e.target.value })}
                  placeholder={t.blockTitlePlaceholder}
                  className="flex-1 bg-transparent text-xs font-black uppercase tracking-widest text-app-muted focus:outline-none placeholder:text-app-muted/40"
                />
                <button onClick={() => removeBlock(block.id)} className="p-1 text-app-muted hover:text-red-400 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {block.type === 'banner' && (
                <>
                  {block.content ? (
                    <div className="relative group">
                      <img
                        src={block.content}
                        alt=""
                        onClick={() => setLightboxUrl(block.content)}
                        className="w-full max-h-56 object-cover rounded-xl border border-app-border/20 cursor-zoom-in"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="p-1.5 rounded-lg bg-app-bg/90 border border-app-border/40 text-app-muted hover:text-app-accent cursor-pointer transition-colors" title={t.replace}>
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              compressImageFiles(e.target.files).then(urls => {
                                if (urls[0]) updateBlock(block.id, { content: urls[0] });
                              });
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          onClick={() => updateBlock(block.id, { content: '' })}
                          className="p-1.5 rounded-lg bg-app-bg/90 border border-app-border/40 text-app-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : urlInputOpenFor === block.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={urlDraft}
                        onChange={e => setUrlDraft(e.target.value)}
                        placeholder={t.urlInputPlaceholder}
                        className="flex-1 bg-app-bg border border-app-border/30 rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none placeholder:text-app-muted/40"
                      />
                      <button
                        onClick={() => { if (urlDraft.trim()) updateBlock(block.id, { content: urlDraft.trim() }); setUrlDraft(''); setUrlInputOpenFor(null); }}
                        className="px-3 py-2 rounded-xl bg-app-accent text-app-accent-text text-[10px] font-black uppercase tracking-widest shrink-0"
                      >
                        {t.add}
                      </button>
                      <button
                        onClick={() => { setUrlDraft(''); setUrlInputOpenFor(null); }}
                        className="p-2 rounded-xl border border-app-border/30 text-app-muted hover:text-app-text transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-app-border/40 text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-accent hover:border-app-accent/40 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        {t.addPhoto}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            compressImageFiles(e.target.files).then(urls => {
                              if (urls[0]) updateBlock(block.id, { content: urls[0] });
                            });
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        onClick={() => setUrlInputOpenFor(block.id)}
                        className="p-3 rounded-xl border border-app-border/30 text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-colors shrink-0"
                        title={t.addByUrl}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {block.type === 'text' && (
                <textarea
                  value={block.content}
                  onChange={e => updateBlock(block.id, { content: e.target.value })}
                  placeholder={t.textPlaceholder}
                  rows={4}
                  className="w-full bg-app-bg border border-app-border/30 rounded-xl px-3 py-2 text-sm text-app-text focus:outline-none placeholder:text-app-muted/40 resize-y"
                />
              )}

              {block.type === 'gallery' && (() => {
                const photos = block.content.split('\n').map(s => s.trim()).filter(Boolean);
                const removePhoto = (url: string) => {
                  updateBlock(block.id, { content: photos.filter(p => p !== url).join('\n') });
                };
                const addUrl = () => {
                  if (urlDraft.trim()) updateBlock(block.id, { content: [...photos, urlDraft.trim()].join('\n') });
                  setUrlDraft('');
                  setUrlInputOpenFor(null);
                };
                return (
                  <>
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((url, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={url}
                              alt=""
                              onClick={() => setLightboxUrl(url)}
                              className="w-full h-20 object-cover rounded-lg border border-app-border/20 cursor-zoom-in"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => removePhoto(url)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-app-bg/90 border border-app-border/40 text-app-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-app-muted text-center py-3">{t.noPhotosYet}</p>
                    )}

                    {urlInputOpenFor === block.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={urlDraft}
                          onChange={e => setUrlDraft(e.target.value)}
                          placeholder={t.urlInputPlaceholder}
                          className="flex-1 bg-app-bg border border-app-border/30 rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none placeholder:text-app-muted/40"
                        />
                        <button onClick={addUrl} className="px-3 py-2 rounded-xl bg-app-accent text-app-accent-text text-[10px] font-black uppercase tracking-widest shrink-0">
                          {t.add}
                        </button>
                        <button
                          onClick={() => { setUrlDraft(''); setUrlInputOpenFor(null); }}
                          className="p-2 rounded-xl border border-app-border/30 text-app-muted hover:text-app-text transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-app-border/40 text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-accent hover:border-app-accent/40 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          {t.addPhotos}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              compressImageFiles(e.target.files).then(urls => {
                                if (urls.length === 0) return;
                                updateBlock(block.id, { content: [...photos, ...urls].join('\n') });
                              });
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          onClick={() => setUrlInputOpenFor(block.id)}
                          className="p-2 rounded-xl border border-app-border/30 text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-colors shrink-0"
                          title={t.addByUrl}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}

              {block.type === 'audio' && (() => {
                const platform = block.content ? detectAudioPlatform(block.content) : null;
                const editing = urlInputOpenFor === block.id || !block.content;
                return (
                  <>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus={urlInputOpenFor === block.id}
                          defaultValue={block.content}
                          onBlur={e => { updateBlock(block.id, { content: e.target.value.trim() }); setUrlInputOpenFor(null); }}
                          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                          placeholder={t.audioEmptyPlaceholder}
                          className="flex-1 bg-app-bg border border-app-border/30 rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none placeholder:text-app-muted/40"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {platform?.embedUrl ? (
                          <iframe
                            src={platform.embedUrl}
                            width="100%"
                            height={platform.embedHeight || 166}
                            style={{ border: 0, borderRadius: '0.75rem' }}
                            allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
                            loading="lazy"
                            title={platform.name}
                          />
                        ) : (
                          <a
                            href={block.content}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-app-border/30 hover:border-app-accent/40 transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${platform?.color}22`, color: platform?.color }}>
                              <Music className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black uppercase tracking-widest text-app-text">{platform?.name}</p>
                              <p className="text-[10px] text-app-muted truncate">{block.content}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-app-muted group-hover:text-app-accent transition-colors shrink-0" />
                          </a>
                        )}
                        <div className="flex items-center gap-3">
                          <button onClick={() => setUrlInputOpenFor(block.id)} className="text-[10px] font-bold uppercase tracking-widest text-app-muted hover:text-app-accent transition-colors">
                            {t.edit}
                          </button>
                          <button onClick={() => updateBlock(block.id, { content: '' })} className="text-[10px] font-bold uppercase tracking-widest text-app-muted hover:text-red-400 transition-colors">
                            {t.remove}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          );
        })}

        {/* Ajouter un bloc */}
        <div className="relative">
          <button
            onClick={() => setAddBlockMenuOpen(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-app-border/40 text-xs font-black uppercase tracking-widest text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-all"
          >
            <Plus className="w-4 h-4" /> {t.addBlock}
          </button>
          {addBlockMenuOpen && (
            <div className="absolute left-0 right-0 mt-2 z-20 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
              {BLOCK_TYPES.map(bt => {
                const Icon = bt.icon;
                return (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold hover:bg-app-bg transition-colors text-left text-app-text"
                  >
                    <Icon className="w-4 h-4 text-app-accent shrink-0" />
                    {lang === 'fr' ? bt.label : bt.labelEn}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={lightboxUrl} alt="" className="max-w-full max-h-full object-contain rounded-xl" referrerPolicy="no-referrer" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
