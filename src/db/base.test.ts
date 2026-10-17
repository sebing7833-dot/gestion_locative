import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { lireBailleur, modifierBailleur } from './bailleur';
import { BaseGestion } from './base';
import { lireParametres, modifierParametre } from './parametres';

// fake-indexeddb imite IndexedDB en mémoire : chaque test part d'une base neuve.
let db: BaseGestion;

beforeEach(() => {
  db = new BaseGestion(`test-${crypto.randomUUID()}`);
});

afterEach(async () => {
  await db.delete();
});

describe('bailleur', () => {
  it("n'existe pas tant qu'il n'a pas été saisi", async () => {
    expect(await lireBailleur(db)).toBeUndefined();
  });

  it('est créé à la première saisie, avec id et dates', async () => {
    const b = await modifierBailleur({ nom: 'Martin' }, db);
    expect(b.nom).toBe('Martin');
    expect(b.prenom).toBe('');
    expect(b.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(b.createdAt).toBe(b.updatedAt);
  });

  it('garde son id et sa date de création aux saisies suivantes', async () => {
    const premier = await modifierBailleur({ nom: 'Martin' }, db);
    await new Promise((r) => setTimeout(r, 5));
    const second = await modifierBailleur({ prenom: 'Paul' }, db);

    expect(second.id).toBe(premier.id);
    expect(second.createdAt).toBe(premier.createdAt);
    expect(second.updatedAt > premier.updatedAt).toBe(true);
    expect(await lireBailleur(db)).toMatchObject({ nom: 'Martin', prenom: 'Paul' });
    expect(await db.bailleurs.count()).toBe(1);
  });
});

describe('paramètres', () => {
  it('prennent leur valeur par défaut', async () => {
    expect(await lireParametres(db)).toEqual({ qualitePhoto: 0.8 });
  });

  it('sont enregistrés et relus', async () => {
    await modifierParametre('qualitePhoto', 0.7, db);
    expect((await lireParametres(db)).qualitePhoto).toBe(0.7);
  });
});
