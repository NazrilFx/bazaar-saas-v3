"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search } from "lucide-react"

interface Transaction {
  id: string
  date: string
  time: string
  customer: string
  amount: number
  items: number
  status: "completed" | "pending" | "failed"
}

const transactions: Transaction[] = [
  {
    id: "tx-001",
    date: "Jun 15, 2023",
    time: "02:30 PM",
    customer: "Customer #1204",
    amount: 12.5,
    items: 1,
    status: "completed",
  },
  {
    id: "tx-002",
    date: "Jun 15, 2023",
    time: "03:15 PM",
    customer: "Customer #1532",
    amount: 21.25,
    items: 2,
    status: "completed",
  },
  {
    id: "tx-003",
    date: "Jun 16, 2023",
    time: "11:45 AM",
    customer: "Customer #1876",
    amount: 8.75,
    items: 1,
    status: "completed",
  },
  {
    id: "tx-004",
    date: "Jun 16, 2023",
    time: "01:20 PM",
    customer: "Customer #2104",
    amount: 25.99,
    items: 3,
    status: "pending",
  },
  {
    id: "tx-005",
    date: "Jun 17, 2023",
    time: "10:05 AM",
    customer: "Customer #1345",
    amount: 15.0,
    items: 1,
    status: "failed",
  },
]

interface VendorProductsProps {
  vendorId: string;
}

export function VendorTransactions({ vendorId }: VendorProductsProps) {  
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.date}, {transaction.time}, {vendorId}
                </TableCell>
                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.items}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
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

