import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './app/styles.css';
import { demanderStockagePersistant } from './db/stockage';

// Dès l'ouverture : demander que nos données ne soient jamais effacées par le navigateur.
void demanderStockagePersistant();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
