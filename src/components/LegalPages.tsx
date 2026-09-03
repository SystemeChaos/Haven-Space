import { useState } from 'react';
import {
  Shield, Info, Mail, ChevronLeft, ChevronDown, Heart, Lock, Database, Eye, Users,
  BookOpen, Search, UserCircle2, Layers, GitBranch, Tag, Radio, History, NotebookPen,
  MessageCircle, MessageSquare, LifeBuoy, PhoneCall, Download, Link2, Palette,
  LayoutDashboard, Globe, Smartphone, Boxes, CalendarDays, LayoutGrid, Sparkles, Wind,
  HeartPulse, Languages, Wallet, TreePine, Bug, Upload, X, CheckCircle2, AlertCircle, Loader2,
  Clock, MapPin, StickyNote, KeyRound,
} from 'lucide-react';

export type LegalPage = 'privacy' | 'about' | 'contact' | 'guide' | 'vocabulary' | 'roles';

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
      vocabulary: 'Vocabulaire',
      roles: 'Lexique des rôles',
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
      fP: '✦ Planning Bullet Journal',
      fQ: '✦ Matrice d\'Eisenhower',
      fR: '✦ Systèmes parallèles',
      fS: '✦ Rôles personnalisés',
      fT: '✦ Export / import JSON',
      fU: '✦ Détente (outils anti-dissociation)',
      fV: '✦ Portefeuille (dépenses par alter)',
      fW: '✦ Innerworld (monde intérieur)',
      fX: '✦ Vérification de réalité',
      fY: '✦ Landing Notes',
      fZ: '✦ Confidentialité par fiche',
      fAA: '✦ Spectrum Tool (The Plural Association)',
      openSourceTitle: 'Transparence',
      openSourceText: 'Cette application a été réalisée par une personne plurielle, avec l\'aide de l\'IA pour le codage. Elle est open source, gratuite et disponible librement pour la communauté — et continue d\'évoluer au fil des besoins.',
      thanksTitle: 'Merci à nos alpha & bêta testeur·euses',
      thanksText: 'Haven Space n\'existerait pas sous cette forme sans les personnes qui ont testé chaque fonctionnalité avant tout le monde, remonté des bugs, partagé leur vécu et donné des retours sincères — parfois en plein moment difficile, parce que c\'est aussi à ça que sert l\'outil. Ce projet leur doit énormément. Si vous vous reconnaissez : merci, du fond du cœur, pour votre temps, votre confiance et votre patience.',

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
      g29Title: 'Innerworld',
      g29Text: "Le monde intérieur du système, lieu par lieu : une tuile par alter (photo + nom) donne accès à sa page personnelle façon moodboard, avec des blocs modulables (bannière, texte libre, galerie photo, audio/playlist) et une source d'origine optionnelle. Un Front Room commun, épinglé en haut, sert d'espace partagé pour les transits ou l'inner commun. Une recherche avec autosuggestion permet de retrouver un alter ou de regrouper les pages par source. Accessible depuis le tableau de bord, avec un lien direct vers et depuis la fiche de chaque alter.",
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
      g9Text: 'Des conversations en tête-à-tête entre deux alters précis, séparées du chat de groupe. Une recherche dédiée permet de retrouver rapidement une conversation existante ou d\'en démarrer une nouvelle en choisissant les deux alters concernés. Si un message arrive sur une conversation que tu ne regardes pas, une petite notification apparaît en haut de l\'écran — elle reste affichée jusqu\'à ce que tu la lises ou que tu la fermes, pour être sûr·e qu\'elle ne passe pas inaperçue.',
      g10Title: 'Ancrage / Mode SOS',
      g10Text: 'Des techniques d\'ancrage classées par catégorie (se déplacer, bouger, parler, ressentir...) pour les moments de dissociation ou de détresse émotionnelle. Une section « Contacts de confiance » permet aussi d\'enregistrer les numéros de personnes ou professionnels à contacter en cas de besoin, directement modifiables et supprimables.',
      g30Title: 'Vérification de réalité',
      g30Text: 'En haut de la page Ancrage, un accès en un clic pour se réorienter rapidement : l\'heure et la date en direct, un champ « Où suis-je ? » à remplir dans l\'instant (volontairement non sauvegardé — l\'idée est de le formuler, pas de l\'archiver), et un raccourci vers le programme du jour dans le Planning.',
      g31Title: 'Landing Notes',
      g31Text: 'Un mot court laissé par le fronteur sortant à l\'intention de la prochaine personne qui arrive : où on est, ce qu\'on faisait, à quelle heure il faut partir... La note la plus récente non lue est mise en avant en haut de la page Ancrage, avec un historique consultable en dessous. Chiffré comme le reste de tes données personnelles.',
      g11Title: 'Export des fiches en image',
      g11Text: 'Télécharge la fiche d\'un alter sous forme d\'image PNG prête à partager, avec toutes ses informations mises en forme proprement.',
      g12Title: 'Synchronisation PluralKit',
      g12Text: 'Relie Haven Space à ton système PluralKit pour importer automatiquement tes alters existants, ou synchroniser tes fiches directement avec ton profil — aucun compte n\'est nécessaire pour cette synchronisation.',
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
      g18Title: 'Systèmes parallèles',
      g18Text: 'Gère plusieurs systèmes complètement séparés dans la même application — chacun avec ses propres alters, ses propres sous-systèmes et sa propre cartographie des relations, indépendants du système principal. Pratique si tu accompagnes un autre système, ou si tu veux garder des espaces totalement distincts sans que les données se mélangent. Un sélecteur permet de basculer d\'un système à l\'autre à tout moment, depuis « Mon système ».',
      g33Title: 'Spectrum Tool',
      g33Text: 'Une roue interactive pour suivre l\'évolution du système sur des critères choisis : souvenirs partagés, coopération, stabilité, communication interne, capacité à switcher, co-conscience, élaboration, visibilité et Pride. Clique ou glisse dans chaque secteur pour le noter de 0 à 10. Les critères peuvent être ajoutés, renommés, recolorés ou supprimés, et chaque système conserve sa propre roue. La roue est verrouillée par défaut : touchez le cadenas en haut à droite pour la déverrouiller et éviter toute modification accidentelle au scroll sur mobile. Outil inspiré de « The Plural Spectrum Tool — The Plural Association Nonprofit » (partielles.com/tpa).',
      g19Title: 'Planning',
      g19Text: 'Un planning façon Bullet Journal, avec trois vues — quotidienne (heure par heure), hebdomadaire et mensuelle — pour savoir qui fait quoi et éviter d\'être pris·e au dépourvu. Chaque entrée a un type (à faire, événement, rendez-vous, note, important, urgent, idée, anniversaire, effectué, reporté, en cours), peut être liée à un ou plusieurs alters, et classée par projet ou par sujet grâce à des étiquettes de couleur libres.',
      g20Title: 'Mon système',
      g20Text: 'La page centrale où retrouver tous tes alters d\'un coup d\'œil : recherche par nom, filtres par rôle et par tag, création d\'un nouvel alter, et accès rapide pour charger, archiver ou supprimer une fiche. C\'est aussi depuis cette page que se gèrent les sous-systèmes et les systèmes parallèles.',
      g21Title: 'Export / import JSON',
      g21Text: 'Sauvegarde l\'intégralité de ton système (fiches, sous-systèmes, journal, relations, planning...) dans un fichier JSON téléchargeable, à conserver comme copie de secours ou à transférer sur un autre appareil. L\'import restaure tout à l\'identique, sans compte ni serveur externe.',
      g22Title: 'Matrice d\'Eisenhower',
      g22Text: 'Une vue dédiée dans le Planning pour prioriser tes tâches selon leur urgence et leur importance, classées en quatre cases : à faire en premier, à planifier, à déléguer, et à laisser de côté. Idéal pour clarifier les priorités du système quand tout semble urgent en même temps.',
      g23Title: 'Rôles personnalisés',
      g23Text: 'En plus des rôles fixes (Hôte, Protecteur...), crée tes propres rôles avec leur nom, leur couleur et leur définition. Ils s\'affichent partout où les rôles fixes apparaissent : sur la fiche, dans le résumé, et dans la recherche par rôle.',
      g24Title: 'Détente',
      g24Text: 'Une section d\'outils anti-dissociation partagés par tout le système : respiration guidée, fidgets sensoriels (dont un coloriage de mandalas et fleurs aux tracés fermés, sans débordement), kalimba jouable, affirmations, boîte à souvenirs, boîte à choix, canevas éphémère et éco-système — ce dernier avec ses présences et décors illustrés en aquarelle et un cycle lumineux à 4 phases (aube, jour, crépuscule, nuit) qui suit l\'heure réelle. Accessible depuis le tableau de bord.',
      g28Title: 'Portefeuille',
      g28Text: 'Un suivi des dépenses et revenus du système, catégorisé (alimentation, santé, thérapie, loisirs...) et réparti par alter ou en commun. Un aperçu affiche le total du mois et la répartition par alter, et un historique complet permet de revenir sur chaque opération, de la modifier ou de la supprimer. Accessible depuis le tableau de bord.',
      g25Title: 'Santé',
      g25Text: 'Un carnet de santé partagé par le système : traitements en cours, antécédents médicaux et informations d\'urgence, le tout accessible d\'un coup d\'œil depuis le tableau de bord.',
      g26Title: 'Verrouillage par code',
      g26Text: 'Protège l\'accès à l\'app avec un code de 4 à 6 chiffres, réactivable en cas d\'oubli via une question de secours que tu choisis toi-même. L\'app se reverrouille automatiquement dès qu\'elle repasse en arrière-plan. Attention : ce code empêche un coup d\'œil rapide sur ton téléphone, mais ce n\'est pas un chiffrement — les données restent techniquement lisibles sur l\'appareil pour quelqu\'un qui saurait les extraire. Pense donc à exporter régulièrement ton système (JSON) et à ne pas compter uniquement sur ce verrou face à quelqu\'un ayant un accès physique répété et des connaissances techniques.',
      g32Title: 'Confidentialité par fiche',
      g32Text: 'En plus du code de l\'app, chaque alter peut protéger sa propre fiche avec un code qui lui est propre, facultatif et indépendant du code principal — utile pour garder une fiche privée même face à quelqu\'un qui connaît déjà le code de l\'app. Une fiche protégée reste visible dans la liste (avec un petit cadenas), mais son contenu reste caché tant que son code à elle n\'est pas entré. Le déverrouillage ne dure que le temps de la session en cours.',
      g27Title: 'Vocabulaire de la multiplicité',
      g27Text: 'Un lexique dédié explique les termes utilisés autour de la multiplicité et du TDI (alter, front, switch, système, endogénique...), avec pour chacun son statut (clinique, communautaire ou débattu). Accessible directement depuis l\'onglet "Vocabulaire", à côté de ce Guide.',
    },
    en: {
      privacy: 'Privacy Policy',
      about: 'About Us',
      contact: 'Contact',
      guide: 'Guide',
      vocabulary: 'Vocabulary',
      roles: 'Role Lexicon',
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
      fP: '✦ Bullet Journal Planning',
      fQ: '✦ Eisenhower Matrix',
      fR: '✦ Parallel Systems',
      fS: '✦ Custom Roles',
      fT: '✦ JSON Export / Import',
      fU: '✦ Relax (anti-dissociation tools)',
      fV: '✦ Wallet (per-alter expenses)',
      fW: '✦ Innerworld (inner world)',
      fX: '✦ Reality Check',
      fY: '✦ Landing Notes',
      fZ: '✦ Per-Profile Privacy',
      fAA: '✦ Spectrum Tool (The Plural Association)',
      openSourceTitle: 'Transparency',
      openSourceText: 'This app was built by a plural person, with AI assistance for coding. It is open source, free, and freely available to the community — and keeps evolving alongside real needs.',
      thanksTitle: 'Thank you to our alpha & beta testers',
      thanksText: 'Haven Space wouldn\'t exist in its current form without the people who tested every feature before anyone else, reported bugs, shared their lived experience, and gave honest feedback — sometimes in the middle of a hard moment, because that\'s exactly what this tool is for. This project owes them a lot. If you recognize yourself here: thank you, sincerely, for your time, your trust, and your patience.',

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
      g29Title: 'Innerworld',
      g29Text: "The system's inner world, place by place: a tile per alter (photo + name) opens their personal moodboard-style page, with modular blocks (banner, free text, photo gallery, audio/playlist) and an optional origin source. A shared Front Room, pinned at the top, serves as a common space for transits or shared inner spaces. Search with autosuggest helps find an alter or group pages by source. Accessible from the dashboard, with a direct link to and from each alter's profile.",
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
      g9Text: 'One-on-one conversations between two specific alters, separate from the group chat. A dedicated search lets you quickly find an existing conversation or start a new one by picking the two alters involved. If a message comes in on a conversation you\'re not looking at, a small notification appears at the top of the screen — it stays visible until you read it or dismiss it, so it never goes unnoticed.',
      g10Title: 'Grounding / SOS Mode',
      g10Text: 'Grounding techniques sorted by category (moving, being active, talking, feeling...) for moments of dissociation or emotional distress. A "Trusted Contacts" section also lets you save numbers for people or professionals to reach out to when needed, directly editable and deletable.',
      g30Title: 'Reality Check',
      g30Text: 'At the top of the Grounding page, a one-tap way to quickly reorient: the live time and date, a "Where am I?" field to fill in on the spot (intentionally not saved — the point is to put it into words, not to archive it), and a shortcut to today\'s plan in Planning.',
      g31Title: 'Landing Notes',
      g31Text: 'A short message left by the outgoing fronter for whoever arrives next: where we are, what we were doing, what time to leave... The most recent unread note is highlighted at the top of the Grounding page, with a browsable history below. Encrypted like the rest of your personal data.',
      g11Title: 'Export Profiles as Images',
      g11Text: 'Download an alter\'s profile as a ready-to-share PNG image, with all its information neatly formatted.',
      g12Title: 'PluralKit Sync',
      g12Text: 'Connect Haven Space to your PluralKit system to automatically import your existing alters, or sync your profiles directly with your account — no account is required for this sync.',
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
      g18Title: 'Parallel Systems',
      g18Text: 'Manage several completely separate systems within the same app — each with its own alters, subsystems, and relationship map, independent from the main system. Handy if you\'re supporting another system, or if you want fully distinct spaces without the data mixing together. A selector lets you switch between systems at any time, from "My System."',
      g33Title: 'Spectrum Tool',
      g33Text: 'An interactive wheel for tracking how the system evolves across criteria you choose: shared memories, cooperation, stability, internal communication, switching ability, co-consciousness, elaboration, visibility, and Pride. Click or drag in each sector to score it from 0 to 10. Criteria can be added, renamed, recolored, or deleted, and each system keeps its own wheel. The wheel is locked by default: tap the padlock in the top-right corner to unlock it and avoid accidental changes while scrolling on mobile. Inspired by "The Plural Spectrum Tool — The Plural Association Nonprofit" (partielles.com/tpa).',
      g19Title: 'Planning',
      g19Text: 'A Bullet Journal style planner, with three views — daily (hour by hour), weekly, and monthly — to know who\'s doing what and avoid being caught off guard. Each entry has a type (task, event, appointment, note, important, urgent, idea, birthday, done, postponed, in progress), can be linked to one or more alters, and sorted by project or topic using free-color labels.',
      g20Title: 'My System',
      g20Text: 'The central page where you find all your alters at a glance: search by name, filter by role and tag, create a new alter, and quickly load, archive, or delete a profile. Subsystems and parallel systems are also managed from this page.',
      g21Title: 'JSON Export / Import',
      g21Text: 'Save your entire system (profiles, subsystems, journal, relationships, planning...) as a downloadable JSON file, to keep as a backup or move to another device. Importing restores everything exactly as it was, with no account or external server involved.',
      g22Title: 'Eisenhower Matrix',
      g22Text: 'A dedicated view inside Planning to prioritize your tasks by urgency and importance, sorted into four boxes: do first, schedule, delegate, and drop. Great for clarifying what actually matters when everything feels urgent at once.',
      g23Title: 'Custom Roles',
      g23Text: 'Beyond the fixed roles (Host, Protector...), create your own roles with a name, color and definition. They show up everywhere fixed roles do: on the card, in the summary, and in role search.',
      g24Title: 'Relax',
      g24Text: 'A section of anti-dissociation tools shared by the whole system: guided breathing, sensory fidgets (including a mandala and flower coloring book with closed outlines, so colors never spill over), a playable kalimba, affirmations, a memory box, a choice box, an ephemeral canvas, and an eco-system — the latter with watercolor-illustrated presences and decor, plus a 4-phase light cycle (dawn, day, dusk, night) that follows the real time of day. Accessible from the dashboard.',
      g28Title: 'Wallet',
      g28Text: "A record of the system's expenses and income, sorted by category (groceries, health, therapy, leisure...) and split between individual alters or shared. An overview shows the monthly total and the per-alter breakdown, and a full history lets you revisit, edit or delete any entry. Accessible from the dashboard.",
      g25Title: 'Health',
      g25Text: 'A health record shared by the system: current treatments, medical history and emergency information, all viewable at a glance from the dashboard.',
      g26Title: 'Code lock',
      g26Text: "Protect access to the app with a 4-to-6-digit code, recoverable if forgotten via a backup question you choose yourself. The app automatically re-locks as soon as it goes to the background. Note: this code prevents a quick glance at your phone, but it is not encryption — the data remains technically readable on the device by someone who knows how to extract it. Export your system regularly (JSON) and don't rely on this lock alone against someone with repeated physical access and technical knowledge.",
      g32Title: 'Per-Profile Privacy',
      g32Text: "Beyond the app's code, each alter can protect their own profile with a code of their own — optional and independent from the main code. Handy for keeping a profile private even from someone who already knows the app's code. A protected profile still shows up in the list (with a small lock icon), but its content stays hidden until its own code is entered. The unlock only lasts for the current session.",
      g27Title: 'Plurality vocabulary',
      g27Text: 'A dedicated glossary explains terms used around plurality and DID (alter, front, switch, system, endogenic...), each tagged with its status (clinical, community, or debated). Accessible from the "Vocabulary" tab next to this Guide. Currently available in French only.',
    }
  };

  const currentT = t[lang];

  const [copied, setCopied] = useState(false);
  const [guideSearch, setGuideSearch] = useState('');
  const [vocabSearch, setVocabSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [openGuideIds, setOpenGuideIds] = useState<string[]>([]);

  const toggleGuideItem = (id: string) => {
    setOpenGuideIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('systeme.chaos@outlook.fr');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Rapport de bug ───────────────────────────────────────────────────────
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugEmail, setBugEmail] = useState('');
  const [bugPhotos, setBugPhotos] = useState<string[]>([]);
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugStatus, setBugStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bugErrorMsg, setBugErrorMsg] = useState<string | null>(null);

  const compressBugPhotos = (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return Promise.resolve([]);
    const promises = Array.from(files).map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 1280;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_size) { height *= max_size / width; width = max_size; }
          } else if (height > max_size) {
            width *= max_size / height; height = max_size;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }));
    return Promise.all(promises);
  };

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const [meta, b64] = dataUrl.split(',');
    const mime = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const handleBugSubmit = async () => {
    if (!bugTitle.trim() || !bugDescription.trim()) {
      setBugErrorMsg(lang === 'fr' ? 'Merci de renseigner un titre et une description.' : 'Please fill in a title and a description.');
      setBugStatus('error');
      return;
    }
    setBugSubmitting(true);
    setBugStatus('idle');
    setBugErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('_subject', `[Haven Space] Rapport de bug : ${bugTitle.trim()}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      formData.append(lang === 'fr' ? 'Titre du bug' : 'Bug title', bugTitle.trim());
      formData.append(lang === 'fr' ? 'Description' : 'Description', bugDescription.trim());
      formData.append(
        lang === 'fr' ? 'Email de réponse' : 'Reply email',
        bugEmail.trim() || (lang === 'fr' ? 'Non renseigné (anonyme)' : 'Not provided (anonymous)')
      );
      bugPhotos.forEach((dataUrl, i) => {
        formData.append(`${lang === 'fr' ? 'Capture' : 'Screenshot'} ${i + 1}`, dataUrlToBlob(dataUrl), `capture-${i + 1}.jpg`);
      });

      const res = await fetch('https://formsubmit.co/ajax/systeme.chaos@outlook.fr', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (!res.ok) throw new Error('request failed');

      setBugStatus('success');
      setBugTitle('');
      setBugDescription('');
      setBugEmail('');
      setBugPhotos([]);
    } catch {
      setBugStatus('error');
      setBugErrorMsg(lang === 'fr'
        ? "L'envoi a échoué. Tu peux réessayer ou nous écrire directement par email."
        : 'Sending failed. You can try again or email us directly.');
    } finally {
      setBugSubmitting(false);
    }
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
          {(['guide', 'vocabulary', 'roles', 'privacy', 'about', 'contact'] as LegalPage[]).map((tab) => (
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
          { id: 'g14', icon: LayoutDashboard, title: currentT.g14Title, text: currentT.g14Text },
          { id: 'g20', icon: Users, title: currentT.g20Title, text: currentT.g20Text },
          { id: 'g1', icon: UserCircle2, title: currentT.g1Title, text: currentT.g1Text },
          { id: 'g2', icon: Layers, title: currentT.g2Title, text: currentT.g2Text },
          { id: 'g18', icon: Boxes, title: currentT.g18Title, text: currentT.g18Text },
          { id: 'g33', icon: Palette, title: currentT.g33Title, text: currentT.g33Text },
          { id: 'g4', icon: Tag, title: currentT.g4Title, text: currentT.g4Text },
          { id: 'g6', icon: History, title: currentT.g6Title, text: currentT.g6Text },
          { id: 'g5', icon: Radio, title: currentT.g5Title, text: currentT.g5Text },
          { id: 'g3', icon: GitBranch, title: currentT.g3Title, text: currentT.g3Text },
          { id: 'g29', icon: TreePine, title: currentT.g29Title, text: currentT.g29Text },
          { id: 'g8', icon: MessageCircle, title: currentT.g8Title, text: currentT.g8Text },
          { id: 'g9', icon: MessageSquare, title: currentT.g9Title, text: currentT.g9Text },
          { id: 'g7', icon: NotebookPen, title: currentT.g7Title, text: currentT.g7Text },
          { id: 'g19', icon: CalendarDays, title: currentT.g19Title, text: currentT.g19Text },
          { id: 'g22', icon: LayoutGrid, title: currentT.g22Title, text: currentT.g22Text },
          { id: 'g25', icon: HeartPulse, title: currentT.g25Title, text: currentT.g25Text },
          { id: 'g26', icon: Lock, title: currentT.g26Title, text: currentT.g26Text },
          { id: 'g32', icon: KeyRound, title: currentT.g32Title, text: currentT.g32Text },
          { id: 'g27', icon: Languages, title: currentT.g27Title, text: currentT.g27Text },
          { id: 'g28', icon: Wallet, title: currentT.g28Title, text: currentT.g28Text },
          { id: 'g24', icon: Wind, title: currentT.g24Title, text: currentT.g24Text },
          { id: 'g23', icon: Sparkles, title: currentT.g23Title, text: currentT.g23Text },
          { id: 'g10', icon: LifeBuoy, title: currentT.g10Title, text: currentT.g10Text },
          { id: 'g30', icon: Clock, title: currentT.g30Title, text: currentT.g30Text },
          { id: 'g31', icon: StickyNote, title: currentT.g31Title, text: currentT.g31Text },
          { id: 'g12', icon: Link2, title: currentT.g12Title, text: currentT.g12Text },
          { id: 'g21', icon: Database, title: currentT.g21Title, text: currentT.g21Text },
          { id: 'g11', icon: Download, title: currentT.g11Title, text: currentT.g11Text },
          { id: 'g13', icon: Palette, title: currentT.g13Title, text: currentT.g13Text },
          { id: 'g16', icon: Smartphone, title: currentT.g16Title, text: currentT.g16Text },
          { id: 'g17', icon: Lock, title: currentT.g17Title, text: currentT.g17Text },
          // Non listées explicitement par l'utilisateur, conservées en fin de guide
          { id: 'g15', icon: Globe, title: currentT.g15Title, text: currentT.g15Text },
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

      {currentPage === 'vocabulary' && (() => {
        type TermStatus = 'clinique' | 'communautaire' | 'debattu';
        interface VocabTerm { name: string; status: TermStatus[]; definition: string; }
        interface VocabCategory { title: string; terms: VocabTerm[]; }

        const categories: VocabCategory[] = [
          {
            title: 'Le socle',
            terms: [
              { name: 'Multiplicité / Pluralité', status: ['communautaire'], definition: "Le fait, pour une personne, d'être composée de plusieurs identités distinctes partageant un même corps. Terme générique, non clinique, souvent préféré par la communauté pour parler de l'expérience au quotidien plutôt que de la nommer comme un trouble." },
              { name: 'Singulet', status: ['communautaire'], definition: "Personne qui n'a qu'une seule identité, sans multiplicité. Terme utilisé par la communauté pour désigner, sans jugement, les personnes non-plurielles." },
              { name: 'Système', status: ['communautaire'], definition: "Désigne l'ensemble des alters d'une personne plurielle, vu comme un tout organisé plutôt qu'une simple addition d'éléments séparés." },
            ],
          },
          {
            title: 'Membres du système & rôles',
            terms: [
              { name: 'Age slider', status: ['communautaire'], definition: "Alter dont l'âge perçu n'est pas fixe et varie au fil du temps ou selon les situations." },
              { name: 'Alter', status: ['clinique'], definition: "Identité distincte au sein d'un système, avec ses propres traits, souvenirs et façon d'être. Reconnu par les classifications cliniques, mais aussi très largement utilisé en dehors de tout contexte médical." },
              { name: 'Caretaker', status: ['communautaire'], definition: "Alter dont le rôle perçu est de veiller au bien-être du système : prendre soin des autres membres, gérer les besoins du quotidien ou apporter du réconfort." },
              { name: 'Factif', status: ['communautaire'], definition: "Type d'introject fondé sur une personne réelle (proche, célébrité...). À associer ou différencier du Fictif." },
              { name: 'Fictif (Fictive)', status: ['communautaire'], definition: "Type d'introject fondé sur un personnage de fiction (série, livre, jeu vidéo). À associer ou différencier du Factif." },
              { name: 'Fragment', status: ['communautaire', 'clinique'], definition: "Alter très peu développé, créé pour une tâche précise ou portant une seule émotion ou un souvenir spécifique, sans personnalité complète." },
              { name: 'Gatekeeper', status: ['communautaire'], definition: "Alter dont le rôle perçu est de réguler qui fronte, ou l'accès à la mémoire et aux informations internes." },
              { name: 'Headmate', status: ['communautaire'], definition: "Équivalent anglophone d'« alter », parfois préféré car perçu comme moins médicalisé." },
              { name: 'Hôte', status: ['communautaire'], definition: "Alter qui occupe le plus souvent le corps au quotidien. Un système peut avoir un hôte, plusieurs, ou aucun." },
              { name: 'Introject', status: ['communautaire'], definition: "Alter formé à partir de l'image d'une personne ou d'un personnage existant en dehors du système. Regroupe notamment les Factifs et les Fictifs (voir ces termes)." },
              { name: 'ISH (Internal Self Helper)', status: ['communautaire', 'clinique'], definition: "Alter possédant une grande compréhension du système, guidant l'organisation interne et le travail thérapeutique." },
              { name: 'Littles / Petits', status: ['communautaire'], definition: "Alters perçus comme ayant un âge mental jeune (enfant)." },
              { name: 'Non-humain / Creature', status: ['communautaire'], definition: "Alter perçu comme un animal, une créature mythologique, un robot ou une entité non humaine." },
              { name: 'Persécuteur', status: ['communautaire'], definition: "Alter dont les actions ou intentions sont vécues comme hostiles par d'autres membres du système — souvent le résultat d'un rôle de protection mal compris ou d'un vécu traumatique complexe." },
              { name: 'Porteur de trauma (Trauma holder)', status: ['communautaire'], definition: "Alter dont le rôle principal est de contenir les souvenirs, émotions ou douleurs liés à un ou plusieurs traumatismes, pour préserver le reste du système." },
              { name: 'Protecteur', status: ['communautaire'], definition: "Alter dont le rôle perçu est de défendre le système face à une menace, réelle ou passée." },
            ],
          },
          {
            title: 'États & fonctionnement',
            terms: [
              { name: 'Amnésie dissociative', status: ['clinique'], definition: "Perte de mémoire, totale (« blackout ») ou partielle (« grey-out »), concernant une période où un autre alter était au front. C'est un critère reconnu du TDI." },
              { name: 'Blending / Flou identitaire', status: ['communautaire'], definition: "État temporaire où les limites entre deux ou plusieurs alters s'estompent, rendant difficile la distinction de « qui est qui »." },
              { name: 'Co-conscience', status: ['communautaire'], definition: "Situation où plusieurs alters ont conscience de ce qui se passe en même temps, qu'ils soient au front ou non." },
              { name: 'Co-fronting', status: ['communautaire'], definition: "État où au moins deux alters partagent simultanément le contrôle du corps et des actions." },
              { name: 'Dépersonnalisation / Déréalisation', status: ['clinique'], definition: "Sentiment d'être détaché de soi-même (dépersonnalisation) ou de son environnement, qui semble alors irréel (déréalisation)." },
              { name: 'Dissociation', status: ['clinique'], definition: "Mécanisme psychique de déconnexion — de ses pensées, de son identité, de son environnement ou de ses souvenirs — souvent une réponse à un stress ou un trauma." },
              { name: 'Dormance', status: ['communautaire'], definition: "Période d'inactivité prolongée d'un alter, pendant laquelle il n'intervient plus au front ni dans la vie interne." },
              { name: 'Front / Fronting', status: ['communautaire'], definition: "Le fait, pour un alter, d'être aux commandes du corps à un instant donné." },
              { name: 'Front Room', status: ['communautaire'], definition: "Zone du monde intérieur perçue comme un espace commun ou de transit, où les alters peuvent se croiser en dehors de leur lieu personnel — par opposition aux espaces individuels de chacun·e." },
              { name: 'Frontstuck', status: ['communautaire'], definition: "Fait, pour un alter, d'être bloqué au front, incapable de passer le relais ou de retourner dans le monde intérieur." },
              { name: 'Influence passive', status: ['clinique'], definition: "Situation où la présence, les émotions ou les pensées d'un alter non-fronter influencent les actes ou le ressenti de celui qui est au front." },
              { name: 'Monde intérieur / Headspace / Innerworld', status: ['communautaire'], definition: "Espace mental représenté où les alters peuvent interagir, se reposer ou communiquer lorsqu'ils ne sont pas au front." },
              { name: 'Split / Scission', status: ['communautaire', 'clinique'], definition: "Séparation d'une identité ou apparition d'un nouvel alter, généralement en réponse à un stress intense, un traumatisme ou un besoin d'adaptation." },
              { name: 'Switch', status: ['communautaire'], definition: "Changement de la personne aux commandes du corps : un alter en remplace un autre au front." },
              { name: 'Trigger (Déclencheur)', status: ['communautaire', 'clinique'], definition: "Stimulus externe ou interne qui provoque une réaction (switch forcé, flashback, déstabilisation)." },
            ],
          },
          {
            title: 'Structure du système',
            terms: [
              { name: 'Fusion / Intégration', status: ['debattu'], definition: "Processus par lequel deux alters ou plus perdent leurs frontières distinctes pour devenir une seule identité. Parfois présenté comme un objectif thérapeutique, mais ni obligatoire ni souhaité par tous les systèmes — ce guide ne prend pas position là-dessus." },
              { name: 'Multiplicité fonctionnelle', status: ['debattu', 'communautaire'], definition: "Alternative thérapeutique à la fusion totale, visant une collaboration fluide et pacifique entre les alters tout en conservant la pluralité." },
              { name: 'Polyfragmenté', status: ['communautaire'], definition: "Se dit d'un système comportant un très grand nombre d'alters, parfois très spécialisés ou peu développés individuellement." },
              { name: 'Sous-système', status: ['communautaire'], definition: "Groupe d'alters organisés ensemble à l'intérieur du système principal, avec parfois leur propre dynamique interne." },
              { name: 'Soustraction / Dé-fusion', status: ['communautaire'], definition: "Processus inverse de la fusion, où un alter ré-émerge ou se sépare à nouveau après avoir été fusionné." },
              { name: 'Système parallèle', status: ['communautaire'], definition: "Système distinct qui partage le même corps qu'un autre système, sans faire partie de la même structure interne." },
            ],
          },
          {
            title: 'Diagnostic clinique',
            terms: [
              { name: 'TDI (Trouble Dissociatif de l\'Identité)', status: ['clinique'], definition: "Diagnostic reconnu par le DSM-5-TR et la CIM-11, caractérisé par la présence de deux identités distinctes ou plus, accompagnée d'une amnésie dissociative significative." },
              { name: 'Trouble dissociatif', status: ['clinique'], definition: "Catégorie clinique plus large regroupant plusieurs troubles liés à une perturbation de l'identité, de la mémoire, de la perception ou de la conscience." },
              { name: 'TSDA / ATDS', status: ['clinique'], definition: "Trouble Spécifié Autre — l'équivalent français de l'OSDD anglophone. Diagnostic proche du TDI mais qui n'en remplit pas tous les critères stricts (par exemple, une amnésie moins marquée)." },
            ],
          },
          {
            title: 'Origines & débats',
            terms: [
              { name: 'Endogénique', status: ['debattu'], definition: "Désigne un système qui ne s'identifie pas comme découlant d'un trauma. Le débat existe des deux côtés : certain·es dans la communauté estiment que cela questionne la légitimité de la souffrance des systèmes traumagéniques ; d'autres soutiennent que la science n'a pas encore statué sur toutes les origines possibles de la multiplicité. Ce guide ne tranche pas ce débat." },
              { name: 'Neurogénique', status: ['debattu'], definition: "Terme parfois utilisé pour désigner une origine liée à une neuroatypie plutôt qu'à un trauma ou une origine spontanée." },
              { name: 'Traumagénique', status: ['clinique'], definition: "Se dit d'un système ou d'un alter dont l'origine est attribuée à un ou plusieurs traumatismes, généralement dans l'enfance. C'est l'origine reconnue par les classifications cliniques actuelles du TDI." },
            ],
          },
          {
            title: 'Communauté & usages',
            terms: [
              { name: 'Median', status: ['communautaire'], definition: "Personne qui se situe entre le vécu singulet et le vécu pluriel, sans se reconnaître pleinement dans l'un ou l'autre." },
              { name: 'Quoigénique', status: ['communautaire'], definition: "Désigne un système qui ne sait pas, ou ne veut pas, catégoriser l'origine de sa multiplicité." },
              { name: 'Système agnostique', status: ['debattu'], definition: "Système qui choisit de ne pas se positionner sur sa propre origine (traumagénique, endogénique...), par choix ou par incertitude. L'usage même de ce terme est parfois discuté au sein de la communauté." },
            ],
          },
        ];

        const statusLabel: Record<TermStatus, string> = {
          clinique: 'Clinique',
          communautaire: 'Communauté',
          debattu: 'Débattu',
        };
        const statusStyle: Record<TermStatus, string> = {
          clinique: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
          communautaire: 'bg-app-accent/10 text-app-accent border-app-accent/25',
          debattu: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
        };

        const query = vocabSearch.trim().toLowerCase();
        const filteredCategories = categories
          .map(cat => ({
            ...cat,
            terms: query
              ? cat.terms.filter(term => term.name.toLowerCase().includes(query) || term.definition.toLowerCase().includes(query))
              : cat.terms,
          }))
          .filter(cat => cat.terms.length > 0);

        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
                <Languages size={14} className="text-app-accent" />
                {currentT.vocabulary}
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">Le vocabulaire de la multiplicité.</h1>
              <p className="text-xs text-app-muted font-bold uppercase tracking-widest">Alter, front, switch, endogénique... un lexique étayé, sans jugement</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(statusLabel) as TermStatus[]).map(s => (
                <span key={s} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle[s]}`}>
                  {statusLabel[s]}
                </span>
              ))}
            </div>

            <p className="text-xs text-app-muted leading-relaxed bg-app-card border border-app-border/40 rounded-2xl p-4">
              Ce lexique distingue les termes reconnus par les classifications cliniques (DSM-5-TR, CIM-11),
              les termes d'usage communautaire sans statut clinique, et les termes ou sujets qui font débat au
              sein de la communauté plurielle. Quand un débat existe, ce guide s'efforce de présenter les points
              de vue sans trancher.
            </p>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={vocabSearch}
                onChange={e => setVocabSearch(e.target.value)}
                placeholder="Rechercher un terme..."
                className="w-full bg-app-card border border-app-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
              />
            </div>

            {filteredCategories.length === 0 && (
              <p className="text-sm text-app-muted italic px-1">Aucun terme ne correspond à ta recherche.</p>
            )}

            <div className="space-y-10">
              {filteredCategories.map(cat => (
                <div key={cat.title} className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-app-text/80 pb-2 border-b border-app-border/30">
                    {cat.title}
                  </h2>
                  <div className="space-y-3">
                    {cat.terms.map(term => (
                      <div key={term.name} className="p-4 bg-app-card border border-app-border/40 rounded-2xl space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm text-app-text">{term.name}</span>
                          {term.status.map(s => (
                            <span key={s} className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle[s]}`}>
                              {statusLabel[s]}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-app-muted leading-relaxed">{term.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {currentPage === 'roles' && (() => {
        interface RoleTerm { name: string; definition: string; }
        interface RoleCategory { title: string; terms: RoleTerm[]; }

        const categories: RoleCategory[] = [
          {
            title: 'Protection & défense',
            terms: [
              { name: 'Protecteur', definition: "Alter dont le rôle est de protéger les autres membres du système, que la menace soit extérieure (danger, agression) ou intérieure (souvenirs traumatiques, membre qui se met en difficulté)." },
              { name: 'Gardien', definition: "Alter qui protège le système des menaces extérieures : il surveille les limites du monde intérieur, évalue les nouveaux venus et peut retenir des souvenirs jugés dangereux pour les autres membres." },
              { name: 'Sentinelle', definition: "Alter en co-conscience quasi permanente, qui veille sur le front pour pouvoir protéger le système en cas de besoin." },
              { name: 'Protecteur interne', definition: "Protecteur tourné vers les menaces internes au système plutôt qu'externes ; peut recouper le rôle de gatekeeper s'il peut empêcher un membre de fronter." },
              { name: "Protecteur de l'Innerworld", definition: "Protecteur spécifiquement centré sur les menaces internes au monde intérieur ; proche du gardien dans les systèmes construits autour d'un lieu de passage." },
              { name: 'Bouclier', definition: "Alter qui fronte aux côtés d'un autre membre pour dissimuler sa présence — par exemple un protecteur qui fronte avec un petit pour que celui-ci paraisse adulte dans certaines situations." },
              { name: 'Geôlier / Warden', definition: "Alter qui fait tampon entre un persécuteur et le reste du système, dans une logique de mise à distance et de réhabilitation plutôt que de punition." },
              { name: 'Janusien', definition: "Alter capable de fonctionner tour à tour comme protecteur et/ou comme persécuteur selon les situations." },
              { name: 'Malicitor', definition: "Terme d'auto-identification pour un alter qui agit avec l'intention de nuire, sans chercher à protéger le système — à ne jamais utiliser pour catégoriser un autre membre que soi-même." },
              { name: 'Disciplinaire', definition: "Type de protecteur qui sanctionne les autres membres dans une intention corrective, généralement à la demande de l'hôte ou d'un gatekeeper, pour gérer les menaces internes pendant qu'un autre protecteur gère les menaces externes." },
            ],
          },
          {
            title: 'Soin & soutien émotionnel',
            terms: [
              { name: 'Caretaker / Aidant', definition: "Alter dont le rôle est de prendre soin des autres membres du système : apaiser, guider ou aider à traiter les émotions, individuellement ou pour le système entier." },
              { name: 'Apaisant / Soother', definition: "Alter dont le rôle est de réconforter les autres membres, parfois en installant simplement le corps dans une position confortable pour se reposer." },
              { name: 'Soutien émotionnel', definition: "Alter qui apporte un soutien émotionnel au système ou à d'autres membres ; proche de l'apaisant." },
              { name: 'Aidant des créatures', definition: "Alter dont le rôle est de prendre soin des membres non-humains du système, notamment en co-fronting lorsque ceux-ci ne peuvent pas gérer seuls le corps." },
              { name: 'Caregater', definition: "Alter sensible aux besoins émotionnels de chacun, capable d'amener les bons membres au front pour que les besoins de tous soient pris en compte équitablement." },
              { name: 'Curadare', definition: "Alter dont le rôle est d'accompagner la régression d'âge ou d'autres membres ayant besoin d'un soin particulier, dans le système comme en dehors." },
            ],
          },
          {
            title: 'Mémoire & organisation interne',
            terms: [
              { name: 'Archiviste', definition: "Alter particulièrement informé de ce qui se passe dans le système, à l'intérieur comme à l'extérieur, qui peut aussi organiser et conserver cette information dans le monde intérieur." },
              { name: 'Gardien de mémoire', definition: "Alter qui conserve des souvenirs spécifiques, pas toujours accessibles aux autres membres — liés à un traumatisme, une personne, un lieu ou une période de vie." },
              { name: 'Recenseur', definition: "Alter dont le rôle est de compter les membres du système, existants ou nouveaux, pour s'organiser ou simplement par plaisir." },
              { name: 'Cartographe', definition: "Alter dont le rôle est de représenter ou d'organiser spatialement le monde intérieur du système." },
              { name: 'Beastmaster', definition: "Alter capable de créer, faire disparaître ou contrôler les éléments vivants du monde intérieur (PNJ, animaux, végétation), sans emprise sur les autres alters. Rôle complémentaire à l'architecte, qui s'occupe des éléments non-vivants." },
              { name: 'Technicien', definition: "Alter chargé de comprendre le fonctionnement du système : analyser les autres membres et le monde intérieur, suivre les fusions ou scissions, ou encore le nombre de membres." },
            ],
          },
          {
            title: 'Front, administration & hiérarchie',
            terms: [
              { name: 'Hôte', definition: "Alter le plus souvent aux commandes du corps au quotidien. Un système peut avoir un hôte, plusieurs, ou aucun." },
              { name: 'Co-hôte', definition: "Alter qui partage les responsabilités du quotidien avec un ou plusieurs autres hôtes plutôt que de les assumer seul." },
              { name: 'Gatekeeper', definition: "Alter qui régule le switch, l'accès à certaines zones du monde intérieur, ou l'accès à certains membres ou souvenirs." },
              { name: 'Administrateur / Manager', definition: "Alter qui s'occupe des tâches internes assurant le bon fonctionnement du système : gestion du front, organisation des informations, communication interne, entre autres." },
              { name: 'Régulateur de front', definition: "Autre nom pour le gatekeeper : alter qui régule le switch et l'accès à certaines zones ou membres du système." },
              { name: 'Guide', definition: "Alter impliqué dans des tâches concernant le système dans son ensemble ; peut englober plusieurs rôles de gestion à la fois." },
              { name: 'Consul', definition: "Alter occupant une position de décision centrale dans le fonctionnement du système, aux responsabilités proches d'un manager ou d'un gatekeeper." },
              { name: 'Superviseur / Overseer', definition: "Alter qui garde un œil sur le monde intérieur et le front pour s'assurer que chacun est en sécurité, sans nécessairement contrôler qui fronte." },
              { name: 'Scout', definition: "Alter chargé de repérer et d'évaluer les nouveaux membres qui émergent dans le système, avant de les signaler aux autres (archivistes, recenseurs...)." },
              { name: 'Réceptionniste', definition: "Alter chargé d'accueillir les nouveaux membres qui rejoignent le système." },
              { name: 'Fronteur principal', definition: "Alter qui fronte plus souvent ou plus activement que les autres membres du système. Un système peut avoir un, plusieurs, ou aucun fronteur principal." },
              { name: 'ISH (Internal Self Helper)', definition: "Alter détenant une connaissance approfondie du système, de ses membres et de son fonctionnement interne ; historiquement décrit comme une sorte de guide ou de conscience interne, parfois aussi gatekeeper." },
            ],
          },
          {
            title: 'Émotions, symptômes & trauma',
            terms: [
              { name: "Porteur d'émotion", definition: "Alter qui porte principalement une émotion donnée pour le système — joie, tristesse, colère... Un porteur « pan » peut porter l'ensemble des émotions du système." },
              { name: 'Porteur de colère', definition: "Alter qui porte la colère du système : ressenti de colère plus fréquent ou plus intense que les autres membres." },
              { name: 'Porteur de trauma émotionnel', definition: "Type de porteur de trauma centré sur la charge émotionnelle d'un événement (abus émotionnel, conflits, épisodes dépressifs) plutôt que sur le souvenir factuel lui-même." },
              { name: 'Partie émotionnelle (EP)', definition: "Dans la théorie de la dissociation structurelle, alter resté « bloqué » au moment du traumatisme, portant des réponses de survie (colère, détresse, impulsivité). Terme à réserver à l'auto-description, jamais pour catégoriser un autre membre." },
              { name: 'Porteur de symptôme', definition: "Alter qui porte un symptôme particulier pour le système plutôt qu'une émotion ou un souvenir précis." },
              { name: 'Porteur de peur', definition: "Alter qui porte la peur, l'angoisse ou la terreur pour le reste du système, souvent liées à des expériences passées ou à un stress continu." },
              { name: 'Porteur de culpabilité', definition: "Alter qui porte les sentiments de culpabilité du système, que cette culpabilité soit fondée ou non." },
            ],
          },
          {
            title: 'Rôles sociaux & relationnels',
            terms: [
              { name: 'Compagnon', definition: "Alter dont le rôle est de tenir compagnie aux autres membres du système." },
              { name: 'Communicateur', definition: "Alter qui communique avec les autres, en général de façon plus claire que le reste du système — pour poser des limites ou porter la parole d'un autre membre." },
              { name: 'Réconciliateur', definition: "Alter qui aide les membres du système à se comprendre et à trouver des compromis en cas de désaccord interne." },
              { name: 'Analyste', definition: "Alter qui suit les dynamiques relationnelles du système : les opinions ou impressions des différents membres sur les personnes de la réalité partagée." },
            ],
          },
          {
            title: 'Rôles fonctionnels & compétences',
            terms: [
              { name: 'Chef cuisinier', definition: "Alter qui cuisine pour le système, ou qui aime le faire." },
              { name: 'Artiste', definition: "Alter le plus à l'aise avec la créativité, ou celui qui l'exprime le plus souvent — dessin, peinture, écriture ou tout autre moyen d'expression." },
              { name: 'Passionné / Hobbyiste', definition: "Alter qui prend part aux loisirs du système en front, dans un domaine particulier ou de façon générale." },
              { name: 'Chauffeur', definition: "Alter à l'aise pour conduire, qui prend volontiers le front pour les trajets en voiture." },
              { name: 'Codeur', definition: "Alter dont le rôle ou la compétence est centré sur la programmation et les tâches informatiques." },
              { name: 'Athlète', definition: "Alter à l'aise dans le sport, qui prend souvent le front pour les activités physiques." },
              { name: 'Comédien', definition: "Alter dont le rôle est de faire rire ou de détendre l'atmosphère au sein du système." },
            ],
          },
        ];

        const query = roleSearch.trim().toLowerCase();
        const filteredCategories = categories
          .map(cat => ({
            ...cat,
            terms: query
              ? cat.terms.filter(term => term.name.toLowerCase().includes(query) || term.definition.toLowerCase().includes(query))
              : cat.terms,
          }))
          .filter(cat => cat.terms.length > 0);

        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-black tracking-widest text-app-muted flex items-center gap-2">
                <Tag size={14} className="text-app-accent" />
                {currentT.roles}
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">Le lexique des rôles.</h1>
              <p className="text-xs text-app-muted font-bold uppercase tracking-widest">Protecteur, gatekeeper, porteur de trauma... un lexique étoffé des rôles d'alters</p>
            </div>

            <p className="text-xs text-app-muted leading-relaxed bg-app-card border border-app-border/40 rounded-2xl p-4">
              Ce lexique rassemble les rôles d'alters les plus reconnus au sein de la communauté plurielle, classés par
              fonction. Un même alter peut cumuler plusieurs rôles, en changer avec le temps, ou n'en avoir aucun —
              aucun de ces termes n'est obligatoire pour se comprendre soi-même ou son système.
            </p>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={roleSearch}
                onChange={e => setRoleSearch(e.target.value)}
                placeholder="Rechercher un rôle..."
                className="w-full bg-app-card border border-app-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/20"
              />
            </div>

            {filteredCategories.length === 0 && (
              <p className="text-sm text-app-muted italic px-1">Aucun rôle ne correspond à ta recherche.</p>
            )}

            <div className="space-y-10">
              {filteredCategories.map(cat => (
                <div key={cat.title} className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-app-text/80 pb-2 border-b border-app-border/30">
                    {cat.title}
                  </h2>
                  <div className="space-y-3">
                    {cat.terms.map(term => (
                      <div key={term.name} className="p-4 bg-app-card border border-app-border/40 rounded-2xl space-y-1.5">
                        <span className="font-black text-sm text-app-text block">{term.name}</span>
                        <p className="text-xs text-app-muted leading-relaxed">{term.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-app-muted leading-relaxed pt-6 border-t border-app-border/20">
              Définitions reformulées à partir de{' '}
              <a
                href="https://pluralpedia.org/w/Category:System_Roles"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-app-accent transition-colors"
              >
                Pluralpedia — Category: System Roles
              </a>
              , sous licence Creative Commons BY-SA 3.0. Cette liste n'est pas exhaustive et sera complétée avec le temps.
            </p>
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
                currentT.fP,
                currentT.fQ,
                currentT.fR,
                currentT.fS,
                currentT.fT,
                currentT.fU,
                currentT.fV,
                currentT.fW,
                currentT.fX,
                currentT.fY,
                currentT.fZ,
                currentT.fAA,
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

          <div className="p-6 bg-app-card border border-app-border rounded-2xl space-y-3 shadow-sm">
            <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Heart size={15} className="text-app-accent" />
              <span>{currentT.thanksTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {currentT.thanksText}
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
              <Bug size={15} className="text-app-accent" />
              <span>{lang === 'fr' ? 'Rapport de bug' : 'Bug report'}</span>
            </div>
            <p className="text-xs leading-relaxed text-app-muted font-medium">
              {lang === 'fr'
                ? "Un truc qui plante ou qui fait n'importe quoi ? Décris-le ici, captures d'écran bienvenues. Pas besoin de laisser ton email si tu préfères rester anonyme."
                : "Something crashing or acting weird? Describe it here, screenshots welcome. No need to leave your email if you'd rather stay anonymous."}
            </p>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                {lang === 'fr' ? 'Titre du bug' : 'Bug title'}
              </label>
              <input
                type="text"
                value={bugTitle}
                onChange={e => setBugTitle(e.target.value)}
                placeholder={lang === 'fr' ? "Ex : Le bouton Sauvegarder ne répond pas" : "E.g. The Save button doesn't respond"}
                className="w-full bg-app-bg border border-app-border/50 rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                {lang === 'fr' ? 'Explique le bug' : 'Explain the bug'}
              </label>
              <textarea
                value={bugDescription}
                onChange={e => setBugDescription(e.target.value)}
                placeholder={lang === 'fr' ? 'Que se passe-t-il ? Que faisais-tu juste avant ?' : 'What happens? What were you doing right before?'}
                rows={4}
                className="w-full bg-app-bg border border-app-border/50 rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                {lang === 'fr' ? 'Ton email (optionnel, pour qu\u2019on puisse te répondre)' : 'Your email (optional, so we can reply)'}
              </label>
              <input
                type="email"
                value={bugEmail}
                onChange={e => setBugEmail(e.target.value)}
                placeholder={lang === 'fr' ? 'Laisse vide pour rester anonyme' : 'Leave empty to stay anonymous'}
                className="w-full bg-app-bg border border-app-border/50 rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none focus:border-app-accent/40 placeholder:text-app-muted/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-app-muted">
                {lang === 'fr' ? 'Captures d\u2019écran (optionnel)' : 'Screenshots (optional)'}
              </label>
              {bugPhotos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {bugPhotos.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-app-border/40" />
                      <button
                        onClick={() => setBugPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 rounded-md bg-app-bg/90 border border-app-border/40 text-app-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-app-border/50 text-[10px] font-black uppercase tracking-widest text-app-muted hover:text-app-accent hover:border-app-accent/40 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {lang === 'fr' ? 'Ajouter des photos' : 'Add photos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    compressBugPhotos(e.target.files).then(urls => setBugPhotos(prev => [...prev, ...urls]));
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {bugStatus === 'success' && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Rapport envoyé, merci !' : 'Report sent, thank you!'}</span>
              </div>
            )}
            {bugStatus === 'error' && bugErrorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{bugErrorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleBugSubmit}
              disabled={bugSubmitting}
              className="w-full px-5 py-3 bg-app-accent hover:opacity-90 disabled:opacity-50 font-extrabold uppercase text-xs tracking-widest text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-none"
            >
              {bugSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bug className="w-4 h-4" />}
              <span>{bugSubmitting ? (lang === 'fr' ? 'Envoi en cours…' : 'Sending…') : (lang === 'fr' ? 'Envoyer le rapport' : 'Send report')}</span>
            </button>
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
