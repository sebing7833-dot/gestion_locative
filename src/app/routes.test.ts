import { describe, expect, it } from 'vitest';
import { adresseDe, lireRoute } from './routes';

describe('lireRoute', () => {
  it('reconnaît les écrans connus', () => {
    expect(lireRoute('#/biens')).toBe('biens');
    expect(lireRoute('#/parametres')).toBe('parametres');
    expect(lireRoute('#/sauvegarde/detail')).toBe('sauvegarde');
  });

  it("renvoie à l'accueil pour une adresse vide ou inconnue", () => {
    expect(lireRoute('')).toBe('accueil');
    expect(lireRoute('#/')).toBe('accueil');
    expect(lireRoute('#/inconnu')).toBe('accueil');
  });

  it('fabrique une adresse relisible', () => {
    expect(lireRoute(adresseDe('sauvegarde'))).toBe('sauvegarde');
  });
});
