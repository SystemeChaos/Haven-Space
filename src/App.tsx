import MappingPage, { loadMapping, saveMapping, MappingRelation, MappingNode, MappingData, RELATION_CONFIG } from './MappingPage';
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
} from 'lucide-react';
import { AlterRole, Gender, Sexuality, Trait, PersonalityTrait, Disorder, ROLE_CONFIGS, GENDER_COLORS, SEXUALITY_COLORS, ShapeType, PatternType, PatternLayer, Decoration, GENDER_CATEGORIES, SEXUALITY_CATEGORIES, TraitDecoration, Theme, SavedAlter, CustomField, CustomRole, CustomTrait, CustomDisorder, Subsystem, ParallelSystem, ChatMessage, DirectMessage, DirectConversation, SwitchLog, JournalEntry } from './types';
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

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
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
  const [mainSystemName, setMainSystemName] = useState<string>(() => {
    return localStorage.getItem('mainSystemName') || (lang === 'fr' ? 'Système Principal' : 'Primary System');
  });

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
  const [wheelHistory, setWheelHistory] = useState<{name: string; color: string; intensity: number; time: string; alter: string; date: string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('wheelHistory') || '[]'); } catch { return []; }
  });
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
  const [trustedContacts, setTrustedContacts] = useState<{id: string; name: string; phone: string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('trustedContacts') || '[]'); } catch { return []; }
  });
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
    return legacyHours ? Number(legacyHours) * 60 : 120;
  });
  useEffect(() => { localStorage.setItem('hs-hydro-reminder-on', String(hydroReminderOn)); }, [hydroReminderOn]);
  useEffect(() => { localStorage.setItem('hs-hydro-interval-minutes', String(hydroIntervalMinutes)); }, [hydroIntervalMinutes]);
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

  // Utilisé par les sous-pages (ex : PlanningPage) qui demandent la permission en contexte —
  // garde le toggle "Notifications navigateur" des Paramètres synchronisé avec la vraie permission.
  const enableBrowserNotifFromChild = async () => {
    const granted = await requestBrowserNotifPermission();
    if (granted) {
      setNotifBrowser(true);
      localStorage.setItem('hs-notif-browser', 'true');
    }
    return granted;
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

  // --- Verrouillage par code PIN ---
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash.toString(36);
  };

  const [pinEnabled, setPinEnabled] = useState<boolean>(() => localStorage.getItem('hs-pin-enabled') === 'true');
  const [pinHash, setPinHash] = useState<string>(() => localStorage.getItem('hs-pin-hash') || '');
  const [pinQuestion, setPinQuestion] = useState<string>(() => localStorage.getItem('hs-pin-question') || '');
  const [pinAnswerHash, setPinAnswerHash] = useState<string>(() => localStorage.getItem('hs-pin-answer-hash') || '');
  const [isLocked, setIsLocked] = useState<boolean>(() => localStorage.getItem('hs-pin-enabled') === 'true');
  const [pinBannerDismissed, setPinBannerDismissed] = useState<boolean>(() => localStorage.getItem('hs-pin-banner-dismissed') === 'true');
  const dismissPinBanner = () => {
    localStorage.setItem('hs-pin-banner-dismissed', 'true');
    setPinBannerDismissed(true);
  };

  // Verrouillage auto quand l'app repasse en arrière-plan
  useEffect(() => {
    if (!pinEnabled) return;
    const handleVisibility = () => {
      if (document.hidden) setIsLocked(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pinEnabled]);

  // Configuration du PIN (depuis les paramètres)
  const [pinSetupStep, setPinSetupStep] = useState<'idle' | 'enter' | 'confirm' | 'question'>('idle');
  const [pinSetupValue, setPinSetupValue] = useState('');
  const [pinSetupConfirm, setPinSetupConfirm] = useState('');
  const [pinSetupQuestion, setPinSetupQuestion] = useState('');
  const [pinSetupAnswer, setPinSetupAnswer] = useState('');
  const [pinSetupError, setPinSetupError] = useState('');

  const startPinSetup = () => {
    setPinSetupStep('enter');
    setPinSetupValue('');
    setPinSetupConfirm('');
    setPinSetupQuestion('');
    setPinSetupAnswer('');
    setPinSetupError('');
  };

  const confirmPinSetup = () => {
    if (pinSetupValue.length < 4) {
      setPinSetupError(lang === 'fr' ? 'Le code doit faire au moins 4 chiffres.' : 'The code must be at least 4 digits.');
      return;
    }
    setPinSetupStep('confirm');
    setPinSetupError('');
  };

  const validatePinConfirm = () => {
    if (pinSetupConfirm !== pinSetupValue) {
      setPinSetupError(lang === 'fr' ? 'Les deux codes ne correspondent pas.' : "The two codes don't match.");
      setPinSetupConfirm('');
      return;
    }
    setPinSetupStep('question');
    setPinSetupError('');
  };

  const finalizePinSetup = () => {
    if (!pinSetupQuestion.trim() || !pinSetupAnswer.trim()) {
      setPinSetupError(lang === 'fr' ? "Renseigne une question et une réponse." : 'Please fill in a question and an answer.');
      return;
    }
    const hash = simpleHash(pinSetupValue);
    const answerHash = simpleHash(pinSetupAnswer.trim().toLowerCase());
    localStorage.setItem('hs-pin-enabled', 'true');
    localStorage.setItem('hs-pin-hash', hash);
    localStorage.setItem('hs-pin-question', pinSetupQuestion.trim());
    localStorage.setItem('hs-pin-answer-hash', answerHash);
    setPinEnabled(true);
    setPinHash(hash);
    setPinQuestion(pinSetupQuestion.trim());
    setPinAnswerHash(answerHash);
    setPinSetupStep('idle');
    setPinSetupValue('');
    setPinSetupConfirm('');
    setPinSetupQuestion('');
    setPinSetupAnswer('');
    setPinSetupError('');
  };

  const disablePin = () => {
    localStorage.removeItem('hs-pin-enabled');
    localStorage.removeItem('hs-pin-hash');
    localStorage.removeItem('hs-pin-question');
    localStorage.removeItem('hs-pin-answer-hash');
    setPinEnabled(false);
    setPinHash('');
    setPinQuestion('');
    setPinAnswerHash('');
    setIsLocked(false);
  };

  // Écran de verrouillage (saisie du code / question de secours)
  const [lockPinInput, setLockPinInput] = useState('');
  const [lockError, setLockError] = useState('');
  const [forgotPinMode, setForgotPinMode] = useState(false);
  const [forgotPinAnswer, setForgotPinAnswer] = useState('');

  const attemptUnlock = () => {
    if (simpleHash(lockPinInput) === pinHash) {
      setIsLocked(false);
      setLockPinInput('');
      setLockError('');
      setForgotPinMode(false);
      setForgotPinAnswer('');
    } else {
      setLockError(lang === 'fr' ? 'Code incorrect.' : 'Incorrect code.');
      setLockPinInput('');
    }
  };

  const attemptForgotPinUnlock = () => {
    if (simpleHash(forgotPinAnswer.trim().toLowerCase()) === pinAnswerHash) {
      // Réponse correcte : on retire le verrou pour que la personne puisse en redéfinir un nouveau depuis les paramètres
      disablePin();
    } else {
      setLockError(lang === 'fr' ? 'Réponse incorrecte.' : 'Incorrect answer.');
      setForgotPinAnswer('');
    }
  };
  const [pkError, setPkError] = useState<string | null>(null);
  const [pkSuccess, setPkSuccess] = useState<string | null>(null);
  const [isExportingPkId, setIsExportingPkId] = useState<string | null>(null);

  // --- JSON Synchronisation / Backup States ---
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);
  const [jsonDragOver, setJsonDragOver] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<any | null>(null);

  // --- DID LocalStorage Tabs & State ---
  const [currentTab, setCurrentTab] = useState<'home' | 'creator' | 'system' | 'chat' | 'switch' | 'mapping' | 'journal' | 'messaging' | 'grounding' | 'relax' | 'health' | 'pluralkit' | 'planning'>('home');
  // Mémorise l'onglet d'origine quand on charge une fiche dans le créateur,
  // pour que le bouton "retour" ramène là où on était plutôt qu'au dashboard.
  const [creatorReturnTab, setCreatorReturnTab] = useState<typeof currentTab | null>(null);
  const [editingAlterId, setEditingAlterId] = useState<string | null>(null);
  const [saveConflictAlter, setSaveConflictAlter] = useState<SavedAlter | null>(null);
  
  const [savedAlters, setSavedAlters] = useState<SavedAlter[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedAlters') || '[]');
    } catch {
      return [];
    }
  });

  // --- Onboarding (carrousel de bienvenue) ---
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (localStorage.getItem('hs-onboarding-seen') === 'true') return false;
    try {
      const existing = JSON.parse(localStorage.getItem('savedAlters') || '[]');
      return existing.length === 0;
    } catch {
      return true;
    }
  });
  const [onboardingStep, setOnboardingStep] = useState(0);
  const closeOnboarding = () => {
    localStorage.setItem('hs-onboarding-seen', 'true');
    setShowOnboarding(false);
    setOnboardingStep(0);
  };
  const restartOnboarding = () => {
    setOnboardingStep(0);
    setShowOnboarding(true);
  };

  const [subsystems, setSubsystems] = useState<Subsystem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('subsystems') || '[]');
    } catch {
      return [];
    }
  });

  // --- Rôles personnalisés (définis par l'utilisateur, en plus des rôles fixes) ---
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('customRoles') || '[]');
    } catch {
      return [];
    }
  });

  // --- Traits personnalisés (définis par l'utilisateur, en plus des traits fixes) ---
  const [customTraits, setCustomTraits] = useState<CustomTrait[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('customTraits') || '[]');
    } catch {
      return [];
    }
  });

  // --- Troubles personnalisés (définis par l'utilisateur, en plus des troubles fixes) ---
  const [customDisorders, setCustomDisorders] = useState<CustomDisorder[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('customDisorders') || '[]');
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
  // Relations du mapping — pour affichage en temps réel sur les fiches
  const [mappingData, setMappingData] = useState<MappingData>(() => loadMapping(activeSystemId));
  // Grande liste de ~32 000 noms de couleurs (chargée à la demande, une seule fois)
  const [bigColorNames, setBigColorNames] = useState<{ name: string; hex: string }[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    const basePath = ((import.meta as any).env?.BASE_URL as string) || '/';
    fetch(`${basePath}colornames.json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (!cancelled && Array.isArray(data)) setBigColorNames(data); })
      .catch(() => { /* silencieux — on retombe sur la petite liste intégrée */ });
    return () => { cancelled = true; };
  }, []);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeSubsystemView, setActiveSubsystemView] = useState<string | null>(null);
  const [editingSubsystemNameId, setEditingSubsystemNameId] = useState<string | null>(null);
  const [editingSubsystemNameValue, setEditingSubsystemNameValue] = useState('');
  const [creatorSystemId, setCreatorSystemId] = useState<string>('');
  const [creatorSubsystemId, setCreatorSubsystemId] = useState<string>('');
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
  const [convSearch, setConvSearch] = useState('');
  const [convSearchOpen, setConvSearchOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgImageUrlInput, setMsgImageUrlInput] = useState<string | null>(null); // null = fermé, string = panneau ouvert avec sa valeur
  const [msgSenderId, setMsgSenderId] = useState<string>('');
  // Suivi des messages "lus" par conversation (dernier message vu depuis le point de vue du destinataire)
  const [lastSeenMsgIdByConv, setLastSeenMsgIdByConv] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('hs-dm-last-seen') || '{}'); } catch { return {}; }
  });
  const [dmToast, setDmToast] = useState<{ id: string; convId: string; recipientId: string; recipientName: string; recipientAvatar?: string; senderName: string } | null>(null);
  const [showNewConvPanel, setShowNewConvPanel] = useState(false);
  const [newConvAlter1, setNewConvAlter1] = useState<string>('');
  const [newConvAlter2, setNewConvAlter2] = useState<string>('');
  const [newConvAlter1Open, setNewConvAlter1Open] = useState(false);
  const [newConvAlter1Search, setNewConvAlter1Search] = useState('');
  const [newConvAlter2Open, setNewConvAlter2Open] = useState(false);
  const [newConvAlter2Search, setNewConvAlter2Search] = useState('');

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

  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
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
    localStorage.setItem('customRoles', JSON.stringify(customRoles));
  }, [customRoles]);

  useEffect(() => {
    localStorage.setItem('customTraits', JSON.stringify(customTraits));
  }, [customTraits]);

  useEffect(() => {
    localStorage.setItem('customDisorders', JSON.stringify(customDisorders));
  }, [customDisorders]);

  useEffect(() => {
    localStorage.setItem('parallelSystems', JSON.stringify(parallelSystems));
  }, [parallelSystems]);

  useEffect(() => {
    localStorage.setItem('activeSystemId', activeSystemId);
  }, [activeSystemId]);

  useEffect(() => {
    localStorage.setItem('hs-system-blend', String(systemInBlend));
  }, [systemInBlend]);

  // Recharge les relations du mapping : au changement de système, et à chaque retour
  // sur un onglet affichant des fiches, pour refléter les modifs faites depuis l'onglet Mapping.
  useEffect(() => {
    setMappingData(loadMapping(activeSystemId));
  }, [activeSystemId, currentTab]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('heaven_space_mapping')) {
        setMappingData(loadMapping(activeSystemId));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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
    localStorage.setItem('hs-dm-last-seen', JSON.stringify(lastSeenMsgIdByConv));
  }, [lastSeenMsgIdByConv]);

  // Marque le dernier message d'une conversation comme "lu" uniquement quand l'alter sélectionné
  // comme "Qui écrit" est le destinataire de ce message (donc pas l'expéditeur) — comme si on
  // "devenait" cet alter et qu'on prenait connaissance du message qui lui est adressé.
  useEffect(() => {
    if (currentTab === 'messaging' && activeConvId && msgSenderId) {
      const lastMsg = directMessages.filter(m => m.conversationId === activeConvId).at(-1);
      if (lastMsg && lastMsg.senderAlterId !== msgSenderId) {
        setLastSeenMsgIdByConv(prev => prev[activeConvId] === lastMsg.id ? prev : { ...prev, [activeConvId]: lastMsg.id });
      }
    }
  }, [currentTab, activeConvId, msgSenderId, directMessages]);

  // Détecte un message pas encore "lu" sur une conversation qu'on ne regarde pas actuellement,
  // et déclenche un toast de notification.
  useEffect(() => {
    if (directMessages.length === 0) return;
    const latest = [...directMessages].sort((a, b) => b.timestamp - a.timestamp)[0];
    const isCurrentlyViewing = currentTab === 'messaging' && activeConvId === latest.conversationId;
    const alreadySeen = lastSeenMsgIdByConv[latest.conversationId] === latest.id;
    if (isCurrentlyViewing || alreadySeen) return;
    if (dmToast?.id === latest.id) return;
    const conv = conversations.find(c => c.id === latest.conversationId);
    if (!conv) return;
    const recipientId = conv.participantIds.find(id => id !== latest.senderAlterId);
    const sender = savedAlters.find(a => a.id === latest.senderAlterId);
    const recipient = savedAlters.find(a => a.id === recipientId);
    if (!sender || !recipient) return;
    setDmToast({
      id: latest.id,
      convId: conv.id,
      recipientId: recipient.id,
      recipientName: recipient.alterName,
      recipientAvatar: recipient.profileImage,
      senderName: sender.alterName,
    });
  }, [directMessages, currentTab, activeConvId, lastSeenMsgIdByConv]);

  // Le toast reste affiché tant qu'il n'a pas été lu (via le clic dessus) ou fermé manuellement —
  // sauf si le message a été marqué comme lu par un autre chemin (ex: on est allé lire la conversation
  // directement depuis l'onglet messagerie sans passer par le toast).
  useEffect(() => {
    if (!dmToast) return;
    if (lastSeenMsgIdByConv[dmToast.convId] === dmToast.id) {
      setDmToast(null);
    }
  }, [dmToast, lastSeenMsgIdByConv]);

  // Vérifie toutes les 30s si un rappel de planning doit se déclencher — au niveau racine de l'app,
  // pour continuer à fonctionner même quand on n'est pas sur l'onglet Planning.
  useEffect(() => {
    const check = () => {
      if (!notifBrowser || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      const now = Date.now();
      const planningEntries = loadPlanning(activeSystemId);
      let remindedIds: string[] = [];
      try { remindedIds = JSON.parse(localStorage.getItem(REMINDED_STORAGE_KEY) || '[]'); } catch { /* ignore */ }
      let changed = false;
      planningEntries.forEach(en => {
        if (!en.time || !en.reminderMinutes || remindedIds.includes(en.id)) return;
        const target = new Date(`${en.date}T${en.time}:00`).getTime();
        const triggerAt = target - en.reminderMinutes * 60000;
        if (now >= triggerAt && now < target) {
          const notif = new Notification(lang === 'fr' ? '✦ Rappel de planning' : '✦ Planning reminder', {
            body: `${en.time} — ${en.text}`,
            icon: '/icon-192.png',
          });
          notif.onclick = () => {
            window.focus();
            setCurrentTab('planning');
            notif.close();
          };
          remindedIds.push(en.id);
          changed = true;
        }
      });
      if (changed) localStorage.setItem(REMINDED_STORAGE_KEY, JSON.stringify(remindedIds));
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [activeSystemId, lang, notifBrowser]);

  useEffect(() => {
    localStorage.setItem('switchLogs', JSON.stringify(switchLogs));
  }, [switchLogs]);

  useEffect(() => {
    localStorage.setItem('wheelHistory', JSON.stringify(wheelHistory));
  }, [wheelHistory]);

  useEffect(() => {
    localStorage.setItem('trustedContacts', JSON.stringify(trustedContacts));
  }, [trustedContacts]);

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
          selectedRoles: cleanAlterRoles(parsed.roles.length > 0 ? parsed.roles : existing?.selectedRoles),
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
          systemId: existing?.systemId || activeSystemId,
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
        parallelSystems,
        customRoles,
        customTraits,
        customDisorders,
        chatMessages,
        conversations,
        directMessages,
        switchLogs,
        journalEntries,
        planningEntries: loadPlanning(activeSystemId),
        eisenhowerTasks: loadEisenhower(activeSystemId),
        medications,
        healthHistory,
        emergencyInfo,
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
      localStorage.setItem('hs-last-json-export', String(Date.now()));
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
        const parallelSystemsCount = Array.isArray(parsed.parallelSystems) ? parsed.parallelSystems.length : 0;
        const directMessagesCount = Array.isArray(parsed.directMessages) ? parsed.directMessages.length : 0;
        const healthCount = (Array.isArray(parsed.medications) ? parsed.medications.length : 0) + (Array.isArray(parsed.healthHistory) ? parsed.healthHistory.length : 0);

        if (altersCount === 0 && subsystemsCount === 0 && chatsCount === 0 && switchesCount === 0 && journalsCount === 0
          && parallelSystemsCount === 0 && directMessagesCount === 0 && healthCount === 0) {
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

      const importedParallelSystems = Array.isArray(data.parallelSystems) ? data.parallelSystems : [];
      setParallelSystems(importedParallelSystems);
      localStorage.setItem('parallelSystems', JSON.stringify(importedParallelSystems));

      const importedCustomRoles = Array.isArray(data.customRoles) ? data.customRoles : [];
      setCustomRoles(importedCustomRoles);
      localStorage.setItem('customRoles', JSON.stringify(importedCustomRoles));

      const importedCustomTraits = Array.isArray(data.customTraits) ? data.customTraits : [];
      setCustomTraits(importedCustomTraits);
      localStorage.setItem('customTraits', JSON.stringify(importedCustomTraits));

      const importedCustomDisorders = Array.isArray(data.customDisorders) ? data.customDisorders : [];
      setCustomDisorders(importedCustomDisorders);
      localStorage.setItem('customDisorders', JSON.stringify(importedCustomDisorders));

      const importedConversations = Array.isArray(data.conversations) ? data.conversations : [];
      setConversations(importedConversations);
      localStorage.setItem('hs-conversations', JSON.stringify(importedConversations));

      const importedDirectMessages = Array.isArray(data.directMessages) ? data.directMessages : [];
      setDirectMessages(importedDirectMessages);
      localStorage.setItem('hs-direct-messages', JSON.stringify(importedDirectMessages));

      const importedMedications = Array.isArray(data.medications) ? data.medications : [];
      setMedications(importedMedications);
      localStorage.setItem('hs-health-meds', JSON.stringify(importedMedications));

      const importedHealthHistory = Array.isArray(data.healthHistory) ? data.healthHistory : [];
      setHealthHistory(importedHealthHistory);
      localStorage.setItem('hs-health-history', JSON.stringify(importedHealthHistory));

      if (data.emergencyInfo && typeof data.emergencyInfo === 'object') {
        setEmergencyInfo(data.emergencyInfo);
        localStorage.setItem('hs-health-emergency', JSON.stringify(data.emergencyInfo));
      }

      if (Array.isArray(data.planningEntries)) {
        savePlanning(data.planningEntries, activeSystemId);
      }
      if (Array.isArray(data.eisenhowerTasks)) {
        saveEisenhower(data.eisenhowerTasks, activeSystemId);
      }

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

      // 7. Systèmes parallèles : écrase les doublons par id ou nom, ajoute les nouveaux
      const currentParallelSystems = [...parallelSystems];
      const incomingParallelSystems = Array.isArray(data.parallelSystems) ? data.parallelSystems : [];
      incomingParallelSystems.forEach((incoming: ParallelSystem) => {
        const existingIndex = currentParallelSystems.findIndex((s: any) => s.id === incoming.id || s.name?.toLowerCase() === (incoming as any).name?.toLowerCase());
        if (existingIndex > -1) currentParallelSystems[existingIndex] = { ...currentParallelSystems[existingIndex], ...incoming };
        else currentParallelSystems.push(incoming);
      });
      setParallelSystems(currentParallelSystems);
      localStorage.setItem('parallelSystems', JSON.stringify(currentParallelSystems));

      // 7b. Rôles / traits / troubles personnalisés : écrase les doublons par id ou nom, ajoute les nouveaux
      const currentCustomRoles = [...customRoles];
      const incomingCustomRoles = Array.isArray(data.customRoles) ? data.customRoles : [];
      incomingCustomRoles.forEach((incoming: CustomRole) => {
        const existingIndex = currentCustomRoles.findIndex(r => r.id === incoming.id || r.name.toLowerCase() === incoming.name?.toLowerCase());
        if (existingIndex > -1) currentCustomRoles[existingIndex] = { ...currentCustomRoles[existingIndex], ...incoming };
        else currentCustomRoles.push(incoming);
      });
      setCustomRoles(currentCustomRoles);
      localStorage.setItem('customRoles', JSON.stringify(currentCustomRoles));

      const currentCustomTraits = [...customTraits];
      const incomingCustomTraits = Array.isArray(data.customTraits) ? data.customTraits : [];
      incomingCustomTraits.forEach((incoming: CustomTrait) => {
        const existingIndex = currentCustomTraits.findIndex(tr => tr.id === incoming.id || tr.name.toLowerCase() === incoming.name?.toLowerCase());
        if (existingIndex > -1) currentCustomTraits[existingIndex] = { ...currentCustomTraits[existingIndex], ...incoming };
        else currentCustomTraits.push(incoming);
      });
      setCustomTraits(currentCustomTraits);
      localStorage.setItem('customTraits', JSON.stringify(currentCustomTraits));

      const currentCustomDisorders = [...customDisorders];
      const incomingCustomDisorders = Array.isArray(data.customDisorders) ? data.customDisorders : [];
      incomingCustomDisorders.forEach((incoming: CustomDisorder) => {
        const existingIndex = currentCustomDisorders.findIndex(d => d.id === incoming.id || d.name.toLowerCase() === incoming.name?.toLowerCase());
        if (existingIndex > -1) currentCustomDisorders[existingIndex] = { ...currentCustomDisorders[existingIndex], ...incoming };
        else currentCustomDisorders.push(incoming);
      });
      setCustomDisorders(currentCustomDisorders);
      localStorage.setItem('customDisorders', JSON.stringify(currentCustomDisorders));

      // 8. Messagerie : fusion des conversations et des messages, uniques par id
      const currentConversations = [...conversations];
      const incomingConversations = Array.isArray(data.conversations) ? data.conversations : [];
      incomingConversations.forEach((incoming: DirectConversation) => {
        if (!currentConversations.some((c: any) => c.id === (incoming as any).id)) currentConversations.push(incoming);
      });
      setConversations(currentConversations);
      localStorage.setItem('hs-conversations', JSON.stringify(currentConversations));

      const currentDirectMessages = [...directMessages];
      const incomingDirectMessages = Array.isArray(data.directMessages) ? data.directMessages : [];
      incomingDirectMessages.forEach((incoming: DirectMessage) => {
        if (!currentDirectMessages.some((m: any) => m.id === (incoming as any).id)) currentDirectMessages.push(incoming);
      });
      currentDirectMessages.sort((a: any, b: any) => a.timestamp - b.timestamp);
      setDirectMessages(currentDirectMessages);
      localStorage.setItem('hs-direct-messages', JSON.stringify(currentDirectMessages));

      // 9. Santé : médicaments et antécédents fusionnés par id, infos d'urgence complétées si vides
      const currentMedications = [...medications];
      const incomingMedications = Array.isArray(data.medications) ? data.medications : [];
      incomingMedications.forEach((incoming: Medication) => {
        const existingIndex = currentMedications.findIndex(m => m.id === incoming.id);
        if (existingIndex > -1) currentMedications[existingIndex] = { ...currentMedications[existingIndex], ...incoming };
        else currentMedications.push(incoming);
      });
      setMedications(currentMedications);
      localStorage.setItem('hs-health-meds', JSON.stringify(currentMedications));

      const currentHealthHistory = [...healthHistory];
      const incomingHealthHistory = Array.isArray(data.healthHistory) ? data.healthHistory : [];
      incomingHealthHistory.forEach((incoming: HealthHistoryEntry) => {
        const existingIndex = currentHealthHistory.findIndex(h => h.id === incoming.id);
        if (existingIndex > -1) currentHealthHistory[existingIndex] = { ...currentHealthHistory[existingIndex], ...incoming };
        else currentHealthHistory.push(incoming);
      });
      setHealthHistory(currentHealthHistory);
      localStorage.setItem('hs-health-history', JSON.stringify(currentHealthHistory));

      if (data.emergencyInfo && typeof data.emergencyInfo === 'object') {
        const mergedEmergency: EmergencyInfo = { ...emergencyInfo };
        (Object.keys(data.emergencyInfo) as (keyof EmergencyInfo)[]).forEach(key => {
          const currentVal = mergedEmergency[key];
          if ((currentVal === '' || currentVal === undefined || currentVal === null) && data.emergencyInfo[key]) {
            (mergedEmergency as any)[key] = data.emergencyInfo[key];
          }
        });
        setEmergencyInfo(mergedEmergency);
        localStorage.setItem('hs-health-emergency', JSON.stringify(mergedEmergency));
      }

      // 10. Planning : fusion des entrées uniques par id
      const incomingPlanningEntries = Array.isArray(data.planningEntries) ? data.planningEntries : [];
      if (incomingPlanningEntries.length > 0) {
        const currentPlanningEntries = loadPlanning(activeSystemId);
        const mergedPlanningEntries = [...currentPlanningEntries];
        incomingPlanningEntries.forEach((incoming: PlanningEntry) => {
          if (!mergedPlanningEntries.some(p => p.id === incoming.id)) mergedPlanningEntries.push(incoming);
        });
        savePlanning(mergedPlanningEntries, activeSystemId);
      }

      // 11. Matrice d'Eisenhower : fusion des tâches uniques par id
      const incomingEisenhowerTasks = Array.isArray(data.eisenhowerTasks) ? data.eisenhowerTasks : [];
      if (incomingEisenhowerTasks.length > 0) {
        const currentEisenhowerTasks = loadEisenhower(activeSystemId);
        const mergedEisenhowerTasks = [...currentEisenhowerTasks];
        incomingEisenhowerTasks.forEach((incoming: EisenhowerTask) => {
          if (!mergedEisenhowerTasks.some(t => t.id === incoming.id)) mergedEisenhowerTasks.push(incoming);
        });
        saveEisenhower(mergedEisenhowerTasks, activeSystemId);
      }

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
    try {
      if (customThemeColors) localStorage.setItem('hs-custom-theme', JSON.stringify(customThemeColors));
      else localStorage.removeItem('hs-custom-theme');
    } catch { /* stockage indisponible, on ignore */ }
  }, [customThemeColors]);

  useEffect(() => {
    const root = document.documentElement;
    const styles: Record<string, string> = { ...(getThemeStyles() as any) };

    // Surcharge avec les couleurs du thème personnalisé, si défini
    if (customThemeColors) {
      if (customThemeColors.bg) styles['--color-app-bg'] = customThemeColors.bg;
      if (customThemeColors.card) styles['--color-app-card'] = customThemeColors.card;
      if (customThemeColors.text) styles['--color-app-text'] = customThemeColors.text;
      if (customThemeColors.border) styles['--color-app-border'] = customThemeColors.border;
      if (customThemeColors.accent) styles['--color-app-accent'] = customThemeColors.accent;
      // Dérive le "muted" à partir du texte, et le contraste du texte sur l'accent
      if (customThemeColors.text) {
        const [tr, tg, tb] = hexToRgbTriplet(customThemeColors.text);
        styles['--color-app-muted'] = `rgba(${tr}, ${tg}, ${tb}, 0.6)`;
      }
      if (customThemeColors.accent) {
        const [ar, ag, ab] = hexToRgbTriplet(customThemeColors.accent);
        const luminance = (0.299 * ar + 0.587 * ag + 0.114 * ab) / 255;
        styles['--color-app-accent-text'] = luminance > 0.6 ? '#1a1a1a' : '#ffffff';
      }
    }

    // Reset properties first to ensure clean state
    ['--color-app-bg', '--color-app-text', '--color-app-card', '--color-app-border', '--color-app-accent', '--color-app-muted', '--color-app-accent-text'].forEach(prop => {
      root.style.removeProperty(prop);
    });

    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme, customThemeColors]);

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
    setSelectedRoles(cleanAlterRoles(state.selectedRoles));
    
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
  const [showMeaningCard, setShowMeaningCard] = useState(false);
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

      // Sauvegarder/libérer overflow des descendants — sauf ceux qui tronquent intentionnellement
      // du texte avec des "..." (ellipsis), pour ne pas les laisser s'étaler hors de leur largeur prévue.
      const savedOverflow: string[] = [];
      const savedMaxHeight: string[] = [];
      const allEls = Array.from(node.querySelectorAll<HTMLElement>('*'));
      allEls.forEach(el => {
        savedOverflow.push(el.style.overflow);
        savedMaxHeight.push(el.style.maxHeight);
        const computed = window.getComputedStyle(el);
        const hasEllipsisTruncation = computed.textOverflow === 'ellipsis' || computed.whiteSpace === 'nowrap';
        if (!hasEllipsisTruncation) {
          el.style.overflow = 'visible';
        }
        el.style.maxHeight = 'none';
      });

      // crossOrigin sur les images
      node.querySelectorAll('img').forEach((img: HTMLImageElement) => { img.crossOrigin = 'anonymous'; });

      // Double requestAnimationFrame : garantit que le navigateur a bien fini de recalculer
      // la mise en page (reflow) avant qu'on mesure scrollHeight — un simple délai fixe peut
      // parfois être trop court quand il y a beaucoup de texte à re-disposer.
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 200));

      // Lire la couleur de fond réelle depuis les CSS vars du document
      const docStyle = getComputedStyle(document.documentElement);
      const themeBg = docStyle.getPropertyValue('--color-app-bg').trim() || '#ffffff';

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        backgroundColor: themeBg || '#ffffff',
        skipAutoScale: true,
        // Une image cassée (lien mort, hébergeur qui bloque le CORS...) dans la description
        // ou les notes ne doit pas faire planter tout l'export : on la remplace par un pixel
        // transparent au lieu de laisser toPng lever une erreur globale.
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
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

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `alter-card-${alterName || 'creator'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('oops, something went wrong!', err);
      alert(lang === 'fr'
        ? "Le téléchargement a échoué. Réessaie, et si ça persiste, vérifie qu'aucune extension du navigateur (bloqueur de pubs, etc.) ne bloque le téléchargement."
        : "The download failed. Try again, and if it keeps happening, check that no browser extension (ad blocker, etc.) is blocking the download.");
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
    selectedCustomRoleIds.forEach(roleId => {
      const role = customRoles.find(r => r.id === roleId);
      if (role) content += `- ${role.name}${role.definition ? `: ${role.definition}` : ''}\n`;
    });
    
    content += `\nGender: ${selectedGenders.map(g => `${t.genders[g as keyof typeof t.genders]} (${t.genderData[g as keyof typeof t.genderData] || ''})`).join(', ')}\n`;
    content += `Sexuality: ${selectedSexualities.map(s => `${t.sexualityNames[s as keyof typeof t.sexualityNames]} (${t.sexualityData[s as keyof typeof t.sexualityData] || ''})`).join(', ')}\n`;
    
    if (traitDecorations.length > 0 || selectedCustomTraitIds.length > 0 || selectedCustomDisorderIds.length > 0) {
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
      selectedCustomTraitIds.forEach(traitId => {
        const trait = customTraits.find(tr => tr.id === traitId);
        if (trait) content += `- ${trait.name}${trait.definition ? `: ${trait.definition}` : ''}\n`;
      });
      selectedCustomDisorderIds.forEach(disorderId => {
        const disorder = customDisorders.find(d => d.id === disorderId);
        if (disorder) content += `- ${disorder.name}${disorder.definition ? `: ${disorder.definition}` : ''}\n`;
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
    if (desc.length <= 300000) {
      setDescription(desc);
      setTimeout(saveToHistory, 0);
    }
  };

  const updateInternalNotes = (notes: string) => {
    if (notes.length <= 300000) {
      setInternalNotes(notes);
      setTimeout(saveToHistory, 0);
    }
  };

  // --- DID System Management Handlers ---
  const [openGroundingSections, setOpenGroundingSections] = useState<string[]>([]);
  // --- Détente (section anti-dissociation) ---
  const [activeRelaxTool, setActiveRelaxTool] = useState<string | null>(null);
  const [breathingRhythm, setBreathingRhythm] = useState<'box' | '478'>('box');
  const [breathingSpeed, setBreathingSpeed] = useState<number>(4); // secondes par phase (mode box)
  const [breathingRunning, setBreathingRunning] = useState<boolean>(false);
  const [breathingPhaseIdx, setBreathingPhaseIdx] = useState<number>(0);

  const BOX_BREATHING_LABELS_FR = ['Inspire', 'Retiens', 'Expire', 'Retiens'];
  const BOX_BREATHING_LABELS_EN = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const getBreathingPhases = () => breathingRhythm === 'box'
    ? [
        { duration: breathingSpeed, scale: 1.3 },
        { duration: breathingSpeed, scale: 1.3 },
        { duration: breathingSpeed, scale: 0.72 },
        { duration: breathingSpeed, scale: 0.72 },
      ]
    : [
        { duration: 4, scale: 1.3 },
        { duration: 7, scale: 1.3 },
        { duration: 8, scale: 0.72 },
      ];

  useEffect(() => {
    if (!breathingRunning) return;
    const phases = getBreathingPhases();
    const timer = setTimeout(() => {
      setBreathingPhaseIdx(i => (i + 1) % phases.length);
    }, phases[breathingPhaseIdx % phases.length].duration * 1000);
    return () => clearTimeout(timer);
  }, [breathingRunning, breathingPhaseIdx, breathingRhythm, breathingSpeed]);

  // --- Fidgets ---
  const [fidgetSubTool, setFidgetSubTool] = useState<'sand' | 'bubbles' | 'coloring'>('sand');
  const [sandColorMode, setSandColorMode] = useState<'sand' | 'snow' | 'waves'>('sand');
  const [poppedBubbles, setPoppedBubbles] = useState<Set<number>>(new Set());
  const [mandalaColors, setMandalaColors] = useState<Record<string, string>>({});
  const [mandalaTemplate, setMandalaTemplate] = useState<'flower' | 'star' | 'rings'>('flower');
  const fidgetCanvasRef = useRef<HTMLCanvasElement>(null);
  const fidgetDrawingRef = useRef<boolean>(false);
  const MANDALA_PALETTE = ['#F3D9DF', '#D9E7F3', '#DDF3D9', '#F3ECD9', '#E6D9F3', '#F3D9EE', '#D9F3EF', '#F3E0D9', '#EAD9F3', '#F3D9D9', '#D9F3E0', '#E0E0F3'];
  // Trois modèles de mandala, chacun avec sa propre disposition et ses propres formes.
  const getMandalaPoints = (template: 'flower' | 'star' | 'rings'): { key: string; x: number; y: number; size: number; shape: 'circle' | 'square' | 'diamond' }[] => {
    if (template === 'star') {
      const pts: { key: string; x: number; y: number; size: number; shape: 'circle' | 'square' | 'diamond' }[] = [
        { key: 'center', x: 128, y: 128, size: 44, shape: 'diamond' },
      ];
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        pts.push({ key: `p${i}`, x: 128 + 95 * Math.cos(angle), y: 128 + 95 * Math.sin(angle), size: 38, shape: 'diamond' });
      }
      return pts;
    }
    if (template === 'rings') {
      const pts: { key: string; x: number; y: number; size: number; shape: 'circle' | 'square' | 'diamond' }[] = [
        { key: 'center', x: 128, y: 128, size: 28, shape: 'square' },
      ];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        pts.push({ key: `in${i}`, x: 128 + 50 * Math.cos(angle), y: 128 + 50 * Math.sin(angle), size: 24, shape: 'square' });
      }
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        pts.push({ key: `out${i}`, x: 128 + 98 * Math.cos(angle), y: 128 + 98 * Math.sin(angle), size: 24, shape: 'square' });
      }
      return pts;
    }
    // flower (par défaut)
    const pts: { key: string; x: number; y: number; size: number; shape: 'circle' | 'square' | 'diamond' }[] = [
      { key: 'center', x: 128, y: 128, size: 48, shape: 'circle' },
    ];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      pts.push({ key: `p${i}`, x: 128 + 90 * Math.cos(angle), y: 128 + 90 * Math.sin(angle), size: 36, shape: 'circle' });
    }
    return pts;
  };
  const SAND_COLORS: Record<string, string> = { sand: '#C9A26D', snow: '#BFE3FF', waves: '#3B82F6' };
  const BUBBLE_COUNT = 30;

  // Effet de fondu progressif — réservé au Sable et à la Neige (l'eau a sa propre animation d'ondes).
  // Repeint une fine couche translucide par-dessus les traits existants pour qu'ils s'estompent
  // doucement, comme du sable qu'on lisse.
  useEffect(() => {
    if (currentTab !== 'relax' || activeRelaxTool !== 'fidgets' || fidgetSubTool !== 'sand' || sandColorMode === 'waves') return;
    const canvas = fidgetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cardColor = getComputedStyle(document.documentElement).getPropertyValue('--color-app-card').trim() || '#ffffff';
    const [fr, fg, fb] = hexToRgbTriplet(cssColorToHex(cardColor));
    const interval = setInterval(() => {
      ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, 0.035)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 120);
    return () => clearInterval(interval);
  }, [currentTab, activeRelaxTool, fidgetSubTool, sandColorMode]);

  // On repart d'un canevas propre à chaque changement de matière — sable/neige et eau
  // n'utilisent pas du tout le même moteur de rendu.
  useEffect(() => {
    const canvas = fidgetCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    fidgetRipplesRef.current = [];
  }, [sandColorMode]);

  const getFidgetCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = fidgetCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const fidgetLastPointRef = useRef<{ x: number; y: number } | null>(null);
  // Sable et neige ont chacun leur propre grain/texture, pas juste une couleur différente.
  const paintFidgetDot = (x: number, y: number, radius: number, ctx: CanvasRenderingContext2D) => {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    if (sandColorMode === 'snow') {
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.7, SAND_COLORS.snow);
      grad.addColorStop(1, 'transparent');
    } else {
      grad.addColorStop(0, SAND_COLORS.sand);
      grad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    // Grain (sable) ou paillettes (neige) semés aléatoirement dans le trait
    const grainCount = sandColorMode === 'snow' ? 2 : 4;
    for (let i = 0; i < grainCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.85;
      ctx.fillStyle = sandColorMode === 'snow'
        ? 'rgba(255,255,255,0.9)'
        : (Math.random() > 0.5 ? 'rgba(120,90,50,0.35)' : 'rgba(255,240,210,0.5)');
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const drawFidgetDot = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = fidgetCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { x, y } = getFidgetCanvasPoint(e);
    // La pression (stylet, ou certains écrans tactiles) agrandit le trait ; à défaut, taille moyenne.
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    const radius = 9 + pressure * 20;
    const last = fidgetLastPointRef.current;
    if (last) {
      // On comble l'espace entre le dernier point et celui-ci pour un trait continu et fluide,
      // au lieu de tampons isolés qui paraissent saccadés lors d'un geste rapide.
      const dist = Math.hypot(x - last.x, y - last.y);
      const steps = Math.max(1, Math.ceil(dist / (radius * 0.35)));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        paintFidgetDot(last.x + (x - last.x) * t, last.y + (y - last.y) * t, radius, ctx);
      }
    } else {
      paintFidgetDot(x, y, radius, ctx);
    }
    fidgetLastPointRef.current = { x, y };
  };

  // --- Mode Eau : de vraies ondes qui s'étendent et s'évanouissent au contact du doigt ---
  const fidgetRipplesRef = useRef<{ x: number; y: number; start: number }[]>([]);
  const fidgetLastRippleTimeRef = useRef(0);
  const RIPPLE_LIFESPAN = 1600;
  const spawnFidgetRipple = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const now = performance.now();
    if (now - fidgetLastRippleTimeRef.current < 90) return; // on limite la fréquence des ondes générées
    fidgetLastRippleTimeRef.current = now;
    const { x, y } = getFidgetCanvasPoint(e);
    fidgetRipplesRef.current.push({ x, y, start: now });
  };
  const handleFidgetPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sandColorMode === 'waves') spawnFidgetRipple(e);
    else drawFidgetDot(e);
  };

  // Boucle d'animation de l'eau : fond qui ondule légèrement en continu + ondes déclenchées au doigt.
  useEffect(() => {
    if (currentTab !== 'relax' || activeRelaxTool !== 'fidgets' || fidgetSubTool !== 'sand' || sandColorMode !== 'waves') return;
    const canvas = fidgetCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let rafId: number;
    const tick = () => {
      const now = performance.now();
      fidgetRipplesRef.current = fidgetRipplesRef.current.filter(r => now - r.start < RIPPLE_LIFESPAN);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const waterGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      waterGrad.addColorStop(0, 'rgba(59,130,246,0.10)');
      waterGrad.addColorStop(1, 'rgba(14,116,144,0.18)');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Léger clapotis de fond, toujours en mouvement
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      for (let row = 0; row < 8; row++) {
        const y0 = (row + 0.5) * (canvas.height / 8);
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 8) {
          const y = y0 + Math.sin(x / 24 + row + now / 900) * 3;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Ondes générées par le doigt
      fidgetRipplesRef.current.forEach(r => {
        const p = (now - r.start) / RIPPLE_LIFESPAN;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 6 + p * 60, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59,130,246,${(1 - p) * 0.5})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [currentTab, activeRelaxTool, fidgetSubTool, sandColorMode]);

  const toggleBubble = (i: number) => {
    if (poppedBubbles.has(i)) return;
    setPoppedBubbles(prev => new Set(prev).add(i));
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  const cycleMandalaColor = (key: string) => {
    setMandalaColors(prev => {
      const current = prev[key];
      const idx = current ? (MANDALA_PALETTE.indexOf(current) + 1) % MANDALA_PALETTE.length : 0;
      return { ...prev, [key]: MANDALA_PALETTE[idx] };
    });
  };

  // --- Éphémère : bulles qui montent à l'écran et qu'on éclate, chacune avec son propre pop ---
  type EphBubble = { id: number; x: number; size: number; duration: number; hue: number; drift: number };
  type EphPop = { id: number; x: number; y: number; size: number; hue: number };
  const EPHEMERAL_CONTAINER_HEIGHT = 384; // doit correspondre à la classe h-96 du conteneur
  const [ephemeralBubbles, setEphemeralBubbles] = useState<EphBubble[]>([]);
  const [ephemeralPops, setEphemeralPops] = useState<EphPop[]>([]);
  const ephemeralBubbleIdRef = useRef(0);
  const ephemeralPopIdRef = useRef(0);
  const ephemeralContainerRef = useRef<HTMLDivElement>(null);

  // Fait apparaître une nouvelle bulle régulièrement tant que l'outil est ouvert
  useEffect(() => {
    if (currentTab !== 'relax' || activeRelaxTool !== 'ephemeral') { setEphemeralBubbles([]); return; }
    const spawnBubble = () => {
      const size = 16 + Math.random() * 104; // 16 à 120px
      setEphemeralBubbles(prev => [...prev, {
        id: ephemeralBubbleIdRef.current++,
        x: 6 + Math.random() * 88,
        size,
        duration: 9.5 - (size / 120) * 4 + Math.random() * 2.5, // les grosses bulles montent un peu plus lentement
        hue: Math.floor(Math.random() * 360),
        drift: Math.random() * 34 - 17,
      }]);
    };
    spawnBubble();
    const interval = setInterval(spawnBubble, 750);
    return () => clearInterval(interval);
  }, [currentTab, activeRelaxTool]);

  // Gamme de handpan à 9 notes (D Kurd — gamme mineure douce, très utilisée pour son côté onirique)
  const HANDPAN_SCALE = [146.83, 220.00, 233.08, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // D3, A3, Bb3, C4, D4, E4, F4, G4, A4

  // Son de pop synthétisé (Web Audio) façon handpan : fondamentale + octave + quinte composée,
  // des harmoniques naturellement consonantes (comme un vrai handpan), attaque douce, longue résonance.
  const playBubblePop = (size: number) => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      // Petite bulle = note aiguë de la gamme, grosse bulle = note grave
      const idx = Math.max(0, Math.min(8, Math.round(8 - ((size - 16) / 104) * 8)));
      const freq = HANDPAN_SCALE[idx];

      const partials = [
        { ratio: 1, gain: 0.34, decay: 2.6 },  // fondamentale — corps chaud de la note
        { ratio: 2, gain: 0.15, decay: 1.9 },  // octave composée — le "shimmer" caractéristique du handpan
        { ratio: 3, gain: 0.05, decay: 1.1 },  // quinte composée — légèreté aérienne, sans dureté
      ];
      partials.forEach(p => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * p.ratio, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(p.gain, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + p.decay + 0.05);
      });

      // Petit "tak" très doux du bout du doigt sur la peau, filtré grave pour rester feutré
      const bufferSize = Math.floor(ctx.sampleRate * 0.015);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = freq * 2.5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {}
  };

  const popEphemeralBubble = (bubble: EphBubble, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = ephemeralContainerRef.current?.getBoundingClientRect();
    const relX = rect ? e.clientX - rect.left : bubble.x;
    const relY = rect ? e.clientY - rect.top : EPHEMERAL_CONTAINER_HEIGHT / 2;
    setEphemeralBubbles(prev => prev.filter(b => b.id !== bubble.id));
    playBubblePop(bubble.size);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const popId = ephemeralPopIdRef.current++;
    setEphemeralPops(prev => [...prev, { id: popId, x: relX, y: relY, size: bubble.size, hue: bubble.hue }]);
    setTimeout(() => setEphemeralPops(prev => prev.filter(p => p.id !== popId)), 320);
  };

  // --- Boîte à Souvenirs (partagée entre tous les alters du système) ---
  interface MemoryItem { id: string; text: string; elementType: 'bougie' | 'lanterne' | 'message' | 'papillon' | 'coffre'; authorAlterId?: string; timestamp: number; }
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('hs-memories') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('hs-memories', JSON.stringify(memories));
  }, [memories]);
  const [memoryFormOpen, setMemoryFormOpen] = useState(false);
  const [memoryDraftText, setMemoryDraftText] = useState('');
  const [memoryDraftElement, setMemoryDraftElement] = useState<MemoryItem['elementType']>('bougie');
  const [memoryDraftAuthorId, setMemoryDraftAuthorId] = useState<string>('');
  const [memoryAuthorOpen, setMemoryAuthorOpen] = useState(false);
  const [memoryAuthorSearch, setMemoryAuthorSearch] = useState('');
  const [revealedMemoryId, setRevealedMemoryId] = useState<string | null>(null);
  const MEMORY_ELEMENTS: { id: MemoryItem['elementType']; label: string; labelEn: string }[] = [
    { id: 'bougie', label: 'Bougie', labelEn: 'Candle' },
    { id: 'lanterne', label: 'Lanterne', labelEn: 'Lantern' },
    { id: 'message', label: 'Mot en bouteille', labelEn: 'Message in a bottle' },
    { id: 'papillon', label: 'Papillon', labelEn: 'Butterfly' },
    { id: 'coffre', label: 'Petit coffre', labelEn: 'Small chest' },
  ];
  const getMemoryElementIcon = (type: MemoryItem['elementType'], className: string) => {
    switch (type) {
      case 'bougie': return <Flame className={className} />;
      case 'lanterne': return <Lamp className={className} />;
      case 'message': return <Mail className={className} />;
      case 'coffre': return <Package className={className} />;
      case 'papillon': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M11 11c-1-1-2.5-1.5-4-1.5C5 9.5 3.5 11 3.5 13c0 1.5 1 2.5 2.5 3c-1.5 0.5-2.5 1.5-2.5 3c0 2 1.5 3.5 3.5 3.5c1.5 0 3-0.5 4-1.5" />
          <path d="M13 11c1-1 2.5-1.5 4-1.5c2 0 3.5 1.5 3.5 3.5c0 1.5-1 2.5-2.5 3c1.5 0.5 2.5 1.5 2.5 3c0 2-1.5 3.5-3.5 3.5c-1.5 0-3-0.5-4-1.5" />
          <path d="M12 10v10" />
          <circle cx="10.5" cy="7" r="0.5" />
          <circle cx="13.5" cy="7" r="0.5" />
        </svg>
      );
    }
  };
  const addMemory = () => {
    if (!memoryDraftText.trim()) return;
    const newMemory: MemoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      text: memoryDraftText.trim(),
      elementType: memoryDraftElement,
      authorAlterId: memoryDraftAuthorId || undefined,
      timestamp: Date.now(),
    };
    setMemories(prev => [...prev, newMemory]);
    setMemoryDraftText('');
    setMemoryDraftAuthorId('');
    setMemoryAuthorSearch('');
    setMemoryFormOpen(false);
  };
  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    if (revealedMemoryId === id) setRevealedMemoryId(null);
  };

  // --- Santé (carnet partagé du système : un seul corps, une seule santé) ---
  interface Medication { id: string; name: string; dosage: string; times: { time: string; period: 'AM' | 'PM' }[]; note: string; recurring: boolean; oneTimeDate: string; }
  interface HealthHistoryEntry { id: string; title: string; date: string; note: string; }
  interface EmergencyInfo { conditions: string; allergies: string; bloodType: string; note: string; showQuickAccess: boolean; }

  const [medications, setMedications] = useState<Medication[]>(() => {
    try { return JSON.parse(localStorage.getItem('hs-health-meds') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hs-health-meds', JSON.stringify(medications)); }, [medications]);

  // Vérifie toutes les 30s si un rappel de traitement doit se déclencher — même logique que le
  // rappel de planning : réguliers (chaque jour) ou ponctuels (une seule date, une seule fois).
  const MED_REMINDED_STORAGE_KEY = 'hs-med-reminded';
  useEffect(() => {
    const check = () => {
      if (!notifBrowser || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      let remindedKeys: string[] = [];
      try { remindedKeys = JSON.parse(localStorage.getItem(MED_REMINDED_STORAGE_KEY) || '[]'); } catch { /* ignore */ }
      let changed = false;
      medications.forEach(med => {
        if (!med.recurring && med.oneTimeDate && med.oneTimeDate !== todayStr) return;
        med.times.forEach((t, idx) => {
          const key = med.recurring ? `${med.id}-${idx}-${todayStr}` : `${med.id}-${idx}`;
          if (remindedKeys.includes(key)) return;
          const [hh, mm] = t.time.split(':').map(Number);
          if (Number.isNaN(hh) || Number.isNaN(mm)) return;
          const target = new Date(now);
          target.setHours(hh, mm, 0, 0);
          const diffMs = now.getTime() - target.getTime();
          if (diffMs >= 0 && diffMs < 60000) {
            const notif = new Notification(lang === 'fr' ? '✦ Rappel de traitement' : '✦ Medication reminder', {
              body: med.dosage ? `${med.name} — ${med.dosage}` : med.name,
              icon: '/icon-192.png',
            });
            notif.onclick = () => {
              window.focus();
              setCurrentTab('health');
              notif.close();
            };
            remindedKeys.push(key);
            changed = true;
          }
        });
      });
      if (changed) localStorage.setItem(MED_REMINDED_STORAGE_KEY, JSON.stringify(remindedKeys));
    };
    check();
    const medInterval = setInterval(check, 30000);
    return () => clearInterval(medInterval);
  }, [medications, lang, notifBrowser]);

  // Rappel d'hydratation : pas de "planning" à respecter, juste un intervalle glissant depuis le dernier
  // arrosage/verre d'eau. On évite la nuit (8h-22h) et on ne relance pas plus souvent que l'intervalle choisi.
  const HYDRO_REMINDED_KEY = 'hs-hydro-last-reminded';
  const HYDRO_WAKE_START_HOUR = 8;
  const HYDRO_WAKE_END_HOUR = 22;
  useEffect(() => {
    const check = () => {
      if (!notifBrowser || !hydroReminderOn || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      const now = new Date();
      if (now.getHours() < HYDRO_WAKE_START_HOUR || now.getHours() >= HYDRO_WAKE_END_HOUR) return;
      const intervalMs = Math.max(1, hydroIntervalMinutes) * 60000;
      const lastWater = Number(localStorage.getItem('hs-last-water-time') || '0');
      const lastReminded = Number(localStorage.getItem(HYDRO_REMINDED_KEY) || '0');
      if (now.getTime() - lastWater < intervalMs) return;
      if (now.getTime() - lastReminded < intervalMs) return;
      const notif = new Notification(lang === 'fr' ? '✦ Rappel d\'hydratation' : '✦ Hydration reminder', {
        body: lang === 'fr'
          ? "Ton jardin a soif — et toi, tu as bu récemment ? Va arroser une graine 💧"
          : 'Your garden is thirsty — have you had water lately? Go water a seed 💧',
        icon: '/icon-192.png',
        tag: 'hs-hydro-reminder',
      });
      notif.onclick = () => {
        window.focus();
        setCurrentTab('relax');
        setActiveRelaxTool('eco-system');
        setEcoBackground('jardin');
        notif.close();
      };
      localStorage.setItem(HYDRO_REMINDED_KEY, String(now.getTime()));
    };
    check();
    const hydroInterval = setInterval(check, 30000);
    return () => clearInterval(hydroInterval);
  }, [notifBrowser, hydroReminderOn, hydroIntervalMinutes, lang]);

  // Rappel de sauvegarde JSON : comme il n'y a ni compte ni cloud, l'export JSON est la seule
  // sauvegarde. On rappelle au plus une fois par jour si ça fait trop longtemps (7 jours).
  const EXPORT_REMINDER_DAYS = 7;
  useEffect(() => {
    const check = () => {
      if (!notifBrowser || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      if (savedAlters.length === 0) return; // rien à sauvegarder pour l'instant
      const lastExport = Number(localStorage.getItem('hs-last-json-export') || '0');
      const daysSinceExport = (Date.now() - lastExport) / (1000 * 60 * 60 * 24);
      if (daysSinceExport < EXPORT_REMINDER_DAYS) return;
      const todayStr = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem('hs-export-reminded-day') === todayStr) return;
      const notif = new Notification(lang === 'fr' ? '✦ Pense à sauvegarder' : '✦ Backup reminder', {
        body: lang === 'fr'
          ? "Ça fait un moment que tu n'as pas exporté ton système en JSON — c'est ta seule sauvegarde."
          : "It's been a while since your last JSON export — it's your only backup.",
        icon: '/icon-192.png',
        tag: 'hs-export-reminder',
      });
      // Clic sur la notif → ouvre l'app sur la section de sauvegarde JSON et y scrolle directement
      notif.onclick = () => {
        window.focus();
        setCurrentTab('pluralkit');
        setTimeout(() => {
          document.getElementById('json-backup-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        notif.close();
      };
      localStorage.setItem('hs-export-reminded-day', todayStr);
    };
    check();
    const exportInterval = setInterval(check, 60 * 60 * 1000); // vérifie toutes les heures
    return () => clearInterval(exportInterval);
  }, [notifBrowser, savedAlters.length, lang]);

  const [healthHistory, setHealthHistory] = useState<HealthHistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('hs-health-history') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hs-health-history', JSON.stringify(healthHistory)); }, [healthHistory]);

  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo>(() => {
    try { return JSON.parse(localStorage.getItem('hs-health-emergency') || 'null') || { conditions: '', allergies: '', bloodType: '', note: '', showQuickAccess: false }; } catch { return { conditions: '', allergies: '', bloodType: '', note: '', showQuickAccess: false }; }
  });
  useEffect(() => { localStorage.setItem('hs-health-emergency', JSON.stringify(emergencyInfo)); }, [emergencyInfo]);

  const [healthSubTab, setHealthSubTab] = useState<'traitements' | 'antecedents' | 'urgence'>('traitements');
  const [medFormOpen, setMedFormOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medDraftName, setMedDraftName] = useState('');
  const [medDraftDosage, setMedDraftDosage] = useState('');
  const [medDraftNote, setMedDraftNote] = useState('');
  const [medDraftTimes, setMedDraftTimes] = useState<{ time: string; period: 'AM' | 'PM' }[]>([]);
  const [medDraftTimeInput, setMedDraftTimeInput] = useState('09:00');
  const [medDraftPeriodInput, setMedDraftPeriodInput] = useState<'AM' | 'PM'>('AM');
  const [medDraftRecurring, setMedDraftRecurring] = useState(true);
  const [medDraftOneTimeDate, setMedDraftOneTimeDate] = useState('');
  const [deleteMedId, setDeleteMedId] = useState<string | null>(null);

  const [histFormOpen, setHistFormOpen] = useState(false);
  const [editingHistId, setEditingHistId] = useState<string | null>(null);
  const [histDraftTitle, setHistDraftTitle] = useState('');
  const [histDraftDate, setHistDraftDate] = useState('');
  const [histDraftNote, setHistDraftNote] = useState('');
  const [deleteHistId, setDeleteHistId] = useState<string | null>(null);

  const [emergencyDraft, setEmergencyDraft] = useState<EmergencyInfo>(emergencyInfo);
  useEffect(() => {
    if (currentTab === 'health' && healthSubTab === 'urgence') setEmergencyDraft(emergencyInfo);
  }, [currentTab, healthSubTab]);

  const openMedForm = (med?: Medication) => {
    if (med) {
      setEditingMedId(med.id);
      setMedDraftName(med.name);
      setMedDraftDosage(med.dosage);
      setMedDraftNote(med.note);
      setMedDraftTimes(med.times);
      setMedDraftRecurring(med.recurring !== false);
      setMedDraftOneTimeDate(med.oneTimeDate || '');
    } else {
      setEditingMedId(null);
      setMedDraftName('');
      setMedDraftDosage('');
      setMedDraftNote('');
      setMedDraftTimes([]);
      setMedDraftRecurring(true);
      setMedDraftOneTimeDate('');
    }
    setMedFormOpen(true);
  };
  const saveMedication = () => {
    if (!medDraftName.trim()) return;
    if (editingMedId) {
      setMedications(prev => prev.map(m => m.id === editingMedId
        ? { ...m, name: medDraftName.trim(), dosage: medDraftDosage.trim(), note: medDraftNote.trim(), times: medDraftTimes, recurring: medDraftRecurring, oneTimeDate: medDraftRecurring ? '' : medDraftOneTimeDate }
        : m));
    } else {
      setMedications(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 11),
        name: medDraftName.trim(),
        dosage: medDraftDosage.trim(),
        note: medDraftNote.trim(),
        times: medDraftTimes,
        recurring: medDraftRecurring,
        oneTimeDate: medDraftRecurring ? '' : medDraftOneTimeDate,
      }]);
    }
    setMedFormOpen(false);
  };
  const addMedTime = () => {
    setMedDraftTimes(prev => [...prev, { time: medDraftTimeInput, period: medDraftPeriodInput }]);
  };

  const openHistForm = (entry?: HealthHistoryEntry) => {
    if (entry) {
      setEditingHistId(entry.id);
      setHistDraftTitle(entry.title);
      setHistDraftDate(entry.date);
      setHistDraftNote(entry.note);
    } else {
      setEditingHistId(null);
      setHistDraftTitle('');
      setHistDraftDate(new Date().toISOString().slice(0, 16));
      setHistDraftNote('');
    }
    setHistFormOpen(true);
  };
  const saveHistEntry = () => {
    if (!histDraftTitle.trim()) return;
    if (editingHistId) {
      setHealthHistory(prev => prev.map(h => h.id === editingHistId
        ? { ...h, title: histDraftTitle.trim(), date: histDraftDate, note: histDraftNote.trim() }
        : h));
    } else {
      setHealthHistory(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 11),
        title: histDraftTitle.trim(),
        date: histDraftDate,
        note: histDraftNote.trim(),
      }].sort((a, b) => (b.date || '').localeCompare(a.date || '')));
    }
    setHistFormOpen(false);
  };
  const saveEmergencyInfo = () => {
    setEmergencyInfo(emergencyDraft);
  };

  // --- Éco-Système (partagé entre tous les alters du système) ---
  interface EcoElement { id: string; type: string; theme: 'aquarium' | 'greenhouse' | 'night' | 'jardin'; x: number; y: number; authorAlterId?: string; timestamp: number; growth?: number; lastWatered?: number; }
  const [ecoElements, setEcoElements] = useState<EcoElement[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('hs-eco-elements') || '[]');
      // Compatibilité avec les anciennes présences posées avant l'ajout des thèmes
      return raw.map((el: any) => ({ ...el, theme: el.theme || 'aquarium' }));
    } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hs-eco-elements', JSON.stringify(ecoElements)); }, [ecoElements]);
  const [ecoBackground, setEcoBackground] = useState<'aquarium' | 'greenhouse' | 'night' | 'jardin'>(() => {
    try { return (localStorage.getItem('hs-eco-bg') as any) || 'aquarium'; } catch { return 'aquarium'; }
  });
  useEffect(() => { localStorage.setItem('hs-eco-bg', ecoBackground); }, [ecoBackground]);
  const [ecoFormOpen, setEcoFormOpen] = useState(false);
  const [ecoDraftType, setEcoDraftType] = useState<string>('meduse');
  const [ecoDraftTab, setEcoDraftTab] = useState<string>('vivant');
  const [ecoDraftAuthorId, setEcoDraftAuthorId] = useState('');
  const [ecoAuthorOpen, setEcoAuthorOpen] = useState(false);
  const [ecoAuthorSearch, setEcoAuthorSearch] = useState('');
  const [ecoEditMode, setEcoEditMode] = useState(false);
  const [ecoPulsingId, setEcoPulsingId] = useState<string | null>(null);
  interface EcoParticle { id: string; x: number; y: number; emoji: string; }
  const [ecoParticles, setEcoParticles] = useState<EcoParticle[]>([]);
  const ecoSceneRef = useRef<HTMLDivElement>(null); // la "scène" (monde) — reçoit le zoom/pan, sert de référence pour les %
  const ecoViewportRef = useRef<HTMLDivElement>(null); // le cadre visible, taille fixe, capte la molette/pincement
  const ecoDragRef = useRef<{ id: string; moved: boolean; startX: number; startY: number } | null>(null);

  // Zoom / déplacement de la scène (comme le Mapping) — molette, pincement à deux doigts, ou glisser le fond
  const [ecoZoom, setEcoZoom] = useState(1);
  const [ecoPan, setEcoPan] = useState({ x: 0, y: 0 });
  const ecoPanDragRef = useRef<{ moved: boolean; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const ecoPinchRef = useRef<globalThis.Map<number, { x: number; y: number }>>(new globalThis.Map());
  const ecoPinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const clampEcoZoom = (z: number) => Math.min(2.5, Math.max(1, z));
  const resetEcoView = () => { setEcoZoom(1); setEcoPan({ x: 0, y: 0 }); };

  // Ambiance (teinte jour/crépuscule) et son d'ambiance — par thème
  const [ecoAltMood, setEcoAltMood] = useState(false);
  const [ecoSoundOn, setEcoSoundOn] = useState(false);
  const ecoAudioRef = useRef<{ ctx: AudioContext; nodes: AudioNode[] } | null>(null);

  // Éléments qui "respirent" doucement (lumineux) et poissons qui nagent légèrement — purement visuel
  const ECO_GLOW_IDS = ['meduse', 'corail', 'lucioles', 'pleinelune', 'filante', 'comete', 'lumignon', 'aurore', 'constellation', 'champignon', 'guirlande', 'mare', 'fontaine'];
  const ECO_SWIM_IDS = ['poisson', 'banc'];
  const ECO_SPIN_IDS = ['moulin']; // rotation continue (pales de moulin)
  const ECO_WIND_IDS = ['girouette']; // oscille comme sous un vent fictif
  const ECO_SWAY_TYPE = 'epouvantail'; // se balance seulement quand on le tape (pas en continu)
  // Petite empreinte déterministe par élément, pour varier délai/durée d'animation sans que ça saute à chaque rendu
  const ecoAnimSeed = (id: string) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return h;
  };

  const ECO_BACKGROUNDS: { id: 'aquarium' | 'greenhouse' | 'night' | 'jardin'; label: string; labelEn: string; className: string }[] = [
    { id: 'aquarium', label: 'Aquarium', labelEn: 'Aquarium', className: 'from-sky-300/40 via-sky-500/25 to-cyan-700/25 border-sky-500/25' },
    { id: 'greenhouse', label: 'Serre', labelEn: 'Greenhouse', className: 'from-lime-200/35 via-emerald-400/20 to-emerald-700/20 border-emerald-500/25' },
    { id: 'night', label: 'Ciel nocturne', labelEn: 'Night sky', className: 'from-indigo-950/70 via-indigo-900/60 to-purple-950/70 border-indigo-500/25' },
    { id: 'jardin', label: 'Jardin', labelEn: 'Garden', className: 'from-lime-100/40 via-amber-100/25 to-emerald-300/20 border-lime-600/25' },
  ];

  // Jardin : les graines poussent par palier au fil des arrosages (chaque tap = 1 arrosage = 1 verre d'eau loggé)
  const JARDIN_WATERS_PER_STAGE = 3;
  const JARDIN_GROWTH_STAGES: Record<string, string[]> = {
    'graine-fleur': ['🌱', '🌿', '🌷'],
    'graine-arbre': ['🌱', '🌿', '🌳'],
    'graine-legume': ['🌱', '🌿', '🍅'],
  };
  const JARDIN_WILT_MS = 48 * 60 * 60 * 1000; // pas arrosée depuis 48h → elle flétrit visuellement (rappel doux)
  const getJardinEmoji = (el: EcoElement) => {
    const stages = JARDIN_GROWTH_STAGES[el.type];
    if (!stages) return getEcoItemMeta(el.theme, el.type).emoji;
    const stageIndex = Math.min(stages.length - 1, Math.floor((el.growth || 0) / JARDIN_WATERS_PER_STAGE));
    return stages[stageIndex];
  };
  const isJardinWilted = (el: EcoElement) =>
    !!JARDIN_GROWTH_STAGES[el.type] && !!el.lastWatered && (Date.now() - el.lastWatered) > JARDIN_WILT_MS;

  // Cycle jour/nuit du Jardin, basé sur l'heure réelle de l'appareil — se réévalue chaque minute
  const [jardinClockTick, setJardinClockTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setJardinClockTick(t => t + 1), 60000);
    return () => clearInterval(iv);
  }, []);
  const isJardinNight = (() => { void jardinClockTick; const h = new Date().getHours(); return h >= 20 || h < 7; })();

  // Compteur de verres d'eau bus aujourd'hui — chaque arrosage d'une graine dans le Jardin en logge un
  const WATER_LOG_KEY = 'hs-water-log';
  const [waterCountToday, setWaterCountToday] = useState<number>(() => {
    try {
      const log = JSON.parse(localStorage.getItem(WATER_LOG_KEY) || '{}');
      return log[new Date().toISOString().slice(0, 10)] || 0;
    } catch { return 0; }
  });
  const logWaterDrink = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let log: Record<string, number> = {};
    try { log = JSON.parse(localStorage.getItem(WATER_LOG_KEY) || '{}'); } catch { /* ignore */ }
    log[todayStr] = (log[todayStr] || 0) + 1;
    try { localStorage.setItem(WATER_LOG_KEY, JSON.stringify(log)); } catch { /* ignore */ }
    localStorage.setItem('hs-last-water-time', String(Date.now()));
    setWaterCountToday(log[todayStr]);
  };
  const resetWaterToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let log: Record<string, number> = {};
    try { log = JSON.parse(localStorage.getItem(WATER_LOG_KEY) || '{}'); } catch { /* ignore */ }
    log[todayStr] = 0;
    try { localStorage.setItem(WATER_LOG_KEY, JSON.stringify(log)); } catch { /* ignore */ }
    setWaterCountToday(0);
  };
  const [ecoJardinSettingsOpen, setEcoJardinSettingsOpen] = useState(false);

  // Catalogue d'éléments par thème, organisé en sous-onglets pour ne pas surcharger le menu.
  const ECO_CATALOG: Record<'aquarium' | 'greenhouse' | 'night' | 'jardin', {
    tabs: { id: string; label: string; labelEn: string }[];
    items: { id: string; emoji: string; label: string; labelEn: string; tab: string }[];
  }> = {
    aquarium: {
      tabs: [
        { id: 'vivant', label: 'Vivant', labelEn: 'Living' },
        { id: 'vegetal', label: 'Végétal', labelEn: 'Plants' },
        { id: 'ambiance', label: 'Lumière / Ambiance', labelEn: 'Light / Mood' },
      ],
      items: [
        { id: 'meduse', emoji: '🪼', label: 'Méduse luminescente', labelEn: 'Glowing jellyfish', tab: 'vivant' },
        { id: 'poisson', emoji: '🐟', label: 'Poisson', labelEn: 'Fish', tab: 'vivant' },
        { id: 'banc', emoji: '🐠', label: 'Banc de mini-poissons', labelEn: 'School of fish', tab: 'vivant' },
        { id: 'tortue', emoji: '🐢', label: 'Tortue', labelEn: 'Turtle', tab: 'vivant' },
        { id: 'crabe', emoji: '🦀', label: 'Petit crabe', labelEn: 'Small crab', tab: 'vivant' },
        { id: 'crevette', emoji: '🦐', label: 'Crevette exploratrice', labelEn: 'Roaming shrimp', tab: 'vivant' },
        { id: 'algue', emoji: '🌿', label: 'Algue ondoyante', labelEn: 'Swaying seaweed', tab: 'vegetal' },
        { id: 'corail', emoji: '🪸', label: 'Corail phosphorescent', labelEn: 'Glowing coral', tab: 'vegetal' },
        { id: 'coquillage', emoji: '🐚', label: 'Coquillage à perle', labelEn: 'Pearl shell', tab: 'vegetal' },
        { id: 'bulles', emoji: '🫧', label: 'Colonne de bulles', labelEn: 'Bubble column', tab: 'ambiance' },
        { id: 'rayon', emoji: '✨', label: 'Rayon de lumière', labelEn: 'Light ray', tab: 'ambiance' },
        { id: 'tresor', emoji: '🏺', label: 'Trésor ancien', labelEn: 'Old treasure', tab: 'ambiance' },
        { id: 'statue', emoji: '🗿', label: 'Statue engloutie', labelEn: 'Sunken statue', tab: 'ambiance' },
        { id: 'anemone', emoji: '🌺', label: 'Anémone réactive', labelEn: 'Reactive anemone', tab: 'vivant' },
      ],
    },
    greenhouse: {
      tabs: [
        { id: 'vegetal', label: 'Végétal', labelEn: 'Plants' },
        { id: 'vivant', label: 'Petite faune', labelEn: 'Little creatures' },
        { id: 'ambiance', label: 'Décor / Chaleur', labelEn: 'Decor / Warmth' },
      ],
      items: [
        { id: 'fougere', emoji: '🌿', label: 'Fougère géante', labelEn: 'Giant fern', tab: 'vegetal' },
        { id: 'pot', emoji: '🪴', label: 'Plante en pot', labelEn: 'Potted plant', tab: 'vegetal' },
        { id: 'cerisier', emoji: '🌸', label: 'Fleur de cerisier', labelEn: 'Cherry blossom', tab: 'vegetal' },
        { id: 'orchidee', emoji: '🌺', label: 'Orchidée sauvage', labelEn: 'Wild orchid', tab: 'vegetal' },
        { id: 'lotus', emoji: '🪷', label: 'Lotus', labelEn: 'Lotus', tab: 'vegetal' },
        { id: 'champignon', emoji: '🍄', label: 'Champignon phosphorescent', labelEn: 'Glowing mushroom', tab: 'vegetal' },
        { id: 'pousse', emoji: '🌱', label: 'Pousse / Graine', labelEn: 'Sprout / Seed', tab: 'vegetal' },
        { id: 'papillon', emoji: '🦋', label: 'Papillon scintillant', labelEn: 'Sparkling butterfly', tab: 'vivant' },
        { id: 'coccinelle', emoji: '🐞', label: 'Coccinelle', labelEn: 'Ladybug', tab: 'vivant' },
        { id: 'escargot', emoji: '🐌', label: 'Escargot paisible', labelEn: 'Peaceful snail', tab: 'vivant' },
        { id: 'grenouille', emoji: '🐸', label: 'Grenouille sur une feuille', labelEn: 'Frog on a leaf', tab: 'vivant' },
        { id: 'lucioles', emoji: '✨', label: 'Lucioles en bocal', labelEn: 'Fireflies in a jar', tab: 'ambiance' },
        { id: 'terrarium', emoji: '🫙', label: 'Terrarium', labelEn: 'Terrarium', tab: 'ambiance' },
        { id: 'guirlande', emoji: '🎐', label: 'Guirlande guinguette', labelEn: 'Fairy lights', tab: 'ambiance' },
        { id: 'brumisateur', emoji: '💨', label: 'Brumisateur / vapeur douce', labelEn: 'Misty steam', tab: 'ambiance' },
      ],
    },
    night: {
      tabs: [
        { id: 'astres', label: 'Astres', labelEn: 'Celestial' },
        { id: 'nuages', label: 'Nuages', labelEn: 'Clouds' },
        { id: 'volants', label: 'Éléments volants', labelEn: 'Flying elements' },
      ],
      items: [
        { id: 'croissant', emoji: '🌙', label: 'Croissant de lune', labelEn: 'Crescent moon', tab: 'astres' },
        { id: 'pleinelune', emoji: '🌕', label: 'Pleine lune dorée', labelEn: 'Golden full moon', tab: 'astres' },
        { id: 'filante', emoji: '🌠', label: 'Étoile filante', labelEn: 'Shooting star', tab: 'astres' },
        { id: 'etoile', emoji: '⭐', label: 'Étoile', labelEn: 'Star', tab: 'astres' },
        { id: 'nuagedoux', emoji: '☁️', label: 'Nuage doux', labelEn: 'Soft cloud', tab: 'nuages' },
        { id: 'nuagerose', emoji: '☁️', label: 'Nuage cotonneux rose/violet', labelEn: 'Cotton-candy cloud', tab: 'nuages' },
        { id: 'nuagepluie', emoji: '🌧️', label: 'Nuage de pluie poétique', labelEn: 'Poetic rain cloud', tab: 'nuages' },
        { id: 'nuageorage', emoji: '⛈️', label: "Nuage d'orage doux", labelEn: 'Gentle storm cloud', tab: 'nuages' },
        { id: 'aurore', emoji: '🌌', label: 'Aurore boréale', labelEn: 'Aurora borealis', tab: 'nuages' },
        { id: 'lanterne', emoji: '🏮', label: 'Lanterne volante', labelEn: 'Flying lantern', tab: 'volants' },
        { id: 'montgolfiere', emoji: '🎈', label: 'Montgolfière miniature', labelEn: 'Mini hot air balloon', tab: 'volants' },
        { id: 'comete', emoji: '☄️', label: 'Comète lumineuse', labelEn: 'Glowing comet', tab: 'volants' },
        { id: 'lumignon', emoji: '💡', label: 'Lumignon céleste', labelEn: 'Celestial light', tab: 'volants' },
        { id: 'constellation', emoji: '✨', label: 'Constellation personnalisée', labelEn: 'Custom constellation', tab: 'volants' },
      ],
    },
    jardin: {
      tabs: [
        { id: 'plantes', label: 'Graines', labelEn: 'Seeds' },
        { id: 'faune', label: 'Petite faune', labelEn: 'Little creatures' },
        { id: 'decor', label: 'Décor', labelEn: 'Decor' },
      ],
      items: [
        { id: 'graine-fleur', emoji: '🌱', label: 'Graine de fleur', labelEn: 'Flower seed', tab: 'plantes' },
        { id: 'graine-arbre', emoji: '🌱', label: "Graine d'arbre", labelEn: 'Tree seed', tab: 'plantes' },
        { id: 'graine-legume', emoji: '🌱', label: 'Graine de potager', labelEn: 'Vegetable seed', tab: 'plantes' },
        { id: 'papillon', emoji: '🦋', label: 'Papillon', labelEn: 'Butterfly', tab: 'faune' },
        { id: 'coccinelle', emoji: '🐞', label: 'Coccinelle', labelEn: 'Ladybug', tab: 'faune' },
        { id: 'abeille', emoji: '🐝', label: 'Abeille', labelEn: 'Bee', tab: 'faune' },
        { id: 'oiseau', emoji: '🐦', label: 'Oiseau', labelEn: 'Bird', tab: 'faune' },
        { id: 'arrosoir', emoji: '🪣', label: 'Arrosoir', labelEn: 'Watering can', tab: 'decor' },
        { id: 'banc-jardin', emoji: '🪑', label: 'Banc de jardin', labelEn: 'Garden bench', tab: 'decor' },
        { id: 'lanterne-jardin', emoji: '🏮', label: 'Lanterne', labelEn: 'Lantern', tab: 'decor' },
        { id: 'ruche', emoji: '🍯', label: 'Ruche', labelEn: 'Beehive', tab: 'decor' },
        { id: 'mare', emoji: '🌊', label: 'Petite mare (tape pour l\'onde)', labelEn: 'Small pond (tap to ripple)', tab: 'decor' },
        { id: 'moulin', emoji: '🌀', label: 'Moulin à vent', labelEn: 'Windmill', tab: 'decor' },
        { id: 'fontaine', emoji: '⛲', label: 'Fontaine', labelEn: 'Fountain', tab: 'decor' },
        { id: 'girouette', emoji: '🧭', label: 'Girouette', labelEn: 'Weathervane', tab: 'decor' },
        { id: 'epouvantail', emoji: '🧍', label: 'Épouvantail (tape pour le balancer)', labelEn: 'Scarecrow (tap to sway)', tab: 'decor' },
        { id: 'chemin-pierres', emoji: '🪨', label: 'Chemin de pierres', labelEn: 'Stepping stones', tab: 'decor' },
        { id: 'cloture', emoji: '🪵', label: 'Clôture en bois', labelEn: 'Wooden fence', tab: 'decor' },
        { id: 'compost', emoji: '🪱', label: 'Tas de compost', labelEn: 'Compost pile', tab: 'decor' },
        { id: 'brouette', emoji: '🧺', label: 'Brouette fleurie', labelEn: 'Flower wheelbarrow', tab: 'decor' },
        { id: 'hotel-insectes', emoji: '🏠', label: 'Hôtel à insectes', labelEn: 'Insect hotel', tab: 'decor' },
      ],
    },
  };
  const getEcoItemMeta = (theme: EcoElement['theme'], type: string) => {
    return ECO_CATALOG[theme].items.find(it => it.id === type)
      || { id: type, emoji: '✦', label: type, labelEn: type, tab: '' };
  };

  const addEcoElement = () => {
    const newEl: EcoElement = {
      id: Math.random().toString(36).substring(2, 11),
      type: ecoDraftType,
      theme: ecoBackground,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      authorAlterId: ecoDraftAuthorId || undefined,
      timestamp: Date.now(),
    };
    setEcoElements(prev => [...prev, newEl]);
    setEcoFormOpen(false);
  };
  const deleteEcoElement = (id: string) => {
    setEcoElements(prev => prev.filter(el => el.id !== id));
  };
  // Tapoter un élément le fait doucement réagir (pulsation + petites bulles/étincelles) sans aucun objectif.
  const tapEcoElement = (el: EcoElement) => {
    setEcoPulsingId(el.id);
    setTimeout(() => setEcoPulsingId(prev => prev === el.id ? null : prev), 700);
    // Dans le Jardin, taper une graine = l'arroser : ça la fait pousser ET compte comme un verre d'eau du jour
    const isWatering = el.theme === 'jardin' && !!JARDIN_GROWTH_STAGES[el.type];
    if (isWatering) {
      const maxGrowth = JARDIN_WATERS_PER_STAGE * (JARDIN_GROWTH_STAGES[el.type].length - 1);
      setEcoElements(prev => prev.map(e => e.id === el.id
        ? { ...e, growth: Math.min(maxGrowth, (e.growth || 0) + 1), lastWatered: Date.now() }
        : e));
      logWaterDrink();
    }
    const particleEmoji = (isWatering || el.type === 'mare' || el.type === 'fontaine') ? '💧'
      : ecoBackground === 'aquarium' ? '🫧'
      : ecoBackground === 'night' ? '✨'
      : '🍃';
    const newParticles: EcoParticle[] = Array.from({ length: 2 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      x: el.x + (Math.random() * 8 - 4),
      y: el.y,
      emoji: particleEmoji,
    }));
    setEcoParticles(prev => [...prev, ...newParticles]);
    newParticles.forEach(p => {
      setTimeout(() => setEcoParticles(prev => prev.filter(pp => pp.id !== p.id)), 900);
    });
  };

  // Ambiance du Jardin : gouttes de la fontaine + visite occasionnelle d'un poisson dans la mare —
  // seulement quand on regarde vraiment le Jardin, pour ne pas tourner pour rien en arrière-plan.
  useEffect(() => {
    if (currentTab !== 'relax' || activeRelaxTool !== 'eco-system' || ecoBackground !== 'jardin') return;
    const tick = () => {
      ecoElements.filter(e => e.theme === 'jardin' && e.type === 'fontaine').forEach(e => {
        const p: EcoParticle = { id: Math.random().toString(36).substring(2, 9), x: e.x + (Math.random() * 6 - 3), y: e.y, emoji: '💧' };
        setEcoParticles(prev => [...prev, p]);
        setTimeout(() => setEcoParticles(prev => prev.filter(pp => pp.id !== p.id)), 900);
      });
      ecoElements.filter(e => e.theme === 'jardin' && e.type === 'mare').forEach(e => {
        if (Math.random() < 0.35) {
          const p: EcoParticle = { id: Math.random().toString(36).substring(2, 9), x: e.x + (Math.random() * 10 - 5), y: e.y, emoji: '🐟' };
          setEcoParticles(prev => [...prev, p]);
          setTimeout(() => setEcoParticles(prev => prev.filter(pp => pp.id !== p.id)), 900);
        }
      });
    };
    const iv = setInterval(tick, 4000);
    return () => clearInterval(iv);
  }, [currentTab, activeRelaxTool, ecoBackground, ecoElements]);

  // Déplacement à la souris/au doigt : on ne fait glisser que si le pointeur a réellement bougé,
  // sinon un simple tap déclenche la réaction douce (ou la suppression en mode Gérer).
  const handleEcoPointerDown = (e: React.PointerEvent<HTMLDivElement>, el: EcoElement) => {
    e.stopPropagation(); // évite de déclencher aussi le glisser-déposer du fond de la scène
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    ecoDragRef.current = { id: el.id, moved: false, startX: e.clientX, startY: e.clientY };
  };
  const handleEcoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = ecoDragRef.current;
    const scene = ecoSceneRef.current;
    if (!drag || !scene) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    const rect = scene.getBoundingClientRect();
    const x = Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(92, Math.max(8, ((e.clientY - rect.top) / rect.height) * 100));
    setEcoElements(prev => prev.map(el => el.id === drag.id ? { ...el, x, y } : el));
  };
  const handleEcoPointerUp = (e: React.PointerEvent<HTMLDivElement>, el: EcoElement) => {
    const drag = ecoDragRef.current;
    ecoDragRef.current = null;
    if (drag && !drag.moved) {
      if (ecoEditMode) deleteEcoElement(el.id);
      else tapEcoElement(el);
    }
  };

  // --- Zoom & déplacement du cadre (comme le Mapping) ---
  // Molette / trackpad : zoom autour du centre de la scène (reste simple, pas de calcul de point focal)
  const handleEcoWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEcoZoom(z => clampEcoZoom(z + (e.deltaY < 0 ? 0.12 : -0.12)));
  };
  // Glisser le fond (hors élément posé, qui bloque déjà la propagation) pour déplacer la vue
  const handleEcoViewportPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    ecoPinchRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ecoPinchRef.current.size === 1) {
      ecoPanDragRef.current = { moved: false, startX: e.clientX, startY: e.clientY, originX: ecoPan.x, originY: ecoPan.y };
    } else if (ecoPinchRef.current.size === 2) {
      const pts = Array.from(ecoPinchRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      ecoPinchStartRef.current = { dist, zoom: ecoZoom };
      ecoPanDragRef.current = null; // deux doigts = pincement, pas de pan
    }
  };
  const handleEcoViewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (ecoPinchRef.current.has(e.pointerId)) ecoPinchRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ecoPinchRef.current.size === 2 && ecoPinchStartRef.current) {
      const pts = Array.from(ecoPinchRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = dist / (ecoPinchStartRef.current.dist || 1);
      setEcoZoom(clampEcoZoom(ecoPinchStartRef.current.zoom * ratio));
      return;
    }
    const pan = ecoPanDragRef.current;
    if (!pan) return;
    const dx = e.clientX - pan.startX;
    const dy = e.clientY - pan.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pan.moved = true;
    if (!pan.moved) return;
    setEcoPan({ x: pan.originX + dx, y: pan.originY + dy });
  };
  const handleEcoViewportPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    ecoPinchRef.current.delete(e.pointerId);
    if (ecoPinchRef.current.size < 2) ecoPinchStartRef.current = null;
    ecoPanDragRef.current = null;
  };

  // Son d'ambiance très doux (bruit filtré en boucle) — se lance/coupe proprement au toggle ou au changement de thème
  useEffect(() => {
    if (!ecoSoundOn) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctx();
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // bruit brownien doux, texture "vent/eau"
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = ecoBackground === 'aquarium' ? 900 : ecoBackground === 'greenhouse' ? 1400 : 600;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    ecoAudioRef.current = { ctx, nodes: [noise, filter, gain] };
    return () => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        setTimeout(() => { noise.stop(); ctx.close(); }, 450);
      } catch { /* déjà arrêté */ }
      ecoAudioRef.current = null;
    };
  }, [ecoSoundOn, ecoBackground]);

  // --- Boîte à Choix ---
  const WHEEL_COLORS = ['#F3D9DF', '#D9E7F3', '#DDF3D9', '#F3ECD9', '#E6D9F3', '#F3D9EE', '#D9F3EF', '#F3E0D9'];
  const [wheelOptions, setWheelOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hs-choice-wheel');
      return saved ? JSON.parse(saved) : ['Faire une pause', 'Boire de l\'eau', 'Respirer profondément', 'Écrire un mot', 'Étirer le corps'];
    } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hs-choice-wheel', JSON.stringify(wheelOptions)); }, [wheelOptions]);
  const [wheelEditMode, setWheelEditMode] = useState(false);
  const [wheelNewOption, setWheelNewOption] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResultIdx, setWheelResultIdx] = useState<number | null>(null);

  const getWheelGradient = () => {
    if (wheelOptions.length === 0) return 'transparent';
    const seg = 100 / wheelOptions.length;
    return `conic-gradient(${wheelOptions.map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * seg}% ${(i + 1) * seg}%`).join(', ')})`;
  };
  const spinWheel = () => {
    if (wheelOptions.length < 2 || wheelSpinning) return;
    const idx = Math.floor(Math.random() * wheelOptions.length);
    const segAngle = 360 / wheelOptions.length;
    const targetAngle = 360 - (idx * segAngle + segAngle / 2);
    setWheelSpinning(true);
    setWheelResultIdx(null);
    setWheelRotation(prev => prev + 5 * 360 + targetAngle - (prev % 360));
    setTimeout(() => {
      setWheelSpinning(false);
      setWheelResultIdx(idx);
    }, 4000);
  };

  interface MicroOption { id: string; emoji: string; label: string; }
  const [microOptions, setMicroOptions] = useState<MicroOption[]>(() => {
    try {
      const saved = localStorage.getItem('hs-choice-micro');
      return saved ? JSON.parse(saved) : [
        { id: 'm1', emoji: '🥤', label: 'Boire un verre d\'eau' },
        { id: 'm2', emoji: '🧸', label: 'Serrer un doudou / un plaid' },
        { id: 'm3', emoji: '🎵', label: 'Écouter 1 musique douce' },
      ];
    } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hs-choice-micro', JSON.stringify(microOptions)); }, [microOptions]);
  const [microPanelOpen, setMicroPanelOpen] = useState(false);
  const [microEditMode, setMicroEditMode] = useState(false);
  const [microNewEmoji, setMicroNewEmoji] = useState('');
  const [microNewLabel, setMicroNewLabel] = useState('');

  // --- Affirmations ---
  const [currentAffirmationIdx, setCurrentAffirmationIdx] = useState<number>(() => Math.floor(Math.random() * AFFIRMATIONS.length));
  const drawRandomAffirmation = () => {
    setCurrentAffirmationIdx(prev => {
      if (AFFIRMATIONS.length <= 1) return 0;
      let next = Math.floor(Math.random() * AFFIRMATIONS.length);
      while (next === prev) next = Math.floor(Math.random() * AFFIRMATIONS.length);
      return next;
    });
  };

  // --- Kalimba ---
  // Disposition classique d'un kalimba 17 lames (clé de C) : la lame la plus longue/grave est
  // au centre, et le grave monte en zigzag vers les bords (lames de plus en plus courtes/aiguës).
  const KALIMBA_NOTES: { note: string; octave: number }[] = [
    { note: 'D', octave: 6 }, { note: 'B', octave: 5 }, { note: 'G', octave: 5 }, { note: 'E', octave: 5 },
    { note: 'C', octave: 5 }, { note: 'A', octave: 4 }, { note: 'F', octave: 4 }, { note: 'D', octave: 4 },
    { note: 'C', octave: 4 },
    { note: 'E', octave: 4 }, { note: 'G', octave: 4 }, { note: 'B', octave: 4 }, { note: 'D', octave: 5 },
    { note: 'F', octave: 5 }, { note: 'A', octave: 5 }, { note: 'C', octave: 6 }, { note: 'E', octave: 6 },
  ];
  const NOTE_SEMITONES: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  const noteToFreq = (note: string, octave: number) => {
    const semitone = NOTE_SEMITONES[note] + (octave - 4) * 12;
    return 440 * Math.pow(2, semitone / 12);
  };
  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };
  const playKalimbaNote = (freq: number) => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      // Oscillateur principal (corps du son)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.7);
      // Harmonique légère pour un timbre plus métallique (attaque du "pincement")
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.exponentialRampToValueAtTime(0.1, now + 0.004);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.65);
    } catch { /* Web Audio indisponible — silencieux */ }
  };

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

    // Notification native si on n'est pas déjà en train de regarder cette conversation
    // (onglet caché, ou ailleurs dans l'app) — inutile de notifier ce qu'on a déjà sous les yeux.
    if (notifBrowser && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      const isViewingConv = currentTab === 'messaging' && activeConvId === conv.id && !document.hidden;
      if (!isViewingConv) {
        const senderName = allAlters.find(a => a.id === msgSenderId)?.alterName || (lang === 'fr' ? 'Un alter' : 'An alter');
        const notif = new Notification(lang === 'fr' ? `✦ Message de ${senderName}` : `✦ Message from ${senderName}`, {
          body: msg.text.length > 120 ? msg.text.slice(0, 120) + '…' : msg.text,
          icon: '/icon-192.png',
          tag: `hs-dm-${conv.id}`,
        });
        notif.onclick = () => {
          window.focus();
          setCurrentTab('messaging');
          setActiveConvId(conv.id);
          notif.close();
        };
      }
    }
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
      selectedRoles: cleanAlterRoles(selectedRoles),
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
      subsystemId: creatorSubsystemId || existingSubsystemId || undefined,
      frontStatus: frontStatus || 'none',
      pkId: existingPkId,
      alterAge: alterAge || undefined,
      alterColor: alterColor || undefined,
      triggersPositive: triggersPositive || undefined,
      triggersNegative: triggersNegative || undefined,
      alterLanguages: alterLanguages || undefined,
      alterOriginWorld: alterOriginWorld || undefined,
      birthday: alterBirthday || existingAlter?.birthday || undefined,
      tags: alterTags.length > 0 ? alterTags : undefined,
      customFields: customFields.length > 0 ? customFields : undefined,
      descriptionImages: descriptionImages.length > 0 ? descriptionImages : undefined,
      internalNotesImages: internalNotesImages.length > 0 ? internalNotesImages : undefined,
      customRoleIds: selectedCustomRoleIds.length > 0 ? selectedCustomRoleIds : undefined,
      customTraitIds: selectedCustomTraitIds.length > 0 ? selectedCustomTraitIds : undefined,
      customDisorderIds: selectedCustomDisorderIds.length > 0 ? selectedCustomDisorderIds : undefined,
      archived: existingAlter?.archived || false,
      systemId: creatorSystemId || existingAlter?.systemId || activeSystemId,
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
    setSelectedRoles(cleanAlterRoles(alter.selectedRoles));
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
    setCreatorSystemId(alter.systemId || 'main');
    setCreatorSubsystemId(alter.subsystemId || '');
    setAlterAge(alter.alterAge || '');
    setAlterColor(alter.alterColor || '');
    setTriggersPositive(alter.triggersPositive || '');
    setTriggersNegative(alter.triggersNegative || '');
    setAlterLanguages(alter.alterLanguages || '');
    setAlterOriginWorld(alter.alterOriginWorld || '');
    setAlterBirthday((alter as any).birthday || '');
    setAlterTags(alter.tags || []);
    setCustomFields(alter.customFields || []);
    setDescriptionImages(alter.descriptionImages || []);
    setInternalNotesImages(alter.internalNotesImages || []);
    setSelectedCustomRoleIds(alter.customRoleIds || []);
    setSelectedCustomTraitIds(alter.customTraitIds || []);
    setSelectedCustomDisorderIds(alter.customDisorderIds || []);
    setFrontStatus(alter.frontStatus || 'none');
    setEditingAlterId(alter.id);
    setCreatorReturnTab(currentTab !== 'creator' ? currentTab : creatorReturnTab);
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
    setCreatorSystemId('');
    setCreatorSubsystemId('');
    setAlterAge('');
    setAlterColor('');
    setTriggersPositive('');
    setTriggersNegative('');
    setAlterLanguages('');
    setAlterOriginWorld('');
    setAlterBirthday('');
    setAlterTags([]);
    setAlterTagInput('');
    setCustomFields([]);
    setDescriptionImages([]);
    setInternalNotesImages([]);
    setSelectedCustomRoleIds([]);
    setSelectedCustomTraitIds([]);
    setSelectedCustomDisorderIds([]);
    resetCustomRoleDraft();
    setFrontStatus('none');
    setEditingAlterId(null);
    setCreatorReturnTab(null);
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

  const handleRenameSubsystem = (subId: string, newName: string) => {
    if (!newName.trim()) return;
    setSubsystems(prev => prev.map(s => s.id === subId ? { ...s, name: newName.trim() } : s));
    setEditingSubsystemNameId(null);
  };

  const handleDeleteSubsystem = (subId: string) => {
    setDeleteConfirmSubsystemId(subId);
    setDeleteSubsystemStep('choose');
    // Par défaut, chaque fiche directement dans ce sous-système part vers le système principal
    const directAlters = savedAlters.filter(a => a.subsystemId === subId);
    const defaults: Record<string, string> = {};
    directAlters.forEach(a => { defaults[a.id] = '__main__'; });
    setMoveSubsystemAssignments(defaults);
    setMoveSubsystemSelectedIds([]);
    setMoveSubsystemBulkDestination('__main__');
    setDestroySubsystemConfirmText('');
  };

  // Récupère récursivement tous les sous-systèmes descendants (enfants, petits-enfants...)
  const getDescendantSubsystemIds = (subId: string): string[] => {
    const directChildren = subsystems.filter(s => s.parentId === subId).map(s => s.id);
    return directChildren.reduce((acc: string[], childId) => [...acc, childId, ...getDescendantSubsystemIds(childId)], []);
  };

  // mode 'destroy' : supprime le dossier ET tout son contenu (sous-systèmes enfants + fiches) définitivement.
  // mode 'move' : chaque fiche part vers la destination choisie individuellement (carte alterId → destination),
  // les sous-systèmes enfants sont remontés au niveau supérieur, et seul le dossier vide est supprimé.
  const executeDeleteSubsystem = (subId: string, mode: 'destroy' | 'move', assignments?: Record<string, string>) => {
    if (mode === 'destroy') {
      const allIds = [subId, ...getDescendantSubsystemIds(subId)];
      setSubsystems(prev => prev.filter(s => !allIds.includes(s.id)));
      setSavedAlters(prev => prev.filter(a => !allIds.includes(a.subsystemId || '')));
    } else {
      setSubsystems(prev => prev.filter(s => s.id !== subId).map(s => s.parentId === subId ? { ...s, parentId: undefined } : s));
      setSavedAlters(prev => prev.map(a => {
        if (a.subsystemId !== subId) return a;
        const dest = assignments?.[a.id] ?? '__main__';
        return { ...a, subsystemId: dest === '__main__' ? undefined : dest };
      }));
    }
    setDeleteConfirmSubsystemId(null);
    setDeleteSubsystemStep('choose');
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
    setSystemInBlend(false); // des alters précis sont identifiés au front : le flou est levé

    // Clear form inputs
    setSwitchSelectedAlterIds([]);
    setSwitchRetroDate('');
    setSwitchEndDate('');
    setSwitchNotes('');
    setSwitchSpoons(12);
    setSwitchMoods([]);
  };

  // Log direct d'un switch "Flou / Blend" sans nécessiter de sélectionner d'alter précis —
  // le flou représente justement l'absence d'identité claire au front à ce moment-là.
  const handleLogBlendSwitch = () => {
    const finalTimestamp = switchRetroDate ? new Date(switchRetroDate).getTime() : Date.now();
    const finalEndTimestamp = switchEndDate ? new Date(switchEndDate).getTime() : undefined;
    const newLog: SwitchLog = {
      id: Math.random().toString(36).substring(2, 11),
      alterIds: [],
      timestamp: finalTimestamp,
      endTimestamp: finalEndTimestamp,
      notes: switchNotes.trim() || undefined,
      status: 'blend',
      spoons: switchSpoons,
      moods: switchMoods.length > 0 ? switchMoods : undefined,
    };

    setSwitchLogs(prev => [newLog, ...prev].sort((a, b) => b.timestamp - a.timestamp));
    fireSwitchNotifications([lang === 'fr' ? 'Flou / Blend' : 'Blur / Blend'], 'blend', undefined);
    setSystemInBlend(true);

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

  // Retire un alter du front en un clic depuis le dashboard : met à jour son statut
  // ET journalise l'événement dans le registre des switch, pour garder un historique cohérent.
  const handleRemoveFromFront = (alterId: string) => {
    setSavedAlters(prev => prev.map(a => a.id === alterId ? { ...a, frontStatus: 'none' } : a));
    setSwitchLogs(prev => [{
      id: Math.random().toString(36).substring(2, 11),
      alterIds: [alterId],
      timestamp: Date.now(),
      status: 'none',
    }, ...prev].sort((a, b) => b.timestamp - a.timestamp));
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

  const handleEditJournalEntry = (entry: JournalEntry) => {
    setEditingJournalId(entry.id);
    setJournalTitleInput(entry.title);
    setJournalContentInput(entry.content);
    setJournalImages(entry.images || []);
  };

  const handleUpdateJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJournalId) return;
    setJournalEntries(prev => prev.map(j => j.id === editingJournalId
      ? { ...j, title: journalTitleInput.trim() || (lang === 'fr' ? 'Note sans titre' : 'Untitled Note'), content: journalContentInput.trim(), images: journalImages }
      : j
    ));
    setEditingJournalId(null);
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
    const alterRoles = cleanAlterRoles(alter.selectedRoles);
    const allRoleIds: string[] = [...alterRoles, ...(alter.customRoleIds || [])];
    return (
      <div key={alter.id} className="w-full bg-app-card/65 md:rounded-2xl border-b md:border border-app-border/30 md:shadow-sm hover:shadow-md transition-shadow relative">
        {/* Version mobile — liste compacte style Simply Plural */}
        <div className="flex md:hidden items-center gap-2.5 w-full px-3 py-2">
          {alter.profileImage ? (
            <img src={alter.profileImage} alt={alter.alterName} className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-app-border/30" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-app-accent/15 border-2 border-app-accent/25 flex items-center justify-center text-app-text font-black shrink-0 text-xs">
              {alter.alterName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <span className="font-bold text-sm text-app-text block overflow-hidden text-ellipsis whitespace-nowrap">{alter.alterName}</span>
            {allRoleIds.length > 0 && (
              <span className="text-[11px] text-app-muted block overflow-hidden text-ellipsis whitespace-nowrap">
                {getRoleDisplayName(allRoleIds[0])}
                {allRoleIds.length > 1 && ` +${allRoleIds.length - 1}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {alter.frontStatus && alter.frontStatus !== 'none' && (
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  alter.frontStatus === 'primary' ? 'bg-emerald-500' :
                  alter.frontStatus === 'co_front' ? 'bg-sky-500' :
                  alter.frontStatus === 'co_conscious' ? 'bg-violet-500' :
                  alter.frontStatus === 'passive' ? 'bg-amber-500' :
                  alter.frontStatus === 'frontstuck' ? 'bg-red-600' :
                  alter.frontStatus === 'front_locked' ? 'bg-rose-600' :
                  alter.frontStatus === 'front_held' ? 'bg-orange-600' :
                  alter.frontStatus === 'shadowing' ? 'bg-slate-500' :
                  alter.frontStatus === 'blurry' ? 'bg-purple-400' :
                  alter.frontStatus === 'triggered' ? 'bg-pink-500' :
                  alter.frontStatus === 'switching' ? 'bg-cyan-500' :
                  alter.frontStatus === 'fading' ? 'bg-stone-400' :
                  alter.frontStatus === 'blend' ? '' : 'bg-zinc-500'
                }`}
                style={alter.frontStatus === 'blend' ? { background: 'linear-gradient(135deg, #a855f7, #ec4899, #6366f1)' } : undefined}
              />
            )}
            <button onClick={() => handleLoadAlter(alter)} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border border-app-border rounded-xl text-app-muted hover:text-app-text hover:border-app-accent transition-all whitespace-nowrap">
              {lang === 'fr' ? 'Charger' : 'Load'}
            </button>
            <button onClick={() => setSavedAlters(prev => prev.map(a => a.id === alter.id ? { ...a, archived: !a.archived } : a))}
              className="p-1 text-app-muted hover:text-amber-500 transition-colors shrink-0"
              title={alter.archived ? (lang === 'fr' ? 'Desarchiver' : 'Unarchive') : (lang === 'fr' ? 'Archiver' : 'Archive')}>
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDeleteAlter(alter.id)} className="p-1 text-app-muted hover:text-red-400 transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
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
                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border inline-block ${
                    alter.frontStatus === 'primary' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                    alter.frontStatus === 'co_front' ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' :
                    alter.frontStatus === 'co_conscious' ? 'bg-violet-500/10 text-violet-500 border-violet-500/30' :
                    alter.frontStatus === 'passive' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                    alter.frontStatus === 'frontstuck' ? 'bg-red-600/10 text-red-600 border-red-600/30' :
                    alter.frontStatus === 'front_locked' ? 'bg-rose-600/10 text-rose-600 border-rose-600/30' :
                    alter.frontStatus === 'front_held' ? 'bg-orange-600/10 text-orange-600 border-orange-600/30' :
                    alter.frontStatus === 'shadowing' ? 'bg-slate-500/10 text-slate-500 border-slate-500/30' :
                    alter.frontStatus === 'blurry' ? 'bg-purple-400/10 text-purple-400 border-purple-400/30' :
                    alter.frontStatus === 'triggered' ? 'bg-pink-500/10 text-pink-500 border-pink-500/30' :
                    alter.frontStatus === 'switching' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' :
                    alter.frontStatus === 'fading' ? 'bg-stone-400/10 text-stone-400 border-stone-400/30' :
                    alter.frontStatus === 'blend' ? 'border-fuchsia-500/30 text-fuchsia-500' :
                    'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                  }`}
                  style={alter.frontStatus === 'blend' ? { background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.12), rgba(99,102,241,0.12))' } : undefined}
                >
                  {t.frontStatuses[alter.frontStatus as keyof typeof t.frontStatuses] || alter.frontStatus}
                </span>
              )}
              {allRoleIds.slice(0, 2).map(r => (
                <span 
                  key={r} 
                  style={{ 
                    backgroundColor: `${alter.customRoleColors?.[r] || getRoleDisplayColor(r)}15`, 
                    color: alter.customRoleColors?.[r] || getRoleDisplayColor(r),
                    borderColor: `${alter.customRoleColors?.[r] || getRoleDisplayColor(r)}40`
                  }}
                  className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border inline-block"
                >
                  {getRoleDisplayName(r)}
                </span>
              ))}
              {allRoleIds.length > 2 && (
                <span className="px-1.5 py-0.5 rounded bg-app-bg text-app-muted text-[8px] font-extrabold">
                  +{allRoleIds.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Load trigger */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-app-border/15">
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
    const subAlters = savedAlters.filter(a => a.subsystemId === subId);
    const totalAlters = subAlters.length + childSubs.reduce((acc, c) => acc + savedAlters.filter(a => a.subsystemId === c.id).length, 0);

    return (
      <div key={subId} className="space-y-2" style={{ marginLeft: `${depth * 8}px` }}>
        <div
          className="flex items-center gap-3 p-4 bg-app-card border border-app-border/40 rounded-2xl hover:border-app-accent/40 hover:bg-app-card/80 transition-all group cursor-pointer"
          onClick={() => setActiveSubsystemView(subId)}
        >
          <div className="w-8 h-8 rounded-xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            {editingSubsystemNameId === subId ? (
              <input
                autoFocus
                className="text-sm font-black uppercase tracking-wider bg-transparent border-b border-app-accent outline-none w-full"
                value={editingSubsystemNameValue}
                onChange={e => setEditingSubsystemNameValue(e.target.value)}
                onBlur={() => handleRenameSubsystem(subId, editingSubsystemNameValue)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRenameSubsystem(subId, editingSubsystemNameValue);
                  if (e.key === 'Escape') setEditingSubsystemNameId(null);
                }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-black uppercase tracking-wider text-app-text">{sub.name}</span>
            )}
            <span className="text-[10px] text-app-muted font-bold block mt-0.5">
              {totalAlters} alters{childSubs.length > 0 && ` · ${childSubs.length} ${lang === 'fr' ? 'sous-systèmes' : 'subsystems'}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={e => { e.stopPropagation(); setEditingSubsystemNameId(subId); setEditingSubsystemNameValue(sub.name); }}
              className="p-1.5 hover:bg-app-bg text-app-muted hover:text-app-accent rounded-lg transition-colors"
              title={lang === 'fr' ? 'Renommer' : 'Rename'}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleDeleteSubsystem(sub.id); }}
              className="p-1.5 hover:bg-app-bg text-app-muted hover:text-red-500 rounded-lg transition-colors"
              title={lang === 'fr' ? 'Supprimer' : 'Delete'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-accent transition-colors ml-1" />
          </div>
        </div>
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

  // Rôle fixe ou personnalisé : nom et couleur à afficher, quel que soit le type
  const getRoleDisplayName = (roleId: string): string => {
    if ((Object.values(AlterRole) as string[]).includes(roleId)) {
      return t.roleNames[roleId as keyof typeof t.roleNames] || roleId;
    }
    return customRoles.find(r => r.id === roleId)?.name || roleId;
  };
  const getRoleDisplayColor = (roleId: string): string => {
    if ((Object.values(AlterRole) as string[]).includes(roleId)) {
      return ROLE_CONFIGS[roleId as AlterRole]?.color || '#9CA3AF';
    }
    return customRoles.find(r => r.id === roleId)?.color || '#9CA3AF';
  };

  // Formate un timestamp de message avec la date (sauf si c'est aujourd'hui) + l'heure
  const formatMessageTimestamp = (timestamp: number): string => {
    const d = new Date(timestamp);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const timeStr = d.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return timeStr;
    if (isYesterday) return `${lang === 'fr' ? 'Hier' : 'Yesterday'} ${timeStr}`;
    const dateStr = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return `${dateStr} · ${timeStr}`;
  };

  const toggleRole = (role: AlterRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
    setTimeout(saveToHistory, 0);
  };

  // Attribue / retire un rôle personnalisé sur l'alter en cours d'édition
  const toggleCustomRoleSelection = (roleId: string) => {
    setSelectedCustomRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
    setTimeout(saveToHistory, 0);
  };

  const resetCustomRoleDraft = () => {
    setEditingCustomRoleId(null);
    setCustomRoleDraftName('');
    setCustomRoleDraftDefinition('');
    setCustomRoleDraftColor('#8B5CF6');
  };

  // Crée un nouveau rôle personnalisé, ou enregistre les modifications si on est en mode édition
  const saveCustomRoleDraft = () => {
    const name = customRoleDraftName.trim();
    if (!name) return;
    if (editingCustomRoleId) {
      setCustomRoles(prev => prev.map(r => r.id === editingCustomRoleId
        ? { ...r, name, definition: customRoleDraftDefinition.trim(), color: customRoleDraftColor }
        : r));
    } else {
      const newRole: CustomRole = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        definition: customRoleDraftDefinition.trim(),
        color: customRoleDraftColor,
      };
      setCustomRoles(prev => [...prev, newRole]);
      setSelectedCustomRoleIds(prev => [...prev, newRole.id]);
    }
    resetCustomRoleDraft();
  };

  const startEditCustomRole = (role: CustomRole) => {
    setEditingCustomRoleId(role.id);
    setCustomRoleDraftName(role.name);
    setCustomRoleDraftDefinition(role.definition);
    setCustomRoleDraftColor(role.color || '#8B5CF6');
  };

  // Supprime un rôle personnalisé de la liste globale et le détache de tous les alters qui l'utilisaient
  const deleteCustomRoleDefinition = (roleId: string) => {
    setCustomRoles(prev => prev.filter(r => r.id !== roleId));
    setSelectedCustomRoleIds(prev => prev.filter(id => id !== roleId));
    setSavedAlters(prev => prev.map(a => a.customRoleIds?.includes(roleId)
      ? { ...a, customRoleIds: a.customRoleIds.filter(id => id !== roleId) }
      : a));
    if (editingCustomRoleId === roleId) resetCustomRoleDraft();
    setCustomRoleDeleteConfirmId(null);
  };

  // Attribue / retire un trait personnalisé sur l'alter en cours d'édition
  const toggleCustomTraitSelection = (traitId: string) => {
    setSelectedCustomTraitIds(prev =>
      prev.includes(traitId) ? prev.filter(id => id !== traitId) : [...prev, traitId]
    );
    setTimeout(saveToHistory, 0);
  };

  const resetCustomTraitDraft = () => {
    setEditingCustomTraitId(null);
    setCustomTraitDraftName('');
    setCustomTraitDraftDefinition('');
    setCustomTraitDraftColor('#8B5CF6');
  };

  // Crée un nouveau trait personnalisé, ou enregistre les modifications si on est en mode édition
  const saveCustomTraitDraft = () => {
    const name = customTraitDraftName.trim();
    if (!name) return;
    if (editingCustomTraitId) {
      setCustomTraits(prev => prev.map(tr => tr.id === editingCustomTraitId
        ? { ...tr, name, definition: customTraitDraftDefinition.trim(), color: customTraitDraftColor }
        : tr));
    } else {
      const newTrait: CustomTrait = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        definition: customTraitDraftDefinition.trim(),
        color: customTraitDraftColor,
      };
      setCustomTraits(prev => [...prev, newTrait]);
      setSelectedCustomTraitIds(prev => [...prev, newTrait.id]);
    }
    resetCustomTraitDraft();
  };

  const startEditCustomTrait = (trait: CustomTrait) => {
    setEditingCustomTraitId(trait.id);
    setCustomTraitDraftName(trait.name);
    setCustomTraitDraftDefinition(trait.definition);
    setCustomTraitDraftColor(trait.color || '#8B5CF6');
  };

  // Supprime un trait personnalisé de la liste globale et le détache de tous les alters qui l'utilisaient
  const deleteCustomTraitDefinition = (traitId: string) => {
    setCustomTraits(prev => prev.filter(tr => tr.id !== traitId));
    setSelectedCustomTraitIds(prev => prev.filter(id => id !== traitId));
    setSavedAlters(prev => prev.map(a => a.customTraitIds?.includes(traitId)
      ? { ...a, customTraitIds: a.customTraitIds.filter(id => id !== traitId) }
      : a));
    if (editingCustomTraitId === traitId) resetCustomTraitDraft();
    setCustomTraitDeleteConfirmId(null);
  };

  // Attribue / retire un trouble personnalisé sur l'alter en cours d'édition
  const toggleCustomDisorderSelection = (disorderId: string) => {
    setSelectedCustomDisorderIds(prev =>
      prev.includes(disorderId) ? prev.filter(id => id !== disorderId) : [...prev, disorderId]
    );
    setTimeout(saveToHistory, 0);
  };

  const resetCustomDisorderDraft = () => {
    setEditingCustomDisorderId(null);
    setCustomDisorderDraftName('');
    setCustomDisorderDraftDefinition('');
    setCustomDisorderDraftColor('#8B5CF6');
  };

  // Crée un nouveau trouble personnalisé, ou enregistre les modifications si on est en mode édition
  const saveCustomDisorderDraft = () => {
    const name = customDisorderDraftName.trim();
    if (!name) return;
    if (editingCustomDisorderId) {
      setCustomDisorders(prev => prev.map(d => d.id === editingCustomDisorderId
        ? { ...d, name, definition: customDisorderDraftDefinition.trim(), color: customDisorderDraftColor }
        : d));
    } else {
      const newDisorder: CustomDisorder = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        definition: customDisorderDraftDefinition.trim(),
        color: customDisorderDraftColor,
      };
      setCustomDisorders(prev => [...prev, newDisorder]);
      setSelectedCustomDisorderIds(prev => [...prev, newDisorder.id]);
    }
    resetCustomDisorderDraft();
  };

  const startEditCustomDisorder = (disorder: CustomDisorder) => {
    setEditingCustomDisorderId(disorder.id);
    setCustomDisorderDraftName(disorder.name);
    setCustomDisorderDraftDefinition(disorder.definition);
    setCustomDisorderDraftColor(disorder.color || '#8B5CF6');
  };

  // Supprime un trouble personnalisé de la liste globale et le détache de tous les alters qui l'utilisaient
  const deleteCustomDisorderDefinition = (disorderId: string) => {
    setCustomDisorders(prev => prev.filter(d => d.id !== disorderId));
    setSelectedCustomDisorderIds(prev => prev.filter(id => id !== disorderId));
    setSavedAlters(prev => prev.map(a => a.customDisorderIds?.includes(disorderId)
      ? { ...a, customDisorderIds: a.customDisorderIds.filter(id => id !== disorderId) }
      : a));
    if (editingCustomDisorderId === disorderId) resetCustomDisorderDraft();
    setCustomDisorderDeleteConfirmId(null);
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
      const newTraitDecs = [...traitDecorations, newTraitDec].sort((a, b) => {
        const isDisorderA = Object.values(Disorder).includes(a.trait as Disorder);
        const isDisorderB = Object.values(Disorder).includes(b.trait as Disorder);
        const nameA = (isDisorderA ? t.disorders[a.trait as keyof typeof t.disorders] : t.personalityTraits[a.trait as keyof typeof t.personalityTraits]) || a.trait;
        const nameB = (isDisorderB ? t.disorders[b.trait as keyof typeof t.disorders] : t.personalityTraits[b.trait as keyof typeof t.personalityTraits]) || b.trait;
        return nameA.localeCompare(nameB, lang);
      });
      setTraitDecorations(newTraitDecs);
      setActiveTraitId(trait);
      
      const isDisorder = Object.values(Disorder).includes(trait as Disorder);
      const nameMap = isDisorder ? t.disorders : t.personalityTraits;
      const dataMap = isDisorder ? t.disorderData : t.personalityTraitData;
      
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
      case AlterRole.SECRET_KEEPER:
        return <Lock className="w-4 h-4" />;
      case AlterRole.SYMPTOM_HOLDER:
      case AlterRole.PAIN_HOLDER:
        return <Activity className="w-4 h-4" />;
      case AlterRole.ANESTHETIC:
        return <VolumeX className="w-4 h-4" />;
      case AlterRole.PROFESSIONAL:
        return <Briefcase className="w-4 h-4" />;
      case AlterRole.FRONT_RUNNER:
        return <Flag className="w-4 h-4" />;
      case AlterRole.INFANT:
        return <Baby className="w-4 h-4" />;
      case AlterRole.ELDER:
        return <Crown className="w-4 h-4" />;
      case AlterRole.MESSENGER:
        return <Send className="w-4 h-4" />;
      case AlterRole.TRANSLATOR:
        return <Languages className="w-4 h-4" />;
      case AlterRole.ARCHITECT:
        return <Hammer className="w-4 h-4" />;
      case AlterRole.RELAY_ALTER:
        return <ArrowLeftRight className="w-4 h-4" />;
      case AlterRole.ERASER:
        return <Scissors className="w-4 h-4" />;
      case AlterRole.ANCHOR:
        return <Anchor className="w-4 h-4" />;
      case AlterRole.FUNCTIONAL_FRAGMENT:
        return <Target className="w-4 h-4" />;
      case AlterRole.INTROJECT:
      case AlterRole.FICTIVE:
      case AlterRole.FACTIVE:
        return <Sparkles className="w-4 h-4" />;
      case AlterRole.AVENGER:
      case AlterRole.PROSECUTOR:
        return <Swords className="w-4 h-4" />;
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
          '--color-app-bg': '#FFF2D0',
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
      {/* Écran de verrouillage PIN */}
      {pinEnabled && isLocked && (
        <div className="fixed inset-0 z-[10000] bg-app-bg flex items-center justify-center p-6">
          <div className="w-full max-w-xs space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-app-text">
                {lang === 'fr' ? 'Système verrouillé' : 'System locked'}
              </h2>
              <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">
                {lang === 'fr' ? 'Entre ton code pour continuer' : 'Enter your code to continue'}
              </p>
            </div>

            {!forgotPinMode ? (
              <>
                <input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={lockPinInput}
                  onChange={e => { setLockPinInput(e.target.value.replace(/\D/g, '')); setLockError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') attemptUnlock(); }}
                  className="w-full text-center tracking-[0.5em] text-xl font-black bg-app-card border border-app-border rounded-xl px-4 py-3 focus:outline-none focus:border-app-accent transition-colors"
                  placeholder="••••"
                />
                {lockError && <p className="text-xs text-red-500 font-bold">{lockError}</p>}
                <button
                  onClick={attemptUnlock}
                  className="w-full py-3 bg-app-accent text-app-accent-text rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                >
                  {lang === 'fr' ? 'Déverrouiller' : 'Unlock'}
                </button>
                <button
                  onClick={() => { setForgotPinMode(true); setLockError(''); }}
                  className="text-[11px] text-app-muted hover:text-app-text underline underline-offset-2 transition-colors"
                >
                  {lang === 'fr' ? 'Code oublié ?' : 'Forgot your code?'}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-app-text font-semibold">{pinQuestion}</p>
                <input
                  type="text"
                  autoFocus
                  value={forgotPinAnswer}
                  onChange={e => { setForgotPinAnswer(e.target.value); setLockError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') attemptForgotPinUnlock(); }}
                  className="w-full text-center bg-app-card border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-app-accent transition-colors"
                  placeholder={lang === 'fr' ? 'Ta réponse' : 'Your answer'}
                />
                {lockError && <p className="text-xs text-red-500 font-bold">{lockError}</p>}
                <p className="text-[10px] text-app-muted italic">
                  {lang === 'fr'
                    ? 'Une bonne réponse retire le verrou — tu pourras en redéfinir un nouveau dans les paramètres.'
                    : "A correct answer removes the lock — you'll be able to set a new one in settings."}
                </p>
                <button
                  onClick={attemptForgotPinUnlock}
                  className="w-full py-3 bg-app-accent text-app-accent-text rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                >
                  {lang === 'fr' ? 'Valider' : 'Confirm'}
                </button>
                <button
                  onClick={() => { setForgotPinMode(false); setLockError(''); setForgotPinAnswer(''); }}
                  className="text-[11px] text-app-muted hover:text-app-text underline underline-offset-2 transition-colors"
                >
                  {lang === 'fr' ? 'Retour au code' : 'Back to code'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Onboarding — carrousel de bienvenue (premier lancement) */}
      {showOnboarding && !isLocked && (() => {
        const slides = [
          {
            icon: Shield,
            title: lang === 'fr' ? 'Bienvenue sur Haven Space' : 'Welcome to Haven Space',
            text: lang === 'fr'
              ? 'Tout ce que tu ajoutes ici reste sur ton appareil. Rien n\'est envoyé sur un serveur, il n\'y a pas de compte à créer.'
              : "Everything you add here stays on your device. Nothing is sent to a server, there's no account to create.",
          },
          {
            icon: Users,
            title: lang === 'fr' ? 'Ton système' : 'Your system',
            text: lang === 'fr'
              ? 'Chaque membre du système a sa propre fiche (alter) : nom, rôle, apparence, notes... Tu peux en créer autant que besoin, et les organiser en sous-systèmes.'
              : 'Each system member has their own profile (alter): name, role, appearance, notes... Create as many as you need, and organize them into subsystems.',
          },
          {
            icon: LayoutDashboard,
            title: lang === 'fr' ? 'Le tableau de bord' : 'The dashboard',
            text: lang === 'fr'
              ? "C'est ton point de départ : accès rapide au planning, à la santé, à la détente, à la messagerie interne et à bien plus."
              : "It's your starting point: quick access to planning, health, relax tools, internal messaging, and more.",
          },
          {
            icon: Repeat,
            title: lang === 'fr' ? 'Le switch' : 'Switching',
            text: lang === 'fr'
              ? "Indique qui est aux commandes à tout moment, et garde un historique des passages. C'est le cœur du suivi au quotidien."
              : "Track who's fronting at any moment, with a history of past switches. It's the core of day-to-day tracking.",
          },
          {
            icon: Download,
            title: lang === 'fr' ? 'Pense à sauvegarder' : 'Remember to back up',
            text: lang === 'fr'
              ? "Comme il n'y a pas de compte ni de cloud, exporte régulièrement ton système (JSON) depuis les Paramètres — c'est ta seule sauvegarde en cas de souci."
              : "Since there's no account or cloud, regularly export your system (JSON) from Settings — it's your only backup if something goes wrong.",
          },
          {
            icon: AlertTriangle,
            title: lang === 'fr' ? 'Le bouton SOS' : 'The SOS button',
            text: lang === 'fr'
              ? 'Toujours visible en haut de l\'écran : il t\'amène direct vers l\'Ancrage en cas de coup dur. Repère-le dès maintenant, avant d\'en avoir besoin.'
              : "Always visible at the top of the screen: it takes you straight to Grounding when things get hard. Spot it now, before you need it.",
          },
          {
            icon: HelpCircle,
            title: lang === 'fr' ? 'Un doute ? Le Guide est là' : 'Not sure? Check the Guide',
            text: lang === 'fr'
              ? 'Toutes les fonctionnalités sont réexpliquées dans le Guide, accessible à tout moment. Tu peux aussi revoir cette visite depuis les Paramètres.'
              : 'Every feature is explained in the Guide, accessible any time. You can also replay this tour from Settings.',
          },
        ];
        const isLast = onboardingStep === slides.length - 1;
        const slide = slides[onboardingStep];
        const SlideIcon = slide.icon;
        return (
          <div className="fixed inset-0 z-[9998] bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-app-card border border-app-border rounded-3xl shadow-2xl p-6 space-y-5 relative">
              <button
                onClick={closeOnboarding}
                className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors"
              >
                <span className="sr-only">{lang === 'fr' ? 'Passer' : 'Skip'}</span>
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent">
                <SlideIcon className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-black text-app-text">{slide.title}</h2>
                <p className="text-sm text-app-muted leading-relaxed">{slide.text}</p>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-1">
                {slides.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === onboardingStep ? 'w-5 bg-app-accent' : 'w-1.5 bg-app-border'}`} />
                ))}
              </div>

              {!isLast ? (
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={closeOnboarding}
                    className="text-xs font-bold text-app-muted hover:text-app-text transition-colors px-2"
                  >
                    {lang === 'fr' ? 'Passer' : 'Skip'}
                  </button>
                  <div className="flex items-center gap-2">
                    {onboardingStep > 0 && (
                      <button
                        onClick={() => setOnboardingStep(s => s - 1)}
                        className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text transition-colors"
                      >
                        {lang === 'fr' ? 'Retour' : 'Back'}
                      </button>
                    )}
                    <button
                      onClick={() => setOnboardingStep(s => s + 1)}
                      className="px-5 py-2.5 bg-app-accent text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                    >
                      {lang === 'fr' ? 'Suivant' : 'Next'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => { closeOnboarding(); handleResetCreator(); }}
                    className="w-full py-3 bg-app-accent text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                  >
                    {lang === 'fr' ? 'Créer mon premier alter' : 'Create my first alter'}
                  </button>
                  <button
                    onClick={closeOnboarding}
                    className="w-full py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text transition-colors"
                  >
                    {lang === 'fr' ? 'Explorer par moi-même' : 'Explore on my own'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt=""
            className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
            onError={e => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.lightbox-error-msg')) {
                const msg = document.createElement('p');
                msg.className = 'lightbox-error-msg text-white/70 text-sm text-center px-6';
                msg.textContent = lang === 'fr' ? "Impossible de charger cette image (lien cassé ou indisponible)." : "Couldn't load this image (broken or unavailable link).";
                parent.appendChild(msg);
              }
            }}
          />
        </div>
      )}
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
      @keyframes ephemeralBubbleRise {
        0% { transform: translate(0, 0); opacity: 0; }
        8% { opacity: 1; }
        30% { transform: translate(var(--drift, 0px), calc(-0.3 * var(--rise-distance, 400px))); }
        60% { transform: translate(calc(-1 * var(--drift, 0px)), calc(-0.62 * var(--rise-distance, 400px))); }
        90% { opacity: 1; }
        100% { transform: translate(0, calc(-1 * var(--rise-distance, 400px))); opacity: 0; }
      }
      .ephemeral-bubble-rise {
        animation-name: ephemeralBubbleRise;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }
      @keyframes ecoFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .eco-float { animation-name: ecoFloat; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoSwim {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(5px) rotate(4deg); }
        75% { transform: translateX(-5px) rotate(-4deg); }
      }
      .eco-swim { animation-name: ecoSwim; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoGlow {
        0%, 100% { filter: drop-shadow(0 0 2px currentColor) brightness(1); opacity: 0.85; }
        50% { filter: drop-shadow(0 0 9px currentColor) brightness(1.4); opacity: 1; }
      }
      .eco-glow { animation-name: ecoGlow; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoAmbientRise {
        0% { transform: translateY(0); opacity: 0; }
        15% { opacity: 0.55; }
        100% { transform: translateY(-130px); opacity: 0; }
      }
      .eco-ambient-rise { animation-name: ecoAmbientRise; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes ecoTwinkle {
        0%, 100% { opacity: 0.25; }
        50% { opacity: 1; }
      }
      .eco-twinkle { animation-name: ecoTwinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoDust {
        0% { transform: translate(0, 0); opacity: 0; }
        12% { opacity: 0.5; }
        100% { transform: translate(8px, -55px); opacity: 0; }
      }
      .eco-ambient-dust { animation-name: ecoDust; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .eco-spin { animation-name: ecoSpin; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes ecoWind {
        0%, 100% { transform: rotate(-15deg); }
        30% { transform: rotate(12deg); }
        55% { transform: rotate(-6deg); }
        80% { transform: rotate(20deg); }
      }
      .eco-wind { animation-name: ecoWind; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes ecoSway {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(16deg); }
        75% { transform: rotate(-16deg); }
      }
      .eco-sway { animation-name: ecoSway; animation-timing-function: ease-in-out; animation-iteration-count: 2; }
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
            <div className="w-12 h-12 flex items-center justify-center text-app-text bg-app-accent/15 rounded-2xl border border-app-accent/20 shrink-0">
              <svg viewBox="120 427 1821 1174" className="w-10 h-10" fill="currentColor">
                <path d="M1392.5 509.5c-48.6 6.9-88.8 24.1-122.7 52.4-27.9 23.4-49.4 58.2-58.8 95.1-5.3 20.9-7.1 54.7-4.1 77 1.7 12.2 7 33.2 11.1 43.5 15.8 39.7 48.8 82.5 96.5 124.9 29.3 26.1 49.6 42.4 88.5 71.2 83.7 61.8 129.7 106 163 156.4 25.1 38 35.4 76.2 33.6 125-1.3 38.4-7.5 70.6-18.7 98.3-2.3 5.6-4.3 10.4-4.5 10.6-.1.2-4.7-.8-10.1-2.3-15.9-4.1-31.7-7.3-50.3-10-35.8-5.2-56.9-6.6-100.3-6.6-64.9 0-124 6.1-199.2 20.5-27.6 5.3-25.8 5.2-28.2 1.9-7.1-10-19-34.7-25.5-52.8-11.9-33.2-17-63.3-17-99.6-.1-60.9 12.7-109.8 41-157.8 9.5-15.9 19.4-28.6 32.6-41.8 19.7-19.7 41.9-34.7 67.8-45.9 11.5-4.9 31.8-12 41.6-14.5 3.8-1 4.2-1.4 4.2-4.1v-3.1l-9.2.6c-50.9 3.6-97 16.6-136.2 38.3-27.7 15.3-53.7 36.4-72.3 58.5-15.8 19-33 49.2-40.8 71.7-9.6 28.2-14.2 59-13.3 90.3.2 8.2 0 14.8-.4 14.8-1.8 0-13.6-6.4-19.5-10.6-19.6-13.9-30.9-39.9-35.8-82.4-2.2-18.2-2.2-501.4 0-519 2.1-17.9 7.5-38.3 13-49.1 7.5-15 19.8-26 36.7-32.9l7.3-2.9H803.5l8 3.5c10.4 4.6 17 9.2 24.7 17.4 11.6 12.2 18.2 29.1 23.5 60 1.5 8.5 1.7 24.8 2 143.3.2 73.6 0 133.8-.4 133.8-.5 0-3.6-2.3-6.8-5.1-16.2-13.9-40.2-30.4-59.3-40.7-46.3-25.1-106.1-38.8-178.2-41.1l-20.5-.6V707c0-93.3.1-95.2 4.7-115 8.8-37.6 20.7-52.7 51.8-65.8 1.8-.8-35.5-1.1-127.5-1.1l-130-.1 7.9 3.5c28 12.2 40.6 31.3 48.8 74 2.1 10.7 2.2 13.9 2.5 117l.4 106.1-5.8 2.3c-8.7 3.5-32.5 15.5-43.3 21.8-73.8 43.2-127.7 114.8-148.6 197.4-6.8 27-9.3 46.7-10.1 78.6-2 79.3 18.8 142.2 66.6 201.5 64.7 80.3 172.2 131.7 300.6 143.7 36.9 3.5 112.1 1.8 182-4 75.5-6.3 158.6-14.9 219-22.9 36.1-4.8 95.2-11.3 149.2-16.6 6-.6 6.2-.5 11.5 3.4 2.9 2.2 10.3 7 16.3 10.7 44.3 26.9 97.2 43.7 153.4 48.6 17.1 1.5 63.9.6 81.6-1.5 43.2-5.2 81.2-16 118.2-33.6 14.3-6.8 19.2-9.6 35.3-19.6l8.6-5.3 21.9 4.3c48.9 9.7 95.6 24.4 130.7 40.9 23 10.9 49.6 27.9 66.2 42.6l4 3.4 2.8-3.4 2.9-3.4-8.8-8.5c-52.2-50.2-107.8-90.1-158.8-114l-10.7-5 2.4-2.8c13.5-16.5 20.3-25.4 26.4-34.7 29.4-44.8 46.7-94.1 53.6-153 2-17.4 1.7-63.6-.5-76.6-4.9-29.4-13.8-52.8-29.5-77.9-36.9-59-90.5-109.4-187.9-176.8-45.3-31.4-84.7-60.6-108.8-80.8-33.6-28-66-63.1-80-86.6-14.3-23.9-20.4-50.6-18.3-79.7 3-41.4 22.2-69.3 60.3-87.6 19.9-9.5 39.8-13.8 64.5-13.9 15-.1 17.4.2 26.2 2.6 18.4 5.2 33 14.3 52.3 33 32.7 31.4 61.7 81.4 80.8 138.8 2.4 7.4 5.3 17 6.3 21.2 1 4.3 2 7.8 2.4 7.8.3 0 5.6-44 11.8-97.8 6.3-53.7 11.6-99.5 11.9-101.7l.6-4-5.9 5.3c-6.7 6-15.1 10.4-23.9 12.7-16.2 4.1-47.8-.5-85.7-12.6-10.3-3.3-26.3-7.6-35.5-9.6-16-3.4-17.9-3.6-38.8-3.9-15-.2-25.2.2-32 1.1m-727.9 305c38.1 4 70.7 13.2 109.4 31 26 11.9 56.3 30.4 77.8 47.6l10.3 8.3-.4 110.5c-.4 123.8-.2 119.7-7.8 149.7-5.6 22.3-10.5 32.3-21.3 43-6.8 6.9-9.7 8.9-18.6 13.3l-10.5 5.1h258.1l1.7 14.7c6.1 52.5 25.3 100.9 55.5 139.3 3.4 4.3 4.7 6.7 3.9 7.1-.7.4-4.8 1.4-9.2 2.4-4.4.9-30.8 7-58.7 13.6-120.3 28.2-209.3 45.9-266.8 52.8-57.9 7.1-123.2 8.9-164.5 4.6-42.5-4.4-90.5-16.2-124.5-30.4-74-31.2-127.9-80.8-160.5-147.6-13.9-28.6-22.2-58-26.7-94.5-1.7-13.7-1.7-72.9 0-90.5 4.7-47.9 10.6-75.9 22.6-106.5 23.4-59.4 59.3-103.5 107.6-132.1 6.5-3.8 12-6.9 12.4-6.9 1.1 0 .7 265.6-.4 280.1-1.8 23.3-4.9 35.7-12.8 51.4-10.1 20.3-22.8 33-40 40.1l-5.7 2.4 130.5-.1c112.2 0 130-.2 126.7-1.4-12.9-4.8-27.1-15-34.3-24.7-9.6-13.1-16-32.7-20.6-63.3-.8-5.9-1.2-49.8-1.5-164.3l-.4-156.2H623c17.3 0 32.3.6 41.6 1.5m775.9 602.5c42.7 1.3 90.1 4.4 91.8 6 1 .9-10.5 10.2-21.4 17.3-34.4 22.3-79.4 33.7-133.4 33.7-27.3 0-47.5-3-70.1-10.5-22.5-7.4-48.9-21.8-66.8-36.3l-6.9-5.7 3.4-.6c3.5-.7 57.7-3.8 74.9-4.2 27-.8 100.4-.6 128.5.3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-app-text">{t.title}</h1>
              <p className="text-[10px] text-app-text/80 uppercase tracking-widest font-black font-mono">{t.subtitle}</p>
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

            {/* Bouton SOS */}
            <button
              onClick={() => { setSosMode(true); setCurrentTab('grounding'); }}
              className="p-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/60 rounded-full transition-all flex items-center justify-center shadow-sm"
              title={lang === 'fr' ? 'Mode crise — Accès rapide Ancrage' : 'Crisis mode — Quick access Grounding'}
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </button>

            {/* Accès rapide aux infos d'urgence — équivalent web de la notification persistante */}
            {emergencyInfo.showQuickAccess && (
              <button
                onClick={() => { setCurrentTab('health'); setHealthSubTab('urgence'); }}
                className="p-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/60 rounded-full transition-all flex items-center justify-center shadow-sm"
                title={lang === 'fr' ? "Infos d'urgence" : 'Emergency info'}
              >
                <HeartPulse className="w-5 h-5 text-red-500" />
              </button>
            )}

            {/* Unified Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                className="p-3 bg-app-card border border-app-border hover:border-app-accent hover:text-app-text rounded-full transition-all text-app-text shadow-sm flex items-center justify-center cursor-pointer"
                title={lang === 'fr' ? 'Paramètres' : 'Settings'}
              >
                <Settings2 className={`w-5 h-5 text-app-text transition-transform duration-500 ${settingsMenuOpen ? 'rotate-90' : ''}`} />
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

                      {/* Accessibilité — taille du texte */}
                      <div className="space-y-1.5">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {lang === 'fr' ? 'Taille du texte' : 'Text size'}
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {([
                            { id: 'small', label: 'A', size: '11px' },
                            { id: 'normal', label: 'A', size: '13px' },
                            { id: 'large', label: 'A', size: '15px' },
                            { id: 'xlarge', label: 'A', size: '17px' },
                          ] as const).map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => { setFontScale(opt.id); localStorage.setItem('hs-font-scale', opt.id); }}
                              style={{ fontSize: opt.size }}
                              className={`py-2 rounded-xl font-black border transition-all ${fontScale === opt.id ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border/45 text-app-muted hover:text-app-text'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
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

                      {/* Custom Theme Section */}
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setSettingsCustomThemeOpen(o => !o)}
                          className="w-full flex items-center justify-between px-3 py-2.5 bg-app-bg text-app-text border border-app-border/45 rounded-xl text-xs font-semibold focus:outline-none hover:border-app-accent/85 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5" />
                            {lang === 'fr' ? 'Thème personnalisé' : 'Custom theme'}
                            {customThemeColors && <span className="w-1.5 h-1.5 rounded-full bg-app-accent" />}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-app-muted transition-transform duration-300 ${settingsCustomThemeOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {settingsCustomThemeOpen && (() => {
                            const preset = getThemeStyles() as Record<string, string>;
                            const fields: { key: 'accent' | 'bg' | 'card' | 'text' | 'border'; label: string; presetVar: string }[] = [
                              { key: 'accent', label: lang === 'fr' ? "Couleur d'accent" : 'Accent color', presetVar: '--color-app-accent' },
                              { key: 'bg', label: lang === 'fr' ? 'Couleur de fond principale' : 'Main background color', presetVar: '--color-app-bg' },
                              { key: 'card', label: lang === 'fr' ? 'Couleur des cartes' : 'Card color', presetVar: '--color-app-card' },
                              { key: 'text', label: lang === 'fr' ? 'Couleur du texte' : 'Text color', presetVar: '--color-app-text' },
                              { key: 'border', label: lang === 'fr' ? 'Couleur des bordures' : 'Border color', presetVar: '--color-app-border' },
                            ];
                            return (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border border-app-border/20 rounded-xl bg-app-bg/50"
                              >
                                <div className="p-3 space-y-3">
                                  <p className="text-[10px] text-app-muted leading-relaxed">
                                    {lang === 'fr'
                                      ? "Ajustez ces couleurs pour créer votre propre variante par-dessus le thème actif. Elles sont sauvegardées automatiquement."
                                      : 'Adjust these colors to build your own variant on top of the active theme. They are saved automatically.'}
                                  </p>
                                  {fields.map(f => {
                                    const current = customThemeColors?.[f.key] || cssColorToHex(preset[f.presetVar] || '#000000');
                                    return (
                                      <div key={f.key} className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-app-muted">{f.label}</label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={current}
                                            onChange={e => setCustomThemeColors(prev => ({
                                              accent: prev?.accent || cssColorToHex(preset['--color-app-accent']),
                                              bg: prev?.bg || cssColorToHex(preset['--color-app-bg']),
                                              card: prev?.card || cssColorToHex(preset['--color-app-card']),
                                              text: prev?.text || cssColorToHex(preset['--color-app-text']),
                                              border: prev?.border || cssColorToHex(preset['--color-app-border']),
                                              [f.key]: e.target.value,
                                            }))}
                                            className="flex-1 min-w-0 bg-app-card border border-app-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text uppercase"
                                          />
                                          <label
                                            style={{
                                              width: '2.25rem',
                                              height: '2.25rem',
                                              minWidth: '2.25rem',
                                              borderRadius: '0.75rem',
                                              border: '1px solid rgba(128,128,128,0.4)',
                                              backgroundColor: current,
                                              cursor: 'pointer',
                                              display: 'block',
                                              position: 'relative',
                                              overflow: 'hidden',
                                              flexShrink: 0,
                                            }}
                                            title={current}
                                          >
                                            <input
                                              type="color"
                                              value={current}
                                              onChange={e => setCustomThemeColors(prev => ({
                                                accent: prev?.accent || cssColorToHex(preset['--color-app-accent']),
                                                bg: prev?.bg || cssColorToHex(preset['--color-app-bg']),
                                                card: prev?.card || cssColorToHex(preset['--color-app-card']),
                                                text: prev?.text || cssColorToHex(preset['--color-app-text']),
                                                border: prev?.border || cssColorToHex(preset['--color-app-border']),
                                                [f.key]: e.target.value,
                                              }))}
                                              style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                border: 'none',
                                                padding: 0,
                                              }}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <button
                                    onClick={() => setCustomThemeColors(null)}
                                    disabled={!customThemeColors}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-app-border text-[11px] font-bold text-app-muted hover:text-app-text hover:border-app-accent/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
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
                            <span className="text-[10px] text-app-muted">
                              {lang === 'fr' ? 'Messages, rappels de planning, traitements, hydratation et sauvegarde' : 'Messages, planning, medication, hydration and backup reminders'}
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
                        {/* Rappel d'hydratation — opt-in séparé, lié au Jardin de l'Éco-Système */}
                        <button
                          onClick={() => setHydroReminderOn(o => !o)}
                          className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent/30 transition-colors rounded-xl"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-app-text">
                              💧 {lang === 'fr' ? "Rappel d'hydratation (Jardin)" : 'Hydration reminder (Garden)'}
                            </span>
                            <span className="text-[10px] text-app-muted">
                              {lang === 'fr' ? 'Un rappel pour boire, entre 8h et 22h' : 'A reminder to drink water, between 8am and 10pm'}
                            </span>
                          </div>
                          <div className={`w-8 h-4 rounded-full transition-colors relative ${hydroReminderOn ? 'bg-app-accent' : 'bg-app-border'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${hydroReminderOn ? 'left-[18px]' : 'left-0.5'}`} />
                          </div>
                        </button>
                        {hydroReminderOn && (
                          <div className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 rounded-xl">
                            <span className="text-[10px] font-bold text-app-muted uppercase tracking-wide">
                              {lang === 'fr' ? 'Toutes les' : 'Every'}
                            </span>
                            <div className="flex flex-wrap justify-end gap-1">
                              {[15, 30, 60, 120, 180, 240, 360].map(m => (
                                <button
                                  key={m}
                                  onClick={() => setHydroIntervalMinutes(m)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${hydroIntervalMinutes === m ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'}`}
                                >
                                  {m < 60 ? `${m}min` : `${m / 60}h`}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Revoir la visite guidée */}
                      <div className="pt-3 border-t border-app-border/20">
                        <button
                          onClick={() => { setSettingsMenuOpen(false); restartOnboarding(); }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent/30 transition-colors rounded-xl"
                        >
                          <span className="text-xs font-bold text-app-text">
                            {lang === 'fr' ? 'Revoir la visite guidée' : 'Replay the welcome tour'}
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-app-muted" />
                        </button>
                      </div>

                      {/* Verrouillage PIN */}
                      <div className="pt-3 border-t border-app-border/20 flex flex-col gap-2">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-app-muted">
                          {lang === 'fr' ? 'Verrouillage' : 'Lock'}
                        </span>

                        {!pinEnabled && pinSetupStep === 'idle' && (
                          <button
                            onClick={startPinSetup}
                            className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-app-accent/30 transition-colors rounded-xl"
                          >
                            <span className="text-xs font-bold text-app-text">
                              {lang === 'fr' ? "Protéger l'accès avec un code" : 'Protect access with a code'}
                            </span>
                            <Lock className="w-3.5 h-3.5 text-app-muted" />
                          </button>
                        )}

                        {pinEnabled && pinSetupStep === 'idle' && (
                          <button
                            onClick={disablePin}
                            className="flex items-center justify-between px-3 py-2 bg-app-bg/50 border border-app-border/10 hover:border-red-500/30 transition-colors rounded-xl"
                          >
                            <span className="text-xs font-bold text-app-text">
                              {lang === 'fr' ? 'Désactiver le code' : 'Disable the code'}
                            </span>
                            <div className="w-8 h-4 rounded-full transition-colors relative bg-app-accent">
                              <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all left-[18px]" />
                            </div>
                          </button>
                        )}

                        {pinSetupStep === 'enter' && (
                          <div className="space-y-2 p-3 bg-app-bg/50 border border-app-border/10 rounded-xl">
                            <p className="text-[10px] text-app-muted font-bold">
                              {lang === 'fr' ? 'Choisis un code (4 à 6 chiffres)' : 'Choose a code (4 to 6 digits)'}
                            </p>
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={6}
                              value={pinSetupValue}
                              onChange={e => setPinSetupValue(e.target.value.replace(/\D/g, ''))}
                              className="w-full text-center tracking-[0.4em] font-black bg-app-card border border-app-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-app-accent"
                              placeholder="••••"
                            />
                            {pinSetupError && <p className="text-[10px] text-red-500 font-bold">{pinSetupError}</p>}
                            <button
                              onClick={confirmPinSetup}
                              className="w-full py-2 bg-app-accent text-app-accent-text rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                              {lang === 'fr' ? 'Continuer' : 'Continue'}
                            </button>
                          </div>
                        )}

                        {pinSetupStep === 'confirm' && (
                          <div className="space-y-2 p-3 bg-app-bg/50 border border-app-border/10 rounded-xl">
                            <p className="text-[10px] text-app-muted font-bold">
                              {lang === 'fr' ? 'Confirme le code' : 'Confirm the code'}
                            </p>
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={6}
                              value={pinSetupConfirm}
                              onChange={e => setPinSetupConfirm(e.target.value.replace(/\D/g, ''))}
                              className="w-full text-center tracking-[0.4em] font-black bg-app-card border border-app-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-app-accent"
                              placeholder="••••"
                            />
                            {pinSetupError && <p className="text-[10px] text-red-500 font-bold">{pinSetupError}</p>}
                            <button
                              onClick={validatePinConfirm}
                              className="w-full py-2 bg-app-accent text-app-accent-text rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                              {lang === 'fr' ? 'Continuer' : 'Continue'}
                            </button>
                          </div>
                        )}

                        {pinSetupStep === 'question' && (
                          <div className="space-y-2 p-3 bg-app-bg/50 border border-app-border/10 rounded-xl">
                            <p className="text-[10px] text-app-muted font-bold">
                              {lang === 'fr'
                                ? 'Question de secours (si tu oublies ton code — choisis un truc simple, pas sensible)'
                                : "Backup question (if you forget your code — pick something simple, not sensitive)"}
                            </p>
                            <input
                              type="text"
                              value={pinSetupQuestion}
                              onChange={e => setPinSetupQuestion(e.target.value)}
                              className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-app-accent"
                              placeholder={lang === 'fr' ? 'Ex : couleur préférée ?' : 'Ex: favorite color?'}
                            />
                            <input
                              type="text"
                              value={pinSetupAnswer}
                              onChange={e => setPinSetupAnswer(e.target.value)}
                              className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-app-accent"
                              placeholder={lang === 'fr' ? 'Réponse' : 'Answer'}
                            />
                            {pinSetupError && <p className="text-[10px] text-red-500 font-bold">{pinSetupError}</p>}
                            <p className="text-[10px] text-app-muted italic">
                              {lang === 'fr'
                                ? "⚠️ Sans récupération classique (pas d'e-mail, pas de serveur) : pense à faire un export JSON régulier de ton système."
                                : "⚠️ No classic recovery (no email, no server): remember to export your system as JSON regularly."}
                            </p>
                            <button
                              onClick={finalizePinSetup}
                              className="w-full py-2 bg-app-accent text-app-accent-text rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                              {lang === 'fr' ? 'Activer le verrouillage' : 'Enable lock'}
                            </button>
                          </div>
                        )}
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
          <div className="z-50">
            {currentTab !== 'home' ? (
              <button
                onClick={() => {
                  if (currentTab === 'creator' && creatorReturnTab) {
                    setCurrentTab(creatorReturnTab);
                    setCreatorReturnTab(null);
                  } else {
                    setCurrentTab('home');
                  }
                }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-app-card border border-app-border text-xs font-black uppercase tracking-widest text-app-text hover:border-app-accent/40 active:scale-95 transition-all shadow-md select-none"
              >
                <ChevronRight className="w-4 h-4 text-app-text rotate-180" />
                <span>
                  {currentTab === 'creator' && creatorReturnTab
                    ? (lang === 'fr' ? 'Retour' : 'Back')
                    : (lang === 'fr' ? 'Tableau de bord' : 'Dashboard')}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-app-accent text-white text-xs font-black uppercase tracking-widest shadow-md select-none">
                <LayoutDashboard className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}</span>
              </div>
            )}
          </div>

          {/* Nombre d'Alter count element */}
          <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-app-card/60 border border-app-border/30 text-xs font-semibold select-none text-app-text">
            <Users className="w-3.5 h-3.5 text-app-text" />
            <span className="text-app-text/75 uppercase tracking-widest text-[9px] font-black">{t.altersCount}</span>
            <span className="font-black text-app-text text-sm leading-none">{savedAlters.length}</span>
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

          {/* System Selector — visible si systèmes parallèles existent */}
          {parallelSystems.length > 0 && (
            <section className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <Shield className="w-3 h-3" /> {lang === 'fr' ? "Système" : "System"}
              </label>
              <select
                value={creatorSystemId || activeSystemId}
                onChange={e => { setCreatorSystemId(e.target.value); setCreatorSubsystemId(''); }}
                className="w-full bg-app-card border border-app-border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all appearance-none cursor-pointer"
              >
                <option value="main">{lang === 'fr' ? "Système principal" : "Main system"}</option>
                {parallelSystems.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </section>
          )}

          {/* Subsystem Selector */}
          {activeSystemSubsystems.length > 0 && (
            <section className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <Layers className="w-3 h-3" /> {lang === 'fr' ? "Sous-système" : "Subsystem"}
              </label>
              <select
                value={creatorSubsystemId}
                onChange={e => setCreatorSubsystemId(e.target.value)}
                className="w-full bg-app-card border border-app-border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">{lang === 'fr' ? "Système principal" : "Main system"}</option>
                {activeSystemSubsystems.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </section>
          )}

          {/* Description Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <FileText className="w-3 h-3" /> {t.descriptionTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {description.length}/300000
              </span>
            </div>
            <MarkdownEditor
              value={description}
              onChange={updateDescription}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              maxLength={300000}
              allowInlineImages={false}
              onImageClick={setLightboxImage}
            />

            {/* Add Images/Photos */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-app-muted flex items-center gap-1.5 cursor-pointer hover:text-app-text">
                <Upload className="w-3.5 h-3.5" />
                <span>{t.addPhotos}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleCompressAndStoreFiles(e.target.files, (urls) => {
                      setDescriptionImages(prev => [...prev, ...urls]);
                    });
                  }}
                />
              </label>
              {descriptionImages.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-app-card border border-app-border/30 rounded-xl">
                  {descriptionImages.map((img, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-app-border/40 shrink-0 group">
                      <img
                        src={img}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(img)}
                      />
                      <button
                        type="button"
                        onClick={() => setDescriptionImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-md bg-black/60 hover:bg-red-500/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Internal Notes Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-app-text/80 flex items-center gap-2">
                <Lock className="w-3 h-3" /> {t.internalNotesTitle}
              </label>
              <span className="text-[10px] font-mono opacity-50">
                {internalNotes.length}/300000
              </span>
            </div>
            <MarkdownEditor
              value={internalNotes}
              onChange={updateInternalNotes}
              placeholder={t.internalNotesPlaceholder}
              rows={4}
              maxLength={300000}
              allowInlineImages={false}
              onImageClick={setLightboxImage}
            />

            {/* Add Images/Photos */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-app-muted flex items-center gap-1.5 cursor-pointer hover:text-app-text">
                <Upload className="w-3.5 h-3.5" />
                <span>{t.addPhotos}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleCompressAndStoreFiles(e.target.files, (urls) => {
                      setInternalNotesImages(prev => [...prev, ...urls]);
                    });
                  }}
                />
              </label>
              {internalNotesImages.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-app-card border border-app-border/30 rounded-xl">
                  {internalNotesImages.map((img, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-app-border/40 shrink-0 group">
                      <img
                        src={img}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxImage(img)}
                      />
                      <button
                        type="button"
                        onClick={() => setInternalNotesImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-md bg-black/60 hover:bg-red-500/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? "Date d'anniversaire" : 'Birthday'}</label>
                  <input type="date" value={alterBirthday} onChange={e => setAlterBirthday(e.target.value)}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                  <p className="text-[9px] text-app-muted italic">
                    {lang === 'fr' ? 'Apparaîtra automatiquement chaque année dans le Planning.' : 'Will automatically appear every year in Planning.'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? "Source de l'alter" : 'Alter Source'}</label>
                  <input type="text" value={alterOriginWorld} onChange={e => setAlterOriginWorld(e.target.value)}
                    placeholder={lang === 'fr' ? 'Fictif ou factif' : 'Fictitious or factual'}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Tags personnalisés' : 'Custom tags'}</label>
                  <input
                    type="text"
                    value={alterTagInput}
                    onChange={e => setAlterTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = alterTagInput.trim();
                        if (val && !alterTags.some(t2 => t2.toLowerCase() === val.toLowerCase())) {
                          setAlterTags(prev => [...prev, val]);
                        }
                        setAlterTagInput('');
                      }
                    }}
                    placeholder={lang === 'fr' ? 'Tape un tag et appuie sur Entrée...' : 'Type a tag and press Enter...'}
                    className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted"
                  />
                  {alterTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {alterTags.map(t2 => (
                        <button
                          key={t2}
                          onClick={() => setAlterTags(prev => prev.filter(x => x !== t2))}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border border-app-accent/30 bg-app-accent/10 text-app-accent hover:opacity-70 transition-opacity"
                        >
                          {t2}
                          <X className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
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

                  {/* Rôles personnalisés */}
                  <div className="pt-4 border-t border-app-border/25 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                      {lang === 'fr' ? 'Rôles personnalisés' : 'Custom roles'}
                    </div>

                    {customRoles.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {[...customRoles].sort((a, b) => a.name.localeCompare(b.name, lang)).map((role) => {
                          const isSelected = selectedCustomRoleIds.includes(role.id);
                          return (
                            <div
                              key={role.id}
                              className={`relative group flex items-center gap-2 pl-4 pr-2 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-app-text text-app-bg border-transparent shadow-lg'
                                  : 'bg-app-card border-app-border hover:border-app-accent/30'
                              }`}
                              onClick={() => toggleCustomRoleSelection(role.id)}
                              title={role.definition || undefined}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: role.color || '#8B5CF6' }}
                              />
                              <span className="font-medium truncate flex-1 min-w-0">{role.name}</span>
                              <span className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); startEditCustomRole(role); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-app-accent/10 text-app-muted hover:text-app-text'}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setCustomRoleDeleteConfirmId(role.id); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-red-500/10 text-app-muted hover:text-red-500'}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Confirmation de suppression d'un rôle personnalisé */}
                    {customRoleDeleteConfirmId && (
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5">
                        <span className="text-xs text-app-text">
                          {lang === 'fr'
                            ? `Supprimer « ${customRoles.find(r => r.id === customRoleDeleteConfirmId)?.name || ''} » ? Il sera retiré de tous les alters concernés.`
                            : `Delete "${customRoles.find(r => r.id === customRoleDeleteConfirmId)?.name || ''}"? It will be removed from every alter using it.`}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteCustomRoleDefinition(customRoleDeleteConfirmId)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            {lang === 'fr' ? 'Supprimer' : 'Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomRoleDeleteConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-app-border text-app-muted hover:text-app-text transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formulaire de création / édition */}
                    <div className="space-y-2 p-3 rounded-xl border border-dashed border-app-border">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customRoleDraftColor}
                          onChange={(e) => setCustomRoleDraftColor(e.target.value)}
                          className="w-8 h-8 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={customRoleDraftName}
                          onChange={(e) => setCustomRoleDraftName(e.target.value)}
                          placeholder={lang === 'fr' ? 'Nom du rôle...' : 'Role name...'}
                          className="flex-1 min-w-0 bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted font-bold"
                        />
                      </div>
                      <textarea
                        value={customRoleDraftDefinition}
                        onChange={(e) => setCustomRoleDraftDefinition(e.target.value)}
                        placeholder={lang === 'fr' ? 'Définition de ce rôle...' : 'Definition of this role...'}
                        rows={2}
                        className="w-full bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={saveCustomRoleDraft}
                          disabled={!customRoleDraftName.trim()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-app-text text-app-bg text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        >
                          {editingCustomRoleId
                            ? <><Check className="w-3 h-3" /> {lang === 'fr' ? 'Enregistrer' : 'Save'}</>
                            : <><Plus className="w-3 h-3" /> {lang === 'fr' ? 'Ajouter un rôle' : 'Add a role'}</>}
                        </button>
                        {editingCustomRoleId && (
                          <button
                            type="button"
                            onClick={resetCustomRoleDraft}
                            className="px-3 py-2 rounded-xl border border-app-border text-app-muted hover:text-app-text text-xs font-bold uppercase tracking-widest transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
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
                          title={t.personalityTraitData[trait as keyof typeof t.personalityTraitData] || undefined}
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

                  {/* Traits personnalisés */}
                  <div className="pt-4 border-t border-app-border/25 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                      {lang === 'fr' ? 'Traits personnalisés' : 'Custom traits'}
                    </div>

                    {customTraits.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {[...customTraits].sort((a, b) => a.name.localeCompare(b.name, lang)).map((trait) => {
                          const isSelected = selectedCustomTraitIds.includes(trait.id);
                          return (
                            <div
                              key={trait.id}
                              className={`relative group flex items-center gap-2 pl-3 pr-1.5 py-2 rounded-xl border text-sm transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-app-text text-app-bg border-transparent shadow-lg'
                                  : 'bg-app-card border-app-border hover:border-app-accent/30'
                              }`}
                              onClick={() => toggleCustomTraitSelection(trait.id)}
                              title={trait.definition || undefined}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: trait.color || '#8B5CF6' }}
                              />
                              <span className="font-medium truncate">{trait.name}</span>
                              <span className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); startEditCustomTrait(trait); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-app-accent/10 text-app-muted hover:text-app-text'}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setCustomTraitDeleteConfirmId(trait.id); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-red-500/10 text-app-muted hover:text-red-500'}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {customTraitDeleteConfirmId && (
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5">
                        <span className="text-xs text-app-text">
                          {lang === 'fr'
                            ? `Supprimer « ${customTraits.find(tr => tr.id === customTraitDeleteConfirmId)?.name || ''} » ? Il sera retiré de tous les alters concernés.`
                            : `Delete "${customTraits.find(tr => tr.id === customTraitDeleteConfirmId)?.name || ''}"? It will be removed from every alter using it.`}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteCustomTraitDefinition(customTraitDeleteConfirmId)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            {lang === 'fr' ? 'Supprimer' : 'Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomTraitDeleteConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-app-border text-app-muted hover:text-app-text transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 p-3 rounded-xl border border-dashed border-app-border">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTraitDraftColor}
                          onChange={(e) => setCustomTraitDraftColor(e.target.value)}
                          className="w-8 h-8 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={customTraitDraftName}
                          onChange={(e) => setCustomTraitDraftName(e.target.value)}
                          placeholder={lang === 'fr' ? 'Nom du trait...' : 'Trait name...'}
                          className="flex-1 min-w-0 bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted font-bold"
                        />
                      </div>
                      <textarea
                        value={customTraitDraftDefinition}
                        onChange={(e) => setCustomTraitDraftDefinition(e.target.value)}
                        placeholder={lang === 'fr' ? 'Définition de ce trait...' : 'Definition of this trait...'}
                        rows={2}
                        className="w-full bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={saveCustomTraitDraft}
                          disabled={!customTraitDraftName.trim()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-app-text text-app-bg text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        >
                          {editingCustomTraitId
                            ? <><Check className="w-3 h-3" /> {lang === 'fr' ? 'Enregistrer' : 'Save'}</>
                            : <><Plus className="w-3 h-3" /> {lang === 'fr' ? 'Ajouter un trait' : 'Add a trait'}</>}
                        </button>
                        {editingCustomTraitId && (
                          <button
                            type="button"
                            onClick={resetCustomTraitDraft}
                            className="px-3 py-2 rounded-xl border border-app-border text-app-muted hover:text-app-text text-xs font-bold uppercase tracking-widest transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
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
                          title={t.disorderData[trait as keyof typeof t.disorderData] || undefined}
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

                  {/* Troubles personnalisés */}
                  <div className="pt-4 border-t border-app-border/25 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted/80 px-1 font-mono">
                      {lang === 'fr' ? 'Troubles personnalisés' : 'Custom disorders'}
                    </div>

                    {customDisorders.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {[...customDisorders].sort((a, b) => a.name.localeCompare(b.name, lang)).map((disorder) => {
                          const isSelected = selectedCustomDisorderIds.includes(disorder.id);
                          return (
                            <div
                              key={disorder.id}
                              className={`relative group flex items-center gap-2 pl-3 pr-1.5 py-2 rounded-xl border text-sm transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-app-text text-app-bg border-transparent shadow-lg'
                                  : 'bg-app-card border-app-border hover:border-app-accent/30'
                              }`}
                              onClick={() => toggleCustomDisorderSelection(disorder.id)}
                              title={disorder.definition || undefined}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: disorder.color || '#8B5CF6' }}
                              />
                              <span className="font-medium truncate">{disorder.name}</span>
                              <span className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); startEditCustomDisorder(disorder); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-app-accent/10 text-app-muted hover:text-app-text'}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setCustomDisorderDeleteConfirmId(disorder.id); }}
                                  className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-app-bg/20' : 'hover:bg-red-500/10 text-app-muted hover:text-red-500'}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {customDisorderDeleteConfirmId && (
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5">
                        <span className="text-xs text-app-text">
                          {lang === 'fr'
                            ? `Supprimer « ${customDisorders.find(d => d.id === customDisorderDeleteConfirmId)?.name || ''} » ? Il sera retiré de tous les alters concernés.`
                            : `Delete "${customDisorders.find(d => d.id === customDisorderDeleteConfirmId)?.name || ''}"? It will be removed from every alter using it.`}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteCustomDisorderDefinition(customDisorderDeleteConfirmId)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            {lang === 'fr' ? 'Supprimer' : 'Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomDisorderDeleteConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-app-border text-app-muted hover:text-app-text transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 p-3 rounded-xl border border-dashed border-app-border">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customDisorderDraftColor}
                          onChange={(e) => setCustomDisorderDraftColor(e.target.value)}
                          className="w-8 h-8 rounded-md border border-app-border overflow-hidden cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={customDisorderDraftName}
                          onChange={(e) => setCustomDisorderDraftName(e.target.value)}
                          placeholder={lang === 'fr' ? 'Nom du trouble...' : 'Disorder name...'}
                          className="flex-1 min-w-0 bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted font-bold"
                        />
                      </div>
                      <textarea
                        value={customDisorderDraftDefinition}
                        onChange={(e) => setCustomDisorderDraftDefinition(e.target.value)}
                        placeholder={lang === 'fr' ? 'Définition de ce trouble...' : 'Definition of this disorder...'}
                        rows={2}
                        className="w-full bg-app-card border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 text-app-text placeholder:text-app-muted resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={saveCustomDisorderDraft}
                          disabled={!customDisorderDraftName.trim()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-app-text text-app-bg text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        >
                          {editingCustomDisorderId
                            ? <><Check className="w-3 h-3" /> {lang === 'fr' ? 'Enregistrer' : 'Save'}</>
                            : <><Plus className="w-3 h-3" /> {lang === 'fr' ? 'Ajouter un trouble' : 'Add a disorder'}</>}
                        </button>
                        {editingCustomDisorderId && (
                          <button
                            type="button"
                            onClick={resetCustomDisorderDraft}
                            className="px-3 py-2 rounded-xl border border-app-border text-app-muted hover:text-app-text text-xs font-bold uppercase tracking-widest transition-colors"
                          >
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="sticky top-32 w-full space-y-8">
            

            {/* Profile Card Preview Container */}
            <div className="relative group w-full flex justify-center">
              <div 
                ref={flagRef}
                className="w-full max-w-[600px] rounded-[2rem] shadow-2xl border-8 border-app-card relative bg-app-bg text-app-text select-none flex flex-col justify-between h-auto overflow-visible"
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
                      {(selectedRoles.length > 0 || selectedCustomRoleIds.length > 0) && (
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
                                className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 shrink-0 whitespace-nowrap animate-fade-in"
                              >
                                <span 
                                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0" 
                                  style={{ backgroundColor: customRoleColors[role] || ROLE_CONFIGS[role].color }}
                                />
                                {t.roleNames[role as keyof typeof t.roleNames]}
                              </span>
                            ))}
                            {selectedCustomRoleIds.map(roleId => {
                              const role = customRoles.find(r => r.id === roleId);
                              if (!role) return null;
                              const roleColor = customRoleColors[roleId] || role.color || '#8B5CF6';
                              return (
                                <span
                                  key={roleId}
                                  title={role.definition || undefined}
                                  style={{
                                    backgroundColor: `${roleColor}20`,
                                    borderColor: `${roleColor}60`,
                                    color: roleColor
                                  }}
                                  className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 shrink-0 whitespace-nowrap animate-fade-in"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: roleColor }}
                                  />
                                  {role.name}
                                </span>
                              );
                            })}
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
                                    className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border flex items-center gap-1 shrink-0 whitespace-nowrap animate-fade-in"
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
                                    className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border flex items-center gap-1 shrink-0 whitespace-nowrap animate-fade-in"
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
                      
                      {/* Fallback Empty State / Placeholder */}
                      {/* Champs predéfinis dans la preview */}
                      {(alterAge || alterColor || triggersPositive || triggersNegative || alterLanguages || alterOriginWorld || alterTags.length > 0) && (
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
                                <span className="text-app-text/60 normal-case font-sans">({getClosestColorName(alterColor, bigColorNames)})</span>
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
                            {alterTags.length > 0 && (
                              <div className="flex items-start gap-2 text-[10px]">
                                <span className="font-black uppercase tracking-widest text-app-muted w-20 shrink-0 pt-0.5">{lang === 'fr' ? 'Tags' : 'Tags'}</span>
                                <div className="flex flex-wrap gap-1">
                                  {alterTags.map(t2 => (
                                    <span key={t2} className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border border-app-accent/30 bg-app-accent/10 text-app-accent">
                                      {t2}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Traits & Disorders Section */}
                      {(traitDecorations.length > 0 || selectedCustomTraitIds.length > 0 || selectedCustomDisorderIds.length > 0) && (
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-app-text animate-pulse">
                            {lang === 'fr' ? 'Traits & Troubles' : 'Traits & Conditions'}
                          </div>

                          {/* Personality Traits Sub-section */}
                          {(traitDecorations.filter(td => !Object.values(Disorder).includes(td.trait as Disorder)).length > 0 || selectedCustomTraitIds.length > 0) && (
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
                                        title={t.personalityTraitData[td.trait as keyof typeof t.personalityTraitData] || undefined}
                                        className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                      >
                                        <span className="text-app-accent bg-app-accent/10 p-1 rounded-full shrink-0">
                                          <span className="w-3 h-3 flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3">{getTraitIcon(td.trait)}</span>
                                        </span>
                                        <span>{name}</span>
                                      </div>
                                    );
                                  })}
                                {selectedCustomTraitIds.map(traitId => {
                                  const trait = customTraits.find(tr => tr.id === traitId);
                                  if (!trait) return null;
                                  return (
                                    <div
                                      key={traitId}
                                      title={trait.definition || undefined}
                                      className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: trait.color || '#8B5CF6' }}
                                      />
                                      <span>{trait.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Disorders Sub-section */}
                          {(traitDecorations.filter(td => Object.values(Disorder).includes(td.trait as Disorder)).length > 0 || selectedCustomDisorderIds.length > 0) && (
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
                                        title={t.disorderData[td.trait as keyof typeof t.disorderData] || undefined}
                                        className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                      >
                                        <span className="text-app-accent bg-app-accent/10 p-1 rounded-full shrink-0">
                                          <span className="w-3 h-3 flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3">{getTraitIcon(td.trait)}</span>
                                        </span>
                                        <span>{name}</span>
                                      </div>
                                    );
                                  })}
                                {selectedCustomDisorderIds.map(disorderId => {
                                  const disorder = customDisorders.find(d => d.id === disorderId);
                                  if (!disorder) return null;
                                  return (
                                    <div
                                      key={disorderId}
                                      title={disorder.definition || undefined}
                                      className="px-2.5 py-1.5 bg-app-card/75 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-app-border/15 shadow-sm text-app-text/90 animate-fade-in duration-300 hover:border-app-accent/30 transition-colors"
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: disorder.color || '#8B5CF6' }}
                                      />
                                      <span>{disorder.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description Section */}
                      {(description || descriptionImages.length > 0) && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono flex items-center gap-1.5">
                            <FileText className="w-2.5 h-2.5" />
                            {t.descriptionTitle}
                          </div>
                          {description && (
                            <div className={`px-4 py-3 bg-app-card/45 backdrop-blur-sm rounded-2xl border border-app-border/10 text-[11px] leading-relaxed text-app-text/90 space-y-1 ${font}`}>
                              {renderMarkdown(description, setLightboxImage)}
                            </div>
                          )}
                          {descriptionImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {descriptionImages.map((img, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setLightboxImage(img)}
                                  className="relative h-16 rounded-xl overflow-hidden border border-app-border/25 bg-app-bg/60 block cursor-pointer"
                                >
                                  <img src={img} className="w-full h-full object-contain" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Internal Notes Section */}
                      {(internalNotes || internalNotesImages.length > 0) && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono flex items-center gap-1.5">
                            <Lock className="w-2.5 h-2.5" />
                            {t.internalNotesTitle}
                          </div>
                          {internalNotes && (
                            <div className="px-4 py-3 bg-app-card/30 backdrop-blur-sm rounded-2xl border border-dashed border-app-border/20 text-[10px] leading-relaxed text-app-text/85 break-words space-y-1">
                              {renderMarkdown(internalNotes, setLightboxImage)}
                            </div>
                          )}
                          {internalNotesImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {internalNotesImages.map((img, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setLightboxImage(img)}
                                  className="relative h-16 rounded-xl overflow-hidden border border-app-border/25 bg-app-bg/60 block cursor-pointer"
                                >
                                  <img src={img} className="w-full h-full object-contain" />
                                </button>
                              ))}
                            </div>
                          )}
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
                              <div key={f.id} className="flex items-start gap-2 text-[10px]">
                                <span
                                  className="font-black uppercase tracking-widest text-app-muted shrink-0"
                                  style={{ maxWidth: '5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                  {f.label || '-'}
                                </span>
                                <span className="text-app-text/85 flex-1 min-w-0 break-words">{f.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Relations Section — issues du mapping */}
                      {editingAlterId && (() => {
                        const rels = mappingData.relations.filter(r => r.sourceId === editingAlterId || r.targetId === editingAlterId);
                        if (rels.length === 0) return null;
                        return (
                          <div className="space-y-1.5 animate-fade-in">
                            <div className="text-[9px] font-black uppercase tracking-widest text-app-accent/80 px-1 font-mono flex items-center gap-1.5">
                              <GitBranch className="w-2.5 h-2.5" />
                              {lang === 'fr' ? 'Relations' : 'Relations'}
                            </div>
                            <div className="px-3 py-2.5 bg-app-card/30 rounded-2xl border border-app-border/10 flex flex-wrap gap-1.5">
                              {rels.map(r => {
                                const otherId = r.sourceId === editingAlterId ? r.targetId : r.sourceId;
                                const other = savedAlters.find(a => a.id === otherId);
                                if (!other) return null;
                                const cfg = RELATION_CONFIG[r.type];
                                return (
                                  <span
                                    key={r.id}
                                    style={{
                                      color: cfg.color,
                                      borderColor: `${cfg.color}40`,
                                      backgroundColor: `${cfg.color}15`,
                                    }}
                                    className="px-2 py-1 rounded-lg text-[9px] font-bold border inline-flex items-center gap-1.5 uppercase tracking-wide"
                                    title={r.label || ''}
                                  >
                                    <span className="normal-case tracking-normal font-black">{other.alterName}</span>
                                    <span className="opacity-70">·</span>
                                    {lang === 'fr' ? cfg.label : cfg.labelEn}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {traitDecorations.length === 0 && !description && !internalNotes && descriptionImages.length === 0 && internalNotesImages.length === 0 && (
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
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full max-w-[600px] mx-auto">
              <button
                type="button"
                onClick={() => setShowMeaningCard(prev => !prev)}
                className="flex items-center justify-center gap-2.5 px-6 py-3 bg-app-card border border-app-border/45 rounded-2xl text-xs font-black uppercase tracking-widest text-app-text hover:bg-app-bg hover:border-app-accent/40 active:scale-98 transition-all shadow-sm select-none"
                aria-expanded={showMeaningCard}
              >
                <Info className="w-4 h-4 text-app-accent" />
                {lang === 'fr' ? 'Résumé de la fiche' : 'Card summary'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2.5 px-6 py-3 bg-app-card border border-app-border/45 rounded-2xl text-xs font-black uppercase tracking-widest text-app-text hover:bg-app-bg hover:border-app-accent/40 active:scale-98 transition-all shadow-sm select-none disabled:opacity-50"
                title={lang === 'fr' ? 'Télécharger en PNG' : 'Download as PNG'}
                aria-label={lang === 'fr' ? 'Télécharger en PNG' : 'Download as PNG'}
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-app-accent/30 border-t-app-accent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-app-accent" />
                )}
                {lang === 'fr' ? 'Télécharger' : 'Download'}
              </button>
            </div>

            {/* Meaning Card — bannière repliable au-dessus de la fiche */}
            <AnimatePresence>
              {showMeaningCard && (
                <motion.div
                  initial={{ opacity: 0, y: 14, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="w-full max-w-[600px] mx-auto bg-app-card rounded-3xl shadow-sm border border-app-border overflow-hidden"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-app-muted">
                        <Info className="w-4 h-4" /> {t.meaning}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleDownloadDefinition}
                          className="p-2 hover:bg-app-bg rounded-lg transition-colors text-app-muted hover:text-app-accent"
                          title={t.downloadDefinition}
                          aria-label={t.downloadDefinition}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMeaningCard(false)}
                          className="p-2 hover:bg-app-bg rounded-lg transition-colors text-app-muted hover:text-app-text"
                          aria-label={lang === 'fr' ? 'Fermer le résumé' : 'Close summary'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {selectedRoles.map(role => (
                          <div key={role} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ROLE_CONFIGS[role].color }} />
                            <span className="text-sm font-medium">{t.roleNames[role as keyof typeof t.roleNames]}: {t.rolesData[role as keyof typeof t.rolesData]}</span>
                          </div>
                        ))}
                        {selectedCustomRoleIds.map(roleId => {
                          const role = customRoles.find(r => r.id === roleId);
                          if (!role) return null;
                          return (
                            <div key={roleId} className="flex items-center gap-2 animate-fade-in">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: role.color || '#8B5CF6' }} />
                              <span className="text-sm font-medium">{role.name}{role.definition ? `: ${role.definition}` : ''}</span>
                            </div>
                          );
                        })}
                        {selectedGenders.map(g => (
                          <div key={g} className="flex items-center gap-2 animate-fade-in">
                            <div className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: customGenderColors[g] || GENDER_COLORS[g] }} />
                            <span className="text-sm font-medium">{t.gender}: {t.genders[g as keyof typeof t.genders]}{t.genderData[g as keyof typeof t.genderData] ? ` — ${t.genderData[g as keyof typeof t.genderData]}` : ''}</span>
                          </div>
                        ))}
                        {selectedSexualities.map(s => (
                          <div key={s} className="flex items-center gap-2 animate-fade-in">
                            <div className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: customSexualityColors[s] || SEXUALITY_COLORS[s] }} />
                            <span className="text-sm font-medium">{t.sexuality}: {t.sexualityNames[s as keyof typeof t.sexualityNames]}{t.sexualityData[s as keyof typeof t.sexualityData] ? ` — ${t.sexualityData[s as keyof typeof t.sexualityData]}` : ''}</span>
                          </div>
                        ))}
                      </div>

                      {(traitDecorations.length > 0 || selectedCustomTraitIds.length > 0 || selectedCustomDisorderIds.length > 0) && (
                        <div className="pt-4 border-t border-app-border">
                          <p className="text-xs font-bold uppercase tracking-widest text-app-muted mb-2">{t.traitsIncluded}</p>
                          <div className="flex flex-wrap gap-2">
                            {traitDecorations.map(td => {
                              const isDisorder = Object.values(Disorder).includes(td.trait as Disorder);
                              const name = isDisorder
                                ? t.disorders[td.trait as keyof typeof t.disorders]
                                : t.personalityTraits[td.trait as keyof typeof t.personalityTraits];
                              const definition = isDisorder
                                ? t.disorderData[td.trait as keyof typeof t.disorderData]
                                : t.personalityTraitData[td.trait as keyof typeof t.personalityTraitData];
                              return (
                                <span key={td.trait} className="px-3 py-1 bg-app-bg rounded-full text-xs font-medium flex items-center gap-1" title={definition || undefined}>
                                  {getTraitIcon(td.trait)}
                                  {name}{definition ? `: ${definition}` : ''}
                                </span>
                              );
                            })}
                            {selectedCustomTraitIds.map(traitId => {
                              const trait = customTraits.find(tr => tr.id === traitId);
                              if (!trait) return null;
                              return (
                                <span key={traitId} className="px-3 py-1 bg-app-bg rounded-full text-xs font-medium flex items-center gap-1 animate-fade-in">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: trait.color || '#8B5CF6' }} />
                                  {trait.name}{trait.definition ? `: ${trait.definition}` : ''}
                                </span>
                              );
                            })}
                            {selectedCustomDisorderIds.map(disorderId => {
                              const disorder = customDisorders.find(d => d.id === disorderId);
                              if (!disorder) return null;
                              return (
                                <span key={disorderId} className="px-3 py-1 bg-app-bg rounded-full text-xs font-medium flex items-center gap-1 animate-fade-in">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: disorder.color || '#8B5CF6' }} />
                                  {disorder.name}{disorder.definition ? `: ${disorder.definition}` : ''}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Disclaimer */}
            <p className="text-[10px] text-center text-app-muted uppercase tracking-widest leading-relaxed">
              {t.disclaimer}
            </p>
          </div>
        </div>
          </>
        )}

        {/* --- SYSTEM VIEW --- */}
        {/* --- DASHBOARD (HOME) VIEW --- */}
        {currentTab === 'home' && (() => {
          const dashItems = [
            { value: 'system',    label: t.menuMySystem,   icon: Users,              desc: lang === 'fr' ? 'Gérer vos alters et sous-systèmes' : 'Manage your alters and subsystems' },
            { value: 'creator',   label: t.menuCreator,    icon: Hammer,             desc: lang === 'fr' ? 'Créer ou modifier une fiche' : 'Create or edit a profile' },
            { value: 'switch',    label: t.menuSwitches,   icon: ArrowLeftRight,     desc: lang === 'fr' ? 'Registre des fronts et émotions' : 'Front log and emotions' },
            { value: 'mapping',   label: t.menuMapping,    icon: GitBranch,          desc: lang === 'fr' ? 'Visualiser le système' : 'Visualise the system' },
            { value: 'chat',      label: t.menuChat,       icon: MessageSquareQuote, desc: lang === 'fr' ? 'Discussion interne' : 'Internal discussion' },
            { value: 'messaging', label: t.menuMessaging,  icon: Mail,               desc: lang === 'fr' ? 'Messages directs entre alters' : 'Direct messages between alters' },
            { value: 'journal',   label: t.menuJournal,    icon: Book,               desc: lang === 'fr' ? 'Journal de bord du système' : 'System journal' },
            { value: 'planning',  label: t.menuPlanning,  icon: CalendarDays, desc: lang === 'fr' ? 'Planning façon Bullet Journal' : 'Bullet Journal style planning' },
            { value: 'health',    label: lang === 'fr' ? 'Santé' : 'Health', icon: HeartPulse, desc: lang === 'fr' ? 'Traitements, antécédents, urgence' : 'Treatments, history, emergency' },
            { value: 'relax',     label: lang === 'fr' ? 'Détente' : 'Relax', icon: Wind, desc: lang === 'fr' ? 'Outils anti-dissociation' : 'Anti-dissociation tools' },
            { value: 'pluralkit', label: t.menuPluralKit,  icon: Link2,              desc: lang === 'fr' ? 'Synchronisation PluralKit' : 'PluralKit synchronization' },
          ];
          return (
            <div className="space-y-8 max-w-4xl mx-auto w-full animate-fade-in duration-300">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">
                  {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                </h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold mt-1">
                </p>
              </div>

              {/* Encart suggestion verrouillage PIN */}
              {!pinEnabled && !pinBannerDismissed && (
                <div className="flex items-center gap-3 p-4 bg-app-accent/5 border border-app-accent/20 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-app-text flex-1">
                    {lang === 'fr'
                      ? "Protège l'accès à ton système avec un code."
                      : 'Protect access to your system with a code.'}
                  </p>
                  <button
                    onClick={() => { startPinSetup(); setSettingsMenuOpen(true); dismissPinBanner(); }}
                    className="px-3 py-1.5 bg-app-accent text-app-accent-text rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0"
                  >
                    {lang === 'fr' ? 'Activer' : 'Enable'}
                  </button>
                  <button
                    onClick={dismissPinBanner}
                    className="text-app-muted hover:text-app-text transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Grille des pages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dashItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        if (item.value === 'creator') { handleResetCreator(); return; }
                        setCurrentTab(item.value as any);
                      }}
                      className="flex flex-col items-center gap-3 p-5 bg-app-card border border-app-border/40 rounded-2xl hover:border-app-accent/40 hover:bg-app-card/80 active:scale-95 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent group-hover:bg-app-accent/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="w-full">
                        <p className="text-xs font-black uppercase tracking-widest text-app-text text-center">{item.label}</p>
                        <p className="text-[10px] text-app-muted mt-1 text-center leading-relaxed hidden sm:block">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Alters en front actuellement, groupés par statut */}
              {(() => {
                const frontGroups: { status: string; label: string; colorClass: string }[] = [
                  { status: 'primary', label: t.frontStatuses.primary, colorClass: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
                  { status: 'co_front', label: t.frontStatuses.co_front, colorClass: 'text-sky-500 border-sky-500/30 bg-sky-500/10' },
                  { status: 'co_conscious', label: t.frontStatuses.co_conscious, colorClass: 'text-violet-500 border-violet-500/30 bg-violet-500/10' },
                ];
                const groupsWithMembers = frontGroups
                  .map(g => ({ ...g, members: savedAlters.filter(a => a.frontStatus === g.status && !a.archived) }))
                  .filter(g => g.members.length > 0);

                if (groupsWithMembers.length === 0 && !systemInBlend) return null;

                return (
                  <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">
                      {lang === 'fr' ? 'Actuellement en front' : 'Currently fronting'}
                    </p>
                    <div className="space-y-3">
                      {/* Indicateur système "Flou / Blend" — état global, pas lié à un alter précis */}
                      {systemInBlend && (
                        <div className="space-y-1.5">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border text-fuchsia-500 border-fuchsia-500/30"
                            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.12), rgba(99,102,241,0.12))' }}
                          >
                            {t.frontStatuses.blend}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <div
                              className="flex items-center gap-2 border rounded-full pl-3 pr-1 py-1 text-xs font-bold text-fuchsia-500 border-fuchsia-500/30"
                              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08), rgba(99,102,241,0.08))' }}
                            >
                              <span>✦ {lang === 'fr' ? 'Système en flou' : 'System in blend'}</span>
                              <button
                                onClick={() => setSystemInBlend(false)}
                                title={lang === 'fr' ? 'Sortir du flou' : 'Exit blend'}
                                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-fuchsia-500/10 transition-colors flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {groupsWithMembers.map(g => (
                        <div key={g.status} className="space-y-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${g.colorClass}`}
                          >
                            {g.label}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {g.members.map(a => (
                              <div
                                key={a.id}
                                className="flex items-center gap-1 bg-app-bg border border-app-border/40 rounded-full pl-1 pr-1 py-1 text-xs font-bold"
                              >
                                <button
                                  onClick={() => setCurrentTab('system')}
                                  className="flex items-center gap-2 pl-1.5 pr-2 py-0.5 rounded-full hover:bg-app-accent/10 transition-colors"
                                >
                                  {a.profileImage
                                    ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover" alt="" />
                                    : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent">{(a.alterName||'?').charAt(0)}</div>
                                  }
                                  <span className="text-app-text">{a.alterName}</span>
                                </button>
                                <button
                                  onClick={() => handleRemoveFromFront(a.id)}
                                  title={lang === 'fr' ? 'Retirer du front' : 'Remove from front'}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-app-muted hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

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
                    className="bg-app-card border border-app-border/30 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 w-48 text-app-text placeholder:text-app-muted"
                  />
                  {systemSearch && (
                    <button onClick={() => setSystemSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtre par rôles */}
              <div className="space-y-2">
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
                  <input
                    type="text"
                    value={roleFilterInput}
                    onChange={e => {
                      const val = e.target.value;
                      setRoleFilterInput(val);
                      if (val.trim().length > 0) {
                        const query = val.toLowerCase();
                        const allSearchableRoles: string[] = [...Object.values(AlterRole), ...customRoles.map(r => r.id)];
                        const suggestions = allSearchableRoles
                          .filter(r => !roleFilter.includes(r))
                          .filter(r => getRoleDisplayName(r).toLowerCase().includes(query))
                          .slice(0, 6);
                        setRoleFilterSuggestions(suggestions);
                      } else {
                        setRoleFilterSuggestions([]);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && roleFilterSuggestions.length > 0) {
                        setRoleFilter(prev => [...prev, roleFilterSuggestions[0]]);
                        setRoleFilterInput('');
                        setRoleFilterSuggestions([]);
                      }
                      if (e.key === 'Escape') { setRoleFilterInput(''); setRoleFilterSuggestions([]); }
                    }}
                    placeholder={lang === 'fr' ? 'Filtrer par rôle...' : 'Filter by role...'}
                    className="bg-app-card border border-app-border/30 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 w-full text-app-text placeholder:text-app-muted"
                  />
                  {/* Suggestions */}
                  {roleFilterSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-app-card border border-app-border/40 rounded-xl shadow-lg z-20 overflow-hidden">
                      {roleFilterSuggestions.map(r => (
                        <button
                          key={r}
                          onClick={() => { setRoleFilter(prev => [...prev, r]); setRoleFilterInput(''); setRoleFilterSuggestions([]); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-app-bg flex items-center gap-2 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getRoleDisplayColor(r) }} />
                          {getRoleDisplayName(r)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Tags actifs */}
                {roleFilter.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang === 'fr' ? 'Rôles :' : 'Roles:'}</span>
                    {roleFilter.map(r => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(prev => prev.filter(x => x !== r))}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border transition-colors hover:opacity-70"
                        style={{ backgroundColor: `${getRoleDisplayColor(r)}15`, borderColor: `${getRoleDisplayColor(r)}40`, color: getRoleDisplayColor(r) }}
                      >
                        {getRoleDisplayName(r)}
                        <X className="w-2.5 h-2.5" />
                      </button>
                    ))}
                    <button onClick={() => setRoleFilter([])} className="text-[10px] text-app-muted hover:text-app-text font-bold underline underline-offset-2 transition-colors">
                      {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
                    </button>
                  </div>
                )}
              </div>

              {/* Filtre par tags personnalisés */}
              {(() => {
                const allTags = Array.from(new Set(savedAlters.flatMap(a => a.tags || []))).sort((a, b) => a.localeCompare(b, lang));
                return (
                  <div className="space-y-2">
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted" />
                      <input
                        type="text"
                        value={tagFilterInput}
                        onChange={e => {
                          const val = e.target.value;
                          setTagFilterInput(val);
                          if (val.trim().length > 0) {
                            const query = val.toLowerCase();
                            const suggestions = allTags
                              .filter(tg => !tagFilter.includes(tg))
                              .filter(tg => tg.toLowerCase().includes(query))
                              .slice(0, 6);
                            setTagFilterSuggestions(suggestions);
                          } else {
                            setTagFilterSuggestions([]);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && tagFilterSuggestions.length > 0) {
                            setTagFilter(prev => [...prev, tagFilterSuggestions[0]]);
                            setTagFilterInput('');
                            setTagFilterSuggestions([]);
                          }
                          if (e.key === 'Escape') { setTagFilterInput(''); setTagFilterSuggestions([]); }
                        }}
                        placeholder={lang === 'fr' ? 'Filtrer par tags...' : 'Filter by tags...'}
                        className="bg-app-card border border-app-border/30 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent/20 w-full text-app-text placeholder:text-app-muted"
                      />
                      {/* Suggestions */}
                      {tagFilterSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-app-card border border-app-border/40 rounded-xl shadow-lg z-20 overflow-hidden">
                          {tagFilterSuggestions.map(tg => (
                            <button
                              key={tg}
                              onClick={() => { setTagFilter(prev => [...prev, tg]); setTagFilterInput(''); setTagFilterSuggestions([]); }}
                              className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-app-bg flex items-center gap-2 transition-colors"
                            >
                              <Tag className="w-3 h-3 text-app-accent flex-shrink-0" />
                              {tg}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Tags actifs */}
                    {tagFilter.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang === 'fr' ? 'Tags :' : 'Tags:'}</span>
                        {tagFilter.map(tg => (
                          <button
                            key={tg}
                            onClick={() => setTagFilter(prev => prev.filter(x => x !== tg))}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border border-app-accent/30 bg-app-accent/10 text-app-accent transition-colors hover:opacity-70"
                          >
                            {tg}
                            <X className="w-2.5 h-2.5" />
                          </button>
                        ))}
                        <button onClick={() => setTagFilter([])} className="text-[10px] text-app-muted hover:text-app-text font-bold underline underline-offset-2 transition-colors">
                          {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
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
              {activeSubsystemView ? (() => {
                const sub = subsystems.find(s => s.id === activeSubsystemView);
                if (!sub) return null;
                const childSubs = subsystems.filter(s => s.parentId === activeSubsystemView);
                const subAlters = savedAlters
                  .filter(a => a.subsystemId === activeSubsystemView && !a.archived
                    && (!systemSearch || (a.alterName || '').toLowerCase().includes(systemSearch.toLowerCase()))
                    && (roleFilter.length === 0 || roleFilter.every(r => (a.selectedRoles || []).includes(r as AlterRole) || (a.customRoleIds || []).includes(r))) && (tagFilter.length === 0 || tagFilter.every(tg => (a.tags || []).includes(tg)))
                  )
                  .sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang));
                return (
                  <div className="space-y-6 animate-fade-in duration-300">
                    <button
                      onClick={() => setActiveSubsystemView(null)}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-app-muted hover:text-app-accent transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                      {lang === 'fr' ? 'Mon Système' : 'My System'}
                    </button>
                    <div className="flex items-center gap-3 pb-4 border-b border-app-border/30">
                      <div className="w-10 h-10 rounded-xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        {editingSubsystemNameId === sub.id ? (
                          <input
                            autoFocus
                            className="text-xl font-black uppercase tracking-wider bg-transparent border-b border-app-accent outline-none"
                            value={editingSubsystemNameValue}
                            onChange={e => setEditingSubsystemNameValue(e.target.value)}
                            onBlur={() => handleRenameSubsystem(sub.id, editingSubsystemNameValue)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleRenameSubsystem(sub.id, editingSubsystemNameValue);
                              if (e.key === 'Escape') setEditingSubsystemNameId(null);
                            }}
                          />
                        ) : (
                          <button onClick={() => { setEditingSubsystemNameId(sub.id); setEditingSubsystemNameValue(sub.name); }} className="flex items-center gap-2 group">
                            <h3 className="text-xl font-black uppercase tracking-wider text-app-text">{sub.name}</h3>
                            <Pencil className="w-3.5 h-3.5 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                        <p className="text-[10px] text-app-muted uppercase font-bold tracking-widest">
                          {subAlters.length} alters{childSubs.length > 0 && ` · ${childSubs.length} ${lang === 'fr' ? 'sous-systèmes' : 'subsystems'}`}
                        </p>
                      </div>
                    </div>
                    {childSubs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-app-muted px-1">{lang === 'fr' ? 'Sous-systèmes' : 'Subsystems'}</p>
                        {childSubs.map(c => renderSubsystemNode(c.id))}
                      </div>
                    )}
                    {subAlters.length > 0 ? (
                      <>
                        <div className="md:hidden rounded-2xl border border-app-border/30 overflow-hidden bg-app-card/65">
                          {subAlters.map(a => renderAlterCard(a))}
                        </div>
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subAlters.map(a => renderAlterCard(a))}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center bg-app-card/30 rounded-2xl border border-app-border/20">
                        <p className="text-sm text-app-muted uppercase tracking-wider font-semibold">
                          {lang === 'fr' ? 'Aucun alter dans ce sous-système' : 'No alters in this subsystem'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })() : (<>
              
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
                                  .filter(a => !a.subsystemId && !a.archived && (!systemSearch || (a.alterName || '').toLowerCase().includes(systemSearch.toLowerCase())) && (roleFilter.length === 0 || roleFilter.every(r => (a.selectedRoles || []).includes(r as AlterRole) || (a.customRoleIds || []).includes(r))) && (tagFilter.length === 0 || tagFilter.every(tg => (a.tags || []).includes(tg))))
                                  .sort((a, b) => (a.alterName || "").localeCompare(b.alterName || "", lang))
                                  .map(a => renderAlterCard(a))}
                              </div>
                              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...activeSystemAlters]
                                  .filter(a => !a.subsystemId && !a.archived && (!systemSearch || (a.alterName || '').toLowerCase().includes(systemSearch.toLowerCase())) && (roleFilter.length === 0 || roleFilter.every(r => (a.selectedRoles || []).includes(r as AlterRole) || (a.customRoleIds || []).includes(r))) && (tagFilter.length === 0 || tagFilter.every(tg => (a.tags || []).includes(tg))))
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

            </>)}
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
                {/* Recherche alter */}
                {(() => {
                  const filtered = [
                    {id: 'external', alterName: lang === 'fr' ? 'Hôte / Système' : 'Host / System', profileImage: null as string|null|undefined},
                    ...[...savedAlters].sort((a,b) => (a.alterName||'').localeCompare(b.alterName||'', lang))
                  ].filter(a => !chatSpeakerSearch || (a.alterName||'').toLowerCase().includes(chatSpeakerSearch.toLowerCase()));
                  const current = chatSpeakerId === 'external'
                    ? {id:'external', alterName: lang==='fr' ? 'Hôte / Système' : 'Host / System', profileImage: null}
                    : savedAlters.find(a => a.id === chatSpeakerId);
                  return (
                    <div className="relative">
                      <div
                        className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-app-accent/40 transition-colors"
                        onClick={() => setChatSpeakerOpen(o => !o)}
                      >
                        {current?.profileImage
                          ? <img src={current.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                          : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(current?.alterName||'?').charAt(0)}</div>
                        }
                        <span className="flex-1 font-semibold text-app-text text-sm">{current?.alterName || '—'}</span>
                        <ChevronDown className={`w-4 h-4 text-app-muted flex-shrink-0 transition-transform ${chatSpeakerOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {chatSpeakerOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => { setChatSpeakerOpen(false); setChatSpeakerSearch(''); }} />
                          <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-2 border-b border-app-border/30">
                              <input
                                autoFocus
                                type="text"
                                value={chatSpeakerSearch}
                                onChange={e => setChatSpeakerSearch(e.target.value)}
                                placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                                className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-52 overflow-y-auto py-1">
                              {filtered.map(a => (
                                <button
                                  key={a.id}
                                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${chatSpeakerId === a.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                  onClick={() => { setChatSpeakerId(a.id); setChatSpeakerOpen(false); setChatSpeakerSearch(''); }}
                                >
                                  {a.profileImage
                                    ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                    : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName||'?').charAt(0)}</div>
                                  }
                                  {a.alterName}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

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
                              {formatMessageTimestamp(msg.timestamp)}
                            </span>
                          </div>
                          
                          {msg.poll ? renderPollWidget(msg) : (
                            <div className="text-sm text-app-text/90 mt-1 bg-app-card/75 p-3 rounded-2xl rounded-tl-none border border-app-border/20 leading-relaxed select-text space-y-1">
                              {renderMarkdown(msg.text, setLightboxImage)}
                            </div>
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

                {/* Panneau d'insertion d'image par URL */}
                <AnimatePresence>
                  {chatImageUrlInput !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pt-3 border-t border-app-border/30 bg-app-card/65 flex gap-2 items-center overflow-hidden"
                    >
                      <input
                        type="url"
                        autoFocus
                        value={chatImageUrlInput}
                        onChange={e => setChatImageUrlInput(e.target.value)}
                        placeholder={lang === 'fr' ? 'Colle le lien de l\'image ici…' : 'Paste the image link here…'}
                        className="flex-1 min-w-0 bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/25"
                      />
                      <button
                        type="button"
                        disabled={!chatImageUrlInput.trim()}
                        onClick={() => {
                          setChatText(prev => (prev ? prev + '\n' : '') + `![image](${chatImageUrlInput.trim()})`);
                          setChatImageUrlInput(null);
                        }}
                        className="px-3 py-2 bg-app-text text-app-bg rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 shrink-0"
                      >
                        {lang === 'fr' ? 'Insérer' : 'Insert'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChatImageUrlInput(null)}
                        className="p-2 text-app-muted hover:text-app-text transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat Input form */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-app-border/30 bg-app-card/65 flex gap-3 items-center">
                  <label
                    className="shrink-0 p-3.5 border border-app-border rounded-xl text-app-muted hover:text-app-accent hover:border-app-accent/40 cursor-pointer transition-colors"
                    title={lang === 'fr' ? 'Importer une image' : 'Upload an image'}
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleCompressAndStoreFiles(e.target.files, (urls) => {
                          setChatText(prev => (prev ? prev + '\n' : '') + urls.map(u => `![image](${u})`).join('\n'));
                        });
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setChatImageUrlInput(chatImageUrlInput === null ? '' : null)}
                    className={`shrink-0 p-3.5 border rounded-xl transition-colors ${chatImageUrlInput !== null ? 'text-app-accent border-app-accent/40 bg-app-accent/5' : 'text-app-muted border-app-border hover:text-app-accent hover:border-app-accent/40'}`}
                    title={lang === 'fr' ? 'Insérer une image par URL' : 'Insert an image by URL'}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
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
                        ? 'bg-app-accent text-white border-transparent' 
                        : 'bg-app-bg/50 border-app-border hover:bg-app-bg text-app-text'
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
                      <p className="text-xs text-app-muted">{lang === 'fr' ? "Aucun alter disponible. Créez des fiches d'abord !" : 'No alters available. Create cards first!'}</p>
                    ) : (
                      <div className="space-y-2">
                        {/* Tags des alters sélectionnés */}
                        {switchSelectedAlterIds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {switchSelectedAlterIds.map(id => {
                              const a = savedAlters.find(x => x.id === id);
                              if (!a) return null;
                              return (
                                <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-app-accent/10 border border-app-accent/30 rounded-full text-[11px] font-bold text-app-accent">
                                  {a.profileImage
                                    ? <img src={a.profileImage} className="w-4 h-4 rounded-full object-cover" alt="" />
                                    : <div className="w-4 h-4 rounded-full bg-app-accent/30 flex items-center justify-center text-[8px] font-black">{(a.alterName||'?').charAt(0)}</div>
                                  }
                                  {a.alterName}
                                  <button onClick={() => setSwitchSelectedAlterIds(prev => prev.filter(x => x !== id))} className="hover:text-red-500 transition-colors leading-none">×</button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        {/* Champ de recherche avec suggestions */}
                        <div className="relative">
                          <input
                            type="text"
                            value={switchAlterSearch}
                            onChange={e => setSwitchAlterSearch(e.target.value)}
                            placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                            className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                          />
                          {switchAlterSearch.trim().length > 0 && (
                            <div className="absolute left-0 right-0 mt-1 z-20 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                              {[...savedAlters]
                                .filter(a => (a.alterName||'').toLowerCase().includes(switchAlterSearch.toLowerCase()))
                                .sort((a, b) => (a.alterName||'').localeCompare(b.alterName||'', lang))
                                .slice(0, 8)
                                .map(a => (
                                  <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => {
                                      if (!switchSelectedAlterIds.includes(a.id)) {
                                        setSwitchSelectedAlterIds(prev => [...prev, a.id]);
                                      }
                                      setSwitchAlterSearch('');
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${switchSelectedAlterIds.includes(a.id) ? 'opacity-40' : ''}`}
                                  >
                                    {a.profileImage
                                      ? <img src={a.profileImage} className="w-6 h-6 rounded-full object-cover flex-shrink-0" alt="" />
                                      : <div className="w-6 h-6 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName||'?').charAt(0)}</div>
                                    }
                                    <span className="text-app-text">{a.alterName}</span>
                                    {switchSelectedAlterIds.includes(a.id) && <span className="ml-auto text-[10px] text-app-muted">✓</span>}
                                  </button>
                                ))
                              }
                              {[...savedAlters].filter(a => (a.alterName||'').toLowerCase().includes(switchAlterSearch.toLowerCase())).length === 0 && (
                                <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fronting & Presence Status Grid */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-app-text" />
                      <span>{t.frontStatusLabel}</span>
                    </label>
                    {FRONT_STATUS_CATEGORIES.map(category => (
                      <div key={category.key} className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-app-muted/70">
                          {lang === 'fr' ? category.labelFr : category.labelEn}
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                          {category.statuses.map((statusKey) => (
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
                    ))}
                    <button
                      type="button"
                      onClick={handleLogBlendSwitch}
                      className="w-full py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-fuchsia-500/30 text-fuchsia-500 hover:opacity-80 active:scale-95 text-center select-none"
                      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.12), rgba(99,102,241,0.12))' }}
                    >
                      {lang === 'fr' ? '✦ Flou / Blend — sans sélectionner personne' : '✦ Blur / Blend — without selecting anyone'}
                    </button>
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

                  {/* Roue des émotions */}
                  {(() => {
                    const EMOTIONS = [
                      // Quadrant haut-droit : énergie haute + agréable
                      {name: lang==='fr'?'Excité·e':'Excited',      x:.78,y:.15,color:'#ef9f27',desc:lang==='fr'?'Énergie débordante, très positif':'High energy, very positive'},
                      {name: lang==='fr'?'Euphorique':'Euphoric',    x:.88,y:.25,color:'#f4c430',desc:lang==='fr'?'Exaltation intense':'Intense elation'},
                      {name: lang==='fr'?'Enthousiaste':'Enthusiastic',x:.82,y:.32,color:'#d4a800',desc:lang==='fr'?'Élan, envie de faire':'Drive, eagerness'},
                      {name: lang==='fr'?'Joyeux·se':'Joyful',      x:.85,y:.42,color:'#63991a',desc:lang==='fr'?'Humeur positive, légèreté':'Positive mood, lightness'},
                      {name: lang==='fr'?'Confiant·e':'Confident',   x:.78,y:.52,color:'#1d9e75',desc:lang==='fr'?'Sûr·e de soi, stable':'Self-assured, stable'},
                      {name: lang==='fr'?'Fier·e':'Proud',           x:.72,y:.38,color:'#2db87a',desc:lang==='fr'?'Satisfaction de soi':'Self-satisfaction'},
                      // Quadrant bas-droit : énergie basse + agréable
                      {name: lang==='fr'?'Serein·e':'Serene',        x:.68,y:.68,color:'#0f8060',desc:lang==='fr'?'Calme profond, bien-être':'Deep calm, well-being'},
                      {name: lang==='fr'?'Détendu·e':'Relaxed',      x:.55,y:.82,color:'#076e52',desc:lang==='fr'?'Relâché·e, sans tension':'Released, no tension'},
                      {name: lang==='fr'?'Reconnaissant·e':'Grateful',x:.72,y:.75,color:'#1a7a4a',desc:lang==='fr'?'Gratitude, chaleur intérieure':'Gratitude, inner warmth'},
                      {name: lang==='fr'?'Nostalgique':'Nostalgic',   x:.60,y:.72,color:'#5b8fa8',desc:lang==='fr'?'Doux souvenir, mélancolie douce':'Sweet memory, gentle melancholy'},
                      {name: lang==='fr'?'Apaisé·e':'Soothed',       x:.62,y:.88,color:'#0a5c40',desc:lang==='fr'?'Tension relâchée':'Tension released'},
                      // Quadrant bas-gauche : énergie basse + désagréable
                      {name: lang==='fr'?'Fatigué·e':'Tired',        x:.28,y:.82,color:'#888780',desc:lang==='fr'?"Manque d'énergie, épuisement":'Low energy, exhaustion'},
                      {name: lang==='fr'?'Triste':'Sad',              x:.20,y:.72,color:'#185fa5',desc:lang==='fr'?'Mélancolie, abattement':'Melancholy, low mood'},
                      {name: lang==='fr'?'Déprimé·e':'Depressed',    x:.15,y:.60,color:'#0c447c',desc:lang==='fr'?'Humeur très basse, vide':'Very low mood, emptiness'},
                      {name: lang==='fr'?'Honteux·se':'Ashamed',     x:.25,y:.75,color:'#6b3fa0',desc:lang==='fr'?'Honte, culpabilité':'Shame, guilt'},
                      {name: lang==='fr'?'Solitaire':'Lonely',        x:.18,y:.82,color:'#2e4a7a',desc:lang==='fr'?'Isolement, manque de lien':'Isolation, lack of connection'},
                      // Quadrant haut-gauche : énergie haute + désagréable
                      {name: lang==='fr'?'En colère':'Angry',         x:.15,y:.18,color:'#d85a30',desc:lang==='fr'?'Frustration intense, réactivité':'Intense frustration, reactivity'},
                      {name: lang==='fr'?'Furieux·se':'Furious',      x:.10,y:.28,color:'#b83000',desc:lang==='fr'?'Colère explosive':'Explosive anger'},
                      {name: lang==='fr'?'Irrité·e':'Irritated',      x:.22,y:.32,color:'#993c1d',desc:lang==='fr'?'Agacement, impatience':'Irritation, impatience'},
                      {name: lang==='fr'?'Stressé·e':'Stressed',      x:.28,y:.18,color:'#7f77dd',desc:lang==='fr'?'Pression élevée, surcharge':'High pressure, overload'},
                      {name: lang==='fr'?'Anxieux·se':'Anxious',      x:.22,y:.38,color:'#534ab7',desc:lang==='fr'?'Inquiétude, tension intérieure':'Worry, inner tension'},
                      {name: lang==='fr'?'Effrayé·e':'Scared',        x:.32,y:.25,color:'#d4537e',desc:lang==='fr'?'Peur, sentiment de menace':'Fear, sense of threat'},
                      {name: lang==='fr'?'Paniqué·e':'Panicked',      x:.18,y:.12,color:'#c0184a',desc:lang==='fr'?'Terreur, panique':'Terror, panic'},
                      {name: lang==='fr'?'Dépassé·e':'Overwhelmed',   x:.35,y:.20,color:'#9b59b6',desc:lang==='fr'?'Trop à gérer à la fois':'Too much at once'},
                      // Centre et états dissociatifs
                      {name: lang==='fr'?'Dissocié·e':'Dissociated',  x:.38,y:.62,color:'#b4b2a9',desc:lang==='fr'?'Hors du corps, engourdi·e':'Out of body, numb'},
                      {name: lang==='fr'?'Confus·e':'Confused',       x:.42,y:.38,color:'#8e9aaf',desc:lang==='fr'?'Incertitude, brouillard':'Uncertainty, fog'},
                      {name: lang==='fr'?'Triggéré·e':'Triggered',    x:.30,y:.45,color:'#c0392b',desc:lang==='fr'?'Réaction traumatique activée':'Trauma response activated'},
                      {name: lang==='fr'?'Neutre':'Neutral',           x:.50,y:.50,color:'#888780',desc:lang==='fr'?'État stable, sans teinte forte':'Stable state, no strong tone'},
                    ];

                    return (
                      <div className="mt-4 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">
                          {lang === 'fr' ? 'Roue des émotions' : 'Emotion wheel'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Canvas via useEffect workaround */}
                          <div className="relative flex-shrink-0 mx-auto sm:mx-0" style={{width:220,height:220}}>
                            <canvas
                              id="emotion-wheel-canvas"
                              width={220}
                              height={220}
                              className="rounded-full cursor-crosshair block"
                              style={{width:220,height:220}}
                              ref={el => {
                                if (!el) return;
                                const ctx = el.getContext('2d');
                                if (!ctx) return;
                                const W=220, cx=W/2, cy=W/2, r=W/2-1;
                                ctx.clearRect(0,0,W,W);
                                for (let px=0;px<W;px++) {
                                  for (let py=0;py<W;py++) {
                                    const dx=px-cx,dy=py-cy;
                                    if (dx*dx+dy*dy>r*r) continue;
                                    const angle=Math.atan2(dy,dx);
                                    const dist=Math.sqrt(dx*dx+dy*dy)/r;
                                    const hue=((angle*180/Math.PI)+360+90)%360;
                                    const sat=dist*80;
                                    const lgt=62+(1-dist)*25;
                                    ctx.fillStyle=`hsl(${hue},${sat}%,${lgt}%)`;
                                    ctx.fillRect(px,py,1,1);
                                  }
                                }
                                ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
                                ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(cx,14);ctx.lineTo(cx,W-14);
                                ctx.moveTo(14,cy);ctx.lineTo(W-14,cy);
                                ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.5;
                                ctx.setLineDash([2,3]);ctx.stroke();ctx.setLineDash([]);
                                if (wheelDotPos) {
                                  ctx.beginPath();
                                  ctx.arc(wheelDotPos.x,wheelDotPos.y,7,0,Math.PI*2);
                                  ctx.fillStyle='rgba(255,255,255,0.92)';ctx.fill();
                                  ctx.strokeStyle=wheelEmotion?.color||'#888';ctx.lineWidth=2.5;ctx.stroke();
                                }
                              }}
                              onClick={e => {
                                const rect=e.currentTarget.getBoundingClientRect();
                                const scaleX=220/rect.width, scaleY=220/rect.height;
                                const px=(e.clientX-rect.left)*scaleX;
                                const py=(e.clientY-rect.top)*scaleY;
                                const cx=110,cy=110,r=109;
                                const dx=px-cx,dy=py-cy;
                                if (dx*dx+dy*dy>r*r) return;
                                const nx=px/220,ny=py/220;
                                const emList=[
                                  {name:lang==='fr'?'Excité·e':'Excited',      x:.78,y:.15,color:'#ef9f27',desc:lang==='fr'?'Énergie débordante, très positif':'High energy, very positive'},
                                  {name:lang==='fr'?'Euphorique':'Euphoric',    x:.88,y:.25,color:'#f4c430',desc:lang==='fr'?'Exaltation intense':'Intense elation'},
                                  {name:lang==='fr'?'Enthousiaste':'Enthusiastic',x:.82,y:.32,color:'#d4a800',desc:lang==='fr'?'Élan, envie de faire':'Drive, eagerness'},
                                  {name:lang==='fr'?'Joyeux·se':'Joyful',      x:.85,y:.42,color:'#63991a',desc:lang==='fr'?'Humeur positive, légèreté':'Positive mood, lightness'},
                                  {name:lang==='fr'?'Confiant·e':'Confident',   x:.78,y:.52,color:'#1d9e75',desc:lang==='fr'?'Sûr·e de soi, stable':'Self-assured, stable'},
                                  {name:lang==='fr'?'Fier·e':'Proud',           x:.72,y:.38,color:'#2db87a',desc:lang==='fr'?'Satisfaction de soi':'Self-satisfaction'},
                                  {name:lang==='fr'?'Serein·e':'Serene',        x:.68,y:.68,color:'#0f8060',desc:lang==='fr'?'Calme profond, bien-être':'Deep calm, well-being'},
                                  {name:lang==='fr'?'Détendu·e':'Relaxed',      x:.55,y:.82,color:'#076e52',desc:lang==='fr'?'Relâché·e, sans tension':'Released, no tension'},
                                  {name:lang==='fr'?'Reconnaissant·e':'Grateful',x:.72,y:.75,color:'#1a7a4a',desc:lang==='fr'?'Gratitude, chaleur intérieure':'Gratitude, inner warmth'},
                                  {name:lang==='fr'?'Nostalgique':'Nostalgic',   x:.60,y:.72,color:'#5b8fa8',desc:lang==='fr'?'Doux souvenir, mélancolie douce':'Sweet memory, gentle melancholy'},
                                  {name:lang==='fr'?'Apaisé·e':'Soothed',       x:.62,y:.88,color:'#0a5c40',desc:lang==='fr'?'Tension relâchée':'Tension released'},
                                  {name:lang==='fr'?'Fatigué·e':'Tired',        x:.28,y:.82,color:'#888780',desc:lang==='fr'?"Manque d'énergie, épuisement":'Low energy, exhaustion'},
                                  {name:lang==='fr'?'Triste':'Sad',              x:.20,y:.72,color:'#185fa5',desc:lang==='fr'?'Mélancolie, abattement':'Melancholy, low mood'},
                                  {name:lang==='fr'?'Déprimé·e':'Depressed',    x:.15,y:.60,color:'#0c447c',desc:lang==='fr'?'Humeur très basse, vide':'Very low mood, emptiness'},
                                  {name:lang==='fr'?'Honteux·se':'Ashamed',     x:.25,y:.75,color:'#6b3fa0',desc:lang==='fr'?'Honte, culpabilité':'Shame, guilt'},
                                  {name:lang==='fr'?'Solitaire':'Lonely',        x:.18,y:.82,color:'#2e4a7a',desc:lang==='fr'?'Isolement, manque de lien':'Isolation, lack of connection'},
                                  {name:lang==='fr'?'En colère':'Angry',         x:.15,y:.18,color:'#d85a30',desc:lang==='fr'?'Frustration intense, réactivité':'Intense frustration, reactivity'},
                                  {name:lang==='fr'?'Furieux·se':'Furious',      x:.10,y:.28,color:'#b83000',desc:lang==='fr'?'Colère explosive':'Explosive anger'},
                                  {name:lang==='fr'?'Irrité·e':'Irritated',      x:.22,y:.32,color:'#993c1d',desc:lang==='fr'?'Agacement, impatience':'Irritation, impatience'},
                                  {name:lang==='fr'?'Stressé·e':'Stressed',      x:.28,y:.18,color:'#7f77dd',desc:lang==='fr'?'Pression élevée, surcharge':'High pressure, overload'},
                                  {name:lang==='fr'?'Anxieux·se':'Anxious',      x:.22,y:.38,color:'#534ab7',desc:lang==='fr'?'Inquiétude, tension intérieure':'Worry, inner tension'},
                                  {name:lang==='fr'?'Effrayé·e':'Scared',        x:.32,y:.25,color:'#d4537e',desc:lang==='fr'?'Peur, sentiment de menace':'Fear, sense of threat'},
                                  {name:lang==='fr'?'Paniqué·e':'Panicked',      x:.18,y:.12,color:'#c0184a',desc:lang==='fr'?'Terreur, panique':'Terror, panic'},
                                  {name:lang==='fr'?'Dépassé·e':'Overwhelmed',   x:.35,y:.20,color:'#9b59b6',desc:lang==='fr'?'Trop à gérer à la fois':'Too much at once'},
                                  {name:lang==='fr'?'Dissocié·e':'Dissociated',  x:.38,y:.62,color:'#b4b2a9',desc:lang==='fr'?'Hors du corps, engourdi·e':'Out of body, numb'},
                                  {name:lang==='fr'?'Confus·e':'Confused',       x:.42,y:.38,color:'#8e9aaf',desc:lang==='fr'?'Incertitude, brouillard':'Uncertainty, fog'},
                                  {name:lang==='fr'?'Triggéré·e':'Triggered',    x:.30,y:.45,color:'#c0392b',desc:lang==='fr'?'Réaction traumatique activée':'Trauma response activated'},
                                  {name:lang==='fr'?'Neutre':'Neutral',           x:.50,y:.50,color:'#888780',desc:lang==='fr'?'État stable, sans teinte forte':'Stable state, no strong tone'},
                                ];
                                 const best=emList.reduce((acc,em)=>Math.hypot(em.x-nx,em.y-ny)<Math.hypot(acc.x-nx,acc.y-ny)?em:acc,emList[0]);
                                setWheelDotPos({x:px,y:py});
                                setWheelEmotion({name:best.name,color:best.color,desc:best.desc,intensity:wheelIntensity});
                              }}
                            />
                            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-app-muted font-bold pointer-events-none leading-none">{lang==='fr'?'↑ haute':'↑ high'}</div>
                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-app-muted font-bold pointer-events-none leading-none">{lang==='fr'?'↓ basse':'↓ low'}</div>
                            <div className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[9px] text-app-muted font-bold pointer-events-none leading-none">😔</div>
                            <div className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[9px] text-app-muted font-bold pointer-events-none leading-none">😊</div>
                          </div>

                          {/* Panneau résultat */}
                          <div className="flex-1 min-w-0 space-y-3 w-full">
                            {wheelEmotion ? (
                              <>
                                <div className="p-3 bg-app-bg rounded-xl border border-app-border/40 space-y-1">
                                  <div className="h-1 rounded-full" style={{background:wheelEmotion.color}} />
                                  <p className="font-black text-sm text-app-text">{wheelEmotion.name}</p>
                                  <p className="text-[11px] text-app-muted">{wheelEmotion.desc}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-app-muted">
                                    {lang==='fr'?'Intensité':'Intensity'} — {wheelIntensity}/5
                                  </p>
                                  <input type="range" min={1} max={5} value={wheelIntensity}
                                    onChange={e => setWheelIntensity(Number(e.target.value))}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-[9px] text-app-muted">
                                    <span>{lang==='fr'?'Légère':'Mild'}</span>
                                    <span>{lang==='fr'?'Intense':'Intense'}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    const now = new Date();
                                    const entry = {
                                      name: wheelEmotion.name,
                                      color: wheelEmotion.color,
                                      intensity: wheelIntensity,
                                      alter: switchSelectedAlterIds.length > 0
                                        ? (savedAlters.find((a: SavedAlter) => a.id === switchSelectedAlterIds[0])?.alterName || '?')
                                        : (lang==='fr'?'Système':'System'),
                                      time: now.toLocaleTimeString(lang==='fr'?'fr-FR':'en-GB',{hour:'2-digit',minute:'2-digit'}),
                                      date: now.toLocaleDateString(lang==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'short'}),
                                    };
                                    setWheelHistory((prev: typeof wheelHistory) => [entry,...prev]);
                                    setWheelEmotion(null);
                                    setWheelDotPos(null);
                                  }}
                                  className="w-full py-2 text-xs font-black uppercase tracking-widest bg-app-card border border-app-border/40 hover:border-app-accent/40 rounded-xl transition-colors"
                                >
                                  {lang==='fr'?'+ Enregistrer':'+ Save'}
                                </button>
                              </>
                            ) : (
                              <div className="p-4 bg-app-bg rounded-xl border border-app-border/30 text-center">
                                <p className="text-[11px] text-app-muted">
                                  {lang==='fr'?'Cliquez sur la roue pour identifier une émotion':'Click the wheel to identify an emotion'}
                                </p>
                              </div>
                            )}
                            {wheelHistory.length > 0 && (
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang==='fr'?'Historique':'History'}</p>
                                {wheelHistory.slice(0,5).map((h: typeof wheelHistory[0], i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-[11px] py-1.5 border-b border-app-border/20 group">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:h.color}} />
                                    <span className="font-bold text-app-text truncate">{h.alter}</span>
                                    <span className="text-app-muted truncate">{h.name}</span>
                                    <span className="text-app-muted tabular-nums flex-shrink-0">{h.date ? `${h.date} · ` : ''}{h.time} · {h.intensity}/5</span>
                                    <button
                                      onClick={() => setWheelHistory((prev: typeof wheelHistory) => prev.filter((_: typeof wheelHistory[0], idx: number) => idx !== i))}
                                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-500 text-app-muted flex-shrink-0"
                                      title={lang==='fr'?'Supprimer':'Delete'}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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

            {/* Analyse des émotions */}
            {wheelHistory.length > 0 && (() => {
              // Quadrant detection
              const getQuadrant = (color: string) => {
                const posColors = ['#ef9f27','#f4c430','#d4a800','#63991a','#1d9e75','#2db87a','#0f8060','#076e52','#1a7a4a','#5b8fa8','#0a5c40'];
                const negHighColors = ['#d85a30','#b83000','#993c1d','#7f77dd','#534ab7','#d4537e','#c0184a','#9b59b6'];
                const negLowColors = ['#888780','#185fa5','#0c447c','#6b3fa0','#2e4a7a'];
                if (posColors.includes(color)) return 'pos';
                if (negHighColors.includes(color)) return 'negHigh';
                if (negLowColors.includes(color)) return 'negLow';
                return 'neutral';
              };

              // Top émotions par alter
              const byAlter: Record<string, {name: string; color: string; count: number; totalIntensity: number}[]> = {};
              wheelHistory.forEach((h: typeof wheelHistory[0]) => {
                if (!byAlter[h.alter]) byAlter[h.alter] = [];
                const existing = byAlter[h.alter].find((e: {name:string;color:string;count:number;totalIntensity:number}) => e.name === h.name);
                if (existing) { existing.count++; existing.totalIntensity += h.intensity; }
                else byAlter[h.alter].push({name: h.name, color: h.color, count: 1, totalIntensity: h.intensity});
              });

              // Répartition par quadrant globale
              const quadCounts = {pos: 0, negHigh: 0, negLow: 0, neutral: 0};
              wheelHistory.forEach((h: typeof wheelHistory[0]) => { quadCounts[getQuadrant(h.color) as keyof typeof quadCounts]++; });
              const total = wheelHistory.length;

              // Timeline : grouper par heure
              const timeline: Record<string, string[]> = {};
              wheelHistory.forEach((h: typeof wheelHistory[0]) => {
                if (!timeline[h.time]) timeline[h.time] = [];
                timeline[h.time].push(h.name);
              });

              return (
                <div className="p-5 bg-app-card border border-app-border/30 rounded-2xl space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-app-accent" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-app-text">
                          {lang === 'fr' ? 'Analyse des émotions' : 'Emotion Analysis'}
                        </h3>
                      </div>
                      <p className="text-[10px] text-app-muted uppercase tracking-wider mt-0.5">
                        {lang==='fr'?'Par alter · Historique complet':'By alter · Full history'} · {wheelHistory.length} {lang==='fr'?'entrées':'entries'}
                      </p>
                    </div>
                  </div>

                  {/* Répartition par quadrant */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang==='fr'?'Répartition':'Distribution'}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {key:'pos', label: lang==='fr'?'Positif / Énergie haute':'Positive / High energy', color:'#63991a', emoji:'🟢'},
                        {key:'negHigh', label: lang==='fr'?'Difficile / Énergie haute':'Difficult / High energy', color:'#d85a30', emoji:'🔴'},
                        {key:'negLow', label: lang==='fr'?'Difficile / Énergie basse':'Difficult / Low energy', color:'#185fa5', emoji:'🔵'},
                        {key:'neutral', label: lang==='fr'?'Neutre / Dissociatif':'Neutral / Dissociative', color:'#888780', emoji:'⚪'},
                      ].map(q => {
                        const count = quadCounts[q.key as keyof typeof quadCounts];
                        const pct = total > 0 ? Math.round(count/total*100) : 0;
                        return (
                          <div key={q.key} className="p-3 bg-app-bg rounded-xl border border-app-border/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-app-muted leading-tight">{q.label}</span>
                              <span className="text-sm font-black" style={{color:q.color}}>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-app-border/20 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`, background:q.color}} />
                            </div>
                            <span className="text-[9px] text-app-muted">{count} {lang==='fr'?'fois':'times'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top émotions par alter */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang==='fr'?'Par alter':'By alter'}</p>
                    {Object.entries(byAlter).map(([alterName, emotions]) => {
                      const sorted = [...emotions].sort((a,b) => b.count - a.count).slice(0,3);
                      return (
                        <div key={alterName} className="space-y-2">
                          <p className="text-xs font-black text-app-text">{alterName}</p>
                          <div className="space-y-1.5">
                            {sorted.map((em,i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:em.color}} />
                                <span className="text-[11px] text-app-text flex-1">{em.name}</span>
                                <span className="text-[10px] text-app-muted">{em.count}× · ⌀{Math.round(em.totalIntensity/em.count*10)/10}/5</span>
                                <div className="w-16 h-1.5 bg-app-border/20 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{width:`${Math.round(em.totalIntensity/em.count/5*100)}%`, background:em.color}} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-app-muted">{lang==='fr'?'Timeline':'Timeline'}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {Object.entries(timeline).reverse().map(([timeKey, names]) => {
                        const firstEntry = wheelHistory.find((h: typeof wheelHistory[0]) => h.time === timeKey);
                        return (
                          <div key={timeKey} className="flex flex-col items-center gap-1">
                            <div className="flex gap-0.5">
                              {(names as string[]).map((n,i) => {
                                const entry = wheelHistory.find((h: typeof wheelHistory[0]) => h.name === n && h.time === timeKey);
                                return <div key={i} className="w-3 h-3 rounded-full border border-white/20" style={{background: entry?.color || '#888'}} title={n} />;
                              })}
                            </div>
                            {firstEntry?.date && <span className="text-[7px] text-app-muted">{firstEntry.date}</span>}
                            <span className="text-[8px] text-app-muted tabular-nums">{timeKey}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setWheelHistory([])}
                    className="text-[10px] text-app-muted hover:text-red-500 font-bold uppercase tracking-wider transition-colors"
                  >
                    {lang==='fr'?"🗑 Effacer tout l'historique":'🗑 Clear all history'}
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* --- MAPPING VIEW --- */}
        {currentTab === 'mapping' && (
          <div className="max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <MappingPage savedAlters={savedAlters.filter(a => (a.systemId || 'main') === activeSystemId)} lang={lang} activeSystemId={activeSystemId} />
          </div>
        )}

        {currentTab === 'planning' && (
          <div className="max-w-5xl mx-auto w-full animate-fade-in duration-300">
            <PlanningPage savedAlters={savedAlters.filter(a => (a.systemId || 'main') === activeSystemId)} lang={lang} activeSystemId={activeSystemId} onRequestNotifPermission={enableBrowserNotifFromChild} />
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
                <div className="flex items-center justify-between border-b border-app-border/20 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-app-text flex items-center gap-1.5">
                    <Feather className="w-4 h-4" />
                    <span>{editingJournalId ? (lang === 'fr' ? 'Modifier la Note' : 'Edit Note') : (lang === 'fr' ? 'Rédiger une Note' : 'Compose Note')}</span>
                  </h3>
                  {editingJournalId && (
                    <button type="button" onClick={() => { setEditingJournalId(null); setJournalTitleInput(''); setJournalContentInput(''); setJournalImages([]); }}
                      className="text-[10px] text-app-muted hover:text-app-text font-bold uppercase tracking-wider transition-colors">
                      {lang === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                  )}
                </div>

                <form onSubmit={editingJournalId ? handleUpdateJournalEntry : handleSaveJournalEntry} className="space-y-4">
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
                      allowInlineImages={false}
                      onImageClick={setLightboxImage}
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
                    {editingJournalId ? (lang === 'fr' ? 'Enregistrer les modifications' : 'Save changes') : t.createJournalEntry}
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
                              {renderMarkdown(entry.content, setLightboxImage)}
                            </div>
                            
                            {/* Images slider gallery grid */}
                            {entry.images && entry.images.length > 0 && (
                              <div className="grid grid-cols-3 gap-2 pt-2">
                                {entry.images.map((img, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setLightboxImage(img)}
                                    className="relative h-16 rounded-xl overflow-hidden border border-app-border/25 bg-app-bg/60 block cursor-pointer"
                                  >
                                    <img src={img} className="w-full h-full object-contain" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-app-border/15">
                            <span className="text-[10px] font-mono text-app-muted">
                              {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditJournalEntry(entry)}
                                className="p-1.5 bg-app-bg text-app-muted hover:text-app-accent border border-app-border hover:border-app-accent/40 rounded-lg transition-colors"
                                title={lang === 'fr' ? 'Modifier' : 'Edit'}
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteJournalEntry(entry.id)}
                                className="p-1 px-2.5 bg-app-bg text-[10px] font-bold text-app-muted uppercase tracking-widest border border-app-border rounded-lg hover:text-red-500 hover:border-red-500/40 transition-colors"
                              >
                                {lang === 'fr' ? 'Supprimer' : 'Delete'}
                              </button>
                            </div>
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
                    {/* Recherche alter 1 — dropdown style chat interne */}
                    {(() => {
                      const current1 = allAlters.find(a => a.id === newConvAlter1);
                      const filtered1 = [...allAlters]
                        .filter(a => a.id !== newConvAlter2)
                        .filter(a => !newConvAlter1Search || (a.alterName||'').toLowerCase().includes(newConvAlter1Search.toLowerCase()))
                        .sort((a,b) => a.alterName.localeCompare(b.alterName, lang));
                      return (
                        <div className="relative">
                          <div
                            className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-3 py-2 text-sm cursor-pointer hover:border-app-accent/40 transition-colors"
                            onClick={() => setNewConvAlter1Open(o => !o)}
                          >
                            {current1?.profileImage
                              ? <img src={current1.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                              : current1 && <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(current1.alterName||'?').charAt(0)}</div>
                            }
                            <span className={`flex-1 text-sm ${current1 ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
                              {current1 ? `${current1.alterName}${current1.systemId && current1.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===current1.systemId)?.name || current1.systemId})` : ''}` : (lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…')}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-app-muted flex-shrink-0 transition-transform ${newConvAlter1Open ? 'rotate-180' : ''}`} />
                          </div>
                          {newConvAlter1Open && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => { setNewConvAlter1Open(false); setNewConvAlter1Search(''); }} />
                              <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-app-border/30">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newConvAlter1Search}
                                    onChange={e => setNewConvAlter1Search(e.target.value)}
                                    placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                                    className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                    onClick={e => e.stopPropagation()}
                                  />
                                </div>
                                <div className="max-h-52 overflow-y-auto py-1">
                                  {filtered1.length === 0 ? (
                                    <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                                  ) : filtered1.map(a => (
                                    <button
                                      key={a.id}
                                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${newConvAlter1 === a.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                      onClick={() => { setNewConvAlter1(a.id); setNewConvAlter1Open(false); setNewConvAlter1Search(''); }}
                                    >
                                      {a.profileImage
                                        ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                        : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName||'?').charAt(0)}</div>
                                      }
                                      <span className="flex-1">{a.alterName}{a.systemId && a.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===a.systemId)?.name || a.systemId})` : ''}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}

                    {/* Recherche alter 2 — dropdown style chat interne */}
                    {(() => {
                      const current2 = allAlters.find(a => a.id === newConvAlter2);
                      const filtered2 = [...allAlters]
                        .filter(a => a.id !== newConvAlter1)
                        .filter(a => !newConvAlter2Search || (a.alterName||'').toLowerCase().includes(newConvAlter2Search.toLowerCase()))
                        .sort((a,b) => a.alterName.localeCompare(b.alterName, lang));
                      return (
                        <div className="relative">
                          <div
                            className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-3 py-2 text-sm cursor-pointer hover:border-app-accent/40 transition-colors"
                            onClick={() => setNewConvAlter2Open(o => !o)}
                          >
                            {current2?.profileImage
                              ? <img src={current2.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                              : current2 && <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(current2.alterName||'?').charAt(0)}</div>
                            }
                            <span className={`flex-1 text-sm ${current2 ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
                              {current2 ? `${current2.alterName}${current2.systemId && current2.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===current2.systemId)?.name || current2.systemId})` : ''}` : (lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…')}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-app-muted flex-shrink-0 transition-transform ${newConvAlter2Open ? 'rotate-180' : ''}`} />
                          </div>
                          {newConvAlter2Open && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => { setNewConvAlter2Open(false); setNewConvAlter2Search(''); }} />
                              <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-app-border/30">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newConvAlter2Search}
                                    onChange={e => setNewConvAlter2Search(e.target.value)}
                                    placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                                    className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                    onClick={e => e.stopPropagation()}
                                  />
                                </div>
                                <div className="max-h-52 overflow-y-auto py-1">
                                  {filtered2.length === 0 ? (
                                    <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                                  ) : filtered2.map(a => (
                                    <button
                                      key={a.id}
                                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${newConvAlter2 === a.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                      onClick={() => { setNewConvAlter2(a.id); setNewConvAlter2Open(false); setNewConvAlter2Search(''); }}
                                    >
                                      {a.profileImage
                                        ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                        : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName||'?').charAt(0)}</div>
                                      }
                                      <span className="flex-1">{a.alterName}{a.systemId && a.systemId !== 'main' ? ` (${parallelSystems.find(s=>s.id===a.systemId)?.name || a.systemId})` : ''}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
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

                {/* Recherche conversations — dropdown style chat interne */}
                {(() => {
                  const filteredConvs = [...conversations]
                    .filter(c => {
                      if (!convSearch) return true;
                      const [id1, id2] = c.participantIds;
                      const n1 = allAlters.find(a => a.id === id1)?.alterName || '';
                      const n2 = allAlters.find(a => a.id === id2)?.alterName || '';
                      const q = convSearch.toLowerCase();
                      return n1.toLowerCase().includes(q) || n2.toLowerCase().includes(q);
                    })
                    .sort((a,b) => {
                      const lastA = directMessages.filter(m => m.conversationId === a.id).at(-1)?.timestamp || a.createdAt;
                      const lastB = directMessages.filter(m => m.conversationId === b.id).at(-1)?.timestamp || b.createdAt;
                      return lastB - lastA;
                    });
                  return (
                    <div className="relative">
                      <div
                        className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-app-accent/40 transition-colors"
                        onClick={() => setConvSearchOpen(o => !o)}
                      >
                        <Search className="w-4 h-4 text-app-muted flex-shrink-0" />
                        <span className="flex-1 text-app-muted text-xs">
                          {convSearch || (lang === 'fr' ? 'Rechercher conversation…' : 'Search conversation…')}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-app-muted flex-shrink-0 transition-transform ${convSearchOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {convSearchOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => { setConvSearchOpen(false); }} />
                          <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-2 border-b border-app-border/30">
                              <input
                                autoFocus
                                type="text"
                                value={convSearch}
                                onChange={e => setConvSearch(e.target.value)}
                                placeholder={lang === 'fr' ? 'Rechercher conversation…' : 'Search conversation…'}
                                className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-52 overflow-y-auto py-1">
                              {filteredConvs.length === 0 ? (
                                <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                              ) : filteredConvs.map(c => {
                                const [id1, id2] = c.participantIds;
                                const a1 = allAlters.find(a => a.id === id1);
                                const a2 = allAlters.find(a => a.id === id2);
                                return (
                                  <button
                                    key={c.id}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${activeConvId === c.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                    onClick={() => {
                                      setActiveConvId(c.id);
                                      setMsgSenderId(id1);
                                      setConvSearchOpen(false);
                                    }}
                                  >
                                    <div className="relative w-7 h-6 shrink-0">
                                      {a1?.profileImage
                                        ? <img src={a1.profileImage} className="absolute top-0 left-0 w-5 h-5 rounded-md object-cover border border-app-bg" alt="" />
                                        : <div className="absolute top-0 left-0 w-5 h-5 rounded-md bg-app-accent/20 border border-app-bg flex items-center justify-center text-[8px] font-black text-app-accent">{(a1?.alterName||'?').charAt(0)}</div>
                                      }
                                      {a2?.profileImage
                                        ? <img src={a2.profileImage} className="absolute bottom-0 right-0 w-5 h-5 rounded-md object-cover border border-app-bg" alt="" />
                                        : <div className="absolute bottom-0 right-0 w-5 h-5 rounded-md bg-app-accent/20 border border-app-bg flex items-center justify-center text-[8px] font-black text-app-accent">{(a2?.alterName||'?').charAt(0)}</div>
                                      }
                                    </div>
                                    <span className="flex-1">{a1?.alterName || '?'} &amp; {a2?.alterName || '?'}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* Liste conversations */}
                <div className="space-y-1">
                  {conversations.length === 0 && (
                    <p className="text-xs text-app-muted text-center py-6 italic">{t.messagingNoConv}</p>
                  )}
                  {[...conversations].sort((a,b) => {
                    const lastA = directMessages.filter(m => m.conversationId === a.id).at(-1)?.timestamp || a.createdAt;
                    const lastB = directMessages.filter(m => m.conversationId === b.id).at(-1)?.timestamp || b.createdAt;
                    return lastB - lastA;
                  }).filter(conv => {
                    if (!convSearch.trim()) return true;
                    const [id1, id2] = conv.participantIds;
                    const a1 = allAlters.find(a => a.id === id1);
                    const a2 = allAlters.find(a => a.id === id2);
                    const q = convSearch.toLowerCase();
                    return (a1?.alterName||'').toLowerCase().includes(q) || (a2?.alterName||'').toLowerCase().includes(q);
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
                              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed space-y-1 ${isLeft ? 'bg-app-card border border-app-border/30 text-app-text rounded-tl-sm' : 'bg-app-accent text-white rounded-tr-sm'}`}>
                                <span className={isLeft ? '' : 'text-white [&_*]:text-white'}>
                                  {renderMarkdown(msg.text, setLightboxImage)}
                                </span>
                              </div>
                              <span className="text-[9px] text-app-muted px-1">
                                {formatMessageTimestamp(msg.timestamp)}
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
                      {/* Panneau d'insertion d'image par URL */}
                      <AnimatePresence>
                        {msgImageUrlInput !== null && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-2 items-center overflow-hidden"
                          >
                            <input
                              type="url"
                              autoFocus
                              value={msgImageUrlInput}
                              onChange={e => setMsgImageUrlInput(e.target.value)}
                              placeholder={lang === 'fr' ? 'Colle le lien de l\'image ici…' : 'Paste the image link here…'}
                              className="flex-1 min-w-0 bg-app-bg border border-app-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                            />
                            <button
                              type="button"
                              disabled={!msgImageUrlInput.trim()}
                              onClick={() => {
                                setMsgText(prev => (prev ? prev + '\n' : '') + `![image](${msgImageUrlInput.trim()})`);
                                setMsgImageUrlInput(null);
                              }}
                              className="px-3 py-2 bg-app-text text-app-bg rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 shrink-0"
                            >
                              {lang === 'fr' ? 'Insérer' : 'Insert'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMsgImageUrlInput(null)}
                              className="p-2 text-app-muted hover:text-app-text transition-colors shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleSendDirectMessage} className="flex gap-2">
                        <label
                          className="shrink-0 p-2.5 border border-app-border rounded-xl text-app-muted hover:text-app-accent hover:border-app-accent/40 cursor-pointer transition-colors"
                          title={lang === 'fr' ? 'Importer une image' : 'Upload an image'}
                        >
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              handleCompressAndStoreFiles(e.target.files, (urls) => {
                                setMsgText(prev => (prev ? prev + '\n' : '') + urls.map(u => `![image](${u})`).join('\n'));
                              });
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setMsgImageUrlInput(msgImageUrlInput === null ? '' : null)}
                          className={`shrink-0 p-2.5 border rounded-xl transition-colors ${msgImageUrlInput !== null ? 'text-app-accent border-app-accent/40 bg-app-accent/5' : 'text-app-muted border-app-border hover:text-app-accent hover:border-app-accent/40'}`}
                          title={lang === 'fr' ? 'Insérer une image par URL' : 'Insert an image by URL'}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
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
        {currentTab === 'grounding' && (() => {
          const sections = [
            {
              id: 'move',
              labelFr: "SI JE PEUX ME DÉPLACER",
              labelEn: "IF I CAN MOVE AROUND",
              colorClass: 'border-green-500/30 bg-green-500/5',
              accentClass: 'text-green-600 dark:text-green-400',
              itemsFr: [
                "Je m'étire très fort (doigts, bras, cou, muscles du visage, dos, jambes…)",
                "Je sautille sur place (je sens mon poids, les mouvements et les contacts avec le sol)",
                "Je marche lentement (je compte mes pas ou je pense droite/gauche)",
                "Je fais couler de l'eau sur mes mains / Je me projette de l'eau sur le visage",
                "Je prends une douche / Je prends un bain",
                "Je fais de l'exercice (ex. courir dehors ou aller nager à la piscine)",
              ],
              itemsEn: [
                "I stretch very hard (fingers, arms, neck, face muscles, back, legs…)",
                "I jump in place (I feel my weight, movements and contact with the floor)",
                "I walk slowly (I count my steps or think left/right)",
                "I run water over my hands / I splash water on my face",
                "I take a shower / I take a bath",
                "I exercise (e.g. run outside or go swimming)",
              ],
            },
            {
              id: 'body',
              labelFr: "SI JE PEUX BOUGER",
              labelEn: "IF I CAN MOVE MY BODY",
              colorClass: 'border-orange-500/30 bg-orange-500/5',
              accentClass: 'text-orange-600 dark:text-orange-400',
              itemsFr: [
                "Je serre les poings, je les desserre et ainsi de suite (je me concentre sur les muscles)",
                "Je me cramponne à ma chaise ou à quelque chose d'autre, aussi fort que possible",
                "Je me tiens sur mes talons (je sens le poids qui s'applique sur le sol)",
                "Je manipule un objet agréable au toucher (je me concentre sur les sensations)",
                "Je regarde un objet qui a du sens pour moi (ex. une photo, un cadeau)",
                "Je sens un objet qui dégage une odeur (ex. crème, parfum, sachet de thé)",
              ],
              itemsEn: [
                "I clench my fists, unclench them, and so on (I focus on the muscles)",
                "I grip my chair or something else as hard as possible",
                "I stand on my heels (I feel the weight pressing on the floor)",
                "I handle a pleasant object (I focus on the sensations)",
                "I look at an object that means something to me (e.g. a photo, a gift)",
                "I smell an object that has a scent (e.g. cream, perfume, tea bag)",
              ],
            },
            {
              id: 'speak',
              labelFr: "SI JE PEUX PARLER (sinon intérieurement)",
              labelEn: "IF I CAN SPEAK (otherwise internally)",
              colorClass: 'border-blue-500/30 bg-blue-500/5',
              accentClass: 'text-blue-600 dark:text-blue-400',
              itemsFr: [
                "Je nomme 5 choses que je peux voir",
                "Je nomme 4 choses que je peux entendre",
                "Je nomme 3 choses que je peux toucher",
                "Je nomme 2 choses que je peux sentir",
                "Je nomme 1 chose que je peux goûter",
                "Je me dis des choses gentilles et encourageantes (ex. ça va passer)",
                "Je décris en détails 3 objets autour de moi",
                "Je décris de façon détaillée une de mes activités quotidiennes",
                "Je lis quelque chose que je trouve autour de moi (ex. livre, affiche, panneau)",
                "Je chante ou je récite quelque chose d'inspirant ou de réconfortant",
              ],
              itemsEn: [
                "I name 5 things I can see",
                "I name 4 things I can hear",
                "I name 3 things I can touch",
                "I name 2 things I can smell",
                "I name 1 thing I can taste",
                "I tell myself kind and encouraging things (e.g. this will pass)",
                "I describe in detail 3 objects around me",
                "I describe in detail one of my daily activities",
                "I read something I find around me (e.g. book, poster, sign)",
                "I sing or recite something inspiring or comforting",
              ],
            },
            {
              id: 'feel',
              labelFr: "SI JE PEUX SENTIR/RESSENTIR",
              labelEn: "IF I CAN FEEL",
              colorClass: 'border-purple-500/30 bg-purple-500/5',
              accentClass: 'text-purple-600 dark:text-purple-400',
              itemsFr: [
                "Je sens les contacts du souffle de ma respiration (je respire lentement)",
                "Je sens les contacts de mon corps avec mes vêtements",
              ],
              itemsEn: [
                "I feel the contact of my breath (I breathe slowly)",
                "I feel the contact of my body with my clothes",
              ],
            },
            {
              id: 'orient',
              labelFr: "SI JE PEUX M'ORIENTER",
              labelEn: "IF I CAN ORIENT MYSELF",
              colorClass: 'border-yellow-500/30 bg-yellow-500/5',
              accentClass: 'text-yellow-600 dark:text-yellow-400',
              itemsFr: [
                "Je nomme le lieu où je me trouve",
                "J'annonce mon identité",
                "J'annonce l'heure et la date",
                "Je nomme le président de la République",
              ],
              itemsEn: [
                "I name the place where I am",
                "I announce my identity",
                "I announce the time and date",
                "I name the head of state",
              ],
            },
            {
              id: 'think',
              labelFr: "SI JE PEUX PENSER",
              labelEn: "IF I CAN THINK",
              colorClass: 'border-pink-500/30 bg-pink-500/5',
              accentClass: 'text-pink-600 dark:text-pink-400',
              itemsFr: [
                "Je m'imagine protégé·e du mal (par des murs, des gardes ou un pouvoir)",
                "Je joue au jeu des catégories (ex. je cite des noms de pays qui débutent par « A »)",
                "Je m'imagine dans un endroit sûr (réel ou imaginaire)",
                "Je prévois de m'accorder une récompense une fois que ce sera passé",
              ],
              itemsEn: [
                "I imagine myself protected from harm (by walls, guards or a power)",
                "I play the category game (e.g. I name countries starting with 'A')",
                "I imagine myself in a safe place (real or imaginary)",
                "I plan to reward myself once this has passed",
              ],
            },
            {
              id: 'remember',
              labelFr: "SI JE PEUX ME SOUVENIR",
              labelEn: "IF I CAN REMEMBER",
              colorClass: 'border-teal-500/30 bg-teal-500/5',
              accentClass: 'text-teal-600 dark:text-teal-400',
              itemsFr: [
                "Je décris de façon détaillée un souvenir neutre ou agréable",
                "Je progresse jusqu'au présent (ex. je décris mes anniversaires successifs)",
                "Je décris ce que je dois faire dans les heures/jours qui viennent",
                "Je pense aux favoris de ma vie (ex. choses, activités, gens, principes et valeurs)",
              ],
              itemsEn: [
                "I describe in detail a neutral or pleasant memory",
                "I work my way up to the present (e.g. I describe my successive birthdays)",
                "I describe what I have to do in the coming hours/days",
                "I think about my life favourites (e.g. things, activities, people, principles and values)",
              ],
            },
          ];

          return (
            <div className="space-y-4 max-w-3xl mx-auto w-full animate-fade-in duration-300">
              {/* Header */}
              <div className="pb-4 border-b border-app-border/30 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-wider">{lang === 'fr' ? "Techniques d'Ancrage" : 'Grounding Techniques'}</h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold">
                  {lang === 'fr' ? "En cas de dissociation ou détresse émotionnelle" : 'In case of dissociation or emotional distress'}
                </p>
              </div>

              {/* Note intro */}
              <div className="p-3 bg-app-card border border-app-border/40 rounded-xl text-xs text-app-muted leading-relaxed">
                {lang === 'fr'
                  ? "Ces techniques visent à soulager les états de détresse émotionnelle et à lutter contre la dissociation. Elles doivent être répétées très régulièrement, notamment en dehors des crises, pour être efficaces."
                  : "These techniques aim to relieve emotional distress and combat dissociation. They must be practised very regularly, especially outside of crises, to be effective."}
              </div>

              {/* Accordion sections */}
              {sections.map((section) => {
                const isOpen = openGroundingSections.includes(section.id);
                const items = lang === 'fr' ? section.itemsFr : section.itemsEn;
                return (
                  <div key={section.id} className={`border rounded-2xl overflow-hidden ${section.colorClass}`}>
                    <button
                      onClick={() => setOpenGroundingSections(prev =>
                        prev.includes(section.id) ? prev.filter(s => s !== section.id) : [...prev, section.id]
                      )}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className={`text-xs font-black uppercase tracking-widest ${section.accentClass}`}>
                        {lang === 'fr' ? section.labelFr : section.labelEn}
                      </span>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${section.accentClass} ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-2">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-app-text/80 leading-relaxed">
                            <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${section.accentClass} bg-white/10`}>{i + 1}</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mini annuaire contacts de confiance */}
              <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-app-accent" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-app-text">
                    {lang === 'fr' ? "Contacts de confiance" : "Trusted contacts"}
                  </h3>
                </div>

                {/* Liste des contacts */}
                {trustedContacts.length > 0 && (
                  <div className="space-y-2">
                    {trustedContacts.map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-app-bg rounded-xl border border-app-border/30">
                        {editingContactId === c.id ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent font-black text-sm flex-shrink-0">
                              {(editContactName || c.name).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={editContactName}
                                onChange={e => setEditContactName(e.target.value)}
                                placeholder={lang === 'fr' ? "Nom" : "Name"}
                                className="flex-1 min-w-0 bg-app-card border border-app-border/40 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                              />
                              <input
                                type="tel"
                                value={editContactPhone}
                                onChange={e => setEditContactPhone(e.target.value)}
                                placeholder={lang === 'fr' ? "Téléphone" : "Phone"}
                                className="flex-1 min-w-0 bg-app-card border border-app-border/40 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                              />
                            </div>
                            <button
                              onClick={() => {
                                if (!editContactName.trim() || !editContactPhone.trim()) return;
                                setTrustedContacts(prev => prev.map(x => x.id === c.id ? { ...x, name: editContactName.trim(), phone: editContactPhone.trim() } : x));
                                setEditingContactId(null);
                              }}
                              className="p-2 hover:text-emerald-500 text-app-muted rounded-lg flex-shrink-0"
                              title={lang === 'fr' ? "Enregistrer" : "Save"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingContactId(null)}
                              className="p-2 hover:text-red-500 text-app-muted rounded-lg flex-shrink-0"
                              title={lang === 'fr' ? "Annuler" : "Cancel"}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent font-black text-sm flex-shrink-0">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-app-text truncate">{c.name}</p>
                              <a
                                href={"tel:" + c.phone}
                                className="text-xs text-app-accent hover:underline font-mono"
                                onClick={e => e.stopPropagation()}
                              >
                                {c.phone}
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                setEditingContactId(c.id);
                                setEditContactName(c.name);
                                setEditContactPhone(c.phone);
                              }}
                              className="p-2 hover:text-app-accent text-app-muted rounded-lg flex-shrink-0"
                              title={lang === 'fr' ? "Modifier" : "Edit"}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setTrustedContacts(prev => prev.filter(x => x.id !== c.id))}
                              className="p-2 hover:text-red-500 text-app-muted rounded-lg flex-shrink-0"
                              title={lang === 'fr' ? "Supprimer" : "Delete"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulaire ajout */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={e => setNewContactName(e.target.value)}
                    placeholder={lang === 'fr' ? "Nom" : "Name"}
                    className="flex-1 bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                  />
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={e => setNewContactPhone(e.target.value)}
                    placeholder={lang === 'fr' ? "Téléphone" : "Phone"}
                    className="flex-1 bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newContactName.trim() && newContactPhone.trim()) {
                        setTrustedContacts(prev => [...prev, { id: Date.now().toString(), name: newContactName.trim(), phone: newContactPhone.trim() }]);
                        setNewContactName('');
                        setNewContactPhone('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!newContactName.trim() || !newContactPhone.trim()) return;
                      setTrustedContacts(prev => [...prev, { id: Date.now().toString(), name: newContactName.trim(), phone: newContactPhone.trim() }]);
                      setNewContactName('');
                      setNewContactPhone('');
                    }}
                    className="p-2.5 bg-app-accent text-white rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
                    title={lang === 'fr' ? "Ajouter" : "Add"}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {trustedContacts.length === 0 && (
                  <p className="text-[11px] text-app-muted text-center">
                    {lang === 'fr' ? "Ajoutez vos contacts de confiance (thérapeute, proche…)" : "Add your trusted contacts (therapist, loved one…)"}
                  </p>
                )}
              </div>

              {/* Ressources de crise / numéros d'urgence */}
              <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  {lang === 'fr' ? "En cas d'urgence" : "In case of emergency"}
                </div>
                <p className="text-[11px] text-app-muted leading-relaxed">
                  {lang === 'fr'
                    ? "Si tu es en détresse ou en danger immédiat, ces numéros sont gratuits, confidentiels et disponibles même si tu n'as pas encore de contact de confiance enregistré."
                    : "If you're in distress or immediate danger, these numbers are free, confidential, and available even if you haven't saved a trusted contact yet."}
                </p>
                <div className="space-y-2">
                  {[
                    { name: lang === 'fr' ? "15 — SAMU (urgence médicale)" : "15 — Emergency medical services", desc: lang === 'fr' ? "Danger immédiat pour la santé" : "Immediate health danger", num: "15" },
                    { name: lang === 'fr' ? "112 — Numéro d'urgence européen" : "112 — European emergency number", desc: lang === 'fr' ? "Depuis n'importe quel téléphone, en Europe" : "From any phone, within Europe", num: "112" },
                    { name: lang === 'fr' ? "115 — Urgences sociales" : "115 — Social emergency line", desc: lang === 'fr' ? "Aussi appelé « SAMU social »" : "Also known as the \"SAMU social\"", num: "115" },
                    { name: lang === 'fr' ? "119 — Enfance maltraitée" : "119 — Child abuse hotline", desc: lang === 'fr' ? "Allô Enfance en Danger, 24h/24 7j/7" : "Allô Enfance en Danger, 24/7", num: "119" },
                    { name: lang === 'fr' ? "3114 — Prévention du suicide" : "3114 — Suicide prevention", desc: lang === 'fr' ? "Gratuit, 24h/24 7j/7, France entière" : "Free, 24/7, all of France", num: "3114" },
                    { name: lang === 'fr' ? "3919 — Violences Femmes Infos" : "3919 — Violence against women hotline", desc: lang === 'fr' ? "Anonyme et gratuit, 24h/24 7j/7" : "Anonymous and free, 24/7", num: "3919" },
                    { name: lang === 'fr' ? "SOS Amitié — Écoute" : "SOS Amitié — Listening line", desc: lang === 'fr' ? "Anonyme et confidentiel, bénévoles formés" : "Anonymous and confidential, trained volunteers", num: "0972394050" },
                  ].map(r => (
                    <a
                      key={r.num}
                      href={`tel:${r.num}`}
                      className="flex items-center justify-between gap-3 p-3 bg-app-card border border-app-border/40 rounded-xl hover:border-red-500/40 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-app-text">{r.name}</p>
                        <p className="text-[10px] text-app-muted">{r.desc}</p>
                      </div>
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  ))}
                </div>
                <p className="text-[9px] text-app-muted italic">
                  {lang === 'fr'
                    ? "Numéros valables en France. Si tu es dans un autre pays, cherche l'équivalent local — findahelpline.com recense des lignes d'écoute dans le monde entier."
                    : "Numbers valid in France. If you're in another country, look up your local equivalent — findahelpline.com lists helplines worldwide."}
                </p>
              </div>

              {/* Footer */}
              <p className="text-center text-[11px] text-app-muted italic pb-4">
                {lang === 'fr'
                  ? "Contenu reproduit avec respect du travail du Dr Igor Thiriez (v3.1, 2021). Haven Space n'est pas un outil médical."
                  : "Content reproduced with respect for the work of Dr Igor Thiriez (v3.1, 2021). Haven Space is not a medical tool."}
              </p>
            </div>
          );
        })()}

        {currentTab === 'health' && (() => {
          const sortedHistory = [...healthHistory].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          return (
            <div className="space-y-6 max-w-3xl mx-auto w-full animate-fade-in duration-300">
              <div className="pb-4 border-b border-app-border/30 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-wider">{lang === 'fr' ? 'Santé' : 'Health'}</h2>
                <p className="text-xs text-app-muted uppercase tracking-widest font-bold">
                  {lang === 'fr' ? 'Carnet de santé partagé du système' : "The system's shared health record"}
                </p>
              </div>

              {/* Sous-onglets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'traitements', label: lang === 'fr' ? 'Traitements' : 'Treatments' },
                  { id: 'antecedents', label: lang === 'fr' ? 'Antécédents' : 'History' },
                  { id: 'urgence', label: lang === 'fr' ? 'Urgence' : 'Emergency' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setHealthSubTab(tab.id as any)}
                    className={`px-3 py-2 sm:px-4 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${healthSubTab === tab.id ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'} ${tab.id === 'urgence' ? (healthSubTab === tab.id ? '' : '!text-red-500 !border-red-500/30') : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* --- Traitements --- */}
              {healthSubTab === 'traitements' && (
                <div className="space-y-4">
                  {!medFormOpen ? (
                    <button
                      onClick={() => openMedForm()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter un médicament' : 'Add a medication'}
                    </button>
                  ) : (
                    <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Nom *' : 'Name *'}</label>
                        <input type="text" value={medDraftName} onChange={e => setMedDraftName(e.target.value)}
                          placeholder={lang === 'fr' ? 'Nom du médicament...' : 'Medication name...'}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Dosage' : 'Dosage'}</label>
                        <input type="text" value={medDraftDosage} onChange={e => setMedDraftDosage(e.target.value)}
                          placeholder={lang === 'fr' ? 'ex. 50mg' : 'e.g. 50mg'}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Prise' : 'Intake'}</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMedDraftRecurring(true)}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${medDraftRecurring ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border text-app-muted'}`}
                          >
                            {lang === 'fr' ? 'Régulière' : 'Regular'}
                          </button>
                          <button
                            onClick={() => setMedDraftRecurring(false)}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${!medDraftRecurring ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border text-app-muted'}`}
                          >
                            {lang === 'fr' ? 'Ponctuelle' : 'One-time'}
                          </button>
                        </div>
                        {!medDraftRecurring && (
                          <input
                            type="date"
                            value={medDraftOneTimeDate}
                            onChange={e => setMedDraftOneTimeDate(e.target.value)}
                            className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                          />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Heures de rappel' : 'Reminder times'}</label>
                        {medDraftTimes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {medDraftTimes.map((t, i) => (
                              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-app-bg border border-app-border/40">
                                {t.time} {t.period}
                                <button onClick={() => setMedDraftTimes(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors">
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <input type="time" value={medDraftTimeInput} onChange={e => setMedDraftTimeInput(e.target.value)}
                            className="bg-app-bg border border-app-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                          <div className="flex gap-1">
                            <button onClick={() => setMedDraftPeriodInput('AM')} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${medDraftPeriodInput === 'AM' ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border text-app-muted'}`}>AM</button>
                            <button onClick={() => setMedDraftPeriodInput('PM')} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${medDraftPeriodInput === 'PM' ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border text-app-muted'}`}>PM</button>
                          </div>
                          <button onClick={addMedTime} className="px-3 py-2 rounded-xl border border-dashed border-app-border text-[10px] font-bold text-app-muted hover:text-app-text transition-colors">
                            + {lang === 'fr' ? 'Ajouter' : 'Add'}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Note' : 'Note'}</label>
                        <textarea value={medDraftNote} onChange={e => setMedDraftNote(e.target.value)} rows={2}
                          placeholder={lang === 'fr' ? 'Note (facultatif)' : 'Note (optional)'}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveMedication} disabled={!medDraftName.trim()}
                          className="flex-1 py-2.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all">
                          {lang === 'fr' ? 'Enregistrer' : 'Save'}
                        </button>
                        <button onClick={() => setMedFormOpen(false)} className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors">
                          {lang === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {medications.length === 0 ? (
                    <div className="text-center p-10 bg-app-card/35 rounded-2xl border border-app-border/25 text-app-muted uppercase tracking-widest text-[10px]">
                      {lang === 'fr' ? 'Aucun médicament enregistré.' : 'No medication logged.'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {medications.map(med => (
                        <div key={med.id} className="p-4 bg-app-card border border-app-border/30 rounded-2xl flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm text-app-text">{med.name}</span>
                              {med.dosage && <span className="text-[10px] font-bold text-app-muted bg-app-bg px-2 py-0.5 rounded-full border border-app-border/30">{med.dosage}</span>}
                              <span className="text-[10px] font-bold text-app-muted bg-app-bg px-2 py-0.5 rounded-full border border-app-border/30">
                                {med.recurring !== false
                                  ? (lang === 'fr' ? 'Quotidien' : 'Daily')
                                  : (lang === 'fr' ? `Ponctuel${med.oneTimeDate ? ' — ' + med.oneTimeDate : ''}` : `One-time${med.oneTimeDate ? ' — ' + med.oneTimeDate : ''}`)}
                              </span>
                            </div>
                            {med.times.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {med.times.map((t, i) => (
                                  <span key={i} className="text-[10px] font-bold text-app-accent bg-app-accent/10 px-2 py-0.5 rounded-full">{t.time} {t.period}</span>
                                ))}
                              </div>
                            )}
                            {med.note && <p className="text-xs text-app-muted italic">{med.note}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openMedForm(med)} className="p-1.5 text-app-muted hover:text-app-accent transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setDeleteMedId(med.id)} className="p-1.5 text-app-muted hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- Antécédents --- */}
              {healthSubTab === 'antecedents' && (
                <div className="space-y-4">
                  {!histFormOpen ? (
                    <button
                      onClick={() => openHistForm()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter une entrée' : 'Add an entry'}
                    </button>
                  ) : (
                    <div className="p-5 bg-app-card border border-app-border/40 rounded-2xl space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Titre' : 'Title'}</label>
                        <input type="text" value={histDraftTitle} onChange={e => setHistDraftTitle(e.target.value)}
                          placeholder={lang === 'fr' ? 'Condition, chirurgie, diagnostic...' : 'Condition, surgery, diagnosis...'}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Date' : 'Date'}</label>
                        <input type="datetime-local" value={histDraftDate} onChange={e => setHistDraftDate(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Note' : 'Note'}</label>
                        <textarea value={histDraftNote} onChange={e => setHistDraftNote(e.target.value)} rows={2}
                          placeholder={lang === 'fr' ? 'Note (facultatif)' : 'Note (optional)'}
                          className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveHistEntry} disabled={!histDraftTitle.trim()}
                          className="flex-1 py-2.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all">
                          {lang === 'fr' ? 'Enregistrer' : 'Save'}
                        </button>
                        <button onClick={() => setHistFormOpen(false)} className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors">
                          {lang === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {sortedHistory.length === 0 ? (
                    <div className="text-center p-10 bg-app-card/35 rounded-2xl border border-app-border/25 text-app-muted uppercase tracking-widest text-[10px]">
                      {lang === 'fr' ? 'Aucun antécédent enregistré.' : 'No history logged.'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedHistory.map(entry => (
                        <div key={entry.id} className="p-4 bg-app-card border border-app-border/30 rounded-2xl flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="font-black text-sm text-app-text block">{entry.title}</span>
                            {entry.date && (
                              <span className="text-[10px] font-mono text-app-muted">
                                {new Date(entry.date).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                            {entry.note && <p className="text-xs text-app-muted italic">{entry.note}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openHistForm(entry)} className="p-1.5 text-app-muted hover:text-app-accent transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setDeleteHistId(entry.id)} className="p-1.5 text-app-muted hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- Urgence --- */}
              {healthSubTab === 'urgence' && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-xs text-app-muted leading-relaxed">
                    {lang === 'fr'
                      ? "Informations critiques pour les secours. Reste bref et clair : ces infos sont pensées pour être lues rapidement par quelqu'un d'autre en cas de besoin."
                      : 'Critical info for first responders. Keep it brief and clear: this is meant to be quickly read by someone else if needed.'}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Conditions' : 'Conditions'}</label>
                    <input type="text" value={emergencyDraft.conditions} onChange={e => setEmergencyDraft(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder={lang === 'fr' ? 'ex. Diabétique de type 1' : 'e.g. Type 1 Diabetic'}
                      className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Allergies' : 'Allergies'}</label>
                    <input type="text" value={emergencyDraft.allergies} onChange={e => setEmergencyDraft(prev => ({ ...prev, allergies: e.target.value }))}
                      placeholder={lang === 'fr' ? 'ex. Pénicilline' : 'e.g. Penicillin'}
                      className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Groupe sanguin' : 'Blood type'}</label>
                    <input type="text" value={emergencyDraft.bloodType} onChange={e => setEmergencyDraft(prev => ({ ...prev, bloodType: e.target.value }))}
                      placeholder="O+"
                      className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-app-muted">{lang === 'fr' ? 'Note' : 'Note'}</label>
                    <textarea value={emergencyDraft.note} onChange={e => setEmergencyDraft(prev => ({ ...prev, note: e.target.value }))} rows={3}
                      placeholder={lang === 'fr' ? 'Note (facultatif)' : 'Note (optional)'}
                      className="w-full bg-app-card border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 resize-none" />
                  </div>
                  <button
                    onClick={() => setEmergencyDraft(prev => ({ ...prev, showQuickAccess: !prev.showQuickAccess }))}
                    className="w-full flex items-center gap-3 p-3 bg-app-card border border-app-border/40 rounded-xl"
                  >
                    <div className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${emergencyDraft.showQuickAccess ? 'bg-app-accent' : 'bg-app-border'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${emergencyDraft.showQuickAccess ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                    <span className="text-xs text-app-text text-left">
                      {lang === 'fr' ? "Afficher un accès rapide aux infos d'urgence dans l'en-tête de l'app" : "Show a quick-access shortcut to emergency info in the app's header"}
                    </span>
                  </button>
                  <button
                    onClick={saveEmergencyInfo}
                    className="w-full py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                  >
                    {lang === 'fr' ? 'Enregistrer' : 'Save'}
                  </button>
                </div>
              )}

              {/* Confirmation suppression médicament */}
              {deleteMedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? 'Supprimer ce médicament ?' : 'Delete this medication?'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setMedications(prev => prev.filter(m => m.id !== deleteMedId)); setDeleteMedId(null); }}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm">
                        {lang === 'fr' ? 'Supprimer' : 'Delete'}
                      </button>
                      <button onClick={() => setDeleteMedId(null)} className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all">
                        {lang === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation suppression antécédent */}
              {deleteHistId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="bg-app-card border border-app-border w-full max-w-sm rounded-3xl p-7 shadow-2xl space-y-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? 'Supprimer cet antécédent ?' : 'Delete this history entry?'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setHealthHistory(prev => prev.filter(h => h.id !== deleteHistId)); setDeleteHistId(null); }}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm">
                        {lang === 'fr' ? 'Supprimer' : 'Delete'}
                      </button>
                      <button onClick={() => setDeleteHistId(null)} className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all">
                        {lang === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {currentTab === 'relax' && (() => {
          const relaxTools = [
            { id: 'box-breathing', label: 'Box Breathing', icon: Wind },
            { id: 'fidgets', label: 'Fidgets', icon: Hand },
            { id: 'kalimba', label: 'Kalimba', icon: Music },
            { id: 'affirmations', label: lang === 'fr' ? 'Affirmations' : 'Affirmations', icon: Sparkles },
            { id: 'memory-box', label: lang === 'fr' ? 'Boîte à Souvenirs' : 'Memory Box', icon: Heart },
            { id: 'choice-box', label: lang === 'fr' ? 'Boîte à Choix' : 'Choice Box', icon: Repeat },
            { id: 'ephemeral', label: lang === 'fr' ? 'Éphémère' : 'Ephemeral', icon: Feather },
            { id: 'eco-system', label: lang === 'fr' ? 'Éco-Système' : 'Eco-System', icon: TreePine },
          ];
          const activeToolMeta = relaxTools.find(t2 => t2.id === activeRelaxTool);
          const phases = getBreathingPhases();
          const currentPhase = phases[breathingPhaseIdx % phases.length];
          const phaseLabel = breathingRhythm === 'box'
            ? (lang === 'fr' ? BOX_BREATHING_LABELS_FR[breathingPhaseIdx % 4] : BOX_BREATHING_LABELS_EN[breathingPhaseIdx % 4])
            : (lang === 'fr' ? ['Inspire', 'Retiens', 'Expire'][breathingPhaseIdx % 3] : ['Inhale', 'Hold', 'Exhale'][breathingPhaseIdx % 3]);

          return (
            <div className="space-y-6 max-w-3xl mx-auto w-full animate-fade-in duration-300">
              {!activeRelaxTool ? (
                <>
                  <div className="pb-4 border-b border-app-border/30 space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-wider">{lang === 'fr' ? 'Détente' : 'Relax'}</h2>
                    <p className="text-xs text-app-muted uppercase tracking-widest font-bold">
                      {lang === 'fr' ? 'Outils anti-dissociation' : 'Anti-dissociation tools'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {relaxTools.map(tool => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => { setActiveRelaxTool(tool.id); setBreathingRunning(false); setBreathingPhaseIdx(0); }}
                          className="flex flex-col items-center gap-3 p-5 bg-app-card border border-app-border/40 rounded-2xl hover:border-app-accent/40 hover:bg-app-card/80 active:scale-95 transition-all"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent">
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest text-app-text text-center">{tool.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveRelaxTool(null); setBreathingRunning(false); }}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-app-muted hover:text-app-accent transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    {lang === 'fr' ? 'Détente' : 'Relax'}
                  </button>

                  {activeRelaxTool === 'box-breathing' ? (
                    <div className="flex flex-col items-center gap-8 py-8">
                      <h3 className="text-xl font-black uppercase tracking-wider text-app-text">Box Breathing</h3>

                      {/* Forme animée */}
                      <div className="w-56 h-56 flex items-center justify-center">
                        <div
                          className="rounded-[2rem] bg-app-accent/15 border-2 border-app-accent/40 flex items-center justify-center"
                          style={{
                            width: '9rem',
                            height: '9rem',
                            transform: `scale(${breathingRunning ? currentPhase.scale : 1})`,
                            transition: breathingRunning ? `transform ${currentPhase.duration}s ease-in-out` : 'transform 0.3s ease',
                          }}
                        >
                          <span className="text-sm font-black uppercase tracking-widest text-app-accent select-none">
                            {breathingRunning ? phaseLabel : (lang === 'fr' ? 'Prêt·e ?' : 'Ready?')}
                          </span>
                        </div>
                      </div>

                      {/* Contrôles */}
                      <div className="w-full max-w-xs space-y-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBreathingRhythm('box')}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${breathingRhythm === 'box' ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'}`}
                          >
                            {lang === 'fr' ? 'Carré' : 'Box'}
                          </button>
                          <button
                            onClick={() => setBreathingRhythm('478')}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${breathingRhythm === '478' ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'}`}
                          >
                            4-7-8
                          </button>
                        </div>

                        {breathingRhythm === 'box' && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-app-muted">
                              <span>{lang === 'fr' ? 'Tempo' : 'Tempo'}</span>
                              <span>{breathingSpeed}s</span>
                            </div>
                            <input
                              type="range"
                              min={3}
                              max={6}
                              step={1}
                              value={breathingSpeed}
                              onChange={e => setBreathingSpeed(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}

                        <button
                          onClick={() => { setBreathingPhaseIdx(0); setBreathingRunning(r => !r); }}
                          className="w-full py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                        >
                          {breathingRunning ? (lang === 'fr' ? 'Arrêter' : 'Stop') : (lang === 'fr' ? 'Commencer' : 'Start')}
                        </button>
                      </div>
                    </div>
                  ) : activeRelaxTool === 'fidgets' ? (
                    <div className="flex flex-col items-center gap-6 py-6">
                      <h3 className="text-xl font-black uppercase tracking-wider text-app-text">Fidgets</h3>

                      {/* Sous-navigation */}
                      <div className="flex gap-2 w-full max-w-sm">
                        {[
                          { id: 'sand', label: lang === 'fr' ? 'Bac à Sable' : 'Sand Box' },
                          { id: 'bubbles', label: lang === 'fr' ? 'Bulles' : 'Bubbles' },
                          { id: 'coloring', label: lang === 'fr' ? 'Coloriage' : 'Coloring' },
                        ].map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setFidgetSubTool(sub.id as any)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${fidgetSubTool === sub.id ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'}`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>

                      {/* Bac à sable / neige / vagues */}
                      {fidgetSubTool === 'sand' && (
                        <div className="w-full max-w-sm space-y-3">
                          <div className="flex gap-2">
                            {[
                              { id: 'sand', label: lang === 'fr' ? 'Sable' : 'Sand' },
                              { id: 'snow', label: lang === 'fr' ? 'Neige' : 'Snow' },
                              { id: 'waves', label: lang === 'fr' ? 'Vagues' : 'Waves' },
                            ].map(m => (
                              <button
                                key={m.id}
                                onClick={() => setSandColorMode(m.id as any)}
                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border transition-all ${sandColorMode === m.id ? 'border-app-accent text-app-accent' : 'border-app-border text-app-muted'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                          <canvas
                            ref={fidgetCanvasRef}
                            width={320}
                            height={320}
                            className="w-full aspect-square rounded-2xl border border-app-border/40 bg-app-bg touch-none cursor-crosshair"
                            onPointerDown={e => { fidgetDrawingRef.current = true; fidgetLastPointRef.current = null; handleFidgetPoint(e); }}
                            onPointerMove={e => { if (fidgetDrawingRef.current) handleFidgetPoint(e); }}
                            onPointerUp={() => { fidgetDrawingRef.current = false; fidgetLastPointRef.current = null; }}
                            onPointerLeave={() => { fidgetDrawingRef.current = false; fidgetLastPointRef.current = null; }}
                          />
                          <p className="text-[10px] text-app-muted text-center italic">
                            {sandColorMode === 'waves'
                              ? (lang === 'fr' ? 'Fais glisser ton doigt — l\'eau ondule et clapote au contact.' : 'Drag your finger — the water ripples on contact.')
                              : (lang === 'fr' ? 'Fais glisser ton doigt — les traits s\'effacent tout seuls.' : 'Drag your finger — the marks fade on their own.')}
                          </p>
                        </div>
                      )}

                      {/* Bulles à faire éclater */}
                      {fidgetSubTool === 'bubbles' && (
                        <div className="w-full max-w-sm space-y-3">
                          <div className="grid grid-cols-6 gap-2 p-4 bg-app-bg rounded-2xl border border-app-border/40">
                            {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
                              const popped = poppedBubbles.has(i);
                              return (
                                <button
                                  key={i}
                                  onClick={() => toggleBubble(i)}
                                  className={`aspect-square rounded-full border transition-all ${
                                    popped
                                      ? 'bg-app-bg border-app-border/30 scale-75 opacity-40'
                                      : 'bg-app-accent/20 border-app-accent/40 hover:bg-app-accent/30 active:scale-90'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <button
                            onClick={() => setPoppedBubbles(new Set())}
                            className="w-full py-2 rounded-xl border border-app-border text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-text transition-colors"
                          >
                            {lang === 'fr' ? 'Regonfler toutes les bulles' : 'Reset all bubbles'}
                          </button>
                        </div>
                      )}

                      {/* Coloriage / mandala */}
                      {fidgetSubTool === 'coloring' && (
                        <div className="w-full max-w-sm space-y-3 flex flex-col items-center">
                          <div className="flex gap-2">
                            {[
                              { id: 'flower', label: lang === 'fr' ? 'Fleur' : 'Flower' },
                              { id: 'star', label: lang === 'fr' ? 'Étoile' : 'Star' },
                              { id: 'rings', label: lang === 'fr' ? 'Cercles' : 'Rings' },
                            ].map(tpl => (
                              <button
                                key={tpl.id}
                                onClick={() => setMandalaTemplate(tpl.id as any)}
                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border transition-all ${mandalaTemplate === tpl.id ? 'border-app-accent text-app-accent' : 'border-app-border text-app-muted'}`}
                              >
                                {tpl.label}
                              </button>
                            ))}
                          </div>
                          <div className="relative w-64 h-64">
                            {getMandalaPoints(mandalaTemplate).map(pt => {
                              const colorKey = `${mandalaTemplate}_${pt.key}`;
                              const shapeClass = pt.shape === 'circle' ? 'rounded-full' : pt.shape === 'diamond' ? 'rounded-md rotate-45' : 'rounded-md';
                              return (
                                <button
                                  key={pt.key}
                                  onClick={() => cycleMandalaColor(colorKey)}
                                  style={{
                                    backgroundColor: mandalaColors[colorKey] || 'transparent',
                                    left: pt.x - pt.size / 2,
                                    top: pt.y - pt.size / 2,
                                    width: pt.size,
                                    height: pt.size,
                                  }}
                                  className={`absolute border-2 border-app-border/50 hover:border-app-accent transition-colors ${shapeClass}`}
                                />
                              );
                            })}
                          </div>
                          <button
                            onClick={() => setMandalaColors(prev => {
                              const next = { ...prev };
                              Object.keys(next).forEach(k => { if (k.startsWith(`${mandalaTemplate}_`)) delete next[k]; });
                              return next;
                            })}
                            className="w-full py-2 rounded-xl border border-app-border text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-text transition-colors"
                          >
                            {lang === 'fr' ? 'Effacer ce mandala' : 'Clear this mandala'}
                          </button>
                          <p className="text-[10px] text-app-muted text-center italic">
                            {lang === 'fr' ? 'Clique sur une zone pour la colorer, reclique pour changer de couleur.' : 'Click a zone to color it, click again to cycle colors.'}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : activeRelaxTool === 'kalimba' ? (
                    <div className="flex flex-col items-center gap-6 py-6">
                      <h3 className="text-xl font-black uppercase tracking-wider text-app-text">Kalimba</h3>
                      <div className="w-full max-w-md bg-gradient-to-t from-app-accent/10 to-app-accent/5 border border-app-accent/20 rounded-3xl p-5 pt-8">
                        {/* Corps / trou de résonance décoratif */}
                        <div className="w-14 h-14 rounded-full bg-app-bg border border-app-border/40 mx-auto mb-6" />
                        <div className="flex justify-center items-start gap-0.5 sm:gap-1">
                          {KALIMBA_NOTES.map((n, i) => {
                            const height = 150 - Math.abs(i - 8) * 9;
                            return (
                              <button
                                key={i}
                                onPointerDown={() => playKalimbaNote(noteToFreq(n.note, n.octave))}
                                style={{ height: `${height}px` }}
                                className="w-4 sm:w-5 rounded-b-md bg-gradient-to-t from-app-card to-app-border/50 border border-app-border/60 active:from-app-accent/50 active:to-app-accent/20 transition-colors shadow-sm shrink-0"
                                title={`${n.note}${n.octave}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-[10px] text-app-muted text-center italic max-w-xs">
                        {lang === 'fr' ? 'Touche les lames pour jouer une note.' : 'Tap the tines to play a note.'}
                      </p>
                    </div>
                  ) : activeRelaxTool === 'affirmations' ? (() => {
                    const affirmation = AFFIRMATIONS[currentAffirmationIdx];
                    return (
                      <div className="flex flex-col items-center gap-6 py-6">
                        <h3 className="text-xl font-black uppercase tracking-wider text-app-text">
                          {lang === 'fr' ? 'Affirmations' : 'Affirmations'}
                        </h3>
                        <div className="w-full max-w-sm bg-app-card border border-app-border/40 rounded-3xl p-8 space-y-4 shadow-sm">
                          <div className="text-[10px] font-black uppercase tracking-widest text-app-accent text-center flex items-center justify-center gap-1.5">
                            <span>{AFFIRMATION_CATEGORY_ICONS[affirmation.category] || '✦'}</span>
                            <span>{affirmation.category}</span>
                          </div>
                          <p className="text-base font-semibold text-app-text text-center leading-relaxed animate-fade-in">
                            {affirmation.text}
                          </p>
                        </div>
                        <button
                          onClick={drawRandomAffirmation}
                          className="w-full max-w-sm flex items-center justify-center gap-2.5 py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {lang === 'fr' ? 'Rafraîchir' : 'Refresh'}
                        </button>
                      </div>
                    );
                  })() : activeRelaxTool === 'memory-box' ? (() => {
                    const revealed = memories.find(m => m.id === revealedMemoryId) || null;
                    const revealedAuthor = revealed?.authorAlterId ? savedAlters.find(a => a.id === revealed.authorAlterId) : null;
                    return (
                      <div className="flex flex-col items-center gap-5 py-6 w-full">
                        <h3 className="text-xl font-black uppercase tracking-wider text-app-text">
                          {lang === 'fr' ? 'Boîte à Souvenirs' : 'Memory Box'}
                        </h3>

                        {/* Scène chaleureuse avec les souvenirs déposés */}
                        <div className="w-full max-w-lg min-h-[140px] bg-gradient-to-b from-amber-500/10 to-app-accent/5 border border-amber-500/20 rounded-3xl p-6 flex flex-wrap items-center justify-center gap-3">
                          {memories.length === 0 ? (
                            <p className="text-xs text-app-muted italic text-center">
                              {lang === 'fr' ? 'Aucun souvenir déposé pour le moment.' : 'No memories left yet.'}
                            </p>
                          ) : (
                            memories.map(m => (
                              <button
                                key={m.id}
                                onClick={() => setRevealedMemoryId(m.id)}
                                title={lang === 'fr' ? 'Cliquer pour lire' : 'Click to read'}
                                className="w-11 h-11 rounded-2xl bg-app-card border border-amber-500/30 flex items-center justify-center text-amber-600 hover:scale-110 hover:border-amber-500/60 transition-all shadow-sm"
                              >
                                {getMemoryElementIcon(m.elementType, 'w-5 h-5')}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Panneau de lecture du souvenir sélectionné */}
                        {revealed && (
                          <div className="w-full max-w-lg bg-app-card border border-app-border/40 rounded-2xl p-5 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                                {getMemoryElementIcon(revealed.elementType, 'w-3.5 h-3.5')}
                                {MEMORY_ELEMENTS.find(e => e.id === revealed.elementType)?.[lang === 'fr' ? 'label' : 'labelEn']}
                              </span>
                              <button onClick={() => setRevealedMemoryId(null)} className="p-1 text-app-muted hover:text-app-text transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm text-app-text leading-relaxed">{revealed.text}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-app-border/15">
                              <span className="text-[10px] text-app-muted font-bold">
                                {revealedAuthor ? revealedAuthor.alterName : (lang === 'fr' ? 'Anonyme' : 'Anonymous')}
                                {' · '}
                                {new Date(revealed.timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              <button
                                onClick={() => deleteMemory(revealed.id)}
                                className="p-1 text-app-muted hover:text-red-500 transition-colors"
                                title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Formulaire de dépôt */}
                        {!memoryFormOpen ? (
                          <button
                            onClick={() => setMemoryFormOpen(true)}
                            className="w-full max-w-lg flex items-center justify-center gap-2.5 py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {lang === 'fr' ? 'Déposer un souvenir' : 'Leave a memory'}
                          </button>
                        ) : (
                          <div className="w-full max-w-lg bg-app-card border border-app-border/40 rounded-2xl p-5 space-y-4">
                            <textarea
                              value={memoryDraftText}
                              onChange={e => setMemoryDraftText(e.target.value)}
                              placeholder={lang === 'fr' ? "Ce que tu veux laisser au système..." : "What you want to leave for the system..."}
                              rows={3}
                              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20 resize-none"
                            />
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                                {lang === 'fr' ? 'Le déposer dans...' : 'Leave it as...'}
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {MEMORY_ELEMENTS.map(el => (
                                  <button
                                    key={el.id}
                                    onClick={() => setMemoryDraftElement(el.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${memoryDraftElement === el.id ? 'bg-amber-500/15 border-amber-500/50 text-amber-600' : 'bg-app-bg border-app-border text-app-muted'}`}
                                  >
                                    {getMemoryElementIcon(el.id, 'w-3.5 h-3.5')}
                                    {lang === 'fr' ? el.label : el.labelEn}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                                {lang === 'fr' ? 'Qui dépose ?' : 'Who is leaving it?'}
                              </label>
                              {(() => {
                                const current = memoryDraftAuthorId ? savedAlters.find(a => a.id === memoryDraftAuthorId) : null;
                                const filtered = [...savedAlters]
                                  .filter(a => !memoryAuthorSearch || (a.alterName || '').toLowerCase().includes(memoryAuthorSearch.toLowerCase()))
                                  .sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang));
                                return (
                                  <div className="relative">
                                    <div
                                      className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs cursor-pointer hover:border-app-accent/40 transition-colors"
                                      onClick={() => setMemoryAuthorOpen(o => !o)}
                                    >
                                      {current?.profileImage
                                        ? <img src={current.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                        : current && <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent flex-shrink-0">{(current.alterName || '?').charAt(0)}</div>
                                      }
                                      <span className={`flex-1 font-semibold ${current ? 'text-app-text' : 'text-app-muted'}`}>
                                        {current ? current.alterName : (lang === 'fr' ? 'Anonyme / Système' : 'Anonymous / System')}
                                      </span>
                                      <ChevronDown className={`w-3.5 h-3.5 text-app-muted flex-shrink-0 transition-transform ${memoryAuthorOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {memoryAuthorOpen && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={() => { setMemoryAuthorOpen(false); setMemoryAuthorSearch(''); }} />
                                        <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                                          <div className="p-2 border-b border-app-border/30">
                                            <input
                                              autoFocus
                                              type="text"
                                              value={memoryAuthorSearch}
                                              onChange={e => setMemoryAuthorSearch(e.target.value)}
                                              placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                                              className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                              onClick={e => e.stopPropagation()}
                                            />
                                          </div>
                                          <div className="max-h-52 overflow-y-auto py-1">
                                            <button
                                              type="button"
                                              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${!memoryDraftAuthorId ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                              onClick={() => { setMemoryDraftAuthorId(''); setMemoryAuthorOpen(false); setMemoryAuthorSearch(''); }}
                                            >
                                              {lang === 'fr' ? 'Anonyme / Système' : 'Anonymous / System'}
                                            </button>
                                            {filtered.length === 0 ? (
                                              <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                                            ) : filtered.map(a => (
                                              <button
                                                type="button"
                                                key={a.id}
                                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${memoryDraftAuthorId === a.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                                onClick={() => { setMemoryDraftAuthorId(a.id); setMemoryAuthorOpen(false); setMemoryAuthorSearch(''); }}
                                              >
                                                {a.profileImage
                                                  ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                                  : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent flex-shrink-0">{(a.alterName || '?').charAt(0)}</div>
                                                }
                                                {a.alterName}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={addMemory}
                                disabled={!memoryDraftText.trim()}
                                className="flex-1 py-2.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all"
                              >
                                {lang === 'fr' ? 'Déposer' : 'Leave it'}
                              </button>
                              <button
                                onClick={() => { setMemoryFormOpen(false); setMemoryDraftText(''); }}
                                className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors"
                              >
                                {lang === 'fr' ? 'Annuler' : 'Cancel'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })() : activeRelaxTool === 'choice-box' ? (
                    <div className="flex flex-col items-center gap-8 py-6 w-full">
                      <h3 className="text-xl font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? 'Boîte à Choix' : 'Choice Box'}
                      </h3>

                      {/* --- La roue --- */}
                      <div className="w-full max-w-sm flex flex-col items-center gap-4">
                        <div className="relative w-52 h-52">
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-app-accent drop-shadow" />
                          <div
                            className="w-52 h-52 rounded-full border-4 border-app-card shadow-lg"
                            style={{
                              background: getWheelGradient(),
                              transform: `rotate(${wheelRotation}deg)`,
                              transition: wheelSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                            }}
                          />
                        </div>

                        {wheelResultIdx !== null && !wheelSpinning && (
                          <div className="px-5 py-2.5 bg-app-accent/10 border border-app-accent/30 rounded-2xl text-sm font-black text-app-accent text-center animate-fade-in">
                            🎉 {wheelOptions[wheelResultIdx]}
                          </div>
                        )}

                        <button
                          onClick={spinWheel}
                          disabled={wheelOptions.length < 2 || wheelSpinning}
                          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-app-accent hover:opacity-90 disabled:opacity-40 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          {wheelSpinning ? (lang === 'fr' ? 'Ça tourne…' : 'Spinning…') : (lang === 'fr' ? 'Faire tourner la roue' : 'Spin the wheel')}
                        </button>

                        {/* Légende / gestion des options de la roue */}
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => setWheelEditMode(o => !o)}
                            className="text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-accent transition-colors flex items-center gap-1.5 mx-auto"
                          >
                            <Pencil className="w-3 h-3" />
                            {wheelEditMode ? (lang === 'fr' ? 'Fermer' : 'Close') : (lang === 'fr' ? 'Modifier les options' : 'Edit options')}
                          </button>

                          {!wheelEditMode ? (
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {wheelOptions.map((opt, i) => (
                                <span
                                  key={i}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${wheelResultIdx === i && !wheelSpinning ? 'border-app-accent text-app-accent' : 'border-app-border/40 text-app-muted'}`}
                                >
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length] }} />
                                  {opt}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2 p-3 bg-app-card border border-app-border/40 rounded-2xl">
                              {wheelOptions.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length] }} />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => setWheelOptions(prev => prev.map((o, oi) => oi === i ? e.target.value : o))}
                                    className="flex-1 min-w-0 bg-app-bg border border-app-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                  />
                                  <button
                                    onClick={() => setWheelOptions(prev => prev.filter((_, oi) => oi !== i))}
                                    className="p-1 text-app-muted hover:text-red-500 transition-colors shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  value={wheelNewOption}
                                  onChange={e => setWheelNewOption(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && wheelNewOption.trim()) {
                                      setWheelOptions(prev => [...prev, wheelNewOption.trim()]);
                                      setWheelNewOption('');
                                    }
                                  }}
                                  placeholder={lang === 'fr' ? 'Nouvelle option...' : 'New option...'}
                                  className="flex-1 min-w-0 bg-app-bg border border-dashed border-app-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                />
                                <button
                                  onClick={() => { if (wheelNewOption.trim()) { setWheelOptions(prev => [...prev, wheelNewOption.trim()]); setWheelNewOption(''); } }}
                                  className="p-1.5 rounded-lg bg-app-accent/10 text-app-accent hover:bg-app-accent/20 transition-colors shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* --- Qu'est-ce qu'on fait maintenant ? --- */}
                      <div className="w-full max-w-sm space-y-3 pt-4 border-t border-app-border/25">
                        <button
                          onClick={() => setMicroPanelOpen(o => !o)}
                          className="w-full py-3 rounded-xl border border-app-border text-xs font-black uppercase tracking-widest text-app-text hover:border-app-accent/40 transition-colors"
                        >
                          {lang === 'fr' ? "Qu'est-ce qu'on fait maintenant ?" : 'What should we do now?'}
                        </button>

                        {microPanelOpen && (
                          <div className="space-y-2">
                            {microOptions.map(opt => (
                              <div key={opt.id} className="flex items-center gap-3 px-4 py-2.5 bg-app-card border border-app-border/30 rounded-xl">
                                <span className="text-lg shrink-0">{opt.emoji}</span>
                                <span className="text-sm text-app-text flex-1">{opt.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setMicroEditMode(o => !o)}
                          className="text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-accent transition-colors flex items-center gap-1.5 mx-auto"
                        >
                          <Pencil className="w-3 h-3" />
                          {microEditMode ? (lang === 'fr' ? 'Fermer' : 'Close') : (lang === 'fr' ? 'Modifier les micro-options' : 'Edit micro-options')}
                        </button>

                        {microEditMode && (
                          <div className="space-y-2 p-3 bg-app-card border border-app-border/40 rounded-2xl">
                            {microOptions.map(opt => (
                              <div key={opt.id} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt.emoji}
                                  onChange={e => setMicroOptions(prev => prev.map(o => o.id === opt.id ? { ...o, emoji: e.target.value } : o))}
                                  className="w-12 bg-app-bg border border-app-border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                />
                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={e => setMicroOptions(prev => prev.map(o => o.id === opt.id ? { ...o, label: e.target.value } : o))}
                                  className="flex-1 min-w-0 bg-app-bg border border-app-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                />
                                <button
                                  onClick={() => setMicroOptions(prev => prev.filter(o => o.id !== opt.id))}
                                  className="p-1 text-app-muted hover:text-red-500 transition-colors shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={microNewEmoji}
                                onChange={e => setMicroNewEmoji(e.target.value)}
                                placeholder="🙂"
                                className="w-12 bg-app-bg border border-dashed border-app-border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                              />
                              <input
                                type="text"
                                value={microNewLabel}
                                onChange={e => setMicroNewLabel(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && microNewLabel.trim()) {
                                    setMicroOptions(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), emoji: microNewEmoji.trim() || '✦', label: microNewLabel.trim() }]);
                                    setMicroNewEmoji(''); setMicroNewLabel('');
                                  }
                                }}
                                placeholder={lang === 'fr' ? 'Nouvelle micro-option...' : 'New micro-option...'}
                                className="flex-1 min-w-0 bg-app-bg border border-dashed border-app-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                              />
                              <button
                                onClick={() => { if (microNewLabel.trim()) { setMicroOptions(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), emoji: microNewEmoji.trim() || '✦', label: microNewLabel.trim() }]); setMicroNewEmoji(''); setMicroNewLabel(''); } }}
                                className="p-1.5 rounded-lg bg-app-accent/10 text-app-accent hover:bg-app-accent/20 transition-colors shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeRelaxTool === 'ephemeral' ? (
                    <div className="flex flex-col items-center gap-4 py-6 w-full">
                      <h3 className="text-xl font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? 'Éphémère' : 'Ephemeral'}
                      </h3>
                      <div
                        ref={ephemeralContainerRef}
                        className="relative w-full max-w-sm h-96 overflow-hidden rounded-2xl border border-app-border/40 bg-app-bg touch-none"
                      >
                        {ephemeralBubbles.map(bubble => (
                          <button
                            key={bubble.id}
                            onClick={e => popEphemeralBubble(bubble, e)}
                            onAnimationEnd={() => setEphemeralBubbles(prev => prev.filter(b => b.id !== bubble.id))}
                            aria-label={lang === 'fr' ? 'Éclater la bulle' : 'Pop the bubble'}
                            className="absolute rounded-full ephemeral-bubble-rise cursor-pointer"
                            style={{
                              left: `${bubble.x}%`,
                              bottom: -bubble.size,
                              width: bubble.size,
                              height: bubble.size,
                              animationDuration: `${bubble.duration}s`,
                              ['--rise-distance' as any]: `${EPHEMERAL_CONTAINER_HEIGHT + bubble.size + 40}px`,
                              ['--drift' as any]: `${bubble.drift}px`,
                              background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85), hsla(${bubble.hue}, 80%, 75%, 0.15) 45%, hsla(${bubble.hue + 40}, 80%, 65%, 0.25) 100%)`,
                              border: `1px solid hsla(${bubble.hue}, 70%, 80%, 0.6)`,
                              boxShadow: `0 0 8px hsla(${bubble.hue}, 70%, 70%, 0.35)`,
                            }}
                          />
                        ))}
                        {ephemeralPops.map(pop => (
                          <span
                            key={pop.id}
                            className="absolute rounded-full animate-ping pointer-events-none"
                            style={{
                              left: pop.x - pop.size / 2,
                              top: pop.y - pop.size / 2,
                              width: pop.size,
                              height: pop.size,
                              backgroundColor: `hsla(${pop.hue}, 80%, 75%, 0.4)`,
                            }}
                          />
                        ))}
                        {ephemeralBubbles.length === 0 && ephemeralPops.length === 0 && (
                          <p className="absolute inset-0 flex items-center justify-center text-[10px] text-app-muted italic px-8 text-center">
                            {lang === 'fr' ? 'Les bulles arrivent...' : 'Bubbles incoming...'}
                          </p>
                        )}
                      </div>
                      <p className="text-[10px] text-app-muted text-center italic max-w-xs">
                        {lang === 'fr' ? 'Touche une bulle pour la faire éclater avant qu\'elle n\'atteigne le haut — chaque taille a son propre son.' : 'Tap a bubble to pop it before it reaches the top — each size has its own sound.'}
                      </p>
                    </div>
                  ) : activeRelaxTool === 'eco-system' ? (() => {
                    const bgDef = ECO_BACKGROUNDS.find(b => b.id === ecoBackground)!;
                    // Le Jardin a une variante nocturne, appliquée automatiquement selon l'heure de l'appareil
                    const bg = (ecoBackground === 'jardin' && isJardinNight)
                      ? { ...bgDef, className: 'from-indigo-950/50 via-emerald-950/40 to-slate-950/50 border-emerald-800/25' }
                      : bgDef;
                    const catalog = ECO_CATALOG[ecoBackground];
                    const visibleElements = ecoElements.filter(el => el.theme === ecoBackground);
                    const itemsInTab = catalog.items.filter(it => it.tab === ecoDraftTab);
                    const moodOverlay =
                      ecoBackground === 'aquarium' ? 'linear-gradient(160deg, rgba(255,183,94,0.22), rgba(255,120,80,0.10) 55%, transparent)' :
                      ecoBackground === 'greenhouse' ? 'linear-gradient(160deg, rgba(255,196,120,0.20), rgba(255,140,90,0.08) 55%, transparent)' :
                      ecoBackground === 'jardin' ? 'linear-gradient(160deg, rgba(255,140,60,0.20), rgba(180,90,30,0.10) 55%, transparent)' :
                      'linear-gradient(160deg, rgba(168,85,247,0.22), rgba(99,102,241,0.14) 55%, transparent)';
                    return (
                      <div className="flex flex-col items-center gap-5 py-6 w-full">
                        <h3 className="text-xl font-black uppercase tracking-wider text-app-text">
                          {lang === 'fr' ? 'Éco-Système' : 'Eco-System'}
                        </h3>
                        {ecoBackground === 'jardin' && (
                          <div className="flex flex-col items-center gap-2 -mt-3 w-full max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                              <p className="text-[11px] font-bold text-app-muted">
                                💧 {waterCountToday} {lang === 'fr'
                                  ? (waterCountToday > 1 ? 'verres bus aujourd\'hui' : 'verre bu aujourd\'hui')
                                  : (waterCountToday === 1 ? 'glass today' : 'glasses today')}
                              </p>
                              <button
                                type="button"
                                onClick={resetWaterToday}
                                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-lg border border-app-border bg-app-card text-app-muted hover:border-app-accent/50 hover:text-app-accent transition-all"
                              >
                                <RotateCcw className="w-3 h-3" />
                                {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEcoJardinSettingsOpen(o => !o)}
                                className={`text-[9px] font-black uppercase tracking-wide px-2 py-1 rounded-lg border transition-all ${ecoJardinSettingsOpen ? 'bg-app-accent/15 border-app-accent/50 text-app-accent' : 'border-app-border text-app-muted'}`}
                              >
                                💧 {lang === 'fr' ? 'Rappel' : 'Reminder'}
                              </button>
                            </div>
                            {ecoJardinSettingsOpen && (
                              <div className="w-full bg-app-card border border-app-border/40 rounded-xl p-3 flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => setHydroReminderOn(o => !o)}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-[10px] font-bold text-app-text">
                                    {lang === 'fr' ? "Rappel d'hydratation" : 'Hydration reminder'}
                                  </span>
                                  <div className={`w-8 h-4 rounded-full transition-colors relative ${hydroReminderOn ? 'bg-app-accent' : 'bg-app-border'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${hydroReminderOn ? 'left-[18px]' : 'left-0.5'}`} />
                                  </div>
                                </button>
                                {hydroReminderOn && (
                                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                                    <span className="text-[9px] font-bold text-app-muted uppercase tracking-wide">
                                      {lang === 'fr' ? 'Toutes les' : 'Every'}
                                    </span>
                                    <div className="flex flex-wrap justify-end gap-1">
                                      {[15, 30, 60, 120, 180, 240, 360].map(m => (
                                        <button
                                          key={m}
                                          type="button"
                                          onClick={() => setHydroIntervalMinutes(m)}
                                          className={`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${hydroIntervalMinutes === m ? 'bg-app-accent text-white border-transparent' : 'bg-app-bg border-app-border text-app-muted'}`}
                                        >
                                          {m < 60 ? `${m}min` : `${m / 60}h`}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {hydroReminderOn && !notifBrowser && (
                                  <p className="text-[9px] text-app-muted italic">
                                    {lang === 'fr' ? 'Active aussi les notifications navigateur dans Réglages pour recevoir le rappel.' : 'Also enable browser notifications in Settings to receive the reminder.'}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Choix du paysage */}
                        <div className="flex gap-2 w-full max-w-2xl">
                          {ECO_BACKGROUNDS.map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                setEcoBackground(b.id);
                                resetEcoView();
                                const firstTab = ECO_CATALOG[b.id].tabs[0].id;
                                setEcoDraftTab(firstTab);
                                setEcoDraftType(ECO_CATALOG[b.id].items.find(it => it.tab === firstTab)?.id || '');
                              }}
                              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${ecoBackground === b.id ? 'bg-app-accent text-white border-transparent' : 'bg-app-card border-app-border text-app-muted'}`}
                            >
                              {lang === 'fr' ? b.label : b.labelEn}
                            </button>
                          ))}
                        </div>

                        {/* Barre d'ambiance : teinte, son, zoom */}
                        <div className="flex flex-wrap gap-2 w-full max-w-2xl justify-center">
                          <button
                            type="button"
                            onClick={() => setEcoAltMood(m => !m)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${ecoAltMood ? 'bg-app-accent/15 border-app-accent/50 text-app-accent' : 'bg-app-card border-app-border text-app-muted'}`}
                            title={lang === 'fr' ? 'Changer la teinte de lumière' : 'Shift the light tint'}
                          >
                            🌗 {lang === 'fr' ? 'Ambiance' : 'Mood'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEcoSoundOn(s => !s)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${ecoSoundOn ? 'bg-app-accent/15 border-app-accent/50 text-app-accent' : 'bg-app-card border-app-border text-app-muted'}`}
                            title={lang === 'fr' ? "Son d'ambiance doux" : 'Soft ambient sound'}
                          >
                            {ecoSoundOn ? '🔊' : '🔈'} {lang === 'fr' ? 'Son' : 'Sound'}
                          </button>
                          <div className="flex items-center gap-1 bg-app-card border border-app-border rounded-lg px-1">
                            <button type="button" onClick={() => setEcoZoom(z => clampEcoZoom(z - 0.2))} className="px-2 py-1.5 text-app-muted hover:text-app-text text-xs font-black">−</button>
                            <span className="text-[9px] font-bold text-app-muted w-9 text-center">{Math.round(ecoZoom * 100)}%</span>
                            <button type="button" onClick={() => setEcoZoom(z => clampEcoZoom(z + 0.2))} className="px-2 py-1.5 text-app-muted hover:text-app-text text-xs font-black">+</button>
                          </div>
                          {(ecoZoom !== 1 || ecoPan.x !== 0 || ecoPan.y !== 0) && (
                            <button
                              type="button"
                              onClick={resetEcoView}
                              className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-app-border bg-app-card text-app-muted hover:text-app-text transition-all"
                            >
                              {lang === 'fr' ? 'Recentrer' : 'Recenter'}
                            </button>
                          )}
                        </div>

                        {/* Cadre visible — taille fixe, capte molette/pincement/glisser pour naviguer la scène */}
                        <div
                          ref={ecoViewportRef}
                          onWheel={handleEcoWheel}
                          onPointerDown={handleEcoViewportPointerDown}
                          onPointerMove={handleEcoViewportPointerMove}
                          onPointerUp={handleEcoViewportPointerUp}
                          onPointerCancel={handleEcoViewportPointerUp}
                          className="relative w-full max-w-2xl h-72 sm:h-[26rem] rounded-3xl border overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
                        >
                          {/* La scène — fond immersif propre à chaque thème, reçoit le zoom/pan */}
                          <div
                            ref={ecoSceneRef}
                            className={`absolute inset-0 bg-gradient-to-b ${bg.className}`}
                            style={{ transform: `translate(${ecoPan.x}px, ${ecoPan.y}px) scale(${ecoZoom})`, transformOrigin: 'center center' }}
                          >
                            {/* Décor d'arrière-plan, non-interactif */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {ecoBackground === 'aquarium' && (
                                <>
                                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-200/50 to-transparent" />
                                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-3 rounded-full bg-amber-300/25 blur-sm" />
                                  <span className="absolute bottom-2 left-[8%] text-2xl opacity-50">🌿</span>
                                  <span className="absolute bottom-1 left-[28%] text-lg opacity-40">🌿</span>
                                  <span className="absolute bottom-2 right-[15%] text-2xl opacity-45">🌿</span>
                                  <span className="absolute bottom-1 right-[32%] text-lg opacity-35">🪨</span>
                                  <div className="absolute top-0 left-[20%] w-16 h-full bg-gradient-to-b from-white/15 to-transparent rotate-6" />
                                  <div className="absolute top-0 right-[25%] w-10 h-full bg-gradient-to-b from-white/10 to-transparent -rotate-3" />
                                  {/* Petites bulles ambiantes qui remontent doucement, purement décoratif */}
                                  {Array.from({ length: 10 }).map((_, i) => {
                                    const seed = (i * 53) % 100;
                                    return (
                                      <span
                                        key={`bub-${i}`}
                                        className="absolute rounded-full bg-white/40 eco-ambient-rise"
                                        style={{
                                          left: `${5 + seed * 0.9}%`,
                                          bottom: `${(i % 4) * 4}%`,
                                          width: 3 + (i % 3) * 2,
                                          height: 3 + (i % 3) * 2,
                                          animationDuration: `${5 + (i % 5)}s`,
                                          animationDelay: `${(i * 0.7) % 6}s`,
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}
                              {ecoBackground === 'greenhouse' && (
                                <>
                                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 32px), repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 32px)' }} />
                                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-emerald-800/20 to-transparent" />
                                  <span className="absolute bottom-1 left-[10%] text-2xl opacity-50">🍃</span>
                                  <span className="absolute top-3 right-[10%] text-xl opacity-40">🍃</span>
                                  <span className="absolute bottom-2 right-[20%] text-lg opacity-35">🌾</span>
                                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(254,249,195,0.25), transparent 70%)' }} />
                                  {/* Poussière de pollen qui flotte doucement */}
                                  {Array.from({ length: 8 }).map((_, i) => {
                                    const seed = (i * 41) % 100;
                                    return (
                                      <span
                                        key={`dust-${i}`}
                                        className="absolute rounded-full bg-yellow-100/60 eco-ambient-dust"
                                        style={{
                                          left: `${8 + seed * 0.85}%`,
                                          bottom: `${5 + (i % 3) * 6}%`,
                                          width: 2 + (i % 2) * 2,
                                          height: 2 + (i % 2) * 2,
                                          animationDuration: `${6 + (i % 4)}s`,
                                          animationDelay: `${(i * 0.9) % 7}s`,
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}
                              {ecoBackground === 'night' && (
                                <>
                                  {Array.from({ length: 26 }).map((_, i) => {
                                    const seed = (i * 37) % 100;
                                    const seed2 = (i * 61) % 100;
                                    return (
                                      <span
                                        key={i}
                                        className="absolute rounded-full bg-white eco-twinkle"
                                        style={{
                                          left: `${seed}%`,
                                          top: `${(seed2 * 0.85)}%`,
                                          width: i % 4 === 0 ? 2.5 : 1.5,
                                          height: i % 4 === 0 ? 2.5 : 1.5,
                                          animationDuration: `${2.5 + (i % 5) * 0.6}s`,
                                          animationDelay: `${(i * 0.31) % 4}s`,
                                        }}
                                      />
                                    );
                                  })}
                                  <div className="absolute top-4 right-6 w-10 h-10 rounded-full bg-yellow-50/25 blur-[2px]" />
                                </>
                              )}
                              {ecoBackground === 'jardin' && (
                                <>
                                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-amber-800/25 to-transparent" />
                                  <div className="absolute top-0 left-[15%] w-20 h-full bg-gradient-to-b from-yellow-100/25 to-transparent rotate-6" />
                                  <div className="absolute top-2 right-8 w-12 h-12 rounded-full bg-yellow-100/40 blur-[3px]" />
                                  <span className="absolute bottom-2 left-[6%] text-xl opacity-40">🌾</span>
                                  <span className="absolute bottom-3 right-[10%] text-lg opacity-35">🌾</span>
                                  {/* Petites feuilles qui dérivent doucement, purement décoratif */}
                                  {Array.from({ length: 6 }).map((_, i) => {
                                    const seed = (i * 47) % 100;
                                    return (
                                      <span
                                        key={`leaf-${i}`}
                                        className="absolute text-xs opacity-30 eco-ambient-dust"
                                        style={{
                                          left: `${8 + seed * 0.85}%`,
                                          top: `${5 + (i % 3) * 10}%`,
                                          animationDuration: `${7 + (i % 4)}s`,
                                          animationDelay: `${(i * 0.8) % 6}s`,
                                        }}
                                      >🍂</span>
                                    );
                                  })}
                                </>
                              )}
                            </div>

                            {/* Voile de teinte "Ambiance" — décale légèrement la lumière sans changer le décor */}
                            <div
                              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                              style={{ background: moodOverlay, opacity: ecoAltMood ? 1 : 0 }}
                            />

                            {visibleElements.length === 0 && (
                              <p className="absolute inset-0 flex items-center justify-center text-xs text-app-muted italic px-6 text-center pointer-events-none">
                                {lang === 'fr' ? "Aucune présence posée pour le moment." : 'No presence placed yet.'}
                              </p>
                            )}

                            {visibleElements.map(el => {
                              const meta = getEcoItemMeta(el.theme, el.type);
                              const isSeed = el.theme === 'jardin' && !!JARDIN_GROWTH_STAGES[el.type];
                              // La nuit, dans le Jardin : les papillons deviennent des lucioles, les lanternes s'allument
                              const isNightButterfly = el.theme === 'jardin' && isJardinNight && el.type === 'papillon';
                              const isNightLantern = el.theme === 'jardin' && isJardinNight && el.type === 'lanterne-jardin';
                              const displayEmoji = isSeed ? getJardinEmoji(el) : isNightButterfly ? '✨' : meta.emoji;
                              const wilted = isSeed && isJardinWilted(el);
                              const pulsing = ecoPulsingId === el.id;
                              const swaying = pulsing && el.type === ECO_SWAY_TYPE;
                              const author = el.authorAlterId ? savedAlters.find(a => a.id === el.authorAlterId) : null;
                              const seed = ecoAnimSeed(el.id);
                              const animClass = swaying ? 'eco-sway'
                                : (isNightButterfly || isNightLantern || ECO_GLOW_IDS.includes(el.type)) ? 'eco-glow'
                                : ECO_SWIM_IDS.includes(el.type) ? 'eco-swim'
                                : ECO_SPIN_IDS.includes(el.type) ? 'eco-spin'
                                : ECO_WIND_IDS.includes(el.type) ? 'eco-wind'
                                : 'eco-float';
                              const animStyle: React.CSSProperties = {
                                animationDuration: swaying ? '0.6s'
                                  : ECO_SPIN_IDS.includes(el.type) ? `${5 + (seed % 6)}s`
                                  : ECO_WIND_IDS.includes(el.type) ? `${4 + (seed % 5)}s`
                                  : `${(ECO_SWIM_IDS.includes(el.type) ? 3.5 : ECO_GLOW_IDS.includes(el.type) ? 2.6 : 3.2) + (seed % 10) * 0.15}s`,
                                animationDelay: swaying ? '0s' : `${(seed % 20) * 0.12}s`,
                                filter: el.type === 'nuagerose' ? 'hue-rotate(-45deg) saturate(1.6) brightness(1.05)' : wilted ? 'grayscale(0.6) brightness(0.85)' : undefined,
                                opacity: wilted ? 0.6 : undefined,
                              };
                              return (
                                <div
                                  key={el.id}
                                  onPointerDown={e => handleEcoPointerDown(e, el)}
                                  onPointerMove={handleEcoPointerMove}
                                  onPointerUp={e => handleEcoPointerUp(e, el)}
                                  style={{
                                    left: `${el.x}%`,
                                    top: `${el.y}%`,
                                    transform: `translate(-50%, -50%) scale(${pulsing && !swaying ? 1.3 : 1})`,
                                  }}
                                  className={`absolute flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing transition-transform duration-300 ${ecoEditMode ? 'opacity-90 hover:opacity-40' : ''}`}
                                >
                                  <span className={`text-2xl pointer-events-none drop-shadow ${animClass}`} style={animStyle}>{displayEmoji}</span>
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-app-card/90 border border-app-border/40 text-app-text whitespace-nowrap pointer-events-none shadow-sm">
                                    {isSeed
                                      ? (wilted ? (lang === 'fr' ? '💧 A soif — arrose-la' : '💧 Thirsty — water it') : (lang === 'fr' ? meta.label : meta.labelEn))
                                      : isNightButterfly ? (lang === 'fr' ? 'Luciole (papillon endormi)' : 'Firefly (butterfly asleep)')
                                      : (lang === 'fr' ? meta.label : meta.labelEn)}
                                    {author ? ` · ${author.alterName}` : ` · ${lang === 'fr' ? 'Anonyme' : 'Anonymous'}`}
                                  </span>
                                </div>
                              );
                            })}

                            <AnimatePresence>
                              {ecoParticles.map(p => (
                                <motion.span
                                  key={p.id}
                                  initial={{ opacity: 1, y: 0 }}
                                  animate={{ opacity: 0, y: -28 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.9, ease: 'easeOut' }}
                                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                  className="absolute text-sm pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                >
                                  {p.emoji}
                                </motion.span>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Dépôt d'une présence */}
                        {!ecoFormOpen ? (
                          <div className="w-full max-w-2xl flex gap-2">
                            <button
                              onClick={() => setEcoFormOpen(true)}
                              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {lang === 'fr' ? 'Poser ma présence' : 'Place my presence'}
                            </button>
                            <button
                              onClick={() => setEcoEditMode(o => !o)}
                              className={`px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${ecoEditMode ? 'bg-red-500/10 border-red-500/40 text-red-500' : 'bg-app-card border-app-border text-app-muted'}`}
                            >
                              {ecoEditMode ? (lang === 'fr' ? 'Terminé' : 'Done') : (lang === 'fr' ? 'Gérer' : 'Manage')}
                            </button>
                          </div>
                        ) : (
                          <div className="w-full max-w-2xl bg-app-card border border-app-border/40 rounded-2xl p-5 space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                                {lang === 'fr' ? 'Quel élément ?' : 'Which element?'}
                              </label>
                              {/* Sous-onglets de catégories */}
                              <div className="flex gap-1.5">
                                {catalog.tabs.map(tab => (
                                  <button
                                    key={tab.id}
                                    onClick={() => {
                                      setEcoDraftTab(tab.id);
                                      const firstItem = catalog.items.find(it => it.tab === tab.id);
                                      if (firstItem) setEcoDraftType(firstItem.id);
                                    }}
                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border transition-all ${ecoDraftTab === tab.id ? 'border-app-accent text-app-accent' : 'border-app-border text-app-muted'}`}
                                  >
                                    {lang === 'fr' ? tab.label : tab.labelEn}
                                  </button>
                                ))}
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pt-1">
                                {itemsInTab.map(t => (
                                  <button
                                    key={t.id}
                                    onClick={() => setEcoDraftType(t.id)}
                                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[8px] font-bold border transition-all ${ecoDraftType === t.id ? 'bg-app-accent/15 border-app-accent/50 text-app-accent' : 'bg-app-bg border-app-border text-app-muted'}`}
                                  >
                                    <span className="text-lg">{t.emoji}</span>
                                    <span className="text-center leading-tight">{lang === 'fr' ? t.label : t.labelEn}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                                {lang === 'fr' ? 'Qui dépose ?' : 'Who is placing it?'}
                              </label>
                              {(() => {
                                const current = ecoDraftAuthorId ? savedAlters.find(a => a.id === ecoDraftAuthorId) : null;
                                const filtered = [...savedAlters]
                                  .filter(a => !ecoAuthorSearch || (a.alterName || '').toLowerCase().includes(ecoAuthorSearch.toLowerCase()))
                                  .sort((a, b) => (a.alterName || '').localeCompare(b.alterName || '', lang));
                                return (
                                  <div className="relative">
                                    <div
                                      className="w-full flex items-center gap-2 bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs cursor-pointer hover:border-app-accent/40 transition-colors"
                                      onClick={() => setEcoAuthorOpen(o => !o)}
                                    >
                                      {current?.profileImage
                                        ? <img src={current.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                        : current && <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent flex-shrink-0">{(current.alterName || '?').charAt(0)}</div>
                                      }
                                      <span className={`flex-1 font-semibold ${current ? 'text-app-text' : 'text-app-muted'}`}>
                                        {current ? current.alterName : (lang === 'fr' ? 'Anonyme / Système' : 'Anonymous / System')}
                                      </span>
                                      <ChevronDown className={`w-3.5 h-3.5 text-app-muted flex-shrink-0 transition-transform ${ecoAuthorOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {ecoAuthorOpen && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={() => { setEcoAuthorOpen(false); setEcoAuthorSearch(''); }} />
                                        <div className="absolute left-0 right-0 mt-1 z-50 bg-app-card border border-app-border/50 rounded-2xl shadow-xl overflow-hidden">
                                          <div className="p-2 border-b border-app-border/30">
                                            <input
                                              autoFocus
                                              type="text"
                                              value={ecoAuthorSearch}
                                              onChange={e => setEcoAuthorSearch(e.target.value)}
                                              placeholder={lang === 'fr' ? 'Rechercher un alter…' : 'Search alter…'}
                                              className="w-full bg-app-bg border border-app-border/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                                              onClick={e => e.stopPropagation()}
                                            />
                                          </div>
                                          <div className="max-h-52 overflow-y-auto py-1">
                                            <button
                                              type="button"
                                              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${!ecoDraftAuthorId ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                              onClick={() => { setEcoDraftAuthorId(''); setEcoAuthorOpen(false); setEcoAuthorSearch(''); }}
                                            >
                                              {lang === 'fr' ? 'Anonyme / Système' : 'Anonymous / System'}
                                            </button>
                                            {filtered.length === 0 ? (
                                              <p className="px-4 py-3 text-xs text-app-muted">{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
                                            ) : filtered.map(a => (
                                              <button
                                                type="button"
                                                key={a.id}
                                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-app-bg transition-colors text-left ${ecoDraftAuthorId === a.id ? 'bg-app-accent/10 text-app-accent' : 'text-app-text'}`}
                                                onClick={() => { setEcoDraftAuthorId(a.id); setEcoAuthorOpen(false); setEcoAuthorSearch(''); }}
                                              >
                                                {a.profileImage
                                                  ? <img src={a.profileImage} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
                                                  : <div className="w-5 h-5 rounded-full bg-app-accent/20 flex items-center justify-center text-[8px] font-black text-app-accent flex-shrink-0">{(a.alterName || '?').charAt(0)}</div>
                                                }
                                                {a.alterName}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={addEcoElement}
                                className="flex-1 py-2.5 bg-app-accent hover:opacity-90 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all"
                              >
                                {lang === 'fr' ? 'Déposer' : 'Place it'}
                              </button>
                              <button
                                onClick={() => setEcoFormOpen(false)}
                                className="px-4 py-2.5 bg-app-bg border border-app-border rounded-xl text-[10px] font-bold text-app-muted hover:text-app-text transition-colors"
                              >
                                {lang === 'fr' ? 'Annuler' : 'Cancel'}
                              </button>
                            </div>
                          </div>
                        )}

                        <p className="text-[10px] text-app-muted text-center italic max-w-xs">
                          {ecoEditMode
                            ? (lang === 'fr' ? 'Clique sur un élément pour le retirer.' : 'Click an element to remove it.')
                            : (lang === 'fr' ? 'Fais glisser un élément pour le repositionner, ou tapote-le pour le voir réagir. Molette, pincement ou glisser le fond pour naviguer dans la scène.' : 'Drag an element to reposition it, or tap it to see it gently react. Scroll, pinch or drag the background to navigate the scene.')}
                        </p>
                      </div>
                    );
                  })() : (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      {activeToolMeta && <activeToolMeta.icon className="w-10 h-10 text-app-muted opacity-30" />}
                      <h3 className="text-lg font-black uppercase tracking-wider text-app-text">{activeToolMeta?.label}</h3>
                      <p className="text-xs text-app-muted uppercase tracking-widest font-bold">
                        {lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

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
            <div id="json-backup-section" className="border-t border-app-border/40 pt-10 space-y-6 scroll-mt-24">
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
                        ? 'Téléchargez une sauvegarde en local de toutes vos fiches d\'alters, systèmes parallèles, historique de front, chat interne, messagerie, journal de bord, planning et santé.'
                        : 'Download a total offline backup containing your alter cards, parallel systems, front history, inner chat, messaging, journal, planning, and health data.'}
                    </p>
                    
                    {/* Quick Stats of local database */}
                    <div className="p-3.5 bg-app-bg/50 border border-app-border/40 rounded-xl space-y-1.5 font-mono text-[10px] text-app-muted">
                      <div><strong className="text-app-text">{lang === 'fr' ? 'Système actuel :' : 'Current System :'}</strong> {mainSystemName}</div>
                      <div><strong className="text-app-text">{savedAlters.length}</strong> {lang === 'fr' ? 'alters' : 'alters'}</div>
                      <div><strong className="text-app-text">{subsystems.length}</strong> {lang === 'fr' ? 'sous-systèmes' : 'subsystems'}</div>
                      <div><strong className="text-app-text">{parallelSystems.length}</strong> {lang === 'fr' ? 'systèmes parallèles' : 'parallel systems'}</div>
                      <div><strong className="text-app-text">{switchLogs.length}</strong> {lang === 'fr' ? 'entrées d\'historique de front' : 'front history entries'}</div>
                      <div><strong className="text-app-text">{chatMessages.length}</strong> {lang === 'fr' ? 'messages de chat interne' : 'inner chat messages'}</div>
                      <div><strong className="text-app-text">{directMessages.length}</strong> {lang === 'fr' ? 'messages de messagerie' : 'direct messages'}</div>
                      <div><strong className="text-app-text">{journalEntries.length}</strong> {lang === 'fr' ? 'notes de journal' : 'journals'}</div>
                      <div><strong className="text-app-text">{loadPlanning(activeSystemId).length}</strong> {lang === 'fr' ? 'entrées de planning' : 'planning entries'}</div>
                      <div><strong className="text-app-text">{loadEisenhower(activeSystemId).length}</strong> {lang === 'fr' ? 'tâches (matrice d\'Eisenhower)' : 'tasks (Eisenhower matrix)'}</div>
                      <div><strong className="text-app-text">{medications.length + healthHistory.length}</strong> {lang === 'fr' ? 'éléments de santé' : 'health items'}</div>
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
      <footer className="border-t border-app-border py-12 px-4 sm:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2 text-app-muted">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.copyright}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-8 text-xs font-bold uppercase tracking-widest text-app-muted">
            <button
              onClick={() => {
                setActiveLegalPage('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-app-text transition-colors border-none bg-transparent cursor-pointer font-bold uppercase tracking-widest text-xs"
            >
              {lang === 'fr' ? 'Guide' : 'Guide'}
            </button>
            <button
              onClick={() => {
                setActiveLegalPage('vocabulary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-app-text transition-colors border-none bg-transparent cursor-pointer font-bold uppercase tracking-widest text-xs"
            >
              {lang === 'fr' ? 'Vocabulaire' : 'Vocabulary'}
            </button>
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
      {/* DM Toast Notification — message reçu sur une conversation qu'on ne regarde pas */}
      <AnimatePresence>
        {dmToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-[100] max-w-xs"
          >
            <button
              onClick={() => {
                setCurrentTab('messaging');
                setActiveConvId(dmToast.convId);
                setMsgSenderId(dmToast.recipientId);
                setDmToast(null);
              }}
              className="w-full flex items-center gap-3 p-3.5 bg-app-card border border-app-accent/30 rounded-2xl shadow-xl hover:border-app-accent/60 transition-colors text-left"
            >
              {dmToast.recipientAvatar
                ? <img src={dmToast.recipientAvatar} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="" />
                : <div className="w-10 h-10 rounded-full bg-app-accent/20 flex items-center justify-center text-sm font-black text-app-accent flex-shrink-0">{(dmToast.recipientName || '?').charAt(0)}</div>
              }
              <span className="flex-1 text-xs font-semibold text-app-text leading-snug">
                <strong className="font-black">{dmToast.recipientName}</strong>
                {lang === 'fr' ? ', ' : ', '}
                <strong className="font-black">{dmToast.senderName}</strong>
                {lang === 'fr' ? ' t\'a envoyé un message !' : ' sent you a message!'}
              </span>
              <span
                onClick={e => { e.stopPropagation(); setDmToast(null); }}
                className="text-app-muted hover:text-app-text transition-colors flex-shrink-0 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
        {deleteConfirmSubsystemId && (() => {
          const subToDelete = subsystems.find(s => s.id === deleteConfirmSubsystemId);
          const excludedIds = [deleteConfirmSubsystemId, ...getDescendantSubsystemIds(deleteConfirmSubsystemId)];
          const availableDestinations = activeSystemSubsystems.filter(s => !excludedIds.includes(s.id));
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`bg-app-card border border-app-border w-full rounded-3xl p-7 shadow-2xl space-y-6 text-center ${deleteSubsystemStep === 'move' ? 'max-w-md' : 'max-w-sm'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                  <Trash2 className="w-7 h-7" />
                </div>

                {deleteSubsystemStep === 'choose' ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                        {lang === 'fr' ? 'Supprimer le sous-système ?' : 'Delete Subsystem?'}
                      </h3>
                      <p className="text-xs text-app-muted leading-relaxed">
                        {lang === 'fr'
                          ? `« ${subToDelete?.name} » — que veux-tu faire des fiches et sous-systèmes qu'il contient ?`
                          : `"${subToDelete?.name}" — what do you want to do with the profiles and subsystems inside it?`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setDeleteSubsystemStep('move')}
                        className="w-full py-3 bg-app-accent hover:opacity-90 text-app-accent-text font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                      >
                        {lang === 'fr' ? 'Déplacer les fiches ailleurs' : 'Move profiles elsewhere'}
                      </button>
                      <button
                        onClick={() => setDeleteSubsystemStep('confirmDestroy')}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                      >
                        {lang === 'fr' ? 'Supprimer le dossier et son contenu' : 'Delete folder & its contents'}
                      </button>
                      <p className="text-[10px] text-red-500/80 leading-relaxed">
                        {lang === 'fr'
                          ? '⚠️ Cette option supprime définitivement les fiches à l\'intérieur.'
                          : '⚠️ This permanently deletes the profiles inside.'}
                      </p>
                      <button
                        onClick={() => { setDeleteConfirmSubsystemId(null); setDeleteSubsystemStep('choose'); }}
                        className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                      >
                        {lang === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                    </div>
                  </>
                ) : deleteSubsystemStep === 'confirmDestroy' ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-base font-black uppercase tracking-wider text-red-500">
                        {lang === 'fr' ? 'Action irréversible' : 'Irreversible action'}
                      </h3>
                      <p className="text-xs text-app-muted leading-relaxed">
                        {lang === 'fr' ? (
                          <>Pour confirmer, tape le nom du sous-système <strong className="text-app-text">{subToDelete?.name}</strong> ci-dessous. Tout ce qu'il contient sera supprimé définitivement.</>
                        ) : (
                          <>To confirm, type the subsystem name <strong className="text-app-text">{subToDelete?.name}</strong> below. Everything inside will be permanently deleted.</>
                        )}
                      </p>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={destroySubsystemConfirmText}
                      onChange={e => setDestroySubsystemConfirmText(e.target.value)}
                      placeholder={subToDelete?.name || ''}
                      className="w-full bg-app-bg border border-red-500/40 rounded-xl px-3 py-2.5 text-sm text-app-text text-center focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => executeDeleteSubsystem(deleteConfirmSubsystemId, 'destroy')}
                        disabled={destroySubsystemConfirmText.trim().toLowerCase() !== (subToDelete?.name || '').trim().toLowerCase()}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                      >
                        {lang === 'fr' ? 'Supprimer définitivement' : 'Permanently delete'}
                      </button>
                      <button
                        onClick={() => { setDeleteSubsystemStep('choose'); setDestroySubsystemConfirmText(''); }}
                        className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                      >
                        {lang === 'fr' ? 'Retour' : 'Back'}
                      </button>
                    </div>
                  </>
                ) : (() => {
                  const directAlters = savedAlters.filter(a => a.subsystemId === deleteConfirmSubsystemId);
                  const allSelected = directAlters.length > 0 && directAlters.every(a => moveSubsystemSelectedIds.includes(a.id));

                  const toggleSelected = (alterId: string) => {
                    setMoveSubsystemSelectedIds(prev => prev.includes(alterId) ? prev.filter(id => id !== alterId) : [...prev, alterId]);
                  };
                  const toggleSelectAll = () => {
                    setMoveSubsystemSelectedIds(allSelected ? [] : directAlters.map(a => a.id));
                  };
                  const applyBulkDestination = () => {
                    if (moveSubsystemSelectedIds.length === 0) return;
                    setMoveSubsystemAssignments(prev => {
                      const next = { ...prev };
                      moveSubsystemSelectedIds.forEach(id => { next[id] = moveSubsystemBulkDestination; });
                      return next;
                    });
                    setMoveSubsystemSelectedIds([]);
                  };

                  return (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-base font-black uppercase tracking-wider text-app-text">
                          {lang === 'fr' ? 'Déplacer les fiches vers…' : 'Move profiles to…'}
                        </h3>
                        <p className="text-xs text-app-muted leading-relaxed">
                          {directAlters.length === 0
                            ? (lang === 'fr'
                              ? 'Aucune fiche directement dans ce sous-système. Les sous-systèmes enfants remonteront d\'un niveau.'
                              : 'No profiles directly inside this subsystem. Child subsystems will move up one level.')
                            : (lang === 'fr'
                              ? 'Choisis une destination pour chaque fiche. Coche-en plusieurs pour leur assigner la même destination d\'un coup — pas obligatoire, tu peux aussi les régler une par une.'
                              : 'Choose a destination for each profile. Check several to assign them the same destination at once — not required, you can also set them one by one.')}
                        </p>
                      </div>

                      {directAlters.length > 0 && (
                        <>
                          {/* Assignation groupée facultative */}
                          <div className="flex items-center gap-2 p-2.5 bg-app-bg border border-app-border/40 rounded-xl text-left">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded accent-app-accent flex-shrink-0 cursor-pointer"
                            />
                            <select
                              value={moveSubsystemBulkDestination}
                              onChange={e => setMoveSubsystemBulkDestination(e.target.value)}
                              className="flex-1 min-w-0 bg-app-card border border-app-border rounded-lg px-2 py-1.5 text-xs text-app-text focus:outline-none"
                            >
                              <option value="__main__">{lang === 'fr' ? '— Système principal —' : '— Main system —'}</option>
                              {availableDestinations.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={applyBulkDestination}
                              disabled={moveSubsystemSelectedIds.length === 0}
                              className="px-2.5 py-1.5 bg-app-accent text-app-accent-text text-[9px] font-black uppercase tracking-wide rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                            >
                              {lang === 'fr' ? 'Assigner' : 'Assign'}
                            </button>
                          </div>

                          {/* Liste des fiches avec destination individuelle */}
                          <div className="space-y-1.5 max-h-56 overflow-y-auto text-left pr-1">
                            {directAlters.map(a => (
                              <div key={a.id} className="flex items-center gap-2 p-2 bg-app-bg border border-app-border/30 rounded-xl">
                                <input
                                  type="checkbox"
                                  checked={moveSubsystemSelectedIds.includes(a.id)}
                                  onChange={() => toggleSelected(a.id)}
                                  className="w-4 h-4 rounded accent-app-accent flex-shrink-0 cursor-pointer"
                                />
                                {a.profileImage
                                  ? <img src={a.profileImage} className="w-6 h-6 rounded-full object-cover flex-shrink-0" alt="" />
                                  : <div className="w-6 h-6 rounded-full bg-app-accent/20 flex items-center justify-center text-[9px] font-black text-app-accent flex-shrink-0">{(a.alterName || '?').charAt(0)}</div>
                                }
                                <span className="text-xs font-bold text-app-text flex-shrink-0 max-w-[30%] truncate">{a.alterName}</span>
                                <select
                                  value={moveSubsystemAssignments[a.id] ?? '__main__'}
                                  onChange={e => setMoveSubsystemAssignments(prev => ({ ...prev, [a.id]: e.target.value }))}
                                  className="flex-1 min-w-0 bg-app-card border border-app-border rounded-lg px-2 py-1 text-[11px] text-app-text focus:outline-none"
                                >
                                  <option value="__main__">{lang === 'fr' ? '— Système principal —' : '— Main system —'}</option>
                                  {availableDestinations.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => executeDeleteSubsystem(deleteConfirmSubsystemId, 'move', moveSubsystemAssignments)}
                          className="w-full py-3 bg-app-accent hover:opacity-90 text-app-accent-text font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                        >
                          {lang === 'fr' ? 'Confirmer et supprimer le sous-système' : 'Confirm & delete subsystem'}
                        </button>
                        <button
                          onClick={() => setDeleteSubsystemStep('choose')}
                          className="w-full py-3 bg-app-bg border border-app-border text-app-text font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                        >
                          {lang === 'fr' ? 'Retour' : 'Back'}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </div>
          );
        })()}

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
