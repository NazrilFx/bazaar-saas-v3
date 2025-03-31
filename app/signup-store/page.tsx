"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IVendor } from "@/models/Vendor";

export default function SignupPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth-vendor/me"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setVendor(data.vendor);
        } else {
          setVendor(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser();
  }, []);

  if (vendor == null) {
    return <div>Sorry you don&apos;t allow to access this page</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth-store/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          vendor_id: vendor._id,
          description,
          location,
          password,
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

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setMessage("Signup successful! You can now login.");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      setMessage(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
      router.push("/login-store");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create a store account
        </h2>
        <p className="my-5 text-center">
          Made by Vendor <span className="text-blue-500">{vendor.name}</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500">Name Store</label>
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
          <div className="mb-4">
            <label className="block text-gray-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>
          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            onClick={handleSubmit}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
