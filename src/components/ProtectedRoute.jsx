import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../stores";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAppStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--grayLv3)]">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
