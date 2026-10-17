import { useLiveQuery } from 'dexie-react-hooks';
import { lireParametres, modifierParametre } from '../../db/parametres';

// Qualité JPEG des photos : un tap = un choix, enregistré immédiatement.

const CHOIX = [
  { valeur: 0.7, libelle: 'Économe', aide: 'Photos plus légères' },
  { valeur: 0.8, libelle: 'Normale', aide: 'Conseillé' },
  { valeur: 0.9, libelle: 'Haute', aide: 'Plus de détails, plus lourd' },
] as const;

export function QualitePhoto() {
  const parametres = useLiveQuery(lireParametres);
  if (!parametres) return null;

  return (
    <div className="choix-groupe" role="group" aria-label="Qualité des photos">
      {CHOIX.map((c) => (
        <button
          key={c.valeur}
          type="button"
          className="choix"
          aria-pressed={parametres.qualitePhoto === c.valeur}
          onClick={() => void modifierParametre('qualitePhoto', c.valeur)}
        >
          <strong>{c.libelle}</strong>
          <small>{c.aide}</small>
        </button>
      ))}
    </div>
  );
}
