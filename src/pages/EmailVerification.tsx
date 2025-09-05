import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SimpleHeader from "@/components/SimpleHeader";

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    // Check if we have verification tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (accessToken && refreshToken && type === 'signup') {
      // Handle email verification
      handleEmailVerification(accessToken, refreshToken);
    } else if (user) {
      // Check if user is already verified
      checkVerificationStatus();
    }
  }, [searchParams, user]);

  const handleEmailVerification = async (accessToken: string, refreshToken: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsVerified(true);
        setMessage("Email verified successfully! You can now access all features.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError("Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    if (user) {
      setIsVerified(user.email_confirmed_at !== null);
    }
  };

  const resendVerification = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Verification email sent! Check your inbox.");
      }
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
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
            <div className="text-6xl mb-6">
              {isVerified ? "✅" : "📧"}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {isVerified 
                ? "Your email has been successfully verified. You can now access all features."
                : "Please check your email and click the verification link to activate your account."
              }
            </p>
          </div>

          <div className="space-y-6">
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

            {!isVerified && user && (
              <div className="text-center space-y-4">
                <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Didn't receive the email? Check your spam folder or resend it.
                </p>
                <button
                  onClick={resendVerification}
                  disabled={loading}
                  className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide disabled:opacity-50"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    backgroundColor: '#E3BFC0'
                  }}
                >
                  {loading ? "SENDING..." : "RESEND VERIFICATION"}
                </button>
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Need help?{" "}
                <button
                  onClick={() => navigate("/auth/login")}
                  className="font-bold text-orange-500 hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
