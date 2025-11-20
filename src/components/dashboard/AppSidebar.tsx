import { useState } from "react";
import { 
  Activity, 
  FileText, 
  Settings, 
  LogOut, 
  Snowflake,
  Shield,
  AlertTriangle,
  Zap,
  Radio
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCustomAuth } from "@/hooks/useCustomAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Activity },
  { title: "Devices", url: "/devices", icon: Radio },
  { title: "Data Log", url: "/data-log", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useCustomAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-4 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-20" : "w-64"} collapsible="icon">
      <SidebarHeader className={isCollapsed ? "p-2" : "p-4"} style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}>
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative p-3 bg-gradient-to-br from-primary to-secondary rounded-xl flex-shrink-0 shadow-lg">
            <Snowflake className="h-6 w-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sidebar-foreground text-lg truncate bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Cold Chain Pro
              </h2>
              <p className="text-xs text-sidebar-foreground/60 truncate flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Advanced Monitor
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={`px-2 py-1 text-sidebar-foreground/70 font-medium ${isCollapsed ? "sr-only" : ""}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="mb-1">
                     <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        ${getNavCls({ isActive })} 
                        ${isCollapsed ? "justify-center px-0" : ""}
                        flex items-center w-full rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 group
                      `}
                    >
                      <div className={`p-1 rounded-md ${isCollapsed ? "" : "mr-3"} group-hover:bg-sidebar-accent/20 transition-colors`}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      </div>
                      {!isCollapsed && <span className="truncate font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-2">
          <Button 
            variant="outline" 
            size={isCollapsed ? "icon" : "default"}
            onClick={handleLogout}
            className={`
              border-sidebar-border text-sidebar-foreground hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 hover:border-red-500/30 transition-all duration-200 group
              ${isCollapsed ? "w-12 h-12 p-0" : "w-full"}
            `}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"} group-hover:text-red-500 transition-colors`} />
            {!isCollapsed && <span className="group-hover:text-red-500 transition-colors font-medium">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}