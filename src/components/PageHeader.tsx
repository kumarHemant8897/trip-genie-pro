
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { NotificationBell } from '@/components/NotificationBell';
import { useAuth } from '@/hooks/useAuth'; // Assuming user and signOut come from useAuth

interface PageHeaderProps {
  // Props can be added here if needed in the future, e.g. custom title
}

export const PageHeader = (props: PageHeaderProps) => {
  const { user, signOut } = useAuth(); // Get user and signOut from auth context
  const { toggleSidebar } = useSidebar();

  if (!user) return null; // Don't render header if no user

  return (
    <div className="bg-white border-b px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden hover:bg-sky-blue-DEFAULT/10">
            <Menu className="w-6 h-6 text-gray-600" />
          </Button>
          <SidebarTrigger className="hidden md:flex hover:bg-sky-blue-DEFAULT/10" />
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 bg-sky-blue-DEFAULT rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✈️</span>
            </div>
            <span className="text-xl font-semibold text-primary hidden sm:inline">Smart Travel Planner</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationBell />
          <UserProfileDropdown userEmail={user.email} onSignOut={signOut} />
        </div>
      </div>
    </div>
  );
};
