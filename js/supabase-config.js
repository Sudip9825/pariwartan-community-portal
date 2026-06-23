/**
 * Pariwantan Ka Lagi Aawaj - Supabase Configuration
 * Initialize the Supabase client and expose it globally.
 *
 * INSTRUCTIONS:
 * 1. Go to your Supabase Dashboard -> Project Settings -> API
 * 2. Copy your "Project URL" and paste it below as SUPABASE_URL
 * 3. Copy the "anon public" key and paste it below as SUPABASE_ANON_KEY
 */

const SUPABASE_URL = 'https://rcbgjdfmkjvnpqoiculz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmdqZGZta2p2bnBxb2ljdWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMjM3NTYsImV4cCI6MjA5Nzc5OTc1Nn0.RCPB53fcQGWcwuthF7K1odB314hPMySGYLPT1zZbCa0';

// Initialize client using the global supabase object loaded from CDN
const _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose globally
window.supabaseClient = _supabaseClient;
