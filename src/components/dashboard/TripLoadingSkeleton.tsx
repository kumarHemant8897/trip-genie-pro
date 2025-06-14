
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TripLoadingSkeletonProps {
  count?: number;
}

export const TripLoadingSkeleton = ({ count = 3 }: TripLoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse rounded-2xl shadow-soft-light">
          <CardHeader className="p-5">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
