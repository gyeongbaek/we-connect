import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserByDisplayName } from "../mock/userData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("weconnect_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("weconnect_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (displayName) => {
    const foundUser = getUserByDisplayName(displayName);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("weconnect_user", JSON.stringify(foundUser));
      return foundUser;
    }
    throw new Error("등록되지 않은 사용자입니다.");
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("weconnect_user");
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
