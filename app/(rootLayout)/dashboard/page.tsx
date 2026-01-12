"use client";
import { useState } from "react";
import { Users, MessageSquare, CreditCard, Clock, UserCheck, Filter, X } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { MonthlyRegistrationChart } from "@/components/dashboard/monthly-registration-chart";
import { YearlyRegistrationChart } from "@/components/dashboard/yearly-registration-chart";
import { DateRangeRegistrationChart } from "@/components/dashboard/date-range-registration-chart";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/apiServices/dashboard/api.dashboardServices";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/types/dashboardTypes/dashboardTypes";

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({});
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats", dateFilter],
    queryFn: () => getDashboardStats(dateFilter),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const stats = statsData?.data;

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      setDateFilter({ startDate, endDate });
      setIsFilterOpen(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setDateFilter({});
  };

  const hasActiveFilter = dateFilter.startDate && dateFilter.endDate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here is your overview.</p>
        </div>

        {/* Date Range Filter Popover */}
        <div className="flex items-center gap-2">
          {hasActiveFilter && (
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-2.5">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{dateFilter.startDate}</span>
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{dateFilter.endDate}</span>
              <button onClick={handleClearFilter} className="ml-1 text-red-500 hover:text-red-600 cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          )}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {hasActiveFilter && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Statistics</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a date range to filter dashboard statistics.
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="statsStartDate">Start Date</Label>
                    <Input
                      id="statsStartDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statsEndDate">End Date</Label>
                    <Input
                      id="statsEndDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilter}
                    disabled={!startDate || !endDate}
                    className="flex-1"
                  >
                    Apply
                  </Button>
                  {hasActiveFilter && (
                    <Button variant="outline" onClick={handleClearFilter}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyRegistrationChart />
        <YearlyRegistrationChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DateRangeRegistrationChart />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}