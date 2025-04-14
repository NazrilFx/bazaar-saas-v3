import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"
import { IOrder } from "@/models/Order";
import dayjs from "dayjs";

// interface Order {
//   id: string
//   customer: {
//     name: string
//     avatar?: string
//   }
//   amount: number
//   items: number
//   status: "completed" | "processing" | "cancelled"
//   date: string
// }

// const orders: Order[] = [
//   {
//     id: "ORD-001",
//     customer: {
//       name: "Alex Johnson",
//       avatar: "/placeholder.svg?height=32&width=32&text=AJ",
//     },
//     amount: 32.5,
//     items: 3,
//     status: "completed",
//     date: "10 min ago",
//   },
//   {
//     id: "ORD-002",
//     customer: {
//       name: "Maria Garcia",
//       avatar: "/placeholder.svg?height=32&width=32&text=MG",
//     },
//     amount: 18.99,
//     items: 2,
//     status: "processing",
//     date: "25 min ago",
//   },
//   {
//     id: "ORD-003",
//     customer: {
//       name: "James Wilson",
//       avatar: "/placeholder.svg?height=32&width=32&text=JW",
//     },
//     amount: 24.75,
//     items: 1,
//     status: "completed",
//     date: "1 hour ago",
//   },
//   {
//     id: "ORD-004",
//     customer: {
//       name: "Emily Chen",
//       avatar: "/placeholder.svg?height=32&width=32&text=EC",
//     },
//     amount: 8.5,
//     items: 1,
//     status: "cancelled",
//     date: "2 hours ago",
//   },
// ]

type StoreRecentOrdersProps = {
  orders: IOrder[]; // Ganti `OrderType` dengan tipe data order kamu
};
export function StoreRecentOrders({orders} : StoreRecentOrdersProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.order_number} className="flex items-center justify-between p-4 border rounded-lg bg-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={order.customer_name} alt={order.customer_name} />
              <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{order.customer_name}</h3>
                <span className="text-xs text-muted-foreground">{order.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{order.total_amount.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}</span>
                <span>•</span>
                <span>
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
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
                <span className="text-xs text-muted-foreground">{dayjs(order.created_at).format('DD MMMM YYYY HH:mm:ss')}</span>
              </div>
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

