import { createContext, useContext, useState, useCallback } from "react";

const VacationContext = createContext(null);

export function VacationProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  // 등록된 휴가 일정: { [date]: { type, timeType, vacationType } }
  // timeType: 'MORNING', 'AFTERNOON', 'FULL'
  const [registeredVacations, setRegisteredVacations] = useState({});

  const openModal = useCallback((period = null) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPeriod(null);
  }, []);

  // 휴가 등록
  const registerVacation = useCallback((vacationData) => {
    const { startDate, endDate, type, timeType } = vacationData;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const newVacations = { ...registeredVacations };

    // 시작일부터 종료일까지 등록
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      // 주말 제외
      if (day !== 0 && day !== 6) {
        const dateStr = current.toISOString().split("T")[0];
        newVacations[dateStr] = {
          vacationType: type,
          timeType,
          registeredAt: new Date().toISOString(),
        };
      }
      current.setDate(current.getDate() + 1);
    }

    setRegisteredVacations(newVacations);
  }, [registeredVacations]);

  // 특정 날짜의 휴가 정보 조회
  const getVacationForDate = useCallback((date) => {
    return registeredVacations[date] || null;
  }, [registeredVacations]);

  // 특정 월의 휴가 목록 조회
  const getVacationsForMonth = useCallback((year, month) => {
    const vacations = [];
    Object.entries(registeredVacations).forEach(([date, vacation]) => {
      const d = new Date(date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        vacations.push({ date, ...vacation });
      }
    });
    return vacations.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [registeredVacations]);

  // 휴가 삭제
  const removeVacation = useCallback((date) => {
    const newVacations = { ...registeredVacations };
    delete newVacations[date];
    setRegisteredVacations(newVacations);
  }, [registeredVacations]);

  // 사용한 휴가 시간 계산 (8시간 = 1일)
  const getUsedVacationHours = useCallback((vacationType = null) => {
    let totalHours = 0;
    Object.values(registeredVacations).forEach((vacation) => {
      if (vacationType && vacation.vacationType !== vacationType) return;

      if (vacation.timeType === "FULL") {
        totalHours += 8;
      } else {
        totalHours += 4; // MORNING or AFTERNOON
      }
    });
    return totalHours;
  }, [registeredVacations]);

  const value = {
    isModalOpen,
    selectedPeriod,
    registeredVacations,
    openModal,
    closeModal,
    registerVacation,
    getVacationForDate,
    getVacationsForMonth,
    removeVacation,
    getUsedVacationHours,
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
