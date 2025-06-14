
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, LineChart, PieChart } from 'lucide-react'; // Using Lucide icons as placeholders

interface PlaceholderChartProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  className?: string;
}

const ChartIcon = ({ type }: { type: 'line' | 'bar' | 'pie' }) => {
  if (type === 'line') return <LineChart className="w-12 h-12 text-sky-blue-DEFAULT opacity-50" />;
  if (type === 'bar') return <BarChart2 className="w-12 h-12 text-coral-DEFAULT opacity-50" />;
  if (type === 'pie') return <PieChart className="w-12 h-12 text-yellow-500 opacity-50" />; // Example color
  return null;
};

export const PlaceholderChart = ({ title, type, className }: PlaceholderChartProps) => {
  return (
    <Card className={`shadow-soft-light hover:shadow-soft-medium transition-shadow duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-48">
        <div className="text-center text-gray-400">
          <ChartIcon type={type} />
          <p className="mt-2 text-sm">({type} chart placeholder)</p>
        </div>
      </CardContent>
    </Card>
  );
};

