"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search } from "lucide-react"

type TransactionStatus = "completed" | "pending" | "failed"
type TransactionType = "Payment" | "Topup" | "Refund"

interface Transaction {
  id: string
  date: string
  time: string
  vendor: string
  amount: number
  type: TransactionType
  status: TransactionStatus
}

const transactions: Transaction[] = [
  {
    id: "tx-001",
    date: "Jun 15, 2023",
    time: "02:30 PM",
    vendor: "Food Truck Delights",
    amount: -12.5,
    type: "Payment",
    status: "completed",
  },
  {
    id: "tx-002",
    date: "Jun 15, 2023",
    time: "04:45 PM",
    vendor: "Craft Beer Stand",
    amount: -8.75,
    type: "Payment",
    status: "completed",
  },
  {
    id: "tx-003",
    date: "Jun 16, 2023",
    time: "10:15 AM",
    vendor: "Account Top-up",
    amount: 50.0,
    type: "Topup",
    status: "completed",
  },
  {
    id: "tx-004",
    date: "Jun 16, 2023",
    time: "01:20 PM",
    vendor: "Souvenir Shop",
    amount: -25.99,
    type: "Payment",
    status: "pending",
  },
  {
    id: "tx-005",
    date: "Jun 17, 2023",
    time: "11:05 AM",
    vendor: "Ticket Refund",
    amount: 15.0,
    type: "Refund",
    status: "completed",
  },
]

export function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.date}, {transaction.time}
                </TableCell>
                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                <TableCell>{transaction.vendor}</TableCell>
                <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      transaction.status === "completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : transaction.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

