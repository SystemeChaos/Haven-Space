
import MappingPage, { loadMapping, saveMapping, MappingRelation, MappingNode } from './MappingPage';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  Shield, 
  Heart, 
  Key, 
  User, 
  Baby, 
  Ghost, 
  Sparkles, 
  Download, 
  Plus, 
  X,
  Info,
  Palette,
  Flag,
  Star,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Diamond,
  Settings2,
  Layers,
  Trash2,
  Move,
  Map,
  Languages,
  Eye,
  Briefcase,
  Lock,
  Zap,
  Activity,
  Brain,
  FileText,
  HelpCircle,
  AlertTriangle,
  Hammer,
  Swords,
  Grid,
  Infinity,
  Puzzle,
  Link,
  Link2,
  TreePine,
  Wind,
  AlertCircle,
  Cloud,
  History,
  Split,
  ShieldAlert,
  Orbit,
  SunMoon,
  Repeat,
  Utensils,
  EyeOff,
  Theater,
  Crown,
  Cpu,
  UserMinus,
  Users,
  Undo2,
  Redo2,
  Type,
  Anchor,
  Compass,
  Feather,
  Flame,
  Moon,
  Sun,
  ZapOff,
  Mountain,
  Waves,
  Book,
  Hourglass,
  CloudRain,
  Ear,
  MoonStar,
  Thermometer,
  ChevronUp,
  ChevronDown,
  Ribbon,
  Ampersand,
  VolumeX,
  ExternalLink,
  Smile,
  Frown,
  Bomb,
  Scale,
  Archive,
  VenetianMask,
  Hand,
  ShoppingBag,
  HeartPulse,
  Scissors,
  Binary,
  Search,
  Brush,
  Dumbbell,
  Music,
  ShieldCheck,
  UserPlus,
  Target,
  CheckCircle2,
  LayoutGrid,
  Laugh,
  MessageSquareQuote,
  Timer,
  BarChart3,
  Vote,
  Clock,
  Home,
  ArrowLeftRight,
  UserCheck,
  Calculator,
  Skull,
  MicOff,
  Fingerprint,
  EarOff,
  BatteryLow,
  Upload,
  HeartOff,
  Umbrella,
  DoorOpen,
  Save,
  GitBranch,
  FileJson,
  Tag,
  Hash,
  Pencil,
  Mail,
  Send,
  Anchor,
  ChevronRight,
} from 'lucide-react';
import { AlterRole, Gender, Sexuality, Trait, PersonalityTrait, Disorder, ROLE_CONFIGS, GENDER_COLORS, SEXUALITY_COLORS, ShapeType, PatternType, PatternLayer, Decoration, GENDER_CATEGORIES, SEXUALITY_CATEGORIES, TraitDecoration, Theme, SavedAlter, CustomField, Subsystem, ParallelSystem, ChatMessage, DirectMessage, DirectConversation, SwitchLog, JournalEntry } from './types';
import { translations } from './translations';
import LegalPages, { LegalPage } from './components/LegalPages';
import SwitchAnalytics from './components/SwitchAnalytics';
import MoodSpoonWidget, { SwitchLogMoodDisplay } from './components/MoodSpoonWidget';


// ─── Markdown renderer + editor ────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  const parseInline = (line: string, key: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let rest = line;
    let i = 0;
    const patterns: [RegExp, (m: string, k: string) => React.ReactNode][] = [
      [/\*\*(.+?)\*\*/,  (m, k) => <strong key={k}>{m}</strong>],
      [/_(.+?)_/,          (m, k) => <em key={k}>{m}</em>],
      [/`(.+?)`/,          (m, k) => <code key={k} className="bg-app-card px-1 py-0.5 rounded text-[11px] font-mono">{m}</code>],
    ];
    while (rest.length > 0) {
      let earliest = rest.length;
      let matchedPat: null | typeof patterns[0] = null;
      let matchedIdx = -1;
      for (const pat of patterns) {
        const m = pat[0].exec(rest);
        if (m && m.index < earliest) { earliest = m.index; matchedPat = pat; matchedIdx = m.index; }
      }
      if (!matchedPat) { parts.push(rest); break; }
      if (matchedIdx > 0) parts.push(rest.slice(0, matchedIdx));
      const m2 = matchedPat[0].exec(rest)!;
      parts.push(matchedPat[1](m2[1], `${key}-${i++}`));
      rest = rest.slice(matchedIdx + m2[0].length);
    }
    return <>{parts}</>;
  };

  let listItems: React.ReactNode[] = [];
  const flushList = () => {
    if (listItems.length) {
      nodes.push(<ul key={`ul-${nodes.length}`} className="list-disc ml-5 space-y-1 text-sm text-app-text/90">{listItems}</ul>);
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const k = `line-${idx}`;
    if (/^### (.+)/.test(line)) { flushList(); const m = line.match(/^### (.+)/)!; nodes.push(<h3 key={k} className="text-base font-black text-app-text mt-3 mb-1">{m[1]}</h3>); }
    else if (/^## (.+)/.test(line)) { flushList(); const m = line.match(/^## (.+)/)!; nodes.push(<h2 key={k} className="text-lg font-black text-app-text mt-4 mb-1">{m[1]}</h2>); }
    else if (/^# (.+)/.test(line)) { flushList(); const m = line.match(/^# (.+)/)!; nodes.push(<h1 key={k} className="text-xl font-black text-app-text mt-4 mb-2">{m[1]}</h1>); }
    else if (/^- (.+)/.test(line) || /^\* (.+)/.test(line)) { const m = line.match(/^[-*] (.+)/)!; listItems.push(<li key={k}>{parseInline(m[1], k)}</li>); }
    else if (/^---+$/.test(line.trim())) { flushList(); nodes.push(<hr key={k} className="border-app-border my-3" />); }
    else if (line.trim() === '') { flushList(); nodes.push(<div key={k} className="h-2" />); }
    else { flushList(); nodes.push(<p key={k} className="text-sm text-app-text/90 leading-relaxed">{parseInline(line, k)}</p>); }
  });
  flushList();
  return nodes;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

function MarkdownEditor({ value, onChange, placeholder, rows = 6, maxLength, className = '' }: MarkdownEditorProps) {
  const [preview, setPreview] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || 'texte';
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    }, 0);
  };

  const insertLine = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length); }, 0);
  };

  const toolbarBtns: { label: string; title: string; action: () => void }[] = [
    { label: 'B',  title: 'Gras',     action: () => wrap('**', '**') },
    { label: 'I',  title: 'Italique', action: () => wrap('_', '_') },
    { label: '`',  title: 'Code',     action: () => wrap('`', '`') },
    { label: 'H1', title: 'Titre 1',  action: () => insertLine('# ') },
    { label: 'H2', title: 'Titre 2',  action: () => insertLine('## ') },
    { label: 'H3', title: 'Titre 3',  action: () => insertLine('### ') },
    { label: '—',  title: 'Liste',    action: () => insertLine('- ') },
  ];

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap">
        {toolbarBtns.map(btn => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={btn.action}
            disabled={preview}
            className="px-2 py-1 rounded-lg bg-app-card border border-app-border text-[11px] font-black hover:bg-app-accent/10 hover:text-app-accent hover:border-app-accent/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {btn.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all border ${!preview ? 'bg-app-accent text-white border-app-accent' : 'bg-app-card border-app-border text-app-muted hover:text-app-text'}`}
          >
            Éditer
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all border ${preview ? 'bg-app-accent text-white border-app-accent' : 'bg-app-card border-app-border text-app-muted hover:text-app-text'}`}
          >
            Aperçu
          </button>
        </div>
      </div>

      {/* Zone édition ou prévisualisation */}
      {preview ? (
        <div className="w-full min-h-[7rem] bg-app-card border border-app-border rounded-2xl px-6 py-4 text-sm leading-relaxed space-y-1">
          {value.trim() ? renderMarkdown(value) : <span className="text-app-muted italic">{placeholder || 'Rien à afficher.'}</span>}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full bg-app-card border border-app-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all text-sm leading-relaxed resize-none font-sans text-app-text placeholder:text-app-muted"
        />
      )}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [font, setFont] = useState<string>(() => localStorage.getItem('hs-font') || 'font-sans');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('hs-theme') as Theme) || Theme.LIGHT);
  const [activeLegalPage, setActiveLegalPage] = useState<LegalPage | null>(null);

  const fonts = [
    { name: 'Sans', value: 'font-sans' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Modern', value: 'font-space' },
    { name: 'Elegant', value: 'font-playfair' },
    { name: 'Mono', value: 'font-mono' },
    { name: 'Clean', value: 'font-montserrat' },
    { name: 'Rounded', value: 'font-outfit' },
    { name: 'Classic', value: 'font-baskerville' },
    { name: 'Readable', value: 'font-lexend' },
    { name: 'Soft', value: 'font-fraunces' },
    { name: 'Artistic', value: 'font-syne' },
    { name: 'Balanced', value: 'font-work' },
    { name: 'Friendly', value: 'font-quicksand' },
    { name: 'Literary', value: 'font-lora' },
    { name: 'Code', value: 'font-fira' },
    { name: 'Stylish', value: 'font-raleway' },
    { name: 'Ancient', value: 'font-cinzel' },
    { name: 'Neutral', value: 'font-opensans' },
    { name: 'Roboto', value: 'font-roboto' },
    { name: 'Ranade', value: 'font-ranade' },
    { name: 'Soria', value: 'font-soria' },
    { name: 'Arvo', value: 'font-arvo' },
  ];
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    roles: true,
    gender: false,
    sexuality: false,
    pattern: false,
    personalityTraits: false,
    disorders: false,
    elements: false,
    predefined: false,
    customFields: false,
    archivesOpen: false,
  });
  const [activeRolePatternSettings, setActiveRolePatternSettings] = useState<AlterRole | null>(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [archivesModalOpen, setArchivesModalOpen] = useState(false);
  const [archivesSearch, setArchivesSearch] = useState('');
  const [systemSearch, setSystemSearch] = useState('');
  const t = translations[lang];

  const sortedFrontStatusKeys = Object.keys(t.frontStatuses).sort((a, b) => {
    const valA = t.frontStatuses[a as keyof typeof t.frontStatuses] || '';
    const valB = t.frontStatuses[b as keyof typeof t.frontStatuses] || '';
    return valA.localeCompare(valB, lang);
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // --- History Management ---
  const [history, setHistory] = useState<{
    selectedRoles: AlterRole[];
    selectedGenders: Gender[];
    selectedSexualities: Sexuality[];
    traitDecorations: TraitDecoration[];
    patternLayers: PatternLayer[];
    decorations: Decoration[];
    alterName: string;
    customRoleColors: Record<string, string>;
    customGenderColors: Record<string, string>;
    customSexualityColors: Record<string, string>;
    theme: Theme;
    profileImage: string;
    description: string;
    internalNotes: string;
  }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [selectedRoles, setSelectedRoles] = useState<AlterRole[]>([AlterRole.HOST]);
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>([Gender.NEUTRAL]);
  const [selectedSexualities, setSelectedSexualities] = useState<Sexuality[]>([Sexuality.OTHER]);
  const [traitDecorations, setTraitDecorations] = useState<TraitDecoration[]>([]);
  const [patternLayers, setPatternLayers] = useState<PatternLayer[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [activeDecorationId, setActiveDecorationId] = useState<string | null>(null);
  const [activeTraitId, setActiveTraitId] = useState<Trait | null>(null);
  const [alterName, setAlterName] = useState('');
  const [customRoleColors, setCustomRoleColors] = useState<Record<string, string>>({});
  const [customGenderColors, setCustomGenderColors] = useState<Record<string, string>>({});
  const [customSexualityColors, setCustomSexualityColors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [alterAge, setAlterAge] = useState('');
  const [alterColor, setAlterColor] = useState('');
  const [triggersPositive, setTriggersPositive] = useState('');
  const [triggersNegative, setTriggersNegative] = useState('');
  const [alterLanguages, setAlterLanguages] = useState('');
  const [alterOriginWorld, setAlterOriginWorld] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [frontStatus, setFrontStatus] = useState<string>('none');
  const [mainSystemName, setMainSystemName] = useState<string>(() => {
    return localStorage.getItem('mainSystemName') || (lang === 'fr' ? 'Système Principal' : 'Primary System');
  });

  // Custom dialogue boxes to bypass sandboxed iframe restrictions
  const [deleteConfirmAlterId, setDeleteConfirmAlterId] = useState<string | null>(null);
  const [deleteConfirmSubsystemId, setDeleteConfirmSubsystemId] = useState<string | null>(null);
  const [deleteConfirmSwitchLogId, setDeleteConfirmSwitchLogId] = useState<string | null>(null);
  const [deleteConfirmJournalId, setDeleteConfirmJournalId] = useState<string | null>(null);
  const [deleteConfirmClearChat, setDeleteConfirmClearChat] = useState<boolean>(false);
  const [loadConfirmAlter, setLoadConfirmAlter] = useState<SavedAlter | null>(null);

  // --- DID Local Form States ---
  const [newSubName, setNewSubName] = useState('');
  const [newSubParentId, setNewSubParentId] = useState('');
  
  const [chatSpeakerId, setChatSpeakerId] = useState<string>('external');
  const [chatText, setChatText] = useState('');
  
  // --- Chat Poll Creator States ---
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState<number>(5);
  const [pollDurationUnit, setPollDurationUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');

  const [switchSelectedAlterIds, setSwitchSelectedAlterIds] = useState<string[]>([]);
  const [switchSelectedStatus, setSwitchSelectedStatus] = useState<string>('co_front');
  const [switchRetroDate, setSwitchRetroDate] = useState<string>('');
  const [switchEndDate, setSwitchEndDate] = useState<string>('');
  const [switchNotes, setSwitchNotes] = useState('');
  const [switchSpoons, setSwitchSpoons] = useState<number>(12);
  const [switchMoods, setSwitchMoods] = useState<string[]>([]);

  const [journalTitleInput, setJournalTitleInput] = useState('');
  const [journalContentInput, setJournalContentInput] = useState('');
  const [journalImages, setJournalImages] = useState<string[]>([]);
  const [journalSearch, setJournalSearch] = useState('');

  // --- PluralKit & Navigation Dropdown States ---
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [settingsFontOpen, setSettingsFontOpen] = useState(false);
  const [settingsThemeOpen, setSettingsThemeOpen] = useState(false);

  // --- Notifications ---
  const [notifBrowser, setNotifBrowser] = useState<boolean>(() => localStorage.getItem('hs-notif-browser') === 'true');
  const [notifToast, setNotifToast] = useState<boolean>(() => localStorage.getItem('hs-notif-toast') !== 'false'); // activé par défaut
  const [toasts, setToasts] = useState<{ id: string; alterName: string; status: string; avatar?: string }[]>([]);

  const addToast = (alterName: string, status: string, avatar?: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, alterName, status, avatar }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  const requestBrowserNotifPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  };

  const toggleBrowserNotif = async () => {
    if (!notifBrowser) {
      const granted = await requestBrowserNotifPermission();
      if (!granted) return;
      setNotifBrowser(true);
      localStorage.setItem('hs-notif-browser', 'true');
    } else {
      setNotifBrowser(false);
      localStorage.setItem('hs-notif-browser', 'false');
    }
  };

  const toggleToastNotif = () => {
    setNotifToast(prev => {
      localStorage.setItem('hs-notif-toast', String(!prev));
      return !prev;
    });
  };

  const fireSwitchNotifications = (alterNames: string[], status: string, avatar?: string) => {
    const label = alterNames.join(', ');
    const statusLabel = t.frontStatuses[status as keyof typeof t.frontStatuses] || status;
    const body = `${label} · ${statusLabel}`;
    if (notifToast) alterNames.forEach((name, i) => {
      const av = i === 0 ? avatar : undefined;
      setTimeout(() => addToast(name, statusLabel, av), i * 300);
    });
    if (notifBrowser && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('✦ Haven Space — Switch', { body, icon: avatar || '/icon-192.png', badge: '/icon-192.png' });
    }
  };
  const [pkToken, setPkToken] = useState<string>(() => localStorage.getItem('pk_token') || '');
  const [pkSystem, setPkSystem] = useState<any | null>(null);
  const [pkMembers, setPkMembers] = useState<any[]>([]);
  const [pkLoading, setPkLoading] = useState<boolean>(false);
  const [pkError, setPkError] = useState<string | null>(null);
  const [pkSuccess, setPkSuccess] = useState<string | null>(null);
  const [isExportingPkId, setIsExportingPkId] = useState<string | null>(null);

  // --- JSON Synchronisation / Backup States ---
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);
  const [jsonDragOver, setJsonDragOver] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<any | null>(null);

  // --- DID LocalStorage Tabs & State ---
  const [currentTab, setCurrentTab] = useState<'creator' | 'system' | 'chat' | 'switch' | 'mapping' | 'journal' | 'messaging' | 'grounding' | 'pluralkit'>('system');
  const [editingAlterId, setEditingAlterId] = useState<string | null>(null);
  const [saveConflictAlter, setSaveConflictAlter] = useState<SavedAlter | null>(null);
  
  const [savedAlters, setSavedAlters] = useState<SavedAlter[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedAlters') || '[]');
    } catch {
      return [];
    }
  });

  const [subsystems, setSubsystems] = useState<Subsystem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('subsystems') || '[]');
    } catch {
      return [];
    }
  });

  // --- Systèmes parallèles ---
  const [parallelSystems, setParallelSystems] = useState<ParallelSystem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('parallelSystems') || '[]');
    } catch {
      return [];
    }
  });
  const [activeSystemId, setActiveSystemId] = useState<string>(() =>
    localStorage.getItem('activeSystemId') || 'main'
  );
  const [showParallelSystemForm, setShowParallelSystemForm] = useState(false);
  const [parallelSystemFormName, setParallelSystemFormName] = useState('');
  const [editingParallelSystemId, setEditingParallelSystemId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('chatMessages') || '[]');
    } catch {
      return [];
    }
  });

  // --- Salons (canaux internes) ---
  const DEFAULT_SALON_ID = 'salon-general';
  // --- Messagerie inter-alters ---
  const [conversations, setConversations] = useState<DirectConversation[]>(() => {
    try { return JSON.parse(localStorage.getItem('hs-conversations') || '[]'); } catch { return []; }
  });
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem('hs-direct-messages') || '[]'); } catch { return []; }
  });
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [msgText, setMsgText] = useState('');
  const [msgSenderId, setMsgSenderId] = useState<string>('');
  const [showNewConvPanel, setShowNewConvPanel] = useState(false);
  const [newConvAlter1, setNewConvAlter1] = useState<string>('');
  const [newConvAlter2, setNewConvAlter2] = useState<string>('');

  const [chatSalons, setChatSalons] = useState<{ id: string; name: string; emoji: string; createdAt: number; accessMode: 'blacklist' | 'whitelist'; blockedOrAllowedIds: string[] }[]>(() => {
    try {
      const stored = localStorage.getItem('chatSalons');
      if (stored) return JSON.parse(stored);
      return [{ id: DEFAULT_SALON_ID, name: 'Général', emoji: '💬', createdAt: Date.now(), accessMode: 'blacklist' as const, blockedOrAllowedIds: [] }];
    } catch {
      return [{ id: DEFAULT_SALON_ID, name: 'Général', emoji: '💬', createdAt: Date.now(), accessMode: 'blacklist' as const, blockedOrAllowedIds: [] }];
    }
  });
  const [activeSalonId, setActiveSalonId] = useState<string>(DEFAULT_SALON_ID);
  const [showSalonForm, setShowSalonForm] = useState(false);
  const [salonFormName, setSalonFormName] = useState('');
  const [salonFormEmoji, setSalonFormEmoji] = useState('💬');
  const [editingSalonId, setEditingSalonId] = useState<string | null>(null);
  const [rightsOpenSalonId, setRightsOpenSalonId] = useState<string | null>(null); // salon dont le panneau droits est ouvert

  const [switchLogs, setSwitchLogs] = useState<SwitchLog[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('switchLogs') || '[]');
    } catch {
      return [];
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('journalEntries') || '[]');
    } catch {
      return [];
    }
  });

  // LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('savedAlters', JSON.stringify(savedAlters));
  }, [savedAlters]);

  useEffect(() => {
    localStorage.setItem('mainSystemName', mainSystemName);
  }, [mainSystemName]);

  useEffect(() => {
    localStorage.setItem('subsystems', JSON.stringify(subsystems));
  }, [subsystems]);

  useEffect(() => {
    localStorage.setItem('parallelSystems', JSON.stringify(parallelSystems));
  }, [parallelSystems]);

  useEffect(() => {
    localStorage.setItem('activeSystemId', activeSystemId);
  }, [activeSystemId]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('chatSalons', JSON.stringify(chatSalons));
  }, [chatSalons]);

  useEffect(() => {
    localStorage.setItem('hs-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('hs-direct-messages', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem('switchLogs', JSON.stringify(switchLogs));
  }, [switchLogs]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // --- PluralKit Sync & Export Logic ---
  const fetchPluralKitSystem = async (tokenValue: string) => {
    if (!tokenValue) return;
    setPkLoading(true);
    setPkError(null);
    setPkSuccess(null);
    try {
      const sysResponse = await fetch('https://api.pluralkit.me/v2/systems/@me', {
        headers: {
          'Authorization': tokenValue,
        }
      });
      if (!sysResponse.ok) {
        throw new Error(lang === 'fr' ? 'Jeton PluralKit invalide ou expiré.' : 'Invalid or expired PluralKit token.');
      }
      const sysData = await sysResponse.json();
      setPkSystem(sysData);

      const memResponse = await fetch('https://api.pluralkit.me/v2/systems/@me/members', {
        headers: {
          'Authorization': tokenValue,
        }
      });
      if (!memResponse.ok) {
        throw new Error(lang === 'fr' ? 'Impossible de récupérer les membres.' : 'Could not retrieve PluralKit members.');
      }
      const memData = await memResponse.json();
      setPkMembers(memData);
      
      localStorage.setItem('pk_token', tokenValue);
      setPkToken(tokenValue);
    } catch (err: any) {
      setPkError(err.message || 'Error connecting to PluralKit');
      setPkSystem(null);
      setPkMembers([]);
    } finally {
      setPkLoading(false);
    }
  };

  const handleDisconnectPk = () => {
    localStorage.removeItem('pk_token');
    setPkToken('');
    setPkSystem(null);
    setPkMembers([]);
    setPkSuccess(null);
    setPkError(null);
  };


  // ─── Parser description PluralKit → champs structurés Haven Space ──────────
  const parsePluralKitDescription = (desc: string | null, existingAlter?: SavedAlter) => {
    if (!desc) return {
      roles: existingAlter?.selectedRoles || [] as string[],
      genders: existingAlter?.selectedGenders || [] as string[],
      sexualities: existingAlter?.selectedSexualities || [] as string[],
      traits: existingAlter?.traitDecorations || [] as any[],
      cleanDescription: '',
    };

    // Construire des maps inversés label → clé enum pour FR et EN
    const allTranslations = [translations.fr, translations.en];

    const buildReverseMap = (obj: Record<string, string>) =>
      Object.entries(obj).reduce((acc, [k, v]) => {
        acc[v.toLowerCase().trim()] = k;
        return acc;
      }, {} as Record<string, string>);

    const roleMapFR = buildReverseMap(translations.fr.roleNames as Record<string,string>);
    const roleMapEN = buildReverseMap(translations.en.roleNames as Record<string,string>);
    const genderMapFR = buildReverseMap(translations.fr.genders as Record<string,string>);
    const genderMapEN = buildReverseMap(translations.en.genders as Record<string,string>);
    const sexMapFR = buildReverseMap(translations.fr.sexualityNames as Record<string,string>);
    const sexMapEN = buildReverseMap(translations.en.sexualityNames as Record<string,string>);
    const traitMapFR = buildReverseMap(translations.fr.personalityTraits as Record<string,string>);
    const traitMapEN = buildReverseMap(translations.en.personalityTraits as Record<string,string>);
    const disorderMapFR = buildReverseMap(translations.fr.disorders as Record<string,string>);
    const disorderMapEN = buildReverseMap(translations.en.disorders as Record<string,string>);

    const lookupRole = (s: string) => roleMapFR[s.toLowerCase().trim()] || roleMapEN[s.toLowerCase().trim()] || null;
    const lookupGender = (s: string) => genderMapFR[s.toLowerCase().trim()] || genderMapEN[s.toLowerCase().trim()] || null;
    const lookupSex = (s: string) => sexMapFR[s.toLowerCase().trim()] || sexMapEN[s.toLowerCase().trim()] || null;
    const lookupTrait = (s: string) => traitMapFR[s.toLowerCase().trim()] || traitMapEN[s.toLowerCase().trim()] || null;
    const lookupDisorder = (s: string) => disorderMapFR[s.toLowerCase().trim()] || disorderMapEN[s.toLowerCase().trim()] || null;

    const roles: string[] = existingAlter?.selectedRoles ? [...existingAlter.selectedRoles] : [];
    const genders: string[] = existingAlter?.selectedGenders ? [...existingAlter.selectedGenders] : [];
    const sexualities: string[] = existingAlter?.selectedSexualities ? [...existingAlter.selectedSexualities] : [];
    const traits: any[] = existingAlter?.traitDecorations ? [...existingAlter.traitDecorations] : [];

    const addRole = (r: string) => { if (!roles.includes(r)) roles.push(r); };
    const addGender = (g: string) => { if (!genders.includes(g)) genders.push(g); };
    const addSex = (s: string) => { if (!sexualities.includes(s)) sexualities.push(s); };
    const addTrait = (t: string) => { if (!traits.some((td: any) => td.trait === t)) traits.push({ trait: t }); };

    const lines = desc.split('\n');
    const unusedLines: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Ligne de rôles séparés par " - " ou " / " (première ligne typiquement)
      const roleLine = trimmed.replace(/\.$/,'');
      const roleParts = roleLine.split(/\s*[-\/]\s*/);
      if (roleParts.length > 1) {
        let allRoles = true;
        const foundRoles: string[] = [];
        for (const part of roleParts) {
          const r = lookupRole(part.trim());
          if (r) foundRoles.push(r);
          else { allRoles = false; break; }
        }
        if (allRoles && foundRoles.length > 0) {
          foundRoles.forEach(addRole);
          return;
        }
      }

      // Genre : Valeur
      const genreMatch = trimmed.match(/^(?:Genre|Gender)\s*[:\s]+(.+)$/i);
      if (genreMatch) {
        const g = lookupGender(genreMatch[1].trim());
        if (g) { addGender(g); return; }
      }

      // Sexualité : Valeur (peut contenir plusieurs séparés par " - " ou " / ")
      const sexMatch = trimmed.match(/^(?:Sexualit[eé]|Sexuality)\s*[:\s]+(.+)$/i);
      if (sexMatch) {
        const parts = sexMatch[1].split(/\s*[-\/]\s*/);
        parts.forEach(p => { const s = lookupSex(p.trim()); if (s) addSex(s); });
        return;
      }

      // Trait de personnalité seul sur une ligne
      const trait = lookupTrait(trimmed);
      if (trait) { addTrait(trait); return; }

      // Trouble seul sur une ligne
      const disorder = lookupDisorder(trimmed);
      if (disorder) { addTrait(disorder); return; }

      // Rôle seul sur une ligne
      const role = lookupRole(trimmed.replace(/\.$/,''));
      if (role) { addRole(role); return; }

      // Ligne non reconnue → garder dans la description propre
      unusedLines.push(line);
    });

    return { roles, genders, sexualities, traits, cleanDescription: unusedLines.join('\n').trim() };
  };
  // ────────────────────────────────────────────────────────────────────────────

  const syncPluralKitToLocal = () => {
    if (pkMembers.length === 0) return;

    setSavedAlters(prev => {
      const updated = [...prev];

      pkMembers.forEach(member => {
        const existingIndex = updated.findIndex(a => a.pkId === member.id || a.alterName.toLowerCase() === member.name.toLowerCase());
        const existing = existingIndex >= 0 ? updated[existingIndex] : undefined;

        // Parser la description PK
        const parsed = parsePluralKitDescription(member.description || null, existing);

        // Couleur PK (hex sans #)
        const pkColor = member.color ? '#' + member.color : ((existing as any)?.pkColor || '');

        const alterData: SavedAlter = {
          id: existing ? existing.id : Date.now().toString() + Math.random().toString(36).substring(2, 9),
          pkId: member.id,
          alterName: member.name,
          selectedRoles: parsed.roles.length > 0 ? parsed.roles as AlterRole[] : (existing?.selectedRoles || []),
          selectedGenders: parsed.genders.length > 0 ? parsed.genders as Gender[] : (existing?.selectedGenders || []),
          selectedSexualities: parsed.sexualities.length > 0 ? parsed.sexualities as Sexuality[] : (existing?.selectedSexualities || []),
          traitDecorations: parsed.traits.length > 0 ? parsed.traits as TraitDecoration[] : (existing?.traitDecorations || []),
          description: parsed.cleanDescription || (existing?.description || ''),
          pronouns: member.pronouns || (existing as any)?.pronouns || '',
          birthday: member.birthday || (existing as any)?.birthday || '',
          internalNotes: existing?.internalNotes || '',
          profileImage: member.avatar_url || (existing?.profileImage || ''),
          pkColor,
          patternLayers: existing?.patternLayers || [],
          decorations: existing?.decorations || [],
          customRoleColors: existing?.customRoleColors || {},
          customGenderColors: existing?.customGenderColors || {},
          customSexualityColors: existing?.customSexualityColors || {},
          theme: existing?.theme || Theme.LIGHT,
          frontStatus: existing?.frontStatus || 'none',
          subsystemId: existing?.subsystemId || undefined,
        };

        if (existingIndex >= 0) {
          updated[existingIndex] = alterData;
        } else {
          updated.push(alterData);
        }
      });

      return updated;
    });

    setPkSuccess(lang === 'fr'
      ? 'Profils synchronisés ! Rôles, genre, sexualité et traits extraits automatiquement.'
      : 'Profiles synced! Roles, gender, sexuality and traits extracted automatically.');
  };

  const exportAlterToPluralKit = async (alter: SavedAlter) => {
    if (!pkToken || !alter.pkId) return;
    setIsExportingPkId(alter.pkId);
    setPkError(null);
    setPkSuccess(null);
    try {
      let pronouns = '';
      if (alter.internalNotes) {
        const matches = alter.internalNotes.match(/(?:Pronouns|Pronoms|Prons):\s*(.*)/i);
        if (matches && matches[1]) pronouns = matches[1].trim();
      }

      const bodyData: Record<string, any> = {
        name: alter.alterName,
        description: alter.description || null,
        avatar_url: alter.profileImage || null
      };
      if (pronouns) {
        bodyData.pronouns = pronouns;
      }

      const response = await fetch(`https://api.pluralkit.me/v2/members/${alter.pkId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': pkToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(lang === 'fr' ? 'Erreur de mise à jour sur PluralKit. Jeton invalide ou expiré.' : 'PluralKit update failed. Token might be invalid/expired.');
      }

      // Re-fetch members to keep sync fresh
      const memResponse = await fetch('https://api.pluralkit.me/v2/systems/@me/members', {
        headers: {
          'Authorization': pkToken,
        }
      });
      if (memResponse.ok) {
        const memData = await memResponse.json();
        setPkMembers(memData);
      }

      setPkSuccess(lang === 'fr' ? `Membre ${alter.alterName} mis à jour sur PluralKit !` : `Member ${alter.alterName} successfully updated on PluralKit!`);
    } catch (err: any) {
      setPkError(err.message || 'Error exporting to PluralKit');
    } finally {
      setIsExportingPkId(null);
    }
  };

  useEffect(() => {
    if (pkToken) {
      fetchPluralKitSystem(pkToken);
    }
  }, []);

  // --- JSON Backup Synchronisation Logical Handlers ---
  const handleExportJSON = () => {
    try {
      const dataToExport = {
        version: 1,
        exportedAt: Date.now(),
        mainSystemName: localStorage.getItem('mainSystemName') || (lang === 'fr' ? 'Système Principal' : 'Primary System'),
        savedAlters,
        subsystems,
        chatMessages,
        switchLogs,
        journalEntries,
        mappingData: loadMapping()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `heaven_space_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setJsonSuccess(lang === 'fr' ? "Fichier de sauvegarde exporté avec succès !" : "Backup file exported successfully!");
      setJsonError(null);
    } catch (err: any) {
      setJsonError(lang === 'fr' ? `Erreur lors de l'exportation : ${err.message}` : `Export error: ${err.message}`);
      setJsonSuccess(null);
    }
  };

  const readAndParseJSONFile = (file: File) => {
    setJsonError(null);
    setJsonSuccess(null);
    setImportPreview(null);

    // Some systems export JSON with standard type or raw file system extensions
    const isJsonFile = file.type === "application/json" || file.name.endsWith('.json');
    if (!isJsonFile) {
      setJsonError(lang === 'fr' 
        ? "Format de fichier invalide. Veuillez importer un fichier .json de sauvegarde." 
        : "Invalid file format. Please import a .json backup file."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error(lang === 'fr' ? "Le fichier n'contient pas un objet JSON valide." : "The file does not contain a valid JSON object.");
        }

        const altersCount = Array.isArray(parsed.savedAlters) ? parsed.savedAlters.length : 0;
        const subsystemsCount = Array.isArray(parsed.subsystems) ? parsed.subsystems.length : 0;
        const chatsCount = Array.isArray(parsed.chatMessages) ? parsed.chatMessages.length : 0;
        const switchesCount = Array.isArray(parsed.switchLogs) ? parsed.switchLogs.length : 0;
        const journalsCount = Array.isArray(parsed.journalEntries) ? parsed.journalEntries.length : 0;

        if (altersCount === 0 && subsystemsCount === 0 && chatsCount === 0 && switchesCount === 0 && journalsCount === 0) {
          throw new Error(lang === 'fr' 
            ? "Le fichier ne contient aucune donnée compatible ou aucune donnée de système." 
            : "The file contains no compatible system data."
          );
        }

        setImportPreview({
          data: parsed,
          fileName: file.name,
          altersCount,
          subsystemsCount,
          chatsCount,
          switchesCount,
          journalsCount,
          systemName: parsed.mainSystemName || (lang === 'fr' ? 'Système Importé' : 'Imported System')
        });
      } catch (err: any) {
        setJsonError(lang === 'fr' ? `Erreur de lecture du JSON : ${err.message}` : `JSON Error parsing: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setJsonError(lang === 'fr' ? "Erreur de lecture du fichier." : "File read error.");
    };
    reader.readAsText(file);
  };

  const handleJSONFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readAndParseJSONFile(file);
    }
  };

  const handleJSONDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setJsonDragOver(true);
  };

  const handleJSONDragLeave = () => {
    setJsonDragOver(false);
  };

  const handleJSONDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setJsonDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readAndParseJSONFile(file);
    }
  };

  const handleApplyImportOverwrite = () => {
    if (!importPreview) return;
    const { data } = importPreview;

    try {
      if (data.mainSystemName) {
        setMainSystemName(data.mainSystemName);
        localStorage.setItem('mainSystemName', data.mainSystemName);
      }
      
      const importedAlters = Array.isArray(data.savedAlters) ? data.savedAlters : [];
      setSavedAlters(importedAlters);
      localStorage.setItem('savedAlters', JSON.stringify(importedAlters));

      const importedSubsystems = Array.isArray(data.subsystems) ? data.subsystems : [];
      setSubsystems(importedSubsystems);
      localStorage.setItem('subsystems', JSON.stringify(importedSubsystems));

      const importedChat = Array.isArray(data.chatMessages) ? data.chatMessages : [];
      setChatMessages(importedChat);
      localStorage.setItem('chatMessages', JSON.stringify(importedChat));

      const importedSwitches = Array.isArray(data.switchLogs) ? data.switchLogs : [];
      setSwitchLogs(importedSwitches);
      localStorage.setItem('switchLogs', JSON.stringify(importedSwitches));

      const importedJournals = Array.isArray(data.journalEntries) ? data.journalEntries : [];
      setJournalEntries(importedJournals);
      localStorage.setItem('journalEntries', JSON.stringify(importedJournals));

      if (data.mappingData && typeof data.mappingData === 'object') {
        saveMapping(data.mappingData);
      }

      setJsonSuccess(lang === 'fr' 
        ? "Toutes vos données ont été remplacées par la sauvegarde !" 
        : "Successfully replaced all local data with the backup!"
      );
      setJsonError(null);
      setImportPreview(null);
    } catch (err: any) {
      setJsonError(lang === 'fr' ? `Échec du remplacement : ${err.message}` : `Overwrite failed: ${err.message}`);
    }
  };

  const handleApplyImportMerge = () => {
    if (!importPreview) return;
    const { data } = importPreview;

    try {
      // 1. System Name: only replace if empty/unset
      if (data.mainSystemName && (!mainSystemName || mainSystemName === 'Système Principal' || mainSystemName === 'Primary System')) {
        setMainSystemName(data.mainSystemName);
        localStorage.setItem('mainSystemName', data.mainSystemName);
      }

      // 2. savedAlters: overwrite duplicates by ID or name, add new
      const currentAlters = [...savedAlters];
      const incomingAlters = Array.isArray(data.savedAlters) ? data.savedAlters : [];
      incomingAlters.forEach((incoming: SavedAlter) => {
        const existingIndex = currentAlters.findIndex(a => a.id === incoming.id || a.alterName.toLowerCase() === incoming.alterName.toLowerCase());
        if (existingIndex > -1) {
          currentAlters[existingIndex] = { ...currentAlters[existingIndex], ...incoming };
        } else {
          currentAlters.push(incoming);
        }
      });
      setSavedAlters(currentAlters);
      localStorage.setItem('savedAlters', JSON.stringify(currentAlters));

      // 3. Subsystems
      const currentSubsystems = [...subsystems];
      const incomingSubsystems = Array.isArray(data.subsystems) ? data.subsystems : [];
      incomingSubsystems.forEach((incoming: Subsystem) => {
        const existingIndex = currentSubsystems.findIndex(s => s.id === incoming.id || s.name.toLowerCase() === incoming.name.toLowerCase());
        if (existingIndex > -1) {
          currentSubsystems[existingIndex] = { ...currentSubsystems[existingIndex], ...incoming };
        } else {
          currentSubsystems.push(incoming);
        }
      });
      setSubsystems(currentSubsystems);
      localStorage.setItem('subsystems', JSON.stringify(currentSubsystems));

      // 4. Chat Messages: merge unique by id
      const currentChat = [...chatMessages];
      const incomingChat = Array.isArray(data.chatMessages) ? data.chatMessages : [];
      incomingChat.forEach((incoming: ChatMessage) => {
        if (!currentChat.some(msg => msg.id === incoming.id)) {
          currentChat.push(incoming);
        }
      });
      currentChat.sort((a, b) => a.timestamp - b.timestamp);
      setChatMessages(currentChat);
      localStorage.setItem('chatMessages', JSON.stringify(currentChat));

      // 5. Switch Logs: merge unique by id or timestamp
      const currentSwitches = [...switchLogs];
      const incomingSwitches = Array.isArray(data.switchLogs) ? data.switchLogs : [];
      incomingSwitches.forEach((incoming: SwitchLog) => {
        if (!currentSwitches.some(sw => sw.id === incoming.id || sw.timestamp === incoming.timestamp)) {
          currentSwitches.push(incoming);
        }
      });
      currentSwitches.sort((a, b) => b.timestamp - a.timestamp);
      setSwitchLogs(currentSwitches);
      localStorage.setItem('switchLogs', JSON.stringify(currentSwitches));

      // 6. Journal Entries: merge unique by id or identical title & date
      const currentJournals = [...journalEntries];
      const incomingJournals = Array.isArray(data.journalEntries) ? data.journalEntries : [];
      incomingJournals.forEach((incoming: JournalEntry) => {
        if (!currentJournals.some(j => j.id === incoming.id || (j.title === incoming.title && j.timestamp === incoming.timestamp))) {
          currentJournals.push(incoming);
        }
      });
      currentJournals.sort((a, b) => b.timestamp - a.timestamp);
      setJournalEntries(currentJournals);
      localStorage.setItem('journalEntries', JSON.stringify(currentJournals));

      if (data.mappingData && typeof data.mappingData === 'object') {
        const current = loadMapping();
        const incoming = data.mappingData;
        // Merge nodes (positions) — priorité à l'import
        const mergedNodes = [...current.nodes];
        (incoming.nodes || []).forEach((n: MappingNode) => {
          const idx = mergedNodes.findIndex((existing: MappingNode) => existing.id === n.id);
          if (idx > -1) mergedNodes[idx] = n;
          else mergedNodes.push(n);
        });
        // Merge relations par id
        const mergedRelations = [...current.relations];
        (incoming.relations || []).forEach((r: MappingRelation) => {
          if (!mergedRelations.some((existing: MappingRelation) => existing.id === r.id)) {
            mergedRelations.push(r);
          }
        });
        saveMapping({ nodes: mergedNodes, relations: mergedRelations });
      }

      setJsonSuccess(lang === 'fr' 
        ? "Les données ont été fusionnées avec vos données existantes avec succès !" 
        : "Backup data successfully merged with your current local data!"
      );
      setJsonError(null);
      setImportPreview(null);
    } catch (err: any) {
      setJsonError(lang === 'fr' ? `Échec de la fusion : ${err.message}` : `Merge failed: ${err.message}`);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const styles = getThemeStyles();
    
    // Reset properties first to ensure clean state
    ['--color-app-bg', '--color-app-text', '--color-app-card', '--color-app-border', '--color-app-accent', '--color-app-muted', '--color-app-accent-text'].forEach(prop => {
      root.style.removeProperty(prop);
    });

    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme]);

  const saveToHistory = useCallback(() => {
    try {
      const currentState = {
        selectedRoles,
        selectedGenders,
        selectedSexualities,
        traitDecorations,
        patternLayers,
        decorations,
        alterName,
        customRoleColors,
        customGenderColors,
        customSexualityColors,
        theme,
        profileImage,
        description,
        internalNotes,
        frontStatus,
      };

      // Only save if different from current history head
      if (historyIndex >= 0) {
        const lastState = history[historyIndex];
        if (JSON.stringify(lastState) === JSON.stringify(currentState)) return;
      }

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(currentState)));
      
      // Limit history size
      if (newHistory.length > 50) newHistory.shift();
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }, [selectedRoles, selectedGenders, selectedSexualities, traitDecorations, patternLayers, decorations, alterName, customRoleColors, customGenderColors, customSexualityColors, theme, history, historyIndex, profileImage, description, internalNotes, frontStatus]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      applyState(prevState);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      applyState(nextState);
    }
  };

  const applyState = (state: any) => {
    setSelectedRoles(state.selectedRoles || [AlterRole.HOST]);
    
    // Support migrating old history states gracefully
    if (state.selectedGenders) {
      setSelectedGenders(state.selectedGenders);
    } else if (state.gender) {
      setSelectedGenders(Array.isArray(state.gender) ? state.gender : [state.gender]);
    } else {
      setSelectedGenders([Gender.NEUTRAL]);
    }

    if (state.selectedSexualities) {
      setSelectedSexualities(state.selectedSexualities);
    } else if (state.sexuality) {
      setSelectedSexualities(Array.isArray(state.sexuality) ? state.sexuality : [state.sexuality]);
    } else {
      setSelectedSexualities([Sexuality.OTHER]);
    }

    setTraitDecorations(state.traitDecorations || []);
    setPatternLayers(state.patternLayers || []);
    setDecorations(state.decorations || []);
    setAlterName(state.alterName || '');
    setCustomRoleColors(state.customRoleColors || {});
    setCustomGenderColors(state.customGenderColors || {});
    setCustomSexualityColors(state.customSexualityColors || {});
    setProfileImage(state.profileImage || '');
    setDescription(state.description || '');
    setInternalNotes(state.internalNotes || '');
    setFrontStatus(state.frontStatus || 'none');
  };

  // Initial history save
  React.useEffect(() => {
    if (historyIndex === -1) {
      saveToHistory();
    }
  }, []);

  // Auto-save to history on changes (debounced or simple)
  // For simplicity, we'll call saveToHistory in the toggle/update functions
  const [isDownloading, setIsDownloading] = useState(false);
  const [infoNote, setInfoNote] = useState<{ title: string; text: string } | null>(null);
  const flagRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'fr' ? 'L\'image est trop grande (max 5Mo)' : 'Image is too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileImage(reader.result);
          // Auto save state
          setTimeout(saveToHistory, 0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(saveToHistory, 0);
  };

  const handleDownload = useCallback(async () => {
    if (flagRef.current === null) return;
    setIsDownloading(true);
    await new Promise(r => setTimeout(r, 150));

    try {
      const node = flagRef.current;
      const exportWidth = 600;

      // Sauvegarder styles originaux du nœud
      const origStyle = { width: node.style.width, maxWidth: node.style.maxWidth, overflow: node.style.overflow, height: node.style.height };

      // Appliquer temporairement sur le nœud réel (styles déjà calculés par le navigateur)
      node.style.width = exportWidth + 'px';
      node.style.maxWidth = exportWidth + 'px';
      node.style.overflow = 'visible';
      node.style.height = 'auto';

      // Sauvegarder/libérer overflow des descendants
      const savedOverflow: string[] = [];
      const savedMaxHeight: string[] = [];
      const allEls = Array.from(node.querySelectorAll<HTMLElement>('*'));
      allEls.forEach(el => {
        savedOverflow.push(el.style.overflow);
        savedMaxHeight.push(el.style.maxHeight);
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
      });

      // crossOrigin sur les images
      node.querySelectorAll('img').forEach((img: HTMLImageElement) => { img.crossOrigin = 'anonymous'; });

      await new Promise(r => setTimeout(r, 200));

      // Lire la couleur de fond réelle depuis les CSS vars du document
      const docStyle = getComputedStyle(document.documentElement);
      const themeBg = docStyle.getPropertyValue('--color-app-bg').trim() || '#ffffff';

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        backgroundColor: themeBg || '#ffffff',
        width: exportWidth,
        height: node.scrollHeight,
        skipAutoScale: true,
      });

      // Restaurer les styles
      node.style.width = origStyle.width;
      node.style.maxWidth = origStyle.maxWidth;
      node.style.overflow = origStyle.overflow;
      node.style.height = origStyle.height;
      allEls.forEach((el, i) => {
        el.style.overflow = savedOverflow[i] || '';
        el.style.maxHeight = savedMaxHeight[i] || '';
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `alter-card-${alterName || 'creator'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsDownloading(false);
    }
  }, [flagRef, alterName]);

  const handleDownloadDefinition = () => {
    let content = `Alter Profile Definition: ${alterName || 'Unnamed Alter'}\n`;
    content += `==========================================\n\n`;
    
    content += `Roles:\n`;
    selectedRoles.forEach(role => {
      content += `- ${t.roleNames[role as keyof typeof t.roleNames]}: ${t.rolesData[role as keyof typeof t.rolesData]}\n`;
    });
    
    content += `\nGender: ${selectedGenders.map(g => `${t.genders[g as keyof typeof t.genders]} (${t.genderData[g as keyof typeof t.genderData] || ''})`).join(', ')}\n`;
    content += `Sexuality: ${selectedSexualities.map(s => `${t.sexualityNames[s as keyof typeof t.sexualityNames]} (${t.sexualityData[s as keyof typeof t.sexualityData] || ''})`).join(', ')}\n`;
    
    if (traitDecorations.length > 0) {
      content += `\nTraits & Conditions:\n`;
      traitDecorations.forEach(td => {
        const isDisorder = Object.values(Disorder).includes(td.trait as Disorder);
        const name = isDisorder 
          ? t.disorders[td.trait as keyof typeof t.disorders] 
          : t.personalityTraits[td.trait as keyof typeof t.personalityTraits];
        const data = isDisorder 
          ? t.disorderData[td.trait as keyof typeof t.disorderData] 
          : t.personalityTraitData[td.trait as keyof typeof t.personalityTraitData];
        content += `- ${name}: ${data}\n`;
      });
    }
    
    if (decorations.length > 0) {
      content += `\nSymbols:\n`;
      decorations.forEach(d => {
        content += `- ${t.shapes[d.type as keyof typeof t.shapes]}: ${t.shapeData[d.type as keyof typeof t.shapeData]}\n`;
      });
    }

    content += `\n==========================================\n`;
    content += `Generated by Haven Space © 2026`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `definition-${alterName || 'creator'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateAlterName = (name: string) => {
    setAlterName(name);
    setTimeout(saveToHistory, 0);
  };

  const updateDescription = (desc: string) => {
    if (desc.length <= 5000) {
      setDescription(desc);
      setTimeout(saveToHistory, 0);
    }
  };

  const updateInternalNotes = (notes: string) => {
    if (notes.length <= 5000) {
      setInternalNotes(notes);
      setTimeout(saveToHistory, 0);
    }
  };

  // --- DID System Management Handlers ---
  const [groundingOpenSections, setGroundingOpenSections] = useState<string[]>(['move']);
  const toggleGroundingSection = (id: string) => setGroundingOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ─── Bouton retour mobile ────────────────────────────────────────────────────
  useEffect(() => {
    // Empêche le bouton retour de quitter l'app en mode PWA
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  // ─── Messagerie inter-alters ────────────────────────────────────────────────────
  // Tous les alters de tous les systèmes (pour le picker)
  const allAlters = savedAlters;

  const getAlterDisplayName = (alterId: string) => {
    const a = allAlters.find(a => a.id === alterId);
    return a?.alterName || alterId;
  };

  const getAlterAvatar = (alterId: string) => {
    return allAlters.find(a => a.id === alterId)?.profileImage;
  };

  const getConvPartner = (conv: DirectConversation, currentAlterId: string) => {
    return conv.participantIds[0] === currentAlterId ? conv.participantIds[1] : conv.participantIds[0];
  };

  const handleCreateConversation = () => {
    if (!newConvAlter1 || !newConvAlter2 || newConvAlter1 === newConvAlter2) return;
    // Vérifier si une conv existe déjà entre ces deux alters
    const existing = conversations.find(c =>
      (c.participantIds[0] === newConvAlter1 && c.participantIds[1] === newConvAlter2) ||
      (c.participantIds[0] === newConvAlter2 && c.participantIds[1] === newConvAlter1)
    );
    if (existing) { setActiveConvId(existing.id); setShowNewConvPanel(false); return; }
    const a1 = allAlters.find(a => a.id === newConvAlter1);
    const a2 = allAlters.find(a => a.id === newConvAlter2);
    const newConv: DirectConversation = {
      id: 'conv-' + Math.random().toString(36).slice(2, 9),
      participantIds: [newConvAlter1, newConvAlter2],
      participantSystemIds: [a1?.systemId || 'main', a2?.systemId || 'main'],
      createdAt: Date.now(),
    };
    setConversations(prev => [...prev, newConv]);
    setActiveConvId(newConv.id);
    setMsgSenderId(newConvAlter1);
    setShowNewConvPanel(false);
    setNewConvAlter1('');
    setNewConvAlter2('');
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !activeConvId || !msgSenderId) return;
    const conv = conversations.find(c => c.id === activeConvId);
    if (!conv || !conv.participantIds.includes(msgSenderId)) return;
    const msg: DirectMessage = {
      id: 'dm-' + Math.random().toString(36).slice(2, 9),
      conversationId: activeConvId,
      senderAlterId: msgSenderId,
      text: msgText.trim(),
      timestamp: Date.now(),
    };
    setDirectMessages(prev => [...prev, msg]);
    setMsgText('');
  };

  const activeConv = conversations.find(c => c.id === activeConvId) || null;
  const activeConvMessages = directMessages.filter(m => m.conversationId === activeConvId);
  // ────────────────────────────────────────────────────────────────────────────

  // ─── Systèmes parallèles ────────────────────────────────────────────────────
  // Alters filtrés pour le système actif
  const activeSystemAlters = savedAlters.filter(a => (a.systemId || 'main') === activeSystemId);
  const activeSystemSubsystems = subsystems.filter(s => (s.systemId || 'main') === activeSystemId);
  const activeSystemName = activeSystemId === 'main'
    ? (mainSystemName || (lang === 'fr' ? 'Système Principal' : 'Main System'))
    : (parallelSystems.find(s => s.id === activeSystemId)?.name || '');

  const handleCreateParallelSystem = () => {
    if (!parallelSystemFormName.trim()) return;
    if (editingParallelSystemId) {
      setParallelSystems(prev => prev.map(s =>
        s.id === editingParallelSystemId ? { ...s, name: parallelSystemFormName.trim() } : s
      ));
      setEditingParallelSystemId(null);
    } else {
      const newSys: ParallelSystem = {
        id: 'sys-' + Math.random().toString(36).slice(2, 9),
        name: parallelSystemFormName.trim(),
        createdAt: Date.now(),
      };
      setParallelSystems(prev => [...prev, newSys]);
    }
    setParallelSystemFormName('');
    setShowParallelSystemForm(false);
  };

  const handleDeleteParallelSystem = (sysId: string) => {
    // Supprimer les alters et sous-systèmes liés
    setSavedAlters(prev => prev.filter(a => (a.systemId || 'main') !== sysId));
    setSubsystems(prev => prev.filter(s => (s.systemId || 'main') !== sysId));
    setParallelSystems(prev => prev.filter(s => s.id !== sysId));
    // Revenir au système principal si on était dessus
    if (activeSystemId === sysId) setActiveSystemId('main');
  };
  // ────────────────────────────────────────────────────────────────────────────

  const handleSaveAlter = (forceTargetId: string | null = null, forceNew: boolean = false) => {
    const trimmedName = alterName.trim() || (lang === 'fr' ? 'Anonyme' : 'Anonymous');
    
    // Check if we already have an existing alter with the SAME name (case-insensitive, trimmed)
    // but a different ID.
    // If we are passing forceTargetId or forceNew, we bypass this check since the user made a choice.
    if (forceTargetId === null && !forceNew) {
      const conflict = savedAlters.find(
        a => a.id !== editingAlterId && a.alterName.toLowerCase().trim() === trimmedName.toLowerCase().trim()
      );
      if (conflict) {
        setSaveConflictAlter(conflict);
        return;
      }
    }

    // Determine target ID
    let targetId = editingAlterId;
    if (forceNew) {
      targetId = null; // force creation of flat new alter
    } else if (forceTargetId) {
      targetId = forceTargetId; // force saving into the existing same-name alter
    }

    const freshId = targetId || Math.random().toString(36).substring(2, 11);
    const existingAlter = savedAlters.find(a => a.id === targetId) || (editingAlterId ? savedAlters.find(a => a.id === editingAlterId) : null);
    const existingSubsystemId = existingAlter?.subsystemId;
    const existingPkId = existingAlter?.pkId;

    const freshAlter: SavedAlter = {
      id: freshId,
      alterName: trimmedName,
      selectedRoles,
      selectedGenders,
      selectedSexualities,
      traitDecorations,
      patternLayers,
      decorations,
      customRoleColors,
      customGenderColors,
      customSexualityColors,
      theme,
      profileImage,
      description,
      internalNotes,
      subsystemId: existingSubsystemId,
      frontStatus: frontStatus || 'none',
      pkId: existingPkId,
      alterAge: alterAge || undefined,
      alterColor: alterColor || undefined,
      triggersPositive: triggersPositive || undefined,
      triggersNegative: triggersNegative || undefined,
      alterLanguages: alterLanguages || undefined,
      alterOriginWorld: alterOriginWorld || undefined,
      customFields: customFields.length > 0 ? customFields : undefined,
      archived: existingAlter?.archived || false,
      systemId: existingAlter?.systemId || activeSystemId,
    };

    if (savedAlters.some(a => a.id === freshId)) {
      setSavedAlters(prev => prev.map(a => a.id === freshId ? freshAlter : a));
      setEditingAlterId(freshId);
    } else {
      setSavedAlters(prev => [...prev, freshAlter]);
      setEditingAlterId(freshId);
    }
    
    setSaveConflictAlter(null);
  };

  const executeLoadAlter = (alter: SavedAlter) => {
    setSelectedRoles(alter.selectedRoles || [AlterRole.HOST]);
    setSelectedGenders(alter.selectedGenders || [Gender.NEUTRAL]);
    setSelectedSexualities(alter.selectedSexualities || [Sexuality.OTHER]);
    setTraitDecorations(alter.traitDecorations || []);
    setPatternLayers(alter.patternLayers || []);
    setDecorations(alter.decorations || []);
    setAlterName(alter.alterName || '');
    setCustomRoleColors(alter.customRoleColors || {});
    setCustomGenderColors(alter.customGenderColors || {});
    setCustomSexualityColors(alter.customSexualityColors || {});
    // Le thème global n'est pas lié à la fiche
    setProfileImage(alter.profileImage || '');
    setDescription(alter.description || '');
    setInternalNotes(alter.internalNotes || '');
    setAlterAge(alter.alterAge || '');
    setAlterColor(alter.alterColor || '');
    setTriggersPositive(alter.triggersPositive || '');
    setTriggersNegative(alter.triggersNegative || '');
    setAlterLanguages(alter.alterLanguages || '');
    setAlterOriginWorld(alter.alterOriginWorld || '');
    setCustomFields(alter.customFields || []);
    setFrontStatus(alter.frontStatus || 'none');
    setEditingAlterId(alter.id);
    setCurrentTab('creator');
    setLoadConfirmAlter(null);
  };

  const handleLoadAlter = (alter: SavedAlter) => {
    // If the creator already has current work, confirm it via state dialog
    if (editingAlterId || alterName || description || internalNotes || traitDecorations.length > 0) {
      setLoadConfirmAlter(alter);
      return;
    }
    executeLoadAlter(alter);
  };

  const handleResetCreator = () => {
    setSelectedRoles([AlterRole.HOST]);
    setSelectedGenders([Gender.NEUTRAL]);
    setSelectedSexualities([Sexuality.OTHER]);
    setTraitDecorations([]);
    setPatternLayers([]);
    setDecorations([]);
    setAlterName('');
    setCustomRoleColors({});
    setCustomGenderColors({});
    setCustomSexualityColors({});
    setProfileImage('');
    setDescription('');
    setInternalNotes('');
    setAlterAge('');
    setAlterColor('');
    setTriggersPositive('');
    setTriggersNegative('');
    setAlterLanguages('');
    setAlterOriginWorld('');
    setCustomFields([]);
    setFrontStatus('none');
    setEditingAlterId(null);
    setCurrentTab('creator'); // Route user directly to creator
  };

  const handleDeleteAlter = (alterId: string) => {
    setDeleteConfirmAlterId(alterId);
  };

  const executeDeleteAlter = (alterId: string) => {
    setSavedAlters(prev => prev.filter(a => a.id !== alterId));
    if (editingAlterId === alterId) {
      setEditingAlterId(null);
    }
    setDeleteConfirmAlterId(null);
  };

  const handleAssignSubsystem = (alterId: string, subsystemId?: string) => {
    setSavedAlters(prev => prev.map(a => a.id === alterId ? { ...a, subsystemId: subsystemId || undefined } : a));
  };

  const handleCreateSubsystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const newSub: Subsystem = {
      id: Math.random().toString(36).substring(2, 11),
      name: newSubName.trim(),
      parentId: newSubParentId || undefined,
      systemId: activeSystemId,
    };
    setSubsystems(prev => [...prev, newSub]);
    setNewSubName('');
    setNewSubParentId('');
  };

  const handleDeleteSubsystem = (subId: string) => {
    setDeleteConfirmSubsystemId(subId);
  };

  const executeDeleteSubsystem = (subId: string) => {
    setSubsystems(prev => prev.filter(s => s.id !== subId).map(s => s.parentId === subId ? { ...s, parentId: undefined } : s));
    setSavedAlters(prev => prev.map(a => a.subsystemId === subId ? { ...a, subsystemId: undefined } : a));
    setDeleteConfirmSubsystemId(null);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    // Vérifier les droits d'accès au salon actif
    const currentSalon = chatSalons.find(s => s.id === activeSalonId);
    if (currentSalon && chatSpeakerId !== 'external') {
      const isBlacklist = (currentSalon.accessMode || 'blacklist') === 'blacklist';
      const ids = currentSalon.blockedOrAllowedIds || [];
      const blocked = isBlacklist ? ids.includes(chatSpeakerId) : !ids.includes(chatSpeakerId);
      if (blocked) return;
    }
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      senderAlterId: chatSpeakerId,
      text: chatText.trim(),
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatText('');
  };

  const handleSendChatPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;
    const validOptions = pollOptions.filter(o => o.trim() !== '');
    if (validOptions.length < 2) return;

    let durationMs = 0;
    let durationMinutesCalculated = 0;
    if (pollDurationUnit === 'minutes') {
      durationMs = pollDuration * 60 * 1000;
      durationMinutesCalculated = pollDuration;
    } else if (pollDurationUnit === 'hours') {
      durationMs = pollDuration * 60 * 60 * 1000;
      durationMinutesCalculated = pollDuration * 60;
    } else {
      durationMs = pollDuration * 24 * 60 * 60 * 1000;
      durationMinutesCalculated = pollDuration * 24 * 60;
    }

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      senderAlterId: chatSpeakerId,
      text: `${lang === 'fr' ? 'Sondage :' : 'Poll :'} ${pollQuestion.trim()}`,
      timestamp: Date.now(),
      poll: {
        question: pollQuestion.trim(),
        options: validOptions.map(txt => ({
          id: Math.random().toString(36).substring(2, 11),
          text: txt.trim(),
          votes: []
        })),
        expiresAt: Date.now() + durationMs,
        durationMinutes: durationMinutesCalculated,
      }
    };

    setChatMessages(prev => [...prev, newMsg]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollCreator(false);
  };

  const handleVoteOnPoll = (messageId: string, optionId: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || !msg.poll) return msg;

      // Check if poll is already closed
      if (Date.now() > msg.poll.expiresAt) return msg;

      const voterId = chatSpeakerId; // Cast vote as the currently selected speaking alter

      const updatedOptions = msg.poll.options.map(opt => {
        const hasVotedThis = opt.votes.includes(voterId);
        if (opt.id === optionId) {
          if (hasVotedThis) {
            // Unvote
            return { ...opt, votes: opt.votes.filter(v => v !== voterId) };
          } else {
            // Vote for this
            return { ...opt, votes: [...opt.votes, voterId] };
          }
        } else {
          // Remove from other options
          return { ...opt, votes: opt.votes.filter(v => v !== voterId) };
        }
      });

      return {
        ...msg,
        poll: {
          ...msg.poll,
          options: updatedOptions
        }
      };
    }));
  };

  const renderPollWidget = (msg: ChatMessage) => {
    if (!msg.poll) return null;
    const poll = msg.poll;
    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes.length, 0);
    const isExpired = Date.now() > poll.expiresAt;
    
    const getRemainingTimeText = (expiresAt: number) => {
      const diffMs = expiresAt - Date.now();
      if (diffMs <= 0) {
        return lang === 'fr' ? 'Sondage clos' : 'Poll closed';
      }
      const diffMins = Math.ceil(diffMs / (60 * 1000));
      if (diffMins < 60) {
        return lang === 'fr' ? `Ferme dans ${diffMins} min` : `Closes in ${diffMins} min`;
      }
      const diffHours = Math.ceil(diffMins / 60);
      if (diffHours < 24) {
        return lang === 'fr' ? `Ferme dans ${diffHours} h` : `Closes in ${diffHours} h`;
      }
      const diffDays = Math.ceil(diffHours / 24);
      return lang === 'fr' ? `Ferme dans ${diffDays} j` : `Closes in ${diffDays} d`;
    };

    return (
      <div className="mt-1.5 p-4.5 bg-app-card border border-app-border rounded-xl space-y-4 shadow-sm max-w-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[9px] text-app-muted font-black uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5 text-app-accent" />
            <span>{lang === 'fr' ? 'Sondage interne' : 'Internal Poll'}</span>
          </div>
          <h4 className="text-sm font-black text-app-text leading-tight w-full break-words select-text">
            {poll.question}
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-app-muted font-bold tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{getRemainingTimeText(poll.expiresAt)}</span>
            <span>•</span>
            <span>{totalVotes} {totalVotes > 1 ? (lang === 'fr' ? 'votes' : 'votes') : (lang === 'fr' ? 'vote' : 'vote')}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {poll.options.map(opt => {
            const count = opt.votes.length;
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const hasVoted = opt.votes.includes(chatSpeakerId);
            
            // Get names of alters who voted
            const voterNames = opt.votes.map(vId => {
              if (vId === 'external') return lang === 'fr' ? 'Hôte' : 'Host';
              return savedAlters.find(a => a.id === vId)?.alterName || 'Alter';
            }).join(', ');

            return (
              <div key={opt.id} className="space-y-1">
                <button
                  type="button"
                  disabled={isExpired}
                  onClick={() => handleVoteOnPoll(msg.id, opt.id)}
                  className={`relative w-full overflow-hidden text-left p-3.5 rounded-xl border transition-all text-xs flex justify-between items-center ${
                    isExpired 
                      ? 'border-app-border/40 bg-app-bg/20 cursor-default' 
                      : 'border-app-border cursor-pointer hover:border-app-accent/40 hover:bg-app-accent/5'
                  } ${hasVoted ? 'border-app-accent ring-2 ring-app-accent/20 bg-app-accent/5' : ''}`}
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-app-accent/15 transition-all duration-500 ease-out z-0"
                    style={{ width: `${percent}%` }}
                  />
                  <span className="relative z-10 font-bold flex items-center gap-2 text-app-text">
                    {hasVoted && <div className="w-1.5 h-1.5 rounded-full bg-app-text" />}
                    {opt.text}
                  </span>
                  <span className="relative z-10 text-[10px] font-mono font-black text-app-muted">
                    {percent}% ({count})
                  </span>
                </button>
                
                {opt.votes.length > 0 && (
                  <div className="px-1 text-[9px] text-app-muted font-bold uppercase tracking-wider truncate">
                    {lang === 'fr' ? 'Voté par :' : 'Voted by :'} <span className="text-app-text/90 normal-case font-semibold">{voterNames}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleClearChat = () => {
    setDeleteConfirmClearChat(true);
  };

  const executeClearChat = () => {
    setChatMessages([]);
    setDeleteConfirmClearChat(false);
  };

  const handleLogSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (switchSelectedAlterIds.length === 0) return;
    const finalTimestamp = switchRetroDate ? new Date(switchRetroDate).getTime() : Date.now();
    const finalEndTimestamp = switchEndDate ? new Date(switchEndDate).getTime() : undefined;
    const newLog: SwitchLog = {
      id: Math.random().toString(36).substring(2, 11),
      alterIds: switchSelectedAlterIds,
      timestamp: finalTimestamp,
      endTimestamp: finalEndTimestamp,
      notes: switchNotes.trim() || undefined,
      status: switchSelectedStatus,
      spoons: switchSpoons,
      moods: switchMoods.length > 0 ? switchMoods : undefined,
    };
    
    // Update switch logs list
    setSwitchLogs(prev => [newLog, ...prev].sort((a,b) => b.timestamp - a.timestamp));

    // Automatically update the fronting status of the selected alters in the savedAlters state
    setSavedAlters(prev => prev.map(a => {
      if (switchSelectedAlterIds.includes(a.id)) {
        return {
          ...a,
          frontStatus: switchSelectedStatus
        };
      }
      return a;
    }));

    // Fire notifications
    const alterNames = switchSelectedAlterIds.map(id => savedAlters.find(a => a.id === id)?.alterName || id);
    const firstAvatar = savedAlters.find(a => a.id === switchSelectedAlterIds[0])?.profileImage;
    fireSwitchNotifications(alterNames, switchSelectedStatus, firstAvatar);

    // Clear form inputs
    setSwitchSelectedAlterIds([]);
    setSwitchRetroDate('');
    setSwitchEndDate('');
    setSwitchNotes('');
    setSwitchSpoons(12);
    setSwitchMoods([]);
  };

  const handleDeleteSwitchLog = (logId: string) => {
    setDeleteConfirmSwitchLogId(logId);
  };

  const executeDeleteSwitchLog = (logId: string) => {
    setSwitchLogs(prev => prev.filter(l => l.id !== logId));
    setDeleteConfirmSwitchLogId(null);
  };

  const handleCompressAndStoreFiles = (files: FileList | null, onComplete: (urls: string[]) => void) => {
    if (!files) return;
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
              if (width > max_size) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(onComplete);
  };

  const handleSaveJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContentInput.trim() && !journalTitleInput.trim() && journalImages.length === 0) return;
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substring(2, 11),
      title: journalTitleInput.trim() || (lang === 'fr' ? 'Note sans titre' : 'Untitled Note'),
      content: journalContentInput.trim(),
      timestamp: Date.now(),
      images: journalImages,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalTitleInput('');
    setJournalContentInput('');
    setJournalImages([]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setDeleteConfirmJournalId(id);
  };

  const executeDeleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(j => j.id !== id));
    setDeleteConfirmJournalId(null);
  };

  const renderAlterCard = (alter: SavedAlter) => {
    return (
      <div key={alter.id} className="w-full bg-app-card/65 md:rounded-2xl border-b md:border border-app-border/30 md:shadow-sm hover:shadow-md transition-shadow relative">
        {/* Version mobile — liste compacte style Simply Plural */}
        <div className="flex md:hidden items-center gap-3 w-full px-3 py-3">
          {alter.profileImage ? (
            <img src={alter.profileImage} alt={alter.alterName} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-app-border/30" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-app-accent/15 border-2 border-app-accent/25 flex items-center justify-center text-app-text font-black shrink-0 text-sm">
              {alter.alterName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <span className="font-bold text-base text-app-text block overflow-hidden text-ellipsis whitespace-nowrap">{alter.alterName}</span>
            {alter.selectedRoles?.length > 0 && (
              <span className="text-xs text-app-muted block overflow-hidden text-ellipsis whitespace-nowrap">
                {t.roleNames[alter.selectedRoles[0] as keyof typeof t.roleNames] || alter.selectedRoles[0]}
                {alter.selectedRoles.length > 1 && ` +${alter.selectedRoles.length - 1}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {alter.frontStatus && alter.frontStatus !== 'none' && (
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                alter.frontStatus === 'primary' ? 'bg-emerald-500' :
                alter.frontStatus === 'co_front' ? 'bg-sky-500' :
                alter.frontStatus === 'co_conscious' ? 'bg-violet-500' :
                alter.frontStatus === 'passive' ? 'bg-amber-500' : 'bg-zinc-500'
              }`} />
            )}
            <button onClick={() => handleLoadAlter(alter)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide border border-app-border rounded-xl text-app-muted hover:text-app-text hover:border-app-accent transition-all whitespace-nowrap">
              {lang === 'fr' ? 'Charger' : 'Load'}
            </button>
            <button onClick={() => setSavedAlters(prev => prev.map(a => a.id === alter.id ? { ...a, archived: !a.archived } : a))}
              className="p-1.5 text-app-muted hover:text-amber-500 transition-colors shrink-0"
              title={alter.archived ? (lang === 'fr' ? 'Desarchiver' : 'Unarchive') : (lang === 'fr' ? 'Archiver' : 'Archive')}>
              <Archive className="w-4 h-4" />
            </button>
            <button onClick={() => handleDeleteAlter(alter.id)} className="p-1.5 text-app-muted hover:text-red-400 transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Version desktop — carte complète */}
        <div className="hidden md:flex p-4 flex-col justify-between gap-4">
        <div className="flex gap-3">
          {alter.profileImage ? (
            <img 
              src={alter.profileImage} 
              alt={alter.alterName} 
              className="w-12 h-12 rounded-xl object-cover border border-app-border/30 shrink-0" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-text font-black shrink-0">
              {alter.alterName.slice(0, 2).toUpperCase()}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-sm text-app-text truncate text-left">{alter.alterName}</h4>
            <div className="flex flex-wrap gap-1 mt-1 justify-start">
              {alter.frontStatus && alter.frontStatus !== 'none' && (
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border inline-block ${
                  alter.frontStatus === 'primary' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                  alter.frontStatus === 'co_front' ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' :
                  alter.frontStatus === 'co_conscious' ? 'bg-violet-500/10 text-violet-500 border-violet-500/30' :
                  alter.frontStatus === 'passive' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                  'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                }`}>
                  {t.frontStatuses[alter.frontStatus as keyof typeof t.frontStatuses] || alter.frontStatus}
                </span>
              )}
              {alter.selectedRoles.slice(0, 2).map(r => (
                <span 
                  key={r} 
                  style={{ 
                    backgroundColor: `${alter.customRoleColors?.[r] || ROLE_CONFIGS[r]?.color || '#9CA3AF'}15`, 
                    color: alter.customRoleColors?.[r] || ROLE_CONFIGS[r]?.color || '#9CA3AF',
                    borderColor: `${alter.customRoleColors?.[r] || ROLE_CONFIGS[r]?.color || '#9CA3AF'}40`
                  }}
                  className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border inline-block"
                >
                  {t.roleNames[r as keyof typeof t.roleNames]}
                </span>
              ))}
              {alter.selectedRoles.length > 2 && (
                <span className="px-1.5 py-0.5 rounded bg-app-bg text-app-muted text-[8px] font-extrabold">
                  +{alter.selectedRoles.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subsystem & Load trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-app-border/15">
          <select
            value={alter.subsystemId || ''}
            onChange={(e) => handleAssignSubsystem(alter.id, e.target.value)}
            className="text-[9px] bg-app-bg border border-app-border/40 rounded-lg px-2 py-1 max-w-[130px] font-bold uppercase tracking-wider text-app-muted cursor-pointer focus:outline-none"
          >
            <option value="">{lang === 'fr' ? 'Aucun ss-système' : 'No ss-system'}</option>
            {activeSystemSubsystems.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleLoadAlter(alter)}
              className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-app-bg hover:bg-app-accent hover:text-white border border-app-border/40 hover:border-transparent rounded-lg transition-all"
            >
              {lang === 'fr' ? 'Charger' : 'Load'}
            </button>
            <button
              onClick={() => setSavedAlters(prev => prev.map(a => a.id === alter.id ? { ...a, archived: !a.archived } : a))}
              className="p-1 text-app-muted hover:text-amber-500 rounded-lg transition-colors"
              title={alter.archived ? (lang === 'fr' ? 'Desarchiver' : 'Unarchive') : (lang === 'fr' ? 'Archiver' : 'Archive')}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteAlter(alter.id)}
              className="p-1 text-app-muted hover:text-red-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </div> {/* fin version desktop */}
      </div>
    );
  };

  const renderSubsystemNode = (subId: string, depth = 0) => {
    const sub = subsystems.find(s => s.id === subId);
    if (!sub) return null;

    const childSubs = subsystems.filter(s => s.parentId === subId);
    const subAlters = savedAlters
      .filter(a => a.subsystemId === subId)
      .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang));

    return (
      <div key={subId} className="space-y-3" style={{ marginLeft: `${depth * 16}px` }}>
        <div className="flex items-center justify-between p-3.5 bg-app-card border border-app-border/45 rounded-xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-app-text" />
            <span className="font-bold text-sm text-app-text">{sub.name}</span>
            <span className="text-[10px] bg-app-bg text-app-muted px-2 py-0.5 rounded-full font-bold">
              {subAlters.length} alters
            </span>
          </div>
          <button
            onClick={() => handleDeleteSubsystem(sub.id)}
            className="p-1.5 hover:bg-app-bg text-app-muted hover:text-red-500 rounded-lg transition-colors"
            title="Supprimer le sous-système"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alters in this subsystem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l border-app-border/25">
          {subAlters.map(a => renderAlterCard(a))}
        </div>

        {/* Recursive Children Subsystems */}
        {childSubs.map(child => renderSubsystemNode(child.id, depth + 1))}
      </div>
    );
  };

  const toggleGender = (g: Gender) => {
    setSelectedGenders(prev => {
      if (prev.includes(g)) {
        return prev.length > 1 ? prev.filter(x => x !== g) : prev;
      } else {
        return [...prev, g];
      }
    });
    setTimeout(saveToHistory, 0);
  };

  const updateCustomRoleColors = (colors: Record<string, string>) => {
    setCustomRoleColors(colors);
    setTimeout(saveToHistory, 0);
  };

  const updateCustomGenderColors = (colors: Record<string, string>) => {
    setCustomGenderColors(colors);
    setTimeout(saveToHistory, 0);
  };

  const toggleSexuality = (s: Sexuality) => {
    setSelectedSexualities(prev => {
      if (prev.includes(s)) {
        return prev.length > 1 ? prev.filter(x => x !== s) : prev;
      } else {
        return [...prev, s];
      }
    });
    setTimeout(saveToHistory, 0);
  };

  const updateCustomSexualityColors = (colors: Record<string, string>) => {
    setCustomSexualityColors(colors);
    setTimeout(saveToHistory, 0);
  };

  const addPatternLayer = (target: 'global' | 'sexuality' | 'gender' | AlterRole = 'global') => {
    const newLayer: PatternLayer = {
      id: Math.random().toString(36).substr(2, 9),
      type: PatternType.STRIPES_H,
      color: '#000000',
      size: 20,
      opacity: 0.3,
      target
    };
    setPatternLayers([...patternLayers, newLayer]);
    setTimeout(saveToHistory, 0);
  };

  const removePatternLayer = (id: string) => {
    setPatternLayers(patternLayers.filter(p => p.id !== id));
    setTimeout(saveToHistory, 0);
  };

  const updatePatternLayer = (id: string, updates: Partial<PatternLayer>) => {
    setPatternLayers(patternLayers.map(p => p.id === id ? { ...p, ...updates } : p));
    setTimeout(saveToHistory, 0);
  };

  const getPatternStyle = (type: PatternType, color: string, size: number, opacity: number = 1) => {
    if (type === PatternType.NONE) return {};

    let backgroundImage = 'none';
    let backgroundSize = 'auto';
    let backgroundPosition = '0 0';

    const encodedColor = encodeURIComponent(color);

    switch (type) {
      case PatternType.STRIPES_H:
        backgroundImage = `linear-gradient(0deg, transparent 50%, ${color} 50%)`;
        backgroundSize = `100% ${size}px`;
        break;
      case PatternType.STRIPES_V:
        backgroundImage = `linear-gradient(90deg, transparent 50%, ${color} 50%)`;
        backgroundSize = `${size}px 100%`;
        break;
      case PatternType.STRIPES_D:
        backgroundImage = `linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 50%, ${color} 50%, ${color} 75%, transparent 75%, transparent)`;
        backgroundSize = `${size * 1.5}px ${size * 1.5}px`;
        break;
      case PatternType.DOTS:
        backgroundImage = `radial-gradient(${color} 2px, transparent 2px)`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.POLKA_DOTS:
        backgroundImage = `radial-gradient(${color} 35%, transparent 35%), radial-gradient(${color} 35%, transparent 35%)`;
        backgroundSize = `${size * 2}px ${size * 2}px`;
        backgroundPosition = `0 0, ${size}px ${size}px`;
        break;
      case PatternType.GRID:
        backgroundImage = `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.GRADIENT:
        backgroundImage = `linear-gradient(180deg, transparent, ${color})`;
        break;
      case PatternType.TEXTURE:
        backgroundImage = 'url("https://www.transparenttextures.com/patterns/stardust.png")';
        break;
      case PatternType.CHECKERBOARD:
        backgroundImage = `linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%, ${color}), linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%, ${color})`;
        backgroundSize = `${size * 2}px ${size * 2}px`;
        backgroundPosition = `0 0, ${size}px ${size}px`;
        break;
      case PatternType.WAVES:
        backgroundImage = `radial-gradient(circle at 100% 50%, transparent 20%, ${color} 21%, ${color} 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, ${color} 21%, ${color} 34%, transparent 35%, transparent)`;
        backgroundSize = `${size * 2}px ${size}px`;
        backgroundPosition = `0 0, 0 ${size / 2}px`;
        break;
      case PatternType.ZIGZAG:
        backgroundImage = `linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%), linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(315deg, ${color} 25%, transparent 25%)`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.RINGS:
        backgroundImage = `radial-gradient(circle, transparent 30%, ${color} 31%, ${color} 50%, transparent 51%)`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.TRIANGLES:
        backgroundImage = `linear-gradient(45deg, ${color} 50%, transparent 50%), linear-gradient(-45deg, ${color} 50%, transparent 50%)`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.HEXAGONS:
        backgroundImage = `radial-gradient(circle at 50% 50%, ${color} 20%, transparent 20%), radial-gradient(circle at 0% 0%, ${color} 20%, transparent 20%), radial-gradient(circle at 100% 0%, ${color} 20%, transparent 20%), radial-gradient(circle at 100% 100%, ${color} 20%, transparent 20%), radial-gradient(circle at 0% 100%, ${color} 20%, transparent 20%)`;
        backgroundSize = `${size * 1.73}px ${size}px`;
        break;
      case PatternType.HEARTS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.STARS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.CLOUDS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size * 1.5}px ${size * 1.5}px`;
        break;
      case PatternType.SPARKLES:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8l-2.5-1.4L14.5 16.5l1.4-2.5L14.5 11.5l2.5 1.4L19.5 11.5l-1.4 2.5L19.5 16.5zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size * 1.2}px ${size * 1.2}px`;
        break;
      case PatternType.LEAVES:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.95-2.37 2.4-5.28 4.3-7.44 2.13 2.42 4.63 3.54 7.12 3.54 5.47 0 8.75-6.34 8.75-6.34-1.02.23-2.1.34-3.19.34-3.5 0-5.89-4.1-5.89-4.1z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.PAW_PRINTS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Ccircle cx='4.5' cy='9.5' r='2.5'/%3E%3Ccircle cx='9' cy='5.5' r='2.5'/%3E%3Ccircle cx='15' cy='5.5' r='2.5'/%3E%3Ccircle cx='19.5' cy='9.5' r='2.5'/%3E%3Cpath d='M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.32-1.45-.65-3.14-.31-4.59.34-.88.43-1.61 1.3-2.48 2.32-1.23 1.44-2.05 3.15-2.1 5.12-.02 1.16.6 2.22 1.52 2.88.71.51 1.54.77 2.39.77 1.11 0 2.21-.45 3.01-1.27.43-.44.83-.44 1.26 0 .81.82 1.91 1.27 3.01 1.27.85 0 1.68-.26 2.39-.77.92-.66 1.54-1.72 1.52-2.88-.05-1.97-.87-3.68-2.1-5.12z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size * 1.2}px ${size * 1.2}px`;
        break;
      case PatternType.MUSIC_NOTES:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.CROSSES:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.DIAMONDS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M12 2L4.5 12 12 22l7.5-10L12 2z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.HONEYCOMB:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100' fill='none' stroke='${encodedColor}' stroke-width='1'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size * 1.78}px`;
        break;
      case PatternType.SPIRALS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodedColor}' stroke-width='2'%3E%3Cpath d='M12 12c0-3 3-3 3-3s3 3 3 6-3 6-6 6-9-6-9-9 6-12 12-12'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
      case PatternType.FLOWERS:
        backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5-5c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM7 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z'/%3E%3C/svg%3E")`;
        backgroundSize = `${size}px ${size}px`;
        break;
    }

    return {
      backgroundImage,
      backgroundSize,
      backgroundPosition,
      opacity
    };
  };

  const toggleRole = (role: AlterRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
      setInfoNote({ 
        title: t.roleNames[role as keyof typeof t.roleNames], 
        text: t.rolesData[role as keyof typeof t.rolesData] 
      });
    }
    setTimeout(saveToHistory, 0);
  };

  const toggleTrait = (trait: Trait) => {
    const existing = traitDecorations.find(td => td.trait === trait);
    if (existing) {
      setTraitDecorations(traitDecorations.filter(td => td.trait !== trait));
      if (activeTraitId === trait) setActiveTraitId(null);
    } else {
      const newTraitDec: TraitDecoration = {
        trait,
        color: '#1A1A1A',
        size: 32,
        x: 71 + ((traitDecorations.length * 6) % 15) - 7,
        y: 45 + ((traitDecorations.length * 6) % 30) - 15,
        opacity: 0.8,
      };
      setTraitDecorations([...traitDecorations, newTraitDec]);
      setActiveTraitId(trait);
      
      const isDisorder = Object.values(Disorder).includes(trait as Disorder);
      const nameMap = isDisorder ? t.disorders : t.personalityTraits;
      const dataMap = isDisorder ? t.disorderData : t.personalityTraitData;
      
      setInfoNote({ 
        title: nameMap[trait as keyof typeof nameMap], 
        text: dataMap[trait as keyof typeof dataMap] 
      });
    }
    setTimeout(saveToHistory, 0);
  };

  const updateTraitDecoration = (trait: Trait, updates: Partial<TraitDecoration>) => {
    setTraitDecorations(traitDecorations.map(td => td.trait === trait ? { ...td, ...updates } : td));
    setTimeout(saveToHistory, 0);
  };

  const addDecoration = (type: ShapeType) => {
    const newDec: Decoration = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      color: '#1A1A1A',
      size: 40,
      x: 71,
      y: 50,
      rotation: 0,
      opacity: 1,
    };
    setDecorations([...decorations, newDec]);
    setActiveDecorationId(newDec.id);
    setInfoNote({ 
      title: t.shapes[type as keyof typeof t.shapes], 
      text: t.shapeData[type as keyof typeof t.shapeData] 
    });
    setTimeout(saveToHistory, 0);
  };

  const updateDecoration = (id: string, updates: Partial<Decoration>) => {
    setDecorations(decorations.map(d => d.id === id ? { ...d, ...updates } : d));
    setTimeout(saveToHistory, 0);
  };

  const removeDecoration = (id: string) => {
    setDecorations(decorations.filter(d => d.id !== id));
    if (activeDecorationId === id) setActiveDecorationId(null);
    setTimeout(saveToHistory, 0);
  };

  const getRoleIcon = (role: AlterRole) => {
    switch (role) {
      case AlterRole.PROTECTOR:
      case AlterRole.PROTECTOR_PHYSICAL:
      case AlterRole.PROTECTOR_EMOTIONAL:
        return <Shield className="w-4 h-4" />;
      case AlterRole.CAREGIVER:
      case AlterRole.SOOTHER:
      case AlterRole.EP:
        return <Heart className="w-4 h-4" />;
      case AlterRole.GATEKEEPER:
        return <Key className="w-4 h-4" />;
      case AlterRole.LITTLE:
      case AlterRole.MIDDLE:
        return <Baby className="w-4 h-4" />;
      case AlterRole.NON_HUMAN:
        return <Ghost className="w-4 h-4" />;
      case AlterRole.OBSERVER:
        return <Eye className="w-4 h-4" />;
      case AlterRole.MANAGER:
        return <Briefcase className="w-4 h-4" />;
      case AlterRole.MEMORY_HOLDER:
      case AlterRole.TRAUMA_HOLDER:
        return <Lock className="w-4 h-4" />;
      case AlterRole.SYMPTOM_HOLDER:
        return <Activity className="w-4 h-4" />;
      case AlterRole.INTROJECT:
      case AlterRole.FICTIVE:
      case AlterRole.FACTIVE:
        return <Sparkles className="w-4 h-4" />;
      case AlterRole.AVENGER:
      case AlterRole.PROSECUTOR:
        return <Swords className="w-4 h-4" />;
      case AlterRole.SUBSYSTEM:
        return <Layers className="w-4 h-4" />;
      case AlterRole.SHELL:
        return <Circle className="w-4 h-4" />;
      case AlterRole.FRAGMENT:
        return <Diamond className="w-4 h-4" />;
      case AlterRole.DYSFUNCTIONAL_PROTECTOR:
        return <ShieldAlert className="w-4 h-4" />;
      case AlterRole.SABOTEUR:
        return <Bomb className="w-4 h-4" />;
      case AlterRole.MEDIATOR:
        return <Scale className="w-4 h-4" />;
      case AlterRole.ARCHIVIST:
        return <Archive className="w-4 h-4" />;
      case AlterRole.AGE_SLIDER:
        return <History className="w-4 h-4" />;
      case AlterRole.SOCIAL:
        return <Users className="w-4 h-4" />;
      case AlterRole.OPPOSITE_GENDER:
        return <VenetianMask className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getShapeIcon = (type: ShapeType) => {
    switch (type) {
      case ShapeType.BUTTERFLY: return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          {/* Left Wing (ʚ) */}
          <path d="M11 11c-1-1-2.5-1.5-4-1.5C5 9.5 3.5 11 3.5 13c0 1.5 1 2.5 2.5 3c-1.5 0.5-2.5 1.5-2.5 3c0 2 1.5 3.5 3.5 3.5c1.5 0 3-0.5 4-1.5" />
          {/* Right Wing (ɞ) */}
          <path d="M13 11c1-1 2.5-1.5 4-1.5c2 0 3.5 1.5 3.5 3.5c0 1.5-1 2.5-2.5 3c1.5 0.5 2.5 1.5 2.5 3c0 2-1.5 3.5-3.5 3.5c-1.5 0-3-0.5-4-1.5" />
          {/* Body (ï) */}
          <path d="M12 10v10" />
          <circle cx="10.5" cy="7" r="0.5" />
          <circle cx="13.5" cy="7" r="0.5" />
        </svg>
      );
      case ShapeType.PUZZLE: return <Puzzle className="w-5 h-5" />;
      case ShapeType.INFINITY: return <Infinity className="w-5 h-5" />;
      case ShapeType.KEY: return <Key className="w-5 h-5" />;
      case ShapeType.LOCK: return <Lock className="w-5 h-5" />;
      case ShapeType.LINK: return <Link className="w-5 h-5" />;
      case ShapeType.LINK_2: return <Link2 className="w-5 h-5" />;
      case ShapeType.EYE: return <Eye className="w-5 h-5" />;
      case ShapeType.SHIELD: return <Shield className="w-5 h-5" />;
      case ShapeType.GHOST: return <Ghost className="w-5 h-5" />;
      case ShapeType.TREE: return <TreePine className="w-5 h-5" />;
      case ShapeType.MASK: return <Theater className="w-5 h-5" />;
      case ShapeType.ANCHOR: return <Anchor className="w-5 h-5" />;
      case ShapeType.COMPASS: return <Compass className="w-5 h-5" />;
      case ShapeType.FEATHER: return <Feather className="w-5 h-5" />;
      case ShapeType.MOON: return <Moon className="w-5 h-5" />;
      case ShapeType.SUN: return <Sun className="w-5 h-5" />;
      case ShapeType.CLOUD: return <Cloud className="w-5 h-5" />;
      case ShapeType.LIGHTNING: return <Zap className="w-5 h-5" />;
      case ShapeType.MOUNTAIN: return <Mountain className="w-5 h-5" />;
      case ShapeType.WAVES: return <Waves className="w-5 h-5" />;
      case ShapeType.BOOK: return <Book className="w-5 h-5" />;
      case ShapeType.HOURGLASS: return <Hourglass className="w-5 h-5" />;
      case ShapeType.RIBBON: return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M15 11c1.5-1.5 2.5-3.5 2.5-5.5C17.5 2.5 15 0 12 0S6.5 2.5 6.5 5.5c0 2 1 4 2.5 5.5L4 22l4-2l4 2l4-2l4 2l-5-11z" />
        </svg>
      );
      case ShapeType.AMPERSAND: return <Ampersand className="w-5 h-5" />;
      case ShapeType.SEMICOLON: return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="8" r="2" />
          <path d="M12 14c0 2-1 3-2 4" />
        </svg>
      );
      case ShapeType.BIPOLAR: return (
        <div className="flex items-center -space-x-1">
          <Smile className="w-3.5 h-3.5" />
          <Frown className="w-3.5 h-3.5" />
        </div>
      );
      case ShapeType.MUTE: return <VolumeX className="w-5 h-5" />;
      case ShapeType.EYE_OPEN: return <Eye className="w-5 h-5" />;
      case ShapeType.UTENSILS: return <Utensils className="w-5 h-5" />;
      case ShapeType.BRAIN: return <Brain className="w-5 h-5" />;
      case ShapeType.HEART: return <Heart className="w-5 h-5" />;
      case ShapeType.BROKEN_HEART: return <HeartOff className="w-5 h-5" />;
      case ShapeType.UMBRELLA: return <Umbrella className="w-5 h-5" />;
      case ShapeType.LOTUS: return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 21s-2.5-4-2.5-8 2.5-8 2.5-8 2.5 4 2.5 8-2.5 8-2.5 8Z" />
          <path d="M12 21c-2 0-5-1.5-5-5.5s2.5-6 4.5-7" />
          <path d="M12 21c2 0 5-1.5 5-5.5s-2.5-6-4.5-7" />
          <path d="M12 21c-4 0-9-1-9-5s4-6 6-6" />
          <path d="M12 21c4 0 9-1 9-5s-4-6-6-6" />
        </svg>
      );
      case ShapeType.DOOR: return <DoorOpen className="w-5 h-5" />;
      case ShapeType.MIRROR: return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="9" r="6" />
          <path d="M4 8v1c0 4.4 3.6 8 8 8s8-3.6 8-8V8" />
          <path d="M12 17v4" />
          <path d="M8 21h8" />
        </svg>
      );
      case ShapeType.SPARKLES: return <Sparkles className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getTraitIcon = (trait: Trait) => {
    switch (trait) {
      // Personality Traits
      case PersonalityTrait.CREATIVE: return <Palette className="w-4 h-4" />;
      case PersonalityTrait.CALM: return <Wind className="w-4 h-4" />;
      case PersonalityTrait.SOCIAL: return <Users className="w-4 h-4" />;
      case PersonalityTrait.SHY: return <EyeOff className="w-4 h-4" />;
      case PersonalityTrait.BRAVE: return <Shield className="w-4 h-4" />;
      case PersonalityTrait.EMPATHETIC: return <Heart className="w-4 h-4" />;
      case PersonalityTrait.LOGICAL: return <Binary className="w-4 h-4" />;
      case PersonalityTrait.CURIOUS: return <Search className="w-4 h-4" />;
      case PersonalityTrait.ARTISTIC: return <Brush className="w-4 h-4" />;
      case PersonalityTrait.ATHLETIC: return <Dumbbell className="w-4 h-4" />;
      case PersonalityTrait.MUSICAL: return <Music className="w-4 h-4" />;
      case PersonalityTrait.PROTECTIVE: return <ShieldCheck className="w-4 h-4" />;
      case PersonalityTrait.NURTURING: return <Baby className="w-4 h-4" />;
      case PersonalityTrait.STOIC: return <Mountain className="w-4 h-4" />;
      case PersonalityTrait.ENERGETIC: return <Zap className="w-4 h-4" />;
      case PersonalityTrait.QUIET: return <VolumeX className="w-4 h-4" />;
      case PersonalityTrait.LEADER: return <Crown className="w-4 h-4" />;
      case PersonalityTrait.FOLLOWER: return <UserPlus className="w-4 h-4" />;
      case PersonalityTrait.DREAMER: return <Cloud className="w-4 h-4" />;
      case PersonalityTrait.REALIST: return <Target className="w-4 h-4" />;
      case PersonalityTrait.OPTIMIST: return <Sun className="w-4 h-4" />;
      case PersonalityTrait.PESSIMIST: return <CloudRain className="w-4 h-4" />;
      case PersonalityTrait.PERFECTIONIST: return <CheckCircle2 className="w-4 h-4" />;
      case PersonalityTrait.ORGANIZED: return <LayoutGrid className="w-4 h-4" />;
      case PersonalityTrait.MESSY: return <Wind className="w-4 h-4" />;
      case PersonalityTrait.HUMOROUS: return <Laugh className="w-4 h-4" />;
      case PersonalityTrait.SERIOUS: return <Briefcase className="w-4 h-4" />;
      case PersonalityTrait.SARCASTIC: return <MessageSquareQuote className="w-4 h-4" />;
      case PersonalityTrait.KIND: return <Smile className="w-4 h-4" />;
      case PersonalityTrait.BLUNT: return <ArrowRight className="w-4 h-4" />;
      case PersonalityTrait.PATIENT: return <Hourglass className="w-4 h-4" />;
      case PersonalityTrait.IMPATIENT: return <Timer className="w-4 h-4" />;
      case PersonalityTrait.LOYAL: return <Link className="w-4 h-4" />;
      case PersonalityTrait.INDEPENDENT: return <User className="w-4 h-4" />;
      case PersonalityTrait.DEPENDENT: return <UserPlus className="w-4 h-4" />;
      case PersonalityTrait.ADVENTUROUS: return <Compass className="w-4 h-4" />;
      case PersonalityTrait.HOMEBODY: return <Home className="w-4 h-4" />;
      case PersonalityTrait.INTROVERTED: return <UserMinus className="w-4 h-4" />;
      case PersonalityTrait.EXTROVERTED: return <Users className="w-4 h-4" />;
      case PersonalityTrait.AMBIVERT: return <ArrowLeftRight className="w-4 h-4" />;

      // Disorders
      case Disorder.ANXIETY: return <AlertCircle className="w-4 h-4" />;
      case Disorder.DEPRESSION: return <CloudRain className="w-4 h-4" />;
      case Disorder.PTSD: return <ShieldAlert className="w-4 h-4" />;
      case Disorder.CPTSD: return <Layers className="w-4 h-4" />;
      case Disorder.BPD: return <Split className="w-4 h-4" />;
      case Disorder.ASPD: return <ShieldAlert className="w-4 h-4" />;
      case Disorder.ADHD: return <Orbit className="w-4 h-4" />;
      case Disorder.AUTISM: return <Brain className="w-4 h-4" />;
      case Disorder.BIPOLAR: return <SunMoon className="w-4 h-4" />;
      case Disorder.OCD: return <Repeat className="w-4 h-4" />;
      case Disorder.ED: return <Utensils className="w-4 h-4" />;
      case Disorder.PSYCHOSIS: return <Sparkles className="w-4 h-4" />;
      case Disorder.SCHIZOPHRENIA: return <AlertTriangle className="w-4 h-4" />;
      case Disorder.HPD: return <Theater className="w-4 h-4" />;
      case Disorder.NPD: return <Crown className="w-4 h-4" />;
      case Disorder.NEURODIVERGENT: return <Cpu className="w-4 h-4" />;
      case Disorder.DYSPHORIA: return <ZapOff className="w-4 h-4" />;
      case Disorder.HYPERVIGILANCE: return <Eye className="w-4 h-4" />;
      case Disorder.AMNESIA: return <Hourglass className="w-4 h-4" />;
      case Disorder.SYNESTHESIA: return <Sparkles className="w-4 h-4" />;
      case Disorder.HSP: return <Ear className="w-4 h-4" />;
      case Disorder.INSOMNIA: return <MoonStar className="w-4 h-4" />;
      case Disorder.CHRONIC_PAIN: return <Thermometer className="w-4 h-4" />;
      case Disorder.KLEPTOMANIA: return <Hand className="w-4 h-4" />;
      case Disorder.PYROMANIA: return <Flame className="w-4 h-4" />;
      case Disorder.ONIOMANIA: return <ShoppingBag className="w-4 h-4" />;
      case Disorder.HYPER_HYPO_SEXUALITY: return <HeartPulse className="w-4 h-4" />;
      case Disorder.TRICHOTILLOMANIA: return <Scissors className="w-4 h-4" />;
      case Disorder.ANGER_DISORDER: return <Zap className="w-4 h-4" />;
      case Disorder.DID: return <Users className="w-4 h-4" />;
      case Disorder.OSDD: return <Layers className="w-4 h-4" />;
      case Disorder.P_DID: return <UserCheck className="w-4 h-4" />;
      case Disorder.DPDR: return <Ghost className="w-4 h-4" />;
      case Disorder.TOURETTES: return <Activity className="w-4 h-4" />;
      case Disorder.TIC_DISORDER: return <Activity className="w-4 h-4" />;
      case Disorder.DYSLEXIA: return <Type className="w-4 h-4" />;
      case Disorder.DYSPRAXIA: return <Move className="w-4 h-4" />;
      case Disorder.DYSCALCULIA: return <Calculator className="w-4 h-4" />;
      case Disorder.SLEEP_DISORDER: return <Moon className="w-4 h-4" />;
      case Disorder.PHOBIA: return <Skull className="w-4 h-4" />;
      case Disorder.PANIC_DISORDER: return <AlertTriangle className="w-4 h-4" />;
      case Disorder.AGORAPHOBIA: return <Map className="w-4 h-4" />;
      case Disorder.SOCIAL_ANXIETY: return <UserMinus className="w-4 h-4" />;
      case Disorder.SELECTIVE_MUTISM: return <MicOff className="w-4 h-4" />;
      case Disorder.SPD: return <Fingerprint className="w-4 h-4" />;
      case Disorder.MISOPHONIA: return <EarOff className="w-4 h-4" />;
      case Disorder.NARCOLEPSY: return <Moon className="w-4 h-4" />;
      case Disorder.SLEEP_PARALYSIS: return <Lock className="w-4 h-4" />;
      case Disorder.CFS: return <BatteryLow className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case Theme.DARK:
        return {
          '--color-app-bg': '#273F4F',
          '--color-app-card': '#1D313E',
          '--color-app-text': '#efe9e3',
          '--color-app-muted': 'rgba(239, 233, 227, 0.6)',
          '--color-app-border': 'rgba(239, 233, 227, 0.15)',
          '--color-app-accent': '#EADED4',
          '--color-app-accent-text': '#202940',
        } as React.CSSProperties;
      case Theme.PASTEL:
        return {
          '--color-app-bg': '#BADFDB',
          '--color-app-card': '#e8f7f6',
          '--color-app-text': '#EA7B7B',
          '--color-app-muted': 'rgba(234, 123, 123, 0.6)',
          '--color-app-border': 'rgba(234, 123, 123, 0.1)',
          '--color-app-accent': '#8D77AB',
          '--color-app-accent-text': '#ffffff',
        } as React.CSSProperties;
      case Theme.SPRING:
        return {
          '--color-app-bg': '#FDAAAA',
          '--color-app-card': '#fde8e8',
          '--color-app-text': '#064232',
          '--color-app-muted': 'rgba(6, 66, 50, 0.6)',
          '--color-app-border': 'rgba(6, 66, 50, 0.1)',
          '--color-app-accent': '#D70654',
          '--color-app-accent-text': '#ffffff',
        } as React.CSSProperties;
      case Theme.SUMMER:
        return {
          '--color-app-bg': '#FFF085',
          '--color-app-card': '#fffbe0',
          '--color-app-text': '#CF4B00',
          '--color-app-muted': 'rgba(207, 75, 0, 0.6)',
          '--color-app-border': 'rgba(207, 75, 0, 0.1)',
          '--color-app-accent': '#7B542F',
          '--color-app-accent-text': '#ffffff',
        } as React.CSSProperties;
      case Theme.AUTUMN:
        return {
          '--color-app-bg': '#E2B59A',
          '--color-app-card': '#f5e6dc',
          '--color-app-text': '#D67D3E',
          '--color-app-muted': 'rgba(214, 125, 62, 0.6)',
          '--color-app-border': 'rgba(214, 125, 62, 0.1)',
          '--color-app-accent': '#521C0D',
          '--color-app-accent-text': '#ffffff',
        } as React.CSSProperties;
      case Theme.WINTER:
        return {
          '--color-app-bg': '#79D7BE',
          '--color-app-card': '#d6f5ee',
          '--color-app-text': '#2E5077',
          '--color-app-muted': 'rgba(46, 80, 119, 0.6)',
          '--color-app-border': 'rgba(46, 80, 119, 0.1)',
          '--color-app-accent': '#305669',
          '--color-app-accent-text': '#ffffff',
        } as React.CSSProperties;
      case Theme.ARCANE:
        return {
          '--color-app-bg': '#0d1117',
          '--color-app-card': '#161b27',
          '--color-app-text': '#e8dcc8',
          '--color-app-muted': 'rgba(232, 220, 200, 0.45)',
          '--color-app-border': 'rgba(180, 150, 80, 0.15)',
          '--color-app-accent': '#b8952a',
          '--color-app-accent-text': '#0d1117',
        } as React.CSSProperties;
      default: // LIGHT
        return {
          '--color-app-bg': '#f2ede9',
          '--color-app-card': '#ffffff',
          '--color-app-text': '#273f4f',
          '--color-app-muted': 'rgba(39,63,79,0.5)',
          '--color-app-border': 'rgba(39,63,79,0.12)',
          '--color-app-accent': '#273f4f',
          '--color-app-accent-text': '#f2ede9',
        } as React.CSSProperties;
    }
  };

  return (
    <>
    <style>{`
      .alter-scroll-container {
        direction: rtl;
        scrollbar-width: thin;
        scrollbar-color: var(--color-app-accent) transparent;
      }
      .alter-scroll-container > * {
        direction: ltr;
      }
      .alter-scroll-container::-webkit-scrollbar {
        width: 4px;
      }
      .alter-scroll-container::-webkit-scrollbar-track {
        background: transparent;
      }
      .alter-scroll-container::-webkit-scrollbar-thumb {
        background-color: var(--color-app-accent);
        border-radius: 99px;
        opacity: 0.5;
      }
    `}</style>
    <div className={`min-h-screen bg-app-bg text-app-text ${font} selection:bg-app-accent selection:text-app-bg transition-colors duration-300`}>

      {/* ── Toast notifications stack ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-5 py-3 bg-app-card border border-app-border/60 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto min-w-[220px] max-w-xs"
            >
              {toast.avatar
                ? <img src={toast.avatar} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                : <div className="w-8 h-8 rounded-xl bg-app-accent/15 border border-app-accent/20 flex items-center justify-center text-xs font-black text-app-accent shrink-0">{toast.alterName.slice(0,2).toUpperCase()}</div>
              }
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-app-text truncate">{toast.alterName}</span>
                <span className="text-[10px] text-app-muted font-bold truncate">{toast.status}</span>
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-app-accent shrink-0 animate-pulse" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Header */}
      <header className="border-b border-app-border py-6 px-8 bg-app-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center text-[#273F4F] dark:text-zinc-100 bg-app-accent/15 rounded-2xl border border-app-accent/20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-9 h-9 text-[#273F4F] dark:text-zinc-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Elegant Crescent Moon background representing Space */}
                <path d="M 50 15 C 31 15, 15 31, 15 50 C 15 69, 31 85, 50 85 C 57 85, 63 83, 69 80 C 53 78, 40 64, 40 48 C 40 32, 53 18, 69 16 C 63 15, 57 15, 50 15 Z" fill="currentColor" className="text-app-accent/50" fillOpacity="0.12" stroke="none" />
                
                {/* Clean left stem of H */}
                <path d="M 30 25 L 30 75" strokeWidth="3.2" />
                
                {/* Clean right stem of H */}
                <path d="M 54 25 L 54 75" strokeWidth="3.2" />
                
                {/* Connection line for crossbar of H */}
                <path d="M 30 50 L 54 50" strokeWidth="2.5" />
                
                {/* Compass star of clarity centered in H */}
                <path d="M 42 42 Q 42 50 50 50 Q 42 50 42 58 Q 42 50 34 50 Q 42 50 42 42 Z" fill="currentColor" className="text-app-accent" stroke="none" />

                {/* Elegant calligraphic S ribbon scaling perfectly */}
                <path d="M 72 30 C 65 22, 52 26, 52 38 C 52 52, 74 48, 74 62 C 74 74, 61 78, 52 72" strokeWidth="3.2" />
                
                {/* Sparkle decorative points */}
                <path d="M 80 18 Q 80 22 84 22 Q 80 22 80 26 Q 80 22 76 22 Q 80 22 80 18 Z" fill="currentColor" className="text-app-accent" stroke="none" />
                <path d="M 22 76 Q 22 80 26 80 Q 22 80 22 84 Q 22 80 18 80 Q 22 80 22 76 Z" fill="currentColor" className="text-app-accent" stroke="none" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[#273F4F]">{t.title}</h1>
              <p className="text-[10px] text-[#273F4F]/80 uppercase tracking-widest font-black font-mono">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sélecteur système actif */}
            {parallelSystems.length > 0 && (
              <div className="relative">
                <select
                  value={activeSystemId}
                  onChange={e => setActiveSystemId(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-app-card border border-app-border rounded-xl text-xs font-black uppercase tracking-widest text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/20 cursor-pointer appearance-none"
                  title={lang === 'fr' ? 'Système actif' : 'Active system'}
                >
                  <option value="main">{mainSystemName || (lang === 'fr' ? 'Système Principal' : 'Main System')}</option>
                  {parallelSystems.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-app-muted">
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* Unified Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                className="p-3 bg-app-card border border-app-border hover:border-app-accent hover:text-[#273F4F] rounded-full transition-all text-[#273F4F] shadow-sm flex items-center justify-center cursor-pointer"
                title={lang === 'fr' ? 'Paramètres' : 'Settings'}
              >
                <Settings2 className={`w-5 h-5 text-[#273F4F] transition-transform duration-500 ${settingsMenuOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {settingsMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setSettingsMenuOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-app-card border border-app-border rounded-3xl shadow-2xl p-5 space-y-4 z-50 overflow-y-auto max-h-[80vh]"
                    >
                      <div className="border-b border-app-border/20 pb-2 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-app-accent animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-app-muted">
                          {lang === 'fr' ? 'Paramètres de l\'app' : 'App Settings'}
                        </span>
                      </div>

                      {/* Language Selection Section */}
                      <div className="space-y-1.5">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {lang === 'fr' ? 'Langue' : 'Language'}
                        </span>
                        <div className="relative">
                          <select 
                            value={lang}
                            onChange={(e) => setLang(e.target.value as 'fr' | 'en')}
                            className="w-full bg-app-bg text-app-text border border-app-border/45 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/25 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="fr" className="bg-app-card text-app-text">Français</option>
                            <option value="en" className="bg-app-card text-app-text">English</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-app-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Typography Selection Section (With beautiful custom scrollable accordion) */}
                      <div className="space-y-1.5">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {t.typography}
                        </span>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setSettingsFontOpen(!settingsFontOpen);
                              setSettingsThemeOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-app-bg text-app-text border border-app-border/45 rounded-xl text-xs font-semibold focus:outline-none hover:border-app-accent/85 transition-colors cursor-pointer"
                          >
                            <span className={font}>{fonts.find(f => f.value === font)?.name || font}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-app-muted transition-transform duration-300 ${settingsFontOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {settingsFontOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border border-app-border/20 rounded-xl bg-app-bg/50"
                              >
                                <div className="max-h-28 overflow-y-auto p-1 space-y-0.5 scrollbar-thin scrollbar-thumb-app-border-4a/50">
                                  {fonts.map((f) => (
                                    <button
                                      key={f.value}
                                      onClick={() => {
                                        setFont(f.value);
                                        localStorage.setItem('hs-font', f.value);
                                        setSettingsFontOpen(false);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${font === f.value ? 'bg-app-accent text-white font-extrabold' : 'hover:bg-app-card/75 text-app-text/85'}`}
                                    >
                                      <span className={f.value}>{f.name}</span>
                                      {font === f.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Themes Selection Section (With beautiful custom scrollable accordion) */}
                      <div className="space-y-1.5">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {t.theme}
                        </span>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setSettingsThemeOpen(!settingsThemeOpen);
                              setSettingsFontOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-app-bg text-app-text border border-app-border/45 rounded-xl text-xs font-semibold focus:outline-none hover:border-app-accent/85 transition-colors cursor-pointer"
                          >
                            <span>{t.themes[theme] || theme}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-app-muted transition-transform duration-300 ${settingsThemeOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {settingsThemeOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border border-app-border/20 rounded-xl bg-app-bg/50"
                              >
                                <div className="max-h-28 overflow-y-auto p-1 space-y-0.5 scrollbar-thin scrollbar-thumb-app-border-4a/50">
                                  {(Object.keys(Theme) as Array<keyof typeof Theme>).map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => {
                                        setTheme(Theme[key]);
                                        localStorage.setItem('hs-theme', Theme[key]);
                                        setSettingsThemeOpen(false);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${theme === Theme[key] ? 'bg-app-accent text-white font-extrabold' : 'hover:bg-app-card/75 text-app-text/85'}`}
                                    >
                                      <span>{t.themes[Theme[key]]}</span>
                                      {theme === Theme[key] && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Notifications section */}
                      <div className="pt-3 border-t border-app-border/20 flex flex-col gap-2">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {lang === 'fr' ? 'Notifications' : 'Notifications'}
                        </span>
                        {/* Toast toggle */}
                        <button
                          onClick={toggleToastNotif}
                          className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent/30 transition-colors rounded-xl"
                        >
                          <span className="text-xs font-bold text-app-text">
                            {lang === 'fr' ? "Notifications dans l'app" : 'In-app notifications'}
                          </span>
                          <div className={`w-8 h-4 rounded-full transition-colors relative ${notifToast ? 'bg-app-accent' : 'bg-app-border'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${notifToast ? 'left-[18px]' : 'left-0.5'}`} />
                          </div>
                        </button>
                        {/* Browser notif toggle */}
                        <button
                          onClick={toggleBrowserNotif}
                          className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent/30 transition-colors rounded-xl"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-app-text">
                              {lang === 'fr' ? 'Notifications navigateur' : 'Browser notifications'}
                            </span>
                            {!('Notification' in window) && (
                              <span className="text-[10px] text-app-muted">{lang === 'fr' ? 'Non supporté' : 'Not supported'}</span>
                            )}
                            {('Notification' in window) && Notification.permission === 'denied' && (
                              <span className="text-[10px] text-red-400">{lang === 'fr' ? 'Bloqué — à autoriser dans le navigateur' : 'Blocked — allow in browser settings'}</span>
                            )}
                          </div>
                          <div className={`w-8 h-4 rounded-full transition-colors relative ${notifBrowser ? 'bg-app-accent' : 'bg-app-border'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${notifBrowser ? 'left-[18px]' : 'left-0.5'}`} />
                          </div>
                        </button>
                      </div>

                      {/* TDI Resources section embedded directly inside settings at the very bottom */}
                      <div className="pt-3 border-t border-app-border/20 flex flex-col gap-2">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {t.resources}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <a 
                            href="https://www.partielles.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent hover:text-app-accent transition-colors text-xs font-bold text-app-text rounded-xl"
                          >
                            <span>Partielles</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </a>
                          <a 
                            href="https://epsytera.fr/troubles-dissociatifs/le-trouble-dissociatif-de-lidentite-tdi/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent hover:text-app-accent transition-colors text-xs font-bold text-app-text rounded-xl"
                          >
                            <span>Epsytera</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {activeLegalPage ? (
        <LegalPages initialPage={activeLegalPage} onBack={() => setActiveLegalPage(null)} lang={lang} />
      ) : (
        <>
          {/* Secondary Navigation Dropdown Menu & System Info */}
          <div className="border-b border-app-border/40 bg-app-card/35 backdrop-blur-md py-4 px-8 sticky top-[89px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80 z-50">
            {/* The Dropdown Trigger Button */}
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-app-card border border-app-border text-xs font-black uppercase tracking-widest text-[#273F4F] hover:border-app-accent/40 active:scale-98 transition-all shadow-md select-none"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const options = [
                    { value: 'system', label: t.menuMySystem, icon: Users },
                    { value: 'creator', label: t.menuCreator, icon: Hammer },
                    { value: 'switch', label: t.menuSwitches, icon: ArrowLeftRight },
                    { value: 'mapping', label: t.menuMapping, icon: GitBranch },
                    { value: 'chat', label: t.menuChat, icon: MessageSquareQuote },
                    { value: 'messaging', label: t.menuMessaging, icon: Mail },
                    { value: 'journal', label: t.menuJournal, icon: Book },
                    { value: 'grounding', label: t.menuGrounding, icon: Anchor },
                    { value: 'pluralkit', label: t.menuPluralKit, icon: Link2 },
                  ];
                  const currentOpt = options.find(o => o.value === currentTab) || options[0];
                  const CurrentIcon = currentOpt.icon;
                  return (
                    <>
                      <CurrentIcon className="w-4 h-4 text-[#273F4F] animate-pulse" />
                      <span className="text-[#273F4F] font-black tracking-widest">{currentOpt.label}</span>
                    </>
                  );
                })()}
              </div>
              <ChevronDown className={`w-4 h-4 text-[#273F4F] transition-transform duration-300 ${navMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options Drawer Overlay */}
            {navMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setNavMenuOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-app-border bg-app-card/95 backdrop-blur-xl shadow-2xl p-1.5 space-y-1"
                >
                  {[
                    { value: 'system', label: t.menuMySystem, icon: Users },
                    { value: 'creator', label: t.menuCreator, icon: Hammer },
                    { value: 'switch', label: t.menuSwitches, icon: ArrowLeftRight },
                    { value: 'mapping', label: t.menuMapping, icon: GitBranch },
                    { value: 'chat', label: t.menuChat, icon: MessageSquareQuote },
                    { value: 'messaging', label: t.menuMessaging, icon: Mail },
                    { value: 'journal', label: t.menuJournal, icon: Book },
                    { value: 'grounding', label: t.menuGrounding, icon: Anchor },
                    { value: 'pluralkit', label: t.menuPluralKit, icon: Link2 },
                  ].map((opt) => {
                    const IconComponent = opt.icon;
                    const isActive = currentTab === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setCurrentTab(opt.value as any);
                          setNavMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${
                          isActive
                            ? 'bg-app-accent text-white shadow-md'
                            : 'text-app-text/75 hover:bg-app-bg hover:text-app-text border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-app-muted'}`} />
                          <span>{opt.label}</span>
                        </div>
                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </div>

          {/* Nombre d'Alter count element */}
          <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-app-card/60 border border-app-border/30 text-xs font-semibold select-none text-[#273F4F]">
            <Users className="w-3.5 h-3.5 text-[#273F4F]" />
            <span className="text-[#273F4F]/75 uppercase tracking-widest text-[9px] font-black">{t.altersCount}</span>
            <span className="font-black text-[#273F4F] text-sm leading-none">{savedAlters.length}</span>
          </div>
        </div>
      </div>

      <main className={`max-w-7xl mx-auto px-2 md:px-8 py-6 md:py-12 ${currentTab === 'creator' ? 'grid grid-cols-1 lg:grid-cols-12 gap-12' : 'block space-y-8'}`}>
        {currentTab === 'creator' && (
          <>
            {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Name Input */}
          <section className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
              <User className="w-3 h-3" /> {t.alterName}
            </label>
            <input 
              type="text" 
              value={alterName}
              onChange={(e) => updateAlterName(e.target.value)}
              placeholder={t.alterNamePlaceholder}
              className="w-full bg-app-card border border-app-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all text-lg"
            />
          </section>



          {/* Description Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <FileText className="w-3 h-3" /> {t.descriptionTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {description.length}/5000
              </span>
            </div>
            <MarkdownEditor
              value={description}
              onChange={updateDescription}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              maxLength={5000}
            />
          </section>

          {/* Internal Notes Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <Lock className="w-3 h-3" /> {t.internalNotesTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {internalNotes.length}/5000
              </span>
            </div>
            <MarkdownEditor
              value={internalNotes}
              onChange={updateInternalNotes}
              placeholder={t.internalNotesPlaceholder}
              rows={4}
              maxLength={5000}
            />
          </section>

          {/* Bloc 1 : Informations de l'alter */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('predefined' as any)}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3" />
                <span>{lang === 'fr' ? "Informations de l'alter" : 'Alter Information'}</span>
              </div>
              {(openSections as any).predefined ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {(openSections as any).predefined && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Age' : 'Age'}</label>
                  <input type="text" value={alterAge} onChange={e => setAlterAge(e.target.value)}
                    placeholder={lang === 'fr' ? 'Ex: 17, inconnu...' : 'E.g. 17, unknown...'}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Couleur associee' : 'Associated Color'}</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#84cc16','#06b6d4','#a855f7','#6366f1','#e11d48','#1d4ed8','#ffffff','#94a3b8','#1e293b'].map(c => (
                      <button key={c} type="button" onClick={() => setAlterColor(c)}
                        className={"w-6 h-6 rounded-lg border-2 transition-transform hover:scale-110 " + (alterColor === c ? 'border-app-text scale-110' : 'border-transparent')}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" value={alterColor} onChange={e => setAlterColor(e.target.value)}
                      placeholder="#8B6F4E"
                      className="flex-1 bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted uppercase" />
                    <input type="color" value={alterColor || '#8B6F4E'} onChange={e => setAlterColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-app-border cursor-pointer flex-shrink-0" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Triggers</label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">+</span>
                      <input type="text" value={triggersPositive} onChange={e => setTriggersPositive(e.target.value)}
                        placeholder={lang === 'fr' ? 'Musique, nature...' : 'Music, nature...'}
                        className="w-full bg-app-card border border-app-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-app-text placeholder:text-app-muted" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-500 border border-red-500/20">-</span>
                      <input type="text" value={triggersNegative} onChange={e => setTriggersNegative(e.target.value)}
                        placeholder={lang === 'fr' ? 'Conflits, foule...' : 'Conflicts, crowds...'}
                        className="w-full bg-app-card border border-app-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-app-text placeholder:text-app-muted" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Langues parlees' : 'Languages'}</label>
                  <input type="text" value={alterLanguages} onChange={e => setAlterLanguages(e.target.value)}
                    placeholder={lang === 'fr' ? 'Francais, Anglais...' : 'French, English...'}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? "Source de l'alter" : 'Alter Source'}</label>
                  <input type="text" value={alterOriginWorld} onChange={e => setAlterOriginWorld(e.target.value)}
                    placeholder={lang === 'fr' ? 'Fictif ou factif' : 'Fictitious or factual'}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                </div>
              </div>
            )}
          </section>

          {/* Bloc 2 : Champs personnalises */}
          <section className="space-y-4">
            <button
              onClick={() => toggleSection('customFields' as any)}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3 h-3" />
                <span>{lang === 'fr' ? 'Champs personnalises' : 'Custom Fields'}</span>
              </div>
              {(openSections as any).customFields ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {(openSections as any).customFields && (
              <div className="space-y-3">
                {customFields.map((field, idx) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input type="text" value={field.label}
                        onChange={e => setCustomFields(prev => prev.map((f, i) => i === idx ? { ...f, label: e.target.value } : f))}
                        placeholder="Label..."
                        className="bg-app-card border border-app-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted font-bold" />
                      <input type="text" value={field.value}
                        onChange={e => setCustomFields(prev => prev.map((f, i) => i === idx ? { ...f, value: e.target.value } : f))}
                        placeholder="Valeur..."
                        className="bg-app-card border border-app-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                    </div>
                    <button type="button" onClick={() => setCustomFields(prev => prev.filter((_, i) => i !== idx))}
                      className="mt-1 p-2 rounded-lg text-app-muted hover:text-red-500 hover:bg-red-500/10 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setCustomFields(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), label: '', value: '' }])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-app-border hover:border-app-accent/40 text-app-muted hover:text-app-text text-xs font-bold uppercase tracking-widest transition-colors">
                  <Plus className="w-3 h-3" />
                  {lang === 'fr' ? 'Ajouter un champ' : 'Add a field'}
                </button>
              </div>
            )}
          </section>

          {/* Roles Selection */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('roles')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" /> {t.roles}
              </div>
              {openSections.roles ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {openSections.roles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {[...Object.values(AlterRole)].sort((a, b) => (t.roleNames[a as keyof typeof t.roleNames] || '').localeCompare(t.roleNames[b as keyof typeof t.roleNames] || '')).map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
                          selectedRoles.includes(role)
                            ? 'bg-app-text text-app-bg border-transparent shadow-lg'
                            : 'bg-app-card border-app-border hover:border-app-accent/30'
                        }`}
                      >
                        <span className="opacity-70">{getRoleIcon(role)}</span>
                        <span className="font-medium">{t.roleNames[role as keyof typeof t.roleNames]}</span>
                      </button>
                    ))}
                  </div>

                  {selectedRoles.length > 0 && (
                    <div className="pt-4 border-t border-app-border/25 space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                        {t.customizeColors}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedRoles.map((role) => (
                          <div key={role} className="flex items-center justify-between bg-app-card/40 p-2 rounded-xl border border-app-border/15">
                            <div className="flex items-center gap-1.5 min-w-0 px-1">
                              <span className="opacity-75 shrink-0 scale-75">{getRoleIcon(role)}</span>
                              <span className="text-[10px] font-semibold truncate">
                                {t.roleNames[role as keyof typeof t.roleNames]}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 pr-1">
                              <input 
                                type="text"
                                value={customRoleColors[role] || ROLE_CONFIGS[role].color}
                                onChange={(e) => updateCustomRoleColors({ ...customRoleColors, [role]: e.target.value })}
                                className="w-14 px-1 py-0.5 text-[8px] font-mono border border-app-border rounded bg-app-bg uppercase focus:outline-none text-center"
                                placeholder="#000000"
                              />
                              <input 
                                type="color" 
                                value={customRoleColors[role] || ROLE_CONFIGS[role].color}
                                onChange={(e) => updateCustomRoleColors({ ...customRoleColors, [role]: e.target.value })}
                                className="w-5 h-5 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Gender Selection */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('gender')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" /> {t.gender}
              </div>
              {openSections.gender ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {openSections.gender && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="space-y-4">
                    {Object.entries(GENDER_CATEGORIES).map(([category, genders]) => (
                      <div key={category} className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1">
                          {t.genderCategories[category as keyof typeof t.genderCategories]}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[...genders].sort((a, b) => (t.genders[a as keyof typeof t.genders] || '').localeCompare(t.genders[b as keyof typeof t.genders] || '')).map((g) => (
                            <button
                              key={g}
                              onClick={() => {
                                toggleGender(g);
                                setInfoNote({ 
                                  title: t.genders[g as keyof typeof t.genders], 
                                  text: t.genderData[g as keyof typeof t.genderData] 
                                });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                selectedGenders.includes(g)
                                  ? 'bg-app-accent text-app-bg border-transparent shadow-sm'
                                  : 'bg-app-card border-app-border hover:border-app-accent/30'
                              }`}
                            >
                              {t.genders[g as keyof typeof t.genders]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedGenders.length > 0 && (
                    <div className="pt-4 border-t border-app-border/25 space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                        {t.customizeColors}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedGenders.map((g) => (
                          <div key={g} className="flex items-center justify-between bg-app-card/40 p-2 rounded-xl border border-app-border/15">
                            <div className="flex items-center gap-1.5 min-w-0 px-1">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-app-border animate-pulse" style={{ backgroundColor: customGenderColors[g] || GENDER_COLORS[g] }} />
                              <span className="text-[10px] font-semibold truncate">
                                {t.genders[g as keyof typeof t.genders]}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 pr-1">
                              <input 
                                type="text"
                                value={customGenderColors[g] || GENDER_COLORS[g]}
                                onChange={(e) => updateCustomGenderColors({ ...customGenderColors, [g]: e.target.value })}
                                className="w-14 px-1 py-0.5 text-[8px] font-mono border border-app-border rounded bg-app-bg uppercase focus:outline-none text-center"
                                placeholder="#000000"
                              />
                              <input 
                                type="color" 
                                value={customGenderColors[g] || GENDER_COLORS[g]}
                                onChange={(e) => updateCustomGenderColors({ ...customGenderColors, [g]: e.target.value })}
                                className="w-5 h-5 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Sexuality Selection */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('sexuality')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <HeartPulse className="w-3 h-3" /> {t.sexuality}
              </div>
              {openSections.sexuality ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {openSections.sexuality && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="space-y-4">
                    {Object.entries(SEXUALITY_CATEGORIES).map(([category, sexualities]) => (
                      <div key={category} className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1">
                          {t.sexualityCategories[category as keyof typeof t.sexualityCategories]}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[...sexualities].sort((a, b) => (t.sexualityNames[a as keyof typeof t.sexualityNames] || '').localeCompare(t.sexualityNames[b as keyof typeof t.sexualityNames] || '')).map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                toggleSexuality(s);
                                setInfoNote({ 
                                  title: t.sexualityNames[s as keyof typeof t.sexualityNames], 
                                  text: t.sexualityData[s as keyof typeof t.sexualityData] 
                                });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                selectedSexualities.includes(s)
                                  ? 'bg-app-accent text-app-bg border-transparent shadow-sm'
                                  : 'bg-app-card border-app-border hover:border-app-accent/30'
                              }`}
                            >
                              {t.sexualityNames[s as keyof typeof t.sexualityNames]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedSexualities.length > 0 && (
                    <div className="pt-4 border-t border-app-border/25 space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                        {t.customizeColors}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedSexualities.map((s) => (
                          <div key={s} className="flex items-center justify-between bg-app-card/40 p-2 rounded-xl border border-app-border/15">
                            <div className="flex items-center gap-1.5 min-w-0 px-1">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-app-border animate-pulse" style={{ backgroundColor: customSexualityColors[s] || SEXUALITY_COLORS[s] }} />
                              <span className="text-[10px] font-semibold truncate">
                                {t.sexualityNames[s as keyof typeof t.sexualityNames]}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 pr-1">
                              <input 
                                type="text"
                                value={customSexualityColors[s] || SEXUALITY_COLORS[s]}
                                onChange={(e) => updateCustomSexualityColors({ ...customSexualityColors, [s]: e.target.value })}
                                className="w-14 px-1 py-0.5 text-[8px] font-mono border border-app-border rounded bg-app-bg uppercase focus:outline-none text-center"
                                placeholder="#000000"
                              />
                              <input 
                                type="color" 
                                value={customSexualityColors[s] || SEXUALITY_COLORS[s]}
                                onChange={(e) => updateCustomSexualityColors({ ...customSexualityColors, [s]: e.target.value })}
                                className="w-5 h-5 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </section>


          {/* Personality Traits Selection */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('personalityTraits')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> {t.personalityTraitsTitle}
              </div>
              {openSections.personalityTraits ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {openSections.personalityTraits && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {[...Object.values(PersonalityTrait)].sort((a, b) => (t.personalityTraits[a as keyof typeof t.personalityTraits] || '').localeCompare(t.personalityTraits[b as keyof typeof t.personalityTraits] || '')).map((trait) => {
                      const isSelected = traitDecorations.some(td => td.trait === trait);
                      return (
                        <button
                          key={trait}
                          onClick={() => toggleTrait(trait)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-app-text text-app-bg border-transparent shadow-lg shadow-app-text/20'
                              : 'bg-app-card border-app-border hover:border-app-accent/30'
                          }`}
                        >
                          <div className={isSelected ? 'text-app-bg' : 'text-app-muted'}>
                            {getTraitIcon(trait)}
                          </div>
                          {t.personalityTraits[trait as keyof typeof t.personalityTraits]}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Disorders Selection */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('disorders')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3" /> {t.disordersTitle}
              </div>
              {openSections.disorders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {openSections.disorders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {[...Object.values(Disorder)].sort((a, b) => (t.disorders[a as keyof typeof t.disorders] || '').localeCompare(t.disorders[b as keyof typeof t.disorders] || '')).map((trait) => {
                      const isSelected = traitDecorations.some(td => td.trait === trait);
                      return (
                        <button
                          key={trait}
                          onClick={() => toggleTrait(trait)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-app-text text-app-bg border-transparent shadow-lg shadow-app-text/20'
                              : 'bg-app-card border-app-border hover:border-app-accent/30'
                          }`}
                        >
                          <div className={isSelected ? 'text-app-bg' : 'text-app-muted'}>
                            {getTraitIcon(trait)}
                          </div>
                          {t.disorders[trait as keyof typeof t.disorders]}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="sticky top-32 w-full space-y-8">
            
            {/* Info Note */}
            <AnimatePresence>
              {infoNote && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-app-accent text-white p-4 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <button onClick={() => setInfoNote(null)} className="opacity-50 hover:opacity-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-app-card/20 p-2 rounded-lg">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                        {infoNote.title}
                      </h4>
                      <p className="text-sm font-medium leading-relaxed">
                        {infoNote.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Card Preview Container */}
            <div className="relative group w-full flex justify-center">
              <div 
                ref={flagRef}
                className={`w-full max-w-[600px] rounded-[2rem] shadow-2xl border-8 border-app-card relative bg-app-bg text-app-text select-none flex flex-col justify-between ${
                  isDownloading ? 'h-auto overflow-visible' : 'aspect-[2/3] overflow-hidden'
                }`}
                style={{ backgroundColor: 'var(--color-app-bg)' }}
              >
                {/* Upper Section: Identity & Roles (Frosted Glass Header) */}
                <div className="bg-app-card/85 backdrop-blur-md border-b border-app-border/25 p-4.5 flex flex-col">
                  {/* Photo de profil et Titre/Nom + Infos côte à côte */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 min-w-0 flex-1">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-app-accent">
                          {lang === 'fr' ? "Fiche d'Alter" : "Alter Profile"}
                        </div>
                        <h2 
                          className={`text-xl font-black tracking-tight leading-none uppercase ${font}`}
                          style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {alterName || (lang === 'fr' ? 'Anonyme' : 'Anonymous')}
                        </h2>
                      </div>

                      {/* System Roles - Placed close to the name */}
                      {selectedRoles.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[8px] font-bold uppercase tracking-widest opacity-50 px-0.5">
                            {lang === 'fr' ? 'Rôles' : 'Roles'}
                          </div>
                          <div className={`flex flex-wrap gap-1 pr-1 ${
                            isDownloading ? 'max-h-none overflow-visible' : 'max-h-[85px] overflow-y-auto'
                          }`}>
                            {selectedRoles.map(role => (
                              <span 
                                key={role} 
                                style={{ 
                                  backgroundColor: `${customRoleColors[role] || ROLE_CONFIGS[role].color}20`, 
                                  borderColor: `${customRoleColors[role] || ROLE_CONFIGS[role].color}60`,
                                  color: customRoleColors[role] || ROLE_CONFIGS[role].color
                                }}
                                className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 shrink-0 animate-fade-in"
                              >
                                <span 
                                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0" 
                                  style={{ backgroundColor: customRoleColors[role] || ROLE_CONFIGS[role].color }}
                                />
                                {t.roleNames[role as keyof typeof t.roleNames]}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Identity Row - Gender & Sexuality Row stacked vertically or wrapped inside the left-hand section */}
                      {(selectedGenders.length > 0 || selectedSexualities.length > 0) && (
                        <div className="flex flex-col gap-2 pt-0.5">
                          {/* Genders Row */}
                          {selectedGenders.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-50 px-0.5">
                                {lang === 'fr' ? 'Genres' : 'Genders'}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {selectedGenders.map(g => (
                                  <div 
                                    key={g} 
                                    style={{ 
                                      backgroundColor: `${customGenderColors[g] || GENDER_COLORS[g]}15`, 
                                      borderColor: `${customGenderColors[g] || GENDER_COLORS[g]}40`,
                                      color: customGenderColors[g] || GENDER_COLORS[g]
                                    }}
                                    className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border flex items-center gap-1 shrink-0 animate-fade-in"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: customGenderColors[g] || GENDER_COLORS[g] }} />
                                    {t.genders[g as keyof typeof t.genders]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sexualities Row */}
                          {selectedSexualities.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-50 px-0.5">
                                {lang === 'fr' ? 'Orientations sexuelles' : 'Sexual Orientations'}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {selectedSexualities.map(s => (
                                  <div 
                                    key={s} 
                                    style={{ 
                                      backgroundColor: `${customSexualityColors[s] || SEXUALITY_COLORS[s]}15`, 
                                      borderColor: `${customSexualityColors[s] || SEXUALITY_COLORS[s]}40`,
                                      color: customSexualityColors[s] || SEXUALITY_COLORS[s]
                                    }}
                                    className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border flex items-center gap-1 shrink-0 animate-fade-in"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: customSexualityColors[s] || SEXUALITY_COLORS[s] }} />
                                    {t.sexualityNames[s as keyof typeof t.sexualityNames]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image Selector right-aligned */}
                    <div className="relative shrink-0 select-none">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                      />
                      <div
                        onClick={() => { if (!isDownloading) fileInputRef.current?.click(); }}
                        className={`relative w-24 h-24 sm:w-[120px] sm:h-[120px] shrink-0 rounded-2xl overflow-hidden border-2 bg-app-card/30 flex items-center justify-center transition-all ${
                          isDownloading
                            ? 'border-app-border/20 pointer-events-none'
                            : 'border-app-border/30 hover:border-app-accent hover:scale-105 cursor-pointer group/avatar'
                        }`}
                      >
                        {profileImage ? (
                          <>
                            <img
                              src={profileImage}
                              className="w-full h-full object-cover"
                              alt="Profile"
                              referrerPolicy="no-referrer"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            {!isDownloading && (
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center gap-0.5 text-[8px] text-white font-extrabold tracking-widest uppercase transition-opacity">
                                <Upload className="w-3.5 h-3.5" />
                                <span>{lang === 'fr' ? 'Modifier' : 'Change'}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-app-border/20 rounded-2xl p-1 text-app-muted ${isDownloading ? '' : 'group-hover/avatar:border-app-accent/30'}`}>
                            <User className={`w-9 h-9 opacity-40 ${isDownloading ? '' : 'group-hover/avatar:text-app-accent group-hover/avatar:opacity-75 transition-all'}`} />
                            <span className="text-[7.5px] font-black uppercase tracking-widest opacity-40">{lang === 'fr' ? 'Photo' : 'Photo'}</span>
                          </div>
                        )}
                      </div>

                      {/* Small floating trash/remove button when an image exists (only if not downloading) */}
                      {profileImage && !isDownloading && (
                        <button
                          onClick={removeProfileImage}
                          title={lang === 'fr' ? "Supprimer l'image" : "Remove image"}
                          className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500/95 hover:bg-red-500 text-white shadow-sm transition-all hover:scale-110 z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lower Section: Traits & Disorders (List / Scroll) */}
                <div className={`p-5 flex flex-col relative z-10 bg-app-card/20 backdrop-blur-sm ${isDownloading ? "overflow-visible" : "flex-1 justify-between overflow-hidden"}`}>
                  <div className="flex flex-col gap-4">
                    <div className={`flex-1 pr-1 ${
                      isDownloading ? 'max-h-none overflow-visible' : 'max-h-[380px] overflow-y-auto'
                    } space-y-4`}>
                      
                      {/* Traits & Disorders Section */}
                      {traitDecorations.length > 0 && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-app-text animate-pulse">
                            {lang === 'fr' ? 'Traits & Troubles' : 'Traits & Conditions'}
                          </div>

                          {/* Personality Traits Sub-section */}
                          {traitDecorations.filter(td => !Object.values(Disorder).includes(td.trait as Disorder)).length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[8px] font-black uppercase tracking-widest text-app-text/70 px-1 font-mono">
                                {t.personalityTraitsTitle}
                              </div>
                              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                                {traitDecorations
                                  .filter(td => !Object.values(Disorder).includes(td.trait as Disorder))
                                  .map(td => {
                                    const name = t.personalityTraits[td.trait as keyof typeof t.personalityTraits];
                                    return (
                                      <div 
                                        key={td.trait} 
                                        className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                      >
                                        <span className="text-app-accent bg-app-accent/10 p-1 rounded-full shrink-0">
                                          <span className="w-3 h-3 flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3">{getTraitIcon(td.trait)}</span>
                                        </span>
                                        <span>{name}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}

                          {/* Disorders Sub-section */}
                          {traitDecorations.filter(td => Object.values(Disorder).includes(td.trait as Disorder)).length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[8px] font-black uppercase tracking-widest text-app-text/70 px-1 font-mono">
                                {t.disordersTitle}
                              </div>
                              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                                {traitDecorations
                                  .filter(td => Object.values(Disorder).includes(td.trait as Disorder))
                                  .map(td => {
                                    const name = t.disorders[td.trait as keyof typeof t.disorders];
                                    return (
                                      <div 
                                        key={td.trait} 
                                        className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                      >
                                        <span className="text-app-accent bg-app-accent/10 p-1 rounded-full shrink-0">
                                          <span className="w-3 h-3 flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3">{getTraitIcon(td.trait)}</span>
                                        </span>
                                        <span>{name}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description Section */}
                      {description && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono flex items-center gap-1.5">
                            <FileText className="w-2.5 h-2.5" />
                            {t.descriptionTitle}
                          </div>
                          <div className={`px-4 py-3 bg-app-card/45 backdrop-blur-sm rounded-2xl border border-app-border/10 text-[11px] leading-relaxed text-app-text/90 space-y-1 ${font}`}>
                            {renderMarkdown(description)}
                          </div>
                        </div>
                      )}

                      {/* Internal Notes Section */}
                      {internalNotes && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono flex items-center gap-1.5">
                            <Lock className="w-2.5 h-2.5" />
                            {t.internalNotesTitle}
                          </div>
                          <div className="px-4 py-3 bg-app-card/30 backdrop-blur-sm rounded-2xl border border-dashed border-app-border/20 text-[10px] leading-relaxed text-app-text/85 break-words space-y-1">
                            {renderMarkdown(internalNotes)}
                          </div>
                        </div>
                      )}

                      {/* Fallback Empty State / Placeholder */}
                      {/* Champs predéfinis dans la preview */}
                      {(alterAge || alterColor || triggersPositive || triggersNegative || alterLanguages || alterOriginWorld) && (
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono">
                            {lang === 'fr' ? 'Informations' : 'Information'}
                          </div>
                          <div className="px-3 py-2.5 bg-app-card/30 rounded-2xl border border-app-border/10 space-y-1.5">
                            {alterAge && (
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted w-20 shrink-0">{lang === 'fr' ? 'Age' : 'Age'}</span>
                                <span className="text-app-text/85">{alterAge}</span>
                              </div>
                            )}
                            {alterColor && (
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted w-20 shrink-0">{lang === 'fr' ? 'Couleur' : 'Color'}</span>
                                <span className="w-4 h-4 rounded-md border border-app-border/20 inline-block shrink-0" style={{ backgroundColor: alterColor }} />
                                <span className="font-mono text-app-text/85">{alterColor}</span>
                              </div>
                            )}
                            {(triggersPositive || triggersNegative) && (
                              <div className="space-y-1">
                                <div className="font-black uppercase tracking-widest text-app-muted text-[10px]">Triggers</div>
                                {triggersPositive && (
                                  <div className="flex items-start gap-1.5 text-[10px]">
                                    <span className="font-black text-emerald-500 shrink-0">+</span>
                                    <span className="text-app-text/85">{triggersPositive}</span>
                                  </div>
                                )}
                                {triggersNegative && (
                                  <div className="flex items-start gap-1.5 text-[10px]">
                                    <span className="font-black text-red-500 shrink-0">-</span>
                                    <span className="text-app-text/85">{triggersNegative}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {alterLanguages && (
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted w-20 shrink-0">{lang === 'fr' ? 'Langues' : 'Languages'}</span>
                                <span className="text-app-text/85">{alterLanguages}</span>
                              </div>
                            )}
                            {alterOriginWorld && (
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted w-20 shrink-0">{lang === 'fr' ? 'Source' : 'Source'}</span>
                                <span className="text-app-text/85">{alterOriginWorld}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Champs personnalisés dans la preview */}
                      {customFields.filter(f => f.label || f.value).length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono">
                            {lang === 'fr' ? 'Champs personnalises' : 'Custom Fields'}
                          </div>
                          <div className="px-3 py-2.5 bg-app-card/30 rounded-2xl border border-app-border/10 space-y-1.5">
                            {customFields.filter(f => f.label || f.value).map(f => (
                              <div key={f.id} className="flex items-center gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted shrink-0 max-w-[5rem] truncate">{f.label || '-'}</span>
                                <span className="text-app-text/85">{f.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {traitDecorations.length === 0 && !description && !internalNotes && (
                        <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-app-border/25 rounded-2xl bg-app-card/20 h-[270px]">
                          <Sparkles className="w-5 h-5 opacity-30 text-app-accent mb-1.5" />
                          <p className="text-[9px] font-bold uppercase tracking-widest opacity-45">
                            {lang === 'fr' ? 'Aucun trait ou texte saisi' : 'No traits or text entered'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quiet card footer */}
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase opacity-45 pt-3 border-t border-app-border/10">
                      <span>HavenSpace © 2026</span>
                      <span className="flex items-center gap-1 text-app-accent/80 font-black">
                        {selectedRoles[0] ? t.roleNames[selectedRoles[0] as keyof typeof t.roleNames] : ''}
                      </span>
                    </div>
                  </div>

                  {/* Watermark Logo of the primary role in the background center of lower panel */}
                  {selectedRoles[0] && !isDownloading && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 opacity-[0.03] text-app-text pointer-events-none flex items-center justify-center z-0">
                      <span className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.2]">{getRoleIcon(selectedRoles[0])}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button Overlay */}
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`absolute -bottom-4 -right-4 md:-right-12 w-14 h-14 bg-app-accent text-white rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 z-25 ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                title={t.download}
              >
                {isDownloading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Export and Action Panel */}
            <div className="flex flex-col gap-4 w-full">
              {(() => {
                const editingAlter = editingAlterId ? savedAlters.find(a => a.id === editingAlterId) : null;
                if (editingAlter && editingAlter.pkId && pkToken) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                        <span className="font-extrabold uppercase tracking-widest text-[9px] text-green-500">
                          {lang === 'fr' ? 'Lié à PluralKit' : 'Linked to PluralKit'}
                        </span>
                      </div>
                      <button
                        onClick={() => exportAlterToPluralKit(editingAlter)}
                        disabled={isExportingPkId === editingAlter.pkId}
                        className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {isExportingPkId === editingAlter.pkId ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>{t.pkExportBtn}</span>
                      </button>
                    </motion.div>
                  );
                }
                return null;
              })()}

              {/* Primary Save Action */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleSaveAlter();
                    const trimmedName = alterName.trim() || (lang === 'fr' ? 'Anonyme' : 'Anonymous');
                    const hasConflict = savedAlters.some(
                      a => a.id !== editingAlterId && a.alterName.toLowerCase().trim() === trimmedName.toLowerCase().trim()
                    );
                    if (!hasConflict) {
                      alert(lang === 'fr' ? 'Fiche enregistrée avec succès !' : 'Card successfully saved!');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 px-5 bg-app-accent hover:opacity-90 active:scale-[0.99] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md select-none border border-transparent"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAlterId ? t.updateAlter : t.saveCurrentAlter}</span>
                </button>
                {editingAlterId && (
                  <button
                    onClick={handleResetCreator}
                    className="px-4 bg-app-card border border-app-border/40 hover:border-red-500/35 hover:text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center"
                    title={lang === 'fr' ? 'Créer une nouvelle fiche' : 'Create new card'}
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Download Buttons */}
              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2.5 py-4 px-8 bg-app-card border border-app-border/45 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-app-bg hover:border-app-accent/40 active:scale-98 transition-all shadow-sm select-none"
                >
                  <Download className="w-3.5 h-3.5 text-app-accent" />
                  <span>{lang === 'fr' ? 'Télécharger PNG' : 'Download PNG'}</span>
                </button>
              </div>
            </div>

            {/* Meaning Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-app-card rounded-3xl p-8 shadow-sm border border-app-border space-y-6 relative group/card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-app-muted">
                  <Info className="w-4 h-4" /> {t.meaning}
                </div>
                <button 
                  onClick={handleDownloadDefinition}
                  className="p-2 hover:bg-app-bg rounded-lg transition-colors text-app-muted hover:text-app-accent"
                  title={t.downloadDefinition}
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {selectedRoles.map(role => (
                    <div key={role} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_CONFIGS[role].color }} />
                      <span className="text-sm font-medium">{t.roleNames[role as keyof typeof t.roleNames]}: {t.rolesData[role as keyof typeof t.rolesData]}</span>
                    </div>
                  ))}
                  {selectedGenders.map(g => (
                    <div key={g} className="flex items-center gap-2 animate-fade-in">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: customGenderColors[g] || GENDER_COLORS[g] }} />
                      <span className="text-sm font-medium">{t.gender}: {t.genders[g as keyof typeof t.genders]}</span>
                    </div>
                  ))}
                  {selectedSexualities.map(s => (
                    <div key={s} className="flex items-center gap-2 animate-fade-in">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: customSexualityColors[s] || SEXUALITY_COLORS[s] }} />
                      <span className="text-sm font-medium">{t.sexuality}: {t.sexualityNames[s as keyof typeof t.sexualityNames]}</span>
                    </div>
                  ))}
                </div>
                
                {traitDecorations.length > 0 && (
                  <div className="pt-4 border-t border-app-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-app-muted mb-2">{t.traitsIncluded}</p>
                    <div className="flex flex-wrap gap-2">
                      {traitDecorations.map(td => {
                        const isDisorder = Object.values(Disorder).includes(td.trait as Disorder);
                        const name = isDisorder 
                          ? t.disorders[td.trait as keyof typeof t.disorders] 
                          : t.personalityTraits[td.trait as keyof typeof t.personalityTraits];
                        return (
                          <span key={td.trait} className="px-3 py-1 bg-app-bg rounded-full text-xs font-medium flex items-center gap-1">
                            {getTraitIcon(td.trait)}
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {decorations.length > 0 && (
                  <div className="pt-4 border-t border-app-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-app-muted mb-2">{t.customSymbols}</p>
                    <div className="flex flex-wrap gap-2">
                      {decorations.map(d => (
                        <span key={d.id} className="px-3 py-1 bg-app-bg rounded-full text-xs font-medium flex items-center gap-1">
                          {getShapeIcon(d.type)} {t.shapes[d.type as keyof typeof t.shapes]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <p className="text-[10px] text-center text-app-muted uppercase tracking-widest leading-relaxed">
              {t.disclaimer}
            </p>
          </div>
        </div>
          </>
        )}

        {/* --- SYSTEM VIEW --- */}
        {currentTab === 'system' && (
          <div className="space-y-10 animate-fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black uppercase tracking-wider">{t.menuMySystem}</h2>
                  {activeSystemId !== 'main' && (
                    <span className="px-3 py-1 bg-app-accent/10 border border-app-accent/20 rounded-xl text-xs font-black text-app-accent uppercase tracking-widest">
                      {activeSystemName}
                    </span>
                  )}
                </div>
                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
                  <input
                    type="text"
                    value={systemSearch}
                    onChange={e => setSystemSearch(e.target.value)}
                    placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
                    className="bg-app-card border border-app-border/30 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 w-48"
                  />
                  {systemSearch && (
                    <button onClick={() => setSystemSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reset or Save active alter triggers */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleResetCreator}
                  className="px-4.5 py-2.5 bg-app-card border border-app-border/40 hover:border-app-accent/40 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.createNewAlter}</span>
                </button>

              </div>
            </div>

            {/* Tree grid & Subsystem Creation Panel */}
            <div className="space-y-10">
              
              {/* Top Section: Display hierarchy & files */}
              <div className="w-full space-y-8">
                {activeSystemSubsystems.length === 0 && activeSystemAlters.length === 0 ? (
                  <div className="p-12 text-center bg-app-card/30 rounded-2xl border border-app-border/20 max-w-xl mx-auto space-y-4">
                    <Users className="w-12 h-12 text-app-muted mx-auto opacity-35" />
                    <p className="text-sm text-app-muted leading-relaxed uppercase tracking-wider font-semibold">{t.noAltersSaved}</p>
                  </div>
                ) : (
                  /* Main/Primary System Parent Wrap Card */
                  <div className="px-2 py-4 md:p-6 bg-app-accent/[0.015] border-2 border-dashed border-app-accent/20 rounded-3xl space-y-6 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent text-lg">
                        🛡️
                      </div>
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-wider text-app-text leading-tight">
                          {activeSystemName}
                        </h3>
                        <p className="text-[10px] text-app-muted uppercase font-bold tracking-widest">
                          {activeSystemId === 'main'
                            ? (lang === 'fr' ? 'Système Parent Principal' : 'Primary Parent System')
                            : (lang === 'fr' ? 'Système Parallèle' : 'Parallel System')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 md:pl-4 md:border-l-2 border-app-accent/10 md:ml-5">
                      {/* Root-Level Subsystems Tree Rendering */}
                      {activeSystemSubsystems.filter(s => !s.parentId).map(rootSub => renderSubsystemNode(rootSub.id))}

                      {/* Unassigned Alters Section */}
                      {activeSystemAlters.filter(a => !a.subsystemId && !a.archived).length > 0 && (
                        <div className="space-y-4">
                          {/* Conteneur scrollable avec scrollbar à gauche */}
                          <div className={`flex flex-row-reverse gap-2 ${activeSystemAlters.filter(a => !a.subsystemId && !a.archived).length > 10 ? 'max-h-[72vh] overflow-y-auto pr-1' : ''} alter-scroll-container`}>
                            <div className="flex-1">
                              <div className="md:hidden rounded-2xl border border-app-border/30 overflow-hidden bg-app-card/65 mb-2">
                                {[...activeSystemAlters]
                                  .filter(a => !a.subsystemId && !a.archived && (!systemSearch || (a.alterName || '').toLowerCase().includes(systemSearch.toLowerCase())))
                                  .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang))
                                  .map(a => renderAlterCard(a))}
                              </div>
                              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...activeSystemAlters]
                                  .filter(a => !a.subsystemId && !a.archived && (!systemSearch || (a.alterName || '').toLowerCase().includes(systemSearch.toLowerCase())))
                                  .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang))
                                  .map(a => renderAlterCard(a))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section Archives — bouton modal */}
              <div className="pt-6 border-t border-app-border/20">
                <button
                  onClick={() => setArchivesModalOpen(true)}
                  className="flex items-center gap-3 px-5 py-4 bg-app-card/65 border border-app-border/30 rounded-2xl text-sm font-bold hover:bg-app-card hover:border-app-accent/40 transition-all group"
                >
                  <Archive className="w-4 h-4 text-app-muted group-hover:text-app-accent transition-colors" />
                  <span className="text-app-text">{lang === 'fr' ? 'Alters archivés' : 'Archived Alters'}</span>
                  {savedAlters.some(a => a.archived) && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-app-bg border border-app-border/30 text-[10px] font-black text-app-muted">
                      {savedAlters.filter(a => a.archived).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Modal Archives */}
              {archivesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => { setArchivesModalOpen(false); setArchivesSearch(''); }}
                  />
                  {/* Modal content */}
                  <div className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col bg-app-bg border border-app-border/30 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-app-border/20">
                      <div className="flex items-center gap-3">
                        <Archive className="w-5 h-5 text-app-accent" />
                        <h2 className="text-base font-black uppercase tracking-widest text-app-text">
                          {lang === 'fr' ? 'Alters archivés' : 'Archived Alters'}
                        </h2>
                        {savedAlters.some(a => a.archived) && (
                          <span className="px-2 py-0.5 rounded-full bg-app-card border border-app-border/30 text-[10px] font-black text-app-muted">
                            {savedAlters.filter(a => a.archived).length}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => { setArchivesModalOpen(false); setArchivesSearch(''); }}
                        className="p-2 rounded-xl hover:bg-app-card transition-colors text-app-muted hover:text-app-text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search */}
                    <div className="px-6 py-4 border-b border-app-border/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                        <input
                          type="text"
                          value={archivesSearch}
                          onChange={e => setArchivesSearch(e.target.value)}
                          placeholder={lang === 'fr' ? 'Rechercher un alter archivé...' : 'Search archived alter...'}
                          className="w-full bg-app-card border border-app-border/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                        />
                      </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {activeSystemAlters.filter(a => a.archived).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-app-muted gap-3">
                          <Archive className="w-10 h-10 opacity-20" />
                          <p className="text-sm font-semibold opacity-50">
                            {lang === 'fr' ? 'Aucun alter archivé' : 'No archived alters'}
                          </p>
                        </div>
                      ) : (() => {
                        const filtered = [...activeSystemAlters]
                          .filter(a => a.archived)
                          .filter(a => !archivesSearch || (a.alterName || '').toLowerCase().includes(archivesSearch.toLowerCase()))
                          .sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang));
                        return filtered.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-app-muted gap-3">
                            <Search className="w-10 h-10 opacity-20" />
                            <p className="text-sm font-semibold opacity-50">
                              {lang === 'fr' ? 'Aucun résultat' : 'No results'}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-80">
                            {filtered.map(a => renderAlterCard(a))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Section: Create new subsystem form & name principal system side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-app-border/20">
                {/* Rename Principal System Panel */}
                <div className="p-6 bg-app-card/65 rounded-2xl border border-app-border/30 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-app-text flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    <span>{t.mainSystemLabel}</span>
                  </h3>
                  <div className="space-y-2">
                    <input 
                      type="text"
                      value={mainSystemName}
                      onChange={(e) => setMainSystemName(e.target.value)}
                      placeholder={t.mainSystemPlaceholder}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    />
                  </div>
                </div>

                {/* Create Subsystem Panel */}
                <div className="p-6 bg-app-card/65 rounded-2xl border border-app-border/30 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-app-text flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span>{t.subsystemAdd}</span>
                  </h3>
                  
                  <form onSubmit={handleCreateSubsystem} className="space-y-4">
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        placeholder={t.subsystemNamePlaceholder}
                        className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <select
                        value={newSubParentId}
                        onChange={(e) => setNewSubParentId(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      >
                        <option value="">{lang === 'fr' ? `Sous : ${mainSystemName} (Principal)` : `Under: ${mainSystemName} (Primary)`}</option>
                        {activeSystemSubsystems.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-app-accent hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                    >
                      {lang === 'fr' ? 'Créer le sous-système' : 'Create subsystem'}
                    </button>
                  </form>
                </div>

                {/* Systèmes Parallèles Panel */}
                <div className="p-6 bg-app-card/65 rounded-2xl border border-app-border/30 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-app-text flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Systèmes Parallèles' : 'Parallel Systems'}</span>
                  </h3>
                  <p className="text-[10px] text-app-muted leading-relaxed">
                    {lang === 'fr'
                      ? 'Un système parallèle est indépendant du système principal — il a ses propres alters, ses propres sous-systèmes et son propre mapping.'
                      : 'A parallel system is independent from the main system — it has its own alters, subsystems and mapping.'}
                  </p>

                  {/* Liste des systèmes parallèles */}
                  {parallelSystems.length > 0 && (
                    <div className="space-y-2">
                      {parallelSystems.map(sys => (
                        <div key={sys.id} className="group flex items-center gap-2 px-3 py-2.5 bg-app-bg border border-app-border/40 rounded-xl">
                          <button
                            onClick={() => setActiveSystemId(sys.id)}
                            className={`flex-1 text-left text-xs font-bold truncate transition-colors ${activeSystemId === sys.id ? 'text-app-accent' : 'text-app-text hover:text-app-accent'}`}
                          >
                            {activeSystemId === sys.id && <span className="mr-1.5 text-app-accent">✦</span>}
                            {sys.name}
                            <span className="ml-2 text-app-muted font-normal text-[10px]">
                              ({savedAlters.filter(a => a.systemId === sys.id).length} {lang === 'fr' ? 'alters' : 'alters'})
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingParallelSystemId(sys.id);
                              setParallelSystemFormName(sys.name);
                              setShowParallelSystemForm(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-app-card text-app-muted hover:text-app-text transition-all"
                            title={lang === 'fr' ? 'Renommer' : 'Rename'}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(lang === 'fr'
                                ? `Supprimer "${sys.name}" et tous ses alters ? Cette action est irréversible.`
                                : `Delete "${sys.name}" and all its alters? This cannot be undone.`
                              )) handleDeleteParallelSystem(sys.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-all"
                            title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulaire création/renommage */}
                  {showParallelSystemForm ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={parallelSystemFormName}
                        onChange={e => setParallelSystemFormName(e.target.value)}
                        placeholder={lang === 'fr' ? 'Nom du système parallèle...' : 'Parallel system name...'}
                        className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateParallelSystem}
                          className="flex-1 py-2.5 bg-app-accent hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          {editingParallelSystemId
                            ? (lang === 'fr' ? 'Renommer' : 'Rename')
                            : (lang === 'fr' ? 'Créer' : 'Create')}
                        </button>
                        <button
                          onClick={() => { setShowParallelSystemForm(false); setEditingParallelSystemId(null); setParallelSystemFormName(''); }}
                          className="px-4 py-2.5 bg-app-card border border-app-border rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
                        >✕</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingParallelSystemId(null); setParallelSystemFormName(''); setShowParallelSystemForm(true); }}
                      className="w-full py-3 bg-app-card border border-dashed border-app-border hover:border-app-accent hover:text-app-accent rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter un système parallèle' : 'Add a parallel system'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- CHAT VIEW --- */}
        {currentTab === 'chat' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-fade-in duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-app-border/30">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">{t.chatTitle}</h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.chatSubtitle}</p>
              </div>
              {chatMessages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="px-4 py-2 bg-app-card border border-app-border hover:border-red-500 hover:text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors animate-pulse"
                >
                  {lang === 'fr' ? 'Effacer la conversation' : 'Clear Chat'}
                </button>
              )}
            </div>

            {/* Chat Area Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Colonne gauche : Qui parle + Salons */}
              <div className="md:col-span-4 space-y-4">

              {/* Speaker Control */}
              <div className="p-5 bg-app-card/65 border border-app-border/30 rounded-2xl space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5 text-app-text" /> {t.selectSpeakingAlter}
                </label>
                <select
                  value={chatSpeakerId}
                  onChange={(e) => setChatSpeakerId(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-app-accent/20 outline-none"
                >
                  <option value="external">{lang === 'fr' ? 'Hôte / Système' : 'Host / System'}</option>
                  {[...savedAlters]
                    .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang))
                    .map(a => (
                      <option key={a.id} value={a.id}>{a.alterName}</option>
                    ))}
                </select>

                {/* Speaker preview identity card */}
                {chatSpeakerId !== 'external' && (() => {
                  const alt = savedAlters.find(a => a.id === chatSpeakerId);
                  if (!alt) return null;
                  return (
                    <div className="p-3 bg-app-bg/50 border border-app-border/25 rounded-xl space-y-2">
                      <div className="flex items-center gap-2.5">
                        {alt.profileImage ? (
                          <img src={alt.profileImage} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-app-accent/10 border border-app-accent/20 flex items-center justify-center font-bold text-xs">
                            {alt.alterName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-black truncate">{alt.alterName}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Salons */}
              <div className="p-5 bg-app-card/65 border border-app-border/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-app-text" />
                    {lang === 'fr' ? 'Salons' : 'Channels'}
                  </label>
                  <button
                    onClick={() => { setEditingSalonId(null); setSalonFormName(''); setSalonFormEmoji('💬'); setShowSalonForm(v => !v); }}
                    className="p-1 rounded-lg hover:bg-app-accent/10 text-app-accent transition-colors"
                    title={lang === 'fr' ? 'Créer un salon' : 'Create channel'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Formulaire création / édition salon */}
                {showSalonForm && (
                  <div className="space-y-2 p-3 bg-app-bg/60 border border-app-border/30 rounded-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={salonFormEmoji}
                        onChange={e => setSalonFormEmoji(e.target.value)}
                        maxLength={2}
                        className="w-12 bg-app-bg border border-app-border rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-app-accent/20 outline-none"
                        placeholder="💬"
                      />
                      <input
                        type="text"
                        value={salonFormName}
                        onChange={e => setSalonFormName(e.target.value)}
                        className="flex-1 bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-app-accent/20 outline-none"
                        placeholder={lang === 'fr' ? 'Nom du salon...' : 'Channel name...'}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!salonFormName.trim()) return;
                          if (editingSalonId) {
                            setChatSalons(prev => prev.map(s => s.id === editingSalonId
                              ? { ...s, name: salonFormName.trim(), emoji: salonFormEmoji || '💬' }
                              : s
                            ));
                          } else {
                            const newId = 'salon-' + Math.random().toString(36).slice(2, 9);
                            setChatSalons(prev => [...prev, { id: newId, name: salonFormName.trim(), emoji: salonFormEmoji || '💬', createdAt: Date.now(), accessMode: 'blacklist' as const, blockedOrAllowedIds: [] }]);
                            setActiveSalonId(newId);
                          }
                          setShowSalonForm(false);
                          setEditingSalonId(null);
                          setSalonFormName('');
                          setSalonFormEmoji('💬');
                        }}
                        className="flex-1 py-1.5 bg-app-accent text-white rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        {editingSalonId ? (lang === 'fr' ? 'Modifier' : 'Update') : (lang === 'fr' ? 'Créer' : 'Create')}
                      </button>
                      <button
                        onClick={() => { setShowSalonForm(false); setEditingSalonId(null); }}
                        className="px-3 py-1.5 bg-app-card border border-app-border rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Liste des salons */}
                <div className="space-y-1">
                  {chatSalons.map(salon => {
                    // Calcul accès pour l'alter actif
                    const isBlacklist = (salon.accessMode || 'blacklist') === 'blacklist';
                    const ids = salon.blockedOrAllowedIds || [];
                    const currentAlterBlocked = chatSpeakerId !== 'external' && (
                      isBlacklist ? ids.includes(chatSpeakerId) : !ids.includes(chatSpeakerId)
                    );
                    const rightsOpen = rightsOpenSalonId === salon.id;

                    return (
                      <div key={salon.id} className="space-y-1">
                        <div className="group flex items-center gap-1">
                          <button
                            onClick={() => setActiveSalonId(salon.id)}
                            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold truncate transition-all ${
                              salon.id === activeSalonId
                                ? 'bg-app-accent text-white shadow-sm'
                                : 'hover:bg-app-bg text-app-text'
                            }`}
                          >
                            <span className="shrink-0">{salon.emoji}</span>
                            <span className="truncate">{salon.name}</span>
                            {ids.length > 0 && (
                              <Shield className={`w-3 h-3 ml-auto shrink-0 ${salon.id === activeSalonId ? 'opacity-70' : 'text-app-muted'}`} />
                            )}
                          </button>

                          {/* Bouton droits */}
                          <button
                            onClick={() => setRightsOpenSalonId(rightsOpen ? null : salon.id)}
                            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all shrink-0 ${
                              rightsOpen ? 'opacity-100 bg-app-accent/10 text-app-accent' : 'hover:bg-app-bg text-app-muted hover:text-app-accent'
                            }`}
                            title={lang === 'fr' ? "Droits d'accès" : 'Access rights'}
                          >
                            <Shield className="w-3 h-3" />
                          </button>

                          {/* Bouton édition */}
                          <button
                            onClick={() => {
                              setEditingSalonId(salon.id);
                              setSalonFormName(salon.name);
                              setSalonFormEmoji(salon.emoji);
                              setShowSalonForm(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-app-bg text-app-muted hover:text-app-text transition-all shrink-0"
                            title={lang === 'fr' ? 'Modifier' : 'Edit'}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Bouton supprimer */}
                          {chatSalons.length > 1 && (
                            <button
                              onClick={() => {
                                setChatSalons(prev => prev.filter(s => s.id !== salon.id));
                                if (activeSalonId === salon.id) setActiveSalonId(chatSalons.find(s => s.id !== salon.id)?.id || DEFAULT_SALON_ID);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-all shrink-0"
                              title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Panneau droits inline */}
                        {rightsOpen && (
                          <div className="ml-2 p-3 bg-app-bg border border-app-border/40 rounded-xl space-y-3 text-xs">
                            {/* Toggle whitelist / blacklist */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => setChatSalons(prev => prev.map(s => s.id === salon.id ? { ...s, accessMode: 'blacklist' } : s))}
                                className={`flex-1 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-all ${
                                  isBlacklist ? 'bg-app-accent text-white' : 'bg-app-card text-app-muted hover:text-app-text'
                                }`}
                              >
                                {lang === 'fr' ? 'Bloquer' : 'Block'}
                              </button>
                              <button
                                onClick={() => setChatSalons(prev => prev.map(s => s.id === salon.id ? { ...s, accessMode: 'whitelist' } : s))}
                                className={`flex-1 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-all ${
                                  !isBlacklist ? 'bg-app-accent text-white' : 'bg-app-card text-app-muted hover:text-app-text'
                                }`}
                              >
                                {lang === 'fr' ? 'Autoriser' : 'Allow'}
                              </button>
                            </div>
                            <p className="text-app-muted text-[10px] leading-tight">
                              {isBlacklist
                                ? (lang === 'fr' ? 'Les alters cochés sont bloqués.' : 'Checked alters are blocked.')
                                : (lang === 'fr' ? 'Seuls les alters cochés ont accès.' : 'Only checked alters can access.')
                              }
                            </p>
                            {/* Liste des alters */}
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {savedAlters.length === 0 && (
                                <p className="text-app-muted italic">{lang === 'fr' ? 'Aucun alter enregistré.' : 'No alters saved.'}</p>
                              )}
                              {[...savedAlters].sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang)).map(alter => {
                                const checked = ids.includes(alter.id);
                                return (
                                  <label key={alter.id} className="flex items-center gap-2 cursor-pointer hover:bg-app-card/50 px-1.5 py-1 rounded-lg transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setChatSalons(prev => prev.map(s => {
                                          if (s.id !== salon.id) return s;
                                          const newIds = checked
                                            ? s.blockedOrAllowedIds.filter(id => id !== alter.id)
                                            : [...s.blockedOrAllowedIds, alter.id];
                                          return { ...s, blockedOrAllowedIds: newIds };
                                        }));
                                      }}
                                      className="accent-app-accent"
                                    />
                                    {alter.profileImage
                                      ? <img src={alter.profileImage} className="w-5 h-5 rounded object-cover" />
                                      : <div className="w-5 h-5 rounded bg-app-accent/10 flex items-center justify-center font-bold text-[9px] text-app-accent">{alter.alterName.slice(0,2).toUpperCase()}</div>
                                    }
                                    <span className="font-bold truncate">{alter.alterName}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              </div>{/* fin colonne gauche */}

              {/* Chat view workspace */}
              {(() => {
                const activeSalon = chatSalons.find(s => s.id === activeSalonId);
                const salonIsBlacklist = (activeSalon?.accessMode || 'blacklist') === 'blacklist';
                const salonIds = activeSalon?.blockedOrAllowedIds || [];
                const currentAlterBlocked = chatSpeakerId !== 'external' && activeSalon && (
                  salonIsBlacklist ? salonIds.includes(chatSpeakerId) : !salonIds.includes(chatSpeakerId)
                );
                return (
              <div className="md:col-span-8 flex flex-col h-[560px] bg-app-card/35 border border-app-border/30 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                {/* Header salon actif */}
                <div className="px-5 py-2.5 border-b border-app-border/20 flex items-center gap-2 bg-app-card/30">
                  <span className="text-sm">{activeSalon?.emoji || '💬'}</span>
                  <span className="text-xs font-black uppercase tracking-wider">{activeSalon?.name || 'Général'}</span>
                  {salonIds.length > 0 && (
                    <span className="ml-auto text-[10px] text-app-muted font-bold">
                      {salonIsBlacklist
                        ? `${salonIds.length} ${lang === 'fr' ? 'bloqué(s)' : 'blocked'}`
                        : `${salonIds.length} ${lang === 'fr' ? 'autorisé(s)' : 'allowed'}`}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Accès refusé */}
                  {currentAlterBlocked ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-3">
                      <Lock className="w-10 h-10 text-app-muted opacity-40" />
                      <p className="text-xs text-app-muted uppercase tracking-widest font-black">
                        {lang === 'fr' ? 'Accès refusé à ce salon.' : 'Access denied to this channel.'}
                      </p>
                      <p className="text-[10px] text-app-muted opacity-70">
                        {lang === 'fr'
                          ? `${savedAlters.find(a => a.id === chatSpeakerId)?.alterName || ''} n'a pas accès à ce salon.`
                          : `${savedAlters.find(a => a.id === chatSpeakerId)?.alterName || ''} cannot access this channel.`}
                      </p>
                    </div>
                  ) : (
                  <>
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-3">
                      <MessageSquareQuote className="w-10 h-10 text-app-muted opacity-30 animate-bounce" />
                      <p className="text-xs text-app-muted uppercase tracking-widest font-black">
                        {lang === 'fr' ? 'Aucun message interne.' : 'No internal messages logged.'}
                      </p>
                    </div>
                  )}

                  {chatMessages.map(msg => {
                    const matchedAlter = savedAlters.find(a => a.id === msg.senderAlterId);
                    const isSystem = msg.senderAlterId === 'external';
                    return (
                      <div key={msg.id} className="group flex gap-3.5 items-start">
                        {matchedAlter && matchedAlter.profileImage ? (
                          <img src={matchedAlter.profileImage} className="w-9 h-9 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center font-bold text-xs shrink-0 text-app-accent uppercase">
                            {isSystem ? 'SYS' : matchedAlter?.alterName.slice(0,2) || 'ALT'}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-app-text">
                              {isSystem ? (lang === 'fr' ? 'Hôte / Système' : 'Host / System') : matchedAlter?.alterName}
                            </span>
                            <span className="text-[9px] text-app-muted font-bold font-mono">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {msg.poll ? renderPollWidget(msg) : (
                            <p className="text-sm text-app-text/90 mt-1 bg-app-card/75 p-3 rounded-2xl rounded-tl-none border border-app-border/20 whitespace-pre-wrap leading-relaxed select-text">
                              {msg.text}
                            </p>
                          )}
                        </div>

                        {/* Quick Delete Message trigger */}
                        <button
                          onClick={() => setChatMessages(prev => prev.filter(m => m.id !== msg.id))}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-app-bg text-app-muted hover:text-red-500 rounded-lg transition-all shrink-0 self-center"
                          title="Supprimer ce message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  </>
                  )}{/* fin accès bloqué/autorisé */}
                </div>{/* fin div scrollable */}

                {/* Poll Creator Panel */}
                <AnimatePresence>
                  {showPollCreator && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 15, height: 0 }}
                      className="border-t border-app-border/40 bg-app-card/95 p-5 space-y-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4.5 h-4.5 text-app-accent animate-pulse" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-app-text">
                            {lang === 'fr' ? 'Créer un sondage' : 'Create Poll'}
                          </h4>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setShowPollCreator(false)}
                          className="p-1 hover:bg-app-bg rounded-lg text-app-muted transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSendChatPoll} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-app-muted block">
                            {lang === 'fr' ? 'Question du sondage' : 'Poll Question'}
                          </label>
                          <input
                            type="text"
                            required
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder={lang === 'fr' ? "Qu'allons-nous décider ?" : "What should we decide?"}
                            className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-app-accent focus:outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-app-muted block">
                            Options
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {pollOptions.map((opt, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  required
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...pollOptions];
                                    updated[idx] = e.target.value;
                                    setPollOptions(updated);
                                  }}
                                  placeholder={`${lang === 'fr' ? 'Option' : 'Option'} ${idx + 1}`}
                                  className="flex-1 bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-app-accent focus:outline-none"
                                />
                                {pollOptions.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => setPollOptions(prev => prev.filter((_, i) => i !== idx))}
                                    className="p-1.5 hover:bg-app-bg text-app-muted hover:text-red-500 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setPollOptions(prev => [...prev, ''])}
                            className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-app-accent bg-app-accent/10 px-3 py-1.5 rounded-lg hover:bg-app-accent/15 transition-all text-xs border border-transparent"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {lang === 'fr' ? 'Ajouter une option' : 'Add option'}
                          </button>
                        </div>

                        {/* Custom timers selection */}
                        <div className="grid grid-cols-2 gap-3 pb-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-app-muted block">
                              {lang === 'fr' ? 'Durée du timer' : 'Timer Duration'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={pollDuration}
                              onChange={(e) => setPollDuration(Math.max(1, Number(e.target.value) || 1))}
                              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-app-accent focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-app-muted block">
                              {lang === 'fr' ? 'Unité de temps' : 'Time Unit'}
                            </label>
                            <select
                              value={pollDurationUnit}
                              onChange={(e) => setPollDurationUnit(e.target.value as any)}
                              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            >
                              <option value="minutes">{lang === 'fr' ? 'Minutes' : 'Minutes'}</option>
                              <option value="hours">{lang === 'fr' ? 'Heures' : 'Hours'}</option>
                              <option value="days">{lang === 'fr' ? 'Jours' : 'Days'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2.5 pt-2 border-t border-app-border/20 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPollCreator(false);
                              setPollQuestion('');
                              setPollOptions(['', '']);
                            }}
                            className="px-4 py-2 bg-app-bg border border-app-border text-[9px] font-black uppercase tracking-widest text-app-text rounded-xl hover:bg-app-accent/5 transition-all"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-app-text text-app-bg hover:opacity-90 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md"
                          >
                            {lang === 'fr' ? 'Créer le Sondage' : 'Create Poll'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat Input form */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-app-border/30 bg-app-card/65 flex gap-3 items-center">
                  <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder={t.chatPlaceholder}
                    className="flex-1 min-w-0 bg-app-bg border border-app-border rounded-xl px-4 sm:px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/25"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-4 sm:px-6 py-3.5 bg-app-text text-app-bg hover:opacity-90 rounded-xl font-bold text-xs uppercase tracking-widest transition-opacity"
                  >
                    {lang === 'fr' ? 'Envoyer' : 'Send'}
                  </button>
                </form>

                {/* Poll Trigger Button placed UNDER the messaging block */}
                <div className="p-3 bg-app-card/30 border-t border-app-border/20 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPollCreator(!showPollCreator)}
                    className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      showPollCreator 
                        ? 'bg-[#273F4F] text-white border-transparent' 
                        : 'bg-app-bg/50 border-app-border hover:bg-app-bg text-[#273F4F]'
                    }`}
                    title={lang === 'fr' ? 'Créer un sondage' : 'Create a poll'}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Créer un sondage' : 'Create Poll'}</span>
                  </button>
                </div>
              </div>
              );})()} {/* fin IIFE chat workspace */}

            </div>
          </div>
        )}

        {/* --- SWITCH VIEW --- */}
        {currentTab === 'switch' && (
          <div className="space-y-8 max-w-4xl mx-auto w-full animate-fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider">{t.switchTitle}</h2>
              <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.switchSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Log Switch Form */}
              <div className="md:col-span-12 lg:col-span-5 p-6 bg-app-card/65 border border-app-border/30 rounded-2xl space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-app-text flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Déclarer un Front' : 'Declare Front'}</span>
                </h3>

                <form onSubmit={handleLogSwitch} className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted">
                      {lang === 'fr' ? '1. Sélectionner l\'alter / les alters :' : '1. Select the alter(s):'}
                    </label>
                    
                    {savedAlters.length === 0 ? (
                      <p className="text-xs text-app-muted">{lang === 'fr' ? 'Aucun alter disponible. Créez des fiches d\'abord !' : 'No alters available. Create cards first!'}</p>
                    ) : (
                      <div className="max-h-40 overflow-y-auto border border-app-border py-1 px-2 rounded-xl bg-app-bg/50 space-y-2">
                        {[...savedAlters]
                          .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang))
                          .map(a => (
                            <label key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-app-card/65 cursor-pointer leading-tight">
                              <input
                                type="checkbox"
                                checked={switchSelectedAlterIds.includes(a.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSwitchSelectedAlterIds(prev => [...prev, a.id]);
                                  } else {
                                    setSwitchSelectedAlterIds(prev => prev.filter(did => did !== a.id));
                                  }
                                }}
                                className="w-4 h-4 rounded border-app-border text-app-accent focus:ring-0"
                              />
                              <span className="text-xs font-bold leading-none">{a.alterName}</span>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Fronting & Presence Status Grid */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-app-text" />
                      <span>{t.frontStatusLabel}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {sortedFrontStatusKeys.map((statusKey) => (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => {
                            setSwitchSelectedStatus(statusKey);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-center select-none leading-normal ${
                            switchSelectedStatus === statusKey
                              ? 'bg-app-accent border-transparent text-white shadow-sm active:scale-95'
                              : 'bg-app-bg border-app-border/45 text-app-text/75 hover:border-app-accent/30'
                          }`}
                        >
                          {t.frontStatuses[statusKey as keyof typeof t.frontStatuses]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Retro-dating input field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" />
                      <span>{t.retrodateLabel}</span>
                    </label>
                    {/* End time input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Heure de sortie (optionnel)' : 'End time (optional)'}</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={switchEndDate}
                      onChange={(e) => setSwitchEndDate(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                    <input
                      type="datetime-local"
                      value={switchRetroDate}
                      onChange={(e) => setSwitchRetroDate(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Notes fields */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted">
                      {lang === 'fr' ? 'Notes du Switch (optionnel)' : 'Switch Notes (optional)'}
                    </label>
                    <textarea
                      value={switchNotes}
                      onChange={(e) => setSwitchNotes(e.target.value)}
                      placeholder={lang === 'fr' ? 'Triggers, contexte, observations...' : 'Triggers, context, markers...'}
                      rows={3}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none text-app-text"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={switchSelectedAlterIds.length === 0}
                    className="w-full py-3.5 bg-app-accent hover:opacity-90 disabled:opacity-20 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                  >
                    {t.logSwitchButton}
                  </button>
                </form>
              </div>

              {/* Colonne droite : Mood/Spoons + Historique */}
              <div className="md:col-span-12 lg:col-span-7 space-y-6">

                {/* Bloc Énergie & Humeur */}
                <div className="p-6 bg-app-card/65 border border-app-border/30 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-app-text flex items-center gap-2">
                    <HeartPulse className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Énergie & État du moment' : 'Energy & Current State'}</span>
                  </h3>
                  <MoodSpoonWidget
                    spoons={switchSpoons}
                    onSpoonsChange={setSwitchSpoons}
                    selectedMoods={switchMoods}
                    onMoodsChange={setSwitchMoods}
                    lang={lang}
                  />
                </div>

              {/* Switches History Logging */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-app-muted flex items-center gap-2 border-b border-app-border/30 pb-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t.recentSwitches}</span>
                </h3>

                {switchLogs.length === 0 ? (
                  <div className="text-center p-12 bg-app-card/35 rounded-2xl border border-app-border/25 text-app-muted font-bold uppercase tracking-widest text-[10px] space-y-2">
                    <Timer className="w-8 h-8 mx-auto opacity-35" />
                    <span>{lang === 'fr' ? 'Aucun switch enregistré.' : 'No switch logs found.'}</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {switchLogs.map((log, index) => {
                      const nextLog = switchLogs[index - 1]; // because switchLogs is sorted descending, the next chronograph occurs "previous" in array
                      let durationStr = '';
                      if (nextLog) {
                        const seconds = Math.floor((nextLog.timestamp - log.timestamp) / 1000);
                        const hours = Math.floor(seconds / 3600);
                        const mins = Math.floor((seconds % 3600) / 60);
                        if (hours > 0) {
                          durationStr = lang === 'fr' ? `${hours}h ${mins}m` : `${hours}h ${mins}m`;
                        } else {
                          durationStr = lang === 'fr' ? `${mins} m` : `${mins} mins`;
                        }
                      }

                      return (
                        <div key={log.id} className="p-4 bg-app-card/65 rounded-xl border border-app-border/30 flex justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {log.alterIds.map(id => {
                                const alt = savedAlters.find(a => a.id === id);
                                return (
                                  <span key={id} className="px-2.5 py-1 text-xs font-extrabold bg-app-bg border border-app-border/45 rounded-lg text-app-text">
                                    {alt?.alterName || 'Anonymous'}
                                  </span>
                                );
                              })}
                              {log.status && log.status !== 'none' && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border inline-block ${
                                  log.status === 'primary' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                                  log.status === 'co_front' ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' :
                                  log.status === 'co_conscious' ? 'bg-violet-500/10 text-violet-500 border-violet-500/30' :
                                  log.status === 'passive' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                  'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                                }`}>
                                  {t.frontStatuses[log.status as keyof typeof t.frontStatuses] || log.status}
                                </span>
                              )}
                            </div>
                            
                            {log.notes && (
                              <p className="text-xs text-app-text/80 leading-relaxed bg-app-bg/40 p-2.5 rounded-lg border border-app-border/10">
                                {log.notes}
                              </p>
                            )}

                            {(log.spoons !== undefined || (log.moods && log.moods.length > 0)) && (
                              <SwitchLogMoodDisplay spoons={log.spoons} moods={log.moods} lang={lang} />
                            )}
                            
                            <div className="text-[10px] font-mono text-app-muted space-y-0.5">
                              <div>↓ {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} @ {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              {log.endTimestamp && (
                                <div>↑ {new Date(log.endTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} @ {new Date(log.endTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              )}
                            </div>
                          </div>

                          {/* Delete switch log or duration bubble */}
                          <div className="flex flex-col justify-between items-end shrink-0 select-none">
                            <button
                              onClick={() => handleDeleteSwitchLog(log.id)}
                              className="p-1 hover:bg-app-bg text-app-muted hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {durationStr && (
                              <span className="text-[9px] font-black uppercase tracking-widest bg-app-accent/15 text-app-accent px-2 py-1 rounded-full border border-app-accent/20">
                                {durationStr}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              </div>{/* fin colonne droite */}

            </div>

            {/* Diagramme continu quotidien/hebdomadaire des switchs */}
            <SwitchAnalytics switchLogs={switchLogs} savedAlters={savedAlters} lang={lang} t={t} />
          </div>
        )}

        {/* --- MAPPING VIEW --- */}
        {currentTab === 'mapping' && (
          <div className="max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <MappingPage savedAlters={savedAlters.filter(a => (a.systemId || 'main') === activeSystemId)} lang={lang} activeSystemId={activeSystemId} />
          </div>
        )}

        {/* --- JOURNAL VIEW --- */}
        {currentTab === 'journal' && (
          <div className="space-y-8 max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">{t.journalTitle}</h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.journalSubtitle}</p>
              </div>

              {/* Search bar inside Journal */}
              <div className="w-full md:w-72 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder={lang === 'fr' ? 'Chercher une note...' : 'Search notes...'}
                  className="w-full bg-app-card border border-app-border/45 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Note Editor Area */}
              <div className="lg:col-span-12 md:col-span-12 lg:col-span-4 p-6 bg-app-card/65 border border-app-border/30 rounded-2xl space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-app-text flex items-center gap-1.5 border-b border-app-border/20 pb-2">
                  <Feather className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Rédiger une Note' : 'Compose Note'}</span>
                </h3>

                <form onSubmit={handleSaveJournalEntry} className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={journalTitleInput}
                      onChange={(e) => setJournalTitleInput(e.target.value)}
                      placeholder={t.journalTitlePlaceholder}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <MarkdownEditor
                      value={journalContentInput}
                      onChange={setJournalContentInput}
                      placeholder={t.journalContentPlaceholder}
                      rows={6}
                    />
                  </div>

                  {/* Add Images/Photos */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-app-muted flex items-center gap-1.5 cursor-pointer hover:text-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.addPhotos}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleCompressAndStoreFiles(e.target.files, (urls) => {
                            setJournalImages(prev => [...prev, ...urls]);
                          });
                        }}
                      />
                    </label>

                    {/* Pre-upload previews */}
                    {journalImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-app-bg border border-app-border/30 rounded-xl">
                        {journalImages.map((img, i) => (
                          <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-app-border/40 shrink-0">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setJournalImages(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-all text-[9px]"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                  >
                    {t.createJournalEntry}
                  </button>
                </form>
              </div>

              {/* Journal Logs */}
              <div className="lg:col-span-12 md:col-span-12 lg:col-span-8 space-y-6">
                {(() => {
                  const filteredEntries = journalEntries.filter(entry => 
                    entry.title.toLowerCase().includes(journalSearch.toLowerCase()) || 
                    entry.content.toLowerCase().includes(journalSearch.toLowerCase())
                  );

                  if (filteredEntries.length === 0) {
                    return (
                      <div className="text-center p-14 bg-app-card/35 rounded-2xl border border-app-border/20 text-app-muted uppercase tracking-widest text-[10px]">
                        {t.noJournalEntries}
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[580px] overflow-y-auto pr-2">
                      {filteredEntries.map(entry => (
                        <div key={entry.id} className="p-5.5 bg-app-card/65 hover:bg-app-card/85 transition-colors border border-app-border/35 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="font-extrabold text-sm text-app-text">{entry.title}</h4>
                            <div className="text-xs leading-relaxed select-text space-y-1">
                              {renderMarkdown(entry.content)}
                            </div>
                            
                            {/* Images slider gallery grid */}
                            {entry.images && entry.images.length > 0 && (
                              <div className="grid grid-cols-3 gap-2 pt-2">
                                {entry.images.map((img, i) => (
                                  <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="relative h-16 rounded-xl overflow-hidden border border-app-border/25 block">
                                    <img src={img} className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-app-border/15">
                            <span className="text-[10px] font-mono text-app-muted">
                              {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <button
                              onClick={() => handleDeleteJournalEntry(entry.id)}
                              className="p-1 px-2.5 bg-app-bg text-[10px] font-bold text-app-muted uppercase tracking-widest border border-app-border rounded-lg hover:text-red-500 hover:border-red-500/40 transition-colors"
                            >
                              {lang === 'fr' ? 'Supprimer' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* --- PLURALKIT VIEW --- */}
        {/* --- MESSAGING VIEW --- */}
        {currentTab === 'messaging' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-app-border/30">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">{t.messagingTitle}</h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.messagingSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">

              {/* Liste des conversations */}
              <div className="md:col-span-4 space-y-2">
                <button
                  onClick={() => setShowNewConvPanel(v => !v)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-app-accent hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.messagingNewConv}
                </button>

                {/* Formulaire nouvelle conversation */}
                {showNewConvPanel && (
                  <div className="p-4 bg-app-card border border-app-border/40 rounded-2xl space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">
                      {lang === 'fr' ? 'Choisir les deux alters' : 'Choose two alters'}
                    </p>
                    <select
                      value={newConvAlter1}
                      onChange={e => setNewConvAlter1(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    >
                      <option value="">{lang === 'fr' ? 'Alter 1...' : 'Alter 1...'}</option>
                      {[...allAlters].sort((a,b) => a.alterName.localeCompare(b.alterName)).map(a => (
                        <option key={a.id} value={a.id}>{a.alterName}{a.systemId && a.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===a.systemId)?.name || a.systemId})` : ''}</option>
                      ))}
                    </select>
                    <select
                      value={newConvAlter2}
                      onChange={e => setNewConvAlter2(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    >
                      <option value="">{lang === 'fr' ? 'Alter 2...' : 'Alter 2...'}</option>
                      {[...allAlters].filter(a => a.id !== newConvAlter1).sort((a,b) => a.alterName.localeCompare(b.alterName)).map(a => (
                        <option key={a.id} value={a.id}>{a.alterName}{a.systemId && a.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===a.systemId)?.name || a.systemId})` : ''}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateConversation}
                        disabled={!newConvAlter1 || !newConvAlter2}
                        className="flex-1 py-2 bg-app-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-40 transition-all"
                      >
                        {lang === 'fr' ? 'Créer' : 'Create'}
                      </button>
                      <button onClick={() => setShowNewConvPanel(false)} className="px-3 py-2 bg-app-card border border-app-border rounded-xl text-xs font-bold hover:opacity-80">✕</button>
                    </div>
                  </div>
                )}

                {/* Liste conversations */}
                <div className="space-y-1">
                  {conversations.length === 0 && (
                    <p className="text-xs text-app-muted text-center py-6 italic">{t.messagingNoConv}</p>
                  )}
                  {[...conversations].sort((a,b) => {
                    const lastA = directMessages.filter(m => m.conversationId === a.id).at(-1)?.timestamp || a.createdAt;
                    const lastB = directMessages.filter(m => m.conversationId === b.id).at(-1)?.timestamp || b.createdAt;
                    return lastB - lastA;
                  }).map(conv => {
                    const [id1, id2] = conv.participantIds;
                    const a1 = allAlters.find(a => a.id === id1);
                    const a2 = allAlters.find(a => a.id === id2);
                    const lastMsg = directMessages.filter(m => m.conversationId === conv.id).at(-1);
                    const isActive = conv.id === activeConvId;
                    return (
                      <div key={conv.id} className="group relative">
                        <button
                          onClick={() => { setActiveConvId(conv.id); setMsgSenderId(id1); }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all ${isActive ? 'bg-app-accent/10 border border-app-accent/30' : 'hover:bg-app-card border border-transparent'}`}
                        >
                          {/* Avatars empilés */}
                          <div className="relative w-10 h-8 shrink-0">
                            {a1?.profileImage
                              ? <img src={a1.profileImage} className="absolute top-0 left-0 w-7 h-7 rounded-lg object-cover border-2 border-app-bg" />
                              : <div className="absolute top-0 left-0 w-7 h-7 rounded-lg bg-app-accent/20 border-2 border-app-bg flex items-center justify-center text-[9px] font-black">{a1?.alterName.slice(0,2).toUpperCase()}</div>
                            }
                            {a2?.profileImage
                              ? <img src={a2.profileImage} className="absolute bottom-0 right-0 w-7 h-7 rounded-lg object-cover border-2 border-app-bg" />
                              : <div className="absolute bottom-0 right-0 w-7 h-7 rounded-lg bg-app-accent/10 border-2 border-app-bg flex items-center justify-center text-[9px] font-black">{a2?.alterName.slice(0,2).toUpperCase()}</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-app-text truncate">{a1?.alterName} & {a2?.alterName}</p>
                            {lastMsg && (
                              <p className="text-[10px] text-app-muted truncate mt-0.5">
                                {getAlterDisplayName(lastMsg.senderAlterId)}: {lastMsg.text}
                              </p>
                            )}
                          </div>
                        </button>
                        {/* Supprimer conv — visible au hover */}
                        <button
                          onClick={() => { setConversations(prev => prev.filter(c => c.id !== conv.id)); setDirectMessages(prev => prev.filter(m => m.conversationId !== conv.id)); if (activeConvId === conv.id) setActiveConvId(null); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-app-bg hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-all"
                          title={lang === 'fr' ? 'Supprimer la conversation' : 'Delete conversation'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone messages */}
              <div className="md:col-span-8 flex flex-col h-[580px] bg-app-card/35 border border-app-border/30 rounded-2xl overflow-hidden shadow-sm">
                {!activeConv ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <Mail className="w-10 h-10 text-app-muted opacity-30" />
                    <p className="text-xs text-app-muted uppercase tracking-widest font-black">{t.messagingSelectConv}</p>
                  </div>
                ) : (
                  <>
                    {/* Header conversation */}
                    <div className="px-5 py-3 border-b border-app-border/20 bg-app-card/50 flex items-center gap-3">
                      {(() => {
                        const [id1, id2] = activeConv.participantIds;
                        const a1 = allAlters.find(a => a.id === id1);
                        const a2 = allAlters.find(a => a.id === id2);
                        return (
                          <>
                            <div className="relative w-10 h-8 shrink-0">
                              {a1?.profileImage ? <img src={a1.profileImage} className="absolute top-0 left-0 w-6 h-6 rounded-lg object-cover border-2 border-app-bg" /> : <div className="absolute top-0 left-0 w-6 h-6 rounded-lg bg-app-accent/20 border-2 border-app-bg flex items-center justify-center text-[8px] font-black">{a1?.alterName.slice(0,2).toUpperCase()}</div>}
                              {a2?.profileImage ? <img src={a2.profileImage} className="absolute bottom-0 right-0 w-6 h-6 rounded-lg object-cover border-2 border-app-bg" /> : <div className="absolute bottom-0 right-0 w-6 h-6 rounded-lg bg-app-accent/10 border-2 border-app-bg flex items-center justify-center text-[8px] font-black">{a2?.alterName.slice(0,2).toUpperCase()}</div>}
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider">{a1?.alterName} & {a2?.alterName}</span>
                          </>
                        );
                      })()}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
                      {activeConvMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                          <MessageSquareQuote className="w-8 h-8 text-app-muted opacity-30" />
                          <p className="text-xs text-app-muted uppercase tracking-widest font-black">{t.messagingNoMessages}</p>
                        </div>
                      )}
                      {activeConvMessages.map(msg => {
                        const isLeft = msg.senderAlterId === activeConv.participantIds[0];
                        const sender = allAlters.find(a => a.id === msg.senderAlterId);
                        return (
                          <div key={msg.id} className={`flex items-end gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                            {sender?.profileImage
                              ? <img src={sender.profileImage} className="w-7 h-7 rounded-xl object-cover shrink-0" />
                              : <div className="w-7 h-7 rounded-xl bg-app-accent/15 flex items-center justify-center text-[9px] font-black shrink-0">{sender?.alterName.slice(0,2).toUpperCase()}</div>
                            }
                            <div className={`max-w-[70%] space-y-0.5 ${isLeft ? 'items-start' : 'items-end'} flex flex-col`}>
                              <span className="text-[9px] font-black text-app-muted uppercase tracking-widest px-1">{sender?.alterName}</span>
                              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isLeft ? 'bg-app-card border border-app-border/30 text-app-text rounded-tl-sm' : 'bg-app-accent text-white rounded-tr-sm'}`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-app-muted px-1">
                                {new Date(msg.timestamp).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {/* Supprimer */}
                            <button onClick={() => setDirectMessages(prev => prev.filter(m => m.id !== msg.id))} className="opacity-0 hover:opacity-100 p-1 rounded text-app-muted hover:text-red-500 transition-all self-center">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Input */}
                    <div className="border-t border-app-border/20 bg-app-card/50 p-4 space-y-2">
                      {/* Sélecteur qui parle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-app-muted shrink-0">{lang === 'fr' ? 'Qui écrit' : 'Speaking'}:</span>
                        <select
                          value={msgSenderId}
                          onChange={e => setMsgSenderId(e.target.value)}
                          className="flex-1 bg-app-bg border border-app-border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                        >
                          {activeConv.participantIds.map(id => {
                            const a = allAlters.find(a => a.id === id);
                            return <option key={id} value={id}>{a?.alterName || id}</option>;
                          })}
                        </select>
                      </div>
                      <form onSubmit={handleSendDirectMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={msgText}
                          onChange={e => setMsgText(e.target.value)}
                          placeholder={t.messagingPlaceholder}
                          className="flex-1 bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                        />
                        <button
                          type="submit"
                          disabled={!msgText.trim()}
                          className="px-4 py-2.5 bg-app-accent hover:opacity-90 text-white rounded-xl disabled:opacity-40 transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- GROUNDING VIEW --- */}
        {currentTab === 'grounding' && (
          <div className="space-y-6 max-w-3xl mx-auto w-full animate-fade-in duration-300">
            {/* Header */}
            <div className="pb-4 border-b border-app-border/30 space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                <Anchor className="w-6 h-6 text-app-accent" />
                {lang === 'fr' ? "Techniques d'Ancrage" : 'Grounding Techniques'}
              </h2>
              <p className="text-xs text-app-muted font-bold uppercase tracking-widest">
                {lang === 'fr' ? 'En cas de dissociation ou détresse émotionnelle' : 'In case of dissociation or emotional distress'}
              </p>
            </div>

            {/* Intro */}
            <div className="p-5 bg-app-card/60 border border-app-border/30 rounded-2xl space-y-2 text-sm text-app-text/85 leading-relaxed">
              <p>
                {lang === 'fr'
                  ? 'Ces techniques visent à soulager les états de détresse émotionnelle et à lutter contre la dissociation. Elles doivent être répétées très régulièrement, notamment en dehors des crises, pour être efficaces.'
                  : 'These techniques aim to relieve emotional distress and combat dissociation. They should be practiced very regularly, including outside of crisis moments, to be effective.'}
              </p>
              <p className="text-[11px] text-app-muted italic">
                {lang === 'fr' ? 'Source : Dr Igor Thiriez — Version 3.1 (21/11/2021)' : 'Source: Dr Igor Thiriez — Version 3.1 (21/11/2021)'}
              </p>
            </div>

            {/* Sections accordéon */}
            {[
              {
                id: 'move',
                labelFr: '🚶 Si je peux me déplacer',
                labelEn: '🚶 If I can move around',
                colorClass: 'border-green-500/30 bg-green-500/5',
                accentClass: 'text-green-600 dark:text-green-400',
                items: lang === 'fr' ? [
                  "Je m'étire très fort (doigts, bras, cou, muscles du visage, dos, jambes…)",
                  'Je sautille sur place (je sens mon poids, les mouvements et les contacts avec le sol)',
                  'Je marche lentement (je compte mes pas ou je pense droite/gauche)',
                  "Je fais couler de l'eau sur mes mains / Je me projette de l'eau sur le visage",
                  'Je prends une douche / Je prends un bain',
                  "Je fais de l'exercice (ex. courir dehors ou aller nager à la piscine)",
                ] : [
                  'I stretch hard (fingers, arms, neck, facial muscles, back, legs…)',
                  'I hop in place (feeling my weight, movements and contact with the ground)',
                  'I walk slowly (counting steps or thinking left/right)',
                  'I run water over my hands / I splash water on my face',
                  'I take a shower / I take a bath',
                  'I exercise (e.g. run outside or go swimming)',
                ],
              },
              {
                id: 'body',
                labelFr: '🤜 Si je peux bouger',
                labelEn: '🤜 If I can move my body',
                colorClass: 'border-orange-500/30 bg-orange-500/5',
                accentClass: 'text-orange-600 dark:text-orange-400',
                items: lang === 'fr' ? [
                  'Je serre les poings, je les desserre et ainsi de suite (je me concentre sur les muscles)',
                  "Je me cramponne à ma chaise ou à quelque chose d'autre, aussi fort que possible",
                  "Je me tiens sur mes talons (je sens le poids qui s'applique sur le sol)",
                  'Je manipule un objet agréable au toucher (je me concentre sur les sensations)',
                  'Je regarde un objet qui a du sens pour moi (ex. une photo, un cadeau)',
                  'Je sens un objet qui dégage une odeur (ex. crème, parfum, sachet de thé)',
                ] : [
                  'I clench and unclench my fists repeatedly (focusing on the muscles)',
                  'I grip my chair or something else as hard as possible',
                  'I stand on my heels (feeling the weight pressing down)',
                  'I hold a pleasant-to-touch object (focusing on the sensations)',
                  'I look at an object that means something to me (e.g. a photo, a gift)',
                  'I smell something (e.g. cream, perfume, tea bag)',
                ],
              },
              {
                id: 'speak',
                labelFr: '🗣️ Si je peux parler (sinon intérieurement)',
                labelEn: '🗣️ If I can speak (or internally)',
                colorClass: 'border-blue-500/30 bg-blue-500/5',
                accentClass: 'text-blue-600 dark:text-blue-400',
                items: lang === 'fr' ? [
                  'Je nomme 5 choses que je peux voir',
                  'Je nomme 4 choses que je peux entendre',
                  'Je nomme 3 choses que je peux toucher',
                  'Je nomme 2 choses que je peux sentir',
                  'Je nomme 1 chose que je peux goûter',
                  'Je me dis des choses gentilles et encourageantes (ex. ça va passer)',
                  'Je décris en détails 3 objets autour de moi',
                  'Je décris de façon détaillée une de mes activités quotidiennes',
                  'Je lis quelque chose que je trouve autour de moi (ex. livre, affiche, panneau)',
                  "Je chante ou je récite quelque chose d'inspirant ou de réconfortant",
                ] : [
                  'I name 5 things I can see',
                  'I name 4 things I can hear',
                  'I name 3 things I can touch',
                  'I name 2 things I can smell',
                  'I name 1 thing I can taste',
                  'I tell myself kind, encouraging things (e.g. this will pass)',
                  'I describe in detail 3 objects around me',
                  'I describe in detail one of my daily activities',
                  'I read something nearby (e.g. a book, poster, sign)',
                  'I sing or recite something inspiring or comforting',
                ],
              },
              {
                id: 'feel',
                labelFr: '🌬️ Si je peux sentir / ressentir',
                labelEn: '🌬️ If I can feel / sense',
                colorClass: 'border-teal-500/30 bg-teal-500/5',
                accentClass: 'text-teal-600 dark:text-teal-400',
                items: lang === 'fr' ? [
                  'Je sens les contacts du souffle de ma respiration (je respire lentement)',
                  'Je sens les contacts de mon corps avec mes vêtements',
                ] : [
                  'I feel the touch of my breath (I breathe slowly)',
                  'I feel my body in contact with my clothes',
                ],
              },
              {
                id: 'orient',
                labelFr: '🧭 Si je peux m'orienter',
                labelEn: '🧭 If I can orient myself',
                colorClass: 'border-yellow-500/30 bg-yellow-500/5',
                accentClass: 'text-yellow-600 dark:text-yellow-400',
                items: lang === 'fr' ? [
                  'Je nomme le lieu où je me trouve',
                  "J'annonce mon identité",
                  "J'annonce l'heure et la date",
                  'Je nomme le président de la République',
                ] : [
                  'I name the place where I am',
                  'I state my identity',
                  'I state the time and date',
                  'I name the head of state',
                ],
              },
              {
                id: 'think',
                labelFr: '🧠 Si je peux penser',
                labelEn: '🧠 If I can think',
                colorClass: 'border-purple-500/30 bg-purple-500/5',
                accentClass: 'text-purple-600 dark:text-purple-400',
                items: lang === 'fr' ? [
                  "Je m'imagine protégé·e du mal (par des murs, des gardes ou un pouvoir)",
                  'Je joue au jeu des catégories (ex. je cite des noms de pays qui débutent par « A »)',
                  "Je m'imagine dans un endroit sûr (réel ou imaginaire)",
                  "Je prévois de m'accorder une récompense une fois que ce sera passé",
                ] : [
                  'I imagine myself protected from harm (by walls, guards or a power)',
                  'I play a category game (e.g. I name countries starting with "A")',
                  'I imagine myself in a safe place (real or imaginary)',
                  'I plan a reward for myself once this passes',
                ],
              },
              {
                id: 'remember',
                labelFr: '📖 Si je peux me souvenir',
                labelEn: '📖 If I can remember',
                colorClass: 'border-rose-500/30 bg-rose-500/5',
                accentClass: 'text-rose-600 dark:text-rose-400',
                items: lang === 'fr' ? [
                  'Je décris de façon détaillée un souvenir neutre ou agréable',
                  "Je progresse jusqu'au présent (ex. je décris mes anniversaires successifs)",
                  'Je décris ce que je dois faire dans les heures/jours qui viennent',
                  'Je pense aux favoris de ma vie (ex. choses, activités, gens, principes et valeurs)',
                ] : [
                  'I describe in detail a neutral or pleasant memory',
                  'I progress up to the present (e.g. I describe successive birthdays)',
                  'I describe what I need to do in the coming hours/days',
                  'I think of my life favorites (e.g. things, activities, people, principles and values)',
                ],
              },
            ].map(section => {
              const isOpen = groundingOpenSections.includes(section.id);
              return (
                <div key={section.id} className={`border rounded-2xl overflow-hidden transition-all ${section.colorClass}`}>
                  <button
                    onClick={() => toggleGroundingSection(section.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-black uppercase tracking-wide ${section.accentClass}`}>
                      {lang === 'fr' ? section.labelFr : section.labelEn}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform text-app-muted ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <ul className="px-5 pb-5 space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-app-text/85 leading-relaxed">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${section.accentClass} bg-current`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Footer attribution */}
            <p className="text-center text-[11px] text-app-muted italic pb-4">
              {lang === 'fr'
                  ? "Contenu reproduit avec respect du travail du Dr Igor Thiriez (v3.1, 2021). Haven Space n'est pas un outil médical."
                : 'Content reproduced with respect for the work of Dr Igor Thiriez (v3.1, 2021). Haven Space is not a medical tool.'}
            </p>
          </div>
        )}

        {currentTab === 'pluralkit' && (
          <div className="space-y-8 max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider">{t.pkTitle}</h2>
              <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">{t.pkSubtitle}</p>
            </div>

            {/* Notifications / Error/Success Statuses */}
            {pkError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{pkError}</span>
              </div>
            )}
            {pkSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 animate-bounce" />
                <span>{pkSuccess}</span>
              </div>
            )}

            {/* Setup & Connection Box */}
            {!pkSystem ? (
              <div className="p-6 bg-app-card border border-app-border rounded-2xl md:p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm uppercase tracking-widest text-app-text">
                    {lang === 'fr' ? 'Configuration de la connexion API' : 'API Connection Configuration'}
                  </h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    {lang === 'fr' 
                      ? "Pour synchroniser vos alters et automatiser leurs fiches, saisissez votre jeton secret d'API PluralKit. Vous pouvez l'obtenir sur Discord en envoyant la commande pk;token au bot PluralKit." 
                      : 'To synchronize and configure your alters, enter your secret PluralKit API token. You can retrieve it on Discord by typing the pk;token command to the PluralKit bot.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-app-muted">{t.pkTokenLabel}</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="password"
                      value={pkToken}
                      onChange={(e) => setPkToken(e.target.value)}
                      placeholder={t.pkTokenPlaceholder}
                      className="flex-1 bg-app-bg px-4 py-3 border border-app-border rounded-xl text-xs font-semibold focus:outline-none focus:border-app-accent text-app-text"
                    />
                    <button
                      onClick={() => fetchPluralKitSystem(pkToken)}
                      disabled={pkLoading || !pkToken}
                      className="px-6 py-3 bg-app-accent hover:opacity-90 disabled:opacity-50 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {pkLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{lang === 'fr' ? 'Connexion...' : 'Connecting...'}</span>
                        </>
                      ) : (
                        <>
                          <Link className="w-3.5 h-3.5" />
                          <span>{t.pkConnectBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-app-card border border-app-border rounded-2xl md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-app-accent/10 border border-app-accent/25 flex items-center justify-center text-app-accent text-sm font-black uppercase">
                      {pkSystem.name ? pkSystem.name.substring(0, 2) : 'PK'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-app-text">{pkSystem.name || 'PluralKit System'}</h3>
                      <p className="text-[10px] text-app-muted font-mono">ID: {pkSystem.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectPk}
                    className="px-4.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {t.pkDisconnectBtn}
                  </button>
                </div>

                {pkSystem.description && (
                  <p className="text-xs text-app-text/90 italic leading-relaxed whitespace-pre-wrap">
                    "{pkSystem.description}"
                  </p>
                )}

                <div className="pt-4 border-t border-app-border/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-app-muted tracking-wider">{lang === 'fr' ? 'Actions de synchronisation' : 'Sync Actions'}</p>
                    <p className="text-[10px] text-app-muted leading-relaxed mt-1">
                      {lang === 'fr' 
                        ? "En cliquant ci-dessous, tous vos membres PluralKit seront sauvegardés comme fiches d'alters modifiables dans l'application." 
                        : 'By syncing, all of your PluralKit members will be saved as fully editable alter profiles in this application.'}
                    </p>
                  </div>
                  <button
                    onClick={syncPluralKitToLocal}
                    className="w-full sm:w-auto px-6 py-3 bg-app-text text-app-bg hover:opacity-90 font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{t.pkSyncAllBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* PluralKit Members Cards Roster */}
            {pkSystem && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-app-border/20 pb-3">
                  <h3 className="font-black text-sm uppercase tracking-widest text-app-text">
                    {lang === 'fr' ? 'Membres du Système' : 'System Members'} ({pkMembers.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {pkMembers.map((member) => {
                    const localAlter = savedAlters.find(a => a.pkId === member.id || a.alterName.toLowerCase() === member.name.toLowerCase());
                    return (
                      <div key={member.id} className="p-5.5 bg-app-card/65 rounded-2xl border border-app-border/35 hover:border-app-accent/20 transition-all flex flex-col justify-between space-y-4 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden border border-app-border flex-shrink-0 bg-app-bg aspect-square">
                              {member.avatar_url ? (
                                <img src={member.avatar_url} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-app-accent/5 flex items-center justify-center font-bold text-xs text-app-text">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-extrabold text-sm text-app-text truncate">{member.name}</h4>
                              {member.pronouns && (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-app-bg border border-app-border text-[9px] font-bold text-app-muted mt-1 uppercase tracking-wider">
                                  {member.pronouns}
                                </span>
                              )}
                            </div>
                          </div>

                          {member.description && (
                            <p className="text-xs text-app-muted line-clamp-3 select-text leading-relaxed">
                              {member.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3.5 border-t border-app-border/15 flex flex-col gap-2">
                          {localAlter ? (
                            <>
                              <div className="flex items-center justify-between text-[10px] text-green-500 font-bold uppercase tracking-wider bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/15">
                                <span className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {lang === 'fr' ? 'Synchronisé' : 'Synchronized'}
                                </span>
                                <span className="font-mono text-[9px] opacity-75">PK: {member.id}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    executeLoadAlter(localAlter);
                                    setCurrentTab('creator');
                                    alert(lang === 'fr' ? 'Alter chargé dans le créateur !' : 'Alter loaded into card creator!');
                                  }}
                                  className="flex-1 py-3 px-3 bg-app-accent hover:opacity-90 text-[10px] font-black uppercase tracking-widest text-white rounded-lg transition-all"
                                >
                                  {lang === 'fr' ? 'Modifier la Fiche' : 'Edit Profile'}
                                </button>
                                
                                <button
                                  onClick={() => exportAlterToPluralKit(localAlter)}
                                  disabled={isExportingPkId === member.id}
                                  className="py-3 px-3 bg-app-bg border border-app-border hover:border-app-accent/30 text-[10px] font-black uppercase tracking-widest text-app-text rounded-lg transition-all flex items-center justify-center"
                                  title={lang === 'fr' ? "Remplacer les données de PluralKit par la fiche locale" : "Overwrite PluralKit data with this local card"}
                                >
                                  {isExportingPkId === member.id ? (
                                    <div className="w-3 h-3 border border-app-text border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Upload className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSavedAlters(prev => {
                                  const alterData: SavedAlter = {
                                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                                    pkId: member.id,
                                    alterName: member.name,
                                    selectedRoles: [],
                                    selectedGenders: [],
                                    selectedSexualities: [],
                                    traitDecorations: [],
                                    patternLayers: [],
                                    decorations: [],
                                    customRoleColors: {},
                                    customGenderColors: {},
                                    customSexualityColors: {},
                                    theme: Theme.LIGHT,
                                    profileImage: member.avatar_url || '',
                                    description: member.description || '',
                                    internalNotes: member.pronouns ? `${lang === 'fr' ? 'Pronoms' : 'Pronouns'}: ${member.pronouns}` : '',
                                    frontStatus: 'none',
                                  };
                                  return [...prev, alterData];
                                });
                                setPkSuccess(lang === 'fr' ? `Membre ${member.name} importé avec succès !` : `Member ${member.name} successfully imported!`);
                              }}
                              className="w-full py-2 bg-app-bg border border-app-border hover:border-app-accent/30 text-[10px] font-black uppercase tracking-widest text-app-text rounded-lg transition-all"
                            >
                              {lang === 'fr' ? 'Importer comme Alter' : 'Import as Alter'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider or Header for Local JSON backup */}
            <div className="border-t border-app-border/40 pt-10 space-y-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-app-text" />
                  {lang === 'fr' ? 'Synchronisation par Fichier JSON (Sans Compte)' : 'JSON File Synchronization (Accountless)'}
                </h3>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">
                  {lang === 'fr' 
                    ? 'Sauvegardez l\'intégralité de vos données dans un fichier local pour les transférer sur un autre appareil.' 
                    : 'Save all your application data into a local file to restore or transfer to another device.'}
                </p>
              </div>

              {/* Status Notifications of JSON Synchronization */}
              {jsonError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4" />
                  <span>{jsonError}</span>
                </div>
              )}
              {jsonSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>{jsonSuccess}</span>
                </div>
              )}

              {/* Grid 2 Columns: Export on Left, Import on Right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Save details / Export Box */}
                <div className="p-6 bg-app-card border border-app-border rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-app-text">
                      <Download className="w-4.5 h-4.5" />
                      <h4 className="font-extrabold text-xs uppercase tracking-widest text-app-text">
                        {lang === 'fr' ? 'Sauvegarder et Exporter' : 'Backup & Export'}
                      </h4>
                    </div>
                    <p className="text-xs text-app-muted leading-relaxed">
                      {lang === 'fr'
                        ? 'Téléchargez une sauvegarde chiffrée en local de toutes vos fiches d\'alters, enregistrements de switchs, messages de chat et journal de bord.'
                        : 'Download a total offline backup containing all your alter cards, switch registration logs, inner chat history, and journals info.'}
                    </p>
                    
                    {/* Quick Stats of local database */}
                    <div className="p-3.5 bg-app-bg/50 border border-app-border/40 rounded-xl space-y-1.5 font-mono text-[10px] text-app-muted">
                      <div><strong className="text-app-text">{lang === 'fr' ? 'Système actuel :' : 'Current System :'}</strong> {mainSystemName}</div>
                      <div><strong className="text-app-text">{savedAlters.length}</strong> {lang === 'fr' ? 'alters' : 'alters'}</div>
                      <div><strong className="text-app-text">{subsystems.length}</strong> {lang === 'fr' ? 'sous-systèmes' : 'subsystems'}</div>
                      <div><strong className="text-app-text">{chatMessages.length}</strong> {lang === 'fr' ? 'messages de discussion' : 'chats'}</div>
                      <div><strong className="text-app-text">{switchLogs.length}</strong> {lang === 'fr' ? 'entrées de switch' : 'switches'}</div>
                      <div><strong className="text-app-text">{journalEntries.length}</strong> {lang === 'fr' ? 'notes de journal' : 'journals'}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="w-full px-5 py-3 bg-app-accent hover:opacity-90 font-extrabold uppercase text-xs tracking-widest text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-none"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Exporter en JSON' : 'Export JSON Backup'}</span>
                  </button>
                </div>

                {/* Import Box */}
                <div className="p-6 bg-app-card border border-app-border rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-app-text">
                      <Upload className="w-4.5 h-4.5" />
                      <h4 className="font-extrabold text-xs uppercase tracking-widest text-app-text">
                        {lang === 'fr' ? 'Restaurer ou Importer' : 'Restore & Import'}
                      </h4>
                    </div>
                    <p className="text-xs text-app-muted leading-relaxed">
                      {lang === 'fr'
                        ? 'Glissez-déposez ou sélectionnez un fichier de sauvegarde (.json) pour importer vos données.'
                        : 'Drag-and-drop or click to upload a backup file (.json) to import elements.'}
                    </p>

                    {/* Drag and Drop Zone according to Usability Guidelines */}
                    <div
                      onDragOver={handleJSONDragOver}
                      onDragLeave={handleJSONDragLeave}
                      onDrop={handleJSONDrop}
                      className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        jsonDragOver
                          ? 'border-app-accent bg-app-accent/10 scale-[0.99]'
                          : 'border-app-border hover:border-app-accent/30 bg-app-bg/20'
                      }`}
                      onClick={() => document.getElementById('json-file-input')?.click()}
                    >
                      <input
                        id="json-file-input"
                        type="file"
                        accept="application/json"
                        onChange={handleJSONFileChange}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-app-muted mb-2.5" />
                      <div className="text-xs font-bold text-app-text">
                        {lang === 'fr' ? 'Sélectionner ou glisser le fichier' : 'Click or drag file here'}
                      </div>
                      <div className="text-[10px] text-app-muted mt-1 uppercase tracking-wider font-extrabold">
                        JSON BACKUP (*.json)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Preview Information Card */}
              {importPreview && (
                <div className="mt-8 p-6 bg-app-accent/5 border border-app-accent/20 rounded-2xl space-y-6 animate-fade-in shadow-inner">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-app-border/20 pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center text-app-accent border border-app-accent/15">
                        <FileJson className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-app-text">{lang === 'fr' ? 'Aperçu de la Sauvegarde' : 'Backup Preview'}</h4>
                        <p className="text-[10px] font-mono text-app-muted">{importPreview.fileName}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-app-accent/15 text-app-accent text-[9px] font-black uppercase tracking-wider rounded-md border border-app-accent/20">
                      {lang === 'fr' ? 'Fichier valide chargé' : 'Valid backup loaded'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang === 'fr' ? 'Contenu compatible détecté :' : 'Detected compatible content :'}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <div className="p-3 bg-app-card border border-app-border/60 rounded-xl text-center space-y-0.5 shadow-sm">
                        <div className="text-sm font-black text-app-text">{importPreview.altersCount}</div>
                        <div className="text-[9px] text-app-muted uppercase font-bold tracking-wider">{lang === 'fr' ? 'Alters' : 'Alters'}</div>
                      </div>
                      <div className="p-3 bg-app-card border border-app-border/60 rounded-xl text-center space-y-0.5 shadow-sm">
                        <div className="text-sm font-black text-app-text">{importPreview.subsystemsCount}</div>
                        <div className="text-[9px] text-app-muted uppercase font-bold tracking-wider">{lang === 'fr' ? 'Sous-systèmes' : 'Subsystems'}</div>
                      </div>
                      <div className="p-3 bg-app-card border border-app-border/60 rounded-xl text-center space-y-0.5 shadow-sm">
                        <div className="text-sm font-black text-app-text">{importPreview.chatsCount}</div>
                        <div className="text-[9px] text-app-muted uppercase font-bold tracking-wider">{lang === 'fr' ? 'Mini-chats' : 'Chats'}</div>
                      </div>
                      <div className="p-3 bg-app-card border border-app-border/60 rounded-xl text-center space-y-0.5 shadow-sm">
                        <div className="text-sm font-black text-app-text">{importPreview.switchesCount}</div>
                        <div className="text-[9px] text-app-muted uppercase font-bold tracking-wider">{lang === 'fr' ? 'Switchs' : 'Switches'}</div>
                      </div>
                      <div className="p-3 bg-app-card border border-app-border/60 rounded-xl text-center space-y-0.5 shadow-sm col-span-2 sm:col-span-1">
                        <div className="text-sm font-black text-app-text">{importPreview.journalsCount}</div>
                        <div className="text-[9px] text-app-muted uppercase font-bold tracking-wider">{lang === 'fr' ? 'Notes Journal' : 'Journal'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-app-border/15 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-1 max-w-lg">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang === 'fr' ? 'Méthode de Restauration' : 'Restoration Method'}</h5>
                      <p className="text-[11px] text-app-text/90 leading-relaxed">
                        {lang === 'fr'
                          ? 'Choisissez "Écraser" pour vider vos données locales actuelles et utiliser uniquement la sauvegarde. Choisissez "Fusionner" pour combiner de manière sécurisée sans aucune perte.'
                          : 'Choose "Overwrite" to discard existing local data and load the backup exclusively. Choose "Merge" to combine items securely.'}
                      </p>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={handleApplyImportMerge}
                        className="flex-1 lg:flex-none px-5 py-3 bg-app-bg border border-app-border hover:border-app-accent/30 text-[10px] font-black uppercase tracking-widest text-app-text rounded-xl transition-all cursor-pointer"
                      >
                        {lang === 'fr' ? 'Fusionner les données' : 'Merge Data'}
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyImportOverwrite}
                        className="flex-1 lg:flex-none px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none"
                      >
                        {lang === 'fr' ? 'Écraser et Remplacer' : 'Overwrite Current'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-app-border py-12 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-app-muted">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.copyright}</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-app-muted">
            <button
              onClick={() => {
                setActiveLegalPage('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-app-text transition-colors border-none bg-transparent cursor-pointer font-bold uppercase tracking-widest text-xs"
            >
              {t.privacy}
            </button>
            <button
              onClick={() => {
                setActiveLegalPage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-app-text transition-colors border-none bg-transparent cursor-pointer font-bold uppercase tracking-widest text-xs"
            >
              {t.about}
            </button>
            <button
              onClick={() => {
                setActiveLegalPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-app-text transition-colors border-none bg-transparent cursor-pointer font-bold uppercase tracking-widest text-xs"
            >
              {t.contact}
            </button>
          </div>
        </div>
      </footer>
      {/* Save Conflict Resolution Modal */}
      <AnimatePresence>
        {saveConflictAlter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-lg rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-wider text-app-text">
                  {t.saveConflictTitle}
                </h3>
                <p className="text-sm text-app-muted leading-relaxed">
                  {t.saveConflictDesc.replace('{name}', saveConflictAlter.alterName)}
                </p>
              </div>

              {/* Quick Preview card details */}
              <div className="p-4 bg-app-bg/55 border border-app-border/40 rounded-2xl flex items-center gap-4 text-left">
                {saveConflictAlter.profileImage ? (
                  <img src={saveConflictAlter.profileImage} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-app-border/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-app-accent/10 border border-app-accent/20 text-app-accent font-black text-sm flex items-center justify-center shrink-0">
                    {saveConflictAlter.alterName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-app-text truncate">{saveConflictAlter.alterName}</div>
                  <div className="text-xs text-app-muted truncate">
                    {saveConflictAlter.description || (lang === 'fr' ? 'Pas de description.' : 'No description.')}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleSaveAlter(saveConflictAlter.id, false);
                    alert(
                      lang === 'fr' 
                        ? `Fiche mise à jour et rangée sous l'alter « ${saveConflictAlter.alterName} » !` 
                        : `Card successfully updated and stored under alter "${saveConflictAlter.alterName}"!`
                    );
                  }}
                  className="w-full py-3.5 bg-app-accent hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {t.saveOptionOverwrite}
                </button>
                
                <button
                  onClick={() => {
                    handleSaveAlter(null, true);
                    alert(lang === 'fr' ? 'Fiche enregistrée en tant que nouvel alter !' : 'Saved as a new separate alter!');
                  }}
                  className="w-full py-3.5 bg-app-bg border border-app-border hover:border-app-accent/30 text-app-text font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  {t.saveOptionDuplicate}
                </button>

                <button
                  onClick={() => setSaveConflictAlter(null)}
                  className="w-full py-3.5 bg-transparent hover:bg-app-bg/10 text-app-muted hover:text-app-text text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  {t.saveOptionCancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Alter Custom Confirmation Modal */}
        {deleteConfirmAlterId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Supprimer cet Alter ?' : 'Delete this Alter?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Êtes-vous sûr de vouloir supprimer définitivement cette fiche ? Cette action est irréversible.' 
                    : 'Are you sure you want to permanently delete this card? This action cannot be undone.'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const alter = savedAlters.find(a => a.id === deleteConfirmAlterId);
                    executeDeleteAlter(deleteConfirmAlterId);
                    alert(lang === 'fr' ? `L'alter « ${alter?.alterName || ''} » a été supprimé.` : `The alter "${alter?.alterName || ''}" has been deleted.`);
                  }}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmAlterId(null)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Subsystem Custom Confirmation Modal */}
        {deleteConfirmSubsystemId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Supprimer le sous-système ?' : 'Delete Subsystem?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Voulez-vous supprimer ce sous-système ? Les sous-systèmes enfants et les alters associés seront rattachés au système parent supérieur.' 
                    : 'Do you want to delete this subsystem? Child subsystems and associated alters will be attached to the parent system above.'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => executeDeleteSubsystem(deleteConfirmSubsystemId)}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmSubsystemId(null)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Load Alter Custom Confirmation Modal */}
        {loadConfirmAlter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent mx-auto">
                <Download className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Charger cette fiche ?' : 'Load this card?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Charger cette fiche écrasera les modifications en cours dans le créateur. Continuer ?' 
                    : 'Loading this card will overwrite any unsaved modifications in the creator. Continue?'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => executeLoadAlter(loadConfirmAlter)}
                  className="w-full py-3 bg-app-accent hover:opacity-90 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Charger' : 'Load'}
                </button>
                <button
                  onClick={() => setLoadConfirmAlter(null)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Switch Log Custom Confirmation Modal */}
        {deleteConfirmSwitchLogId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Supprimer ce switch ?' : 'Delete Switch Log?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Êtes-vous sûr de vouloir supprimer définitivement ce switch enregistré ? Cette action est irréversible.' 
                    : 'Are you sure you want to permanently delete this logged switch? This action cannot be undone.'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => executeDeleteSwitchLog(deleteConfirmSwitchLogId)}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmSwitchLogId(null)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Journal Entry Custom Confirmation Modal */}
        {deleteConfirmJournalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Supprimer cette note ?' : 'Delete Note?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Êtes-vous sûr de vouloir supprimer définitivement cette note de journal ? Cette action est irréversible.' 
                    : 'Are you sure you want to permanently delete this journal note? This action cannot be undone.'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => executeDeleteJournalEntry(deleteConfirmJournalId)}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmJournalId(null)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Clear Chat Custom Confirmation Modal */}
        {deleteConfirmClearChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                  {lang === 'fr' ? 'Effacer la conversation ?' : 'Clear Chat?'}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {lang === 'fr' 
                    ? 'Êtes-vous sûr de vouloir vider l\'historique des messages ? Cette action est irréversible.' 
                    : 'Are you sure you want to clear the entire chat history? This action cannot be undone.'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={executeClearChat}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Effacer' : 'Clear'}
                </button>
                <button
                  onClick={() => setDeleteConfirmClearChat(false)}
                  className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
