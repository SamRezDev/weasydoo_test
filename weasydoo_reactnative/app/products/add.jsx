import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function AddProductPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAddProduct = async () => {
    if (
      !product.title ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.image
    ) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //id: parseInt(Random.id()),
          title: product.title,
          price: parseFloat(product.price),
          description: product.description,
          image: product.image,
          category: product.category,
        }),
      });

      Alert.alert("Product added!");
      router.push(`/products`);
    } catch (err) {
      Alert.alert("Error", "Failed to add product");
    }
  };

  if (loading || !isAuthorized) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.labelTitle}>Add a product here !</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={product.title}
        onChangeText={(text) => setProduct({ ...product, title: text })}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={product.price}
        keyboardType="numeric"
        onChangeText={(text) => setProduct({ ...product, price: text })}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={product.description}
        onChangeText={(text) => setProduct({ ...product, description: text })}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={product.category}
        onChangeText={(text) => setProduct({ ...product, category: text })}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={product.image}
        onChangeText={(text) => setProduct({ ...product, image: text })}
      />

      <Button title="Add Product" onPress={handleAddProduct} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    fontSize: 16,
  },
});
