import { createClient } from '@supabase/supabase-js';

// These variables should be set in your environment variables
const supabaseUrl = "https://tkgymdpxqvfppwkylcjb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ3ltZHB4cXZmcHB3a3lsY2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Mzk0OTgsImV4cCI6MjA3NjAxNTQ5OH0.f9tuqiwuqfjIzgXRPH-wNl3HDRtJ9_4b356H4NUbiqc";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);