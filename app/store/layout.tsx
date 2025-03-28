"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart3, CreditCard, Home, Package, Settings, ShoppingBag, Users, Zap } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/store",
    icon: <Home className="h-5 w-5" />,
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
]

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DashboardLayout
      navItems={navItems}
      theme="store"
      title="Store Dashboard"
      subtitle="Organic Delights at Summer Food Festival"
      userRole="Store Manager"
      userName="Mike Store"
    >
      {children}
    </DashboardLayout>
  )
}

