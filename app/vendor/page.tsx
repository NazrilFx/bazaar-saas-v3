"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CreditCard,
  DollarSign,
  Plus,
  ShoppingBag,
  Store,
} from "lucide-react";
import { VendorStoresList } from "@/components/vendor/stores-list";
import { VendorEventsList } from "@/components/vendor/events-list";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IStore } from "@/models/Store";
import { IEvent } from "@/models/Event";
import { ObjectId } from "mongodb";
import Loading from "@/components/loading";

export type StoresWithBazarEvent = IStore & {
  _id: ObjectId;
  bazarEvent: string;
  revenue: number;
  productCount: number;
};

export type EventWithStoreThisEvent = IEvent & {
  _id: ObjectId;
  storeThisEvent: number;
  isActive: boolean;
};

export default function VendorDashboard() {
  const router = useRouter();
  const [stores, setStores] = useState<StoresWithBazarEvent[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsGrowth, setProductsGrowth] = useState(0);
  const [isProductsGrowth, setIsProductsGrowth] = useState(false);
  const [totalProductsLastMonth, setTotalProductsLastMonth] = useState(0);
  const [participatingStoresCount, setParticipatingStoresCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<
    EventWithStoreThisEvent[]
  >([]);
  const [loading, setLoading] = useState(true)
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/vendor/dashboard"); // Fetch dari API Next.js
      const data = await res.json();
      if (res.ok) {
        setStores(data.stores);
        setTotalProducts(data.totalProducts);
        setTotalProductsLastMonth(data.productsLastMonth);
        setParticipatingStoresCount(data.participatingStoresCount);
        setUpcomingEvents(data.upcomingEvents);
      } else {
        setStores([]);
        setUpcomingEvents([]);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const growth =
      totalProductsLastMonth === 0
        ? 100
        : ((totalProducts - totalProductsLastMonth) / totalProductsLastMonth) *
          100;

    setProductsGrowth(growth);
    setIsProductsGrowth(growth >= 0);
    console.log(totalProductsLastMonth);
  }, [totalProducts, totalProductsLastMonth]);

  if (loading) {
    return <Loading/>
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
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Vendor Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your stores and bazaar participation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              router.push("/signup-store");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Register New Store
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
            <div className="text-2xl font-bold">$12,543.75</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 15.3%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {participatingStoresCount} bazaar events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span
                className={`${
                  isProductsGrowth ? "text-green-500" : "text-red-500"
                } flex items-center`}
              >
                {isProductsGrowth ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(productsGrowth).toFixed(2)}%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12.5%
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>My Stores</CardTitle>
              <CardDescription>
                Manage your store locations across different bazaars
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                router.push("/signup-store");
              }}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </CardHeader>
          <CardContent>
            <VendorStoresList
              status="active"
              stores={stores}
              deactive={deactive}
              activate={activate}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Stores
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Bazaar events you&apos;re participating in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VendorEventsList events={upcomingEvents} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <CalendarDays className="mr-2 h-4 w-4" />
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Your sales performance across all stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Daily sales chart will appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Weekly sales chart will appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="monthly">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Monthly sales chart will appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Yearly sales chart will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
