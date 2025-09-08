import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  MapPin, 
  Camera, 
  Building2, 
  Star,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  ParkingCircle,
  Waves,
  ThermometerSun,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface GymFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  auto_blane_price: number;
  amenities: string[];
  photos: File[];
  contact_phone: string;
  contact_email: string;
}

const CreateGym = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<GymFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    tier: 'BASIC',
    auto_blane_price: 50,
    amenities: [],
    photos: [],
    contact_phone: '',
    contact_email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'equipment', label: 'Modern Equipment', icon: Dumbbell },
    { id: 'cafe', label: 'Cafe', icon: Coffee },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'sauna', label: 'Sauna', icon: ThermometerSun },
    { id: 'shower', label: 'Showers', icon: Waves },
    { id: 'locker', label: 'Lockers', icon: Building2 }
  ];

  const handleInputChange = (field: keyof GymFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.description || !formData.city) {
        throw new Error('Please fill in all required fields');
      }

      // Create gym data
      const gymData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        tier: formData.tier,
        auto_blane_price: formData.auto_blane_price,
        amenities: formData.amenities,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        owner_id: user?.id,
        is_active: false // New gyms need approval
      };

      // Submit to Supabase
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify(gymData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          description: '',
          address: '',
          city: '',
          latitude: 0,
          longitude: 0,
          tier: 'BASIC',
          auto_blane_price: 50,
          amenities: [],
          photos: [],
          contact_phone: '',
          contact_email: ''
        });
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to create gym: ${errorData}`);
      }

    } catch (error) {
      console.error('Error creating gym:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-space-grotesk font-bold text-gray-900">
                🏋️‍♂️ Create New Gym
              </h1>
              <p className="text-gray-600 font-space-grotesk">
                Add your gym to the platform and start accepting bookings
              </p>
            </div>
            <Link
              to="/owner/dashboard"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-space-grotesk font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  Gym Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your gym name"
                  className="mt-1 font-space-grotesk"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-space-grotesk font-medium text-gray-900">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your gym, facilities, and what makes it special"
                  className="mt-1 font-space-grotesk"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tier" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Gym Tier
                  </Label>
                  <Select value={formData.tier} onValueChange={(value) => handleInputChange('tier', value)}>
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
                    value={formData.auto_blane_price}
                    onChange={(e) => handleInputChange('auto_blane_price', parseInt(e.target.value))}
                    placeholder="50"
                    className="mt-1 font-space-grotesk"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                📍 Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="address" className="text-sm font-space-grotesk font-medium text-gray-900">
                  Address *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your gym address"
                    className="font-space-grotesk"
                    required
                  />
                  <Button
                    type="button"
                    onClick={getLocation}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-space-grotesk font-medium"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Location
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-space-grotesk font-medium text-gray-900">
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Casablanca, Rabat, Marrakech..."
                  className="mt-1 font-space-grotesk"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+212 6XX XXX XXX"
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
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="gym@example.com"
                    className="mt-1 font-space-grotesk"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                🏋️ Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.id);
                  
                  return (
                    <div
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        <span className={`text-sm font-space-grotesk font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {amenity.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                📸 Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="photos" className="text-sm font-space-grotesk font-medium text-gray-900">
                    Upload Photos
                  </Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-1 font-space-grotesk"
                  />
                  <p className="text-sm text-gray-500 font-space-grotesk mt-1">
                    Upload photos of your gym facilities, equipment, and spaces
                  </p>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Gym photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/owner/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-space-grotesk font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-space-grotesk font-medium transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Gym'}
            </Button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 font-space-grotesk font-medium">
                  Gym created successfully! It will be reviewed before going live.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 font-space-grotesk font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateGym;
