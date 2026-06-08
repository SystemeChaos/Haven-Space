/**
 * MoodSpoonWidget.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Bloc humeur + cuillères (Spoon Theory) pour le Registre des Switchs.
 *
 * INTÉGRATION DANS App.tsx :
 *
 * 1. Importer le composant :
 *    import MoodSpoonWidget from './components/MoodSpoonWidget';
 *
 * 2. Ajouter ces deux états dans App() (avec les autres états switch) :
 *    const [switchSpoons, setSwitchSpoons] = useState<number>(12);
 *    const [switchMoods, setSwitchMoods] = useState<string[]>([]);
 *
 * 3. Placer le composant dans le <form> du registre, juste avant le textarea
 *    des notes (chercher "Notes du Switch (optionnel)") :
 *
 *    <MoodSpoonWidget
 *      spoons={switchSpoons}
 *      onSpoonsChange={setSwitchSpoons}
 *      selectedMoods={switchMoods}
 *      onMoodsChange={setSwitchMoods}
 *      lang={lang}
 *    />
 *
 * 4. Dans handleLogSwitch, ajouter les données au SwitchLog :
 *    const newLog: SwitchLog = {
 *      ...
 *      spoons: switchSpoons,
 *      moods: switchMoods.length > 0 ? switchMoods : undefined,
 *    };
 *    // et après setSwitchNotes('') :
 *    setSwitchSpoons(12);
 *    setSwitchMoods([]);
 *
 * 5. Dans types.ts, étendre l'interface SwitchLog :
 *    spoons?: number;
 *    moods?: string[];
 *
 * 6. Dans l'affichage des logs (chercher "p-4 bg-app-card/65 rounded-xl"),
 *    ajouter sous le bloc {log.notes && ...} :
 *
 *    {(log.spoons !== undefined || (log.moods && log.moods.length > 0)) && (
 *      <SwitchLogMoodDisplay spoons={log.spoons} moods={log.moods} lang={lang} />
 *    )}
 *
 *    (SwitchLogMoodDisplay est exporté en bas de ce fichier)
 * ────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';

// ─── Définition des humeurs ──────────────────────────────────────────────────

interface MoodOption {
  id: string;
  labelFr: string;
  labelEn: string;
  /** Emoji léger, pas de mascotte — juste un glyphe Unicode sobre */
  glyph: string;
  /** Couleur sémantique : reste intentionnellement discrète sur tous les thèmes */
  hue: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  // États positifs / ressources
  { id: 'lucide',      labelFr: 'Lucide',       labelEn: 'Lucid',        glyph: '◎', hue: 'var(--color-app-accent)' },
  { id: 'calme',       labelFr: 'Calme',        labelEn: 'Calm',         glyph: '～', hue: 'var(--color-app-accent)' },
  { id: 'ancre',       labelFr: 'Ancré·e',      labelEn: 'Grounded',     glyph: '⚓', hue: 'var(--color-app-accent)' },
  { id: 'present',     labelFr: 'Présent·e',    labelEn: 'Present',      glyph: '◉', hue: 'var(--color-app-accent)' },
  { id: 'creatif',     labelFr: 'Créatif·ve',   labelEn: 'Creative',     glyph: '✦', hue: 'var(--color-app-accent)' },
  { id: 'connecte',    labelFr: 'Connecté·e',   labelEn: 'Connected',    glyph: '⊕', hue: 'var(--color-app-accent)' },
  { id: 'motive',      labelFr: 'Motivé·e',     labelEn: 'Motivated',    glyph: '▲', hue: 'var(--color-app-accent)' },
  // États de charge / tension
  { id: 'fatigue',     labelFr: 'Fatigué·e',    labelEn: 'Tired',        glyph: '◌', hue: '#94a3b8' },
  { id: 'anxieux',     labelFr: 'Anxieux·se',   labelEn: 'Anxious',      glyph: '◈', hue: '#f59e0b' },
  { id: 'dissociation',labelFr: 'Dissocié·e',   labelEn: 'Dissociated',  glyph: '◫', hue: '#94a3b8' },
  { id: 'confus',      labelFr: 'Confus·e',     labelEn: 'Confused',     glyph: '？', hue: '#f59e0b' },
  { id: 'depasse',     labelFr: 'Dépassé·e',    labelEn: 'Overwhelmed',  glyph: '▽', hue: '#f59e0b' },
  { id: 'triste',      labelFr: 'Triste',       labelEn: 'Sad',          glyph: '◟', hue: '#94a3b8' },
  { id: 'en_colere',   labelFr: 'En colère',    labelEn: 'Angry',        glyph: '◆', hue: '#ef4444' },
  { id: 'trigger',     labelFr: 'Triggeré·e',   labelEn: 'Triggered',    glyph: '⚡', hue: '#ef4444' },
  { id: 'engourdi',    labelFr: 'Engourdi·e',   labelEn: 'Numb',         glyph: '▪', hue: '#94a3b8' },
];

// ─── Icône Cuillère SVG ──────────────────────────────────────────────────────

const SpoonIcon: React.FC<{ filled: boolean; size?: number }> = ({ filled, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Tête de cuillère */}
    <ellipse
      cx="12"
      cy="6"
      rx="4"
      ry="5"
      fill={filled ? 'var(--color-app-accent)' : 'none'}
      stroke="var(--color-app-accent)"
      strokeWidth="1.5"
      opacity={filled ? 1 : 0.35}
    />
    {/* Manche */}
    <path
      d="M12 11 L12 21"
      stroke="var(--color-app-accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity={filled ? 1 : 0.35}
    />
  </svg>
);

// ─── Composant principal ─────────────────────────────────────────────────────

interface MoodSpoonWidgetProps {
  spoons: number;
  onSpoonsChange: (v: number) => void;
  selectedMoods: string[];
  onMoodsChange: (moods: string[]) => void;
  lang: 'fr' | 'en';
}

const MoodSpoonWidget: React.FC<MoodSpoonWidgetProps> = ({
  spoons,
  onSpoonsChange,
  selectedMoods,
  onMoodsChange,
  lang,
}) => {
  const TOTAL_SPOONS = 12;

  const toggleMood = (id: string) => {
    onMoodsChange(
      selectedMoods.includes(id)
        ? selectedMoods.filter(m => m !== id)
        : [...selectedMoods, id]
    );
  };

  const spoonLabel =
    lang === 'fr'
      ? `${spoons} cuillère${spoons > 1 ? 's' : ''} disponible${spoons > 1 ? 's' : ''}`
      : `${spoons} spoon${spoons !== 1 ? 's' : ''} available`;

  return (
    <div
      className="rounded-2xl border border-app-border/40 bg-app-bg/50 p-4 space-y-4"
      style={{ borderColor: 'var(--color-app-border)' }}
    >

      {/* ── Section Cuillères ─────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-app-muted">
            {lang === 'fr' ? 'Énergie disponible (Spoon Theory)' : 'Available Energy (Spoon Theory)'}
          </label>
          <span
            className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full border"
            style={{
              background: 'var(--color-app-accent)',
              color: 'var(--color-app-accent-text)',
              borderColor: 'transparent',
              opacity: spoons === 0 ? 0.5 : 1,
            }}
          >
            {spoonLabel}
          </span>
        </div>

        {/* Grille de 12 cuillères cliquables */}
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={lang === 'fr' ? 'Cuillères disponibles' : 'Available spoons'}
        >
          {Array.from({ length: TOTAL_SPOONS }, (_, i) => {
            const index = i + 1;
            const isFilled = index <= spoons;
            return (
              <button
                key={index}
                type="button"
                aria-pressed={isFilled}
                aria-label={
                  lang === 'fr'
                    ? `${index} cuillère${index > 1 ? 's' : ''}`
                    : `${index} spoon${index > 1 ? 's' : ''}`
                }
                onClick={() =>
                  // Clic sur la cuillère active la plus haute → la désactive (toggle)
                  onSpoonsChange(index === spoons ? index - 1 : index)
                }
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <SpoonIcon filled={isFilled} size={22} />
              </button>
            );
          })}
        </div>

        {/* Raccourcis rapides */}
        <div className="flex gap-1.5 flex-wrap">
          {[0, 3, 6, 9, 12].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onSpoonsChange(v)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                spoons === v
                  ? 'border-transparent'
                  : 'bg-app-bg border-app-border/40 text-app-muted hover:border-app-accent/30 hover:text-app-text'
              }`}
              style={
                spoons === v
                  ? {
                      background: 'var(--color-app-accent)',
                      color: 'var(--color-app-accent-text)',
                    }
                  : {}
              }
            >
              {v === 0
                ? lang === 'fr' ? 'Vide' : 'Empty'
                : v === 12
                ? lang === 'fr' ? 'Plein' : 'Full'
                : v}
            </button>
          ))}
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-app-border/20" />

      {/* ── Section Humeurs ──────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-app-muted">
            {lang === 'fr' ? 'État(s) du moment' : 'Current State(s)'}
          </label>
          {selectedMoods.length > 0 && (
            <button
              type="button"
              onClick={() => onMoodsChange([])}
              className="text-[9px] font-black uppercase tracking-widest text-app-muted hover:text-app-text transition-colors"
            >
              {lang === 'fr' ? 'Effacer' : 'Clear'}
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={lang === 'fr' ? "État(s) d'humeur" : 'Mood state(s)'}
        >
          {MOOD_OPTIONS.map(mood => {
            const isSelected = selectedMoods.includes(mood.id);
            return (
              <button
                key={mood.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleMood(mood.id)}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border
                  text-[10px] font-black uppercase tracking-wide
                  transition-all hover:scale-105 active:scale-95 cursor-pointer
                  select-none
                `}
                style={
                  isSelected
                    ? {
                        background: `${mood.hue}18`,
                        borderColor: `${mood.hue}55`,
                        color: mood.hue,
                      }
                    : {
                        background: 'var(--color-app-bg)',
                        borderColor: 'var(--color-app-border)',
                        color: 'var(--color-app-muted)',
                      }
                }
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '11px',
                    lineHeight: 1,
                    color: isSelected ? mood.hue : 'var(--color-app-muted)',
                    opacity: isSelected ? 1 : 0.6,
                  }}
                >
                  {mood.glyph}
                </span>
                {lang === 'fr' ? mood.labelFr : mood.labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodSpoonWidget;

// ─── Affichage compact dans la liste des logs ────────────────────────────────

interface SwitchLogMoodDisplayProps {
  spoons?: number;
  moods?: string[];
  lang: 'fr' | 'en';
}

export const SwitchLogMoodDisplay: React.FC<SwitchLogMoodDisplayProps> = ({
  spoons,
  moods,
  lang,
}) => {
  const TOTAL_SPOONS = 12;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {/* Mini-bar cuillères */}
      {spoons !== undefined && (
        <div className="flex items-center gap-1" title={`${spoons}/${TOTAL_SPOONS} spoons`}>
          {Array.from({ length: TOTAL_SPOONS }, (_, i) => (
            <SpoonIcon key={i} filled={i < spoons} size={12} />
          ))}
          <span className="text-[9px] font-black font-mono text-app-muted ml-1">
            {spoons}/{TOTAL_SPOONS}
          </span>
        </div>
      )}

      {/* Badges d'humeur */}
      {moods && moods.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {moods.map(id => {
            const mood = MOOD_OPTIONS.find(m => m.id === id);
            if (!mood) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border"
                style={{
                  background: `${mood.hue}14`,
                  borderColor: `${mood.hue}40`,
                  color: mood.hue,
                }}
              >
                <span style={{ fontSize: '9px' }}>{mood.glyph}</span>
                {lang === 'fr' ? mood.labelFr : mood.labelEn}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
