export default async function VendorDetailsPage({ params }: {params: Promise<{id : string}>}) {

  const { id } = await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${id}`, {
    cache: "no-store", // Hindari caching untuk mendapatkan data terbaru
  });

  if (!res.ok) {
    return <p className="text-red-500">Failed to load category</p>;
  }

  const { category } = await res.json(); // ✅ Jangan lupa parse JSON

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form action={`${process.env.NEXT_PUBLIC_API_URL}/api/category/update`} method="POST" className="space-y-4">
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

