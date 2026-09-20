import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create the client if a valid URL is provided to prevent crashing on placeholders
const isValidUrl = supabaseUrl.startsWith('http');
export const supabase = isValidUrl ? createClient(supabaseUrl, supabaseKey) : null as any;

