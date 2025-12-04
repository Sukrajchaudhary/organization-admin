"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

async function fetchDetailedAnalytics() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    revenue: [
      { name: "Jan", value: 4000 },
      { name: "Feb", value: 3000 },
      { name: "Mar", value: 5000 },
      { name: "Apr", value: 4500 },
      { name: "May", value: 6000 },
      { name: "Jun", value: 5500 },
      { name: "Jul", value: 7000 },
    ],
    users: [
      { name: "Jan", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 500 },
      { name: "Apr", value: 450 },
      { name: "May", value: 600 },
      { name: "Jun", value: 550 },
      { name: "Jul", value: 700 },
    ],
    sources: [
      { name: "Direct", value: 400 },
      { name: "Organic", value: 300 },
      { name: "Referral", value: 200 },
      { name: "Social", value: 100 },
    ],
  }
}

const COLORS = ["oklch(0.6 0.2 250)", "oklch(0.65 0.18 160)", "oklch(0.75 0.15 60)", "oklch(0.65 0.2 25)"]

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["detailed-analytics"],
    queryFn: fetchDetailedAnalytics,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed insights about your business performance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.revenue}>
                  <defs>
                    <linearGradient id="colorRevenueAnalytics" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="value"
                    stroke="oklch(0.6 0.2 250)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenueAnalytics)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.users}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.6 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.6 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Bar dataKey="value" fill="oklch(0.65 0.18 160)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.sources}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data?.sources.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0 0)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {data?.sources.map((source, index) => (
                    <div key={source.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">{source.name}</span>
                      <span className="text-sm text-muted-foreground">{source.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
