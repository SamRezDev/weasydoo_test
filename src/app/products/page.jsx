"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Inside the component:
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCategoryChange = (event) => setCategoryFilter(event.target.value);
  const handlePriceChange = (event) => setPriceFilter(event.target.value);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;
    const matchesPrice = priceFilter
      ? product.price <= parseFloat(priceFilter)
      : true;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className=" top-10 text-center px-6 mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Products</h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Browse our extensive catalog, or use our filters to help you find what
          you need.
        </p>
      </div>
      <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
          Filter Products
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Max Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-40 focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition h-[400px] flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                  {product.category}
                </p>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2 flex-grow overflow-hidden">
                  {product.description}
                </p>
                <p className="text-blue-600 font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          router.push("/login");
        }}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
