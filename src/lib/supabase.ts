import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joopxlkbjtbutzigwdum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvb3B4bGtianRidXR6aWd3ZHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDI2NDYsImV4cCI6MjA4NzAxODY0Nn0.iRUhc5TAqTJcPm4VXODkBuEglE9fS51BPH51EYTblIw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UserProfile {
  id: string;
  email: string;
  parent_name?: string;
  created_at: string;
}

export interface BabyProfile {
  id: string;
  user_id: string;
  name: string;
  birthdate?: string;
  age_months?: number;
  feeding_type?: 'breast' | 'formula' | 'combo';
  is_expecting: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedLog {
  id: string;
  user_id: string;
  baby_id: string;
  type: 'left-breast' | 'right-breast' | 'bottle' | 'both-breasts';
  start_time: string;
  duration: number;
  notes?: string;
  is_night_feed: boolean;
  created_at: string;
}

export interface GrowthEntry {
  id: string;
  user_id: string;
  baby_id: string;
  date: string;
  weight?: number;
  height?: number;
  head_circ?: number;
  notes?: string;
  created_at: string;
}

export interface NapLog {
  id: string;
  user_id: string;
  baby_id: string;
  date: string;
  wake_time: string;
  nap_start?: string;
  nap_end?: string;
  duration?: number;
  created_at: string;
}
