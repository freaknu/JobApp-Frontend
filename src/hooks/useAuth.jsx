import { useState, useEffect } from "react";

export const useAuth = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem("authToken");
      const storedRole = localStorage.getItem("userRole");

      if (!token) {
        setIsLoading(false);
        return;
      }
      setUserRole(storedRole || null);
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  return { userRole, isLoading };
};
