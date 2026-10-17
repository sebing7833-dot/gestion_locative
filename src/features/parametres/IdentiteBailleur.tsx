import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { ChampTexte } from '../../components/ChampTexte';
import { BAILLEUR_VIDE, lireBailleur, modifierBailleur } from '../../db/bailleur';
import type { ChampsBailleur } from '../../db/types';

// Identité du bailleur, enregistrée à chaque lettre tapée (pas de bouton « Enregistrer »).

type Etat = 'enregistre' | 'erreur';

export function IdentiteBailleur() {
  // Enveloppé dans un objet : « undefined » veut alors dire « encore en lecture »,
  // et pas « aucun bailleur saisi ».
  const lecture = useLiveQuery(async () => ({ bailleur: await lireBailleur() }));

  if (!lecture) return <p className="vide">Chargement…</p>;

  const { bailleur } = lecture;
  const initial: ChampsBailleur = bailleur
    ? { nom: bailleur.nom, prenom: bailleur.prenom, adresse: bailleur.adresse, email: bailleur.email, telephone: bailleur.telephone }
    : BAILLEUR_VIDE;
  return <FormulaireBailleur initial={initial} />;
}

function FormulaireBailleur({ initial }: { initial: ChampsBailleur }) {
  // La saisie est gardée à l'écran (réponse immédiate au clavier) et écrite en base
  // à chaque changement. Les écritures passent dans l'ordre, la dernière l'emporte.
  const [champs, setChamps] = useState(initial);
  const [etat, setEtat] = useState<Etat>('enregistre');

  function changer(cle: keyof ChampsBailleur, valeur: string) {
    setChamps((c) => ({ ...c, [cle]: valeur }));
    modifierBailleur({ [cle]: valeur }).then(
      () => setEtat('enregistre'),
      (erreur: unknown) => {
        console.error(erreur);
        setEtat('erreur');
      },
    );
  }

  return (
    <>
      <ChampTexte libelle="Nom" valeur={champs.nom} onChange={(v) => changer('nom', v)} autoComplete="family-name" />
      <ChampTexte libelle="Prénom" valeur={champs.prenom} onChange={(v) => changer('prenom', v)} autoComplete="given-name" />
      <ChampTexte
        libelle="Adresse"
        valeur={champs.adresse}
        onChange={(v) => changer('adresse', v)}
        autoComplete="street-address"
        multiligne
      />
      <ChampTexte libelle="E-mail" type="email" valeur={champs.email} onChange={(v) => changer('email', v)} autoComplete="email" />
      <ChampTexte
        libelle="Téléphone"
        type="tel"
        valeur={champs.telephone}
        onChange={(v) => changer('telephone', v)}
        autoComplete="tel"
      />
      {etat === 'enregistre' ? (
        <p className="etat-enregistrement">✓ Enregistré automatiquement</p>
      ) : (
        <p className="etat-enregistrement etat-enregistrement--erreur" role="alert">
          ⚠ L'enregistrement a échoué. Ne fermez pas l'appli et réessayez.
        </p>
      )}
    </>
  );
}
