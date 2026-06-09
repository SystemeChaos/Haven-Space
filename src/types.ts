export enum AlterRole {
  HOST = 'Host',
  CO_HOST = 'Co-Host',
  PROTECTOR = 'Protector',
  PROTECTOR_PHYSICAL = 'Physical Protector',
  PROTECTOR_EMOTIONAL = 'Emotional Protector',
  INTERNAL_SELF_HELPER = 'Internal Self Helper',
  CAREGIVER = 'Caregiver',
  PERSECUTOR = 'Persecutor',
  PROSECUTOR = 'Prosecutor',
  AVENGER = 'Avenger',
  LITTLE = 'Little',
  MIDDLE = 'Middle',
  TEEN = 'Teen',
  GATEKEEPER = 'Gatekeeper',
  MEMORY_HOLDER = 'Memory Holder',
  TRAUMA_HOLDER = 'Trauma Holder',
  SYMPTOM_HOLDER = 'Symptom Holder',
  INTROJECT = 'Introject',
  FICTIVE = 'Fictive',
  FACTIVE = 'Factive',
  SEXUAL_ALTER = 'Sexual Alter',
  MANAGER = 'Manager',
  OBSERVER = 'Observer',
  SHELL = 'Shell',
  SUBSYSTEM = 'Subsystem',
  ANP = 'ANP',
  EP = 'EP',
  FRAGMENT = 'Fragment',
  NON_HUMAN = 'Non-Human',
  SOOTHER = 'Soother',
  DYSFUNCTIONAL_PROTECTOR = 'Dysfunctional Protector',
  SABOTEUR = 'Saboteur',
  MEDIATOR = 'Mediator',
  ARCHIVIST = 'Archivist',
  AGE_SLIDER = 'Age Slider',
  SOCIAL = 'Social',
  OPPOSITE_GENDER = 'Opposite Gender',
  ABUSER = 'Abuser',
}

export enum Gender {
  MALE = 'Masculin',
  FEMALE = 'Féminin',
  NON_BINARY = 'Non-Binaire',
  ENBY = 'Enby',
  GENDERQUEER = 'Genderqueer',
  AGENDER = 'Agenré',
  NEUTROIS = 'Neutrois',
  XENOGENDER = 'Xénogenre',
  GENDERFLUID = 'Genderfluid',
  GENDERFLUX = 'Genderflux',
  BIGENDER = 'Bigender',
  TRIGENDER = 'Trigender',
  POLYGENDER = 'Polygender',
  PANGENDER = 'Pangender',
  DEMIBOY = 'Demiboy',
  DEMIGIRL = 'Demigirl',
  GENDER_NON_CONFORMING = 'Gender Non-Conforming',
  INTERGENDER = 'Intergender',
  LIBREGENDER = 'Libregender',
  CASSGENDER = 'Cassgender',
  MAVERIQUE = 'Maverique',
  APORAGENDER = 'Aporagender',
  MULTIGENDER = 'Multigender',
  NOVIGENDER = 'Novigender',
  ALIAGENDER = 'Aliagender',
  GENDERVOID = 'Gendervoid',
  GREYGENDER = 'Greygender',
  AGENDERFLUX = 'Agenderflux',
  FLUIDFLUX = 'Fluidflux',
  TRANSMASCULINE = 'Transmasculin',
  TRANSFEMININE = 'Transféminin',
  ANDROGYNE = 'Androgyne',
  GENDER_VARIANT = 'Gender-variant',
  GENDER_EXPANSIVE = 'Gender-expansive',
  NEUTRAL = 'Neutre',
  QUESTIONING = 'En questionnement',
  OTHER = 'Autre',
}

export const GENDER_CATEGORIES = {
  BINARY: [Gender.MALE, Gender.FEMALE],
  NON_BINARY: [Gender.NON_BINARY, Gender.ENBY, Gender.GENDERQUEER, Gender.AGENDER, Gender.NEUTROIS, Gender.XENOGENDER, Gender.MAVERIQUE, Gender.APORAGENDER, Gender.ALIAGENDER, Gender.GENDERVOID, Gender.GREYGENDER, Gender.ANDROGYNE],
  FLUID: [Gender.GENDERFLUID, Gender.GENDERFLUX, Gender.BIGENDER, Gender.TRIGENDER, Gender.POLYGENDER, Gender.PANGENDER, Gender.MULTIGENDER, Gender.AGENDERFLUX, Gender.FLUIDFLUX],
  DEMI_GNC: [Gender.DEMIBOY, Gender.DEMIGIRL, Gender.GENDER_NON_CONFORMING, Gender.LIBREGENDER, Gender.CASSGENDER, Gender.INTERGENDER, Gender.NOVIGENDER, Gender.TRANSMASCULINE, Gender.TRANSFEMININE, Gender.GENDER_VARIANT, Gender.GENDER_EXPANSIVE],
  OTHER: [Gender.NEUTRAL, Gender.QUESTIONING, Gender.OTHER],
};

export enum PersonalityTrait {
  CREATIVE = 'CREATIVE',
  CALM = 'CALM',
  SOCIAL = 'SOCIAL',
  SHY = 'SHY',
  BRAVE = 'BRAVE',
  EMPATHETIC = 'EMPATHETIC',
  LOGICAL = 'LOGICAL',
  CURIOUS = 'CURIOUS',
  ARTISTIC = 'ARTISTIC',
  ATHLETIC = 'ATHLETIC',
  MUSICAL = 'MUSICAL',
  PROTECTIVE = 'PROTECTIVE',
  NURTURING = 'NURTURING',
  STOIC = 'STOIC',
  ENERGETIC = 'ENERGETIC',
  QUIET = 'QUIET',
  LEADER = 'LEADER',
  FOLLOWER = 'FOLLOWER',
  DREAMER = 'DREAMER',
  REALIST = 'REALIST',
  OPTIMIST = 'OPTIMIST',
  PESSIMIST = 'PESSIMIST',
  PERFECTIONIST = 'PERFECTIONIST',
  ORGANIZED = 'ORGANIZED',
  MESSY = 'MESSY',
  HUMOROUS = 'HUMOROUS',
  SERIOUS = 'SERIOUS',
  SARCASTIC = 'SARCASTIC',
  KIND = 'KIND',
  BLUNT = 'BLUNT',
  PATIENT = 'PATIENT',
  IMPATIENT = 'IMPATIENT',
  LOYAL = 'LOYAL',
  INDEPENDENT = 'INDEPENDENT',
  DEPENDENT = 'DEPENDENT',
  ADVENTUROUS = 'ADVENTUROUS',
  HOMEBODY = 'HOMEBODY',
  INTROVERTED = 'INTROVERTED',
  EXTROVERTED = 'EXTROVERTED',
  AMBIVERT = 'AMBIVERT',
}

export enum Disorder {
  ANXIETY = 'ANXIETY',
  DEPRESSION = 'DEPRESSION',
  PTSD = 'PTSD',
  CPTSD = 'CPTSD',
  BPD = 'BPD',
  ASPD = 'ASPD',
  ADHD = 'ADHD',
  AUTISM = 'AUTISM',
  BIPOLAR = 'BIPOLAR',
  OCD = 'OCD',
  ED = 'ED',
  PSYCHOSIS = 'PSYCHOSIS',
  SCHIZOPHRENIA = 'SCHIZOPHRENIA',
  HPD = 'HPD',
  NPD = 'NPD',
  NEURODIVERGENT = 'NEURODIVERGENT',
  DYSPHORIA = 'DYSPHORIA',
  HYPERVIGILANCE = 'HYPERVIGILANCE',
  AMNESIA = 'AMNESIA',
  SYNESTHESIA = 'SYNESTHESIA',
  HSP = 'HSP',
  INSOMNIA = 'INSOMNIA',
  CHRONIC_PAIN = 'CHRONIC_PAIN',
  KLEPTOMANIA = 'KLEPTOMANIA',
  PYROMANIA = 'PYROMANIA',
  ONIOMANIA = 'ONIOMANIA',
  HYPER_HYPO_SEXUALITY = 'HYPER_HYPO_SEXUALITY',
  TRICHOTILLOMANIA = 'TRICHOTILLOMANIA',
  ANGER_DISORDER = 'ANGER_DISORDER',
  DID = 'DID',
  OSDD = 'OSDD',
  P_DID = 'P_DID',
  DPDR = 'DPDR',
  TOURETTES = 'TOURETTES',
  TIC_DISORDER = 'TIC_DISORDER',
  DYSLEXIA = 'DYSLEXIA',
  DYSPRAXIA = 'DYSPRAXIA',
  DYSCALCULIA = 'DYSCALCULIA',
  SLEEP_DISORDER = 'SLEEP_DISORDER',
  PHOBIA = 'PHOBIA',
  PANIC_DISORDER = 'PANIC_DISORDER',
  AGORAPHOBIA = 'AGORAPHOBIA',
  SOCIAL_ANXIETY = 'SOCIAL_ANXIETY',
  SELECTIVE_MUTISM = 'SELECTIVE_MUTISM',
  SPD = 'SPD',
  MISOPHONIA = 'MISOPHONIA',
  NARCOLEPSY = 'NARCOLEPSY',
  SLEEP_PARALYSIS = 'SLEEP_PARALYSIS',
  CFS = 'CFS',
}

export type Trait = PersonalityTrait | Disorder;

export enum ShapeType {
  BUTTERFLY = 'BUTTERFLY',
  PUZZLE = 'PUZZLE',
  INFINITY = 'INFINITY',
  KEY = 'KEY',
  LOCK = 'LOCK',
  LINK = 'LINK',
  LINK_2 = 'LINK_2',
  EYE = 'EYE',
  SHIELD = 'SHIELD',
  GHOST = 'GHOST',
  TREE = 'TREE',
  MASK = 'MASK',
  ANCHOR = 'ANCHOR',
  COMPASS = 'COMPASS',
  FEATHER = 'FEATHER',
  MOON = 'MOON',
  SUN = 'SUN',
  CLOUD = 'CLOUD',
  LIGHTNING = 'LIGHTNING',
  MOUNTAIN = 'MOUNTAIN',
  WAVES = 'WAVES',
  BOOK = 'BOOK',
  HOURGLASS = 'HOURGLASS',
  RIBBON = 'RIBBON',
  AMPERSAND = 'AMPERSAND',
  SEMICOLON = 'SEMICOLON',
  BIPOLAR = 'BIPOLAR',
  MUTE = 'MUTE',
  EYE_OPEN = 'EYE_OPEN',
  UTENSILS = 'UTENSILS',
  BRAIN = 'BRAIN',
  HEART = 'HEART',
  BROKEN_HEART = 'BROKEN_HEART',
  UMBRELLA = 'UMBRELLA',
  LOTUS = 'LOTUS',
  DOOR = 'DOOR',
  MIRROR = 'MIRROR',
  SPARKLES = 'SPARKLES',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  PASTEL = 'PASTEL',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER',
}

export enum PatternType {
  NONE = 'Aucun',
  STRIPES_H = 'Rayures Horizontales',
  STRIPES_V = 'Rayures Verticales',
  STRIPES_D = 'Rayures Diagonales',
  DOTS = 'Points',
  POLKA_DOTS = 'Pois',
  GRID = 'Grille',
  HONEYCOMB = 'Nid d\'Abeille',
  GRADIENT = 'Dégradé',
  TEXTURE = 'Grain',
  CHECKERBOARD = 'Damier',
  WAVES = 'Vagues',
  ZIGZAG = 'Zigzag',
  RINGS = 'Anneaux',
  TRIANGLES = 'Triangles',
  HEXAGONS = 'Hexagones',
  HEARTS = 'Cœurs',
  STARS = 'Étoiles',
  CLOUDS = 'Nuages',
  SPARKLES = 'Étincelles',
  LEAVES = 'Feuilles',
  PAW_PRINTS = 'Pattes',
  MUSIC_NOTES = 'Notes de Musique',
  CROSSES = 'Croix',
  DIAMONDS = 'Diamants',
  SPIRALS = 'Spirales',
  FLOWERS = 'Fleurs',
}

export interface PatternLayer {
  id: string;
  type: PatternType;
  color: string;
  size: number;
  opacity: number;
  target: 'global' | 'sexuality' | 'gender' | AlterRole;
}

export interface TraitDecoration {
  trait: Trait;
  color: string;
  size: number;
  x: number;
  y: number;
  opacity: number;
}

export interface Decoration {
  id: string;
  type: ShapeType;
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export interface RoleConfig {
  color: string;
  description: string;
}

export const ROLE_CONFIGS: Record<AlterRole, RoleConfig> = {
  [AlterRole.HOST]: { color: '#4ADE80', description: 'Gère la vie quotidienne' },
  [AlterRole.CO_HOST]: { color: '#86EFAC', description: 'Aide le host' },
  [AlterRole.PROTECTOR]: { color: '#3B82F6', description: 'Protège le système' },
  [AlterRole.PROTECTOR_PHYSICAL]: { color: '#2563EB', description: 'Protège physiquement le corps' },
  [AlterRole.PROTECTOR_EMOTIONAL]: { color: '#60A5FA', description: 'Protège le système des émotions fortes' },
  [AlterRole.INTERNAL_SELF_HELPER]: { color: '#60A5FA', description: 'Connaissance interne du système' },
  [AlterRole.CAREGIVER]: { color: '#F472B6', description: 'Prend soin des autres alters' },
  [AlterRole.PERSECUTOR]: { color: '#EF4444', description: 'Agit de manière nuisible par protection mal comprise' },
  [AlterRole.PROSECUTOR]: { color: '#B91C1C', description: 'Cherche la justice ou punit les "erreurs"' },
  [AlterRole.AVENGER]: { color: '#7F1D1D', description: 'Cherche à venger les traumatismes passés' },
  [AlterRole.LITTLE]: { color: '#FBBF24', description: 'Alter enfant (0-6 ans)' },
  [AlterRole.MIDDLE]: { color: '#F59E0B', description: 'Alter enfant/pré-ado (7-12 ans)' },
  [AlterRole.TEEN]: { color: '#D97706', description: 'Alter adolescent' },
  [AlterRole.GATEKEEPER]: { color: '#8B5CF6', description: 'Contrôle les switches et l\'accès aux souvenirs' },
  [AlterRole.MEMORY_HOLDER]: { color: '#A78BFA', description: 'Garde des souvenirs spécifiques' },
  [AlterRole.TRAUMA_HOLDER]: { color: '#4B5563', description: 'Porte le poids des traumatismes' },
  [AlterRole.SYMPTOM_HOLDER]: { color: '#374151', description: 'Porte les symptômes physiques ou psychiques' },
  [AlterRole.INTROJECT]: { color: '#EC4899', description: 'Alter basé sur une personne externe' },
  [AlterRole.FICTIVE]: { color: '#D946EF', description: 'Introject basé sur un personnage de fiction' },
  [AlterRole.FACTIVE]: { color: '#A855F7', description: 'Introject basé sur une personne réelle' },
  [AlterRole.SEXUAL_ALTER]: { color: '#BE185D', description: 'Gère la sexualité ou les traumatismes sexuels' },
  [AlterRole.MANAGER]: { color: '#0D9488', description: 'Organise et gère les tâches du système' },
  [AlterRole.OBSERVER]: { color: '#64748B', description: 'Observe sans forcément interagir' },
  [AlterRole.SHELL]: { color: '#E2E8F0', description: 'Système programmé' },
  [AlterRole.SUBSYSTEM]: { color: '#1E293B', description: 'Système à l\'intérieur d\'un alter' },
  [AlterRole.ANP]: { color: '#10B981', description: 'Partie Apparemment Normale' },
  [AlterRole.EP]: { color: '#F43F5E', description: 'Partie Emotionnelle' },
  [AlterRole.FRAGMENT]: { color: '#9CA3AF', description: 'Alter non-développé avec une fonction unique' },
  [AlterRole.NON_HUMAN]: { color: '#10B981', description: 'Animal, créature, robot, etc.' },
  [AlterRole.SOOTHER]: { color: '#FDA4AF', description: 'Calme les détresses émotionnelles' },
  [AlterRole.DYSFUNCTIONAL_PROTECTOR]: { color: '#6366F1', description: 'Protège de manière inadaptée ou nuisible' },
  [AlterRole.SABOTEUR]: { color: '#991B1B', description: 'Entrave le fonctionnement par peur ou colère' },
  [AlterRole.MEDIATOR]: { color: '#14B8A6', description: 'Résout les conflits internes' },
  [AlterRole.ARCHIVIST]: { color: '#78350F', description: 'Garde les archives et l\'histoire du système' },
  [AlterRole.AGE_SLIDER]: { color: '#F59E0B', description: 'Alter dont l\'âge varie' },
  [AlterRole.SOCIAL]: { color: '#EC4899', description: 'Gère les relations sociales' },
  [AlterRole.OPPOSITE_GENDER]: { color: '#6366F1', description: 'Alter de genre opposé au corps' },
  [AlterRole.ABUSER]: { color: '#7C2020', description: 'Reproduit des comportements abusifs internalisés lors du traumatisme' },
};

export enum Sexuality {
  HETEROSEXUAL = 'Hétérosexuel',
  HOMOSEXUAL = 'Homosexuel',
  LESBIAN = 'Lesbienne',
  GAY = 'Gay',
  BISEXUAL = 'Bisexuel',
  PANSEXUAL = 'Pansexuel',
  ASEXUAL = 'Asexuel',
  AROMANTIC = 'Aromantique',
  QUEER = 'Queer',
  POLYSEXUAL = 'Polysexuel',
  DEMISEXUAL = 'Demisexuel',
  GRAYSEXUAL = 'Gris-sexuel',
  OMNISEXUAL = 'Omnisexuel',
  ABROSEXUAL = 'Abrosexuel',
  ANDROSEXUAL = 'Androsexuel',
  GYNOSEXUAL = 'Gynosexuel',
  CETEROSEXUAL = 'Ceterosexuel',
  CUPIOSEXUAL = 'Cupiosexuel',
  LITHOSEXUAL = 'Lithosexuel',
  RECIPROSEXUAL = 'Reciprosexuel',
  FRAYSEXUAL = 'Fraysexuel',
  AUTOSEXUAL = 'Autosexuel',
  POMOSEXUAL = 'Pomosexuel',
  SAPIOSEXUAL = 'Sapiosexuel',
  URANIC = 'Uranic',
  NEPTUNIC = 'Neptunic',
  FINSEXUAL = 'Finsexuel',
  MINSEXUAL = 'Minsexuel',
  NINSEXUAL = 'Ninsexuel',
  TORIC = 'Toric',
  TRIXIC = 'Trixic',
  ACHILLEAN = 'Achilléen',
  SAPPHIC = 'Saphique',
  DIAMORIC = 'Diamoric',
  SKOLIOSEXUAL = 'Skoliosexuel',
  ALLOSEXUAL = 'Allosexuel',
  POLYAMOROUS = 'Polyamoureux',
  MONOGAMOUS = 'Monogame',
  QUEERPLATONIC = 'Queerplatonique',
  PANROMANTIC = 'Panromantique',
  BIROMANTIC = 'Biromantique',
  HOMOROMANTIC = 'Homoromantique',
  HETEROROMANTIC = 'Hétéroromantique',
  OMNIROMANTIC = 'Omniromantique',
  POLYROMANTIC = 'Polyromantique',
  DEMIROMANTIC = 'Demiromantique',
  GRAYROMANTIC = 'Gris-romantique',
  LITHOROMANTIC = 'Lithoromantique',
  RECIPROROMANTIC = 'Reciproromantique',
  FRAYROMANTIC = 'Frayromantique',
  CUPIOROMANTIC = 'Cupioromantique',
  AROACE = 'AroAce',
  ORIENTED_AROACE = 'AroAce Orienté',
  ANGLED_AROACE = 'AroAce Anglé',
  QUESTIONING = 'En questionnement',
  OTHER = 'Autre',
}

export const SEXUALITY_CATEGORIES = {
  MONOSEXUAL: [Sexuality.HETEROSEXUAL, Sexuality.HOMOSEXUAL, Sexuality.LESBIAN, Sexuality.GAY],
  PLURISEXUAL: [Sexuality.BISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.OMNISEXUAL, Sexuality.ABROSEXUAL],
  ACE_ARO_SPEC: [Sexuality.ASEXUAL, Sexuality.AROMANTIC, Sexuality.DEMISEXUAL, Sexuality.GRAYSEXUAL, Sexuality.CUPIOSEXUAL, Sexuality.LITHOSEXUAL, Sexuality.RECIPROSEXUAL, Sexuality.FRAYSEXUAL, Sexuality.AROACE, Sexuality.ORIENTED_AROACE, Sexuality.ANGLED_AROACE, Sexuality.DEMIROMANTIC, Sexuality.GRAYROMANTIC, Sexuality.CUPIOROMANTIC, Sexuality.LITHOROMANTIC, Sexuality.RECIPROROMANTIC, Sexuality.FRAYROMANTIC],
  ATTRACTION_TYPE: [Sexuality.ANDROSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.CETEROSEXUAL, Sexuality.SAPIOSEXUAL, Sexuality.FINSEXUAL, Sexuality.MINSEXUAL, Sexuality.NINSEXUAL, Sexuality.SKOLIOSEXUAL, Sexuality.PANROMANTIC, Sexuality.BIROMANTIC, Sexuality.HOMOROMANTIC, Sexuality.HETEROROMANTIC, Sexuality.OMNIROMANTIC, Sexuality.POLYROMANTIC],
  IDENTITY_SPEC: [Sexuality.ACHILLEAN, Sexuality.SAPPHIC, Sexuality.TORIC, Sexuality.TRIXIC, Sexuality.DIAMORIC, Sexuality.ALLOSEXUAL],
  RELATIONSHIP_SPEC: [Sexuality.POLYAMOROUS, Sexuality.MONOGAMOUS, Sexuality.QUEERPLATONIC],
  OTHER_SPEC: [Sexuality.QUEER, Sexuality.URANIC, Sexuality.NEPTUNIC, Sexuality.POMOSEXUAL, Sexuality.AUTOSEXUAL, Sexuality.QUESTIONING, Sexuality.OTHER],
};

export const SEXUALITY_COLORS: Record<Sexuality, string> = {
  [Sexuality.HETEROSEXUAL]: '#FFFFFF',
  [Sexuality.HOMOSEXUAL]: '#FF0000',
  [Sexuality.LESBIAN]: '#D62900',
  [Sexuality.GAY]: '#078D70',
  [Sexuality.BISEXUAL]: '#D60270',
  [Sexuality.PANSEXUAL]: '#FF218C',
  [Sexuality.ASEXUAL]: '#800080',
  [Sexuality.AROMANTIC]: '#3DA542',
  [Sexuality.QUEER]: '#AF59CF',
  [Sexuality.POLYSEXUAL]: '#F714BA',
  [Sexuality.DEMISEXUAL]: '#6E0070',
  [Sexuality.GRAYSEXUAL]: '#808080',
  [Sexuality.OMNISEXUAL]: '#FE54E2',
  [Sexuality.ABROSEXUAL]: '#7AC1AD',
  [Sexuality.ANDROSEXUAL]: '#0000FF',
  [Sexuality.GYNOSEXUAL]: '#FF69B4',
  [Sexuality.CETEROSEXUAL]: '#FFD700',
  [Sexuality.CUPIOSEXUAL]: '#FFC0CB',
  [Sexuality.LITHOSEXUAL]: '#A52A2A',
  [Sexuality.RECIPROSEXUAL]: '#90EE90',
  [Sexuality.FRAYSEXUAL]: '#ADD8E6',
  [Sexuality.AUTOSEXUAL]: '#000000',
  [Sexuality.POMOSEXUAL]: '#808080',
  [Sexuality.SAPIOSEXUAL]: '#4B0082',
  [Sexuality.URANIC]: '#7DF9FF',
  [Sexuality.NEPTUNIC]: '#4D4DFF',
  [Sexuality.FINSEXUAL]: '#FF69B4',
  [Sexuality.MINSEXUAL]: '#3B82F6',
  [Sexuality.NINSEXUAL]: '#8B5CF6',
  [Sexuality.TORIC]: '#7DF9FF',
  [Sexuality.TRIXIC]: '#FF218C',
  [Sexuality.ACHILLEAN]: '#3B82F6',
  [Sexuality.SAPPHIC]: '#EC4899',
  [Sexuality.DIAMORIC]: '#FBBF24',
  [Sexuality.SKOLIOSEXUAL]: '#F59E0B',
  [Sexuality.ALLOSEXUAL]: '#FFFFFF',
  [Sexuality.POLYAMOROUS]: '#EF4444',
  [Sexuality.MONOGAMOUS]: '#3B82F6',
  [Sexuality.QUEERPLATONIC]: '#FBBF24',
  [Sexuality.PANROMANTIC]: '#FF218C',
  [Sexuality.BIROMANTIC]: '#D60270',
  [Sexuality.HOMOROMANTIC]: '#FF0000',
  [Sexuality.HETEROROMANTIC]: '#FFFFFF',
  [Sexuality.OMNIROMANTIC]: '#FE54E2',
  [Sexuality.POLYROMANTIC]: '#F714BA',
  [Sexuality.DEMIROMANTIC]: '#6E0070',
  [Sexuality.GRAYROMANTIC]: '#808080',
  [Sexuality.LITHOROMANTIC]: '#A52A2A',
  [Sexuality.RECIPROROMANTIC]: '#90EE90',
  [Sexuality.FRAYROMANTIC]: '#ADD8E6',
  [Sexuality.CUPIOROMANTIC]: '#FFC0CB',
  [Sexuality.AROACE]: '#AF59CF',
  [Sexuality.ORIENTED_AROACE]: '#800080',
  [Sexuality.ANGLED_AROACE]: '#AF59CF',
  [Sexuality.QUESTIONING]: '#6B7280',
  [Sexuality.OTHER]: '#4B5563',
};

export const GENDER_COLORS: Record<Gender, string> = {
  [Gender.MALE]: '#3B82F6',
  [Gender.FEMALE]: '#EC4899',
  [Gender.NON_BINARY]: '#FBBF24',
  [Gender.ENBY]: '#F59E0B',
  [Gender.GENDERQUEER]: '#8B5CF6',
  [Gender.AGENDER]: '#000000',
  [Gender.NEUTROIS]: '#FFFFFF',
  [Gender.XENOGENDER]: '#10B981',
  [Gender.GENDERFLUID]: '#A855F7',
  [Gender.GENDERFLUX]: '#D946EF',
  [Gender.BIGENDER]: '#F472B6',
  [Gender.TRIGENDER]: '#60A5FA',
  [Gender.POLYGENDER]: '#4ADE80',
  [Gender.PANGENDER]: '#FFD700',
  [Gender.DEMIBOY]: '#7FB3D5',
  [Gender.DEMIGIRL]: '#F1948A',
  [Gender.GENDER_NON_CONFORMING]: '#8B5CF6',
  [Gender.INTERGENDER]: '#FBBF24',
  [Gender.LIBREGENDER]: '#FFFFFF',
  [Gender.CASSGENDER]: '#808080',
  [Gender.MAVERIQUE]: '#FF6321',
  [Gender.APORAGENDER]: '#4ADE80',
  [Gender.MULTIGENDER]: '#A855F7',
  [Gender.NOVIGENDER]: '#60A5FA',
  [Gender.ALIAGENDER]: '#EC4899',
  [Gender.GENDERVOID]: '#000000',
  [Gender.GREYGENDER]: '#808080',
  [Gender.AGENDERFLUX]: '#ADD8E6',
  [Gender.FLUIDFLUX]: '#7AC1AD',
  [Gender.TRANSMASCULINE]: '#3B82F6',
  [Gender.TRANSFEMININE]: '#EC4899',
  [Gender.ANDROGYNE]: '#8B5CF6',
  [Gender.GENDER_VARIANT]: '#F59E0B',
  [Gender.GENDER_EXPANSIVE]: '#FBBF24',
  [Gender.NEUTRAL]: '#9CA3AF',
  [Gender.QUESTIONING]: '#6B7280',
  [Gender.OTHER]: '#4B5563',
};

export interface Subsystem {
  id: string;
  name: string;
  parentId?: string; // hierarchical subsystem tree
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface SavedAlter {
  id: string;
  alterName: string;
  selectedRoles: AlterRole[];
  selectedGenders: Gender[];
  selectedSexualities: Sexuality[];
  traitDecorations: TraitDecoration[];
  patternLayers: PatternLayer[];
  decorations: Decoration[];
  customRoleColors: Record<string, string>;
  customGenderColors: Record<string, string>;
  customSexualityColors: Record<string, string>;
  theme: Theme;
  profileImage: string;
  description: string;
  internalNotes: string;
  subsystemId?: string;
  frontStatus?: string;
  pkId?: string;
  alterAge?: string;
  alterColor?: string;
  triggersPositive?: string;
  triggersNegative?: string;
  alterLanguages?: string;
  alterOriginWorld?: string;
  customFields?: CustomField[];
  archived?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // List of alterIds (or "external") who voted for this option
}

export interface PollData {
  question: string;
  options: PollOption[];
  expiresAt: number; // timestamp
  durationMinutes: number; // duration in minutes selected
}

export interface ChatMessage {
  id: string;
  senderAlterId: string; // linked SavedAlter ID, or "external" for others
  text: string;
  timestamp: number;
  poll?: PollData;
}

export interface SwitchLog {
  id: string;
  alterIds: string[]; // support co-fronting
  timestamp: number;
  endTimestamp?: number;
  notes?: string;
  status?: string; // the presence or front status associated with the switch
  spoons?: number; // Spoon Theory — énergie disponible au moment du switch (0-12)
  moods?: string[]; // États d'humeur sélectionnés au moment du switch
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  images: string[]; // array of base64 data URLs
  authorAlterIds?: string[]; // optionally linked alters
}
