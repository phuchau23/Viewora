"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationSection } from "@/app/(admin)/admin/components/booking-system";

interface BookingHeaderProps {
  activeSection: NavigationSection;
}

const sectionTitles = {
  tickets: "Ticket Management",
  bookings: "Booking Management",
  users: "User Management",
};

export function BookingHeader({ activeSection }: BookingHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-px bg-sidebar-border" />
        <h1 className="text-lg font-semibold">
          {sectionTitles[activeSection]}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] pl-8 sm:w-[300px]"
          />
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </header>
  );
}
