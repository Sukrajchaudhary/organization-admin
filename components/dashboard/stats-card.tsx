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
  const isPositive = changeType === "positive";

  return (
    <div className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold ">
            {title}
          </p>
          <p className="mt-2 text-xl font-semibold">{value}</p>
          <p className={cn(
            "mt-1 text-xs truncate",
            isPositive ? "text-emerald-600" : "text-rose-600"
          )}>
            {change}
          </p>
        </div>

        <div className={cn(
          "shrink-0 size-10 rounded-lg flex items-center justify-center",
          isPositive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        )}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}
