import { createClient } from '@supabase/supabase-js';

// Generic client for use in browser/client-side environments
export const createBrowserClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

// Generic client for use in server/node environments
export const createServerClient = (supabaseUrl: string, supabaseServiceRoleKey: string) => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
};
