import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export function AccountSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
        <CardDescription>Your current balance and event details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">USD 250.00</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> Active
              </span>
            </div>
            <Button variant="default" size="sm" className="mt-4">
              <span className="mr-2">⬆</span> Top Up Balance
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Event</h3>
            <h4 className="text-xl font-semibold">Summer Music Festival</h4>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <span className="text-sm">📅 June 15-18, 2023</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Central Park, New York</div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Link href="/transactions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View Transaction History
          </Link>
          <Link href="/events/current" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Event Details
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

