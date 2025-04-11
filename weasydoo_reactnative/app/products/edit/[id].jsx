import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function EditProductPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      setIsAuthorized(true);

      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Success", "Product updated!");
      router.push(`/products/${id}`);
    } catch (err) {
      Alert.alert("Error", "Failed to update product");
    }
  };

  if (loading || !isAuthorized) {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={product.title}
        onChangeText={(text) => setProduct({ ...product, title: text })}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={String(product.price)}
        keyboardType="numeric"
        onChangeText={(text) =>
          setProduct({ ...product, price: parseFloat(text) })
        }
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

      <Button title="Save Changes" onPress={handleSave} />
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
