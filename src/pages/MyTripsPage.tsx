
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PageHeader } from '@/components/PageHeader';
import TripDashboard from '@/components/TripDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Trip } from '@/types/trip';

const MyTripsPage = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

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

  if (!user || !signOut) {
    // Redirect to login or show login prompt if not authenticated
    // For now, just showing a message. Ideally, this would redirect to a login page.
    return <div className="min-h-screen flex items-center justify-center"><p>Please log in to view your trips.</p></div>;
  }

  const handleCreateNewTrip = () => {
    // Navigate to the main dashboard or a dedicated trip creation page
    navigate('/'); // For now, navigate to the main dashboard
  };

  const handleViewTrip = (trip: Trip) => {
    // Navigate to a trip detail page or handle in modal
    console.log('View trip:', trip);
    // Potentially navigate to Index page with state to show trip detail
    navigate('/', { state: { viewTripId: trip.id } });
  };

  const handleEditTrip = (trip: Trip) => {
    // Navigate to a trip edit page or handle in modal
    console.log('Edit trip:', trip);
    // Potentially navigate to Index page with state to show trip form for editing
    navigate('/', { state: { editTripId: trip.id } });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar onSignOut={signOut} userEmail={user.email} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <PageHeader />
          <TripDashboard
            onCreateNew={handleCreateNewTrip}
            onViewTrip={handleViewTrip}
            onEditTrip={handleEditTrip}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MyTripsPage;
