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

interface Ivendor {
  name: string;
  email: string;
  description: string;
  phone: string;
  profile_image: string;
  business_type: string;
  contact_name: string;
  password_hash: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export default function VendorManagement() {
  const router = useRouter();

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
              <AdminVendorsList status="active" />
            </TabsContent>
            <TabsContent value="pending">
              <AdminVendorsList status="pending" />
            </TabsContent>
            <TabsContent value="inactive">
              <AdminVendorsList status="inactive" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
