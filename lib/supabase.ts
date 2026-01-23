import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('must-be-replaced')

if (!isSupabaseConfigured) {
    console.warn('Supabase credentials are missing or are placeholders. Please update .env.local with real values.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
    return supabase;
}
