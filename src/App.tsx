git add src/App.tsx
git commit -m "fix: écran blanc — new Map() shadowé par l'icône lucide-react Map, remplacé par un objet"
git pushimport MappingPage, { loadMapping, saveMapping, MappingRelation, MappingNode, MappingData, RELATION_CONFIG } from './MappingPage';
import InnerworldPage from './InnerworldPage';
import { createVault, unlockWithPin, unlockWithSecurityAnswer, changePin, changeSecurityAnswer, VaultMetadata } from './cryptoEngine';
import PlanningPage, { loadPlanning, savePlanning, loadEisenhower, saveEisenhower, PlanningEntry, EisenhowerTask, REMINDED_STORAGE_KEY } from './PlanningPage';
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
  Image as ImageIcon, 
  X,
  Info,
  Palette,
  RotateCcw,
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
  LayoutDashboard,
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
  Phone,
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
  Check,
  CalendarDays,
  Mail,
  Send,
  Lamp,
  Package,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { AlterRole, Gender, Sexuality, Trait, PersonalityTrait, Disorder, ROLE_CONFIGS, GENDER_COLORS, SEXUALITY_COLORS, ShapeType, PatternType, PatternLayer, Decoration, GENDER_CATEGORIES, SEXUALITY_CATEGORIES, TraitDecoration, Theme, SavedAlter, CustomField, CustomRole, CustomTrait, CustomDisorder, CustomGender, CustomSexuality, Subsystem, ParallelSystem, ChatMessage, DirectMessage, DirectConversation, SwitchLog, JournalEntry } from './types';
import { translations } from './translations';
import LegalPages, { LegalPage } from './components/LegalPages';
import SwitchAnalytics from './components/SwitchAnalytics';
import MoodSpoonWidget, { SwitchLogMoodDisplay } from './components/MoodSpoonWidget';


// ─── Nommage de couleur (hex → nom le plus proche, FR/EN) ─────────────────
const NAMED_COLORS: { name: string; nameFr: string; hex: string }[] = [
  { name: 'Alice Blue', nameFr: 'Bleu alice', hex: '#F0F8FF' },
  { name: 'Antique White', nameFr: 'Blanc antique', hex: '#FAEBD7' },
  { name: 'Aqua', nameFr: 'Cyan', hex: '#00FFFF' },
  { name: 'Aquamarine', nameFr: 'Aigue-marine', hex: '#7FFFD4' },
  { name: 'Azure', nameFr: 'Azur', hex: '#F0FFFF' },
  { name: 'Beige', nameFr: 'Beige', hex: '#F5F5DC' },
  { name: 'Bisque', nameFr: 'Bisque', hex: '#FFE4C4' },
  { name: 'Black', nameFr: 'Noir', hex: '#000000' },
  { name: 'Blanched Almond', nameFr: 'Amande blanchie', hex: '#FFEBCD' },
  { name: 'Blue', nameFr: 'Bleu', hex: '#0000FF' },
  { name: 'Blue Violet', nameFr: 'Bleu violet', hex: '#8A2BE2' },
  { name: 'Brown', nameFr: 'Marron', hex: '#A52A2A' },
  { name: 'Burlywood', nameFr: 'Bois brûlé', hex: '#DEB887' },
  { name: 'Cadet Blue', nameFr: 'Bleu cadet', hex: '#5F9EA0' },
  { name: 'Chartreuse', nameFr: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Chocolate', nameFr: 'Chocolat', hex: '#D2691E' },
  { name: 'Coral', nameFr: 'Corail', hex: '#FF7F50' },
  { name: 'Cornflower Blue', nameFr: 'Bleu bleuet', hex: '#6495ED' },
  { name: 'Cornsilk', nameFr: 'Soie de maïs', hex: '#FFF8DC' },
  { name: 'Crimson', nameFr: 'Cramoisi', hex: '#DC143C' },
  { name: 'Dark Blue', nameFr: 'Bleu foncé', hex: '#00008B' },
  { name: 'Dark Cyan', nameFr: 'Cyan foncé', hex: '#008B8B' },
  { name: 'Dark Goldenrod', nameFr: 'Or foncé', hex: '#B8860B' },
  { name: 'Dark Gray', nameFr: 'Gris foncé', hex: '#A9A9A9' },
  { name: 'Dark Green', nameFr: 'Vert foncé', hex: '#006400' },
  { name: 'Dark Khaki', nameFr: 'Kaki foncé', hex: '#BDB76B' },
  { name: 'Dark Magenta', nameFr: 'Magenta foncé', hex: '#8B008B' },
  { name: 'Dark Olive Green', nameFr: 'Vert olive foncé', hex: '#556B2F' },
  { name: 'Dark Orange', nameFr: 'Orange foncé', hex: '#FF8C00' },
  { name: 'Dark Orchid', nameFr: 'Orchidée foncée', hex: '#9932CC' },
  { name: 'Dark Red', nameFr: 'Rouge foncé', hex: '#8B0000' },
  { name: 'Dark Salmon', nameFr: 'Saumon foncé', hex: '#E9967A' },
  { name: 'Dark Sea Green', nameFr: "Vert d'eau foncé", hex: '#8FBC8F' },
  { name: 'Dark Slate Blue', nameFr: 'Bleu ardoise foncé', hex: '#483D8B' },
  { name: 'Dark Slate Gray', nameFr: 'Gris ardoise foncé', hex: '#2F4F4F' },
  { name: 'Dark Turquoise', nameFr: 'Turquoise foncé', hex: '#00CED1' },
  { name: 'Dark Violet', nameFr: 'Violet foncé', hex: '#9400D3' },
  { name: 'Deep Pink', nameFr: 'Rose profond', hex: '#FF1493' },
  { name: 'Deep Sky Blue', nameFr: 'Bleu ciel profond', hex: '#00BFFF' },
  { name: 'Dim Gray', nameFr: 'Gris terne', hex: '#696969' },
  { name: 'Dodger Blue', nameFr: 'Bleu dodger', hex: '#1E90FF' },
  { name: 'Firebrick', nameFr: 'Rouge brique', hex: '#B22222' },
  { name: 'Floral White', nameFr: 'Blanc floral', hex: '#FFFAF0' },
  { name: 'Forest Green', nameFr: 'Vert forêt', hex: '#228B22' },
  { name: 'Fuchsia', nameFr: 'Fuchsia', hex: '#FF00FF' },
  { name: 'Gainsboro', nameFr: 'Gris gainsboro', hex: '#DCDCDC' },
  { name: 'Ghost White', nameFr: 'Blanc fantôme', hex: '#F8F8FF' },
  { name: 'Gold', nameFr: 'Or', hex: '#FFD700' },
  { name: 'Goldenrod', nameFr: "Verge d'or", hex: '#DAA520' },
  { name: 'Gray', nameFr: 'Gris', hex: '#808080' },
  { name: 'Green', nameFr: 'Vert', hex: '#008000' },
  { name: 'Green Yellow', nameFr: 'Vert jaune', hex: '#ADFF2F' },
  { name: 'Honeydew', nameFr: 'Blanc miel', hex: '#F0FFF0' },
  { name: 'Hot Pink', nameFr: 'Rose vif', hex: '#FF69B4' },
  { name: 'Indian Red', nameFr: 'Rouge indien', hex: '#CD5C5C' },
  { name: 'Indigo', nameFr: 'Indigo', hex: '#4B0082' },
  { name: 'Ivory', nameFr: 'Ivoire', hex: '#FFFFF0' },
  { name: 'Khaki', nameFr: 'Kaki', hex: '#F0E68C' },
  { name: 'Lavender', nameFr: 'Lavande', hex: '#E6E6FA' },
  { name: 'Lavender Blush', nameFr: 'Blush lavande', hex: '#FFF0F5' },
  { name: 'Lawn Green', nameFr: 'Vert gazon', hex: '#7CFC00' },
  { name: 'Lemon Chiffon', nameFr: 'Chiffon citron', hex: '#FFFACD' },
  { name: 'Light Blue', nameFr: 'Bleu clair', hex: '#ADD8E6' },
  { name: 'Light Coral', nameFr: 'Corail clair', hex: '#F08080' },
  { name: 'Light Cyan', nameFr: 'Cyan clair', hex: '#E0FFFF' },
  { name: 'Light Goldenrod Yellow', nameFr: 'Jaune or clair', hex: '#FAFAD2' },
  { name: 'Light Gray', nameFr: 'Gris clair', hex: '#D3D3D3' },
  { name: 'Light Green', nameFr: 'Vert clair', hex: '#90EE90' },
  { name: 'Light Pink', nameFr: 'Rose clair', hex: '#FFB6C1' },
  { name: 'Light Salmon', nameFr: 'Saumon clair', hex: '#FFA07A' },
  { name: 'Light Sea Green', nameFr: "Vert d'eau clair", hex: '#20B2AA' },
  { name: 'Light Sky Blue', nameFr: 'Bleu ciel clair', hex: '#87CEFA' },
  { name: 'Light Slate Gray', nameFr: 'Gris ardoise clair', hex: '#778899' },
  { name: 'Light Steel Blue', nameFr: 'Bleu acier clair', hex: '#B0C4DE' },
  { name: 'Light Yellow', nameFr: 'Jaune clair', hex: '#FFFFE0' },
  { name: 'Lime', nameFr: 'Citron vert', hex: '#00FF00' },
  { name: 'Lime Green', nameFr: 'Vert citron', hex: '#32CD32' },
  { name: 'Linen', nameFr: 'Lin', hex: '#FAF0E6' },
  { name: 'Magenta', nameFr: 'Magenta', hex: '#FF00FF' },
  { name: 'Maroon', nameFr: 'Bordeaux', hex: '#800000' },
  { name: 'Medium Aquamarine', nameFr: 'Aigue-marine moyen', hex: '#66CDAA' },
  { name: 'Medium Blue', nameFr: 'Bleu moyen', hex: '#0000CD' },
  { name: 'Medium Orchid', nameFr: 'Orchidée moyenne', hex: '#BA55D3' },
  { name: 'Medium Purple', nameFr: 'Violet moyen', hex: '#9370DB' },
  { name: 'Medium Sea Green', nameFr: "Vert d'eau moyen", hex: '#3CB371' },
  { name: 'Medium Slate Blue', nameFr: 'Bleu ardoise moyen', hex: '#7B68EE' },
  { name: 'Medium Spring Green', nameFr: 'Vert printemps moyen', hex: '#00FA9A' },
  { name: 'Medium Turquoise', nameFr: 'Turquoise moyen', hex: '#48D1CC' },
  { name: 'Medium Violet Red', nameFr: 'Rouge violet moyen', hex: '#C71585' },
  { name: 'Midnight Blue', nameFr: 'Bleu nuit', hex: '#191970' },
  { name: 'Mint Cream', nameFr: 'Crème de menthe', hex: '#F5FFFA' },
  { name: 'Misty Rose', nameFr: 'Rose brumeux', hex: '#FFE4E1' },
  { name: 'Moccasin', nameFr: 'Mocassin', hex: '#FFE4B5' },
  { name: 'Navajo White', nameFr: 'Blanc navajo', hex: '#FFDEAD' },
  { name: 'Navy', nameFr: 'Bleu marine', hex: '#000080' },
  { name: 'Old Lace', nameFr: 'Dentelle ancienne', hex: '#FDF5E6' },
  { name: 'Olive', nameFr: 'Olive', hex: '#808000' },
  { name: 'Olive Drab', nameFr: 'Olive terne', hex: '#6B8E23' },
  { name: 'Orange', nameFr: 'Orange', hex: '#FFA500' },
  { name: 'Orange Red', nameFr: 'Rouge orangé', hex: '#FF4500' },
  { name: 'Orchid', nameFr: 'Orchidée', hex: '#DA70D6' },
  { name: 'Pale Goldenrod', nameFr: 'Or pâle', hex: '#EEE8AA' },
  { name: 'Pale Green', nameFr: 'Vert pâle', hex: '#98FB98' },
  { name: 'Pale Turquoise', nameFr: 'Turquoise pâle', hex: '#AFEEEE' },
  { name: 'Pale Violet Red', nameFr: 'Rouge violet pâle', hex: '#DB7093' },
  { name: 'Papaya Whip', nameFr: 'Papaye', hex: '#FFEFD5' },
  { name: 'Peach Puff', nameFr: 'Pêche', hex: '#FFDAB9' },
  { name: 'Peru', nameFr: 'Pérou', hex: '#CD853F' },
  { name: 'Pink', nameFr: 'Rose', hex: '#FFC0CB' },
  { name: 'Plum', nameFr: 'Prune', hex: '#DDA0DD' },
  { name: 'Powder Blue', nameFr: 'Bleu poudre', hex: '#B0E0E6' },
  { name: 'Purple', nameFr: 'Violet', hex: '#800080' },
  { name: 'Rebecca Purple', nameFr: 'Violet rebecca', hex: '#663399' },
  { name: 'Red', nameFr: 'Rouge', hex: '#FF0000' },
  { name: 'Rosy Brown', nameFr: 'Marron rosé', hex: '#BC8F8F' },
  { name: 'Royal Blue', nameFr: 'Bleu royal', hex: '#4169E1' },
  { name: 'Saddle Brown', nameFr: 'Marron selle', hex: '#8B4513' },
  { name: 'Salmon', nameFr: 'Saumon', hex: '#FA8072' },
  { name: 'Sandy Brown', nameFr: 'Marron sable', hex: '#F4A460' },
  { name: 'Sea Green', nameFr: "Vert d'eau", hex: '#2E8B57' },
  { name: 'Seashell', nameFr: 'Coquillage', hex: '#FFF5EE' },
  { name: 'Sienna', nameFr: 'Terre de Sienne', hex: '#A0522D' },
  { name: 'Silver', nameFr: 'Argent', hex: '#C0C0C0' },
  { name: 'Sky Blue', nameFr: 'Bleu ciel', hex: '#87CEEB' },
  { name: 'Slate Blue', nameFr: 'Bleu ardoise', hex: '#6A5ACD' },
  { name: 'Slate Gray', nameFr: 'Gris ardoise', hex: '#708090' },
  { name: 'Snow', nameFr: 'Blanc neige', hex: '#FFFAFA' },
  { name: 'Spring Green', nameFr: 'Vert printemps', hex: '#00FF7F' },
  { name: 'Steel Blue', nameFr: 'Bleu acier', hex: '#4682B4' },
  { name: 'Tan', nameFr: 'Beige tan', hex: '#D2B48C' },
  { name: 'Teal', nameFr: 'Sarcelle', hex: '#008080' },
  { name: 'Thistle', nameFr: 'Chardon', hex: '#D8BFD8' },
  { name: 'Tomato', nameFr: 'Tomate', hex: '#FF6347' },
  { name: 'Turquoise', nameFr: 'Turquoise', hex: '#40E0D0' },
  { name: 'Violet', nameFr: 'Violet', hex: '#EE82EE' },
  { name: 'Wheat', nameFr: 'Blé', hex: '#F5DEB3' },
  { name: 'White', nameFr: 'Blanc', hex: '#FFFFFF' },
  { name: 'White Smoke', nameFr: 'Blanc fumée', hex: '#F5F5F5' },
  { name: 'Yellow', nameFr: 'Jaune', hex: '#FFFF00' },
  { name: 'Yellow Green', nameFr: 'Vert jaune', hex: '#9ACD32' },
];

// ─── Affirmations (Détente) ────────────────────────────────────────────────
interface Affirmation { category: string; text: string; }
const AFFIRMATIONS: Affirmation[] = [
  { category: "Sécurité & Ancrage", text: "Le corps est en sécurité ici et maintenant." },
  { category: "Sécurité & Ancrage", text: "Le danger du passé appartient au passé." },
  { category: "Sécurité & Ancrage", text: "Nous sommes aujourd'hui dans un environnement sûr." },
  { category: "Sécurité & Ancrage", text: "Tu as le droit de prendre une grande respiration et de te poser." },
  { category: "Sécurité & Ancrage", text: "Regarde autour de toi : tu es dans le présent." },
  { category: "Sécurité & Ancrage", text: "Rien de grave ne va arriver en cet instant." },
  { category: "Sécurité & Ancrage", text: "Tu es en sécurité, même si tu ressens de la peur." },
  { category: "Sécurité & Ancrage", text: "Les personnes autour de nous aujourd'hui sont choisies et bienveillantes." },
  { category: "Sécurité & Ancrage", text: "Tes pieds touchent le sol, tu es bien ancré(e) ici." },
  { category: "Sécurité & Ancrage", text: "La sécurité se construit un jour à la fois, et nous avançons bien." },
  { category: "Sécurité & Ancrage", text: "Tu as le droit de te détendre, personne ne te menace." },
  { category: "Sécurité & Ancrage", text: "Ce moment t'appartient, en toute tranquillité." },
  { category: "Sécurité & Ancrage", text: "Le temps a passé, nous sommes plus fort(e)s et protégé(e)s aujourd'hui." },
  { category: "Sécurité & Ancrage", text: "Tu peux relâcher les épaules, tout va bien." },
  { category: "Sécurité & Ancrage", text: "L'espace dans lequel tu es est un lieu de calme." },
  { category: "Sécurité & Ancrage", text: "Les échos du passé ne peuvent plus nous blesser comme avant." },
  { category: "Sécurité & Ancrage", text: "Tu as le contrôle de ton présent." },
  { category: "Sécurité & Ancrage", text: "Respire. La tempête est terminée." },
  { category: "Sécurité & Ancrage", text: "Nous avons le droit d'occuper notre place en sécurité." },
  { category: "Sécurité & Ancrage", text: "Aujourd'hui, nous sommes protégé(e)s." },
  { category: "Sécurité & Ancrage", text: "Le corps est notre maison aujourd'hui, et nous en prenons soin." },
  { category: "Sécurité & Ancrage", text: "Ce que tu entends ou ressens ici est lié au présent, tout va bien." },
  { category: "Sécurité & Ancrage", text: "Le temps s'écoule paisiblement, nous ne sommes plus dans l'urgence." },
  { category: "Sécurité & Ancrage", text: "Tu peux déposer ce fardeau un instant, le danger s'est éloigné." },
  { category: "Sécurité & Ancrage", text: "Toucher un objet autour de toi peut t'aider à revenir ici." },
  { category: "Sécurité & Ancrage", text: "Le présent offre une protection que le passé n'avait pas." },
  { category: "Sécurité & Ancrage", text: "Notre environnement actuel respecte nos besoins et nos limites." },
  { category: "Sécurité & Ancrage", text: "Tu as le droit d'occuper de l'espace en toute quiétude." },
  { category: "Sécurité & Ancrage", text: "La sécurité n'est pas qu'un mot, c'est une réalité de notre quotidien actuel." },
  { category: "Sécurité & Ancrage", text: "Inspirer profondément aide notre corps à se rappeler qu'il est en paix." },
  { category: "Sécurité & Ancrage", text: "Tu es à l'abri des tempêtes d'autrefois." },
  { category: "Sécurité & Ancrage", text: "Rien ne te force à réagir immédiatement : tu as le temps de ressentir." },
  { category: "Sécurité & Ancrage", text: "Le sol sous nos pieds est stable et solide." },
  { category: "Sécurité & Ancrage", text: "Tu peux fermer les yeux ou les garder ouverts, selon ce qui te réconforte." },
  { category: "Sécurité & Ancrage", text: "Le monde extérieur aujourd'hui est plus vaste et plus doux." },
  { category: "Sécurité & Ancrage", text: "Tu as le pouvoir de choisir ce qui te fait du bien maintenant." },
  { category: "Sécurité & Ancrage", text: "Chaque minute qui passe confirme que nous sommes en sécurité." },
  { category: "Sécurité & Ancrage", text: "Tu peux te détendre, personne ne te demande d'être en alerte." },
  { category: "Sécurité & Ancrage", text: "Notre espace de vie est un refuge bienveillant." },
  { category: "Sécurité & Ancrage", text: "Nous avons appris à nous protéger, et nous savons le faire." },

  { category: "Cohésion & Travail d'équipe", text: "Chaque alter fait de son mieux aujourd'hui." },
  { category: "Cohésion & Travail d'équipe", text: "Tous les membres du système ont de la valeur." },
  { category: "Cohésion & Travail d'équipe", text: "Nous sommes une équipe qui apprend à cheminer ensemble." },
  { category: "Cohésion & Travail d'équipe", text: "Même sans être d'accord, nous pouvons nous écouter avec respect." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque voix dans ce système mérite d'être entendue." },
  { category: "Cohésion & Travail d'équipe", text: "Nous n'avons pas besoin d'être parfait(e)s pour avancer ensemble." },
  { category: "Cohésion & Travail d'équipe", text: "La communication interne s'améliore à son propre rythme." },
  { category: "Cohésion & Travail d'équipe", text: "Merci à ceux et celles qui ont gardé le système en vie." },
  { category: "Cohésion & Travail d'équipe", text: "Nous méritons tou(te)s d'avoir un espace de paix." },
  { category: "Cohésion & Travail d'équipe", text: "L'entraide est notre plus grande force." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque alter a sa propre sensibilité, et c'est légitime." },
  { category: "Cohésion & Travail d'équipe", text: "Nous apprenons à nous faire confiance jour après jour." },
  { category: "Cohésion & Travail d'équipe", text: "Même dans la confusion, nous restons soudé(e)s." },
  { category: "Cohésion & Travail d'équipe", text: "Il n'y a pas de \"mauvais\" alter, seulement des rôles de protection." },
  { category: "Cohésion & Travail d'équipe", text: "Nous pouvons trouver des compromis réconfortants pour tout le monde." },
  { category: "Cohésion & Travail d'équipe", text: "Prendre soin des plus jeunes d'entre nous est une priorité douce." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque présence dans le système a sa raison d'être." },
  { category: "Cohésion & Travail d'équipe", text: "Nous pouvons partager la charge sans nous épuiser." },
  { category: "Cohésion & Travail d'équipe", text: "La diversité de notre système est une richesse." },
  { category: "Cohésion & Travail d'équipe", text: "Nous avançons main dans la main, à notre rythme." },
  { category: "Cohésion & Travail d'équipe", text: "La communication interne s'adoucit à chaque tentative d'écoute." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque alter apporte une perspective unique qui peut nous aider." },
  { category: "Cohésion & Travail d'équipe", text: "Nous apprenons à partager le quotidien avec patience." },
  { category: "Cohésion & Travail d'équipe", text: "Remercions ceux qui gèrent les tâches invisibles du système." },
  { category: "Cohésion & Travail d'équipe", text: "La coopération se bâtit petit à petit, sans pression." },
  { category: "Cohésion & Travail d'équipe", text: "Même dans le silence, nous restons une équipe liée." },
  { category: "Cohésion & Travail d'équipe", text: "Il est possible d'accorder de l'attention aux besoins de chacun(e)." },
  { category: "Cohésion & Travail d'équipe", text: "Nous n'avons pas besoin d'être d'accord sur tout pour avancer ensemble." },
  { category: "Cohésion & Travail d'équipe", text: "La présence des autres membres est un soutien, pas une menace." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque émotion exprimée dans le système a sa raison d'être." },
  { category: "Cohésion & Travail d'équipe", text: "Nous pouvons nous transmettre de la douceur de l'intérieur." },
  { category: "Cohésion & Travail d'équipe", text: "La co-conscience s'apprivoise dans le respect du rythme de tou(te)s." },
  { category: "Cohésion & Travail d'équipe", text: "Il y a de la place pour les envies de chacun(e) au cours de la semaine." },
  { category: "Cohésion & Travail d'équipe", text: "Nous formant un tout complexe, riche et résilient." },
  { category: "Cohésion & Travail d'équipe", text: "Offrir de la gentillesse aux alters plus jeunes apaise tout le monde." },
  { category: "Cohésion & Travail d'équipe", text: "Aucun rôle n'est figé : nous pouvons évoluer ensemble." },
  { category: "Cohésion & Travail d'équipe", text: "La compréhension mutuelle grandit jour après jour." },
  { category: "Cohésion & Travail d'équipe", text: "Nous pouvons nous épauler quand l'énergie vient à manquer." },
  { category: "Cohésion & Travail d'équipe", text: "Chaque voix intérieure mérite d'être entendue sans jugement." },
  { category: "Cohésion & Travail d'équipe", text: "L'union de nos forces rend notre quotidien plus fluide." },

  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit de faire une pause si c'est trop lourd." },
  { category: "Auto-compassion & Bienveillance", text: "Tes émotions sont valides, quelles qu'elles soient." },
  { category: "Auto-compassion & Bienveillance", text: "On a le temps. Rien ne presse." },
  { category: "Auto-compassion & Bienveillance", text: "Tu fais preuve d'un courage immense chaque jour." },
  { category: "Auto-compassion & Bienveillance", text: "Il est normal de se sentir fatigué(e) parfois." },
  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit de dire non sans te justifier." },
  { category: "Auto-compassion & Bienveillance", text: "Sois doux/douce avec toi-même aujourd'hui." },
  { category: "Auto-compassion & Bienveillance", text: "Tu n'as rien à prouver à personne pour mériter le respect." },
  { category: "Auto-compassion & Bienveillance", text: "Les erreurs font partie du chemin et ne remettent pas en cause ta valeur." },
  { category: "Auto-compassion & Bienveillance", text: "Prends ce dont tu as besoin en cet instant : du repos, du calme ou de la douceur." },
  { category: "Auto-compassion & Bienveillance", text: "Tu es une personne digne d'amour et de soin." },
  { category: "Auto-compassion & Bienveillance", text: "Tes limites sont légitimes et méritent d'être respectées." },
  { category: "Auto-compassion & Bienveillance", text: "C'est d'accord de ne pas aller bien aujourd'hui." },
  { category: "Auto-compassion & Bienveillance", text: "Tu fais déjà tellement de chemin, sois fier/fière de toi." },
  { category: "Auto-compassion & Bienveillance", text: "La fatigue est un signal, pas une faiblesse." },
  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit de prendre soin de toi avant d'aider les autres." },
  { category: "Auto-compassion & Bienveillance", text: "La guérison n'est pas linéaire, et c'est tout à fait normal." },
  { category: "Auto-compassion & Bienveillance", text: "Tu mérites la même gentillesse que celle que tu offres aux autres." },
  { category: "Auto-compassion & Bienveillance", text: "Il est permis de demander de l'aide quand c'est difficile." },
  { category: "Auto-compassion & Bienveillance", text: "Chaque petit pas compte, même le plus discret." },
  { category: "Auto-compassion & Bienveillance", text: "La lenteur est permise, tout ne doit pas être accompli tout de suite." },
  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit d'avoir des moments de doute sans te culpabiliser." },
  { category: "Auto-compassion & Bienveillance", text: "Tes réactions passées étaient des mécanismes de défense intelligents." },
  { category: "Auto-compassion & Bienveillance", text: "S'accorder du repos est un investissement dans notre bien-être." },
  { category: "Auto-compassion & Bienveillance", text: "Tu es digne de bienveillance, y compris de la part de toi-même." },
  { category: "Auto-compassion & Bienveillance", text: "Accueille tes ressentis comme de simples visiteurs de passage." },
  { category: "Auto-compassion & Bienveillance", text: "Il n'y a aucune honte à ressentir de la fatigue émotionnelle." },
  { category: "Auto-compassion & Bienveillance", text: "Tu peux choisir d'être ton/ta plus grand(e) allié(e) aujourd'hui." },
  { category: "Auto-compassion & Bienveillance", text: "Chaque geste d'auto-soin est une victoire sur la douleur." },
  { category: "Auto-compassion & Bienveillance", text: "Ne pas être au top aujourd'hui ne remet pas en cause tes progrès." },
  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit de réclamer du réconfort quand tu en as besoin." },
  { category: "Auto-compassion & Bienveillance", text: "La gentillesse envers soi-même est la meilleure médecine." },
  { category: "Auto-compassion & Bienveillance", text: "Accorde-toi la permission d'échouer et de réessayer plus tard." },
  { category: "Auto-compassion & Bienveillance", text: "Ton bien-être passe avant les attentes des autres." },
  { category: "Auto-compassion & Bienveillance", text: "Il est légitime de vouloir préserver sa bulle de sérénité." },
  { category: "Auto-compassion & Bienveillance", text: "Tu mérites de respirer sans porter tout le poids du monde." },
  { category: "Auto-compassion & Bienveillance", text: "La guérison demande de la patience, et tu en fais preuve." },
  { category: "Auto-compassion & Bienveillance", text: "Sois fier/fière de la manière dont tu traverser les jours sombres." },
  { category: "Auto-compassion & Bienveillance", text: "Tu as le droit de ressentir de la joie sans culpabilité." },
  { category: "Auto-compassion & Bienveillance", text: "Chaque bouffée d'air frais est une invitation à la douceur." },

  { category: "Validation & Identité", text: "Ton expérience est réelle et ta parole est légitime." },
  { category: "Validation & Identité", text: "Tu as le droit d'exister tel(le) que tu es." },
  { category: "Validation & Identité", text: "Personne ne peut nier ce que tu ressens à l'intérieur." },
  { category: "Validation & Identité", text: "Tu as le droit d'avoir tes propres goûts, envies et limites." },
  { category: "Validation & Identité", text: "L'amnésie ou la dissociation ne définissent pas toute ton existence." },
  { category: "Validation & Identité", text: "Tu es bien plus que tes traumatismes." },
  { category: "Validation & Identité", text: "Chaque facette de nous a le droit de vivre ses moments." },
  { category: "Validation & Identité", text: "Ton identité est valable, peu importe le regard des autres." },
  { category: "Validation & Identité", text: "Tu as le droit d'exprimer ta personnalité librement." },
  { category: "Validation & Identité", text: "Nous avons le droit de grandir et de changer." },
  { category: "Validation & Identité", text: "La façon dont nous fonctionnons nous a permis de survivre." },
  { category: "Validation & Identité", text: "Tu n'as pas besoin de te justifier d'exister." },
  { category: "Validation & Identité", text: "C'est d'accord de ne pas tout comprendre tout de suite." },
  { category: "Validation & Identité", text: "Tu peux prendre ta place dans ce monde." },
  { category: "Validation & Identité", text: "Ce que tu as traversé montre ta résilience, pas ta vulnérabilité." },
  { category: "Validation & Identité", text: "Tu as le droit d'avoir des besoins différents selon les moments." },
  { category: "Validation & Identité", text: "Ton histoire compte et ton présent t'appartient." },
  { category: "Validation & Identité", text: "Tu as le droit d'aimer ce que tu aimes sans jugement." },
  { category: "Validation & Identité", text: "La personne que tu es en ce moment est importante." },
  { category: "Validation & Identité", text: "Nous méritons de vivre une vie épanouissante et paisible." },
  { category: "Validation & Identité", text: "Ton fonctionnement est unique, et il est totalement valable." },
  { category: "Validation & Identité", text: "Tu as le droit de définir tes propres choix de vie." },
  { category: "Validation & Identité", text: "La dissociation a été un bouclier, aujourd'hui tu réapprends à vivre." },
  { category: "Validation & Identité", text: "Tu n'as pas besoin de prouver ta réalité à qui que ce soit." },
  { category: "Validation & Identité", text: "Chaque membre du système a le droit d'avoir ses propres goûts." },
  { category: "Validation & Identité", text: "Ton histoire est singulière, mais ton présent t'appartient pleinement." },
  { category: "Validation & Identité", text: "Tu as le droit de changer d'avis et d'explorer de nouvelles choses." },
  { category: "Validation & Identité", text: "Exister tel(le) que tu es suffit amplement." },
  { category: "Validation & Identité", text: "Tes limites personnelles sont de véritables remparts protecteurs." },
  { category: "Validation & Identité", text: "Tu n'es pas bizarre, tu es un être humain qui s'est adapté." },
  { category: "Validation & Identité", text: "La pluralité est une manière légitime d'expérimenter la vie." },
  { category: "Validation & Identité", text: "Tu as le droit de choisir qui mérite de connaître ton histoire." },
  { category: "Validation & Identité", text: "Tes émotions d'aujourd'hui ne gâchent en rien ton identité." },
  { category: "Validation & Identité", text: "Chaque facette de notre système contribue à notre histoire globale." },
  { category: "Validation & Identité", text: "Tu mérites de trouver ta place dans la société sans te cacher." },
  { category: "Validation & Identité", text: "Ton confort émotionnel est une priorité légitime." },
  { category: "Validation & Identité", text: "Tu as le droit d'exprimer ton style et tes préférences uniques." },
  { category: "Validation & Identité", text: "La complexité de notre esprit est la preuve de notre adaptation." },
  { category: "Validation & Identité", text: "Tu peux vivre le moment présent en toute authenticité." },
  { category: "Validation & Identité", text: "Ton existence est précieuse, quelle que soit la forme qu'elle prend." },

  { category: "Espoir & Quotidien", text: "Demain est une nouvelle opportunité de calme." },
  { category: "Espoir & Quotidien", text: "Une journée difficile n'annule pas tous tes progrès." },
  { category: "Espoir & Quotidien", text: "Il y a de la beauté et de la douceur à découvrir aujourd'hui." },
  { category: "Espoir & Quotidien", text: "Tu es capable de traverser ce moment d'inconfort." },
  { category: "Espoir & Quotidien", text: "Chaque journée apporte sa petite victoire." },
  { category: "Espoir & Quotidien", text: "La tempête finit toujours par laisser place au calme." },
  { category: "Espoir & Quotidien", text: "Tu peux choisir de te concentrer sur une chose très simple maintenant." },
  { category: "Espoir & Quotidien", text: "Nous construisons un avenir plus doux jour après jour." },
  { category: "Espoir & Quotidien", text: "Il y a des moments de joie qui nous attendent." },
  { category: "Espoir & Quotidien", text: "Tu as surmonté 100 % de tes pires journées jusqu'ici." },
  { category: "Espoir & Quotidien", text: "Tu as le droit de sourire et de profiter des petits plaisirs." },
  { category: "Espoir & Quotidien", text: "Aujourd'hui est une page différente du passé." },
  { category: "Espoir & Quotidien", text: "Le calme revient toujours, même après un moment de désorientation." },
  { category: "Espoir & Quotidien", text: "Tu es en train d'apprendre et de guérir." },
  { category: "Espoir & Quotidien", text: "Prendre soin de soi est un acte de liberté." },
  { category: "Espoir & Quotidien", text: "Un pas après l'autre, tout va se mettre en place." },
  { category: "Espoir & Quotidien", text: "Tu es entouré(e) de possibilités de paix." },
  { category: "Espoir & Quotidien", text: "Offre-toi un moment de gratitude pour le chemin accompli." },
  { category: "Espoir & Quotidien", text: "Ce que tu ressens en ce moment va s'apaiser." },
  { category: "Espoir & Quotidien", text: "Tu es à ta place, et le système est en sécurité." },
  { category: "Espoir & Quotidien", text: "Aujourd'hui réserve de petites étincelles de calme et de beau." },
  { category: "Espoir & Quotidien", text: "Ce que tu traverses en ce moment n'est qu'un chapitre, pas tout le livre." },
  { category: "Espoir & Quotidien", text: "Le soleil se lève chaque jour, apportant avec lui de nouvelles possibilités." },
  { category: "Espoir & Quotidien", text: "Tu as déjà franchi tant d'obstacles, tu sais trouver des ressources." },
  { category: "Espoir & Quotidien", text: "Un moment de calme peut survenir à tout instant dans la journée." },
  { category: "Espoir & Quotidien", text: "La vie s'apprivoise un jour après l'autre, sans précipitation." },
  { category: "Espoir & Quotidien", text: "Tu es capable de reconstruire un quotidien qui te ressemble." },
  { category: "Espoir & Quotidien", text: "La confusion d'aujourd'hui laissera place à la clarté de demain." },
  { category: "Espoir & Quotidien", text: "Tu as le droit de projeter de belles choses pour l'avenir." },
  { category: "Espoir & Quotidien", text: "Même les plus petits efforts portent leurs fruits avec le temps." },
  { category: "Espoir & Quotidien", text: "L'apaisement est un chemin que nous arpentons à notre rythme." },
  { category: "Espoir & Quotidien", text: "Chaque sourire partagé ou ressenti est une petite victoire." },
  { category: "Espoir & Quotidien", text: "Le futur contient de la douceur que tu n'imagines pas encore." },
  { category: "Espoir & Quotidien", text: "Tu as la capacité de créer des souvenirs heureux dès aujourd'hui." },
  { category: "Espoir & Quotidien", text: "Le calme intérieur est un état que nous pouvons retrouver." },
  { category: "Espoir & Quotidien", text: "Demain apportera son lot de fraîcheur et de répit." },
  { category: "Espoir & Quotidien", text: "Tu es en train de vous bâtir un avenir plus serein." },
  { category: "Espoir & Quotidien", text: "Les moments difficiles ne durent jamais éternellement." },
  { category: "Espoir & Quotidien", text: "Il y a de la force dans la façon dont tu choisis de continuer." },
  { category: "Espoir & Quotidien", text: "Nous sommes en route vers une vie de plus en plus apaisée." },
];
const AFFIRMATION_CATEGORY_ICONS: Record<string, string> = {
  "Sécurité & Ancrage": "🛡️",
  "Cohésion & Travail d'équipe": "🤝",
  "Auto-compassion & Bienveillance": "💖",
  "Validation & Identité": "🌱",
  "Espoir & Quotidien": "☀️",
};

function hexToRgbTriplet(hex: string): [number, number, number] {
  const clean = hex.trim().replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function cssColorToHex(css: string): string {
  const c = (css || '').trim();
  if (c.startsWith('#')) {
    return c.length === 4
      ? '#' + c.slice(1).split('').map(ch => ch + ch).join('')
      : c;
  }
  const match = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) {
    const [, r, g, b] = match;
    return '#' + [r, g, b].map(v => parseInt(v, 10).toString(16).padStart(2, '0')).join('');
  }
  return '#000000';
}

function getClosestColorName(hex: string, bigList?: { name: string; hex: string }[] | null): string {
  if (!hex || !/^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(hex.trim())) return '';
  const [r, g, b] = hexToRgbTriplet(hex);
  const list = (bigList && bigList.length > 0) ? bigList : NAMED_COLORS;
  let best = list[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const c of list) {
    const [cr, cg, cb] = hexToRgbTriplet(c.hex);
    const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best.name;
}

// ─── Markdown renderer + editor ────────────────────────────────────────────
function renderMarkdown(text: string, onImageClick?: (url: string) => void): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  const parseInline = (line: string, key: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let rest = line;
    let i = 0;
    const patterns: [RegExp, (m: string, k: string, full?: RegExpExecArray) => React.ReactNode][] = [
      [/!\[([^\]]*)\]\(([^)]+)\)/, (m, k, full) => {
        const alt = full ? full[1] : '';
        const url = full ? full[2] : m;
        return (
          <span key={k} className="inline-block my-1">
            <img
              src={url} alt={alt}
              className="max-w-full rounded-xl border border-app-border/30 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
              onClick={() => onImageClick && onImageClick(url)}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </span>
        );
      }],
      [/\*\*(.+?)\*\*/,  (m, k) => <strong key={k}>{m}</strong>],
      [/_(.+?)_/,          (m, k) => <em key={k}>{m}</em>],
      [/`(.+?)`/,          (m, k) => <code key={k} className="bg-app-card px-1 py-0.5 rounded text-[11px] font-mono">{m}</code>],
    ];
    while (rest.length > 0) {
      let earliest = rest.length;
      let matchedPat: null | typeof patterns[0] = null;
      let matchedIdx = -1;
      let matchedFull: RegExpExecArray | null = null;
      for (const pat of patterns) {
        const m = pat[0].exec(rest);
        if (m && m.index < earliest) { earliest = m.index; matchedPat = pat; matchedIdx = m.index; matchedFull = m; }
      }
      if (!matchedPat || !matchedFull) { parts.push(rest); break; }
      if (matchedIdx > 0) parts.push(rest.slice(0, matchedIdx));
      const captureGroup = matchedFull[1] ?? matchedFull[0];
      parts.push(matchedPat[1](captureGroup, `${key}-${i++}`, matchedFull));
      rest = rest.slice(matchedIdx + matchedFull[0].length);
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
  // Certains contextes (ex: Journal) ont déjà un mécanisme dédié et propre pour attacher des
  // photos (stockées à part, pas de base64 dans le texte). Dans ce cas on masque le bouton
  // d'import d'image inline pour éviter le doublon qui alourdit inutilement le texte brut.
  allowInlineImages?: boolean;
  // Ouvre l'image en grand (lightbox) quand on clique dessus dans l'aperçu de l'éditeur.
  onImageClick?: (url: string) => void;
}

function MarkdownEditor({ value, onChange, placeholder, rows = 6, maxLength, className = '', allowInlineImages = true, onImageClick }: MarkdownEditorProps) {
  const [preview, setPreview] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Images intégrées (data:image/...) détectées dans le texte — affichées en vignettes
  // plutôt que de laisser l'utilisateur se coltiner un pavé de base64 illisible dans le champ.
  const embeddedImages = React.useMemo(() => {
    const regex = /!\[([^\]]*)\]\((data:image\/[^)]+)\)/g;
    const matches: { full: string; alt: string; url: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(value)) !== null) {
      matches.push({ full: m[0], alt: m[1], url: m[2] });
    }
    return matches;
  }, [value]);

  const removeEmbeddedImage = (full: string) => {
    const idx = value.indexOf(full);
    if (idx === -1) return;
    onChange(value.slice(0, idx) + value.slice(idx + full.length));
  };

  const insertImageMarkdown = (url: string, alt: string = '') => {
    const ta = textareaRef.current;
    const pos = ta ? ta.selectionStart : value.length;
    const ins = `![${alt}](${url})`;
    onChange(value.slice(0, pos) + ins + value.slice(pos));
  };

  const handleImageFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Taille et qualité réduites par rapport à avant : le texte base64 résultant est
        // nettement plus court, donc moins encombrant dans le champ d'édition brut.
        const max_size = 640;
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.55);
        insertImageMarkdown(dataUrl);
        setUploadingImage(false);
        setPreview(true);
      };
      img.onerror = () => setUploadingImage(false);
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => setUploadingImage(false);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
    ...(allowInlineImages ? [
      { label: '🖼️', title: 'Image (URL)', action: () => {
        const url = prompt('URL de l\'image :');
        if (url) {
          const alt = prompt('Description (optionnel) :') || '';
          insertImageMarkdown(url, alt);
        }
      }},
      { label: '📁', title: 'Importer une image depuis l\'appareil', action: () => fileInputRef.current?.click() },
    ] : []),
  ];

  return (
    <div className={`space-y-1 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelected}
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}
      />
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap">
        {toolbarBtns.map(btn => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={btn.action}
            disabled={preview || uploadingImage}
            className="px-2 py-1 rounded-lg bg-app-card border border-app-border text-[11px] font-black hover:bg-app-accent/10 hover:text-app-accent hover:border-app-accent/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {btn.label}
          </button>
        ))}
        {uploadingImage && <span className="text-[10px] text-app-muted italic">Import en cours…</span>}
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

      {/* Galerie des images intégrées — évite d'avoir à lire/gérer le pavé de base64 dans le texte */}
      {embeddedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-app-bg/60 border border-app-border/30 rounded-xl">
          {embeddedImages.map((img, i) => (
            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-app-border/40 shrink-0 group">
              <img
                src={img.url}
                className="w-full h-full object-cover cursor-pointer"
                alt={img.alt}
                onClick={() => onImageClick && onImageClick(img.url)}
                title="Voir en grand"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeEmbeddedImage(img.full); }}
                title="Retirer cette image"
                className="absolute top-0.5 right-0.5 p-0.5 rounded-md bg-black/60 hover:bg-red-500/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <span className="self-center text-[10px] text-app-muted italic px-1">
            {embeddedImages.length} image{embeddedImages.length > 1 ? 's' : ''} intégrée{embeddedImages.length > 1 ? 's' : ''}. Clique sur une vignette pour l'agrandir, sur la croix pour la retirer.
          </span>
        </div>
      )}

      {/* Zone édition ou prévisualisation */}
      {preview ? (
        <div className="w-full min-h-[7rem] bg-app-card border border-app-border rounded-2xl px-6 py-4 text-sm leading-relaxed space-y-1">
          {value.trim() ? renderMarkdown(value, onImageClick) : <span className="text-app-muted italic">{placeholder || 'Rien à afficher.'}</span>}
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

const ACTIVE_ALTER_ROLES = new Set<string>(Object.values(AlterRole));
const cleanAlterRoles = (roles?: Array<AlterRole | string>): AlterRole[] => {
  const clean = (roles || []).filter((role): role is AlterRole => ACTIVE_ALTER_ROLES.has(role));
  return clean.length > 0 ? clean : [AlterRole.HOST];
};

// Stockage chiffré (coffre) : voir vaultStorage.ts — extrait pour être partagé avec
// les pages annexes (Mapping, Planning, Innerworld) qui ont aussi besoin d'y accéder.
import { HS_ENCRYPTED_MARKER, readMaybeEncrypted, writeMaybeEncrypted, listVaultKeys, deleteVaultKey, migrateKeyIfNeeded } from './vaultStorage';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  // Demande un stockage "persistant" au navigateur — ça n'empêche pas une suppression
  // manuelle (via les réglages du navigateur), mais réduit fortement le risque que le
  // navigateur vide IndexedDB/localStorage tout seul en cas de pression sur l'espace disque.
  // Sans effet dans les navigateurs qui ne supportent pas l'API (l'appel est simplement ignoré).
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => { /* pas grave si refusé ou non supporté */ });
    }
  }, []);

  const [font, setFont] = useState<string>(() => localStorage.getItem('hs-font') || 'font-sans');
  const [fontScale, setFontScale] = useState<'small' | 'normal' | 'large' | 'xlarge'>(() => (localStorage.getItem('hs-font-scale') as any) || 'normal');
  useEffect(() => {
    const scales: Record<string, string> = { small: '93.75%', normal: '100%', large: '112.5%', xlarge: '125%' };
    document.documentElement.style.fontSize = scales[fontScale] || '100%';
  }, [fontScale]);
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
    roles: false,
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
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [roleFilterInput, setRoleFilterInput] = useState('');
  const [roleFilterSuggestions, setRoleFilterSuggestions] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [tagFilterInput, setTagFilterInput] = useState('');
  const [tagFilterSuggestions, setTagFilterSuggestions] = useState<string[]>([]);
  const t = translations[lang];

  // Catégories de statuts de front, pour un affichage groupé plutôt qu'une grille plate.
  // 'blend' n'y figure pas : c'est une action à part (log sans sélectionner d'alter précis).
  const FRONT_STATUS_CATEGORIES: { key: string; labelFr: string; labelEn: string; statuses: string[] }[] = [
    {
      key: 'active',
      labelFr: 'États courants',
      labelEn: 'Common states',
      statuses: ['primary', 'co_front', 'co_conscious', 'passive', 'dormant', 'none'],
    },
    {
      key: 'blocked',
      labelFr: 'Contrôle bloqué ou forcé',
      labelEn: 'Blocked or forced control',
      statuses: ['frontstuck', 'front_locked', 'front_held'],
    },
    {
      key: 'partial',
      labelFr: 'Présence partielle ou en coulisses',
      labelEn: 'Partial presence / behind the scenes',
      statuses: ['shadowing', 'blurry', 'triggered'],
    },
    {
      key: 'transition',
      labelFr: 'Transition ou retrait',
      labelEn: 'Transition or withdrawal',
      statuses: ['switching', 'fading'],
    },
  ];

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
  const [alterBirthday, setAlterBirthday] = useState('');
  const [alterTags, setAlterTags] = useState<string[]>([]);
  const [alterTagInput, setAlterTagInput] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [internalNotesImages, setInternalNotesImages] = useState<string[]>([]);
  const [frontStatus, setFrontStatus] = useState<string>('none');
  // Rôles personnalisés attribués à l'alter en cours d'édition
  const [selectedCustomRoleIds, setSelectedCustomRoleIds] = useState<string[]>([]);
  // Brouillon du formulaire de création/édition d'un rôle personnalisé (liste globale)
  const [customRoleDraftName, setCustomRoleDraftName] = useState('');
  const [customRoleDraftDefinition, setCustomRoleDraftDefinition] = useState('');
  const [customRoleDraftColor, setCustomRoleDraftColor] = useState('#8B5CF6');
  const [editingCustomRoleId, setEditingCustomRoleId] = useState<string | null>(null);
  const [customRoleDeleteConfirmId, setCustomRoleDeleteConfirmId] = useState<string | null>(null);
  // Traits personnalisés attribués à l'alter en cours d'édition
  const [selectedCustomTraitIds, setSelectedCustomTraitIds] = useState<string[]>([]);
  const [customTraitDraftName, setCustomTraitDraftName] = useState('');
  const [customTraitDraftDefinition, setCustomTraitDraftDefinition] = useState('');
  const [customTraitDraftColor, setCustomTraitDraftColor] = useState('#8B5CF6');
  const [editingCustomTraitId, setEditingCustomTraitId] = useState<string | null>(null);
  const [customTraitDeleteConfirmId, setCustomTraitDeleteConfirmId] = useState<string | null>(null);
  // Troubles personnalisés attribués à l'alter en cours d'édition
  const [selectedCustomDisorderIds, setSelectedCustomDisorderIds] = useState<string[]>([]);
  const [customDisorderDraftName, setCustomDisorderDraftName] = useState('');
  const [customDisorderDraftDefinition, setCustomDisorderDraftDefinition] = useState('');
  const [customDisorderDraftColor, setCustomDisorderDraftColor] = useState('#8B5CF6');
  const [editingCustomDisorderId, setEditingCustomDisorderId] = useState<string | null>(null);
  const [customDisorderDeleteConfirmId, setCustomDisorderDeleteConfirmId] = useState<string | null>(null);
  // Genres personnalisés attribués à l'alter en cours d'édition
  const [selectedCustomGenderIds, setSelectedCustomGenderIds] = useState<string[]>([]);
  const [customGenderDraftName, setCustomGenderDraftName] = useState('');
  const [customGenderDraftDefinition, setCustomGenderDraftDefinition] = useState('');
  const [customGenderDraftColor, setCustomGenderDraftColor] = useState('#8B5CF6');
  const [editingCustomGenderId, setEditingCustomGenderId] = useState<string | null>(null);
  const [customGenderDeleteConfirmId, setCustomGenderDeleteConfirmId] = useState<string | null>(null);
  // Sexualités personnalisées attribuées à l'alter en cours d'édition
  const [selectedCustomSexualityIds, setSelectedCustomSexualityIds] = useState<string[]>([]);
  const [customSexualityDraftName, setCustomSexualityDraftName] = useState('');
  const [customSexualityDraftDefinition, setCustomSexualityDraftDefinition] = useState('');
  const [customSexualityDraftColor, setCustomSexualityDraftColor] = useState('#8B5CF6');
  const [editingCustomSexualityId, setEditingCustomSexualityId] = useState<string | null>(null);
  const [customSexualityDeleteConfirmId, setCustomSexualityDeleteConfirmId] = useState<string | null>(null);
  const [mainSystemName, setMainSystemName] = useState<string>('');

  // Custom dialogue boxes to bypass sandboxed iframe restrictions
  const [deleteConfirmAlterId, setDeleteConfirmAlterId] = useState<string | null>(null);
  const [deleteConfirmSubsystemId, setDeleteConfirmSubsystemId] = useState<string | null>(null);
  const [deleteSubsystemStep, setDeleteSubsystemStep] = useState<'choose' | 'move' | 'confirmDestroy'>('choose');
  const [moveSubsystemAssignments, setMoveSubsystemAssignments] = useState<Record<string, string>>({});
  const [moveSubsystemSelectedIds, setMoveSubsystemSelectedIds] = useState<string[]>([]);
  const [moveSubsystemBulkDestination, setMoveSubsystemBulkDestination] = useState<string>('__main__');
  const [destroySubsystemConfirmText, setDestroySubsystemConfirmText] = useState<string>('');
  const [deleteConfirmSwitchLogId, setDeleteConfirmSwitchLogId] = useState<string | null>(null);
  const [deleteConfirmJournalId, setDeleteConfirmJournalId] = useState<string | null>(null);
  const [deleteConfirmClearChat, setDeleteConfirmClearChat] = useState<boolean>(false);
  const [loadConfirmAlter, setLoadConfirmAlter] = useState<SavedAlter | null>(null);

  // --- DID Local Form States ---
  const [newSubName, setNewSubName] = useState('');
  const [newSubParentId, setNewSubParentId] = useState('');
  
  const [chatSpeakerId, setChatSpeakerId] = useState<string>('external');
  const [chatSpeakerSearch, setChatSpeakerSearch] = useState('');
  const [chatSpeakerOpen, setChatSpeakerOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatImageUrlInput, setChatImageUrlInput] = useState<string | null>(null); // null = fermé, string = panneau ouvert avec sa valeur
  
  // --- Chat Poll Creator States ---
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState<number>(5);
  const [pollDurationUnit, setPollDurationUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');

  const [switchSelectedAlterIds, setSwitchSelectedAlterIds] = useState<string[]>([]);
  const [switchAlterSearch, setSwitchAlterSearch] = useState('');
  const [switchSelectedStatus, setSwitchSelectedStatus] = useState<string>('co_front');
  // État global "le système est en flou/blend" — pas lié à un alter précis, donc distinct du frontStatus par alter.
  const [systemInBlend, setSystemInBlend] = useState<boolean>(() => localStorage.getItem('hs-system-blend') === 'true');
  const [switchRetroDate, setSwitchRetroDate] = useState<string>('');
  const [switchEndDate, setSwitchEndDate] = useState<string>('');
  const [switchNotes, setSwitchNotes] = useState('');
  const [switchSpoons, setSwitchSpoons] = useState<number>(12);
  const [switchMoods, setSwitchMoods] = useState<string[]>([]);
  const [wheelEmotion, setWheelEmotion] = useState<{name: string; color: string; desc: string; intensity: number} | null>(null);
  const [wheelHistory, setWheelHistory] = useState<{name: string; color: string; intensity: number; time: string; alter: string; date: string}[]>([]);
  const [wheelDotPos, setWheelDotPos] = useState<{x: number; y: number} | null>(null);
  const [wheelIntensity, setWheelIntensity] = useState<number>(3);

  const [journalTitleInput, setJournalTitleInput] = useState('');
  const [journalContentInput, setJournalContentInput] = useState('');
  const [journalImages, setJournalImages] = useState<string[]>([]);
  const [journalSearch, setJournalSearch] = useState('');

  // --- PluralKit & Navigation Dropdown States ---
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [sosMode, setSosMode] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<{id: string; name: string; phone: string}[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editContactName, setEditContactName] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [settingsFontOpen, setSettingsFontOpen] = useState(false);
  const [settingsThemeOpen, setSettingsThemeOpen] = useState(false);
  const [settingsCustomThemeOpen, setSettingsCustomThemeOpen] = useState(false);
  const [customThemeColors, setCustomThemeColors] = useState<{
    accent: string; bg: string; card: string; text: string; border: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('hs-custom-theme');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // --- Notifications ---
  const [notifBrowser, setNotifBrowser] = useState<boolean>(() => localStorage.getItem('hs-notif-browser') === 'true');
  const [notifToast, setNotifToast] = useState<boolean>(() => localStorage.getItem('hs-notif-toast') !== 'false'); // activé par défaut
  // Rappel d'hydratation façon Plant Nanny : opt-in séparé, s'appuie sur le Jardin de l'Éco-Système
  const [hydroReminderOn, setHydroReminderOn] = useState<boolean>(() => localStorage.getItem('hs-hydro-reminder-on') === 'true');
  // Intervalle en minutes (remplace l'ancien réglage en heures uniquement) — reprend l'ancienne valeur si elle existe
  const [hydroIntervalMinutes, setHydroIntervalMinutes] = useState<number>(() => {
    const stored = localStorage.getItem('hs-hydro-interval-minutes');
    if (stored) return Number(stored);
    const legacyHours = localStorage.getItem('hs-hydro-interval');
    return legacyHours ? Num