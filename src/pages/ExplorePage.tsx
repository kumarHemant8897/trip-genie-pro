import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, DollarSign, Mountain, Waves, Compass, TreePine } from 'lucide-react'; // Updated imports: Added Compass, replaced Forest with TreePine

// Define the structure for a recommendation
interface ExploreRecommendation {
  id: string;
  name: string;
  locationSnippet: string; // Short location hint
  description: string;
  image: string;
  imageUrl?: string; // For Unsplash direct links
  budget: string;
  tags: string[];
  icon?: React.ElementType; // Icon for the card
}

// Sample recommendations data
const recommendations: ExploreRecommendation[] = [
  {
    id: '1',
    name: 'Alpine Hiking Adventure',
    locationSnippet: 'Swiss Alps',
    description: 'Explore breathtaking trails, pristine lakes, and charming mountain villages. Perfect for active travelers.',
    image: 'photo-1458668383970-8ddd3927deed', // landscape photo of mountain alps
    budget: 'Approx. $2000 - $3500',
    tags: ['Adventure', 'Mountains', 'Hiking'],
    icon: Mountain,
  },
  {
    id: '2',
    name: 'Tropical Beach Getaway',
    locationSnippet: 'Maldives',
    description: 'Relax on white sandy beaches, snorkel in crystal-clear waters, and enjoy luxurious overwater bungalows.',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&w=800&h=600&fit=crop', // ocean wave at beach
    image: 'photo-1500375592092-40eb2168fd21',
    budget: 'Approx. $3000 - $5000',
    tags: ['Relaxation', 'Beach', 'Luxury'],
    icon: Waves,
  },
  {
    id: '3',
    name: 'Ancient Ruins Exploration',
    locationSnippet: 'Machu Picchu, Peru',
    description: 'Discover the mysteries of the Incas at this iconic mountaintop citadel. A journey through history.',
    image: 'photo-1469474968028-56623f02e42e', // landscape photography of mountain hit by sun rays
    budget: 'Approx. $1500 - $2500',
    tags: ['Culture', 'History', 'Adventure'],
    icon: Compass, // Correctly using imported Compass
  },
  {
    id: '4',
    name: 'Serene Forest Retreat',
    locationSnippet: 'Redwood National Park, USA',
    description: 'Immerse yourself in the tranquility of ancient redwood forests. Ideal for nature lovers and peaceful escapes.',
    image: 'photo-1509316975850-ff9c5deb0cd9', // photo of pine trees
    budget: 'Approx. $1000 - $1800',
    tags: ['Nature', 'Forest', 'Relaxation'],
    icon: TreePine, // Replaced Forest with TreePine
  },
  {
    id: '5',
    name: 'Waterfall Wonders',
    locationSnippet: 'Iguazu Falls, Brazil/Argentina',
    description: 'Witness the awe-inspiring power and beauty of one of the world\'s largest waterfall systems.',
    image: 'photo-1433086966358-54859d0ed716', // gray concrete bridge and waterfalls
    budget: 'Approx. $1800 - $3000',
    tags: ['Nature', 'Adventure', 'Sightseeing'],
    icon: Waves, 
  },
   {
    id: '6',
    name: 'Wildlife Safari',
    locationSnippet: 'Serengeti, Tanzania',
    description: 'Experience the thrill of a lifetime observing majestic animals in their natural habitat.',
    image: 'photo-1472396961693-142e6e269027', // two brown deer beside trees and mountain
    budget: 'Approx. $4000 - $7000',
    tags: ['Adventure', 'Wildlife', 'Nature'],
    icon: Compass, // Correctly using imported Compass
  }
];

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

  if (!user || !signOut) {
    return <div className="min-h-screen flex items-center justify-center"><p>Please log in to explore.</p></div>;
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar onSignOut={signOut} userEmail={user.email} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <PageHeader />
          <div className="p-6 sm:p-8 flex-grow">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 text-center">
                <MapPin className="w-16 h-16 text-sky-blue-DEFAULT mx-auto mb-4 opacity-90" />
                <h1 className="text-4xl font-bold text-primary mb-2">Discover Your Next Adventure</h1>
                <p className="text-lg text-gray-600">
                  Handpicked destinations and experiences to inspire your travels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => {
                  const CardIcon = rec.icon || MapPin;
                  const imageUrl = rec.imageUrl || `https://images.unsplash.com/${rec.image}?ixlib=rb-4.0.3&w=800&h=600&fit=crop&q=80`;
                  return (
                    <Card key={rec.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <CardHeader className="p-0">
                        <img 
                          src={imageUrl}
                          alt={rec.name} 
                          className="w-full h-56 object-cover" 
                        />
                      </CardHeader>
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-center mb-2">
                          <CardIcon className="w-6 h-6 text-sky-blue-DEFAULT mr-2" />
                          <CardTitle className="text-2xl font-semibold text-primary">{rec.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-500 mb-1 italic">{rec.locationSnippet}</CardDescription>
                        <p className="text-gray-700 text-base mb-4">
                          {rec.description}
                        </p>
                        <div className="flex items-center text-gray-600 mb-3">
                          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                          <span className="font-medium">{rec.budget}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <div className="flex flex-wrap gap-2">
                          {rec.tags.map(tag => (
                            <span key={tag} className="bg-sky-blue-DEFAULT/10 text-sky-blue-DEFAULT px-3 py-1 text-xs font-semibold rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ExplorePage;
