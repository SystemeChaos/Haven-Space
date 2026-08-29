# Haven Space 🌿

> Outil de gestion de système TDI/DID — projet personnel

**Haven Space** est une application web progressive (PWA) conçue pour les personnes vivant avec un Trouble Dissociatif de l'Identité (TDI/DID). Elle centralise la gestion du système en un seul endroit : fiches d'alters, registre des switchs, journal, chat interne, et plus encore.

---

## ✨ Fonctionnalités principales

### 👥 Gestion du système
- **Fiches d'alters** complètes : rôles, genre, sexualité, traits de personnalité, troubles & neurodivergences, description, notes internes, couleur, image de profil
- **Systèmes parallèles** et **sous-systèmes** avec navigation dédiée
- **Filtres par rôle** dans Mon Système pour retrouver rapidement les alters
- **Créateur de fiche** avec prévisualisation en temps réel et sélection du système/sous-système
- **Mapping** du système (visualisation graphique des alters)

### 🔄 Registre des switchs
- Déclaration de fronts avec statut (co-front, fronteur principal, dormant…)
- **Théorie des cuillères** (Spoon Theory) — suivi de l'énergie disponible
- **Roue des émotions** interactive (28 émotions sur axes énergie/valence) avec historique par alter
- Tags d'états du moment (lucide, dissocié·e, anxieux·se…)
- **Analytics** : chronologie ribbon, fréquence des switchs sur 7 jours, parts de front, analyse des émotions par alter

### 📓 Journal de bord
- Entrées en markdown avec support des images (syntaxe `![alt](url)`)
- Lightbox intégrée pour visualiser les images

### 📅 Planning (Bullet Journal)
- Planning façon Bullet Journal : vues journalière, hebdomadaire et mensuelle
- **Matrice d'Eisenhower** pour prioriser les tâches
- Rappels programmés par entrée, avec notification native au moment choisi

### 🩺 Santé
- Suivi des traitements, antécédents médicaux et contacts d'urgence
- Rappels de prise de traitement avec notification native

### 🧘 Détente
Boîte à outils anti-dissociation, accessible en un clic depuis n'importe où :
- **Box Breathing** — respiration guidée
- **Fidgets** — Bac à Sable, Bulles (bubble-wrap), Coloriage (mandalas et fleurs dessinés à la main, tracés fermés pour un remplissage sans débordement)
- **Kalimba** — instrument virtuel jouable
- **Affirmations**, **Boîte à Souvenirs**, **Boîte à Choix**
- **Éphémère** — bulles de tailles variées qui montent à l'écran, à éclater avant qu'elles n'atteignent le haut ; chaque taille correspond à une note d'un handpan (gamme D Kurd) pour un son doux et onirique
- **Éco-Système** — 4 paysages (Aquarium, Serre, Ciel nocturne, Jardin) avec présences et décors illustrés en aquarelle, cycle lumineux à 4 phases (aube/jour/crépuscule/nuit) suivant l'heure réelle

### 🔔 Notifications push
- Notifications navigateur natives (opt-in, avec demande de permission) pour : nouveaux messages privés, rappels de planning, rappels de traitement, rappel de sauvegarde JSON (si aucun export récent)
- Cliquer sur une notification ouvre l'app directement sur la section concernée

### 🔐 Sécurité locale
- Verrouillage par code PIN (optionnel), avec verrouillage automatique quand l'app repasse en arrière-plan
- Question de sécurité personnalisée pour la récupération du PIN
- **Confidentialité par fiche** : chaque alter peut protéger sa propre fiche avec un code facultatif et indépendant du PIN principal ; déverrouillage valable pour la session en cours

### 💬 Communication interne
- **Chat interne** entre alters du système
- **Messagerie directe** entre alters (conversations privées)
- Support du markdown dans les messages (gras, italique, images…)

### ⚓ Ancrage
- **Vérification de réalité** : heure et date en direct, champ "Où suis-je ?" (volontairement non sauvegardé), accès rapide au programme du jour
- **Landing Notes** : mot court laissé par le fronteur sortant pour la prochaine personne qui arrive, avec historique
- Techniques d'ancrage structurées en accordéon (travail du Dr Igor Thiriez, v3.1)
- **Mini annuaire** de contacts de confiance (thérapeute, proches) avec lien d'appel direct
- Bouton **SOS ⚠️** accessible depuis n'importe où dans l'app

### 🔗 Synchronisation
- Intégration **PluralKit** pour importer/synchroniser les données du système

### ⚙️ Personnalisation
- Plusieurs **thèmes visuels** (dont un thème été, sombre, clair…)
- Choix de la **police** d'affichage
- Support **français / anglais**
- Export et import des données en JSON (sauvegarde locale)

---

## 🛠️ Stack technique

- **React** + **TypeScript**
- **Tailwind CSS**
- **Vite**
- **PWA** (installable sur mobile et desktop)
- Données stockées en **localStorage** (aucun serveur, aucune donnée envoyée)
- Déployé sur **GitHub Pages**

---

## 🔒 Vie privée

Toutes les données restent **localement sur votre appareil**. Aucune donnée n'est transmise à un serveur externe. Haven Space ne collecte rien.

---

## 🚀 Lancer en local

**Prérequis :** Node.js

```bash
git clone https://github.com/SystemeChaos/Haven-Space.git
cd Haven-Space
npm install
npm run dev
```

L'app sera disponible sur `http://localhost:5173`.

---

## ⚠️ Projet personnel

Haven Space est un projet **personnel**, développé pour mes propres besoins. Le code source est disponible publiquement à titre de transparence, mais **je ne cherche pas de contributeurs externes** et ne garantis pas de support. N'hésitez pas à vous en inspirer pour vos propres projets !

---

## 🌐 Accès en ligne

👉 [systemechaos.github.io/Haven-Space](https://systemechaos.github.io/Haven-Space/)

---

*Haven Space n'est pas un outil médical. En cas de crise, contactez un professionnel de santé ou une ligne d'écoute.*
