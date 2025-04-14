import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IOrder } from "@/models/Order"
import dayjs from 'dayjs';
import { useRouter } from "next/navigation"

// interface Order {
//   id: string
//   customer: {
//     name: string
//     avatar?: string
//   }
//   amount: number
//   items: number
//   status: "paid" | "pending" | "cancelled"
//   date: string
//   time: string
// }

// const orders: Record<string, Order[]> = {
//   all: [
//     {
//       id: "ORD-001",
//       customer: {
//         name: "Alex Johnson",
//         avatar: "/placeholder.svg?height=32&width=32&text=AJ",
//       },
//       amount: 32.5,
//       items: 3,
//       status: "paid",
//       date: "2023-06-15",
//       time: "14:30",
//     },
//     {
//       id: "ORD-002",
//       customer: {
//         name: "Maria Garcia",
//         avatar: "/placeholder.svg?height=32&width=32&text=MG",
//       },
//       amount: 18.99,
//       items: 2,
//       status: "pending",
//       date: "2023-06-15",
//       time: "15:45",
//     },
//     {
//       id: "ORD-003",
//       customer: {
//         name: "James Wilson",
//         avatar: "/placeholder.svg?height=32&width=32&text=JW",
//       },
//       amount: 24.75,
//       items: 1,
//       status: "paid",
//       date: "2023-06-15",
//       time: "16:20",
//     },
//     {
//       id: "ORD-004",
//       customer: {
//         name: "Emily Chen",
//         avatar: "/placeholder.svg?height=32&width=32&text=EC",
//       },
//       amount: 8.5,
//       items: 1,
//       status: "cancelled",
//       date: "2023-06-15",
//       time: "17:05",
//     },
//   ],
//   paid: [
//     {
//       id: "ORD-001",
//       customer: {
//         name: "Alex Johnson",
//         avatar: "/placeholder.svg?height=32&width=32&text=AJ",
//       },
//       amount: 32.5,
//       items: 3,
//       status: "paid",
//       date: "2023-06-15",
//       time: "14:30",
//     },
//     {
//       id: "ORD-003",
//       customer: {
//         name: "James Wilson",
//         avatar: "/placeholder.svg?height=32&width=32&text=JW",
//       },
//       amount: 24.75,
//       items: 1,
//       status: "paid",
//       date: "2023-06-15",
//       time: "16:20",
//     },
//   ],
//   pending: [
//     {
//       id: "ORD-002",
//       customer: {
//         name: "Maria Garcia",
//         avatar: "/placeholder.svg?height=32&width=32&text=MG",
//       },
//       amount: 18.99,
//       items: 2,
//       status: "pending",
//       date: "2023-06-15",
//       time: "15:45",
//     },
//   ],
//   cancelled: [
//     {
//       id: "ORD-004",
//       customer: {
//         name: "Emily Chen",
//         avatar: "/placeholder.svg?height=32&width=32&text=EC",
//       },
//       amount: 8.5,
//       items: 1,
//       status: "cancelled",
//       date: "2023-06-15",
//       time: "17:05",
//     },
//   ],
// }

interface StoreOrdersListProps {
  status: "all" | "paid" | "pending" | "cancelled"
  orders: IOrder[] | []
}

export function StoreOrdersList({ status, orders }: StoreOrdersListProps) {
  const ordersList = status == "all"? orders : orders.filter((order => order.status == status))
  const router = useRouter()

  if (ordersList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No orders found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          {status === "cancelled"
            ? "You don't have any cancelled orders at the moment."
            : status === "pending"
              ? "You don't have any pending orders at the moment."
              : status === "paid"
                ? "You don't have any paid orders at the moment."
                : "You don't have any orders at the moment."}
        </p>
      </Card>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordersList.map((order) => (
          <TableRow key={order.order_number}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=MG" alt={order.customer_name} />
                  <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{order.customer_name}</span>
              </div>
            </TableCell>
            <TableCell>
              {dayjs(order.created_at).format('DD MMMM YYYY HH:mm:ss')}
            </TableCell>
            <TableCell>{order.items.length}</TableCell>
            <TableCell>{order.total_amount.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  order.status === "paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : order.status === "pending"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button onClick={() => router.push(`/pay/${order.midtrans_token}/${order._id}`)} size="icon" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                    {order.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-green-600">Mark as paid</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":")
  const hour = Number.parseInt(hours, 10)
  const suffix = hour < 12 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam"
  const hour12 = hour % 12 || 12
  return `${hour12}.${minutes} ${suffix}`
}