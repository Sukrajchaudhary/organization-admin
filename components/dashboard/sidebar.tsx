"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ImagePlus,
  StickyNote,
  MessageSquare,
  MapPin,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  // { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Media", href: "/dashboard/media", icon: ImagePlus },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Blogs", href: "/dashboard/blog", icon: StickyNote },
  { name: "Categories", href: "/dashboard/category", icon: FolderTree },
  { name: "Queries", href: "/dashboard/queries", icon: MessageSquare },
  { name: "Trip", href: "/dashboard/trip", icon: MapPin },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">
            Admin
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-green text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex w-full cursor-pointer  font-semibold items-center gap-3 px-3 py-2.5 rounded-sm text-base text-sidebar-foreground  transition-colors"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
