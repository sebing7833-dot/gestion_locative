import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages publie l'appli dans un sous-dossier : https://sebing7833-dot.github.io/gestion_locative/
const BASE_PRODUCTION = '/gestion_locative/';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? BASE_PRODUCTION : '/',
  plugins: [
    react(),
    // Le mode « phone » (npm run dev:phone) active un certificat HTTPS de test :
    // hors de localhost, Chrome exige HTTPS pour l'appareil photo et le service worker.
    ...(mode === 'phone' ? [basicSsl()] : []),
    VitePWA({
      // « prompt » : une nouvelle version n'est installée que si l'utilisateur le demande,
      // pour ne jamais recharger l'appli au milieu d'un état des lieux.
      registerType: 'prompt',
      includeAssets: ['icones/icone.svg', 'icones/apple-touch-icon.png'],
      manifest: {
        name: 'Gestion locative',
        short_name: 'Gestion locative',
        description: 'États des lieux, bail meublé, révision IRL et quittances, hors connexion.',
        lang: 'fr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0b4f9c',
        background_color: '#ffffff',
        icons: [
          { src: 'icones/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icones/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icones/icone-masquable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Tout ce qui compose l'appli est copié dans le téléphone à l'installation :
        // aucun fichier n'est demandé au réseau ensuite (mode avion).
        globPatterns: ['**/*.{html,js,css,svg,png,ico,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // Port fixe : c'est celui ouvert dans le pare-feu pour le S10. S'il est déjà pris
  // (serveur lancé deux fois), Vite s'arrête avec une erreur au lieu d'en changer.
  server: { port: 5173, strictPort: true },
  test: {
    include: ['src/**/*.test.ts'],
  },
}));
