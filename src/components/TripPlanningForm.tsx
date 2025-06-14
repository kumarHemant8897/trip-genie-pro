
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, DollarSign, Users, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripFormData {
  title: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: string;
  travelerType: string;
  interests: string[];
  activityLevel: string;
  dietaryPreferences: string[];
  mustVisitPlaces: string;
}

interface TripPlanningFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const interests = [
  'Nature & Parks', 'History & Culture', 'Food & Dining', 'Shopping',
  'Museums & Art', 'Nightlife', 'Adventure Sports', 'Architecture',
  'Local Markets', 'Photography', 'Religious Sites', 'Music & Festivals'
];

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 
  'Dairy-Free', 'Nut Allergies', 'Seafood Allergies'
];

const TripPlanningForm = ({ onSubmit, isLoading }: TripPlanningFormProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    destination: '',
    startDate: undefined,
    endDate: undefined,
    budget: '',
    travelerType: '',
    interests: [],
    activityLevel: '',
    dietaryPreferences: [],
    mustVisitPlaces: '',
  });

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleDietaryChange = (dietary: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: checked 
        ? [...prev.dietaryPreferences, dietary]
        : prev.dietaryPreferences.filter(d => d !== dietary)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Plan Your Perfect Trip
        </CardTitle>
        <CardDescription>
          Tell us about your travel preferences and we'll create a personalized itinerary for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Europe Adventure"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Budget & Traveler Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget (USD)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 2000"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Traveler Type
              </Label>
              <Select value={formData.travelerType} onValueChange={(value) => setFormData(prev => ({ ...prev, travelerType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select traveler type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Traveler</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Activity Level
            </Label>
            <Select value={formData.activityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relaxed">Relaxed - Take it slow and enjoy</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced pace</SelectItem>
                <SelectItem value="active">Active - Pack in lots of activities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Interests (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label>Dietary Preferences (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryOptions.map((dietary) => (
                <div key={dietary} className="flex items-center space-x-2">
                  <Checkbox
                    id={dietary}
                    checked={formData.dietaryPreferences.includes(dietary)}
                    onCheckedChange={(checked) => handleDietaryChange(dietary, checked as boolean)}
                  />
                  <Label htmlFor={dietary} className="text-sm">{dietary}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Must Visit Places */}
          <div className="space-y-2">
            <Label htmlFor="mustVisit">Must-Visit Places (Optional)</Label>
            <Textarea
              id="mustVisit"
              placeholder="List any specific places you absolutely want to visit..."
              value={formData.mustVisitPlaces}
              onChange={(e) => setFormData(prev => ({ ...prev, mustVisitPlaces: e.target.value }))}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Generating Your Itinerary..." : "Create My Itinerary"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripPlanningForm;
