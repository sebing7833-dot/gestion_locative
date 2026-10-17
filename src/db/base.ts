import Dexie, { type EntityTable } from 'dexie';
import type { Bailleur, LigneParametre } from './types';

// Base IndexedDB de l'appli, sur le téléphone uniquement.
//
// Règle : on ne modifie JAMAIS une version déjà publiée. Pour changer le schéma,
// on AJOUTE une version (2, 3…) avec, si besoin, une fonction .upgrade() qui
// transforme les données existantes. Dexie applique les versions manquantes
// à l'ouverture, dans l'ordre. SCHEMA_VERSION est recopié dans les sauvegardes zip.

export const SCHEMA_VERSION = 1;

export class BaseGestion extends Dexie {
  bailleurs!: EntityTable<Bailleur, 'id'>;
  parametres!: EntityTable<LigneParametre, 'cle'>;

  constructor(nom = 'gestion-locative') {
    super(nom);

    // Version 1 (octobre 2026) : bailleur et paramètres.
    // Seuls les champs indexés sont listés ici ; les autres sont enregistrés quand même.
    this.version(1).stores({
      bailleurs: 'id',
      parametres: 'cle',
    });
  }
}

export const base = new BaseGestion();
