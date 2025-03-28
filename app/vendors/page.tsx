import { Header } from "@/components/header"
import { VendorsList } from "@/components/vendors-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function VendorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Vendors" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Vendors</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Vendor
          </Button>
        </div>
        <VendorsList />
      </div>
    </div>
  )
}

