"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getRegistrationsByDateRange } from "@/apiServices/dashboard/api.dashboardServices";
import { useState } from "react";
import { Calendar, Filter, X } from "lucide-react";

export function DateRangeRegistrationChart() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(
    thirtyDaysAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [appliedRange, setAppliedRange] = useState<{
    start: string;
    end: string;
  }>({
    start: thirtyDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["date-range-registrations", appliedRange.start, appliedRange.end],
    queryFn: () => getRegistrationsByDateRange(appliedRange.start, appliedRange.end),
    staleTime: 5 * 60 * 1000,
    enabled: !!appliedRange.start && !!appliedRange.end,
  });

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      setAppliedRange({ start: startDate, end: endDate });
      setIsFilterOpen(false);
    }
  };

  const handleResetFilter = () => {
    const newStart = thirtyDaysAgo.toISOString().split("T")[0];
    const newEnd = today.toISOString().split("T")[0];
    setStartDate(newStart);
    setEndDate(newEnd);
    setAppliedRange({ start: newStart, end: newEnd });
  };

  const chartData = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Calendar className="h-4 w-4" />
          Registrations by Date Range
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1 px-2 text-xs">
            <span className="text-muted-foreground">From</span>
            <span className="font-medium">{appliedRange.start}</span>
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">{appliedRange.end}</span>
            <button onClick={handleResetFilter} className="ml-1 text-red-500 hover:text-red-600 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </Badge>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Date Range</h4>
                  <p className="text-xs text-muted-foreground">
                    Select date range for registration data.
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="rangeStartDate" className="text-xs">Start Date</Label>
                    <Input
                      id="rangeStartDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rangeEndDate" className="text-xs">End Date</Label>
                    <Input
                      id="rangeEndDate"
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
                    size="sm"
                    className="flex-1"
                  >
                    Apply
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetFilter}>
                    Reset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {total > 0 && (
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{total}</span> registrations
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="oklch(0.6 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value.length === 10) {
                    return value.substring(5);
                  }
                  return value;
                }}
              />
              <YAxis
                stroke="oklch(0.6 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                formatter={(value: number) => [value, "Registrations"]}
              />
              <Bar
                dataKey="count"
                fill="oklch(0.6 0.2 280)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the selected date range
          </div>
        )}
      </CardContent>
    </Card>
  );
}