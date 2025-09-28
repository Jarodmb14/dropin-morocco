import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SimpleHeader from "@/components/SimpleHeader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "owner">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, isOwner, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect based on user role after successful login
        if (isOwner) {
          navigate("/owner");
        } else if (isCustomer) {
          navigate("/venues");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              {/* User Type Selection */}
              <div className="border border-gray-200 bg-white">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setUserType("customer")}
                    className={`flex-1 py-4 px-6 font-semibold transition-all border-r border-gray-200 ${
                      userType === "customer"
                        ? "text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{ 
                      fontFamily: 'Space Grotesk, sans-serif',
                      backgroundColor: userType === "customer" ? '#E3BFC0' : undefined
                    }}
                  >
                    CUSTOMER
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("owner")}
                    className={`flex-1 py-4 px-6 font-semibold transition-all ${
                      userType === "owner"
                        ? "text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{ 
                      fontFamily: 'Space Grotesk, sans-serif',
                      backgroundColor: userType === "owner" ? '#E3BFC0' : undefined
                    }}
                  >
                    GYM OWNER
                  </button>
                </div>
              </div>

              {/* Email Input */}
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

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  placeholder="Enter your password"
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
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            {/* Links */}
            <div className="text-center space-y-2">
              <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Don't have an account?{" "}
                <Link to="/auth/signup" className="font-bold hover:underline text-gray-800">
                  Sign Up
                </Link>
              </p>
              <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Forgot your password?{" "}
                <Link to="/auth/forgot-password" className="font-bold hover:underline text-gray-800">
                  Reset Password
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
