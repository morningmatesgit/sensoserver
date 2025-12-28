import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginUser,
  registerUser,
  logoutUser,
  googleBackendLogin,
} from "../services/authService";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { router } from "expo-router";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { promptAsync: googlePrompt } = useGoogleLogin(
    async (idToken: string) => {
      try {
        const data = await googleBackendLogin(idToken);

        await AsyncStorage.multiSet([
          ["authToken", data.token],
          ["userData", JSON.stringify(data.data)],
        ]);

        setToken(data.token);
        setUser(data.data);
        router.replace("/dashboard/dashboard");
      } catch (err) {
        console.error("Google Login Backend Error:", err);
      }
    }
  );

  /* AUTO LOGIN */
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken");
        const savedUser = await AsyncStorage.getItem("userData");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.log("Auto-login failed:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* EMAIL LOGIN */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });

      await AsyncStorage.multiSet([
        ["authToken", data.token],
        ["userData", JSON.stringify(data.data)],
      ]);

      setToken(data.token);
      setUser(data.data);
      router.replace("/dashboard/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  /* REGISTER */
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await registerUser({ name, email, password });

      await AsyncStorage.multiSet([
        ["authToken", data.token],
        ["userData", JSON.stringify(data.data)],
      ]);

      setToken(data.token);
      setUser(data.data);
      router.replace("/dashboard/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  /* GOOGLE LOGIN */
  const googleAuth = async () => {
    setIsLoading(true);
    try {
      await googlePrompt();
    } catch (err) {
      console.error("Google Auth Prompt Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* LOGOUT */
  const logout = async () => {
    const currentToken = token;
    
    // UI immediate update for better UX
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(["authToken", "userData"]);
    
    // Redirect first
    router.replace("/auth/login");

    // Then try to notify backend
    if (currentToken) {
      try {
        await logoutUser(currentToken);
      } catch (err) {
        console.warn("Backend logout failed, but local session cleared", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        googleAuth,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
