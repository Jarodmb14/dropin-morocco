import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SimpleHeader from "@/components/SimpleHeader";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { user, userRole, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile form state - get data from user metadata instead of profile
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // Update user metadata instead of profiles table
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Profile updated successfully!");
        // Update local state
        setProfileData({
          ...profileData,
          full_name: profileData.full_name,
          phone: profileData.phone,
        });
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(passwordData.newPassword);

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password updated successfully!");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
        <SimpleHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wide mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            My Profile
          </h1>
          <p className="text-gray-600 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manage your account settings and personal information.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm uppercase tracking-wide transition-all ${
                  activeTab === 'profile'
                    ? 'border-gray-800 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm uppercase tracking-wide transition-all ${
                  activeTab === 'password'
                    ? 'border-gray-800 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {message}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Profile Information
            </h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
                <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Account Type
                </label>
                <div className="px-0 py-4 border-0 border-b-2 border-gray-300 bg-gray-50 text-gray-700 text-lg font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {userRole === 'CLUB_OWNER' ? '🏢 Gym Owner' : '👤 Customer'}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide disabled:opacity-50"
                style={{ 
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: '#E3BFC0'
                }}
              >
                {loading ? "UPDATING..." : "UPDATE PROFILE"}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
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
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottomColor: '#D1D5DB'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide disabled:opacity-50"
                style={{ 
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: '#E3BFC0'
                }}
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
