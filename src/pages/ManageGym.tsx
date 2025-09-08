import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Settings,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  auto_blane_price: number;
  amenities: string[];
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
  owner_id: string;
}

const ManageGym = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadGym();
    }
  }, [id]);

  const loadGym = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?id=eq.${id}&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      if (response.ok) {
        const gymData = await response.json();
        if (gymData.length > 0) {
          setGym(gymData[0]);
        }
      }
    } catch (error) {
      console.error('Error loading gym:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Gym, value: any) => {
    if (gym) {
      setGym(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSave = async () => {
    if (!gym) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?id=eq.${gym.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify({
          name: gym.name,
          description: gym.description,
          address: gym.address,
          city: gym.city,
          tier: gym.tier,
          auto_blane_price: gym.auto_blane_price,
          amenities: gym.amenities,
          contact_phone: gym.contact_phone,
          contact_email: gym.contact_email
        })
      });

      if (response.ok) {
        setSaveStatus('success');
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to update gym: ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating gym:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case 'BASIC': return '🏋️';
      case 'STANDARD': return '🏋️';
      case 'PREMIUM': return '🏋️';
      case 'LUXURY': return '🏋️';
      default: return '🏋️';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-green-100 text-green-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'LUXURY': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-space-grotesk">Loading gym details...</p>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-space-grotesk font-bold text-gray-900 mb-4">Gym Not Found</h1>
          <Link
            to="/owner/dashboard"
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-space-grotesk font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/owner/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-space-grotesk font-bold text-gray-900">
                  🏋️‍♂️ Manage Gym
                </h1>
                <p className="text-gray-600 font-space-grotesk">
                  Edit your gym details and settings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getTierColor(gym.tier)} font-space-grotesk font-medium`}>
                {getTierEmoji(gym.tier)} {gym.tier}
              </Badge>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-gray-800 text-white font-space-grotesk font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                  📋 Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Gym Name
                  </Label>
                  <Input
                    id="name"
                    value={gym.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 font-space-grotesk"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={gym.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 font-space-grotesk"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="tier" className="text-sm font-space-grotesk font-medium text-gray-900">
                      Gym Tier
                    </Label>
                    <Select value={gym.tier} onValueChange={(value) => handleInputChange('tier', value)}>
                      <SelectTrigger className="mt-1 font-space-grotesk">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">🏋️ Basic</SelectItem>
                        <SelectItem value="STANDARD">🏋️ Standard</SelectItem>
                        <SelectItem value="PREMIUM">🏋️ Premium</SelectItem>
                        <SelectItem value="LUXURY">🏋️ Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-space-grotesk font-medium text-gray-900">
                      Price per Hour (MAD)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={gym.auto_blane_price}
                      onChange={(e) => handleInputChange('auto_blane_price', parseInt(e.target.value))}
                      className="mt-1 font-space-grotesk"
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                  📞 Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="address" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={gym.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1 font-space-grotesk"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-space-grotesk font-medium text-gray-900">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={gym.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-1 font-space-grotesk"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-space-grotesk font-medium text-gray-900">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={gym.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="mt-1 font-space-grotesk"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-space-grotesk font-medium text-gray-900">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={gym.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="mt-1 font-space-grotesk"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gym Status */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk font-semibold text-gray-900">
                  📊 Gym Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-space-grotesk text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800 font-space-grotesk font-medium">
                      {gym.is_active ? 'Active' : 'Pending Approval'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-space-grotesk text-gray-600">Tier</span>
                    <Badge className={`${getTierColor(gym.tier)} font-space-grotesk font-medium`}>
                      {getTierEmoji(gym.tier)} {gym.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-space-grotesk text-gray-600">Price</span>
                    <span className="text-sm font-space-grotesk font-medium text-gray-900">
                      {gym.auto_blane_price} MAD/hour
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk font-semibold text-gray-900">
                  📈 Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-space-grotesk text-gray-600">Total Bookings</span>
                    <span className="ml-auto text-sm font-space-grotesk font-medium text-gray-900">0</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-space-grotesk text-gray-600">Average Rating</span>
                    <span className="ml-auto text-sm font-space-grotesk font-medium text-gray-900">4.5</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-space-grotesk text-gray-600">Revenue</span>
                    <span className="ml-auto text-sm font-space-grotesk font-medium text-gray-900">0 MAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Status */}
            {saveStatus === 'success' && (
              <Card className="bg-green-50 border border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-space-grotesk font-medium text-sm">
                      Changes saved successfully!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {saveStatus === 'error' && (
              <Card className="bg-red-50 border border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800 font-space-grotesk font-medium text-sm">
                      {errorMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGym;
