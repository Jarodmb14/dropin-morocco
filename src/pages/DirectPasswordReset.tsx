import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";

const DirectPasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check session status immediately
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setSessionInfo(`Session Error: ${error.message}`);
          setError(`Session error: ${error.message}`);
        } else if (session) {
          setSessionInfo(`✅ Authenticated as: ${session.user.email}`);
          console.log('✅ DirectPasswordReset: Valid session found:', session.user.email);
        } else {
          setSessionInfo('❌ No active session');
          setError('No active session found. Please request a new password reset link.');
        }
      } catch (err) {
        setSessionInfo('❌ Session check failed');
        setError(`Session check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 DirectPasswordReset: Auth state change:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'PASSWORD_RECOVERY' && session) {
        console.log('✅ DirectPasswordReset: Password recovery session detected');
        setSessionInfo(`✅ Password Recovery Session: ${session.user.email}`);
        setError(null);
      } else if (event === 'SIGNED_IN' && session) {
        console.log('✅ DirectPasswordReset: User signed in');
        setSessionInfo(`✅ Signed In: ${session.user.email}`);
        setError(null);
      } else if (!session) {
        console.log('⚠️ DirectPasswordReset: No session');
        setSessionInfo('❌ No active session');
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
      console.log('🔄 DirectPasswordReset: Starting direct password update...');
      
      // Use a shorter timeout for faster feedback
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Password update timeout after 15 seconds'));
        }, 15000);
      });

      const updatePromise = supabase.auth.updateUser({
        password: password
      });

      const result = await Promise.race([updatePromise, timeoutPromise]);
      
      console.log('🔄 DirectPasswordReset: Update password result:', result);

      if (result.error) {
        console.error('❌ DirectPasswordReset: Password update error:', result.error);
        setError(`Error: ${result.error.message}`);
      } else {
        console.log('✅ DirectPasswordReset: Password updated successfully');
        setMessage("Password updated successfully! Redirecting to homepage...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error('❌ DirectPasswordReset: Password update exception:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Direct Password Reset
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Direct Supabase password update
            </p>
          </div>

          {/* Session Info */}
          {sessionInfo && (
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {sessionInfo}
            </div>
          )}

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

export default DirectPasswordReset;
