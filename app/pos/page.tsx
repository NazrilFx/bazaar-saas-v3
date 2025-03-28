"use client";

import { useEffect, useState } from "react";
import { POSInterface } from "@/components/pos/pos-interface";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

const logout = async () => {
  console.log("Logout dipanggil")
  try {
    await fetch("/api/auth/logout", { method: "GET" });
    window.location.href = "/"; // Redirect ke halaman home
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default function POSPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <POSInterface name={user.name} image={user.image} />
  );
}
