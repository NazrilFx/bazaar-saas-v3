import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

// Snap API Midtrans instance
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Hitung order_number otomatis

    if (!body.orderNumber) {
      return NextResponse.json({ error: "Butuh order id" }, { status: 404 });
    }
    
    const parameter = {
      transaction_details: {
        order_id: body.orderNumber,
        gross_amount: body.amount, // total semua item
      },
      item_details: [
        {
          id: 'tax',
          name: 'Pajak 10%',
          quantity: 1,
          price: body.tax
        },
        ...body.items
      ],
      customer_details: {
        first_name: body.name,
        email: body.email,
        phone: body.phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    return NextResponse.json({ token: transactionToken });
  } catch (err) {
    console.error("Midtrans error:", err);
    return NextResponse.json({ error: "Failed to create transaction", message: err }, { status: 500 });
  }
}
