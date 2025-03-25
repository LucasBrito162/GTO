/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MP_PUBLIC_KEY: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  MercadoPago: any;
}