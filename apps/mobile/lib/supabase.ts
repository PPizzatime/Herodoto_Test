import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
