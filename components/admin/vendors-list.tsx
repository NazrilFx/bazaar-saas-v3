import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Edit, MoreHorizontal, Store, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IVendorWithStoreCount } from "@/app/admin/vendors/page"
import dayjs from "dayjs"

// const vendors: Record<string, Vendor[]> = {
//   active: [
//     {
//       id: "v1",
//       name: "Green Earth Organics",
//       email: "contact@greenearthorganics.com",
//       phone: "+1 (555) 123-4567",
//       businessType: "Food & Beverages",
//       storeCount: 3,
//       status: "active",
//       joinedDate: "Jun 15, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=GEO",
//     },
//     {
//       id: "v2",
//       name: "Handmade Treasures",
//       email: "info@handmadetreasures.com",
//       phone: "+1 (555) 234-5678",
//       businessType: "Crafts & Handmade",
//       storeCount: 2,
//       status: "active",
//       joinedDate: "Jul 3, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=HT",
//     },
//     {
//       id: "v3",
//       name: "Vintage Collectibles",
//       email: "sales@vintagecollectibles.com",
//       phone: "+1 (555) 345-6789",
//       businessType: "Antiques & Collectibles",
//       storeCount: 1,
//       status: "active",
//       joinedDate: "Aug 12, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=VC",
//     },
//     {
//       id: "v4",
//       name: "Artisan Bakery",
//       email: "hello@artisanbakery.com",
//       phone: "+1 (555) 456-7890",
//       businessType: "Food & Beverages",
//       storeCount: 4,
//       status: "active",
//       joinedDate: "May 22, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=AB",
//     },
//   ],
//   pending: [
//     {
//       id: "v5",
//       name: "Eco-Friendly Goods",
//       email: "info@ecofriendlygoods.com",
//       phone: "+1 (555) 567-8901",
//       businessType: "Sustainable Products",
//       storeCount: 0,
//       status: "pending",
//       joinedDate: "Sep 5, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=EFG",
//     },
//     {
//       id: "v6",
//       name: "Gourmet Spices",
//       email: "sales@gourmetspices.com",
//       phone: "+1 (555) 678-9012",
//       businessType: "Food & Beverages",
//       storeCount: 0,
//       status: "pending",
//       joinedDate: "Sep 8, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=GS",
//     },
//   ],
//   inactive: [
//     {
//       id: "v7",
//       name: "Seasonal Decor",
//       email: "contact@seasonaldecor.com",
//       phone: "+1 (555) 789-0123",
//       businessType: "Home & Decor",
//       storeCount: 1,
//       status: "inactive",
//       joinedDate: "Apr 10, 2023",
//       avatar: "/placeholder.svg?height=40&width=40&text=SD",
//     },
//   ],
// }

interface AdminVendorsListProps {
  status: "active" | "pending" | "inactive",
  vendors: IVendorWithStoreCount[],
  deactive: (vendorId: string) => void,
  activate: (vendorId: string) => void,
}

export function AdminVendorsList({ status, vendors, deactive, activate }: AdminVendorsListProps) {
  const filteredVendors = vendors.filter((vendor) =>
    status === "active" ? vendor.verified === true : vendor.verified === false
  );

  if (filteredVendors.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <Store className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No {status} vendors</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          {status === "pending"
            ? "There are no pending vendor applications at the moment."
            : status === "inactive"
              ? "There are no inactive vendors at the moment."
              : "There are no active vendors at the moment."}
        </p>
      </Card>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Stores</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVendors.map((vendor) => (
          <TableRow key={vendor._id.toString()}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={vendor.profile_image} alt={vendor.name} />
                  <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{vendor.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {vendor._id.toString()}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{vendor.business_type}</TableCell>
            <TableCell>
              <div className="text-sm">{vendor.email}</div>
              <div className="text-xs text-muted-foreground">{vendor.phone}</div>
            </TableCell>
            <TableCell>{vendor.storeCount}</TableCell>
            <TableCell>{dayjs(vendor.created_at).format("dddd, DD MMMM YYYY")}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : status === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {vendor.status === "pending" ? (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              ) : (
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
                      <DropdownMenuItem>View Stores</DropdownMenuItem>
                      <DropdownMenuItem>Edit Vendor</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {status === "active" ? (
                        <DropdownMenuItem onClick={() => deactive(vendor._id.toString())} className="text-red-600">Deactivate Vendor</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => activate(vendor._id.toString())} className="text-green-600">Activate Vendor</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

