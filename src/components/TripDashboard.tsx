
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trip'; // Import Trip type
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { DateRange } from "react-day-picker";

import { TripDashboardHeader } from './dashboard/TripDashboardHeader';
import { TripFilters } from './dashboard/TripFilters';
import { TripStats } from './dashboard/TripStats';
import { TripList } from './dashboard/TripList';
import { TripLoadingSkeleton } from './dashboard/TripLoadingSkeleton';


interface TripDashboardProps {
  onCreateNew: () => void;
  onViewTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
}

const TripDashboard = ({ onCreateNew, onViewTrip, onEditTrip }: TripDashboardProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
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

  const handleDateRangeUpdate = (values: { range: DateRange | undefined, rangeCompare?: DateRange | undefined }) => {
    setDateRange(values.range);
    // Add filtering logic based on dateRange here if needed
    console.log("Date range updated:", values.range);
  };

  const filteredTrips = trips.filter(trip =>
    (trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     trip.destination.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!dateRange?.from || new Date(trip.start_date) >= dateRange.from) &&
    (!dateRange?.to || new Date(trip.end_date) <= dateRange.to)
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <TripLoadingSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
      <TripDashboardHeader />
      
      <TripFilters 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onDateRangeUpdate={handleDateRangeUpdate}
      />
      
      <TripStats />

      <TripList 
        trips={filteredTrips}
        onCreateNew={onCreateNew}
        onViewTrip={onViewTrip}
        onEditTrip={onEditTrip}
        onDeleteTrip={deleteTrip}
      />

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
