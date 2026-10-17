import { base, type BaseGestion } from './base';
import { PARAMETRES_PAR_DEFAUT, type Parametres } from './types';

// Accès aux réglages : chaque réglage absent de la base prend sa valeur par défaut.

/** Tous les réglages, complétés par les valeurs par défaut. */
export async function lireParametres(db: BaseGestion = base): Promise<Parametres> {
  const lignes = await db.parametres.toArray();
  const enregistres = Object.fromEntries(lignes.map((l) => [l.cle, l.valeur]));
  return { ...PARAMETRES_PAR_DEFAUT, ...enregistres };
}

/** Enregistre immédiatement un réglage. */
export async function modifierParametre<K extends keyof Parametres>(
  cle: K,
  valeur: Parametres[K],
  db: BaseGestion = base,
): Promise<void> {
  await db.parametres.put({ cle, valeur });
}
