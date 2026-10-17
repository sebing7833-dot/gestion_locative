import { formatDate } from '../domain/format';

// Écran provisoire : biens, baux en cours, EDL en brouillon et alerte de sauvegarde
// arriveront dans les semaines suivantes.
export function AccueilPage() {
  return (
    <>
      <p>Aujourd'hui : {formatDate(new Date().toISOString())}</p>
      <p className="vide">Aucun bien pour l'instant.</p>
    </>
  );
}
