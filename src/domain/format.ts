// Mise en forme des dates et des montants pour l'affichage (français).
// Les données restent stockées en ISO 8601 (dates) et en centimes entiers (montants).

const DATE_SEULE = /^(\d{4})-(\d{2})-(\d{2})$/;

const formatMontantFr = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

/** Date ISO → « JJ/MM/AAAA ». Une date seule (« 2026-12-01 ») n'est pas décalée par le fuseau horaire. */
export function formatDate(iso: string): string {
  const seule = DATE_SEULE.exec(iso);
  if (seule) {
    const [, annee, mois, jour] = seule;
    return `${jour}/${mois}/${annee}`;
  }
  const d = lireDate(iso);
  return `${deuxChiffres(d.getDate())}/${deuxChiffres(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Date-heure ISO → « JJ/MM/AAAA à HH:MM » (heure locale du téléphone). */
export function formatDateHeure(iso: string): string {
  const d = lireDate(iso);
  return `${formatDate(iso)} à ${deuxChiffres(d.getHours())}:${deuxChiffres(d.getMinutes())}`;
}

/** Montant en centimes (entier) → « 1 234,56 € ». */
export function formatMontant(centimes: number): string {
  if (!Number.isInteger(centimes)) {
    throw new Error(`Montant invalide (centimes entiers attendus) : ${centimes}`);
  }
  return formatMontantFr.format(centimes / 100);
}

const UNITES_OCTETS = ['octets', 'Ko', 'Mo', 'Go', 'To'];

const formatDecimalFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/** Taille en octets → « 12,3 Mo » (1 Ko = 1024 octets). */
export function formatOctets(octets: number): string {
  let valeur = octets;
  let unite = 0;
  while (valeur >= 1024 && unite < UNITES_OCTETS.length - 1) {
    valeur /= 1024;
    unite++;
  }
  return `${formatDecimalFr.format(valeur)} ${UNITES_OCTETS[unite]}`;
}

function lireDate(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Date invalide : ${iso}`);
  }
  return d;
}

function deuxChiffres(n: number): string {
  return String(n).padStart(2, '0');
}
