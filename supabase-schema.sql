-- Nunu Database Schema
-- Run this in Supabase SQL Editor

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  parent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Baby profiles
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

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nap/sleep logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baby_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('nap_wake', 'bedtime', 'night_wake', 'morning_wake')),
  timestamp TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved recipes
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Chat history (optional - for persistence)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  chat_type TEXT DEFAULT 'main' CHECK (chat_type IN ('main', 'recipe')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feed logs
CREATE TABLE IF NOT EXISTS feed_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  baby_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  feed_type TEXT NOT NULL CHECK (feed_type IN ('left-breast', 'right-breast', 'bottle', 'both-breasts')),
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER, -- in seconds
  notes TEXT,
  is_night_feed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings/preferences
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bedtime_hour INTEGER DEFAULT 19,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'light',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own babies" ON baby_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own babies" ON baby_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own babies" ON baby_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own babies" ON baby_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own moods" ON mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own moods" ON mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own moods" ON mood_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sleep logs" ON sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep logs" ON sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep logs" ON sleep_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep logs" ON sleep_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own saved recipes" ON saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved recipes" ON saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved recipes" ON saved_recipes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own feed logs" ON feed_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feed logs" ON feed_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feed logs" ON feed_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own feed logs" ON feed_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_baby_profiles_user_id ON baby_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_timestamp ON mood_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_timestamp ON sleep_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_logs_user_id ON feed_logs(user_id);
