import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
        checkout: 'checkout.html',
        return_policy: 'return-policy.html',
        privacy_policy: 'privacy-policy.html',
        terms_of_service: 'terms-of-service.html'
      }
    }
  }
});
