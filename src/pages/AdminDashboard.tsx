import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Building2, 
  Video, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Plus,
  Search,
  Filter,
  Users,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FULL_EXERCISE_DATABASE } from '@/data/full-exercise-database';
import { AddExerciseVideo } from '@/components/AddExerciseVideo';

interface Gym {
  id: string;
  name: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  owner_id: string;
  description?: string;
  image_url?: string;
}

interface ExerciseVideo {
  id: string;
  exercise_id: string;
  exercise_name: string;
  video_url: string;
  thumbnail_url?: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [exerciseVideos, setExerciseVideos] = useState<ExerciseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Check if user is admin - check user role from database
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  // Check admin role from database
  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminCheckLoading(false);
      return;
    }

    try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'ADMIN');
        }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadGyms();
      loadExerciseVideos();
    }
  }, [isAdmin]);

  const loadGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGyms(data || []);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const loadExerciseVideos = async () => {
    try {
      // For now, we'll create a mock list from the exercise database
      const videos: ExerciseVideo[] = FULL_EXERCISE_DATABASE
        .filter(exercise => exercise.fullVideoUrl)
        .map(exercise => ({
          id: exercise.id,
          exercise_id: exercise.id,
          exercise_name: exercise.nameEn,
          video_url: exercise.fullVideoUrl || '',
          thumbnail_url: exercise.fullVideoImageUrl,
          is_approved: true,
          created_at: new Date().toISOString()
        }));
      
      setExerciseVideos(videos);
    } catch (error) {
      console.error('Error loading exercise videos:', error);
    }
  };

  const approveGym = async (gymId: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'approved' })
        .eq('id', gymId);

      if (error) throw error;
      loadGyms();
    } catch (error) {
      console.error('Error approving gym:', error);
    }
  };

  const rejectGym = async (gymId: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'rejected' })
        .eq('id', gymId);

      if (error) throw error;
      loadGyms();
    } catch (error) {
      console.error('Error rejecting gym:', error);
    }
  };

  const updateExerciseVideo = async (exerciseId: string, newVideoUrl: string) => {
    try {
      // Update the exercise database
      const exerciseIndex = FULL_EXERCISE_DATABASE.findIndex(ex => ex.id === exerciseId);
      if (exerciseIndex !== -1) {
        FULL_EXERCISE_DATABASE[exerciseIndex].fullVideoUrl = newVideoUrl;
        FULL_EXERCISE_DATABASE[exerciseIndex].fullVideoImageUrl = 
          `https://img.youtube.com/vi/${newVideoUrl.split('v=')[1]}/hqdefault.jpg`;
      }
      
      // Reload videos
      loadExerciseVideos();
    } catch (error) {
      console.error('Error updating exercise video:', error);
    }
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gym.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || gym.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredVideos = exerciseVideos.filter(video => 
    video.exercise_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-red-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Access Denied
              </h2>
              <p className="text-gray-600">Please log in to access the admin dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Checking Admin Access...
              </h2>
              <p className="text-gray-600">Verifying your permissions...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-red-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Admin Access Required
              </h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <Shield className="w-8 h-8 mr-3 text-blue-500" />
              Admin Dashboard
            </CardTitle>
            <p className="text-gray-600">Manage gyms and exercise videos</p>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Gyms</p>
                  <p className="text-2xl font-bold">{gyms.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold">{gyms.filter(g => g.status === 'pending').length}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Gyms</p>
                  <p className="text-2xl font-bold">{gyms.filter(g => g.status === 'approved').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exercise Videos</p>
                  <p className="text-2xl font-bold">{exerciseVideos.length}</p>
                </div>
                <Video className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="gyms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gyms">Gym Management</TabsTrigger>
            <TabsTrigger value="videos">Video Management</TabsTrigger>
          </TabsList>

          {/* Gym Management Tab */}
          <TabsContent value="gyms" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-6 h-6 mr-2 text-blue-500" />
                  Gym Approval System
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Gyms</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="filter">Filter by Status</Label>
                    <select
                      id="filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Gym List */}
                <div className="space-y-4">
                  {filteredGyms.map((gym) => (
                    <Card key={gym.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{gym.name}</h3>
                              <Badge 
                                variant={
                                  gym.status === 'approved' ? 'default' :
                                  gym.status === 'rejected' ? 'destructive' : 'secondary'
                                }
                              >
                                {gym.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{gym.address}</p>
                            {gym.description && (
                              <p className="text-sm text-gray-500">{gym.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Created: {new Date(gym.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {gym.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveGym(gym.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectGym(gym.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Management Tab */}
          <TabsContent value="videos" className="space-y-4">
            {/* Add New Video */}
            <AddExerciseVideo onVideoAdded={() => loadExerciseVideos()} />
            
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-6 h-6 mr-2 text-purple-500" />
                  Exercise Video Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <Label htmlFor="video-search">Search Exercises</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="video-search"
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Video List */}
                <div className="space-y-4">
                  {filteredVideos.map((video) => (
                    <Card key={video.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{video.exercise_name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline">Exercise ID: {video.exercise_id}</Badge>
                              <Badge variant={video.is_approved ? 'default' : 'secondary'}>
                                {video.is_approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-sm font-medium">Current Video URL:</Label>
                                <p className="text-sm text-gray-600 break-all">{video.video_url}</p>
                              </div>
                              {video.thumbnail_url && (
                                <div>
                                  <Label className="text-sm font-medium">Thumbnail:</Label>
                                  <img 
                                    src={video.thumbnail_url} 
                                    alt="Video thumbnail"
                                    className="w-32 h-20 object-cover rounded mt-1"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newUrl = prompt('Enter new YouTube video URL:', video.video_url);
                                if (newUrl && newUrl !== video.video_url) {
                                  updateExerciseVideo(video.exercise_id, newUrl);
                                }
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Update Video
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
