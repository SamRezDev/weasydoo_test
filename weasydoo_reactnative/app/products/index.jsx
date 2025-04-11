import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useLogout } from "../../utils/Logout";

export default function ProductsPage() {
  const router = useRouter();
  const logout = useLogout();

  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);

        // extract unique categories
        const uniqueCats = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("role");
      if (!token) {
        router.replace("/login");
        return;
      }
      if (role === "admin") setIsAdmin(true);
    };

    checkAuth();
    fetchProducts();
  }, []);

  const applyFilters = (text, selectedCategory, priceLimit) => {
    let filteredList = products;

    if (text) {
      filteredList = filteredList.filter((p) =>
        p.title.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredList = filteredList.filter(
        (p) => p.category === selectedCategory
      );
    }

    if (priceLimit) {
      const limit = parseFloat(priceLimit);
      if (!isNaN(limit)) {
        filteredList = filteredList.filter((p) => p.price <= limit);
      }
    }

    setFiltered(filteredList);
  };

  useEffect(() => {
    applyFilters(search, category, maxPrice);
  }, [search, category, maxPrice]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 3,
          borderRadius: 6,
          bottom: 1,
        }}
      >
        <TouchableOpacity
          style={styles.logoutButton}
          title="Logout"
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {isAdmin && (
          <View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/products/add")}
            >
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.filterBar}>
        <View style={styles.rowInputs}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
            style={[styles.input, { marginRight: 8 }]}
          />
          <TextInput
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder="Max Price"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Category:</Text>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="All" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "yellow",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  filterBar: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  pickerLabel: {
    textAlign: "center",
    fontWeight: "bold",
    flex: 0.25,
    marginBottom: 4,
  },

  picker: {
    flex: 0.75,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "red",

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
