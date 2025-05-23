"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IProduct } from "@/models/Product";
import { Trash2 } from "lucide-react";
import Loading from "@/components/loading";

interface ICategory {
  _id: string;
  name: string;
}

export default function SignupPage() {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/product/${id}`); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setCategories(data.categories);
          setProduct(data.product);
          setIsOwner(data.isOwner);
        } else {
          setCategories(null);
          setProduct(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (product == null) {
      return;
    }

    setName(product.name);
    setDescription(product.description);
    setStock(product.stock);
    setPrice(product.price);
    setImageBase64(product.image);
    setCategory(product.category_id.toString())
  }, [product]);

  // useEffect(() => {
  //   console.log(category);
  // }, [category]);

  if (loading) {
    return <Loading />;
  }

  if (product == null && !loading) {
    return <div>Product not found</div>;
  }

  if (!isOwner && !loading) {
    return <div>Sorry you are not this owner of this product</div>;
  }

  if (categories == null) {
    return <div>Categories not found</div>;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();

      img.onload = () => {
        const targetWidth = 200; // Lebar final
        const targetHeight = 300; // Tinggi final

        const scale = Math.max(
          targetWidth / img.width,
          targetHeight / img.height
        );

        const newWidth = Math.round(img.width * scale);
        const newHeight = Math.round(img.height * scale);

        const offsetX = (newWidth - targetWidth) / 2; // Posisi crop di X
        const offsetY = (newHeight - targetHeight) / 2; // Posisi crop di Y

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        requestAnimationFrame(() => {
          // Resize dulu
          ctx.drawImage(img, -offsetX, -offsetY, newWidth, newHeight);

          // Konversi hasil canvas ke base64 (jpeg, kualitas 50%)
          const croppedBase64 = canvas.toDataURL("image/jpeg", 0.5);

          // Simpan hasilnya
          setImageBase64(croppedBase64);
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);

    if (price == 0) {
      setMessage("Price cannot be 0");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/product/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          description,
          price,
          stock,
          image: imageBase64,
          category_id: category,
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

      setMessage("Product update successfullty");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Link href={"/store/products"}>
          <ArrowLeft></ArrowLeft>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-4">
          Update Product {id}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>
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
            <label className="block text-gray-500">Image</label>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>
          {imageBase64 && (
            <>
              <img src={imageBase64} alt="Resized preview" />
              <button
                onClick={() => setImageBase64("")}
                className="p-3 text-red-600 bg-red-100 hover:bg-red-300 rounded-full transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-500">Price</label>
            <input
              value={price?.toString() ?? ""}
              type="number"
              onChange={(e) =>
                setPrice(e.target.value === "" ? null : Number(e.target.value))
              }
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>
          {price && (
            <div className="text-sm my-2 bg-blue-50">
              Rp {new Intl.NumberFormat("id-ID").format(price)}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-500">Stock</label>
            <input
              value={stock ?? ""}
              type="number"
              onChange={(e) =>
                setStock(e.target.value === "" ? null : Number(e.target.value))
              }
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-500">Select Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
