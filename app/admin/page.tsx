"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Store,
  Users,
} from "lucide-react";
import { AdminRecentActivity } from "@/components/admin/recent-activity";
import { AdminVendorApprovals } from "@/components/admin/vendor-approvals";
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

export default function AdminDashboard() {
  const [csrfToken, setCsrfToken] = useState("");
  const [InactiveVendor, setInactiveVendor] = useState<Ivendor[] | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/admin/dashboard"); // Fetch dari API Next.js
      const data = await res.json();

      if (res.ok) {
        setInactiveVendor(data.inactiveVendors);
      } else {
        setInactiveVendor(null);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser();
  }, []);

  function newBazaarEvent(): void {}

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your bazaar ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={newBazaarEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New Bazaar Event
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 20.1%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vendors
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 upcoming in next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 4.3%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>
              Pending vendor and store approvals requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vendors">
              <TabsList className="mb-4">
                <TabsTrigger value="vendors">Vendor Approvals</TabsTrigger>
                <TabsTrigger value="stores">Store Approvals</TabsTrigger>
                <TabsTrigger value="products">Product Approvals</TabsTrigger>
              </TabsList>
              <TabsContent value="vendors">
                {/* Beri Props inactiveVendors */}
                <AdminVendorApprovals vendors={InactiveVendor} />
              </TabsContent>
              <TabsContent value="stores">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All Caught Up!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-1">
                    There are no pending store approvals at the moment. New
                    requests will appear here.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="products">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium">
                    5 Products Pending Review
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-1">
                    These products require your review before they can be
                    listed.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Review Products
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
