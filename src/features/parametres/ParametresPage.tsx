import { IdentiteBailleur } from './IdentiteBailleur';
import { QualitePhoto } from './QualitePhoto';
import { Stockage } from './Stockage';

export function ParametresPage() {
  return (
    <>
      <section className="section">
        <h2>Bailleur</h2>
        <IdentiteBailleur />
      </section>
      <section className="section">
        <h2>Qualité des photos</h2>
        <QualitePhoto />
      </section>
      <section className="section">
        <h2>Stockage</h2>
        <Stockage />
      </section>
    </>
  );
}
