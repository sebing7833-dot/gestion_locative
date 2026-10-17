import { describe, expect, it } from 'vitest';
import { formatDate, formatDateHeure, formatMontant, formatOctets } from './format';

// Intl insère des espaces insécables ; on les remplace pour comparer simplement.
const espacesNormales = (s: string) => s.replace(/[\u00a0\u202f]/g, ' ');

describe('formatDate', () => {
  it('affiche une date seule en JJ/MM/AAAA sans décalage de fuseau', () => {
    expect(formatDate('2026-12-01')).toBe('01/12/2026');
    expect(formatDate('2027-01-31')).toBe('31/01/2027');
  });

  it('affiche une date-heure en heure locale', () => {
    const iso = new Date(2026, 11, 1, 9, 5).toISOString();
    expect(formatDate(iso)).toBe('01/12/2026');
    expect(formatDateHeure(iso)).toBe('01/12/2026 à 09:05');
  });

  it('refuse une date invalide', () => {
    expect(() => formatDate('pas une date')).toThrow();
  });
});

describe('formatMontant', () => {
  it('affiche les centimes en euros à la française', () => {
    expect(espacesNormales(formatMontant(123456))).toBe('1 234,56 €');
    expect(espacesNormales(formatMontant(65000))).toBe('650,00 €');
    expect(espacesNormales(formatMontant(5))).toBe('0,05 €');
    expect(espacesNormales(formatMontant(0))).toBe('0,00 €');
  });

  it('refuse un montant qui n’est pas en centimes entiers', () => {
    expect(() => formatMontant(12.5)).toThrow();
  });
});

describe('formatOctets', () => {
  it('choisit l’unité adaptée', () => {
    expect(espacesNormales(formatOctets(0))).toBe('0 octets');
    expect(espacesNormales(formatOctets(512))).toBe('512 octets');
    expect(espacesNormales(formatOctets(1536))).toBe('1,5 Ko');
    expect(espacesNormales(formatOctets(12.3 * 1024 * 1024))).toBe('12,3 Mo');
    expect(espacesNormales(formatOctets(5 * 1024 ** 3))).toBe('5 Go');
  });
});
