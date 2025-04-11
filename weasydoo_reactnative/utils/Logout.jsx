import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    router.replace("/login");
  };

  return logout;
}
