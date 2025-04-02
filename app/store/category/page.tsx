"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch categories");

        setCategories(data.categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
  
    try {
      const res = await fetch("/api/category/delete", {
        method: "POST",  // Gunakan POST karena kita kirim body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Kirim ID di dalam body
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete category");
  
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };
  
  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category List</h1>
      <Link href="category/create">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Add New Category
        </button>
      </Link>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border">
              <td className="border p-2">{category.name}</td>
              <td className="border p-2">{category.description}</td>
              <td className="border p-2 flex space-x-2">
                <Link href={`category/edit/${category._id}`}>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
