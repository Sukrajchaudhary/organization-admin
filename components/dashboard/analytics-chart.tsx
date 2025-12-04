"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

async function fetchAnalytics() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return [
    { name: "Jan", revenue: 4000, orders: 240 },
    { name: "Feb", revenue: 3000, orders: 198 },
    { name: "Mar", revenue: 5000, orders: 300 },
    { name: "Apr", revenue: 4500, orders: 278 },
    { name: "May", revenue: 6000, orders: 389 },
    { name: "Jun", revenue: 5500, orders: 349 },
    { name: "Jul", revenue: 7000, orders: 430 },
  ]
}

export function AnalyticsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="oklch(0.6 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.6 0.2 250)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
