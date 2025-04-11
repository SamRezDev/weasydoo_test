import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("role");
      if (!token) {
        router.replace("/login");
        return;
      }
      if (role === "admin") setIsAdmin(true);

      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`https://fakestoreapi.com/products/${id}`, {
              method: "DELETE",
            });
            Alert.alert("Deleted!");
            router.push("/products");
          } catch (err) {
            Alert.alert("Error deleting product");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      {isAdmin && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            title="Delete"
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            title="Edit"
            onPress={() => router.push(`/products/edit/${id}`)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  category: {
    fontSize: 16,
    color: "gray",
    marginVertical: 4,
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  price: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 60,
    gap: 12,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  editButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
