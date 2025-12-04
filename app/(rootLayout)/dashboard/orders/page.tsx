"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: string
  status: "completed" | "pending" | "cancelled" | "processing"
  date: string
}

async function fetchAllOrders(): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Premium Plan",
      amount: "$250.00",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Basic Plan",
      amount: "$150.00",
      status: "pending",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      product: "Enterprise Plan",
      amount: "$350.00",
      status: "processing",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      email: "alice@example.com",
      product: "Basic Plan",
      amount: "$75.00",
      status: "cancelled",
      date: "2024-01-12",
    },
    {
      id: "ORD-005",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      product: "Premium Plan",
      amount: "$500.00",
      status: "completed",
      date: "2024-01-11",
    },
    {
      id: "ORD-006",
      customer: "Diana Miller",
      email: "diana@example.com",
      product: "Basic Plan",
      amount: "$100.00",
      status: "completed",
      date: "2024-01-10",
    },
  ]
}

const statusStyles = {
  completed: "bg-emerald-500/10 text-emerald-500",
  pending: "bg-amber-500/10 text-amber-500",
  cancelled: "bg-red-500/10 text-red-500",
  processing: "bg-blue-500/10 text-blue-500",
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["all-orders"],
    queryFn: fetchAllOrders,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage all customer orders.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
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
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="font-medium">{order.amount}</TableCell>
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
    </div>
  )
}
