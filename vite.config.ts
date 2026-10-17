import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Le mode « phone » (npm run dev:phone) active un certificat HTTPS de test :
// hors de localhost, Chrome exige HTTPS pour l'appareil photo et le service worker.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'phone' ? [basicSsl()] : [])],
  test: {
    include: ['src/**/*.test.ts'],
  },
}));
