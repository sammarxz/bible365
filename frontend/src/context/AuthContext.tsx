import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthResponse, LoginData, RegisterData, User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  handleGoogleCallback: () => Promise<void>;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function login(data: LoginData) {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      localStorage.setItem("token", response.data.access_token);
      // Implementar getUser após criar endpoint
      setUser({ id: 1, username: "user", email: data.email });
    } finally {
      setLoading(false);
    }
  }

  async function register(data: RegisterData) {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      await login({ email: data.email, password: data.password });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function handleGoogleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      // Implement getUser after endpoint creation
      setUser({ id: 1, username: "user", email: "" });
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get("/auth/me");
      console.log(response);
      setUser(response.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getUser,
        user,
        login,
        register,
        logout,
        handleGoogleCallback,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
