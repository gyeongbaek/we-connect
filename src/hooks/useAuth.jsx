import { createContext, useContext, useState, useEffect } from "react";
import { users, getUserByDisplayName } from "../mock/userData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 복원
    const storedUser = localStorage.getItem("weconnect_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("weconnect_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (displayName) => {
    // displayName으로 유저 찾기
    const foundUser = getUserByDisplayName(displayName);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("weconnect_user", JSON.stringify(foundUser));
      return foundUser;
    }

    // 유저를 찾지 못한 경우 에러
    throw new Error("등록되지 않은 사용자입니다.");
  };

  const loginWithDiscord = async (code) => {
    // Discord OAuth 콜백 처리 (추후 구현)
    throw new Error("Discord login not implemented yet");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("weconnect_user");
  };

  const value = {
    user,
    users, // 전체 유저 목록도 제공
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithDiscord,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
