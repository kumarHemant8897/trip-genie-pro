
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { Compass } from 'lucide-react';

const ExplorePage = () => {
  const { user, signOut, loading } = useAuth();

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

  // It's good practice to ensure user and signOut are available,
  // though PageHeader and AppSidebar also have their own checks or might need them passed.
  if (!user || !signOut) {
    // This case should ideally be handled by a redirect in a router guard
    // or by App.tsx ensuring only authenticated users reach this page.
    // For now, rendering null or a message.
    return <div className="min-h-screen flex items-center justify-center"><p>Please log in to explore.</p></div>;
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar onSignOut={signOut} userEmail={user.email} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <PageHeader />
          <div className="p-6 sm:p-8 flex-grow">
            <div className="max-w-4xl mx-auto text-center py-12">
              <Compass className="w-24 h-24 text-sky-blue-DEFAULT mx-auto mb-6 opacity-70" />
              <h1 className="text-4xl font-bold text-primary mb-4">Explore Exciting Destinations</h1>
              <p className="text-lg text-gray-600 mb-8">
                Recommendations and suggestions for places to visit will appear here soon.
              </p>
              <p className="text-gray-500">
                Our travel AI is gearing up to find the perfect spots for your next adventure!
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ExplorePage;
