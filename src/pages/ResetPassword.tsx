import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SimpleHeader from "@/components/SimpleHeader";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    console.log('🔄 ResetPassword: URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
    
    if (accessToken && refreshToken) {
      console.log('🔄 ResetPassword: Setting session from URL tokens');
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ data, error }) => {
        if (error) {
          console.error('❌ ResetPassword: Error setting session:', error);
          setError(`Session error: ${error.message}`);
        } else {
          console.log('✅ ResetPassword: Session set successfully');
        }
      });
    } else {
      console.log('⚠️ ResetPassword: No tokens found in URL');
      // Check if user is already authenticated
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('❌ ResetPassword: Error getting session:', error);
          setError(`Session error: ${error.message}`);
        } else if (!session) {
          console.log('⚠️ ResetPassword: No active session');
          setError('No valid session found. Please request a new password reset link.');
        } else {
          console.log('✅ ResetPassword: User already authenticated');
        }
      });
    }
  }, [searchParams]);

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
      console.log('🔄 ResetPassword: Updating password...');
      
      const { error } = await updatePassword(password);

      console.log('🔄 ResetPassword: Update password response:', { error });

      if (error) {
        console.error('❌ ResetPassword: Password update error:', error);
        setError(`Error: ${error.message}`);
      } else {
        console.log('✅ ResetPassword: Password updated successfully');
        setMessage("Password updated successfully! Redirecting to homepage...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error('❌ ResetPassword: Password update exception:', err);
      setError("An unexpected error occurred. Please try again.");
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

export default ResetPassword;
