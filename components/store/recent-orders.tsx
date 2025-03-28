import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"

interface Order {
  id: string
  customer: {
    name: string
    avatar?: string
  }
  amount: number
  items: number
  status: "completed" | "processing" | "cancelled"
  date: string
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32&text=AJ",
    },
    amount: 32.5,
    items: 3,
    status: "completed",
    date: "10 min ago",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=32&width=32&text=MG",
    },
    amount: 18.99,
    items: 2,
    status: "processing",
    date: "25 min ago",
  },
  {
    id: "ORD-003",
    customer: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=32&width=32&text=JW",
    },
    amount: 24.75,
    items: 1,
    status: "completed",
    date: "1 hour ago",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32&text=EC",
    },
    amount: 8.5,
    items: 1,
    status: "cancelled",
    date: "2 hours ago",
  },
]

export function StoreRecentOrders() {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
              <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{order.customer.name}</h3>
                <span className="text-xs text-muted-foreground">{order.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>${order.amount.toFixed(2)}</span>
                <span>•</span>
                <span>
                  {order.items} {order.items === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={
                    order.status === "completed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : order.status === "processing"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {order.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{order.date}</span>
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

