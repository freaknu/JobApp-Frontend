import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (token && role) {
        setAuthState({
          user: { role },
          isLoading: false,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        setAuthState({
          user: null,
          isLoading: false,
        });
      }
    };
    window.addEventListener("storage", verifyAuth);

    verifyAuth();

    return () => {
      window.removeEventListener("storage", verifyAuth);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    delete axios.defaults.headers.common["Authorization"];
    setAuthState({
      user: null,
      isLoading: false,
    });
    window.dispatchEvent(new Event("storage"));
  };

  return {
    userRole: authState.user?.role,
    isLoading: authState.isLoading,
    logout,
  };
};
