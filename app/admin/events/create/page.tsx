"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IAdmin } from "@/models/Admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SimpleUser {
  _id: string;
  name: string;
}

export default function SignupPage() {
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [selectedStoresIds, setSelectedStoresIds] = useState<string[]>([]);
  const [vendors, setVendors] = useState<SimpleUser[]>([]);
  const [stores, setStores] = useState<SimpleUser[]>([]);
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/admin/vendors-stores"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setAdmin(data.admin);
          setVendors(data.vendors);
          setStores(data.stores);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser();
  }, []);

  if (admin == null) {
    return <div>Sorry you don&apos;t allow to access this page</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);

    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          selectedVendorIds,
          selectedStoresIds,
          created_by: admin.name,
          admin_id: admin._id,
          startDate,
          endDate,
          location,
          csrfToken,
        }),
        redirect: "manual",
      });

      // Cek apakah response adalah JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Create failed");

      setMessage("New Event has been made");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      console.error("Create error :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Link href={"/admin/events"}>
          <ArrowLeft></ArrowLeft>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-4">
          Create a new Bazaar Event
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500">Event Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-500 mb-1">Select Vendors</label>
            <div className="border rounded-lg px-3 py-2 bg-white max-h-60 overflow-y-auto space-y-2">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={vendor._id}
                    value={vendor._id}
                    checked={selectedVendorIds.includes(vendor._id)}
                    onChange={() => {
                      setSelectedVendorIds((prev) =>
                        prev.includes(vendor._id)
                          ? prev.filter((id) => id !== vendor._id)
                          : [...prev, vendor._id]
                      );
                    }}
                  />
                  <label htmlFor={vendor._id} className="text-sm text-gray-700">
                    {vendor.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 mb-1">Select Stores</label>
            <div className="border rounded-lg px-3 py-2 bg-white max-h-60 overflow-y-auto space-y-2">
              {stores.map((store) => (
                <div key={store._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={store._id}
                    value={store._id}
                    checked={selectedStoresIds.includes(store._id)}
                    onChange={() => {
                      setSelectedStoresIds((prev) =>
                        prev.includes(store._id)
                          ? prev.filter((id) => id !== store._id)
                          : [...prev, store._id]
                      );
                    }}
                  />
                  <label htmlFor={store._id} className="text-sm text-gray-700">
                    {store.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-500">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>

          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
