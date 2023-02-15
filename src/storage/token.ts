import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from ".";

export async function saveTokenToStorage(token: string) {
  await AsyncStorage.setItem(TOKEN, token);
}

export async function getTokenFromStorage() {
  const token = await AsyncStorage.getItem(TOKEN);

  return token;
}

export async function removeTokenFromStorage() {
  await AsyncStorage.removeItem(TOKEN);
}
