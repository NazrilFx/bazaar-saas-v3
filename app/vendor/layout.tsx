"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Home,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";

const navItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "My Stores",
    href: "/vendor/stores",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Bazaar Events",
    href: "/vendor/events",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/vendor/transactions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/vendor/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

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

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const [vendor, setVendor] = useState<Ivendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth-vendor/me"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setVendor(data.vendor);
        } else {
          setVendor(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    // Hapus cookies terkait login
   await fetch("/api/auth-vendor/logout")
    router.push('/login-store')
  }

  if (loading) return <Loading/>;
  if (!vendor) return <p>vendor not found</p>;
  if (!vendor.verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Vendor Telah Dinonaktifkan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, akun vendor Anda saat ini sedang tidak aktif. Silakan hubungi admin
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
    )
  }

  return (
    <DashboardLayout
      navItems={navItems}
      theme="vendor"
      title="Vendor Dashboard"
      subtitle="Manage your stores and bazaar participation"
      userRole="Vendor"
      userName={vendor.name}
      logout="/api/auth-vendor/logout"
    >
      {children}
    </DashboardLayout>
  );
}
