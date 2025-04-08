"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.replace("/products");
    } else {
      router.replace("/login");
    }
  }, []);

  return null;
}
