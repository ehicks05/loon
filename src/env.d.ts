/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_GEONAMES_USERNAME: string;
	readonly VITE_OPENWEATHER_APP_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
