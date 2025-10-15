import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT: Replace these with your actual Supabase credentials
// Get them from: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://jbreqfpramntbfelncjq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicmVxZnByYW1udGJmZWxuY2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODUzNzQsImV4cCI6MjA3NTU2MTM3NH0.XZqmOCg1UhoXacsuWW3nlf7AfUDh0c9PuONhqbHKq4g';

// Check if credentials are configured
export const isSupabaseConfigured = SUPABASE_URL.startsWith('http');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Meal = {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  meal_time: string;
  created_at: string;
};

export type WaterIntake = {
  id: string;
  user_id: string;
  amount_ml: number;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  date: string;
  calorie_goal: number;
  water_goal_ml: number;
  calorie_progress: number;
  water_progress_ml: number;
};
