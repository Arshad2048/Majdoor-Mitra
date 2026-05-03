import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfoudsycjvmndotpflbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb3Vkc3ljanZtbmRvdHBmbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzIzNjQsImV4cCI6MjA4ODIwODM2NH0.f82yokepMb9YY8dmPf9AROIsdYu5Ml1bTe0nL-nMiWA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
