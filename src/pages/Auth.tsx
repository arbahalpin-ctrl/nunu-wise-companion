import { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import heroImage from '@/assets/nunu-logo.svg';

interface AuthProps {
  onComplete: () => void;
}

const Auth = ({ onComplete }: AuthProps) => {
  const [mode, setMode] = useState<'welcome' | 'signup' | 'signin'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { signUp, signIn } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setResetLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    setResetLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(email, password, parentName);
    
    setLoading(false);
    
    if (error) {
      setError(error.message || 'Failed to create account');
    } else {
      setConfirmationSent(true);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    setLoading(false);
    
    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('Invalid email or password');
      } else {
        setError(error.message || 'Failed to sign in');
      }
    } else {
      onComplete();
    }
  };

  // Welcome screen
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col items-center justify-center p-8">
          
          <div className="mb-8">
            <div className="w-40 h-40 bg-white rounded-full p-4 shadow-xl border-4 border-white">
              <img 
                src={heroImage} 
                alt="Nunu" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3 text-center">
            Welcome to Nunu
          </h1>
          <p className="text-slate-500 text-center mb-8 max-w-xs">
            Your companion through the beautiful chaos of motherhood
          </p>

          <div className="w-full space-y-3">
            <Button 
              onClick={() => setMode('signup')}
              size="lg"
              className="w-full rounded-2xl py-6 text-base bg-slate-800 hover:bg-slate-700"
            >
              Create account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              onClick={() => setMode('signin')}
              variant="outline"
              size="lg"
              className="w-full rounded-2xl py-6 text-base"
            >
              I already have an account
            </Button>
          </div>

          <p className="text-xs text-slate-400 mt-8 text-center max-w-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  // Password reset sent
  if (resetSent) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col items-center justify-center p-8">
          
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-10 w-10 text-sky-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-3 text-center">
            Check your email
          </h1>
          <p className="text-slate-500 text-center mb-6 max-w-xs">
            We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
          </p>

          <div className="w-full space-y-3">
            <Button 
              onClick={() => {
                setResetSent(false);
                setMode('signin');
              }}
              size="lg"
              className="w-full rounded-2xl py-6 text-base bg-slate-800 hover:bg-slate-700"
            >
              Back to sign in
            </Button>
            
            <p className="text-xs text-slate-400 text-center">
              Didn't receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation sent
  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col items-center justify-center p-8">
          
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-3 text-center">
            Check your email
          </h1>
          <p className="text-slate-500 text-center mb-6 max-w-xs">
            We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
          </p>

          <div className="w-full space-y-3">
            <Button 
              onClick={() => {
                setConfirmationSent(false);
                setMode('signin');
              }}
              size="lg"
              className="w-full rounded-2xl py-6 text-base bg-slate-800 hover:bg-slate-700"
            >
              Go to sign in
            </Button>
            
            <p className="text-xs text-slate-400 text-center">
              Didn't receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sign up / Sign in form
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col p-6">
        
        {/* Back button */}
        <button 
          onClick={() => {
            setMode('welcome');
            setError('');
          }}
          className="text-slate-500 text-sm mb-6"
        >
          ← Back
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500">
              {mode === 'signup' 
                ? 'Start your journey with Nunu' 
                : 'Sign in to continue'
              }
            </p>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Your name (optional)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="What should we call you?"
                    className="pl-12 py-6 rounded-2xl border-2 border-slate-200 focus:border-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-12 py-6 rounded-2xl border-2 border-slate-200 focus:border-slate-800"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  className="pl-12 pr-12 py-6 rounded-2xl border-2 border-slate-200 focus:border-slate-800"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-sm text-slate-500 hover:text-slate-700 mt-1.5 block"
                >
                  {resetLoading ? 'Sending...' : 'Forgot password?'}
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              onClick={mode === 'signup' ? handleSignUp : handleSignIn}
              disabled={loading}
              size="lg"
              className="w-full rounded-2xl py-6 text-base bg-slate-800 hover:bg-slate-700 mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create account' : 'Sign in'}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => {
                      setMode('signin');
                      setError('');
                    }}
                    className="text-slate-800 font-medium underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    className="text-slate-800 font-medium underline"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
