import path from 'path';
import { defineConfig } from 'vite'; // Removed loadEnv as it's often unnecessary
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    // Note: Since we are no longer using the define block, 
    // we don't need to call loadEnv or destructure { mode } if we are only 
    // setting server and plugins.

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      // REMOVED THE 'define' BLOCK: 
      // Vite now handles VITE_... environment variables directly via import.meta.env
      /*
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      */
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
