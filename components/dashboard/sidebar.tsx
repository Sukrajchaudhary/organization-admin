"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  ImagePlus,
  StickyNote,
  MessageSquare,
  MapPin,
  FolderTree,
  CreditCard,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LucideIcon } from "lucide-react";

interface NavChild {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Media", href: "/dashboard/media", icon: ImagePlus },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  {
    name: "Catalogs",
    icon: Layers,
    children: [
      { name: "Blogs", href: "/dashboard/blog", icon: StickyNote },
      { name: "Categories", href: "/dashboard/category", icon: FolderTree },
      { name: "Plans", href: "/dashboard/plans", icon: CreditCard },
      { name: "Queries", href: "/dashboard/queries", icon: MessageSquare },
    ],
  },
  { name: "Trip", href: "/dashboard/trip", icon: MapPin },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Catalogs"]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isChildActive = (children: NavChild[]) => {
    return children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-base font-bold text-sidebar-foreground">
            Danfe Home Service
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

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          // Regular nav item (no children)
          if (!item.children && item.href) {
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
          }

          // Nested nav item (has children)
          if (item.children) {
            const isExpanded = expandedMenus.includes(item.name);
            const hasActiveChild = isChildActive(item.children);

            return (
              <div key={item.name}>
                <button
                  onClick={() => !collapsed && toggleMenu(item.name)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors cursor-pointer",
                    hasActiveChild
                      ? "bg-primary-green/10 text-primary-green"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Children */}
                {!collapsed && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => {
                      const isChildItemActive = pathname === child.href || pathname.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                            isChildItemActive
                              ? "bg-primary-green text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <child.icon className="h-4 w-4 shrink-0" />
                          <span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex w-full cursor-pointer font-semibold items-center gap-3 px-3 py-2.5 rounded-sm text-base text-sidebar-foreground transition-colors"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}