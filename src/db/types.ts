// Types des données enregistrées sur le téléphone (IndexedDB).
// Dates en ISO 8601, montants en centimes entiers (voir CLAUDE.md).

/** Champs communs à toutes les entités, prévus pour une future synchronisation. */
export interface Entite {
  id: string; // UUID
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Bailleur extends Entite {
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
}

/** Champs du bailleur modifiables depuis l'écran Paramètres. */
export type ChampsBailleur = Omit<Bailleur, keyof Entite>;

/** Réglages de l'appli (un seul jeu, stocké clé par clé). */
export interface Parametres {
  /** Qualité JPEG des photos compressées, entre 0,5 et 1. */
  qualitePhoto: number;
}

export const PARAMETRES_PAR_DEFAUT: Parametres = {
  qualitePhoto: 0.8,
};

/** Ligne de la table « parametres » : une clé, une valeur. */
export interface LigneParametre {
  cle: keyof Parametres;
  valeur: Parametres[keyof Parametres];
}
