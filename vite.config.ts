import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Le mode « phone » (npm run dev:phone) active un certificat HTTPS de test :
// hors de localhost, Chrome exige HTTPS pour l'appareil photo et le service worker.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'phone' ? [basicSsl()] : [])],
  // Port fixe : c'est celui ouvert dans le pare-feu pour le S10. S'il est déjà pris
  // (serveur lancé deux fois), Vite s'arrête avec une erreur au lieu d'en changer.
  server: { port: 5173, strictPort: true },
  test: {
    include: ['src/**/*.test.ts'],
  },
}));
