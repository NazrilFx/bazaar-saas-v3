import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, CreditCard, Package } from "lucide-react"

export function VendorStats() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,250.00</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
            </span>
            <span className="ml-1">from last event</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground mt-1">8 active, 4 out of stock</p>
        </CardContent>
      </Card>
    </>
  )
}

