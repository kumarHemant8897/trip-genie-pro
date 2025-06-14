
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

export const generateItinerary = async (tripData: TripFormData) => {
  // For now, return mock data since we need OpenAI API key
  // This will be replaced with actual OpenAI API call
  
  const mockItinerary = {
    tripTitle: tripData.title,
    destination: tripData.destination,
    duration: "5 days",
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
            description: "Start your day exploring the historic main square with its beautiful architecture and local cafes.",
            estimatedCost: 0,
            duration: "2 hours"
          },
          {
            time: "11:00 AM",
            activity: "Local Coffee Culture",
            location: "Café Central",
            description: "Experience authentic local coffee culture at this renowned historic café.",
            estimatedCost: 15,
            duration: "1 hour"
          }
        ],
        afternoon: [
          {
            time: "1:00 PM",
            activity: "Traditional Lunch",
            location: "Local Restaurant",
            description: "Enjoy authentic local cuisine at a highly-rated traditional restaurant.",
            estimatedCost: 35,
            duration: "1.5 hours"
          },
          {
            time: "3:00 PM",
            activity: "Museum Visit",
            location: "National Museum",
            description: "Explore the rich history and culture through impressive collections.",
            estimatedCost: 20,
            duration: "2 hours"
          }
        ],
        evening: [
          {
            time: "7:00 PM",
            activity: "Sunset Walk",
            location: "Riverfront Promenade",
            description: "Take a leisurely walk along the river and enjoy the sunset views.",
            estimatedCost: 0,
            duration: "1 hour"
          },
          {
            time: "8:30 PM",
            activity: "Dinner & Local Music",
            location: "Traditional Tavern",
            description: "End your day with delicious food and live local music.",
            estimatedCost: 50,
            duration: "2 hours"
          }
        ],
        totalCost: 120,
        tips: [
          "Wear comfortable walking shoes",
          "Bring a light jacket for the evening",
          "Try the local specialty dish at lunch"
        ]
      }
    ],
    generalTips: [
      "Learn a few basic phrases in the local language",
      "Always carry a copy of important documents",
      "Stay hydrated and take breaks when needed",
      "Respect local customs and dress codes"
    ],
    culturalNotes: [
      "Tipping is generally 10-15% at restaurants",
      "Many shops close during afternoon siesta hours",
      "Public transportation is efficient and affordable",
      "Local festivals and events are worth experiencing"
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return mockItinerary;
};
