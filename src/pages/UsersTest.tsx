import React, { useState, useEffect } from 'react';
import { UsersAPI, UserProfile, CustomerDashboard, GymOwnerDashboard, UpdateProfileData } from '../lib/api/users';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const UsersTest: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [customerDashboard, setCustomerDashboard] = useState<CustomerDashboard | null>(null);
  const [gymOwnerDashboard, setGymOwnerDashboard] = useState<GymOwnerDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile update form
  const [updateForm, setUpdateForm] = useState<UpdateProfileData>({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Credit transaction form
  const [creditForm, setCreditForm] = useState({
    amount: 0,
    operation: 'ADD' as 'ADD' | 'SUBTRACT',
    reason: ''
  });

  const handleGetProfile = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const profile = await UsersAPI.getUserProfile(userId);
      if (profile) {
        setUserProfile(profile);
        setUpdateForm({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          country: profile.country || '',
          bio: profile.bio || '',
          preferred_language: profile.preferred_language || 'en'
        });

        // Get dashboard data based on role
        if (profile.role === 'CUSTOMER') {
          const dashboard = await UsersAPI.getCustomerDashboard(userId);
          setCustomerDashboard(dashboard);
        } else if (profile.role === 'CLUB_OWNER') {
          const dashboard = await UsersAPI.getGymOwnerDashboard(userId);
          setGymOwnerDashboard(dashboard);
        }

        setSuccess('Profile loaded successfully');
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await UsersAPI.updateProfile(userId, updateForm);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        setSuccess('Profile updated successfully');
        setShowUpdateForm(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredits = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await UsersAPI.updateCredits({
        user_id: userId,
        amount: creditForm.amount,
        operation: creditForm.operation,
        reason: creditForm.reason
      });

      if (success) {
        setSuccess('Credits updated successfully');
        // Reload profile to see updated credits
        await handleGetProfile();
      } else {
        setError('Failed to update credits');
      }
    } catch (err) {
      setError('Error updating credits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLastLogin = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await UsersAPI.updateLastLogin(userId);
      if (success) {
        setSuccess('Last login updated successfully');
        await handleGetProfile();
      } else {
        setError('Failed to update last login');
      }
    } catch (err) {
      setError('Error updating last login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'CLUB_OWNER': return 'bg-green-100 text-green-800';
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F2E4E5] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Enhanced Users System Test</CardTitle>
            <CardDescription>
              Test the enhanced user profiles system with customer and gym owner features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User ID Input */}
            <div className="flex gap-4">
              <Input
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGetProfile} disabled={loading}>
                {loading ? 'Loading...' : 'Get Profile'}
              </Button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-100 border border-green-300 rounded-md">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* User Profile Display */}
            {userProfile && (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="update">Update</TabsTrigger>
                  <TabsTrigger value="credits">Credits</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        User Profile
                        <Badge className={getRoleBadgeColor(userProfile.role)}>
                          {userProfile.role}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Full Name</Label>
                        <p className="text-gray-700">{userProfile.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Email</Label>
                        <p className="text-gray-700">{userProfile.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Phone</Label>
                        <p className="text-gray-700">{userProfile.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Country</Label>
                        <p className="text-gray-700">{userProfile.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Membership Status</Label>
                        <Badge className={getStatusBadgeColor(userProfile.membership_status || 'ACTIVE')}>
                          {userProfile.membership_status || 'ACTIVE'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="font-semibold">Is Active</Label>
                        <Badge className={userProfile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {userProfile.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {userProfile.role === 'CUSTOMER' && (
                        <>
                          <div>
                            <Label className="font-semibold">Fitness Level</Label>
                            <p className="text-gray-700">{userProfile.fitness_level || 'Not specified'}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Total Credits</Label>
                            <p className="text-gray-700">{userProfile.total_credits || 0}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Used Credits</Label>
                            <p className="text-gray-700">{userProfile.used_credits || 0}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Available Credits</Label>
                            <p className="text-gray-700">{(userProfile.total_credits || 0) - (userProfile.used_credits || 0)}</p>
                          </div>
                        </>
                      )}
                      {userProfile.role === 'CLUB_OWNER' && (
                        <>
                          <div>
                            <Label className="font-semibold">Business Name</Label>
                            <p className="text-gray-700">{userProfile.business_name || 'Not provided'}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Verification Status</Label>
                            <Badge className={getStatusBadgeColor(userProfile.verification_status || 'PENDING')}>
                              {userProfile.verification_status || 'PENDING'}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-semibold">Business Registration</Label>
                            <p className="text-gray-700">{userProfile.business_registration || 'Not provided'}</p>
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <Label className="font-semibold">Bio</Label>
                        <p className="text-gray-700">{userProfile.bio || 'No bio provided'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-4">
                  {userProfile.role === 'CUSTOMER' && customerDashboard && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{customerDashboard.total_bookings}</p>
                          <p className="text-sm text-gray-600">Total Bookings</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{customerDashboard.completed_bookings}</p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{customerDashboard.total_reviews}</p>
                          <p className="text-sm text-gray-600">Reviews Written</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {userProfile.role === 'CLUB_OWNER' && gymOwnerDashboard && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Gym Owner Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{gymOwnerDashboard.total_clubs}</p>
                          <p className="text-sm text-gray-600">Total Clubs</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{gymOwnerDashboard.active_clubs}</p>
                          <p className="text-sm text-gray-600">Active Clubs</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{gymOwnerDashboard.total_bookings}</p>
                          <p className="text-sm text-gray-600">Total Bookings</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{gymOwnerDashboard.total_revenue} MAD</p>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="update" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={updateForm.full_name || ''}
                            onChange={(e) => setUpdateForm({...updateForm, full_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={updateForm.phone || ''}
                            onChange={(e) => setUpdateForm({...updateForm, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={updateForm.country || ''}
                            onChange={(e) => setUpdateForm({...updateForm, country: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferred_language">Preferred Language</Label>
                          <Select
                            value={updateForm.preferred_language || 'en'}
                            onValueChange={(value) => setUpdateForm({...updateForm, preferred_language: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={updateForm.bio || ''}
                          onChange={(e) => setUpdateForm({...updateForm, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="credits" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Credit Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="credit_amount">Amount</Label>
                          <Input
                            id="credit_amount"
                            type="number"
                            value={creditForm.amount}
                            onChange={(e) => setCreditForm({...creditForm, amount: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="credit_operation">Operation</Label>
                          <Select
                            value={creditForm.operation}
                            onValueChange={(value) => setCreditForm({...creditForm, operation: value as 'ADD' | 'SUBTRACT'})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADD">Add Credits</SelectItem>
                              <SelectItem value="SUBTRACT">Subtract Credits</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="credit_reason">Reason</Label>
                          <Input
                            id="credit_reason"
                            value={creditForm.reason}
                            onChange={(e) => setCreditForm({...creditForm, reason: e.target.value})}
                            placeholder="e.g., Purchase, Refund, Bonus"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleUpdateCredits} disabled={loading}>
                          {loading ? 'Processing...' : 'Update Credits'}
                        </Button>
                        <Button onClick={handleUpdateLastLogin} disabled={loading} variant="outline">
                          Update Last Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersTest;
