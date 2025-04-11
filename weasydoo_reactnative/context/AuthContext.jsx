// context/AuthContext.jsx
import { createContext, useEffect, useState, useContext } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        setIsAuthenticated(true);
        setIsAdmin(token === "my-fake-token-12345"); // change this logic as needed
      }
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync("authToken", token);
    setIsAuthenticated(true);
    setIsAdmin(token === "my-fake-token-12345");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Custom Hook (you can now use useAuth())
export const useAuth = () => useContext(AuthContext);
