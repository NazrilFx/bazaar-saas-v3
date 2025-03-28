import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminRevenueChart } from "@/components/admin/revenue-chart"
import { AdminVendorPerformance } from "@/components/admin/vendor-performance"
import { AdminEventPerformance } from "@/components/admin/event-performance"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">System-wide performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>System-wide revenue trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRevenueChart />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with the highest revenue and transaction volume</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminVendorPerformance />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Revenue and participation metrics by event</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminEventPerformance />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Comprehensive performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Detailed revenue analytics will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="vendors">
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Vendor performance analytics will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="events">
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Event performance analytics will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="transactions">
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Transaction analytics will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

