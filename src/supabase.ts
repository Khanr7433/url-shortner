import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// User provided key name
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe initialization
if (!supabaseUrl || !supabaseAnonKey) {
    const msg = "Supabase API Keys are missing! Check your .env file.";
    console.error(msg);
    // Alert only if in browser
    if (typeof window !== "undefined") alert(msg);
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co", 
    supabaseAnonKey || "placeholder-key"
);
