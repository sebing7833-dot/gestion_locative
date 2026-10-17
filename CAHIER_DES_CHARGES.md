# Cahier des charges — Application de gestion locative personnelle

> Version 1.0 — octobre 2026
> Objectif : remplacer Qalimo pour mes besoins personnels (1 F2 meublé en LMNP, peut-être un 2e bien plus tard).
> Livraison visée : fin novembre 2026, pour une première utilisation réelle en décembre 2026.

---

## 1. Contexte

Je suis propriétaire bailleur particulier, en LMNP au régime réel. Je loue un F2 **meublé** (bail meublé, loi du 6 juillet 1989, titre Ier bis).
La comptabilité et la liasse fiscale sont confiées à un **comptable externe** : elles sont **hors périmètre**.

Je veux une application simple, gratuite, qui m'appartient, et qui couvre :

1. **L'état des lieux** d'entrée et de sortie, réalisé **directement sur mon téléphone** dans le logement (priorité n°1).
2. **Le bail meublé** pré-rempli à partir du **modèle officiel**.
3. **La révision annuelle du loyer** selon l'IRL.
4. **Les quittances de loyer**.

Qalimo reste un filet de sécurité gratuit (essai 30 jours) pour la première entrée de décembre.

---

## 2. Contraintes

| Contrainte | Détail |
|---|---|
| Coût | **0 €**. Aucun service payant, aucun abonnement. Hébergement statique gratuit (GitHub Pages ou équivalent). |
| Téléphone | **Samsung Galaxy S10** (2019), navigateur Chrome. L'appli doit rester fluide sur ce matériel. |
| Hors connexion | L'appli doit fonctionner **entièrement en mode avion** une fois installée. Le logement peut ne pas avoir de réseau. |
| Données | Les données restent **sur l'appareil** (téléphone). **Aucune donnée personnelle n'est envoyée sur un serveur.** |
| Ordinateur de développement | **Linux Mint**, développement avec Claude Code. |
| Fiabilité | Ne **jamais** perdre de données : sauvegarde automatique à chaque modification. L'état des lieux est un document de preuve. |
| Langue | Interface 100 % en français. Dates au format JJ/MM/AAAA, montants en euros avec virgule. |
| Évolutivité | Architecture prévue pour ajouter **plus tard** une synchronisation vers un serveur personnel, sans tout réécrire. |

---

## 3. Choix techniques

| Besoin | Choix | Pourquoi |
|---|---|---|
| Type d'application | **PWA** (application web installable, hors connexion) | Installable sur le S10 comme une appli, fonctionne sans réseau, gratuite à héberger. |
| Langage / framework | **TypeScript + React + Vite** | Standard, bien maîtrisé par Claude Code, rapide. |
| Mode hors connexion | **vite-plugin-pwa** (service worker Workbox) | Met en cache l'application pour un usage en mode avion. |
| Stockage local | **IndexedDB via Dexie.js** | Stocke données et photos (Blob) sur le téléphone, robuste, volumineux. |
| Stockage persistant | `navigator.storage.persist()` | Demande au navigateur de ne pas effacer les données en cas de manque d'espace. |
| Photos | Capture via `<input type="file" accept="image/*" capture="environment">` + **compression** (canvas, ~1600 px, JPEG qualité ~0,8) | Simple, compatible S10, photos légères. |
| Signature | **signature_pad** sur un canvas | Signature au doigt, export en image. |
| Génération PDF | **pdf-lib** (ou jsPDF), côté téléphone | PDF produit hors connexion, sans serveur. |
| Sauvegarde / export | **JSZip** : archive `.zip` contenant `data.json` + dossier `photos/` + PDF | Format ouvert, lisible sans l'application. |
| Partage | **Web Share API** (`navigator.share`) | Envoyer le PDF par e-mail/messagerie depuis le téléphone. |
| Style | CSS simple (ou Tailwind) — gros boutons, lisible en extérieur | Utilisation debout, une main, dans un logement. |
| Tests | **Vitest** (logique : calculs IRL, quittances) + tests manuels sur le S10 | |
| Hébergement | **GitHub Pages** (HTTPS gratuit, requis pour PWA et appareil photo) | Ne contient que le code, jamais les données. |

**Développement sur le téléphone** : le serveur Vite est accessible sur le réseau local (`vite --host`). L'appareil photo et le service worker exigeant HTTPS hors `localhost`, utiliser `@vitejs/plugin-basic-ssl` pour les tests sur le S10 en Wi-Fi, ou tester sur la version déployée.

---

## 4. Modèle de données

Toutes les entités ont : `id` (UUID), `createdAt`, `updatedAt`.

### Bailleur
- nom, prénom, adresse, e-mail, téléphone

### Bien
- libellé (ex. « F2 Cergy »), adresse complète, étage, n° de lot / porte
- type (appartement), surface habitable (m²), nombre de pièces principales
- meublé : oui
- classe DPE (A à G) — **bloque la révision du loyer si F ou G**
- zone tendue / encadrement des loyers : oui / non (à renseigner par moi)
- équipements et annexes (cave, parking, etc.)
- **modèle de pièces** du bien (liste des pièces et de leurs éléments, réutilisé à chaque état des lieux)

### Locataire
- nom, prénom, date et lieu de naissance, e-mail, téléphone
- (pas de stockage de pièce d'identité ni de justificatifs de revenus)

### Garant (optionnel)
- nom, prénom, adresse, e-mail, téléphone

### Bail
- bien, locataire(s), garant(s)
- type : meublé (1 an) / étudiant (9 mois) / mobilité (1 à 10 mois)
- date de prise d'effet, durée, date de signature
- loyer hors charges, charges (provision ou forfait), mode de paiement, jour d'échéance
- dépôt de garantie (contrôle : ≤ 2 mois de loyer hors charges pour un meublé)
- révision : trimestre IRL de référence (ex. « T2 »), valeur IRL de référence, année
- statut : brouillon / signé / terminé
- PDF signé (fichier joint)

### Pièce (pour un état des lieux)
- nom (Entrée, Séjour, Chambre, Cuisine, Salle d'eau, WC, Cave…), ordre
- éléments : liste

### Élément
- catégorie (sol, murs, plafond, menuiseries, électricité, plomberie, équipement, mobilier…)
- libellé (ex. « Murs », « Prise électrique », « Plaque de cuisson »)
- état : **Neuf / Bon état / État d'usage / Mauvais état / Hors service**
- fonctionnement (si pertinent) : fonctionne / ne fonctionne pas / non testé
- commentaire libre
- photos : liste de références vers des photos

### Photo
- Blob compressé, largeur, hauteur, date/heure de prise
- rattachée à : un élément, une pièce, un compteur ou l'état des lieux

### État des lieux (EDL)
- bail, type : **entrée / sortie**
- date et heure, adresse
- présents : bailleur (ou représentant), locataire(s)
- pièces → éléments (avec état, commentaire, photos)
- inventaire du mobilier (voir 5.1.4)
- relevés de compteurs : électricité (HP/HC), gaz, eau froide, eau chaude — index + photo
- chauffage et eau chaude : type (individuel / collectif), état
- clés remises : type (porte, boîte aux lettres, badge, garage…), nombre
- observations générales
- signatures : bailleur, locataire(s) — image + date/heure
- statut : **brouillon / signé (verrouillé)**
- pour une sortie : lien vers l'EDL d'entrée de référence
- PDF généré

### IRL
- année, trimestre (T1 à T4), valeur, date de publication

### Révision de loyer
- bail, date d'effet, ancien loyer, IRL ancien, IRL nouveau, nouveau loyer, courrier PDF

### Paiement / Quittance
- bail, période (mois/année), loyer, charges, total, date de paiement, mode
- statut : attendu / payé / partiel / en retard
- quittance PDF, date d'envoi

---

## 5. Fonctionnalités

Priorités : **P1** = indispensable pour décembre · **P2** = souhaitable avant décembre · **P3** = après décembre.

### 5.1 Module État des lieux — P1 (priorité absolue)

#### 5.1.1 Préparation (sur ordinateur ou téléphone)
- Définir une fois pour toutes le **modèle de pièces** du bien (ex. pour un F2 : Entrée, Séjour, Chambre, Cuisine, Salle d'eau, WC).
- Chaque pièce est pré-remplie avec des éléments types (sol, murs, plafond, porte, fenêtre, volets, prises, interrupteurs, éclairage, radiateur), que je peux ajouter, retirer, renommer.
- Créer un EDL d'entrée à partir d'un bail : les infos (adresse, parties, date) sont reprises automatiquement.

#### 5.1.2 Saisie dans le logement (sur le S10, hors connexion)
- Parcours **pièce par pièce**, élément par élément, avec de gros boutons pour l'état (un tap = un état).
- Bouton **📷 Photo** sur chaque élément : prise de vue, compression immédiate, miniature affichée.
- Commentaire libre (dictée vocale du clavier Android utilisable).
- Indicateur de progression : pièces terminées / restantes, éléments sans état.
- **Sauvegarde automatique à chaque modification** (aucun bouton « Enregistrer » nécessaire).
- Reprise exacte là où je me suis arrêté si l'appli est fermée, le téléphone verrouillé ou redémarré.
- Fonctionne en **mode avion** de bout en bout.

#### 5.1.3 Compteurs, clés, chauffage
- Saisie des index (avec photo du compteur) : électricité HP/HC, gaz, eau froide, eau chaude.
- Liste des clés remises (type + nombre).
- Type et état du chauffage et de la production d'eau chaude.

#### 5.1.4 Inventaire du mobilier (obligatoire en meublé)
- Liste pré-remplie avec les **éléments minimums obligatoires** (décret n° 2015-981 du 31 juillet 2015) :
  1. Literie comprenant couette ou couverture
  2. Dispositif d'occultation des fenêtres dans les pièces destinées à être utilisées comme chambre à coucher
  3. Plaques de cuisson
  4. Four ou four à micro-ondes
  5. Réfrigérateur et congélateur, ou réfrigérateur avec compartiment congélation (≤ -6 °C)
  6. Vaisselle nécessaire à la prise des repas
  7. Ustensiles de cuisine
  8. Table et sièges
  9. Étagères de rangement
  10. Luminaires
  11. Matériel d'entretien ménager adapté aux caractéristiques du logement
- Pour chaque élément : quantité, état, commentaire, photo.
- Ajout libre d'autres meubles et équipements (canapé, TV, lave-linge…).
- **Alerte** si un élément obligatoire est absent ou à quantité 0.

#### 5.1.5 Signature et verrouillage
- Écran récapitulatif avant signature (nombre de pièces, photos, éléments sans état → alerte).
- Signature au doigt du bailleur et de chaque locataire, avec nom et date/heure.
- Après signature : l'EDL est **verrouillé** (lecture seule). Toute correction crée une nouvelle version, l'original reste conservé.

#### 5.1.6 Génération du PDF
- PDF généré **sur le téléphone, hors connexion**, contenant :
  - en-tête : type (entrée/sortie), date, adresse du logement, identité des parties
  - pièce par pièce : tableau élément / état / fonctionnement / commentaire
  - photos (miniatures lisibles, 2 à 4 par ligne) avec légende (pièce, élément, date/heure)
  - inventaire du mobilier
  - compteurs, clés, chauffage
  - observations
  - signatures
  - pied de page : numérotation « page X / Y »
- Partage immédiat via le menu de partage Android (e-mail, messagerie).

#### 5.1.7 État des lieux de sortie — P2
- Création à partir de l'EDL d'entrée : mêmes pièces, mêmes éléments, état d'entrée affiché à côté.
- Mise en évidence automatique des **différences** (dégradation d'un ou plusieurs niveaux).
- PDF de sortie avec colonne « état à l'entrée » / « état à la sortie ».

#### 5.1.8 Reprise d'un EDL d'entrée réalisé ailleurs (Qalimo) — P3
- Saisie manuelle assistée d'un EDL existant (états, commentaires) avec import des photos depuis la galerie.
- Rattachement du PDF signé d'origine comme **document de référence**.
- L'EDL repris est marqué « importé » (source : Qalimo, date).

### 5.2 Module Bail meublé — P2

- **Le texte du bail n'est pas rédigé par l'application** : il provient du **modèle type officiel** de bail meublé (annexe 2 du décret n° 2015-587 du 29 mai 2015), que je fournis dans `docs/legal/`.
- **Version à utiliser** : celle **en vigueur pour un bail signé après le 1er octobre 2026**, donc intégrant le décret n° 2026-596 du 6 juillet 2026 (téléphones facultatifs des parties, nouvelles clauses résolutoires).
- Formulaire de saisie des champs variables (parties, logement, dates, loyer, charges, dépôt de garantie, IRL de référence, équipements, annexes).
- Champs à ne pas oublier : **identifiant fiscal du logement**, **classe DPE**, **estimation des dépenses annuelles d'énergie** (reprise du DPE), **dernier loyer du précédent locataire** (ou mention « première location »), période de construction, modes de chauffage et d'eau chaude, raccordement TV/Internet.
- Contrôles :
  - dépôt de garantie ≤ 2 mois de loyer hors charges
  - durée cohérente avec le type de bail
  - champs obligatoires remplis
- Génération d'un **PDF** (et si possible d'un export modifiable) à relire avant signature.
- Liste des **annexes à joindre** rappelée (diagnostics : DPE, ERP, électricité/gaz si applicables, plomb, amiante, règlement de copropriété extraits, notice d'information, EDL, inventaire).
- Signature sur **papier** ; le PDF signé et scanné peut être rattaché au bail.

### 5.3 Module Révision IRL — P2 (logique) / P3 (courrier)

- Saisie des valeurs IRL publiées par l'INSEE (table locale, 4 valeurs par an).
- Calcul : **nouveau loyer HC = loyer HC actuel × IRL du trimestre de référence de l'année N ÷ IRL du même trimestre de l'année N-1**, arrondi au centime.
- **Blocage** si le DPE du bien est F ou G (gel des loyers).
- Alerte à l'approche de la date de révision prévue au bail ; rappel que la révision non demandée dans l'année ne peut pas être rétroactive.
- Génération d'un **courrier PDF** de révision au locataire avec le détail du calcul.
- Historique des révisions.

### 5.4 Module Paiements et quittances — P3

- Échéancier mensuel généré à partir du bail.
- Marquer un loyer comme payé (date, montant, mode) en un tap ; gestion des paiements partiels.
- Génération de la **quittance PDF** : nom du bailleur et du locataire, adresse du logement, période, **loyer et charges distingués**, total, date de paiement, mention « quittance gratuite ». Un paiement partiel donne un **reçu**, pas une quittance.
- Envoi via le menu de partage.
- Vue « en retard » et récapitulatif annuel (export CSV pour le comptable).

### 5.5 Sauvegarde, export et restauration — P1

- **Export complet** en un bouton : archive `.zip` horodatée contenant `data.json` (toutes les données), `photos/` (fichiers JPEG nommés lisiblement) et `pdf/`.
- Export d'**un seul EDL** (zip ou PDF).
- **Import / restauration** d'une archive (sur le téléphone ou sur l'ordinateur), avec confirmation avant écrasement.
- Rappel visible : « Dernière sauvegarde il y a X jours » ; alerte après la signature d'un EDL tant qu'aucun export n'a été fait.
- L'archive doit rester lisible **sans l'application** (JSON clair + photos + PDF).
- Le format de `data.json` est versionné (`schemaVersion`) pour permettre les migrations.

### 5.6 Paramètres — P1
- Identité du bailleur.
- Qualité de compression des photos.
- Espace de stockage utilisé / disponible ; état de la demande de stockage persistant.

---

## 6. Écrans

1. **Accueil** : mes biens, baux en cours, EDL en brouillon, alerte de sauvegarde.
2. **Bien** : fiche, modèle de pièces, inventaire de référence.
3. **Bail** : formulaire, aperçu PDF, statut.
4. **Liste des EDL** d'un bail.
5. **Saisie EDL** : navigation par pièces → éléments → état / photos / commentaire.
6. **Inventaire mobilier**.
7. **Compteurs et clés**.
8. **Récapitulatif et signatures**.
9. **Aperçu / partage PDF**.
10. **IRL et révisions**.
11. **Paiements et quittances**.
12. **Sauvegarde / restauration**.
13. **Paramètres**.

Ergonomie : utilisable **d'une main, debout**, boutons ≥ 48 px, contraste élevé, pas de menus profonds pendant la saisie de l'EDL.

---

## 7. Références légales (à vérifier sur Légifrance au moment du développement)

| Sujet | Texte |
|---|---|
| Rapports locatifs, bail, EDL, quittance | Loi n° 89-462 du 6 juillet 1989 (notamment art. 3, 3-2, 17-1, 21 ; titre Ier bis pour le meublé, art. 25-3 et suivants) |
| Contrats types de bail (nu et meublé) | Décret n° 2015-587 du 29 mai 2015, modifié notamment par le décret n° 2026-596 du 6 juillet 2026 (baux conclus à partir du 1er octobre 2026) |
| Notice d'information à annexer au bail | Arrêté du 29 mai 2015 modifié par l'arrêté du 16 février 2023 |
| État des lieux et inventaire du mobilier | Décret n° 2016-382 du 30 mars 2016 |
| Liste minimale du mobilier d'un meublé | Décret n° 2015-981 du 31 juillet 2015 |
| Gel des loyers des logements F et G | Loi n° 2021-1104 du 22 août 2021 (Climat et résilience) |
| Valeurs de l'IRL | Publications trimestrielles de l'INSEE |

**Règle** : aucun texte juridique ne doit être rédigé « de mémoire » par l'IA. Les textes officiels sont copiés depuis Légifrance / service-public.fr dans `docs/legal/` et utilisés tels quels.

---

## 8. Confidentialité (RGPD)

- Données du locataire stockées **uniquement sur l'appareil** et dans mes sauvegardes personnelles.
- **Aucun** outil de statistiques, publicité, police ou script chargé depuis un service tiers à l'exécution.
- Ne collecter que le nécessaire (pas de pièce d'identité, pas de justificatifs de revenus).
- Possibilité de **supprimer** toutes les données d'un locataire (avec confirmation).

---

## 9. Planning (8 semaines)

| Semaine | Contenu | Livrable |
|---|---|---|
| 1 | Socle : projet Vite/React/TS, PWA installable, Dexie, navigation, paramètres, déploiement GitHub Pages | Appli vide installée sur le S10, fonctionne en mode avion |
| 2 | Biens, modèle de pièces, baux (données seulement) | Je peux décrire mon F2 et créer un bail brouillon |
| 3 | Saisie EDL : pièces, éléments, états, commentaires, sauvegarde auto | EDL complet sans photos |
| 4 | Photos (capture, compression, miniatures), compteurs, clés, inventaire mobilier | EDL complet avec photos |
| 5 | Signatures, verrouillage, **PDF de l'EDL**, partage | **EDL de bout en bout** |
| 6 | **Export / restauration zip**, alertes de sauvegarde ; test complet chez moi | Sauvegarde fiable |
| 7 | Bail meublé pré-rempli + PDF ; calcul IRL | Bail prêt à relire |
| 8 | Corrections, **répétition générale dans le F2 vide**, quittances si le temps le permet | Décision pour décembre |

---

## 10. Critères « prêt pour décembre »

L'application est utilisée pour le vrai EDL d'entrée **uniquement si tous** ces points sont validés lors de la répétition générale :

- [ ] Un EDL complet du F2 réalisé sur le S10 sans bug ni perte de données
- [ ] Fonctionne de bout en bout en **mode avion**
- [ ] Photos nettes, bien rattachées aux bons éléments, appli fluide avec 100+ photos
- [ ] Reprise correcte après fermeture forcée de l'appli et redémarrage du téléphone
- [ ] Signature au doigt de deux personnes
- [ ] PDF complet, lisible, avec photos et signatures
- [ ] Export zip réussi **et restauration testée** sur un autre navigateur / l'ordinateur

Sinon : l'EDL d'entrée est fait avec Qalimo (essai gratuit), puis repris dans l'application (5.1.8).

---

## 11. Évolutions futures (hors périmètre v1)

- Synchronisation et sauvegarde automatique vers un **serveur personnel** (en ligne ou à la maison).
- Régularisation annuelle des charges.
- Modèles de courriers (relance, mise en demeure, congé).
- Gestion d'un 2e bien (déjà prévu par le modèle de données).
- Export comptable plus complet pour le comptable.
