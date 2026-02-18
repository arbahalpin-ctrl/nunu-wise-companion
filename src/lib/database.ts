import { supabase } from './supabase';

// Types
export interface MoodEntry {
  id?: string;
  user_id?: string;
  mood: string;
  notes?: string;
  timestamp: string;
}

export interface SleepLog {
  id?: string;
  user_id?: string;
  baby_id?: string;
  log_type: 'nap_wake' | 'bedtime' | 'night_wake' | 'morning_wake';
  timestamp: string;
  notes?: string;
}

export interface UserSettings {
  user_id?: string;
  bedtime_hour: number;
  notifications_enabled: boolean;
}

export interface SavedRecipe {
  id?: string;
  user_id?: string;
  recipe_id: string;
  saved_at?: string;
}

// Mood Entries
export const moodService = {
  async getAll(userId: string): Promise<MoodEntry[]> {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching moods:', error);
      return [];
    }
    return data || [];
  },

  async add(userId: string, mood: string, notes?: string): Promise<MoodEntry | null> {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: userId,
        mood,
        notes,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding mood:', error);
      return null;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);
    
    return !error;
  }
};

// Sleep Logs
export const sleepService = {
  async getRecent(userId: string, limit = 10): Promise<SleepLog[]> {
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching sleep logs:', error);
      return [];
    }
    return data || [];
  },

  async getLatest(userId: string, logType?: string): Promise<SleepLog | null> {
    let query = supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (logType) {
      query = query.eq('log_type', logType);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching latest sleep log:', error);
    }
    return data || null;
  },

  async add(userId: string, logType: SleepLog['log_type'], babyId?: string, notes?: string): Promise<SleepLog | null> {
    const { data, error } = await supabase
      .from('sleep_logs')
      .insert({
        user_id: userId,
        baby_id: babyId,
        log_type: logType,
        timestamp: new Date().toISOString(),
        notes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding sleep log:', error);
      return null;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('sleep_logs')
      .delete()
      .eq('id', id);
    
    return !error;
  }
};

// User Settings
export const settingsService = {
  async get(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
    }
    return data || null;
  },

  async upsert(userId: string, settings: Partial<UserSettings>): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving settings:', error);
      return null;
    }
    return data;
  }
};

// Saved Recipes
export const recipesService = {
  async getAll(userId: string): Promise<SavedRecipe[]> {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved recipes:', error);
      return [];
    }
    return data || [];
  },

  async save(userId: string, recipeId: string): Promise<SavedRecipe | null> {
    const { data, error } = await supabase
      .from('saved_recipes')
      .insert({
        user_id: userId,
        recipe_id: recipeId
      })
      .select()
      .single();
    
    if (error) {
      // Might be duplicate, that's okay
      if (error.code === '23505') return null;
      console.error('Error saving recipe:', error);
      return null;
    }
    return data;
  },

  async remove(userId: string, recipeId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    
    return !error;
  },

  async isSaved(userId: string, recipeId: string): Promise<boolean> {
    const { data } = await supabase
      .from('saved_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single();
    
    return !!data;
  }
};
