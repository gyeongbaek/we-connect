import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    sidebarOpen,
    setSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
    openMobileSidebar,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIStore() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIStore must be used within a UIProvider");
  }
  return context;
}
