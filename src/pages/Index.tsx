import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import TripDashboard from '@/components/TripDashboard';
import TripPlanningForm from '@/components/TripPlanningForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateItinerary, TripFormData } from '@/services/openaiService';
import { LogOut, ArrowLeft, Menu } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// New imports for sidebar and header components
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PageHeader } from '@/components/PageHeader';

type ViewState = 'dashboard' | 'create' | 'view' | 'generating';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const itineraryContentRef = useRef<HTMLDivElement>(null);

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
      console.error("Error creating trip:", error); 
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

  const handleDownloadPdf = async () => {
    if (!itineraryContentRef.current) {
      toast({ 
        title: "Error", 
        description: "Itinerary content not found for PDF generation.", 
        variant: "destructive" 
      });
      return;
    }
    if (!generatedItinerary) {
       toast({ 
        title: "Error", 
        description: "No itinerary data available to generate PDF.", 
        variant: "destructive" 
      });
      return;
    }

    toast({ title: "Generating PDF...", description: "Please wait a moment." });

    try {
      // Temporarily make sure all collapsible content is visible for capture
      // This might require specific handling if you have accordions/collapsibles
      const canvas = await html2canvas(itineraryContentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // If there are external images (e.g., weather icons if they are external)
        logging: false, // Set to true for debugging html2canvas issues
        scrollX: 0,
        scrollY: -window.scrollY, // Adjust for current page scroll to capture top of element
        windowWidth: itineraryContentRef.current.scrollWidth,
        windowHeight: itineraryContentRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height], // PDF page dimensions based on canvas
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${generatedItinerary.tripTitle || 'itinerary'}.pdf`);
      
      toast({ title: "Success!", description: "PDF downloaded." });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ 
        title: "PDF Generation Failed", 
        description: `Could not generate PDF. ${(error as Error).message || 'Unknown error.'}`, 
        variant: "destructive" 
      });
    }
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
          // Set a nice background image, use overlay for readability
          <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1500&q=80')",
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            <div className="relative z-10 w-full p-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50"
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
          <div className="min-h-screen bg-gradient-to-br from-sky-blue-DEFAULT/30 to-coral-DEFAULT/20 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-soft-medium">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue-DEFAULT mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-primary mb-2">Crafting Your Adventure...</h2>
              <p className="text-gray-600 mb-6">Our AI is whipping up a magical journey just for you!</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Analyzing destination vibes</p>
                <p>✓ Finding hidden gems</p>
                <p>✓ Plotting the perfect course</p>
                <p className="animate-pulse text-coral-DEFAULT font-medium">✨ Generating itinerary...</p>
              </div>
            </div>
          </div>
        );

      case 'view':
        return (
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
              {generatedItinerary && (
                <ItineraryDisplay
                  ref={itineraryContentRef}
                  itinerary={generatedItinerary}
                  onEdit={() => setCurrentView('create')} // Consider an edit view later
                  onShare={() => toast({ title: "Share feature coming soon!" })}
                  onDownload={handleDownloadPdf}
                />
              )}
            </div>
          </div>
        );

      default: // Dashboard view
        return (
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-gray-50">
              <AppSidebar onSignOut={signOut} userEmail={user.email} />
              <main className="flex-1 flex flex-col overflow-y-auto">
                <PageHeader />
                <TripDashboard 
                  onCreateNew={() => setCurrentView('create')}
                  onViewTrip={handleViewTrip}
                  onEditTrip={handleEditTrip}
                />
              </main>
            </div>
          </SidebarProvider>
        );
    }
  };

  return renderContent();
};

export default Index;
