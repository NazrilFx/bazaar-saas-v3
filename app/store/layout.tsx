"use client";

import type React from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  BarChart3,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { IStore } from "@/models/Store";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/store",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Category",
    href: "/store/category",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/store/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Inventory",
    href: "/store/inventory",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/store/orders",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "POS",
    href: "/store/pos",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Customers",
    href: "/store/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/store/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/store/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [vendorName, setVendorName] = useState("");
  const [store, setStore] = useState<IStore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth-store/me"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setStore(data.store);
          setVendorName(data.vendor_name);
        } else {
          setStore(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setStore(null);
      }
    };

    fetchUser().then(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    // Hapus cookies terkait login
    await fetch("/api/auth-store/logout");
    router.push("/login-store");
  };

  if (loading) return <Loading />;
  if (!store) return <p>store not found</p>;
  if (!store.active) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Store Telah Dinonaktifkan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, toko Anda saat ini sedang tidak aktif. Silakan hubungi admin
            untuk informasi lebih lanjut.
          </p>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      theme="store"
      title="Store Dashboard"
      subtitle={`${store.name} at Summer Food Festival`}
      userRole={`Vendor ${vendorName}`}
      userName={store.name}
      logout="/api/auth-store/logout"
    >
      {children}
    </DashboardLayout>
  );
}
