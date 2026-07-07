import { useState } from 'react';
import {
  Shield, Info, Mail, ChevronLeft, ChevronDown, Heart, Lock, Database, Eye, Users,
  BookOpen, Search, UserCircle2, Layers, GitBranch, Tag, Radio, History, NotebookPen,
  MessageCircle, MessageSquare, LifeBuoy, PhoneCall, Download, Link2, Palette,
  LayoutDashboard, Globe, Smartphone,
} from 'lucide-react';

export type LegalPage = 'privacy' | 'about' | 'contact' | 'guide';

interface LegalPagesProps {
  initialPage?: LegalPage;
  onBack?: () => void;
  lang: 'fr' | 'en';
}

export default function LegalPages({ initialPage = 'privacy', onBack, lang }: LegalPagesProps) {
  const [currentPage, setCurrentPage] = useState<LegalPage>(initialPage);

  const t = {
    fr: {
      privacy: 'Confidentialité',
      about: 'À propos',
      contact: 'Contact',
      guide: 'Guide',
      back: 'Retour',
      lastUpdate: 'Dernière mise à jour : juillet 2026',
      ownData: "Tes données t'appartiennent.",
      breif: 'En bref :',
      breifText: 'Haven Space ne collecte, ne stocke et ne transmet aucune donnée personnelle. Tout reste sur ton appareil, dans ton navigateur. Ni serveur, ni base de données, ni compte utilisateur.',
      storedTitle: 'Données stockées',
      storedText1: 'Haven Space utilise exclusivement le localStorage de ton navigateur pour sauvegarder tes fiches d\'alters, ton journal, ton historique de switchs et tes conversations. Ces données ne quittent jamais ton appareil.',
      storedText2: 'Aucune donnée n\'est envoyée à un serveur externe. L\'équipe Haven Space n\'a techniquement aucun accès à ce que tu crées dans l\'application.',
      whatWeDontTitle: 'Ce que nous ne faisons pas',
      noCollect: '✗ Pas de collecte de données',
      noTrack: '✗ Pas de cookies de tracking',
      noAccount: '✗ Pas de compte obligatoire',
      noAnalytics: '✗ Pas d\'analytics',
      noAds: '✗ Pas de publicités',
      noShare: '✗ Pas de partage avec des tiers',
      deleteTitle: 'Suppression de tes données',
      deleteText: 'Tu peux supprimer toutes tes données à tout moment en vidant le localStorage de ton navigateur (Paramètres du navigateur → Données du site → Haven Space), ou en désinstallant l\'application de ton appareil.',
      contactText: 'Pour toute question concernant cette politique de confidentialité :',
      footerNote: 'Haven Space — Fait avec soin pour la communauté plurielle',
      
      aboutTitle: 'Un espace pour chaque voix.',
      aboutSubtitle: 'Haven Space — Outil de gestion de système pluriel',
      aboutLastUpdate: 'Dernière mise à jour : juillet 2026',
      missionTitle: 'Notre mission',
      missionText1: 'Haven Space est un outil conçu pour et par la communauté plurielle (TDI/OSDD et systèmes pluriels). Il offre un espace safe et privé pour documenter, comprendre et célébrer chaque membre d\'un système — sans jugement, à son propre rythme.',
      missionText2: 'L\'application permet de créer des fiches détaillées pour chaque alter, de cartographier les relations entre eux, de tenir un journal, de suivre les switchs (avec humeurs et cuillères), de discuter en interne et de gérer les moments difficiles grâce à des outils d\'ancrage — le tout sans jamais quitter ton appareil.',
      missionText3: 'Haven Space grandit avec les besoins réels de ses utilisateurices : chaque fonctionnalité est née d\'un vrai vécu, pas d\'une liste de cases à cocher.',
      valuesTitle: 'Nos valeurs',
      valPrivacy: 'Confidentialité totale',
      valPrivacyDesc: 'Tes données restent sur ton appareil. Point.',
      valBenevolence: 'Bienveillance',
      valBenevolenceDesc: 'Un espace safe, sans jugement, pour tous les systèmes.',
      valCommunity: 'Communauté',
      valCommunityDesc: 'Créé avec et pour les personnes plurielles — chaque retour façonne l\'outil.',
      valAccessibility: 'Accessibilité',
      valAccessibilityDesc: 'Gratuit, sans compte, installable partout. Synchronisation moderne sans compte par fichier JSON ou directement avec ton profil PluralKit.',
      featuresTitle: 'Fonctionnalités',
      fA: '✦ Fiches d\'alters détaillées',
      fB: '✦ Sous-systèmes',
      fC: '✦ Cartographie des relations',
      fD: '✦ Journal interne',
      fE: '✦ Registre des switchs',
      fF: '✦ Humeurs & cuillères',
      fG: '✦ Chat interne',
      fH: '✦ Messagerie privée',
      fI: '✦ Ancrage / Mode SOS',
      fJ: '✦ Contacts de confiance',
      fK: '✦ Export PNG',
      fL: '✦ Synchronisation PluralKit',
      fM: '✦ Thèmes & personnalisation',
      fN: '✦ Multilingue FR/EN',
      fO: '✦ Installable PWA / Mobile',
      openSourceTitle: 'Transparence',
      openSourceText: 'Cette application a été réalisée par une personne plurielle, avec l\'aide de l\'IA pour le codage. Elle est open source, gratuite et disponible librement pour la communauté — et continue d\'évoluer au fil des besoins.',

      contactHeadline: 'On est là.',
      contactSubtitle: 'Une question, un bug, une suggestion ? Écris-nous.',
      writeUsTitle: 'Nous contacter',
      writeUsText: 'Haven Space est maintenu par une équipe passionnée et bénévole. On fait de notre mieux pour répondre dans les meilleurs délais.',
      whyContactTitle: 'Pour quoi nous écrire',
      wcBug: '🐛 Signaler un bug',
      wcSuggest: '💡 Suggérer une fonctionnalité',
      wcPrivacy: '🔒 Question sur la confidentialité',
      wcReturn: '💬 Retour général',
      wcContrib: '🤝 Contribuer au projet',
      contactNote: 'Note : Haven Space ne stocke aucune donnée personnelle. Si tu rencontres un problème, n\'inclus jamais d\'informations sensibles sur ton système dans tes messages.',
      clickToCopy: 'Cliquer pour copier',
      copied: '✓ Copié !',

      guideHeadline: 'Comment ça marche.',
      guideSubtitle: 'Le guide complet de Haven Space, fonctionnalité par fonctionnalité',
      guideSearchPlaceholder: 'Rechercher une fonctionnalité...',
      guideNoResults: 'Aucun résultat pour cette recherche.',
      g1Title: 'Fiches d\'alters',
      g1Text: 'Le cœur de l\'application. Chaque alter a sa propre fiche : rôles, genres, orientations, âge, couleur associée (avec son nom automatiquement deviné), triggers positifs et négatifs, langues, source, traits de personnalité, troubles/neurodivergences, description libre, notes internes privées, et champs personnalisés pour ajouter tout ce qui ne rentre nulle part ailleurs. Une fois enregistrée, la fiche apparaît dans « Mon système », où tu peux la charger pour l\'éditer, l\'archiver ou la supprimer.',
      g2Title: 'Sous-systèmes',
      g2Text: 'Regroupe tes alters en dossiers (par exemple par âge, par fonction, ou par petit groupe interne). Les sous-systèmes peuvent être imbriqués les uns dans les autres. En cas de suppression, tu choisis fiche par fiche où chacune doit aller (système principal ou un autre sous-système), avec possibilité de tout sélectionner d\'un coup — ou de tout supprimer d\'un bloc si tu préfères repartir de zéro.',
      g3Title: 'Cartographie des relations',
      g3Text: 'Visualise les liens entre tes alters sous forme de carte : partenaires, protecteur/protégé, fratrie, parent/enfant, ami·e, soignant, indifférence, tension, conflit, persécuteur, ou distance. Chaque relation ajoutée apparaît aussi automatiquement en bas de la fiche complète des deux alters concernés, mise à jour en temps réel.',
      g4Title: 'Tags personnalisés',
      g4Text: 'En plus des rôles fixes, ajoute tes propres mots-clés libres à une fiche (dans « Informations de l\'alter »). Un filtre dédié apparaît alors dans « Mon système », à côté du filtre par rôle, pour retrouver rapidement tous les alters partageant un même tag.',
      g5Title: 'Statut de front / présence',
      g5Text: 'Indique qui est actuellement au front : fronteur principal, co-front, co-conscient, influence passive, en sommeil, ou interne. Il existe aussi un statut « Flou / Blend » à part, accessible via un bouton dédié dans le registre des switchs, pour les moments où l\'identité n\'est pas claire — il n\'est pas rattaché à un alter précis et s\'affiche comme un indicateur global sur le tableau de bord.',
      g6Title: 'Registre des switchs',
      g6Text: 'Enregistre chaque switch avec la date (y compris rétroactive), les alters concernés, leur statut, des notes, ton niveau d\'énergie (cuillères) et ton humeur. L\'historique complet est consultable et chaque entrée peut être supprimée si besoin.',
      g7Title: 'Journal interne',
      g7Text: 'Un espace d\'écriture libre pour consigner ce que traverse le système au fil du temps — pensées, ressentis, événements marquants — consultable à tout moment.',
      g8Title: 'Chat interne',
      g8Text: 'Un espace de discussion de groupe entre tous les membres du système, pratique pour les échanges collectifs, les votes internes ou simplement garder une trace de « qui a dit quoi ».',
      g9Title: 'Messagerie privée',
      g9Text: 'Des conversations en tête-à-tête entre deux alters précis, séparées du chat de groupe. Une recherche dédiée permet de retrouver rapidement une conversation existante ou d\'en démarrer une nouvelle en choisissant les deux alters concernés.',
      g10Title: 'Ancrage / Mode SOS',
      g10Text: 'Des techniques d\'ancrage classées par catégorie (se déplacer, bouger, parler, ressentir...) pour les moments de dissociation ou de détresse émotionnelle. Une section « Contacts de confiance » permet aussi d\'enregistrer les numéros de personnes ou professionnels à contacter en cas de besoin, directement modifiables et supprimables.',
      g11Title: 'Export des fiches en image',
      g11Text: 'Télécharge la fiche d\'un alter sous forme d\'image PNG prête à partager, avec toutes ses informations mises en forme proprement.',
      g12Title: 'Synchronisation PluralKit',
      g12Text: 'Relie Haven Space à ton système PluralKit pour importer automatiquement tes alters existants, ou exporte/importe tes données via un simple fichier JSON — aucun compte n\'est nécessaire pour cette synchronisation.',
      g13Title: 'Thèmes et personnalisation',
      g13Text: 'Choisis parmi plusieurs thèmes prédéfinis (clair, sombre, pastel, saisons, arcane...), ou crée ton propre thème personnalisé dans les paramètres en choisissant toi-même la couleur d\'accent, de fond, des cartes, du texte et des bordures. Un bouton « Réinitialiser » permet de revenir au thème actif à tout moment.',
      g14Title: 'Tableau de bord',
      g14Text: 'La page d\'accueil résume l\'essentiel : nombre d\'alters, accès rapide à chaque section, et un aperçu de qui est actuellement au front, groupé par statut. Un simple clic permet de retirer quelqu\'un du front directement depuis cette vue.',
      g15Title: 'Langue',
      g15Text: 'Haven Space est disponible en français et en anglais, avec un changement de langue instantané depuis les paramètres.',
      g16Title: 'Installation mobile et hors-ligne',
      g16Text: 'Haven Space est une application web installable (PWA) : ajoute-la à ton écran d\'accueil comme une vraie application, et utilise-la même sans connexion internet.',
      g17Title: 'Confidentialité de tes données',
      g17Text: 'Tout ce que tu crées reste exclusivement sur ton appareil, dans ton navigateur. Rien n\'est envoyé à un serveur externe. Voir la page Confidentialité pour tous les détails.',
    },
    en: {
      privacy: 'Privacy Policy',
      about: 'About Us',
      contact: 'Contact',
      guide: 'Guide',
      back: 'Back',
      lastUpdate: 'Last updated: July 2026',
      ownData: 'Your data belongs to you.',
      breif: 'In short:',
      breifText: 'Haven Space does not collect, store, or transmit any of your personal data. Everything remains on your device, in your browser storage. No server, no database, no forced accounts.',
      storedTitle: 'Stored Data',
      storedText1: 'Haven Space runs completely on client-side storage, using your browser\'s local storage to save alter profiles, journal logs, switch history, and internal conversations. This data never leaves your computer or phone.',
      storedText2: 'No external APIs or backup servers scrape this data. The Haven Space team has absolutely zero technical access to what you create inside.',
      whatWeDontTitle: 'What We Do Not Do',
      noCollect: '✗ No data harvesting',
      noTrack: '✗ No tracking cookies',
      noAccount: '✗ No login required',
      noAnalytics: '✗ No user analytics',
      noAds: '✗ No advertisements',
      noShare: '✗ No third-party sharing',
      deleteTitle: 'Deleting Your Files',
      deleteText: 'You can wipe your database instantly by clearing your browser site cache (Browser Settings → Site Data → Haven Space), or by uninstalling the application form your local device.',
      contactText: 'If you have any questions or feedback regarding this privacy policy:',
      footerNote: 'Haven Space — Built with care for the pluriverse',

      aboutTitle: 'A space for every voice.',
      aboutSubtitle: 'Haven Space — Plural System Management Tool',
      aboutLastUpdate: 'Last updated: July 2026',
      missionTitle: 'Our Mission',
      missionText1: 'Haven Space is designed specifically for and with the plural community (DID, OSDD, and other forms of multiplicity). It provides a quiet, offline-safe haven to map out, understand, and honor every member of your system — without judgment, at your own pace.',
      missionText2: 'Draft deep alter profiles, map the relationships between members, keep a daily internal journal, log switches (with mood and spoon tracking), chat internally, and reach for grounding tools during hard moments — all privately on your device.',
      missionText3: 'Haven Space grows alongside the real needs of the people using it: every feature comes from lived experience, not a checklist.',
      valuesTitle: 'Our Beliefs',
      valPrivacy: 'Ultimate Privacy',
      valPrivacyDesc: 'Your personal records stay in your hands. Period.',
      valBenevolence: 'Warm Safehaven',
      valBenevolenceDesc: 'Unconditional kindness and design safety for all system configurations.',
      valCommunity: 'Community Native',
      valCommunityDesc: 'Envisioned for and guided by plural voices — every bit of feedback shapes the tool.',
      valAccessibility: '100% Free',
      valAccessibilityDesc: 'Fully operational offline, no payments, no barrier entry. Seamless accountless synchronization via JSON files or direct PluralKit system integration.',
      featuresTitle: 'System Features',
      fA: '✦ Detailed Alter Profiles',
      fB: '✦ Subsystems',
      fC: '✦ Relationship Mapping',
      fD: '✦ Internal Journal',
      fE: '✦ Switch Logging',
      fF: '✦ Mood & Spoon Tracking',
      fG: '✦ Internal Group Chat',
      fH: '✦ Private Messaging',
      fI: '✦ Grounding / SOS Mode',
      fJ: '✦ Trusted Contacts',
      fK: '✦ PNG Export',
      fL: '✦ PluralKit Sync',
      fM: '✦ Themes & Customization',
      fN: '✦ Multilingual EN/FR',
      fO: '✦ Installable PWA / Mobile',
      openSourceTitle: 'Transparency',
      openSourceText: 'This app was built by a plural person, with AI assistance for coding. It is open source, free, and freely available to the community — and keeps evolving alongside real needs.',

      contactHeadline: 'We are here.',
      contactSubtitle: 'Have a question, feedback, or a bug to report? Email us.',
      writeUsTitle: 'Reach Out',
      writeUsText: 'Haven Space is maintained by a small, caring volunteer team. We do our best to reply whenever our energy allows.',
      whyContactTitle: 'Reasons to Contact Us',
      wcBug: '🐛 Bug Reports',
      wcSuggest: '💡 Request Features',
      wcPrivacy: '🔒 Privacy Questions',
      wcReturn: '💬 Creative Feedback',
      wcContrib: '🤝 Collaborate with Us',
      contactNote: 'Note: Since Haven Space runs offline, do not submit sensitive system journals or private clinical profiles in emails.',
      clickToCopy: 'Click to copy',
      copied: '✓ Copied!',

      guideHeadline: 'How it works.',
      guideSubtitle: 'The complete Haven Space guide, feature by feature',
      guideSearchPlaceholder: 'Search a feature...',
      guideNoResults: 'No results for this search.',
      g1Title: 'Alter Profiles',
      g1Text: 'The heart of the app. Every alter has their own profile: roles, genders, orientations, age, an associated color (with its name automatically guessed), positive and negative triggers, languages, source, personality traits, disorders/neurodivergences, a free-form description, private internal notes, and custom fields for anything that doesn\'t fit elsewhere. Once saved, the profile appears in "My System," where you can load it to edit, archive, or delete it.',
      g2Title: 'Subsystems',
      g2Text: 'Group your alters into folders (by age, function, or small internal group, for example). Subsystems can be nested inside one another. When deleting one, you choose per profile where each one should go (main system or another subsystem), with an option to select them all at once — or delete everything in one go if you\'d rather start fresh.',
      g3Title: 'Relationship Mapping',
      g3Text: 'Visualize the links between your alters as a map: partners, protector/protected, siblings, parent/child, friend, caretaker, indifference, tension, conflict, persecutor, or distance. Every relationship you add also automatically appears at the bottom of both alters\' full profiles, updated in real time.',
      g4Title: 'Custom Tags',
      g4Text: 'Beyond the fixed roles, add your own free-form keywords to a profile (in "Alter Information"). A dedicated filter then appears in "My System," next to the role filter, to quickly find every alter sharing a given tag.',
      g5Title: 'Fronting Status',
      g5Text: 'Indicate who is currently fronting: primary fronter, co-front, co-conscious, passive influence, dormant, or internal. There\'s also a separate "Blur / Blend" status, accessible via a dedicated button in the switch log, for moments when identity isn\'t clear — it isn\'t tied to a specific alter and shows up as a global indicator on the dashboard.',
      g6Title: 'Switch Log',
      g6Text: 'Record every switch with the date (retroactive dates supported), the alters involved, their status, notes, your energy level (spoons), and your mood. The full history is browsable and any entry can be deleted if needed.',
      g7Title: 'Internal Journal',
      g7Text: 'A free-writing space to record what the system is going through over time — thoughts, feelings, notable events — readable anytime.',
      g8Title: 'Internal Chat',
      g8Text: 'A group chat space between all system members, handy for collective discussions, internal votes, or simply keeping track of "who said what."',
      g9Title: 'Private Messaging',
      g9Text: 'One-on-one conversations between two specific alters, separate from the group chat. A dedicated search lets you quickly find an existing conversation or start a new one by picking the two alters involved.',
      g10Title: 'Grounding / SOS Mode',
      g10Text: 'Grounding techniques sorted by category (moving, being active, talking, feeling...) for moments of dissociation or emotional distress. A "Trusted Contacts" section also lets you save numbers for people or professionals to reach out to when needed, directly editable and deletable.',
      g11Title: 'Export Profiles as Images',
      g11Text: 'Download an alter\'s profile as a ready-to-share PNG image, with all its information neatly formatted.',
      g12Title: 'PluralKit Sync',
      g12Text: 'Connect Haven Space to your PluralKit system to automatically import your existing alters, or export/import your data via a simple JSON file — no account is required for this sync.',
      g13Title: 'Themes & Customization',
      g13Text: 'Pick from several built-in themes (light, dark, pastel, seasons, arcane...), or build your own custom theme in settings by choosing your own accent, background, card, text, and border colors. A "Reset" button lets you go back to the active theme at any time.',
      g14Title: 'Dashboard',
      g14Text: 'The home page summarizes the essentials: alter count, quick access to every section, and an overview of who\'s currently fronting, grouped by status. A single click lets you remove someone from front directly from this view.',
      g15Title: 'Language',
      g15Text: 'Haven Space is available in French and English, with instant switching from settings.',
      g16Title: 'Mobile Install & Offline Use',
      g16Text: 'Haven Space is an installable web app (PWA): add it to your home screen like a real app, and use it even without an internet connection.',
      g17Title: 'Data Privacy',
      g17Text: 'Everything you create stays exclusively on your device, in your browser. Nothing is ever sent to an external server. See the Privacy page for full details.',
    }
  };

  const currentT = t[lang];

  const [copied, setCopied] = useState(false);
  const [guideSearch, setGuideSearch] = useState('');
  const [openGuideIds, setOpenGuideIds] = useState<string[]>([]);

  const toggleGuideItem = (id: string) => {
    setOpenGuideIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('systeme.chaos@outlook.fr');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full animate-fade-in duration-300">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-app-border/30 gap-4">
        {onBack && (
          <button 
            type="button" 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-app-card border border-app-border hover:border-app-accent/30 text-[10px] font-black uppercase tracking-widest text-app-text rounded-xl transition-all shadow-sm"
          >
            <ChevronLeft size={14} className="text-app-accent" />
            {currentT.back}
          </button>
        )}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['guide', 'privacy', 'about', 'contact'] as LegalPage[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCurrentPage(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                currentPage === tab 
                  ? 'bg-app-accent text-app-accent-text border border-transparent shadow-sm' 
                  : 'bg-app-card text-app-text border border-app-border hover:border-app-accent/25'
              }`}
            >
              {currentT[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Content router */}
      {currentPage === 'guide' && (() => {
        const guideItems = [
          { id: 'g1', icon: UserCircle2, title: currentT.g1Title, text: currentT.g1Text },
          { id: 'g2', icon: Layers, title: currentT.g2Title, text: currentT.g2Text },
          { id: 'g3', icon: GitBranch, title: currentT.g3Title, text: currentT.g3Text },
          { id: 'g4', icon: Tag, title: currentT.g4Title, text: currentT.g4Text },
          { id: 'g5', icon: Radio, title: currentT.g5Title, text: currentT.g5Text },
          { id: 'g6', icon: History, title: currentT.g6Title, text: currentT.g6Text },
          { id: 'g7', icon: NotebookPen, title: currentT.g7Title, text: currentT.g7Text },
          { id: 'g8', icon: MessageCircle, title: currentT.g8Title, text: currentT.g8Text },
          { id: 'g9', icon: MessageSquare, title: currentT.g9Title, text: currentT.g9Text },
          { id: 'g10', icon: LifeBuoy, title: currentT.g10Title, text: currentT.g10Text },
          { id: 'g11', icon: Download, title: currentT.g11Title, text: currentT.g11Text },
          { id: 'g12', icon: Link2, title: currentT.g12Title, text: currentT.g12Text },
          { id: 'g13', icon: Palette, title: currentT.g13Title, text: currentT.g13Text },
          { id: 'g14', icon: LayoutDashboard, title: currentT.g14Title, text: currentT.g14Text },
          { id: 'g15', icon: Globe, title: currentT.g15Title, text: currentT.g15Text },
          { id: 'g16', icon: Smartphone, title: currentT.g16Title, text: currentT.g16Text },
          { id: 'g17', icon: Lock, title: currentT.g17Title, text: currentT.g17Text },
        ];
        const query = guideSearch.trim().toLowerCase();
        const filteredItems = query
          ? guideItems.filter(it => it.title.toLowerCase().includes(query) || it.text.toLowerCase().includes(query))
          : guideItems;

        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
                <BookOpen size={14} className="text-app-accent" />
                {currentT.guide}
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{currentT.guideHeadline}</h1>
              <p className="text-xs text-app-muted font-bold uppercase tracking-widest">{currentT.guideSubtitle}</p>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={guideSearch}
                onChange={e => setGuideSearch(e.target.value)}
                placeholder={currentT.guideSearchPlaceholder}
                className="w-full bg-app-card border border-app-border rounded-2xl pl-11 pr-4 py-3 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/20 shadow-sm"
              />
            </div>

            {filteredItems.length === 0 ? (
              <p className="text-xs text-app-muted text-center py-8">{currentT.guideNoResults}</p>
            ) : (
              <div className="space-y-2.5">
                {filteredItems.map(item => {
                  const isOpen = openGuideIds.includes(item.id);
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="bg-app-card border border-app-border rounded-2xl overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleGuideItem(item.id)}
                        className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-app-accent/5 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-accent shrink-0">
                          <Icon size={16} />
                        </div>
                        <span className="flex-1 text-xs font-black uppercase tracking-wider text-app-text">{item.title}</span>
                        <ChevronDown size={16} className={`text-app-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pl-[4.25rem]">
                          <p className="text-xs leading-relaxed text-app-muted font-medium">{item.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {currentPage === 'privacy' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
              <Shield size={14} className="text-app-accent" />
              {currentT.privacy}
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{currentT.ownData}</h1>
            <p className="text-xs text-app-muted font-mono">{currentT.lastUpdate}</p>
          </div>

          <div className="border border-app-border bg-app-card/30 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-start">
            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-app-accent text-app-accent-text rounded-lg">
              {currentT.breif}
            </span>
            <p className="text-sm leading-relaxed text-app-text/95 font-medium">
              {currentT.breifText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-3 shadow-sm">
              <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Database size={15} className="text-app-accent" />
                <span>{currentT.storedTitle}</span>
              </div>
              <p className="text-xs leading-relaxed text-app-muted font-medium">
                {currentT.storedText1}
              </p>
              <p className="text-xs leading-relaxed text-app-muted font-medium">
                {currentT.storedText2}
              </p>
            </div>

            <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-3 shadow-sm">
              <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Lock size={15} className="text-app-accent" />
                <span>{currentT.deleteTitle}</span>
              </div>
              <p className="text-xs leading-relaxed text-app-muted font-medium">
                {currentT.deleteText}
              </p>
            </div>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-4 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Eye size={15} className="text-app-accent" />
              <span>{currentT.whatWeDontTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                currentT.noCollect,
                currentT.noTrack,
                currentT.noAccount,
                currentT.noAnalytics,
                currentT.noAds,
                currentT.noShare
              ].map(item => (
                <div key={item} className="p-2.5 bg-app-bg border border-app-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-app-text/80 text-center">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-4 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Mail size={15} className="text-app-accent" />
              <span>Contact</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">{currentT.contactText}</p>
            <div 
              onClick={handleCopy}
              className="flex items-center gap-3.5 p-4 border border-app-border/80 rounded-2xl hover:bg-app-accent/5 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-accent">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-app-muted">EMAIL</div>
                <div className="text-sm font-bold text-app-text select-all">systeme.chaos@outlook.fr</div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-app-muted ml-auto bg-app-bg px-2.5 py-1 rounded-lg">
                {copied ? currentT.copied : currentT.clickToCopy}
              </span>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'about' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
              <Info size={14} className="text-app-accent" />
              {currentT.about}
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{currentT.aboutTitle}</h1>
            <p className="text-xs text-app-muted font-bold uppercase tracking-widest">{currentT.aboutSubtitle}</p>
            <p className="text-xs text-app-muted font-mono">{currentT.aboutLastUpdate}</p>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-3 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Heart size={15} className="text-app-accent" />
              <span>{currentT.missionTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.missionText1}
            </p>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.missionText2}
            </p>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.missionText3}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Users size={15} className="text-app-accent" />
              <span>{currentT.valuesTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: currentT.valPrivacy, desc: currentT.valPrivacyDesc, icon: Lock },
                { title: currentT.valBenevolence, desc: currentT.valBenevolenceDesc, icon: Heart },
                { title: currentT.valCommunity, desc: currentT.valCommunityDesc, icon: Users },
                { title: currentT.valAccessibility, desc: currentT.valAccessibilityDesc, icon: Shield },
              ].map(({ title, desc, icon: Icon }) => (
                <div key={title} className="p-5 bg-app-card border border-app-border rounded-2xl flex gap-3.5 shadow-sm hover:border-app-accent/20 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-accent shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-app-text">{title}</h4>
                    <p className="text-[11px] leading-relaxed text-app-muted font-medium mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-4 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Info size={15} className="text-app-accent" />
              <span>{currentT.featuresTitle}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                currentT.fA,
                currentT.fB,
                currentT.fC,
                currentT.fD,
                currentT.fE,
                currentT.fF,
                currentT.fG,
                currentT.fH,
                currentT.fI,
                currentT.fJ,
                currentT.fK,
                currentT.fL,
                currentT.fM,
                currentT.fN,
                currentT.fO,
              ].map(item => (
                <div key={item} className="p-2.5 bg-app-bg/50 border border-app-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-app-text/90">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-3 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Shield size={15} className="text-app-accent" />
              <span>{currentT.openSourceTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.openSourceText}
            </p>
          </div>
        </div>
      )}

      {currentPage === 'contact' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
              <Mail size={14} className="text-app-accent" />
              {currentT.contact}
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{currentT.contactHeadline}</h1>
            <p className="text-xs text-app-muted font-bold uppercase tracking-widest">{currentT.contactSubtitle}</p>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-4 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Mail size={15} className="text-app-accent" />
              <span>{currentT.writeUsTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.writeUsText}
            </p>
            <div 
              onClick={handleCopy}
              className="flex items-center gap-3.5 p-4 border border-app-border/80 rounded-2xl hover:bg-app-accent/5 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-app-accent/15 border border-app-accent/25 flex items-center justify-center text-app-accent">
                <Mail size={18} />
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-app-muted">EMAIL</div>
                <div className="text-sm font-bold text-app-text select-all">systeme.chaos@outlook.fr</div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-app-muted ml-auto bg-app-bg px-2.5 py-1 rounded-lg">
                {copied ? currentT.copied : currentT.clickToCopy}
              </span>
            </div>
          </div>

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-4 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Info size={15} className="text-app-accent" />
              <span>{currentT.whyContactTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                currentT.wcBug,
                currentT.wcSuggest,
                currentT.wcPrivacy,
                currentT.wcReturn,
                currentT.wcContrib
              ].map(item => (
                <div key={item} className="p-2.5 bg-app-bg/50 border border-app-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-app-text/90">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-app-border bg-app-card/30 p-6 rounded-2xl text-sm leading-relaxed text-app-text/95 font-medium">
            {currentT.contactNote}
          </div>
        </div>
      )}

      {/* Footer Branding block */}
      <div className="border-t border-app-border/40 pt-6 flex items-center justify-center gap-2 text-xs text-app-muted font-bold uppercase tracking-wider">
        <Heart size={14} className="text-red-400 animate-pulse" />
        {currentT.footerNote}
      </div>
    </div>
  );
}
