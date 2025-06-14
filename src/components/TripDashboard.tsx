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
  PlaneTakeoff, 
  Filter, 
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'; // Assuming this exists or you'll create it
import { PlaceholderChart } from '@/components/PlaceholderChart'; // Import placeholder chart

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

// Placeholder for DatePickerWithRange if not already created (you might need to create this component)
// For now, I'll just use a simple input as a placeholder for the date picker to avoid breaking build.
// You should replace this with a proper shadcn/ui DateRangePicker.
const DatePickerWithRangePlaceholder = ({ className }: { className?: string; onUpdate?: (values: { range: any }) => void; }) => (
  <Input type="text" placeholder="Select date range (placeholder)" className={className} />
);


const TripDashboard = ({ onCreateNew, onViewTrip, onEditTrip }: TripDashboardProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  // const [dateRange, setDateRange] = useState<DateRange | undefined>(); // For actual date picker

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

  // Filtered trips (basic example, expand as needed)
  const filteredTrips = trips.filter(trip => 
    trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse rounded-2xl shadow-soft-light">
              <CardHeader className="p-5">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
      {/* Header Banner */}
      <div 
        className="mb-10 p-8 rounded-2xl bg-cover bg-center text-white shadow-xl"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1800')" }} // Example image
      >
        <div className="bg-black/40 p-6 rounded-xl backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-bold">My Trips</h1>
          <p className="text-lg md:text-xl mt-2 opacity-90">Your adventures, beautifully organized and ready to explore.</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input 
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl h-11 shadow-sm focus:ring-sky-blue-DEFAULT focus:border-sky-blue-DEFAULT"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2 items-center">
           <DatePickerWithRangePlaceholder className="rounded-xl h-11 shadow-sm focus:ring-sky-blue-DEFAULT focus:border-sky-blue-DEFAULT" />
           {/* Replace with actual DatePickerWithRange
           <DatePickerWithRange 
            className="rounded-xl h-11 shadow-sm"
            onUpdate={({ range }) => setDateRange(range)} 
           /> 
           */}
          <Button variant="outline" size="lg" className="h-11 rounded-xl shadow-sm hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>
      
      {/* Chart Placeholders Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceholderChart title="Itinerary Progress" type="line" />
          <PlaceholderChart title="Bookings Overview" type="bar" />
          <PlaceholderChart title="Savings & Budget" type="pie" />
        </div>
      </div>


      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <Card className="text-center py-16 bg-white rounded-2xl shadow-soft-medium border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center">
            <PlaneTakeoff className="w-24 h-24 text-sky-blue-DEFAULT mx-auto mb-6 opacity-70" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Trips Yet, Adventurer?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Your next journey awaits! Click below to start planning something amazing.</p>
            <Button onClick={onCreateNew} size="lg" className="bg-coral-DEFAULT hover:bg-coral-DEFAULT/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Plan Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card 
              key={trip.id} 
              className="bg-white rounded-2xl shadow-soft-light hover:shadow-soft-medium transition-all duration-300 ease-in-out group overflow-hidden"
            >
              <CardHeader className="p-5 border-b bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-sky-blue-DEFAULT group-hover:text-coral-DEFAULT transition-colors">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 text-slate-500">
                      <MapPin className="w-4 h-4 text-coral-DEFAULT" />
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
                        <Badge key={idx} variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
                          {interest}
                        </Badge>
                      ))}
                      {trip.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
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
                            className="flex-1 bg-sky-blue-DEFAULT hover:bg-sky-blue-DEFAULT/90 text-white rounded-lg"
                            onClick={() => onViewTrip(trip)}
                        >
                            <Eye className="w-4 h-4 mr-1.5" />
                            View
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="text-slate-600 hover:bg-slate-100 hover:text-sky-blue-DEFAULT rounded-lg"
                            onClick={() => onEditTrip(trip)}
                            title="Edit Trip"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
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

      {/* Floating Action Button */}
      <Button
        onClick={onCreateNew}
        size="lg"
        className="fixed bottom-8 right-8 bg-coral-DEFAULT hover:bg-coral-DEFAULT/90 text-white rounded-full w-16 h-16 shadow-xl hover:scale-105 transition-all"
        title="Plan New Trip"
      >
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default TripDashboard;
