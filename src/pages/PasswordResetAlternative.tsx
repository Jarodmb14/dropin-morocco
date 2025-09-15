import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";

const PasswordResetAlternative = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 PasswordResetAlternative: Auth state change:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'PASSWORD_RECOVERY' && session) {
        console.log('✅ PasswordResetAlternative: Password recovery session detected');
        setIsAuthenticated(true);
        setError(null);
      } else if (event === 'SIGNED_IN' && session) {
        console.log('✅ PasswordResetAlternative: User signed in');
        setIsAuthenticated(true);
        setError(null);
      } else if (!session) {
        console.log('⚠️ PasswordResetAlternative: No session');
        setIsAuthenticated(false);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ PasswordResetAlternative: Error getting session:', error);
        setError(`Session error: ${error.message}`);
      } else if (session) {
        console.log('✅ PasswordResetAlternative: User already authenticated');
        setIsAuthenticated(true);
      } else {
        console.log('⚠️ PasswordResetAlternative: No active session');
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 PasswordResetAlternative: Updating password...');
      
      // Add a manual timeout as backup
      const timeoutId = setTimeout(() => {
        console.error('❌ PasswordResetAlternative: Manual timeout triggered');
        setError("Password update is taking too long. Please try again.");
        setLoading(false);
      }, 35000); // 35 seconds timeout
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      clearTimeout(timeoutId);
      console.log('🔄 PasswordResetAlternative: Update password response:', { error });

      if (error) {
        console.error('❌ PasswordResetAlternative: Password update error:', error);
        setError(`Error: ${error.message}`);
      } else {
        console.log('✅ PasswordResetAlternative: Password updated successfully');
        setMessage("Password updated successfully! Redirecting to homepage...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error('❌ PasswordResetAlternative: Password update exception:', err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
        <SimpleHeader />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Password Reset
              </h2>
              <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Waiting for authentication...
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {error}
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Please click the password reset link from your email to continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Set New Password
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Enter your new password below.
            </p>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {message}
              </div>
            )}
            
            <div className="space-y-6">
              {/* New Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  placeholder="Enter new password"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  placeholder="Confirm new password"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/auth/login")}
                  className="font-bold text-orange-500 hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetAlternative;
