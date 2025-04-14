"use client";

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
import { StoreOrdersList } from "@/components/store/orders-list";
import { Download, Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import { IOrder } from "@/models/Order";

export default function StoreOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<IOrder[] | []>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch("/api/order"); // Fetch dari API Next.js
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    };

    fetchOrder().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleExport = async () => {
    try {
      const res = await fetch("/api/order/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders,
        }),
      });

      if (!res.ok) {
        console.error("terjadi error saat export");
      }

      // Ambil CSV-nya sebagai blob
      const blob = await res.blob();

      // Buat download otomatis
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(" error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage your store&apos;s orders and transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and manage all your store orders
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
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
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <StoreOrdersList status="all" orders={orders} />
            </TabsContent>
            <TabsContent value="completed">
              <StoreOrdersList status="paid" orders={orders} />
            </TabsContent>
            <TabsContent value="processing">
              <StoreOrdersList status="pending" orders={orders} />
            </TabsContent>
            <TabsContent value="cancelled">
              <StoreOrdersList status="cancelled" orders={orders} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
