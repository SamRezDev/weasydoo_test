"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, deleteProduct } from "@/lib/api";

export default function DeleteProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
    };

    if (id) loadProduct();
  }, [id]);

  const handleDelete = async () => {
    await deleteProduct(id);
    router.push("/products");
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className=" top-10 text-center px-6 mb-10">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Delete product</h1>
      </div>

      <p className="mb-6">
        Are you sure you want to delete <strong>{product.title}</strong>?
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => router.push("/products")}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
