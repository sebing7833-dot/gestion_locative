import { useSyncExternalStore } from 'react';
import { lireRoute, type RouteId } from './routes';

// Suit l'adresse « #/… » du navigateur : l'écran change quand on touche un bouton
// de la barre, mais aussi avec le bouton « retour » d'Android.

function abonner(changement: () => void): () => void {
  window.addEventListener('hashchange', changement);
  return () => window.removeEventListener('hashchange', changement);
}

export function useRoute(): RouteId {
  return useSyncExternalStore(abonner, () => lireRoute(window.location.hash));
}
