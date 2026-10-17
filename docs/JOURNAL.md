# Journal de bord

## 17/10/2026 — Semaine 1, étape 1 : démarrage du dépôt

**Fait**
- Dépôt git créé (branche `main`), relié à `github.com/sebing7833-dot/gestion_locative`.
- `.gitignore` : exclut `node_modules/`, les builds et les archives `.zip` (sauvegardes contenant des données personnelles).
- Modèle de bail meublé rangé dans `docs/legal/`.

**Reste (semaine 1)**
- Squelette Vite + React + TypeScript, navigation, Dexie, paramètres, PWA, déploiement.

**Problèmes connus**
- ~~Dépôt GitHub privé~~ : réglé le 17/10/2026, dépôt passé en public (GitHub Pages gratuit). E-mail des commits : adresse anonyme GitHub.

## 17/10/2026 — Semaine 1, étape 2 : squelette du projet

**Fait**
- Projet Vite + React + TypeScript (mode strict), ESLint, Vitest.
- Commandes : `dev`, `dev:phone` (HTTPS de test pour le S10 en Wi-Fi), `build`, `preview`, `test`, `lint`.
- `src/domain/format.ts` : dates en JJ/MM/AAAA, montants en centimes affichés « 1 234,56 € » (5 tests).

**Reste (semaine 1)**
- Navigation, Dexie, paramètres, PWA, déploiement.

**Problèmes connus**
- Le certificat HTTPS de `dev:phone` est un certificat de test : Chrome affiche un avertissement à accepter une fois.

## 17/10/2026 — Semaine 1, étape 4 : navigation et écrans vides

**Fait**
- Barre de navigation en bas (Accueil, Biens, Sauvegarde, Paramètres), boutons ≥ 48 px, icônes SVG intégrées.
- Petit routeur maison sur les adresses `#/…` (`src/app/routes.ts`, 3 tests) : compatible GitHub Pages et hors connexion ; le bouton « retour » d'Android fonctionne.
- Écrans vides pour les quatre rubriques ; couleurs contrastées (variables CSS).
- Étape 3 (test en Wi-Fi via `npm run dev:phone`) : serveur HTTPS vérifié sur le PC, test sur le S10 à faire par le propriétaire.

**Reste (semaine 1)**
- Dexie, écran Paramètres, PWA (icône), déploiement GitHub Pages.

**Problèmes connus**
- Aucun.

## 17/10/2026 — Semaine 1, étapes 3 et 5 : test en Wi-Fi, base de données locale

**Fait**
- Étape 3 validée sur le S10 : navigation, bouton « retour », barre du bas visible.
  - Le serveur doit être lancé depuis le dossier du projet : `cd ~/Documents/code/gestion_locative` puis `npm run dev:phone`.
  - Pare-feu du PC : port 5173 ouvert au réseau local (`sudo ufw allow from 192.168.1.0/24 to any port 5173 proto tcp`).
  - Le téléphone n'atteignait pas le PC au début (réglage du téléphone, corrigé par le propriétaire).
- Port 5173 fixé dans `vite.config.ts` : erreur claire si le serveur est déjà lancé.
- Base IndexedDB (Dexie), schéma version 1 : tables `bailleurs` et `parametres` (`src/db/`).
  - Règle de migration écrite en tête de `src/db/base.ts` ; `SCHEMA_VERSION` servira aux sauvegardes zip.
  - Chaque modification est enregistrée immédiatement (`modifierBailleur`, `modifierParametre`).
- Demande de stockage persistant à l'ouverture de l'appli ; lecture de l'espace utilisé.
- 5 tests de la base (avec fake-indexeddb), 13 tests au total.

**Reste (semaine 1)**
- Écran Paramètres, PWA (icône), déploiement GitHub Pages.

**Problèmes connus**
- Chrome n'accorde souvent le stockage persistant qu'une fois l'appli installée : à vérifier à l'étape 7.

## 17/10/2026 — Semaine 1, étape 6 : écran Paramètres

**Fait**
- Identité du bailleur enregistrée à chaque lettre tapée, avec « ✓ Enregistré automatiquement » ou une alerte en cas d'échec.
- Qualité des photos : trois boutons (Économe 0,7 / Normale 0,8 / Haute 0,9).
- Stockage : espace utilisé et disponible, état de la protection contre l'effacement, avec explication.
- `formatOctets` (« 12,3 Mo ») et composant réutilisable `ChampTexte` ; 14 tests au total.

**Reste (semaine 1)**
- PWA (icône, mode avion), déploiement GitHub Pages.

**Problèmes connus**
- Écrire à chaque lettre n'est pas vérifié sur le S10 pour la fluidité : à confirmer.
