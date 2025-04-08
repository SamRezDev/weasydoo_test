"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, updateProduct } from "@/lib/api";
import Link from "next/link";
export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [isAdmin, setIsadmin] = useState(null);
  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setFormData({
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        image: data.image,
      });
    };
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin) {
      setIsadmin(JSON.parse(isAdmin));
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, {
      ...formData,
      price: parseFloat(formData.price),
    });
    router.push("/products");
  };
  if (!isAdmin)
    return (
      <div className=" top-10 text-center px-6 mb-10">
        <h1 className="text-4xl font-bold text-red-600 mb-2">
          You can't edit products
        </h1>
        <Link href="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            ← Back to Products
          </button>
        </Link>
      </div>
    );
  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className=" top-10 text-center px-6 mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Product details
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="border p-2"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border p-2"
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="border p-2"
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
          className="border p-2"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border p-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
