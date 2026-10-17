import { useRegisterSW } from 'virtual:pwa-register/react';

// Bandeaux liés à l'installation de l'appli dans le téléphone (service worker) :
// - « prête hors connexion » : affiché une fois, quand toute l'appli est enregistrée ;
// - « nouvelle version » : la mise à jour n'est faite que sur demande, jamais
//   automatiquement, pour ne pas recharger l'appli pendant une saisie.
export function MiseAJour() {
  const {
    offlineReady: [horsConnexionPret, setHorsConnexionPret],
    needRefresh: [nouvelleVersion, setNouvelleVersion],
    updateServiceWorker,
  } = useRegisterSW();

  if (nouvelleVersion) {
    return (
      <div className="bandeau" role="status">
        <span>Nouvelle version disponible.</span>
        <button type="button" className="bandeau__bouton" onClick={() => void updateServiceWorker(true)}>
          Mettre à jour
        </button>
        <button type="button" className="bandeau__bouton bandeau__bouton--discret" onClick={() => setNouvelleVersion(false)}>
          Plus tard
        </button>
      </div>
    );
  }

  if (horsConnexionPret) {
    return (
      <div className="bandeau" role="status">
        <span>✓ L'appli fonctionne maintenant hors connexion.</span>
        <button type="button" className="bandeau__bouton" onClick={() => setHorsConnexionPret(false)}>
          OK
        </button>
      </div>
    );
  }

  return null;
}
