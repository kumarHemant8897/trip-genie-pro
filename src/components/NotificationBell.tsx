
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NotificationBell = () => {
  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your trip to Paris is confirmed!", time: "2 hours ago" },
    { id: 2, message: "New itinerary suggestion for Bali.", time: "1 day ago" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 hover:bg-sky-blue-DEFAULT/10">
          <Bell className="h-5 w-5 text-gray-600 group-hover:text-sky-blue-DEFAULT" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-DEFAULT opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral-DEFAULT"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3 hover:bg-slate-50 cursor-pointer">
              <p className="text-sm text-gray-800">{notif.message}</p>
              <p className="text-xs text-gray-500">{notif.time}</p>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="p-3 text-center text-gray-500">No new notifications</DropdownMenuItem>
        )}
         <DropdownMenuSeparator />
         <DropdownMenuItem className="text-center text-sky-blue-DEFAULT hover:!bg-sky-blue-DEFAULT/10 hover:!text-sky-blue-DEFAULT cursor-pointer">
            View all notifications
         </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

