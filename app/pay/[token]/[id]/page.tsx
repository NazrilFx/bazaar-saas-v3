"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { loadSnapScript } from "@/utils/loadSnapScript";

export default function PayPage() {
  useEffect(() => {
    loadSnapScript();
  }, []);

  const params = useParams();
  const id = params.id as string
  const token = params.token as string;
  if (!token) {
    return <div>Token tidak ditemukan</div>;
  }

  function mapMidtransStatusToAppStatus(
    transaction_status: string
  ): "pending" | "paid" | "canceled" {
    switch (transaction_status) {
      case "settlement":
      case "capture":
        return "paid";
      case "pending":
        return "pending";
      case "cancel":
      case "deny":
      case "expire":
      case "failure":
        return "canceled";
      default:
        return "pending"; // fallback default
    }
  }

  const handlePay = async () => {
    try {
      let csrfToken: string
      await fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => csrfToken = data.csrfToken);

      window.snap.pay(token, {
        onSuccess: async (result) => {
            const status = mapMidtransStatusToAppStatus(
                result.transaction_status
              );
              const updateOrderRes = await fetch("/api/order/update-status", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  status,
                  payment_method: result.payment_type,
                  csrfToken,
                }),
              });
  
              const dataUpdateOrder = await updateOrderRes.json();
  
              if (!updateOrderRes.ok) {
                console.error(
                  "telah terjadi error saat mengupdate",
                  dataUpdateOrder
                );
                console.log(dataUpdateOrder);
              } else {
                console.log("update order berhasil", dataUpdateOrder);
              }
        },
        onPending: async (result) => {
          console.log(result);
        },
        onError: async (result) => {
          console.log(result);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-4">Halaman Pembayaran</h1>
        <p className="text-gray-600">Klik token Anda:</p>
        <button onClick={handlePay}>
          <code className="bg-gray-200 text-sm p-2 rounded mt-2 inline-block">
            {token}
          </code>
        </button>
      </div>
    </div>
  );
}
