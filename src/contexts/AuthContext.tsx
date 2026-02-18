import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, BabyProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  babyProfile: BabyProfile | null;
  signUp: (email: string, password: string, parentName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  saveBabyProfile: (profile: Partial<BabyProfile>) => Promise<{ error: Error | null }>;
  refreshBabyProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBabyProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBabyProfile(session.user.id);
      } else {
        setBabyProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBabyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching baby profile:', error);
      }
      setBabyProfile(data);
    } catch (err) {
      console.error('Error fetching baby profile:', err);
    }
  };

  const signUp = async (email: string, password: string, parentName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            parent_name: parentName
          }
        }
      });
      
      if (error) return { error };
      
      // Create user profile
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          parent_name: parentName
        });
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setBabyProfile(null);
  };

  const saveBabyProfile = async (profile: Partial<BabyProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      if (babyProfile) {
        // Update existing
        const { error } = await supabase
          .from('baby_profiles')
          .update({
            ...profile,
            updated_at: new Date().toISOString()
          })
          .eq('id', babyProfile.id);
        
        if (!error) {
          setBabyProfile({ ...babyProfile, ...profile } as BabyProfile);
        }
        return { error };
      } else {
        // Create new
        const { data, error } = await supabase
          .from('baby_profiles')
          .insert({
            user_id: user.id,
            ...profile,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (!error && data) {
          setBabyProfile(data);
        }
        return { error };
      }
    } catch (err) {
      return { error: err as Error };
    }
  };

  const refreshBabyProfile = async () => {
    if (user) {
      await fetchBabyProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      babyProfile,
      signUp,
      signIn,
      signOut,
      saveBabyProfile,
      refreshBabyProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
