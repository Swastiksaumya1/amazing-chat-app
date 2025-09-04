/// <reference types="vite/client" />

// Add type declarations for environment variables
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend the Window interface if needed
declare global {
  interface Window {
    // Add any global window properties here
  }
}
