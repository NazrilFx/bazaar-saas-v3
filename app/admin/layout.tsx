"use client";

import type React from "react";
import { useState, useEffect } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Home,
  Settings,
  Store,
  Users,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Vendors",
    href: "/admin/vendors",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Bazaar Events",
    href: "/admin/events",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  created_at: string;
}

export default function AdminLayout({children,}: Readonly<{children: React.ReactNode;
}>) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth-admin/me"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setAdmin(data.user);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!admin) return <p>admin not found</p>;

  return (
    <DashboardLayout
      navItems={navItems}
      theme="admin"
      title="Admin Dashboard"
      subtitle="Manage your bazaar ecosystem"
      userRole={admin.role}
      userName={admin.name}
    >
      {children}
    </DashboardLayout>
  );
}
