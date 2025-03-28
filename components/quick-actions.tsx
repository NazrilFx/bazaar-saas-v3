import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Search } from "lucide-react"

export function QuickActions() {
  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 mb-3">
              <QrCode className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">Scan QR</span>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-green-100 text-green-700 mb-3">
              <QrCode className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">Generate QR</span>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 mb-3">
              <CreditCard className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">Top-up</span>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 mb-3">
              <Search className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">Browse Vendors</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

