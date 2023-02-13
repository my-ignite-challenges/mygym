import { User } from "@contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER } from ".";

export async function saveUserDataToStorage(user: User) {
  await AsyncStorage.setItem(USER, JSON.stringify(user));
}

export async function getUserDataFromStorage() {
  const storedUserData = await AsyncStorage.getItem(USER);

  const user: User = storedUserData ? JSON.parse(storedUserData) : {};

  return user;
}

export async function removeUserDataFromStorage() {
  await AsyncStorage.removeItem(USER);
}
