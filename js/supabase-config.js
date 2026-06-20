/**
 * Pariwantan Ka Lagi Aawaj - Supabase Configuration
 * Initialize the Supabase client and expose it globally.
 *
 * INSTRUCTIONS:
 * 1. Go to your Supabase Dashboard -> Project Settings -> API
 * 2. Copy your "Project URL" and paste it below as SUPABASE_URL
 * 3. Copy the "anon public" key and paste it below as SUPABASE_ANON_KEY
 */

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_PUBLIC_KEY';

// Initialize client using the global supabase object loaded from CDN
const _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose globally
window.supabaseClient = _supabaseClient;
