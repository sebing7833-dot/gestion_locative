import { useId } from 'react';

// Champ de saisie avec son libellé au-dessus, en grand pour le doigt.

interface Props {
  libelle: string;
  valeur: string;
  onChange: (valeur: string) => void;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  multiligne?: boolean;
}

export function ChampTexte({ libelle, valeur, onChange, type = 'text', autoComplete, multiligne }: Props) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>{libelle}</label>
      {multiligne ? (
        <textarea id={id} rows={3} value={valeur} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          type={type}
          value={valeur}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
