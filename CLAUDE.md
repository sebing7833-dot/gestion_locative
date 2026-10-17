# CLAUDE.md — Gestion locative perso

Ce fichier donne les règles de travail pour ce projet. Le **quoi** est dans `CAHIER_DES_CHARGES.md` : lis-le avant toute nouvelle fonctionnalité.

## Le projet en bref

PWA personnelle de gestion locative pour **un F2 meublé (LMNP)** : état des lieux sur téléphone (priorité n°1), bail meublé pré-rempli, révision IRL, quittances.
Utilisateur unique : le propriétaire. Développeur : lui, avec toi. Il a des bases (VBA, Access) mais n'est pas développeur web : **explique simplement ce que tu fais et pourquoi**, en français.

## Contraintes non négociables

1. **Hors connexion d'abord** : tout doit marcher en mode avion une fois l'appli installée. Aucun appel réseau à l'exécution (pas de CDN, pas d'API, pas de polices externes).
2. **Zéro perte de données** : chaque modification est enregistrée immédiatement dans IndexedDB. Pas de bouton « Enregistrer » pour la saisie. Un EDL signé est **verrouillé** ; une correction crée une nouvelle version.
3. **Données uniquement sur l'appareil** : aucune donnée personnelle envoyée où que ce soit. Aucun outil d'analyse, de télémétrie ou de publicité.
4. **Matériel cible : Samsung Galaxy S10 + Chrome.** Penser performance : photos compressées (~1600 px, JPEG ~0,8), listes virtualisées si besoin, pas de bibliothèque lourde inutile.
5. **Coût 0 €** : aucune dépendance ou service payant.
6. **Textes juridiques** : ne **jamais** rédiger de texte légal de mémoire (bail, mentions obligatoires, clauses). Utiliser uniquement les textes fournis dans `docs/legal/`. S'il manque un texte, **demande-le** au lieu de l'inventer.
7. **Interface 100 % en français**, dates JJ/MM/AAAA, montants `1 234,56 €`.

## Stack

- TypeScript (strict) + React + Vite
- vite-plugin-pwa (Workbox) pour le hors connexion
- Dexie.js (IndexedDB) pour données et photos (Blob)
- signature_pad, pdf-lib (ou jsPDF), JSZip
- Vitest pour les tests unitaires
- Déploiement : GitHub Pages

**Demande avant d'ajouter une nouvelle dépendance.** Préfère les API du navigateur quand elles suffisent.

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # serveur de dev (localhost)
npm run dev:phone    # serveur accessible en Wi-Fi depuis le S10 (vite --host + HTTPS basic-ssl)
npm run build        # build de production
npm run preview      # tester le build localement
npm test             # tests Vitest
npm run lint         # vérification du code
```

Si une commande n'existe pas encore dans `package.json`, crée-la.

## Organisation du code

```
src/
  app/            # routes, mise en page, navigation
  db/             # schéma Dexie, migrations, accès aux données
  domain/         # logique métier pure, sans React (IRL, quittances, contrôles du bail, comparaison EDL)
  features/
    biens/
    baux/
    edl/          # saisie, photos, inventaire, compteurs, signatures
    irl/
    quittances/
    sauvegarde/   # export / import zip
    parametres/
  pdf/            # génération des PDF (EDL, bail, quittance, courrier IRL)
  components/     # composants d'interface réutilisables
docs/
  legal/          # textes officiels copiés depuis Légifrance (fournis par le propriétaire)
  JOURNAL.md      # journal de bord du projet
```

- Logique métier dans `src/domain/`, **testée** avec Vitest (surtout calcul IRL, montants, contrôles du dépôt de garantie, différences entrée/sortie).
- Montants en **centimes (entiers)** dans les données, jamais en flottants.
- Dates stockées en ISO 8601.
- Toute évolution du schéma Dexie passe par une **migration versionnée** ; les sauvegardes zip contiennent `schemaVersion`.

## Façon de travailler

- Avance **par petites étapes** qui fonctionnent, dans l'ordre du planning du cahier des charges (section 9).
- Avant une fonctionnalité importante : propose un court plan, puis attends mon accord.
- Après chaque étape : lance `npm run build` et `npm test`, corrige les erreurs, puis résume en 3-5 lignes ce qui a changé et **comment je peux le tester sur le S10**.
- Fais un commit git par étape, avec un message clair en français.
- Tiens à jour `docs/JOURNAL.md` : date, ce qui a été fait, ce qui reste, problèmes connus.
- En cas de doute sur un besoin, **pose la question** plutôt que de deviner.

## Définition de « terminé »

Une fonctionnalité est terminée quand :
- elle marche sur le S10 **en mode avion** ;
- les données survivent à une fermeture forcée de l'appli et à un redémarrage du téléphone ;
- elle est incluse dans l'export zip et restaurée correctement à l'import ;
- le build et les tests passent ;
- le journal est mis à jour.

## À ne pas faire

- Pas de backend, pas de base de données distante, pas de compte utilisateur (v1).
- Pas de chargement de ressources externes à l'exécution.
- Pas de suppression de données sans confirmation explicite.
- Pas de reproduction de contenus ou de documents d'un logiciel commercial (ex. Qalimo) : on s'appuie sur les textes officiels.
