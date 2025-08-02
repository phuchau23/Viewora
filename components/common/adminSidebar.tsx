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
  Calendar,
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
import { useTranslation } from "react-i18next";

// Admin navigation items (sẽ dịch bằng key i18n)
const adminNavItems = [
  { titleKey: "dashboard", url: "/admin/dashboard", icon: Home },
  { titleKey: "userManager", url: "/admin/users", icon: Users },
  { titleKey: "tickets", url: "/admin/tickets", icon: Ticket },
  { titleKey: "employees", url: "/admin/employees", icon: ContactRound },
  { titleKey: "roles", url: "/admin/role", icon: User },
  { titleKey: "promotion", url: "/admin/promotion", icon: TicketPercent },
  { titleKey: "snack", url: "/admin/snack", icon: Popcorn },
  { titleKey: "movies", url: "/admin/movies", icon: Film },
  { titleKey: "rooms", url: "/admin/rooms", icon: Home },
  { titleKey: "showtime", url: "/admin/showtime", icon: Calendar },
  { titleKey: "bookings", url: "/admin/bookings", icon: Ticket },
  { titleKey: "settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
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
                  <span className="font-semibold">{t("panelTitle")}</span>
                  <span className="text-xs">{t("panelSubtitle")}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("groupLabel")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{t(`menu.${item.titleKey}`)}</span>
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
        {t("signOut")}
      </Button>
    </Sidebar>
  );
}
