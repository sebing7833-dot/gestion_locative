// Stockage persistant et espace disque, via l'API navigator.storage du navigateur.

export type EtatPersistance = 'accorde' | 'refuse' | 'indisponible';

export interface EspaceStockage {
  utiliseOctets: number;
  disponibleOctets: number;
}

/**
 * Demande au navigateur de ne jamais effacer nos données en cas de manque de place.
 * Sans cela, Chrome peut vider IndexedDB d'un site peu utilisé quand le disque est plein.
 * Chrome décide seul (pas de question posée) ; l'accord est plus probable
 * une fois l'appli installée sur l'écran d'accueil.
 */
export async function demanderStockagePersistant(): Promise<EtatPersistance> {
  if (!navigator.storage?.persist) return 'indisponible';
  if (await navigator.storage.persisted()) return 'accorde';
  return (await navigator.storage.persist()) ? 'accorde' : 'refuse';
}

/** Espace utilisé par l'appli et espace que le navigateur lui laisse, ou undefined si inconnu. */
export async function lireEspaceStockage(): Promise<EspaceStockage | undefined> {
  if (!navigator.storage?.estimate) return undefined;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { utiliseOctets: usage, disponibleOctets: Math.max(quota - usage, 0) };
}
