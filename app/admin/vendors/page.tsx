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
import { AdminVendorsList } from "@/components/admin/vendors-list";
import { Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IVendor } from "@/models/Vendor";
import { ObjectId } from "mongodb";

export interface IVendorWithStoreCount extends IVendor {
  id: ObjectId;
  storeCount: number;
}

export default function VendorManagement() {
  const router = useRouter();
  const [vendors, setVendors] = useState<IVendorWithStoreCount[] | null>(null);
  const [filteredVendors, setFilteredVendors] = useState<
    IVendorWithStoreCount[] | null
  >(null);
  const [csrfToken, setCsrfToken] = useState("");

  const handleSearch = (query: string) => {
    if (!vendors) return;

    const filtered = vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredVendors(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/vendors"); // Fetch dari API Next.js
      const data = await res.json();

      if (res.ok) {
        setVendors(data.vendors);
        setFilteredVendors(data.vendors)
      } else {
        setVendors(null);
      }

      fetch("/api/csrf")
        .then((res) => res.json())
        .then((data) => setCsrfToken(data.csrfToken));
    };

    fetchData();
  }, []);

  const deactive = async (vendorId: string) => {
    try {
      const res = await fetch("/api/admin/vendors/deactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // kirim data yang dibutuhkan untuk mengaktifkan vendor
          vendorId,
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
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Activate error:", error);
    }
  };

  const activate = async (vendorId: string) => {
    try {
      const res = await fetch("/api/admin/vendors/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // kirim data yang dibutuhkan untuk mengaktifkan vendor
          vendorId,
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
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Activate error:", error);
    }
  };

  const handleRedirect = () => {
    router.push("/signup-vendor"); // Berfungsi di App Router
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Vendor Management
          </h2>
          <p className="text-muted-foreground">
            Manage vendor accounts and applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRedirect}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Vendor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>
                View and manage all vendors in your system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search vendors..."
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
              <TabsTrigger value="active">Active Vendors</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <AdminVendorsList
                status="active"
                vendors={filteredVendors ?? []}
                deactive={deactive}
                activate={activate}
              />
            </TabsContent>
            <TabsContent value="pending">
              <AdminVendorsList
                status="pending"
                vendors={[]}
                deactive={deactive}
                activate={activate}
              />
            </TabsContent>
            <TabsContent value="inactive">
              <AdminVendorsList
                status="inactive"
                vendors={filteredVendors ?? []}
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
