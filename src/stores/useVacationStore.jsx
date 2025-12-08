import { createContext, useContext, useState, useCallback } from "react";

const VacationContext = createContext(null);

export function VacationProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const openModal = useCallback((period = null) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPeriod(null);
  }, []);

  const value = {
    isModalOpen,
    selectedPeriod,
    openModal,
    closeModal,
  };

  return (
    <VacationContext.Provider value={value}>
      {children}
    </VacationContext.Provider>
  );
}

export function useVacationStore() {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error("useVacationStore must be used within VacationProvider");
  }
  return context;
}
