"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", username);

        const isAdmin = username === "johnd";
        localStorage.setItem("isAdmin", isAdmin);

        router.push("/products");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="absolute top-10 text-center px-6">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Welcome to Sami's Shop
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Log in first to explore our store and access exclusive features!
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
