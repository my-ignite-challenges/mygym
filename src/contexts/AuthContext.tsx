import { api } from "@services/api";
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

      if (data.user) {
        setUser(data.user);
        saveUserDataToStorage(data.user);
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

      if (loggedUser) {
        setUser(loggedUser);
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
