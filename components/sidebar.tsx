"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, QrCode, Store, Receipt, Settings, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "QR Codes", href: "/qr-codes", icon: QrCode },
  { name: "Vendors", href: "/vendors", icon: Store },
  { name: "Receipts", href: "/receipts", icon: Receipt },
]

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
  { name: "Logout", href: "/logout", icon: LogOut },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-60 border-r bg-background flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">Bazaar Pay</h1>
        <p className="text-sm text-muted-foreground">Smart Cashless Payments</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              pathname === item.href
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-muted/50",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      {pathname.includes("/events/") && (
        <div className="px-4 py-4 bg-muted/40 mx-4 my-2 rounded-lg">
          <h3 className="font-medium text-sm">Current Event</h3>
          <div className="text-sm mt-1">Summer Music Festival</div>
          <div className="text-xs text-muted-foreground">June 15-18, 2023</div>
          <div className="text-xs text-muted-foreground">Balance: $120.50</div>
          <Link
            href="/events/current"
            className="text-xs text-center block w-full mt-2 py-2 bg-background rounded hover:bg-muted transition-colors"
          >
            View Details
          </Link>
        </div>
      )}

      <div className="mt-auto px-4 pb-6 space-y-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all"
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

