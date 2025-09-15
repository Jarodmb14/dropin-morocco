import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";

const PasswordResetTest = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      console.log('🔄 Reset password response:', { error });

      if (error) {
        setError(`Error: ${error.message}`);
        console.error('❌ Password reset error:', error);
      } else {
        setMessage("Password reset email sent! Check your inbox and follow the link to reset your password.");
        setStep('reset');
        console.log('✅ Password reset email sent successfully');
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error('❌ Password reset exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
      console.log('🔄 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      console.log('🔄 Update password response:', { error });

      if (error) {
        setError(`Error: ${error.message}`);
        console.error('❌ Password update error:', error);
      } else {
        setMessage("Password updated successfully!");
        console.log('✅ Password updated successfully');
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error('❌ Password update exception:', err);
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
              Password Reset Test
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Debug password reset functionality
            </p>
          </div>

          {step === 'request' ? (
            <form className="mt-8 space-y-8" onSubmit={handleRequestReset}>
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
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                    placeholder="your.email@example.com"
                    style={{ 
                      fontFamily: 'Space Grotesk, sans-serif',
                      borderBottomColor: '#D1D5DB'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-8" onSubmit={handlePasswordUpdate}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </form>
          )}

          <div className="text-center">
            <button
              onClick={() => setStep('request')}
              className="text-gray-600 hover:underline" style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Back to Request Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetTest;
