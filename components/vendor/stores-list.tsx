import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, MoreHorizontal, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoresWithBazarEvent } from "@/app/vendor/page";
import { useRouter } from "next/navigation";

// const stores: Record<string, VendorStore[]> = {
//   active: [
//     {
//       id: "store1",
//       name: "Organic Delights",
//       location: "Section A, Booth 12",
//       bazaarEvent: "Summer Food Festival",
//       status: "active",
//       productsCount: 24,
//       revenue: 5280.5,
//     },
//     {
//       id: "store2",
//       name: "Handcrafted Treasures",
//       location: "Section C, Booth 5",
//       bazaarEvent: "Artisan Market",
//       status: "active",
//       productsCount: 18,
//       revenue: 4125.75,
//     },
//   ],
//   pending: [
//     {
//       id: "store4",
//       name: "Eco-Friendly Goods",
//       location: "Section D, Booth 9",
//       bazaarEvent: "Autumn Craft Fair",
//       status: "pending",
//       productsCount: 0,
//       revenue: 0,
//     },
//   ],
//   inactive: [
//     {
//       id: "store3",
//       name: "Vintage Collections",
//       location: "Section B, Booth 8",
//       bazaarEvent: "Antique Fair",
//       status: "inactive",
//       productsCount: 6,
//       revenue: 3137.5,
//     },
//   ],
// }

interface VendorStoresListProps {
  status: "active" | "inactive" | "pending";
  stores: StoresWithBazarEvent[] | [];
  deactive: (storeId: string) => void,
  activate: (storeId: string) => void,
}

export function VendorStoresList({ status, stores, deactive, activate }: VendorStoresListProps) {
  const router = useRouter()
  let storesList: StoresWithBazarEvent[] = [];

  if (status === "active") {
    storesList = stores.filter((store) => store.active === true);
  } else if (status === "inactive") {
    storesList = stores.filter((store) => store.active === false);
  } else if (status === "pending") {
    storesList = []; // Fitur store pending dihilangkan
  }

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
        <Button onClick={() => router.push("/signup-store")} className="mt-4">Register New Store</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {storesList.map((store) => (
        <div
          key={store._id.toString()}
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
                <span>{store.bazarEvent}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={
                    store.active
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  {store.active ? "active" : "inactive"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {store.productCount} products
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="text-right mr-2">
              <div className="font-medium">
                {store.revenue.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
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
                <>
                  <DropdownMenuItem>Manage Products</DropdownMenuItem>
                  <DropdownMenuItem>View Sales</DropdownMenuItem>
                </>
                <DropdownMenuSeparator />
                {store.active ? (
                  <DropdownMenuItem className="text-red-600" onClick={() => deactive(store._id.toString())}>
                    Deactivate Store
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-green-600" onClick={() => activate(store._id.toString())}>
                    Activate Store
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
