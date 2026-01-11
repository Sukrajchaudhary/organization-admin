import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
}

export function StatsCard({ title, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <Card className="bg-card gap-0  border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-muted-foreground">{title}</CardTitle>
        <span className="bg-[#DEE4E6] flex justify-center items-center rounded-full p-2">        <Icon className="h-6 w-6 text-[#000000]" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        <p className={cn("text-xs mt-1", changeType === "positive" ? "text-emerald-500" : "text-red-500")}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
