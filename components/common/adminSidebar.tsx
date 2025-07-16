"use client";

import type * as React from "react";
import {
  Users,
  Ticket,
  BarChart3,
  Settings,
  Home,
  User,
  ContactRound,
  TicketPercent,
  Popcorn,
  Film,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "lucide-react";
// Admin navigation items
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "User Manager",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Tickets",
    url: "/admin/tickets",
    icon: Ticket,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: ContactRound,
  },
  {
    title: "Roles",
    url: "/admin/role",
    icon: User,
  },
  {
    title: "Promotion",
    url: "/admin/promotion",
    icon: TicketPercent,
  },
  {
    title: "Snack",
    url: "/admin/snack",
    icon: Popcorn,
  },
  {
    title: "Movies",
    url: "/admin/movies",
    icon: Film,
  },
  {
    title: "Rooms",
    url: "/admin/rooms",
    icon: Home,
  },
  {
    title: "Showtime",
    url: "/admin/showtime",
    icon: Calendar,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Ticket,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const handleLogout = () => {
    Cookies.remove("auth-token");
    setToken(null);
    router.push("/login");
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin Panel</span>
                  <span className="text-xs">Management Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <Button
        onClick={handleLogout}
        className="hidden md:flex"
        variant="outline"
      >
        <LogOut className="h-4 w-4 mr-1" />
        Sign Out
      </Button>
    </Sidebar>
  );
}
