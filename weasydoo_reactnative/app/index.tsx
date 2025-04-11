// app/index.jsx
import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        router.replace("/products");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [rootNavigationState]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
