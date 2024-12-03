interface AppConfig {
  version: string;
  lastUpdate: string; // Format: YYYY-MM-DD
}

export const appConfig: AppConfig = {
  version: '1.1',
  lastUpdate: '2024-12-03' // À modifier facilement lors des mises à jour
};
