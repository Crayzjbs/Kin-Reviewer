import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseServerInstance: SupabaseClient | null = null;

// Lazy initialization - only create client when actually used (not at build time)
export const getSupabaseServer = () => {
  if (!supabaseServerInstance) {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    supabaseServerInstance = createClient(supabaseUrl, supabaseKey);
  }
  
  return supabaseServerInstance;
};
