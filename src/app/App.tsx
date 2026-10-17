import { formatDate } from '../domain/format';

// Écran provisoire : la navigation et les vrais écrans arrivent à l'étape 4.
export function App() {
  return (
    <main className="page">
      <h1>Gestion locative</h1>
      <p>Aujourd'hui : {formatDate(new Date().toISOString())}</p>
    </main>
  );
}
