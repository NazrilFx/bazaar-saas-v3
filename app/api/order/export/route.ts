import { NextResponse } from "next/server"
import { IOrder, IOrderItem } from "@/models/Order"

// export interface CleanIOrderItem {
//     product_id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     subtotal: number;
// }

// export interface CleanIOrder extends Document {
//     store_id: string; // Referensi ke store
//     midtrans_token: string
//     customer_name: string;
//     customer_email: string;
//     order_number: number;
//     status: "pending" | "paid" | "cancelled";
//     items: CleanIOrderItem[];
//     total_amount: number;
//     tax_amount: number;
//     payment_method: string,
//     created_at: Date;
//     updated_at: Date
// }


export async function POST(req: Request) {
  try {
    const { orders } = await req.json()

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ message: "Data orders tidak valid" }, { status: 400 })
    }

    // Bersihkan ObjectId jadi string
    const cleanOrders = orders.map((order: IOrder) => {
      const cleanOrder = {
        ...order,
        _id: order._id?.toString?.() || order._id,
        items: Array.isArray(order.items)
          ? order.items.map((item: IOrderItem) => ({
              ...item,
              product_id: item.product_id?.toString?.() || item.product_id
            }))
          : order.items
      }

      return cleanOrder
    })

    const headers = Object.keys(cleanOrders[0])
    const csvRows = [
      headers.join(","),
      ...cleanOrders.map((order: Record<string, any>) =>
        headers.map((key) => {
          const cell = order[key]
          const val = typeof cell === "object" ? JSON.stringify(cell) : cell
          return `"${String(val).replace(/"/g, '""')}"`
        }).join(",")
      )
    ]

    const csvContent = csvRows.join("\n")

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${Date.now()}.csv"`,
      },
    })
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
    console.error("Error export csv:", errorMessage)
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
