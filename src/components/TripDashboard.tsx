import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Share,
  Download,
  PlaneTakeoff
} from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  traveler_type: string;
  activity_level: string;
  interests: string[];
  generated_itinerary: any;
  created_at: string;
  is_public: boolean;
}

interface TripDashboardProps {
  onCreateNew: () => void;
  onViewTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
}

const TripDashboard = ({ onCreateNew, onViewTrip, onEditTrip }: TripDashboardProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch trips",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      setTrips(trips.filter(trip => trip.id !== tripId));
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    }
  };

  const getTravelerTypeIcon = (type: string) => {
    switch (type) {
      case 'solo': return '🚶';
      case 'couple': return '💕';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'group': return '👥';
      default: return '🎒';
    }
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'relaxed': return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'active': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">My Trips</h1>
          <p className="text-gray-500 mt-1 text-lg">Your adventures, beautifully organized.</p>
        </div>
        <Button onClick={onCreateNew} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Plan New Trip
        </Button>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-100 shadow-md">
          <CardContent>
            <PlaneTakeoff className="w-20 h-20 text-blue-500 mx-auto mb-6 opacity-70" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Ready for an Adventure?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like your passport is gathering dust! Let's plan your next amazing getaway.</p>
            <Button onClick={onCreateNew} size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Plan Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden">
              <CardHeader className="p-5 border-b bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-indigo-700 group-hover:text-blue-500 transition-colors">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 text-slate-500">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {trip.destination}
                    </CardDescription>
                  </div>
                  <div className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {getTravelerTypeIcon(trip.traveler_type)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>
                      {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  {trip.budget && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium">${trip.budget.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getActivityLevelColor(trip.activity_level)} border text-xs px-2.5 py-1 rounded-full font-medium`}>
                      {trip.activity_level.charAt(0).toUpperCase() + trip.activity_level.slice(1)}
                    </Badge>
                    {trip.generated_itinerary && (
                      <Badge variant="outline" className="border-sky-400 text-sky-600 text-xs px-2.5 py-1 rounded-full font-medium">AI Generated</Badge>
                    )}
                  </div>
                </div>

                {trip.interests && trip.interests.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1.5">Interests:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.interests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-300 text-gray-700">
                          {interest}
                        </Badge>
                      ))}
                      {trip.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                          +{trip.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 mt-2 border-t border-gray-200">
                    <div className="flex gap-2">
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => onViewTrip(trip)}
                        >
                            <Eye className="w-4 h-4 mr-1.5" />
                            View
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                            onClick={() => onEditTrip(trip)}
                            title="Edit Trip"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="text-slate-600 hover:bg-red-50 hover:text-red-600"
                            onClick={() => deleteTrip(trip.id)}
                            title="Delete Trip"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripDashboard;
