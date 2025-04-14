"use client";

import React, { useState, useEffect } from "react";
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
import { StoreProductsList } from "@/components/store/products-list";
import { Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ObjectId } from "mongodb";
import Loading from "@/components/loading";
import { IOrderItem } from "@/models/Order";

export interface IProduct extends Document {
  _id: ObjectId;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function StoreProductsPage() {
  const router = useRouter();
  const [product, setProduct] = useState<null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [modalStock, setModalStock] = useState(false);
  const [modalPrice, setModalPrice] = useState(false);
  const [stockUpdate, setStockUpdate] = useState<number | null>(null);
  const [priceUpdate, setPriceUpdate] = useState<number | null>(null);
  const [targetProductId, setTargetProductId] = useState("");

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

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser().then(() => setLoading(false));
  }, []);

  const edit = async (id: string) => {
    router.push(`products/edit/${id}`);
  };

  const updateStock = async (id: string, stock: number) => {
    setModalStock(true);
    setTargetProductId(id);
    setStockUpdate(stock);
  };

  const editPrice = async (id: string, price: number) => {
    setModalPrice(true);
    setTargetProductId(id);
    setPriceUpdate(price);
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
      console.error("Update error :", error);
    } finally {
      setTargetProductId("");
      window.location.reload();
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (targetProductId == "") {
      throw new Error("Target product not found");
    }

    if (!priceUpdate || priceUpdate == 0) {
      throw new Error("Price not valid");
    }

    try {
      const res = await fetch("/api/product/update/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetProductId,
          price: priceUpdate,
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
      console.log(data);
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Update error :", error);
    } finally {
      setTargetProductId("");
      window.location.reload();
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Modal untuk update stock
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

  if (modalPrice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Update Price</h2>
          <form>
            <input
              type="number"
              value={priceUpdate ?? ""}
              onChange={(e) =>
                setPriceUpdate(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="placeholder"
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              required
            />
            {priceUpdate && (
              <div className="text-sm my-2 bg-blue-50">
                Rp {new Intl.NumberFormat("id-ID").format(priceUpdate)}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalPrice(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePrice}
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
            Manage your store&apos;s product catalog
          </p>
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
              <CardDescription>
                View and manage all your store products
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-[200px] md:w-[300px]"
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
              <TabsTrigger value="in_stock">In Stock</TabsTrigger>
              <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <StoreProductsList
                status="all"
                products={product ?? []}
                edit={edit}
                updateStock={updateStock}
                editPrice={editPrice}
              />
            </TabsContent>
            <TabsContent value="in_stock">
              <StoreProductsList
                status="in_stock"
                products={product ?? []}
                edit={edit}
                updateStock={updateStock}
                editPrice={editPrice}
              />
            </TabsContent>
            <TabsContent value="low_stock">
              <StoreProductsList
                status="low_stock"
                products={product ?? []}
                edit={edit}
                updateStock={updateStock}
                editPrice={editPrice}
              />
            </TabsContent>
            <TabsContent value="out_of_stock">
              <StoreProductsList
                status="out_of_stock"
                products={product ?? []}
                edit={edit}
                updateStock={updateStock}
                editPrice={editPrice}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
