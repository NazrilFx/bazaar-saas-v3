import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { orders } = await req.json()

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ message: "Data orders tidak valid" }, { status: 400 })
    }

    // Bersihkan ObjectId jadi string
    const cleanOrders = orders.map((order: any) => {
      const cleanOrder = {
        ...order,
        _id: order._id?.toString?.() || order._id,
        items: Array.isArray(order.items)
          ? order.items.map((item: any) => ({
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
      ...cleanOrders.map((order: any) =>
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
  } catch (error) {
    console.error("Error export csv:", error)
    return NextResponse.json({ message: "Gagal export CSV" }, { status: 500 })
  }
}
