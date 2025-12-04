import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here is your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value="$45,231.89" change="+20.1%" changeType="positive" icon={DollarSign} />
        <StatsCard title="Total Users" value="2,350" change="+180" changeType="positive" icon={Users} />
        <StatsCard title="Total Orders" value="1,234" change="+12.5%" changeType="positive" icon={ShoppingCart} />
        <StatsCard title="Conversion Rate" value="3.2%" change="-0.4%" changeType="negative" icon={TrendingUp} />
      </div>

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
