import type { ReactElement } from 'react';
import { BiensPage } from '../features/biens/BiensPage';
import { ParametresPage } from '../features/parametres/ParametresPage';
import { SauvegardePage } from '../features/sauvegarde/SauvegardePage';
import { AccueilPage } from './AccueilPage';
import { BarreNavigation } from './BarreNavigation';
import { MiseAJour } from './MiseAJour';
import { ROUTES, type RouteId } from './routes';
import { useRoute } from './useRoute';

const ECRANS: Record<RouteId, () => ReactElement> = {
  accueil: AccueilPage,
  biens: BiensPage,
  sauvegarde: SauvegardePage,
  parametres: ParametresPage,
};

export function App() {
  const route = useRoute();
  const Ecran = ECRANS[route];
  const titre = ROUTES.find((r) => r.id === route)?.titre ?? '';

  return (
    <div className="appli">
      <header className="entete">
        <h1>{titre}</h1>
      </header>
      <main className="contenu">
        <Ecran />
      </main>
      <MiseAJour />
      <BarreNavigation active={route} />
    </div>
  );
}
