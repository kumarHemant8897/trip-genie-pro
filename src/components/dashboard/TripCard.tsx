
import React from 'react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MapPin, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onViewTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

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

export const TripCard = ({ trip, onViewTrip, onEditTrip, onDeleteTrip }: TripCardProps) => {
  return (
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
              onClick={() => onDeleteTrip(trip.id)}
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
