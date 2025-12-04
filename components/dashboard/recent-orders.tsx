"use client"

import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Order {
  id: string
  customer: string
  email: string
  amount: string
  status: "completed" | "pending" | "cancelled"
  date: string
}

async function fetchOrders(): Promise<Order[]> {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      amount: "$250.00",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      amount: "$150.00",
      status: "pending",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      amount: "$350.00",
      status: "completed",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      email: "alice@example.com",
      amount: "$75.00",
      status: "cancelled",
      date: "2024-01-12",
    },
    {
      id: "ORD-005",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      amount: "$500.00",
      status: "completed",
      date: "2024-01-11",
    },
  ]
}

const statusStyles = {
  completed: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
}

export function RecentOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: fetchOrders,
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              : orders?.map((order) => (
                  <TableRow key={order.id} className="border-border">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusStyles[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
