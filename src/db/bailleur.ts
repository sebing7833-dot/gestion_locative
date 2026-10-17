import { base, type BaseGestion } from './base';
import type { Bailleur, ChampsBailleur } from './types';

// Accès au bailleur. Il n'y en a qu'un en v1 (le propriétaire), mais il est
// stocké dans une table pour rester compatible avec une future synchronisation.

export const BAILLEUR_VIDE: ChampsBailleur = {
  nom: '',
  prenom: '',
  adresse: '',
  email: '',
  telephone: '',
};

/** Le bailleur enregistré, ou undefined s'il n'a pas encore été saisi. */
export async function lireBailleur(db: BaseGestion = base): Promise<Bailleur | undefined> {
  return db.bailleurs.toCollection().first();
}

/**
 * Enregistre immédiatement les champs modifiés du bailleur.
 * Crée la fiche à la première saisie ; ensuite, garde son id et sa date de création.
 */
export async function modifierBailleur(
  champs: Partial<ChampsBailleur>,
  db: BaseGestion = base,
): Promise<Bailleur> {
  return db.transaction('rw', db.bailleurs, async () => {
    const maintenant = new Date().toISOString();
    const existant = await lireBailleur(db);
    const bailleur: Bailleur = existant
      ? { ...existant, ...champs, updatedAt: maintenant }
      : {
          ...BAILLEUR_VIDE,
          ...champs,
          id: crypto.randomUUID(),
          createdAt: maintenant,
          updatedAt: maintenant,
        };
    await db.bailleurs.put(bailleur);
    return bailleur;
  });
}
