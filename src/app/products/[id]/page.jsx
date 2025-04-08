"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isAdmin, setIsadmin] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin) {
      setIsadmin(JSON.parse(isAdmin));
    }

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
      });
      router.push("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Floating Buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link href="/products">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            ← Back to Products
          </button>
        </Link>

        {isAdmin && (
          <>
            <button
              onClick={() => router.push(`/admin/edit-product/${id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      <div className=" top-10 text-center px-6 mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Product details
        </h1>
      </div>

      {/* Product Layout */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8 flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="flex-shrink-0 w-full lg:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-h-[600px] object-contain rounded"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between w-full lg:w-1/2">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-500 mb-4">{product.category}</p>
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          </div>

          <div>
            <p className="text-2xl text-blue-600 font-bold mb-6">
              ${product.price.toFixed(2)}
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
