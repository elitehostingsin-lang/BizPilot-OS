import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://awofmvawjtaarkugxxww.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2ZtdmF3anRhYXJrdWd4eHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODQ3ODEsImV4cCI6MjA4NDU2MDc4MX0.5LdZqE2qxN516JcegFhKiU7k7jA7iJ4ri8B92wG10CQ'

export const isSupabaseConfigured = true

// Create client function to be more resilient
export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Export a getter for the singleton
export const supabase = typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null as any;
