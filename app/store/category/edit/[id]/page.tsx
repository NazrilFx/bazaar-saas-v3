'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function EditCategoryPage() {
  const [csrfToken, setCsrfToken] = useState('')
  const [category, setCategory] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams();

  const id = params.id;

  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil token CSRF
        const csrfRes = await fetch("/api/csrf", {
        })
        if (!csrfRes.ok) throw new Error('Gagal ambil CSRF token')
        const dataCsrfRes = await csrfRes.json()
        setCsrfToken(dataCsrfRes.csrfToken)

        // Ambil data kategori
        const res = await fetch(`/api/category/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'csrfToken': dataCsrfRes.csrfToken,
          },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Gagal ambil data kategori')
        const { category } = await res.json()
        setCategory(category)
      } catch (err: unknown) {
        let errorMessage = "Internal Server Error";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage || 'Gagal mengambil data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form
        action={"/api/category/update"}
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="id" value={id} />
        <div>
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            required
            className="w-full p-2 border rounded-lg bg-white"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={category.description}
            required
            className="w-full p-2 border rounded-lg bg-white"
            rows={4}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Update
        </button>
      </form>
    </div>
  )
}
