
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Fix: Removed loadEnv(mode, process.cwd(), '') which was causing 'Property cwd does not exist on type Process' error.
  // The API key mapping in 'define' is also removed because process.env.API_KEY is injected automatically
  // by the environment according to the @google/genai guidelines.
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    }
  };
});
