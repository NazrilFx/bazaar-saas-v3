import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface VendorPerformance {
  id: string
  name: string
  revenue: number
  transactions: number
  growth: number
  avatar?: string
}

const vendors: VendorPerformance[] = [
  {
    id: "v1",
    name: "Green Earth Organics",
    revenue: 12450.75,
    transactions: 345,
    growth: 18.5,
    avatar: "/placeholder.svg?height=40&width=40&text=GEO",
  },
  {
    id: "v2",
    name: "Artisan Bakery",
    revenue: 10280.5,
    transactions: 298,
    growth: 15.2,
    avatar: "/placeholder.svg?height=40&width=40&text=AB",
  },
  {
    id: "v3",
    name: "Handmade Treasures",
    revenue: 8975.25,
    transactions: 245,
    growth: 12.8,
    avatar: "/placeholder.svg?height=40&width=40&text=HT",
  },
  {
    id: "v4",
    name: "Vintage Collectibles",
    revenue: 7650.0,
    transactions: 210,
    growth: 9.5,
    avatar: "/placeholder.svg?height=40&width=40&text=VC",
  },
  {
    id: "v5",
    name: "Eco-Friendly Goods",
    revenue: 6320.8,
    transactions: 175,
    growth: 7.2,
    avatar: "/placeholder.svg?height=40&width=40&text=EFG",
  },
]

export function AdminVendorPerformance() {
  const maxRevenue = Math.max(...vendors.map((vendor) => vendor.revenue))

  return (
    <div className="space-y-4">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={vendor.avatar} alt={vendor.name} />
            <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{vendor.name}</p>
                <p className="text-xs text-muted-foreground">{vendor.transactions} transactions</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${vendor.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{vendor.growth}%</p>
              </div>
            </div>
            <Progress value={(vendor.revenue / maxRevenue) * 100} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

