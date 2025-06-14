import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import TripDashboard from '@/components/TripDashboard';
import TripPlanningForm from '@/components/TripPlanningForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateItinerary, TripFormData } from '@/services/openaiService';
import { LogOut, ArrowLeft } from 'lucide-react';

type ViewState = 'dashboard' | 'create' | 'view' | 'generating';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleCreateTrip = async (formData: TripFormData) => {
    if (!user) return;

    // Check for required dates
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please provide both a Start Date and an End Date for your trip.",
        variant: "destructive",
      });
      setCurrentView('create'); // Stay on create form or switch back if somehow on another view
      return;
    }

    setIsGenerating(true);
    setCurrentView('generating');

    try {
      // Generate itinerary using AI
      const itinerary = await generateItinerary(formData);
      
      // Save trip to database
      const tripData = {
        user_id: user.id,
        title: formData.title,
        destination: formData.destination,
        start_date: formData.startDate.toISOString().split('T')[0], // Now we know startDate is defined
        end_date: formData.endDate.toISOString().split('T')[0],     // Now we know endDate is defined
        budget: formData.budget ? parseFloat(formData.budget) : null,
        traveler_type: formData.travelerType,
        interests: formData.interests,
        activity_level: formData.activityLevel,
        dietary_preferences: formData.dietaryPreferences,
        must_visit_places: formData.mustVisitPlaces ? [formData.mustVisitPlaces] : [],
        generated_itinerary: itinerary,
      };

      const { data, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single();

      if (error) throw error;

      setGeneratedItinerary(itinerary);
      setSelectedTrip(data);
      setCurrentView('view');
      
      toast({
        title: "Success!",
        description: "Your personalized itinerary has been created!",
      });
    } catch (error: any) {
      console.error("Error creating trip:", error); // Added console log for better debugging
      toast({
        title: "Error",
        description: `Failed to generate itinerary. ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
      setCurrentView('create');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip);
    setGeneratedItinerary(trip.generated_itinerary);
    setCurrentView('view');
  };

  const handleEditTrip = (trip: any) => {
    // For now, just redirect to view
    handleViewTrip(trip);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTrip(null);
    setGeneratedItinerary(null);
  };

  const handleAuthSuccess = () => {
    // Auth state will be handled by useAuth hook
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
              <TripPlanningForm 
                onSubmit={handleCreateTrip} 
                isLoading={isGenerating}
              />
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Perfect Itinerary</h2>
              <p className="text-gray-600 mb-6">Our AI is analyzing your preferences and crafting a personalized travel experience...</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Analyzing destination</p>
                <p>✓ Finding best attractions</p>
                <p>✓ Planning optimal routes</p>
                <p className="animate-pulse">⏳ Generating itinerary...</p>
              </div>
            </div>
          </div>
        );

      case 'view':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
              {generatedItinerary && (
                <ItineraryDisplay
                  itinerary={generatedItinerary}
                  onEdit={() => setCurrentView('create')}
                  onShare={() => toast({ title: "Share feature coming soon!" })}
                  onDownload={() => toast({ title: "PDF download coming soon!" })}
                />
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✈️</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Smart Travel Planner</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
            <TripDashboard 
              onCreateNew={() => setCurrentView('create')}
              onViewTrip={handleViewTrip}
              onEditTrip={handleEditTrip}
            />
          </div>
        );
    }
  };

  return renderContent();
};

export default Index;
