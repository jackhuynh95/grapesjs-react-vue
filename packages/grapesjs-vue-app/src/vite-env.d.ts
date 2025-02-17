/// <reference types="vite/client" />

interface ImportMetaEnv {
    DEV: boolean;
    MODE: string;
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }