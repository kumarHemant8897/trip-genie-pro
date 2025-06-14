import React, { forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, DollarSign, Utensils, Camera, Share, Edit, Download, Image as ImageIcon } from 'lucide-react';

interface DayActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  estimatedCost: number;
  duration: string;
  imageUrl?: string;
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

const ItineraryDisplay = forwardRef<HTMLDivElement, ItineraryDisplayProps>(
  ({ itinerary, onEdit, onShare, onDownload }, ref) => {
    const ActivityCard = ({ activity }: { activity: DayActivity }) => (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
        {activity.imageUrl && (
          <div className="w-full h-40 rounded-md overflow-hidden mb-3">
            <img 
              src={activity.imageUrl} 
              alt={activity.activity} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        {!activity.imageUrl && (
           <div className="w-full h-20 bg-slate-100 rounded-md flex items-center justify-center mb-3">
             <ImageIcon className="w-10 h-10 text-slate-400" />
           </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-700">{activity.time}</span>
            <Badge variant="outline" className="border-blue-300 text-blue-700">{activity.duration}</Badge>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">${activity.estimatedCost}</span>
          </div>
        </div>
        
        <h4 className="font-semibold text-lg text-gray-900">{activity.activity}</h4>
        
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="text-sm">{activity.location}</span>
        </div>
        
        <p className="text-sm text-gray-700">{activity.description}</p>
      </div>
    );

    // Sample image URL for demonstration
    const sampleImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop";

    return (
      <div ref={ref} className="max-w-4xl mx-auto space-y-8 bg-slate-50 p-6 rounded-lg shadow-lg print-content">
        {/* Header */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold">{itinerary.tripTitle}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg text-blue-100 mt-1">
                  <MapPin className="w-5 h-5" />
                  {itinerary.destination} • {itinerary.duration}
                </CardDescription>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" onClick={onShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-around pt-6 mt-6 border-t border-blue-400/50">
              <div className="text-center">
                <div className="text-3xl font-bold">${itinerary.totalBudget.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{itinerary.days.length}</div>
                <div className="text-sm text-blue-200">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {itinerary.days.reduce((total, day) => total + day.morning.length + day.afternoon.length + day.evening.length, 0)}
                </div>
                <div className="text-sm text-blue-200">Activities</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Daily Itineraries */}
        {itinerary.days.map((day) => (
          <Card key={day.day} className="shadow-md">
            <CardHeader className="bg-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                    Day {day.day}
                    <Badge variant="secondary" className="bg-blue-500 text-white">{day.date}</Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{day.weather.icon}</span>
                      <span>{day.weather.condition} • {day.weather.temperature}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>Daily budget: ${day.totalCost}</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Morning */}
              {day.morning.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                    🌅 Morning
                  </h3>
                  <div className="space-y-4">
                    {day.morning.map((activity, idx) => (
                      <ActivityCard key={idx} activity={{...activity, imageUrl: activity.imageUrl || (idx % 2 === 0 ? sampleImageUrl : undefined)}} />
                    ))}
                  </div>
                </div>
              )}

              {day.morning.length > 0 && (day.afternoon.length > 0 || day.evening.length > 0) && <Separator />}

              {/* Afternoon */}
              {day.afternoon.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center gap-2">
                    ☀️ Afternoon
                  </h3>
                  <div className="space-y-4">
                    {day.afternoon.map((activity, idx) => (
                      <ActivityCard key={idx} activity={{...activity, imageUrl: activity.imageUrl || (idx % 2 !== 0 ? sampleImageUrl : undefined)}} />
                    ))}
                  </div>
                </div>
              )}
              
              {day.afternoon.length > 0 && day.evening.length > 0 && <Separator />}

              {/* Evening */}
              {day.evening.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                    🌙 Evening
                  </h3>
                  <div className="space-y-4">
                    {day.evening.map((activity, idx) => (
                      <ActivityCard key={idx} activity={{...activity, imageUrl: activity.imageUrl || (idx % 2 === 0 ? sampleImageUrl : undefined)}} />
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Tips */}
              {day.tips.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-teal-500" /> Daily Tips & Notes
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-2">
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
            <Card className="shadow-sm">
              <CardHeader className="bg-teal-500 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  💡 General Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  {itinerary.generalTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {itinerary.culturalNotes.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-purple-500 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  🏛️ Cultural Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
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

ItineraryDisplay.displayName = "ItineraryDisplay";

export default ItineraryDisplay;
