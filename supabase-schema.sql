-- Nunu App Database Schema
-- Run this in Supabase SQL Editor (Database > SQL Editor)

-- Enable RLS (Row Level Security)
-- User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  parent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Baby Profiles table
CREATE TABLE IF NOT EXISTS baby_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birthdate DATE,
  age_months INTEGER,
  feeding_type TEXT CHECK (feeding_type IN ('breast', 'formula', 'combo')),
  is_expecting BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own baby profiles
CREATE POLICY "Users can view own baby profiles" ON baby_profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own baby profiles" ON baby_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own baby profiles" ON baby_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own baby profiles" ON baby_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Feed Logs table
CREATE TABLE IF NOT EXISTS feed_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baby_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('left-breast', 'right-breast', 'bottle', 'both-breasts')) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  notes TEXT,
  is_night_feed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feed_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feed logs" ON feed_logs
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own feed logs" ON feed_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own feed logs" ON feed_logs
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own feed logs" ON feed_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Growth Entries table
CREATE TABLE IF NOT EXISTS growth_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baby_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2), -- kg
  height DECIMAL(5,1), -- cm
  head_circ DECIMAL(5,1), -- cm
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE growth_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own growth entries" ON growth_entries
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own growth entries" ON growth_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own growth entries" ON growth_entries
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own growth entries" ON growth_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Nap Logs table
CREATE TABLE IF NOT EXISTS nap_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baby_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  wake_time TIMESTAMPTZ,
  nap_start TIMESTAMPTZ,
  nap_end TIMESTAMPTZ,
  duration INTEGER, -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE nap_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nap logs" ON nap_logs
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own nap logs" ON nap_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own nap logs" ON nap_logs
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own nap logs" ON nap_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Mood Entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat Conversations table (for saving important chats)
CREATE TABLE IF NOT EXISTS saved_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved chats" ON saved_chats
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own saved chats" ON saved_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own saved chats" ON saved_chats
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_baby_profiles_user_id ON baby_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_logs_user_id ON feed_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_logs_start_time ON feed_logs(start_time);
CREATE INDEX IF NOT EXISTS idx_growth_entries_user_id ON growth_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_nap_logs_user_id ON nap_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
