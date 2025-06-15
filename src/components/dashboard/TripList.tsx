
import React from 'react';
import { Trip } from '@/types/trip';
import { TripCard } from './TripCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaneTakeoff, Plus } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  onCreateNew: () => void;
  onViewTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripList = ({ trips, onCreateNew, onViewTrip, onEditTrip, onDeleteTrip }: TripListProps) => {
  if (trips.length === 0) {
    return (
      <Card className="text-center py-16 bg-white rounded-2xl shadow-soft-medium border-dashed border-2 border-gray-300 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1500&q=80"
          alt="Adventurous landscape"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
        <CardContent className="flex flex-col items-center relative z-10">
          <PlaneTakeoff className="w-24 h-24 text-white mx-auto mb-6 opacity-90" />
          <h3 className="text-2xl font-semibold text-white mb-2">No Trips Yet, Adventurer?</h3>
          <p className="text-gray-200 mb-8 max-w-md mx-auto">Your next journey awaits! Click below to start planning something amazing.</p>
          <Button 
            onClick={onCreateNew} 
            size="lg" 
            variant="destructive" 
            className="rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Plan Your First Trip
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onViewTrip={onViewTrip}
          onEditTrip={onEditTrip}
          onDeleteTrip={onDeleteTrip}
        />
      ))}
    </div>
  );
};
