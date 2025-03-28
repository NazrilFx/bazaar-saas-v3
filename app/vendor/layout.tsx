"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart3, CalendarDays, CreditCard, Home, Settings, ShoppingBag, Store } from "lucide-react"

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
]

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DashboardLayout
      navItems={navItems}
      theme="vendor"
      title="Vendor Dashboard"
      subtitle="Manage your stores and bazaar participation"
      userRole="Vendor"
      userName="Sarah Vendor"
    >
      {children}
    </DashboardLayout>
  )
}

