"use client";
import { Users, MessageSquare, CreditCard, Clock, UserCheck } from "lucide-react"
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
          {Array.from({ length: 5 }).map((_, i) => (
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
            change={`${stats.users.active} active, ${stats.users.inactive} inactive`}
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Users by Role"
            value={stats.users.byRole.admin.toString()}
            change={`${stats.users.byRole.manager} managers, ${stats.users.byRole.user} users`}
            changeType="positive"
            icon={UserCheck}
          />
          <StatsCard
            title="Total Queries"
            value={stats.queries.total.toString()}
            change={`${stats.queries.pending} pending, ${stats.queries.resolved} resolved`}
            changeType={stats.queries.pending > 0 ? "negative" : "positive"}
            icon={MessageSquare}
          />
          <StatsCard
            title="Paid Accounts"
            value={stats.paidAccounts.total.toString()}
            change="Total paid accounts"
            changeType="positive"
            icon={CreditCard}
          />
          <StatsCard
            title="Trial Accounts"
            value={stats.trialAccounts.total.toString()}
            change={`${stats.trialAccounts.active} active, ${stats.trialAccounts.expired} expired`}
            changeType={stats.trialAccounts.expired > 0 ? "negative" : "positive"}
            icon={Clock}
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
