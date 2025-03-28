import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Bazaar Pay</h1>
        <p className="text-lg text-indigo-700">Comprehensive Bazaar Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <RoleCard
          title="Admin Dashboard"
          description="Manage vendor accounts, bazaar events, and system analytics"
          icon="/placeholder.svg?height=80&width=80&text=Admin"
          href="/admin"
          color="bg-admin-primary"
        />

        <RoleCard
          title="Vendor Dashboard"
          description="Manage participation in bazaars and oversee stores"
          icon="/placeholder.svg?height=80&width=80&text=Vendor"
          href="/vendor"
          color="bg-vendor-primary"
        />

        <RoleCard
          title="Store Dashboard"
          description="Handle inventory, products, and track orders"
          icon="/placeholder.svg?height=80&width=80&text=Store"
          href="/store"
          color="bg-store-primary"
        />

        <RoleCard
          title="POS Interface"
          description="Customer-facing screen with QRIS payment"
          icon="/placeholder.svg?height=80&width=80&text=POS"
          href="/pos"
          color="bg-pos-primary"
        />
      </div>

      <footer className="mt-12 text-center text-indigo-600">
        <p>© 2023 Bazaar Pay. All rights reserved.</p>
      </footer>
    </div>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

function RoleCard({ title, description, icon, href, color }: RoleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full p-2 bg-muted">
            <Image src={icon || "/placeholder.svg"} alt={title} width={80} height={80} className="rounded-full" />
          </div>
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className={`w-full ${color} hover:opacity-90 text-white border-none`}>Enter Dashboard</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

