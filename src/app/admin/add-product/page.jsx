"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct({ ...formData, price: parseFloat(formData.price) });
    router.push("/products");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
