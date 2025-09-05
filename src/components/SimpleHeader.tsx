import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/ Logo.svg";

const SimpleHeader = () => {
  const { user, profile, signOut, isOwner, isCustomer } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-pink-200 rounded-t-2xl" style={{ backgroundColor: '#E3BFC0' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo on the left - Bold comic style */}
        <Link to="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-black text-yellow-400" style={{ 
              textShadow: '3px 3px 0px #1e3a8a, 6px 6px 0px rgba(0,0,0,0.3)',
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: '2px'
            }}>
              DROP
            </span>
            <span className="text-3xl text-yellow-400" style={{ filter: 'drop-shadow(2px 2px 0px #1e3a8a)' }}>
              🏋️
            </span>
            <span className="text-4xl font-black text-yellow-400" style={{ 
              textShadow: '3px 3px 0px #1e3a8a, 6px 6px 0px rgba(0,0,0,0.3)',
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: '2px'
            }}>
              IN
            </span>
          </div>
        </Link>

        {/* Right side - Dynamic content based on auth status */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/venues" 
            className="text-gray-800 hover:text-gray-900 font-semibold px-4 py-2 text-sm transition-all duration-200 uppercase tracking-wide"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Browse Gyms
          </Link>
          
                           {user ? (
                   // Authenticated user menu
                   <>
                     <Link 
                       to="/profile" 
                       className="text-gray-800 hover:text-gray-900 font-semibold px-4 py-2 text-sm transition-all duration-200 uppercase tracking-wide"
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                     >
                       Profile
                     </Link>
                     {isOwner && (
                       <Link 
                         to="/owner" 
                         className="text-gray-800 hover:text-gray-900 font-semibold px-4 py-2 text-sm transition-all duration-200 uppercase tracking-wide"
                         style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                       >
                         Dashboard
                       </Link>
                     )}
                     <div className="flex items-center space-x-4">
                       <span className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                         Hi, {profile?.full_name || user.email}
                       </span>
                       <button
                         onClick={handleSignOut}
                         className="bg-black text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 uppercase tracking-wide"
                         style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                       >
                         Sign Out
                       </button>
                     </div>
                   </>
                 ) : (
            // Guest user menu
            <>
              <Link 
                to="/auth/login" 
                className="text-gray-800 hover:text-gray-900 font-semibold px-4 py-2 text-sm transition-all duration-200 uppercase tracking-wide"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Login
              </Link>
              <Link 
                to="/auth/signup" 
                className="text-white px-6 py-2 font-semibold text-sm hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: '#E3BFC0'
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
