import type { RouteId } from '../app/routes';

// Icônes dessinées en SVG directement dans le code : aucune police d'icônes
// ni image à télécharger, donc disponibles hors connexion.

const TRACES: Record<RouteId, string> = {
  accueil: 'M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10',
  biens: 'M4 21V7l8-4 8 4v14M4 21h16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2',
  sauvegarde: 'M12 3v12M7 10l5 5 5-5M4 17v3h16v-3',
  parametres:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-1-3-2 .3-1.4-1.4L17 5l-3-1-1 2h-2L10 4 7 5l.4 2-1.4 1.4L4 8 3 11l2 1v0l-2 1 1 3 2-.3 1.4 1.4L7 19l3 1 1-2h2l1 2 3-1-.4-2 1.4-1.4 2 .4 1-3-2-1Z',
};

export function Icone({ nom }: { nom: RouteId }) {
  return (
    <svg
      className="icone"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={TRACES[nom]} />
    </svg>
  );
}
