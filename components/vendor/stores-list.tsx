import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, MoreHorizontal, Store } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VendorStore {
  id: string
  name: string
  location: string
  bazaarEvent: string
  status: "active" | "inactive" | "pending"
  productsCount: number
  revenue: number
}

const stores: Record<string, VendorStore[]> = {
  active: [
    {
      id: "store1",
      name: "Organic Delights",
      location: "Section A, Booth 12",
      bazaarEvent: "Summer Food Festival",
      status: "active",
      productsCount: 24,
      revenue: 5280.5,
    },
    {
      id: "store2",
      name: "Handcrafted Treasures",
      location: "Section C, Booth 5",
      bazaarEvent: "Artisan Market",
      status: "active",
      productsCount: 18,
      revenue: 4125.75,
    },
  ],
  pending: [
    {
      id: "store4",
      name: "Eco-Friendly Goods",
      location: "Section D, Booth 9",
      bazaarEvent: "Autumn Craft Fair",
      status: "pending",
      productsCount: 0,
      revenue: 0,
    },
  ],
  inactive: [
    {
      id: "store3",
      name: "Vintage Collections",
      location: "Section B, Booth 8",
      bazaarEvent: "Antique Fair",
      status: "inactive",
      productsCount: 6,
      revenue: 3137.5,
    },
  ],
}

interface VendorStoresListProps {
  status?: "active" | "inactive" | "pending"
}

export function VendorStoresList({ status = "active" }: VendorStoresListProps) {
  const storesList = stores[status] || []

  if (storesList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <Store className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No {status} stores</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          {status === "pending"
            ? "You don't have any pending store applications at the moment."
            : status === "inactive"
              ? "You don't have any inactive stores at the moment."
              : "You don't have any active stores at the moment."}
        </p>
        <Button className="mt-4">Register New Store</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {storesList.map((store) => (
        <div
          key={store.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-white"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vendor-muted text-vendor-primary">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{store.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                <span>{store.location}</span>
                <span className="hidden sm:inline">•</span>
                <span>{store.bazaarEvent}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={
                    store.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : store.status === "inactive"
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {store.status}
                </Badge>
                {store.status !== "pending" && (
                  <span className="text-xs text-muted-foreground">{store.productsCount} products</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {store.status !== "pending" && (
              <div className="text-right mr-2">
                <div className="font-medium">${store.revenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
            )}
            <Button size="icon" variant="ghost">
              <Edit className="h-4 w-4" />
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
                {store.status !== "pending" && (
                  <>
                    <DropdownMenuItem>Manage Products</DropdownMenuItem>
                    <DropdownMenuItem>View Sales</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                {store.status === "active" ? (
                  <DropdownMenuItem className="text-red-600">Deactivate Store</DropdownMenuItem>
                ) : store.status === "inactive" ? (
                  <DropdownMenuItem className="text-green-600">Activate Store</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-red-600">Cancel Application</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

