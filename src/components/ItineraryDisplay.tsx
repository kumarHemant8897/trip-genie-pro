
import React, { forwardRef } from 'react'; // Added forwardRef
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, DollarSign, Utensils, Camera, Share, Edit, Download } from 'lucide-react';

interface DayActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  estimatedCost: number;
  duration: string;
}

interface DayItinerary {
  day: number;
  date: string;
  weather: {
    condition: string;
    temperature: string;
    icon: string;
  };
  morning: DayActivity[];
  afternoon: DayActivity[];
  evening: DayActivity[];
  totalCost: number;
  tips: string[];
}

interface ItineraryData {
  tripTitle: string;
  destination: string;
  duration: string;
  totalBudget: number;
  days: DayItinerary[];
  generalTips: string[];
  culturalNotes: string[];
}

interface ItineraryDisplayProps {
  itinerary: ItineraryData;
  onEdit: () => void;
  onShare: () => void;
  onDownload: () => void;
}

// Wrapped component with forwardRef
const ItineraryDisplay = forwardRef<HTMLDivElement, ItineraryDisplayProps>(
  ({ itinerary, onEdit, onShare, onDownload }, ref) => {
    const ActivityCard = ({ activity }: { activity: DayActivity }) => (
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{activity.time}</span>
            <Badge variant="outline">{activity.duration}</Badge>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">${activity.estimatedCost}</span>
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
        
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{activity.location}</span>
        </div>
        
        <p className="text-sm text-gray-700">{activity.description}</p>
      </div>
    );

    return (
      // Attached the ref here and added some styling for PDF output
      <div ref={ref} className="max-w-4xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md print-content">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{itinerary.tripTitle}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg">
                  <MapPin className="w-4 h-4" />
                  {itinerary.destination} • {itinerary.duration}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={onShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={onDownload}> {/* This calls the function from Index.tsx */}
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 mt-4 border-t"> {/* Added mt-4 for better spacing */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${itinerary.totalBudget}</div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{itinerary.days.length}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {itinerary.days.reduce((total, day) => total + day.morning.length + day.afternoon.length + day.evening.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Daily Itineraries */}
        {itinerary.days.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Day {day.day}
                    <Badge variant="secondary">{day.date}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{day.weather.icon}</span>
                      <span>{day.weather.condition} • {day.weather.temperature}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Daily budget: ${day.totalCost}</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Morning */}
              <div>
                <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  🌅 Morning
                </h3>
                <div className="space-y-3">
                  {day.morning.map((activity, idx) => (
                    <ActivityCard key={idx} activity={activity} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Afternoon */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                  ☀️ Afternoon
                </h3>
                <div className="space-y-3">
                  {day.afternoon.map((activity, idx) => (
                    <ActivityCard key={idx} activity={activity} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Evening */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                  🌙 Evening
                </h3>
                <div className="space-y-3">
                  {day.evening.map((activity, idx) => (
                    <ActivityCard key={idx} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Daily Tips */}
              {day.tips.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Daily Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {day.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itinerary.generalTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 General Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  {itinerary.generalTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {itinerary.culturalNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏛️ Cultural Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  {itinerary.culturalNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
);

ItineraryDisplay.displayName = "ItineraryDisplay"; // For better debugging in React DevTools

export default ItineraryDisplay;

