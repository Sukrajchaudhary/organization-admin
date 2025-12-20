"use client";

import { Users, FileText, MessageSquare, FolderOpen, Bell, MessagesSquare, Star, Image } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"
import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/apiServices/dashboard/api.dashboardServices"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    refetchOnMount: false,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });

  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here is your overview.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.users.total.toString()}
            change={`${stats.users.active} active`}
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Total Queries"
            value={stats.queries.total.toString()}
            change={`${stats.queries.pending} pending`}
            changeType={stats.queries.pending > 0 ? "negative" : "positive"}
            icon={MessageSquare}
          />
          <StatsCard
            title="Total Blogs"
            value={stats.blogs.total.toString()}
            change={`${stats.blogs.published} published`}
            changeType="positive"
            icon={FileText}
          />
          <StatsCard
            title="Categories"
            value={stats.categories.total.toString()}
            change={`${stats.categories.active} active`}
            changeType="positive"
            icon={FolderOpen}
          />
          <StatsCard
            title="Comments"
            value={stats.comments.total.toString()}
            change="Total comments"
            changeType="positive"
            icon={MessagesSquare}
          />
          <StatsCard
            title="Testimonials"
            value={stats.testimonials.total.toString()}
            change="Total testimonials"
            changeType="positive"
            icon={Star}
          />
          <StatsCard
            title="Banners"
            value={stats.banners.total.toString()}
            change="Active banners"
            changeType="positive"
            icon={Image}
          />
          <StatsCard
            title="Notifications"
            value={stats.notifications.total.toString()}
            change={`${stats.notifications.unread} unread`}
            changeType={stats.notifications.unread > 0 ? "negative" : "positive"}
            icon={Bell}
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <AnalyticsChart />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}
