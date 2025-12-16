"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { authService } from "@/lib/services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    // Listen for auth changes
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    // Check if identifier is email or username
    const isEmail = identifier.includes("@");
    const credentials = isEmail
      ? { email: identifier, username: undefined, password }
      : { email: undefined, username: identifier, password };

    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/");
  };

  const isAuthenticated = authService.isAuthenticated();

  return { user, loading, login, logout, isAuthenticated };
}
