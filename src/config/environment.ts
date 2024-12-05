export const environment = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  isDevelopment: import.meta.env.DEV,
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
};

export function validateEnvironment(): void {
  if (!environment.isDevelopment) {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      throw new Error('VITE_SUPABASE_URL is required in production');
    }
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('VITE_SUPABASE_ANON_KEY is required in production');
    }
  }
}