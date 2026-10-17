import { Icone } from '../components/Icone';
import { adresseDe, ROUTES, type RouteId } from './routes';

// Barre fixée en bas de l'écran : atteignable au pouce, téléphone tenu d'une main.
export function BarreNavigation({ active }: { active: RouteId }) {
  return (
    <nav className="barre-nav" aria-label="Navigation principale">
      {ROUTES.map((route) => (
        <a
          key={route.id}
          href={adresseDe(route.id)}
          className="barre-nav__lien"
          aria-current={route.id === active ? 'page' : undefined}
        >
          <Icone nom={route.id} />
          <span>{route.titre}</span>
        </a>
      ))}
    </nav>
  );
}
