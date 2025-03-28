"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface POSPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  onPaymentComplete: () => void
}

export function POSPaymentModal({ isOpen, onClose, total, onPaymentComplete }: POSPaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")

  // Simulate payment processing
  const processPayment = () => {
    setPaymentStatus("pending")

    setTimeout(() => {
      setPaymentStatus("success")

      // Reset after showing success message
      setTimeout(() => {
        onPaymentComplete()
        setPaymentStatus("pending")
      }, 2000)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>Complete your purchase using QRIS payment</DialogDescription>
        </DialogHeader>

        {paymentStatus === "pending" ? (
          <>
            <Tabs defaultValue="qris" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="qris">QRIS Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="qris" className="mt-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-lg border mb-4">
                    <div className="relative w-[200px] h-[200px]">
                      <Image
                        src="/placeholder.svg?height=200&width=200&text=QRIS+Code"
                        alt="QRIS Code"
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-pos-primary opacity-50" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <p className="font-bold text-xl">${total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Scan the QR code with your payment app</p>
                  </div>

                  {/* For demo purposes, we'll add a button to simulate payment */}
                  <Button className="w-full bg-pos-primary hover:bg-pos-secondary text-white" onClick={processPayment}>
                    Simulate Payment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium">Payment Successful!</h3>
            <p className="text-center text-muted-foreground mt-2 mb-6">
              Your payment of ${total.toFixed(2)} has been processed successfully.
            </p>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={onPaymentComplete}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

