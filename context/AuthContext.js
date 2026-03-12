"use client";

import { create } from "zustand";
import { authInitialState } from "./auth/initialState";
import { createAuthActions } from "./auth/authActions";
import axios from "axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  ...authInitialState,
  ...createAuthActions(set, get),
}));

export default useAuthStore;

// Live Editor React Context (for backward compatibility)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  setTokenGetter,
  clearTokenGetter,
} from "@/lib/axiosTokenRegistry";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // Register token getter for axiosInstance so it can attach Authorization without importing AuthContext
  useEffect(() => {
    setTokenGetter(
      () => useAuthStore.getState().userData?.token ?? null,
    );
    return () => clearTokenGetter();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/login`, {
        email,
        password,
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}

      toast.success("تم تسجيل الدخول بنجاح!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username,
    websiteName,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/register`, {
        username,
        websiteName,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل التسجيل";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = useCallback(async (username, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `/api/users/fetchUsername`,
        { username },
        { signal: options.signal },
      );
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.message || "فشل تحميل البيانات");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/users/logout`);
    } catch {
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      try {
        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } catch {}
      setLoading(false);
    }
  };

  const toggleImage = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.put(`/api/images/toggle-image`, {
        username: user.username,
      });
      const updatedUser = { ...user, imageToggle: response.data.imageToggle };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        toggleImage,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
