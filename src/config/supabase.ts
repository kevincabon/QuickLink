import { createClient } from '@supabase/supabase-js';
import { environment, validateEnvironment } from './environment';

validateEnvironment();

export const supabase = createClient(
  environment.supabase.url,
  environment.supabase.anonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);