import { useEffect, useState } from 'react';
import { formatOctets } from '../../domain/format';
import {
  demanderStockagePersistant,
  lireEspaceStockage,
  type EspaceStockage,
  type EtatPersistance,
} from '../../db/stockage';

// Espace occupé sur le téléphone et protection des données contre l'effacement automatique.

const EXPLICATIONS: Record<EtatPersistance, string> = {
  accorde: 'Protégé : Chrome ne supprimera pas les données, même si le téléphone manque de place.',
  refuse:
    "Non protégé pour l'instant : Chrome pourrait effacer les données si le téléphone manque de place. " +
    "La protection est en général accordée une fois l'appli installée sur l'écran d'accueil. " +
    'En attendant, faites des sauvegardes.',
  indisponible: 'Ce navigateur ne permet pas de protéger les données : faites des sauvegardes régulières.',
};

export function Stockage() {
  const [espace, setEspace] = useState<EspaceStockage>();
  const [persistance, setPersistance] = useState<EtatPersistance>();

  useEffect(() => {
    void lireEspaceStockage().then(setEspace);
    void demanderStockagePersistant().then(setPersistance);
  }, []);

  return (
    <>
      <dl className="infos">
        <dt>Utilisé par l'appli</dt>
        <dd>{espace ? formatOctets(espace.utiliseOctets) : '…'}</dd>
        <dt>Encore disponible</dt>
        <dd>{espace ? formatOctets(espace.disponibleOctets) : '…'}</dd>
      </dl>
      {persistance && (
        <p className={persistance === 'accorde' ? 'message message--ok' : 'message message--alerte'}>
          {EXPLICATIONS[persistance]}
        </p>
      )}
    </>
  );
}
