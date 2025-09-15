import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";

const PasswordResetFallback = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const addDiagnostic = (message: string) => {
    setDiagnostics(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const runDiagnostics = async () => {
      addDiagnostic("Starting diagnostics...");
      
      try {
        // Test 1: Basic Supabase connection
        addDiagnostic("Testing Supabase connection...");
        const { data: health, error: healthError } = await supabase
          .from('clubs')
          .select('count')
          .limit(1);
        
        if (healthError) {
          addDiagnostic(`❌ Connection failed: ${healthError.message}`);
        } else {
          addDiagnostic("✅ Supabase connection working");
        }

        // Test 2: Auth service
        addDiagnostic("Testing auth service...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          addDiagnostic(`❌ Auth service error: ${sessionError.message}`);
          setSessionInfo(`Session Error: ${sessionError.message}`);
          setError(`Session error: ${sessionError.message}`);
        } else if (session) {
          addDiagnostic(`✅ Auth service working, user: ${session.user.email}`);
          setSessionInfo(`✅ Authenticated as: ${session.user.email}`);
        } else {
          addDiagnostic("⚠️ No active session");
          setSessionInfo('❌ No active session');
          setError('No active session found. Please request a new password reset link.');
        }

        // Test 3: Network connectivity
        addDiagnostic("Testing network connectivity...");
        try {
          const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/', {
            method: 'HEAD',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
            }
          });
          
          if (response.ok) {
            addDiagnostic("✅ Network connectivity working");
          } else {
            addDiagnostic(`⚠️ Network response: ${response.status} ${response.statusText}`);
          }
        } catch (networkError) {
          addDiagnostic(`❌ Network error: ${networkError instanceof Error ? networkError.message : 'Unknown'}`);
        }

      } catch (err) {
        addDiagnostic(`❌ Diagnostic error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    };

    runDiagnostics();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      addDiagnostic(`Auth state change: ${event} ${session ? 'Session exists' : 'No session'}`);
      
      if (event === 'PASSWORD_RECOVERY' && session) {
        addDiagnostic(`✅ Password recovery session detected: ${session.user.email}`);
        setSessionInfo(`✅ Password Recovery Session: ${session.user.email}`);
        setError(null);
      } else if (event === 'SIGNED_IN' && session) {
        addDiagnostic(`✅ User signed in: ${session.user.email}`);
        setSessionInfo(`✅ Signed In: ${session.user.email}`);
        setError(null);
      } else if (!session) {
        addDiagnostic("⚠️ No session");
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
    addDiagnostic("Starting password update...");

    try {
      // Test with very short timeout first
      addDiagnostic("Testing with 5-second timeout...");
      
      const quickTestPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Quick test timeout after 5 seconds'));
        }, 5000);
      });

      const updatePromise = supabase.auth.updateUser({
        password: password
      });

      try {
        const result = await Promise.race([updatePromise, quickTestPromise]);
        addDiagnostic("✅ Password update succeeded quickly!");
        
        if (result.error) {
          addDiagnostic(`❌ Password update error: ${result.error.message}`);
          setError(`Error: ${result.error.message}`);
        } else {
          addDiagnostic("✅ Password updated successfully");
          setMessage("Password updated successfully! Redirecting to homepage...");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (quickError) {
        addDiagnostic(`⚠️ Quick test failed: ${quickError instanceof Error ? quickError.message : 'Unknown'}`);
        
        // Try with longer timeout
        addDiagnostic("Trying with 10-second timeout...");
        
        const longerTestPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Longer test timeout after 10 seconds'));
          }, 10000);
        });

        try {
          const result = await Promise.race([updatePromise, longerTestPromise]);
          addDiagnostic("✅ Password update succeeded with longer timeout!");
          
          if (result.error) {
            addDiagnostic(`❌ Password update error: ${result.error.message}`);
            setError(`Error: ${result.error.message}`);
          } else {
            addDiagnostic("✅ Password updated successfully");
            setMessage("Password updated successfully! Redirecting to homepage...");
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } catch (longerError) {
          addDiagnostic(`❌ Longer test also failed: ${longerError instanceof Error ? longerError.message : 'Unknown'}`);
          setError("Password update is not responding. This may be a Supabase service issue. Please try again later or contact support.");
        }
      }
    } catch (err) {
      addDiagnostic(`❌ Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Please try again.'}`);
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
              Password Reset Fallback
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Advanced diagnostics and fallback method
            </p>
          </div>

          {/* Session Info */}
          {sessionInfo && (
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {sessionInfo}
            </div>
          )}

          {/* Diagnostics */}
          {diagnostics.length > 0 && (
            <div className="bg-gray-50 border-l-4 border-gray-400 text-gray-700 px-4 py-3 font-medium text-sm max-h-40 overflow-y-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="font-bold mb-2">Diagnostics:</div>
              {diagnostics.map((diag, index) => (
                <div key={index} className="mb-1">{diag}</div>
              ))}
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

export default PasswordResetFallback;
