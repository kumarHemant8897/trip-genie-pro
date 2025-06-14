
export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  traveler_type: string;
  activity_level: string;
  interests: string[];
  generated_itinerary: any;
  created_at: string;
  is_public: boolean;
}
