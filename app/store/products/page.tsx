"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreProductsList } from "@/components/store/products-list"
import { Filter, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"


export default function StoreProductsPage() {
  const router = useRouter()
  const [product, setProduct] = useState< | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/product"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setProduct(data.products);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchUser();

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your store&apos;s product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("category/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
          <Button onClick={() => router.push("products/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>View and manage all your store products</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8 w-[200px] md:w-[300px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="in_stock">In Stock</TabsTrigger>
              <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <StoreProductsList status="all" products={product ?? []} />
            </TabsContent>
            <TabsContent value="in_stock">
              <StoreProductsList status="in_stock" products={product ?? []} />
            </TabsContent>
            <TabsContent value="low_stock">
              <StoreProductsList status="low_stock" products={product ?? []} />
            </TabsContent>
            <TabsContent value="out_of_stock">
              <StoreProductsList status="out_of_stock" products={product ?? []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

