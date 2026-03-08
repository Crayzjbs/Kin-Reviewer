import { createClient } from '@supabase/supabase-js';

// Server-side only - keys are NOT exposed to browser
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabaseServer = createClient(supabaseUrl, supabaseKey);
