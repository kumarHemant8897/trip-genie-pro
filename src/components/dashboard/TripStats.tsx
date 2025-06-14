
import React from 'react';
import { PlaceholderChart } from '@/components/PlaceholderChart';

export const TripStats = () => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaceholderChart title="Itinerary Progress" type="line" />
        <PlaceholderChart title="Bookings Overview" type="bar" />
        <PlaceholderChart title="Savings & Budget" type="pie" />
      </div>
    </div>
  );
};
