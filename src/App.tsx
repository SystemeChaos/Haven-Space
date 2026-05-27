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
} from 'lucide-react';
import { AlterRole, Gender, Sexuality, Trait, PersonalityTrait, Disorder, ROLE_CONFIGS, GENDER_COLORS, SEXUALITY_COLORS, ShapeType, PatternType, PatternLayer, Decoration, GENDER_CATEGORIES, SEXUALITY_CATEGORIES, TraitDecoration, Theme } from './types';
import { translations } from './translations';
import { jsPDF } from 'jspdf';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [font, setFont] = useState<string>('font-sans');
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

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
  });
  const [activeRolePatternSettings, setActiveRolePatternSettings] = useState<AlterRole | null>(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const t = translations[lang];

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

  useEffect(() => {
    const root = document.documentElement;
    const styles = getThemeStyles();
    
    // Reset properties first to ensure clean state
    ['--color-app-bg', '--color-app-text', '--color-app-card', '--color-app-border', '--color-app-accent', '--color-app-muted'].forEach(prop => {
      root.style.removeProperty(prop);
    });

    if (theme !== Theme.LIGHT) {
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(key, value as string);
      });
    }
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
  }, [selectedRoles, selectedGenders, selectedSexualities, traitDecorations, patternLayers, decorations, alterName, customRoleColors, customGenderColors, customSexualityColors, theme, history, historyIndex, profileImage, description, internalNotes]);

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
    try {
      const dataUrl = await toPng(flagRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Higher quality
        backgroundColor: '#FFFFFF',
      });
      
      const link = document.createElement('a');
      link.download = `alter-card-${alterName || 'creator'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsDownloading(false);
    }
  }, [flagRef, alterName]);

  const handleDownloadPdf = useCallback(async () => {
    if (flagRef.current === null) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(flagRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // Crisp high-res export
        backgroundColor: '#FFFFFF',
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfPageHeight = 297;
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = pdfWidth / imgWidth;
      const computedPdfHeight = imgHeight * ratio;
      
      let heightLeft = computedPdfHeight;
      let position = 0;
      
      // Draw first page
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, computedPdfHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;
      
      // If the card is taller than one A4 page, slice it vertically across subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - computedPdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, computedPdfHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
      }
      
      pdf.save(`alter-card-${alterName || 'creator'}.pdf`);
    } catch (err) {
      console.error('oops, failed to generate PDF!', err);
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
    content += `Generated by AlterProfile Creator © 2026`;

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
    if (desc.length <= 1000) {
      setDescription(desc);
      setTimeout(saveToHistory, 0);
    }
  };

  const updateInternalNotes = (notes: string) => {
    if (notes.length <= 1000) {
      setInternalNotes(notes);
      setTimeout(saveToHistory, 0);
    }
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
          '--color-app-bg': '#3f424d',
          '--color-app-card': '#2a2d36',
          '--color-app-text': '#e6d8ba',
          '--color-app-muted': 'rgba(230, 216, 186, 0.6)',
          '--color-app-border': 'rgba(230, 216, 186, 0.2)',
          '--color-app-accent': '#b16b5e',
        } as React.CSSProperties;
      case Theme.DID_FLAG:
        return {
          '--color-app-bg': '#f9ad59',
          '--color-app-card': '#ffffff',
          '--color-app-text': '#1c1c1c',
          '--color-app-muted': 'rgba(28, 28, 28, 0.6)',
          '--color-app-border': 'rgba(28, 28, 28, 0.1)',
          '--color-app-accent': '#ffffff',
        } as React.CSSProperties;
      case Theme.PASTEL:
        return {
          '--color-app-bg': '#BADFDB',
          '--color-app-card': 'rgba(255, 255, 255, 0.4)',
          '--color-app-text': '#EA7B7B',
          '--color-app-muted': 'rgba(234, 123, 123, 0.6)',
          '--color-app-border': 'rgba(234, 123, 123, 0.1)',
          '--color-app-accent': '#8D77AB',
        } as React.CSSProperties;
      case Theme.SPRING:
        return {
          '--color-app-bg': '#FDAAAA',
          '--color-app-card': 'rgba(255, 255, 255, 0.4)',
          '--color-app-text': '#064232',
          '--color-app-muted': 'rgba(6, 66, 50, 0.6)',
          '--color-app-border': 'rgba(6, 66, 50, 0.1)',
          '--color-app-accent': '#D70654',
        } as React.CSSProperties;
      case Theme.SUMMER:
        return {
          '--color-app-bg': '#FFF085',
          '--color-app-card': 'rgba(255, 255, 255, 0.4)',
          '--color-app-text': '#CF4B00',
          '--color-app-muted': 'rgba(207, 75, 0, 0.6)',
          '--color-app-border': 'rgba(207, 75, 0, 0.1)',
          '--color-app-accent': '#7B542F',
        } as React.CSSProperties;
      case Theme.AUTUMN:
        return {
          '--color-app-bg': '#E2B59A',
          '--color-app-card': 'rgba(255, 255, 255, 0.4)',
          '--color-app-text': '#D67D3E',
          '--color-app-muted': 'rgba(214, 125, 62, 0.6)',
          '--color-app-border': 'rgba(214, 125, 62, 0.1)',
          '--color-app-accent': '#521C0D',
        } as React.CSSProperties;
      case Theme.WINTER:
        return {
          '--color-app-bg': '#79D7BE',
          '--color-app-card': 'rgba(255, 255, 255, 0.4)',
          '--color-app-text': '#2E5077',
          '--color-app-muted': 'rgba(46, 80, 119, 0.6)',
          '--color-app-border': 'rgba(46, 80, 119, 0.1)',
          '--color-app-accent': '#305669',
        } as React.CSSProperties;
      default:
        return {};
    }
  };

  return (
    <div className={`min-h-screen bg-app-bg text-app-text ${font} selection:bg-app-accent selection:text-app-bg transition-colors duration-300`}>
      {/* Header */}
      <header className="border-b border-app-border py-6 px-8 bg-app-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-app-text rounded-full flex items-center justify-center text-app-bg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
              <p className="text-xs text-app-muted uppercase tracking-widest font-medium">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-app-card p-1 rounded-full border border-app-border">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-app-bg rounded-full transition-all disabled:opacity-20"
                title={t.undo}
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-app-bg rounded-full transition-all disabled:opacity-20"
                title={t.redo}
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <div className="relative">
                <button 
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-1 text-app-text/60 hover:text-app-text transition-opacity"
                >
                  {t.resources}
                  <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {resourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-app-card rounded-xl shadow-xl border border-app-border overflow-hidden py-2"
                    >
                      <a 
                        href="https://www.partielles.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-2 hover:bg-app-bg transition-colors"
                      >
                        Partielles
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                      <a 
                        href="https://epsytera.fr/troubles-dissociatifs/le-trouble-dissociatif-de-lidentite-tdi/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-2 hover:bg-app-bg transition-colors"
                      >
                        Epsytera
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 px-3 py-1.5 bg-app-card border border-app-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-app-bg transition-colors w-full justify-center"
              >
                <Languages className="w-3 h-3" />
                {lang === 'fr' ? 'English' : 'Français'}
              </button>

              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 bg-app-card border border-app-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-app-bg transition-colors w-full justify-center"
                >
                  <Type className="w-3 h-3" />
                  {t.typography}
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-app-card border border-app-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {fonts.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFont(f.value)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-medium hover:bg-app-bg transition-colors ${font === f.value ? 'text-app-accent bg-app-bg' : 'text-app-text/60'}`}
                      >
                        <span className={f.value}>{f.name}</span>
                        {font === f.value && <Circle className="w-2 h-2 fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 bg-app-card border border-app-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-app-bg transition-colors w-full justify-center"
                >
                  <Palette className="w-3 h-3" />
                  {t.theme}
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-app-card border border-app-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="py-2">
                    {(Object.keys(Theme) as Array<keyof typeof Theme>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setTheme(Theme[key])}
                        className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-app-bg transition-colors ${theme === Theme[key] ? 'text-app-accent bg-app-bg' : 'text-app-text/60'}`}
                      >
                        <span>{t.themes[Theme[key]]}</span>
                        {theme === Theme[key] && <Circle className="w-2 h-2 fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Name Input */}
          <section className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-2">
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
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-2">
                <FileText className="w-3 h-3" /> {t.descriptionTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {description.length}/1000
              </span>
            </div>
            <textarea 
              value={description}
              onChange={(e) => updateDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              maxLength={1000}
              className="w-full bg-app-card border border-app-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all text-sm leading-relaxed resize-none font-sans"
            />
          </section>

          {/* Internal Notes Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-2">
                <Lock className="w-3 h-3" /> {t.internalNotesTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {internalNotes.length}/1000
              </span>
            </div>
            <textarea 
              value={internalNotes}
              onChange={(e) => updateInternalNotes(e.target.value)}
              placeholder={t.internalNotesPlaceholder}
              rows={4}
              maxLength={1000}
              className="w-full bg-app-card border border-app-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all text-sm leading-relaxed resize-none font-mono text-app-text/90"
            />
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
                  isDownloading ? 'h-auto min-h-[900px] overflow-visible' : 'aspect-[2/3] overflow-hidden'
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
                <div className="flex-1 p-5 flex flex-col justify-between relative z-10 overflow-hidden bg-app-card/20 backdrop-blur-sm">
                  <div className="h-full flex flex-col justify-between">
                    <div className={`flex-1 pr-1 ${
                      isDownloading ? 'max-h-none overflow-visible' : 'max-h-[380px] overflow-y-auto'
                    } space-y-4`}>
                      
                      {/* Traits & Disorders Section */}
                      {traitDecorations.length > 0 && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-app-accent animate-pulse">
                            {lang === 'fr' ? 'Traits & Troubles' : 'Traits & Conditions'}
                          </div>

                          {/* Personality Traits Sub-section */}
                          {traitDecorations.filter(td => !Object.values(Disorder).includes(td.trait as Disorder)).length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[8px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono">
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
                                          {React.cloneElement(getTraitIcon(td.trait) as React.ReactElement, { className: "w-3 h-3" })}
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
                              <div className="text-[8px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono">
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
                                          {React.cloneElement(getTraitIcon(td.trait) as React.ReactElement, { className: "w-3 h-3" })}
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
                          <div className={`px-4 py-3 bg-app-card/45 backdrop-blur-sm rounded-2xl border border-app-border/10 text-[11px] leading-relaxed text-app-text/90 italic whitespace-pre-wrap ${font}`}>
                            {description}
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
                          <div className="px-4 py-3 bg-app-card/30 backdrop-blur-sm rounded-2xl border border-dashed border-app-border/20 text-[10px] leading-relaxed font-mono text-app-text/85 break-words whitespace-pre-wrap">
                            {internalNotes}
                          </div>
                        </div>
                      )}

                      {/* Fallback Empty State / Placeholder */}
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
                      <span>AlterProfile © 2026</span>
                      <span className="flex items-center gap-1 text-app-accent/80 font-black">
                        {selectedRoles[0] ? t.roleNames[selectedRoles[0] as keyof typeof t.roleNames] : ''}
                      </span>
                    </div>
                  </div>

                  {/* Watermark Logo of the primary role in the background center of lower panel */}
                  {selectedRoles[0] && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 opacity-[0.03] text-app-text pointer-events-none flex items-center justify-center z-0">
                      {React.cloneElement(getRoleIcon(selectedRoles[0]) as React.ReactElement, {
                        className: "w-full h-full stroke-[1.2]"
                      })}
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
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2.5 py-4 px-4 bg-app-card border border-app-border/45 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-app-bg hover:border-app-accent/40 active:scale-98 transition-all shadow-sm select-none"
              >
                <Download className="w-3.5 h-3.5 text-app-accent" />
                <span>{lang === 'fr' ? 'Télécharger PNG' : 'Download PNG'}</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                style={{ contentVisibility: 'auto' }}
                className="flex items-center justify-center gap-2.5 py-4 px-4 bg-app-card border border-app-border/45 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-app-bg hover:border-app-accent/40 active:scale-98 transition-all shadow-sm select-none"
              >
                <FileText className="w-3.5 h-3.5 text-app-accent" />
                <span>{t.downloadPdf}</span>
              </button>
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
      </main>

      {/* Footer */}
      <footer className="border-t border-app-border py-12 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-app-muted">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.copyright}</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-app-muted">
            <a href="#" className="hover:text-app-text transition-colors">{t.privacy}</a>
            <a href="#" className="hover:text-app-text transition-colors">{t.about}</a>
            <a href="#" className="hover:text-app-text transition-colors">{t.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
