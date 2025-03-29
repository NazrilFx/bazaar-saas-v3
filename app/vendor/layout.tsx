"use client";

import type React from "react";

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

  if (loading) return <p>Loading...</p>;
  if (!vendor) return <p>vendor not found</p>;

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
