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
import { VendorStoresList } from "@/components/vendor/stores-list";
import { IStore } from "@/models/Store";
import { Filter, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { StoresWithBazarEvent } from "../page";

export default function VendorStoresPage() {
  const [stores, setStores] = useState<StoresWithBazarEvent[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/vendor/stores"); // Fetch dari API Next.js
      const data = await res.json();
      if (res.ok) {
        setStores(data.stores);
      } else {
        setStores([]);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const deactive = async (storeId: string) => {
    const res = await fetch("/api/vendor/stores/deactive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // kirim data yang dibutuhkan untuk mengaktifkan vendor
        storeId,
        csrfToken,
      }),
    });

    const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Activate failed");
      window.location.reload();
  };

  const activate = async (storeId: string) => {
    const res = await fetch("/api/vendor/stores/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // kirim data yang dibutuhkan untuk mengaktifkan vendor
        storeId,
        csrfToken,
      }),
    });

    const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Activate failed");
      window.location.reload()
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Stores</h2>
          <p className="text-muted-foreground">
            Manage your store locations across different bazaars
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register New Store
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Stores</CardTitle>
              <CardDescription>
                View and manage all your store locations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stores..."
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
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Stores</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <VendorStoresList
                status="active"
                stores={stores}
                deactive={deactive}
                activate={activate}
              />
            </TabsContent>
            <TabsContent value="pending">
              <VendorStoresList
                status="pending"
                stores={stores}
                deactive={deactive}
                activate={activate}
              />
            </TabsContent>
            <TabsContent value="inactive">
              <VendorStoresList
                status="inactive"
                stores={stores}
                deactive={deactive}
                activate={activate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
