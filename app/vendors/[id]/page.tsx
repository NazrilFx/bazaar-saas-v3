import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { VendorProducts } from "@/components/vendor-products"
import { VendorTransactions } from "@/components/vendor-transactions"
import { VendorStats } from "@/components/vendor-stats"

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch vendor data based on the ID
  const vendor = {
    id: params.id,
    name: "Food Truck Delights",
    category: "Food & Beverages",
    description: "Serving delicious street food at the festival",
    contactName: "John Smith",
    email: "john@foodtruckdelights.com",
    phone: "+1 (555) 123-4567",
    products: 12,
    sales: 1250,
    status: "active",
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Vendor Details" />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/vendors">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          <Button variant="outline" size="sm" className="ml-auto mr-2">
            <Edit className="mr-2 h-4 w-4" /> Edit Vendor
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd>{vendor.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
                  <dd>{vendor.contactName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                      {vendor.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd>{vendor.phone}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <VendorStats />
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <VendorProducts vendorId={params.id} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <VendorTransactions vendorId={params.id} />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Settings</CardTitle>
                <CardDescription>Manage vendor settings and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

