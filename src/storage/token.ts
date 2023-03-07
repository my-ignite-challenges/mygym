import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from ".";

type StoredTokenData = {
  token: string;
  refresh_token: string;
};

export async function saveTokenToStorage({
  token,
  refresh_token,
}: StoredTokenData) {
  await AsyncStorage.setItem(TOKEN, JSON.stringify({ token, refresh_token }));
}

export async function getTokenFromStorage() {
  const storedTokenData = await AsyncStorage.getItem(TOKEN);

  const { token, refresh_token }: StoredTokenData = storedTokenData
    ? JSON.parse(storedTokenData)
    : {};

  return { token, refresh_token };
}

export async function removeTokenFromStorage() {
  await AsyncStorage.removeItem(TOKEN);
}
