import { api } from "@services/api";
import {
  getTokenFromStorage,
  removeTokenFromStorage,
  saveTokenToStorage,
} from "@storage/token";
import {
  getUserDataFromStorage,
  removeUserDataFromStorage,
  saveUserDataToStorage,
} from "@storage/user";
import { createContext, ReactNode, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  token?: string;
};

export type AuthContextData = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isStoredUserDataLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isStoredUserDataLoading, setIsStoredUserDataLoading] = useState(false);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        setUser(data.user);
        saveUserDataToStorage(data.user);
        saveTokenToStorage(data.token);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsStoredUserDataLoading(true);
      const loggedUser = await getUserDataFromStorage();

      const token = await getTokenFromStorage();

      if (token && loggedUser) {
        setUser({ ...loggedUser, token } as User);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsStoredUserDataLoading(false);
    }
  }

  async function signOut() {
    try {
      setUser({} as User);
      await removeUserDataFromStorage();
      await removeTokenFromStorage();
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isStoredUserDataLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
