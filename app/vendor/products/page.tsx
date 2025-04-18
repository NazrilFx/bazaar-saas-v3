"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, VendorProductsList } from "@/components/vendor/products-list";
import { Filter, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function VendorProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<[Product] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalStock, setModalStock] = useState(false);
  const [targetProductId, setTargetProductId] = useState("");
  const [stockUpdate, setStockUpdate] = useState<number | null>(0);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchProduct = async () => {
      const res = await fetch("/api/vendor/products");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.formattedProducts);
      } else {
        setProducts([]);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchProduct().then(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log(filteredProducts);
  }, [filteredProducts]);

  if (loading) {
    return <Loading />;
  }

  const updateStock = async (id: string, stock: number) => {
    setModalStock(true);
    setTargetProductId(id);
    setStockUpdate(stock);
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/product/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          csrfToken,
        }),
        redirect: "manual",
      });

      const data = await res.json();

      // Cek apakah response adalah JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Delete failed");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Update error :", errorMessage);
    } finally {
      window.location.reload();
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (targetProductId == "") {
      throw new Error("Target product not found");
    }

    try {
      const res = await fetch("/api/product/update/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetProductId,
          stock: stockUpdate ?? 0,
          csrfToken,
        }),
        redirect: "manual",
      });

      const data = await res.json();

      // Cek apakah response adalah JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Create failed");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Update error :", errorMessage);
    } finally {
      setTargetProductId("");
      window.location.reload();
    }
  };

  if (modalStock) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Update Stock</h2>
          <form>
            <input
              type="number"
              value={stockUpdate ?? ""}
              onChange={(e) =>
                setStockUpdate(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="placeholder"
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalStock(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog across all stores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
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
              <CardDescription>
                View and manage all your products
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
              <TabsTrigger value="in_stock">In stock</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
              <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <VendorProductsList
                status="all"
                products={filteredProducts}
                deleteProduct={deleteProduct}
                updateStock={updateStock}
              />
            </TabsContent>
            <TabsContent value="in_stock">
              <VendorProductsList
                status="in_stock"
                products={filteredProducts}
                deleteProduct={deleteProduct}
                updateStock={updateStock}
              />
            </TabsContent>
            <TabsContent value="out_of_stock">
              <VendorProductsList
                status="out_of_stock"
                products={filteredProducts}
                deleteProduct={deleteProduct}
                updateStock={updateStock}
              />
            </TabsContent>
            <TabsContent value="low_stock">
              <VendorProductsList
                status="low_stock"
                products={filteredProducts}
                deleteProduct={deleteProduct}
                updateStock={updateStock}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
