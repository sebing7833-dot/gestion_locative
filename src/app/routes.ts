// Liste des écrans accessibles depuis la barre de navigation, et lecture de l'adresse.
// Les adresses sont de la forme « #/parametres » : GitHub Pages ne sert que la page
// d'accueil, et la partie après « # » est gérée entièrement par l'appli (hors connexion).

export type RouteId = 'accueil' | 'biens' | 'sauvegarde' | 'parametres';

export interface Route {
  id: RouteId;
  titre: string;
}

export const ROUTES: readonly Route[] = [
  { id: 'accueil', titre: 'Accueil' },
  { id: 'biens', titre: 'Biens' },
  { id: 'sauvegarde', titre: 'Sauvegarde' },
  { id: 'parametres', titre: 'Paramètres' },
];

/** « #/biens » → 'biens'. Une adresse vide ou inconnue renvoie à l'accueil. */
export function lireRoute(hash: string): RouteId {
  const id = hash.replace(/^#\/?/, '').split('/')[0];
  return ROUTES.find((r) => r.id === id)?.id ?? 'accueil';
}

/** 'biens' → « #/biens ». */
export function adresseDe(id: RouteId): string {
  return `#/${id}`;
}
