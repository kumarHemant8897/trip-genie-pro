
import React from 'react';

export const TripDashboardHeader = () => {
  return (
    <div
      className="mb-10 p-8 rounded-2xl bg-cover bg-center text-white shadow-xl"
      style={{ backgroundImage: "url('/lovable-uploads/f20f19f3-a769-4bb8-b1dd-951bdd277d6b.png')" }}
    >
      <div className="bg-black/40 p-6 rounded-xl backdrop-blur-sm">
        <h1 className="text-4xl md:text-5xl font-bold">My Trips</h1>
        <p className="text-lg md:text-xl mt-2 opacity-90">Your adventures, beautifully organized and ready to explore.</p>
      </div>
    </div>
  );
};

