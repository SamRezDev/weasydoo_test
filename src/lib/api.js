const API_BASE = "https://fakestoreapi.com/products";

export const fetchAllProducts = async () => {
  const res = await fetch(API_BASE);
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
