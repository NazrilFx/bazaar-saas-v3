"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Filter, MoreVertical, Search, Store, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Vendor {
  id: string
  name: string
  category: string
  products: number
  sales: number
  status: "active" | "inactive"
}

const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Food Truck Delights",
    category: "Food & Beverages",
    products: 12,
    sales: 1250,
    status: "active",
  },
  {
    id: "v2",
    name: "Craft Beer Stand",
    category: "Food & Beverages",
    products: 8,
    sales: 980,
    status: "active",
  },
  {
    id: "v3",
    name: "Souvenir Shop",
    category: "Merchandise",
    products: 45,
    sales: 3200,
    status: "active",
  },
  {
    id: "v4",
    name: "Artisan Jewelry",
    category: "Crafts",
    products: 67,
    sales: 1870,
    status: "active",
  },
  {
    id: "v5",
    name: "Vintage Records",
    category: "Music",
    products: 120,
    sales: 950,
    status: "inactive",
  },
]

export function VendorsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${vendor.name.charAt(0)}`} />
                      <AvatarFallback>
                        <Store className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {vendor.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{vendor.products}</TableCell>
                <TableCell>${vendor.sales.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      vendor.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Store className="mr-2 h-4 w-4" /> View Products
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

