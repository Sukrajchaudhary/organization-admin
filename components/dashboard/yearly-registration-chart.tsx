"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getYearlyRegistrations } from "@/apiServices/dashboard/api.dashboardServices";

const COLORS = [
  "oklch(0.6 0.2 0)",
  "oklch(0.6 0.2 60)",
  "oklch(0.6 0.2 120)",
  "oklch(0.6 0.2 180)",
  "oklch(0.6 0.2 240)",
  "oklch(0.6 0.2 300)",
];

export function YearlyRegistrationChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["yearly-registrations"],
    queryFn: () => getYearlyRegistrations(),
    staleTime: 5 * 60 * 1000,
  });

  const chartData = data?.data?.registrations || [];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Yearly User Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                stroke="oklch(0.6 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
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
                labelFormatter={(label) => `Year ${label}`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}