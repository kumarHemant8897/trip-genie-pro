
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  // SidebarTrigger, // SidebarTrigger is typically used outside the sidebar itself
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Plane, Compass, Settings, Bell, UserCircle, LogOut } from 'lucide-react';

interface AppSidebarProps {
  onSignOut: () => void;
  userEmail?: string;
}

const menuItems = [
  { title: 'Dashboard', icon: Home, href: '/' },
  { title: 'My Trips', icon: Plane, href: '/my-trips' }, // Updated href to /my-trips
  { title: 'Explore', icon: Compass, href: '/explore' },
  { title: 'Notifications', icon: Bell, href: '#' }, // Placeholder
  { title: 'Settings', icon: Settings, href: '#' }, // Placeholder
];

export const AppSidebar = ({ onSignOut, userEmail }: AppSidebarProps) => {
  const location = useLocation(); // Get current location

  return (
    <Sidebar className="border-r border-gray-200 bg-white shadow-soft-light">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-sky-blue-DEFAULT" />
          <h2 className="text-xl font-semibold text-primary">Smart Travel</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-500 px-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-sky-blue-DEFAULT/10 hover:text-sky-blue-DEFAULT data-[active=true]:bg-sky-blue-DEFAULT/10 data-[active=true]:text-sky-blue-DEFAULT"
                    isActive={location.pathname === item.href} // Set active state
                  >
                    <Link to={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-700">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t mt-auto">
        {userEmail && (
           <div className="flex items-center gap-2 mb-3 p-2 rounded-md bg-slate-100">
             <UserCircle className="w-8 h-8 text-gray-500" />
             <div>
               <p className="text-sm font-medium text-gray-800">User</p>
               <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
             </div>
           </div>
        )}
        <Button variant="outline" onClick={onSignOut} className="w-full hover:bg-coral-DEFAULT/10 hover:text-coral-DEFAULT hover:border-coral-DEFAULT">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
