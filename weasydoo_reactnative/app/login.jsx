import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("johnd");
  const [password, setPassword] = useState("m38rmF$");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const credentials = { username, password };

      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data?.token) {
        await SecureStore.setItemAsync("authToken", data.token);

        //  We're assuming johnd as an admin (that can edit, remove, or add products)
        const isAdmin = username === "johnd";
        await SecureStore.setItemAsync("role", isAdmin ? "admin" : "user");

        router.replace("/products");
      } else {
        Alert.alert("Login failed", "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}> Welcome to Sami's Shop</Text>
      <Text style={styles.title2}>
        {" "}
        Log in first to explore our store and access exclusive features!
      </Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        autoCapitalize="none"
      />
      <View>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible((prev) => !prev)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,

    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    paddingRight: 40,
    marginBottom: 10,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  title1: {
    fontSize: 40,
    textAlign: "center",
    color: "#065ca7",
    marginBottom: 20,
  },
  title2: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 40,
  },
});
