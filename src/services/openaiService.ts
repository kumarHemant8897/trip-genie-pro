
export interface TripFormData {
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

const unsplashBaseUrl = "https://images.unsplash.com/";

export const generateItinerary = async (tripData: TripFormData) => {
  // For now, return mock data since we need OpenAI API key
  // This will be replaced with actual OpenAI API call
  
  const mockItinerary = {
    tripTitle: tripData.title,
    destination: tripData.destination,
    duration: "5 days", // This should ideally be calculated from startDate and endDate
    totalBudget: parseInt(tripData.budget) || 2000,
    days: [
      {
        day: 1,
        date: tripData.startDate ? tripData.startDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Day 1',
        weather: {
          condition: "Sunny",
          temperature: "75°F",
          icon: "☀️"
        },
        morning: [
          {
            time: "9:00 AM",
            activity: "Visit Main Square",
            location: "City Center",
            description: "Start your day exploring the historic main square with its beautiful architecture, fountains, and local cafes. A great spot for people-watching.",
            estimatedCost: 0,
            duration: "2 hours",
            imageUrl: `${unsplashBaseUrl}photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop` // white concrete building
          },
          {
            time: "11:00 AM",
            activity: "Local Coffee Culture",
            location: "Café Central",
            description: "Experience authentic local coffee culture at this renowned historic café, known for its pastries and vibrant atmosphere.",
            estimatedCost: 15,
            duration: "1 hour",
            imageUrl: `${unsplashBaseUrl}photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop` // bird's eye view of green mountains (using as a generic scenic cafe view)
          }
        ],
        afternoon: [
          {
            time: "1:00 PM",
            activity: "Traditional Lunch",
            location: "Local Restaurant 'El Sabor'",
            description: "Enjoy authentic local cuisine at a highly-rated traditional restaurant. Try the [Local Dish Name]!",
            estimatedCost: 35,
            duration: "1.5 hours",
            // No image for lunch, will use placeholder
          },
          {
            time: "3:00 PM",
            activity: "Museum Visit",
            location: "National Museum of History",
            description: "Explore the rich history and culture of the region through impressive collections and interactive exhibits.",
            estimatedCost: 20,
            duration: "2 hours",
            imageUrl: `${unsplashBaseUrl}photo-1466442929976-97f336a657be?q=80&w=800&auto=format&fit=crop` // photography of mosque buildings (using as generic museum architecture)
          }
        ],
        evening: [
          {
            time: "7:00 PM",
            activity: "Sunset Walk on the Bridge",
            location: "Historic Bridge Overlook",
            description: "Take a leisurely walk across the iconic bridge and enjoy breathtaking sunset views over the city skyline and river.",
            estimatedCost: 0,
            duration: "1 hour",
            imageUrl: `${unsplashBaseUrl}photo-1433086966358-54859d0ed716?q=80&w=800&auto=format&fit=crop` // gray concrete bridge and waterfalls
          },
          {
            time: "8:30 PM",
            activity: "Dinner & Local Music",
            location: "Traditional Tavern 'La Guitarra'",
            description: "End your day with delicious food, local wine, and live traditional music in a cozy tavern.",
            estimatedCost: 50,
            duration: "2 hours",
            imageUrl: `${unsplashBaseUrl}photo-1492321936769-b49830bc1d1e?q=80&w=800&auto=format&fit=crop` // white building under stars (using as atmospheric evening spot)
          }
        ],
        totalCost: 120,
        tips: [
          "Wear comfortable walking shoes, you'll be doing a lot of exploring!",
          "Bring a light jacket or sweater for the evening as it can get cooler.",
          "Try the local specialty dish, [Local Dish Name], at lunch – it's a must!",
          "Public transport is reliable, consider a day pass if you plan multiple journeys."
        ]
      },
      // You can add more days here with similar structure, including imageUrls
      {
        day: 2,
        date: tripData.startDate ? new Date(tripData.startDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Day 2',
        weather: { condition: "Partly Cloudy", temperature: "72°F", icon: "⛅" },
        morning: [
          {
            time: "10:00 AM",
            activity: "Mountain Hike",
            location: "Serpent Peak Trail",
            description: "Embark on a scenic hike offering panoramic views of the valley and surrounding nature.",
            estimatedCost: 5, // Park entrance or transport
            duration: "3 hours",
            imageUrl: `${unsplashBaseUrl}photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop` // landscape photography of mountain
          }
        ],
        afternoon: [
           {
            time: "2:00 PM",
            activity: "Relax by the Lake",
            location: "Azure Lake Park",
            description: "Unwind by the serene lake, perhaps rent a paddleboat or enjoy a picnic.",
            estimatedCost: 10,
            duration: "2.5 hours",
            imageUrl: `${unsplashBaseUrl}photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop` // body of water surrounded by trees
          }
        ],
        evening: [
          {
            time: "7:00 PM",
            activity: "Stargazing Tour",
            location: "Observatory Hill",
            description: "Join a guided tour for an amazing stargazing experience, away from city lights.",
            estimatedCost: 25,
            duration: "2 hours",
            imageUrl: `${unsplashBaseUrl}photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop` // foggy mountain summit (as a dark sky location)
          }
        ],
        totalCost: 40,
        tips: ["Bring water and snacks for the hike.", "Book stargazing tour in advance."]
      }
    ],
    generalTips: [
      "Learn a few basic phrases in the local language like 'Hello', 'Thank you'.",
      "Always carry a copy of your ID/passport and emergency contact information.",
      "Stay hydrated, especially during warmer days and physical activities.",
      "Respect local customs and dress codes, particularly when visiting religious sites."
    ],
    culturalNotes: [
      "Tipping is generally appreciated (around 10-15%) at restaurants for good service.",
      "Many smaller shops may close for a few hours in the mid-afternoon (siesta).",
      "Public transportation is efficient and generally affordable; a good way to get around.",
      "Look out for local festivals or events during your stay – they offer unique cultural insights."
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500)); // Reduced delay slightly
  
  return mockItinerary;
};

