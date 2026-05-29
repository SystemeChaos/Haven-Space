import { useState } from 'react';
import { Shield, Info, Mail, ChevronLeft, Heart, Lock, Database, Eye, Users } from 'lucide-react';

export type LegalPage = 'privacy' | 'about' | 'contact';

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
      back: 'Retour',
      lastUpdate: 'Dernière mise à jour : mai 2026',
      ownData: "Tes données t'appartiennent.",
      breif: 'En bref :',
      breifText: 'Heaven Space ne collecte, ne stocke et ne transmet aucune donnée personnelle. Tout reste sur ton appareil, dans ton navigateur. Ni serveur, ni base de données, ni compte utilisateur.',
      storedTitle: 'Données stockées',
      storedText1: 'Heaven Space utilise exclusivement le localStorage de ton navigateur pour sauvegarder tes fiches d\'alters, ton journal, ton historique de switchs et tes conversations. Ces données ne quittent jamais ton appareil.',
      storedText2: 'Aucune donnée n\'est envoyée à un serveur externe. L\'équipe Heaven Space n\'a techniquement aucun accès à ce que tu crées dans l\'application.',
      whatWeDontTitle: 'Ce que nous ne faisons pas',
      noCollect: '✗ Pas de collecte de données',
      noTrack: '✗ Pas de cookies de tracking',
      noAccount: '✗ Pas de compte obligatoire',
      noAnalytics: '✗ Pas d\'analytics',
      noAds: '✗ Pas de publicités',
      noShare: '✗ Pas de partage avec des tiers',
      deleteTitle: 'Suppression de tes données',
      deleteText: 'Tu peux supprimer toutes tes données à tout moment en vidant le localStorage de ton navigateur (Paramètres du navigateur → Données du site → Heaven Space), ou en désinstallant l\'application de ton appareil.',
      contactText: 'Pour toute question concernant cette politique de confidentialité :',
      footerNote: 'Heaven Space — Fait avec soin pour la communauté plurielle',
      
      aboutTitle: 'Un espace pour chaque voix.',
      aboutSubtitle: 'Heaven Space — Outil de gestion de système pluriel',
      missionTitle: 'Notre mission',
      missionText1: 'Heaven Space est un outil conçu pour et par la communauté plurielle (TDI/OSDD et systèmes pluriels). Il offre un espace safe et privé pour documenter, comprendre et célébrer chaque membre d\'un système.',
      missionText2: 'L\'application permet de créer des fiches détaillées pour chaque alter, de tenir un journal, de suivre les switchs et de faciliter la communication interne — le tout sans jamais quitter ton appareil.',
      valuesTitle: 'Nos valeurs',
      valPrivacy: 'Confidentialité totale',
      valPrivacyDesc: 'Tes données restent sur ton appareil. Point.',
      valBenevolence: 'Bienveillance',
      valBenevolenceDesc: 'Un espace safe, sans jugement, pour tous les systèmes.',
      valCommunity: 'Communauté',
      valCommunityDesc: 'Créé avec et pour les personnes plurielles.',
      valAccessibility: 'Accessibilité',
      valAccessibilityDesc: 'Gratuit, sans compte, installable partout. Synchronisation moderne sans compte par fichier JSON ou directement avec votre profil PluralKit.',
      featuresTitle: 'Fonctionnalités',
      fA: '✦ Fiches d\'alters',
      fB: '✦ Sous-systèmes',
      fC: '✦ Journal interne',
      fD: '✦ Registre des switchs',
      fE: '✦ Chat interne',
      fF: '✦ Export PNG / PDF',
      fG: '✦ Mode sombre / Thèmes',
      fH: '✦ Multilingue FR/EN',
      fI: '✦ Installable PWA / Mobile',
      openSourceTitle: 'Open source',
      openSourceText: 'Heaven Space est un projet open source. Le code est disponible librement pour la communauté. Contributions et retours bienvenus !',

      contactHeadline: 'On est là.',
      contactSubtitle: 'Une question, un bug, une suggestion ? Écris-nous.',
      writeUsTitle: 'Nous contacter',
      writeUsText: 'Heaven Space est maintenu par une équipe passionnée et bénévole. On fait de notre mieux pour répondre dans les meilleurs délais.',
      whyContactTitle: 'Pour quoi nous écrire',
      wcBug: '🐛 Signaler un bug',
      wcSuggest: '💡 Suggérer une fonctionnalité',
      wcPrivacy: '🔒 Question sur la confidentialité',
      wcReturn: '💬 Retour général',
      wcContrib: '🤝 Contribuer au projet',
      contactNote: 'Note : Heaven Space ne stocke aucune donnée personnelle. Si tu rencontres un problème, n\'inclus jamais d\'informations sensibles sur ton système dans tes messages.',
      clickToCopy: 'Cliquer pour copier',
      copied: '✓ Copié !',
    },
    en: {
      privacy: 'Privacy Policy',
      about: 'About Us',
      contact: 'Contact',
      back: 'Back',
      lastUpdate: 'Last updated: May 2026',
      ownData: 'Your data belongs to you.',
      breif: 'In short:',
      breifText: 'Heaven Space does not collect, store, or transmit any of your personal data. Everything remains on your device, in your browser storage. No server, no database, no forced accounts.',
      storedTitle: 'Stored Data',
      storedText1: 'Heaven Space runs completely on client-side storage, using your browser\'s local storage to save alter profiles, journal logs, switch history, and internal conversations. This data never leaves your computer or phone.',
      storedText2: 'No external APIs or backup servers scrape this data. The Heaven Space team has absolutely zero technical access to what you create inside.',
      whatWeDontTitle: 'What We Do Not Do',
      noCollect: '✗ No data harvesting',
      noTrack: '✗ No tracking cookies',
      noAccount: '✗ No login required',
      noAnalytics: '✗ No user analytics',
      noAds: '✗ No advertisements',
      noShare: '✗ No third-party sharing',
      deleteTitle: 'Deleting Your Files',
      deleteText: 'You can wipe your database instantly by clearing your browser site cache (Browser Settings → Site Data → Heaven Space), or by uninstalling the application form your local device.',
      contactText: 'If you have any questions or feedback regarding this privacy policy:',
      footerNote: 'Heaven Space — Built with care for the pluriverse',

      aboutTitle: 'A space for every voice.',
      aboutSubtitle: 'Heaven Space — Plural System Management Tool',
      missionTitle: 'Our Mission',
      missionText1: 'Heaven Space is designed specifically for and with the plural community (DID, OSDD, and other forms of multiplicity). It provides a quiet, offline-safe haven to map out, understand, and honor every member of your system.',
      missionText2: 'Safely draft deep alter profiles, link subsystems, record daily internal journals, register switches, and use the inner chat workspace — privately on your device.',
      valuesTitle: 'Our Beliefs',
      valPrivacy: 'Ultimate Privacy',
      valPrivacyDesc: 'Your personal records stay in your hands. Period.',
      valBenevolence: 'Warm Safehaven',
      valBenevolenceDesc: 'Unconditional kindness and design safety for all system configurations.',
      valCommunity: 'Community Native',
      valCommunityDesc: 'Envisioned for and guided by plural voices.',
      valAccessibility: '100% Free',
      valAccessibilityDesc: 'Fully operational offline, no payments, no barrier entry. Seamless accountless synchronization via JSON files or direct PluralKit system integration.',
      featuresTitle: 'System Features',
      fA: '✦ Alter Directories',
      fB: '✦ Subsystem Visualizer',
      fC: '✦ Dynamic Internal Logs',
      fD: '✦ Beautiful Switch Records',
      fE: '✦ Internal Team Chats',
      fF: '✦ Vector Image Export',
      fG: '✦ Dark Mode & Themes',
      fH: '✦ Multilingual English/French',
      fI: '✦ Desktop/Mobile PWA support',
      openSourceTitle: 'Open Source',
      openSourceText: 'Heaven Space is a transparent open source project. The code is shared freely to ensure community accountability and sustainability.',

      contactHeadline: 'We are here.',
      contactSubtitle: 'Have a question, feedback, or a bug to report? Email us.',
      writeUsTitle: 'Reach Out',
      writeUsText: 'Heaven Space is maintained by a small, caring volunteer team. We do our best to reply whenever our energy allows.',
      whyContactTitle: 'Reasons to Contact Us',
      wcBug: '🐛 Bug Reports',
      wcSuggest: '💡 Request Features',
      wcPrivacy: '🔒 Privacy Questions',
      wcReturn: '💬 Creative Feedback',
      wcContrib: '🤝 Collaborate with Us',
      contactNote: 'Note: Since Heaven Space runs offline, do not submit sensitive system journals or private clinical profiles in emails.',
      clickToCopy: 'Click to copy',
      copied: '✓ Copied!',
    }
  };

  const currentT = t[lang];

  const [copied, setCopied] = useState(false);

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
          {(['privacy', 'about', 'contact'] as LegalPage[]).map((tab) => (
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
