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
