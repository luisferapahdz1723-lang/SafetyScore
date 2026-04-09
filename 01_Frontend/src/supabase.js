import { createClient } from '@supabase/supabase-js';

// Reemplaza estas variables con las de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_ANON_KEY_DE_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseKey);
