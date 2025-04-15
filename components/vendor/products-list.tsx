"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Package, ShoppingBag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  store: string
  status: "in_stock" | "out_of_stock" | "low_stock"
  image?: string
}

// const products: Record<string, Product[]> = {
//   all: [
//     {
//       id: "p1",
//       name: "Organic Salad Bowl",
//       category: "Food",
//       price: 12.99,
//       stock: 45,
//       store: "Organic Delights",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Salad",
//     },
//     {
//       id: "p2",
//       name: "Fresh Fruit Smoothie",
//       category: "Beverages",
//       price: 8.5,
//       stock: 32,
//       store: "Organic Delights",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Smoothie",
//     },
//     {
//       id: "p3",
//       name: "Vegan Protein Bar",
//       category: "Snacks",
//       price: 4.99,
//       stock: 0,
//       store: "Organic Delights",
//       status: "out_of_stock",
//       image: "/placeholder.svg?height=40&width=40&text=Bar",
//     },
//     {
//       id: "p4",
//       name: "Handmade Ceramic Mug",
//       category: "Crafts",
//       price: 18.99,
//       stock: 15,
//       store: "Handcrafted Treasures",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Mug",
//     },
//     {
//       id: "p5",
//       name: "Artisan Soap Set",
//       category: "Bath & Body",
//       price: 24.5,
//       stock: 8,
//       store: "Handcrafted Treasures",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Soap",
//     },
//     {
//       id: "p6",
//       name: "Eco-Friendly Tote Bag",
//       category: "Accessories",
//       price: 15.0,
//       store: "Handcrafted Treasures",
//       stock: 0,
//       status: "low_stock",
//       image: "/placeholder.svg?height=40&width=40&text=Bag",
//     },
//   ],
//   active: [
//     {
//       id: "p1",
//       name: "Organic Salad Bowl",
//       category: "Food",
//       price: 12.99,
//       stock: 45,
//       store: "Organic Delights",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Salad",
//     },
//     {
//       id: "p2",
//       name: "Fresh Fruit Smoothie",
//       category: "Beverages",
//       price: 8.5,
//       stock: 32,
//       store: "Organic Delights",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Smoothie",
//     },
//     {
//       id: "p4",
//       name: "Handmade Ceramic Mug",
//       category: "Crafts",
//       price: 18.99,
//       stock: 15,
//       store: "Handcrafted Treasures",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Mug",
//     },
//     {
//       id: "p5",
//       name: "Artisan Soap Set",
//       category: "Bath & Body",
//       price: 24.5,
//       stock: 8,
//       store: "Handcrafted Treasures",
//       status: "active",
//       image: "/placeholder.svg?height=40&width=40&text=Soap",
//     },
//   ],
//   out_of_stock: [
//     {
//       id: "p3",
//       name: "Vegan Protein Bar",
//       category: "Snacks",
//       price: 4.99,
//       stock: 0,
//       store: "Organic Delights",
//       status: "out_of_stock",
//       image: "/placeholder.svg?height=40&width=40&text=Bar",
//     },
//   ],
//   low_stock: [
//     {
//       id: "p6",
//       name: "Eco-Friendly Tote Bag",
//       category: "Accessories",
//       price: 15.0,
//       store: "Handcrafted Treasures",
//       stock: 0,
//       status: "low_stock",
//       image: "/placeholder.svg?height=40&width=40&text=Bag",
//     },
//   ],
// }

interface VendorProductsListProps {
  status: "all" | "in_stock" | "out_of_stock" | "low_stock"
  products: Product[]
  updateStock: (id: string, stock: number) => void;
  deleteProduct: (id: string) => void;
}

export function VendorProductsList({ status, products, updateStock, deleteProduct }: VendorProductsListProps) {
  const router = useRouter()
    let productsList: Product[] = [];
  
    if (status === "in_stock") {
      productsList = products.filter((product) => product.status === "in_stock");
    } else if (status === "out_of_stock") {
      productsList = products.filter((product) => product.status === "out_of_stock");
    } else if (status === "low_stock") {
      productsList = products.filter((product) => product.status === "low_stock");// Fitur product low_stock dihilangkan
    } else if (status === "all") {
      productsList = products
    }
  

  if (productsList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1"> 
          {status === "low_stock"
            ? "You don't have any products low_stock approval at the moment."
            : status === "out_of_stock"
              ? "You don't have any out of stock products at the moment."
              : "You don't have any products at the moment."}
        </p>
        <Button className="mt-4">Add New Product</Button>
      </Card>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productsList.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.status === "low_stock" ? "N/A" : product.stock}</TableCell>
            <TableCell>{product.store}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  product.status === "in_stock"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : product.status === "out_of_stock"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                }
              >
                {product.status === "in_stock"
                  ? "in_stock"
                  : product.status === "out_of_stock"
                    ? "Out of Stock"
                    : "low_stock"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button size="icon" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    {product.status !== "low_stock" && <DropdownMenuItem onClick={() => updateStock(product.id, product.price)}>Update Stock</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => router.push(`/store/product/edit/${product.id}`)}>Edit Product</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteProduct(product.id)} className="text-red-600">Remove Product</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

