"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CreditCard, DollarSign, Package, Plus, ShoppingBag } from "lucide-react"
import { StoreProductsList } from "@/components/store/products-list"
import { StoreRecentOrders } from "@/components/store/recent-orders"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StoreDashboard() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Dashboard</h2>
          <p className="text-muted-foreground">Manage your products, inventory, and orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/store/pos">
            <Button variant="outline" className="bg-store-primary text-white hover:bg-store-secondary border-none">
              <CreditCard className="mr-2 h-4 w-4" />
              Open POS
            </Button>
          </Link>
          <Button onClick={() => {router.push("/store/products/create")}}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,280.50</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 18.2%
              </span>
              <span className="ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">3 out of stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">352</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12.5%
              </span>
              <span className="ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground mt-1">Across 24 products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product listings and inventory</CardDescription>
            </div>
            <Button onClick={() => {router.push("/store/products/create")}} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <StoreProductsList status="all" products={[]} edit={() => {}} updateStock={() => {}} editPrice={() => {}} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Products
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders for your store</CardDescription>
          </CardHeader>
          <CardContent>
            <StoreRecentOrders />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>Your store&apos;s performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Sales analytics chart will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="products">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Product performance chart will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="customers">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Customer demographics chart will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

