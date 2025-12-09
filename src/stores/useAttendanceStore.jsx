import { createContext, useContext, useState, useCallback } from "react";

const AttendanceContext = createContext(null);

const STANDARD_HOURS = 8;

// 날짜 범위 계산 (주말 제외)
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const day = current.getDay();
    // 주말(0=일요일, 6=토요일) 제외
    if (day !== 0 && day !== 6) {
      dates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// 날짜 포맷 (M/D 형식)
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 근무 시간 계산 (휴가 제외한 실제 근무 시간)
export const calculateWorkHours = (
  morningLocation,
  afternoonLocation,
  startTime,
  endTime,
  lunchStart,
  lunchEnd
) => {
  const morningHours = lunchStart - startTime;
  const afternoonHours = endTime - lunchEnd;

  let total = 0;

  if (morningLocation !== "휴가") {
    total += morningHours;
  }

  if (afternoonLocation !== "휴가") {
    total += afternoonHours;
  }

  return total;
};

// 휴가 시간 계산
export const calculateVacationHours = (
  morningLocation,
  afternoonLocation,
  startTime,
  endTime,
  lunchStart,
  lunchEnd
) => {
  const morningHours = lunchStart - startTime;
  const afternoonHours = endTime - lunchEnd;

  let total = 0;

  if (morningLocation === "휴가") {
    total += morningHours;
  }

  if (afternoonLocation === "휴가") {
    total += afternoonHours;
  }

  return total;
};

// 추가 근무 시간 계산 (근무시간 - 8시간 + 휴가시간)
export const calculateOvertimeHours = (
  morningLocation,
  afternoonLocation,
  startTime,
  endTime,
  lunchStart,
  lunchEnd
) => {
  const workHours = calculateWorkHours(
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd
  );
  const vacationHours = calculateVacationHours(
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd
  );

  return workHours - STANDARD_HOURS + vacationHours;
};

// 12월의 오늘 이전 날짜에 대한 기본 근무 기록 생성
const generateDefaultDecemberAttendance = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (11 = 12월)
  const today = now.getDate();

  // 현재 12월인 경우에만 생성
  if (month !== 11) return {};

  const records = {};
  for (let day = 1; day < today; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // 주말 제외 (0=일, 6=토)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = date.toISOString().split("T")[0];
    records[dateStr] = {
      morningLocation: "재택",
      afternoonLocation: "재택",
      startTime: 9,
      endTime: 18,
      lunchStart: 12,
      lunchEnd: 13,
      morningVacationType: null,
      afternoonVacationType: null,
      registeredAt: new Date(year, month, day, 18, 0).toISOString(),
    };
  }

  return records;
};

export function AttendanceProvider({ children }) {
  const today = new Date().toISOString().split("T")[0];

  const [morningLocation, setMorningLocation] = useState("재택");
  const [afternoonLocation, setAfternoonLocation] = useState("재택");
  const [startTime, setStartTime] = useState(9);
  const [endTime, setEndTime] = useState(18);
  const [lunchStart, setLunchStart] = useState(12);
  const [lunchEnd, setLunchEnd] = useState(13);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [workSchedule, setWorkSchedule] = useState({});
  const [registeredAttendance, setRegisteredAttendance] = useState(generateDefaultDecemberAttendance());
  const [morningVacationType, setMorningVacationType] = useState(null);
  const [afternoonVacationType, setAfternoonVacationType] = useState(null);

  const updateDaySchedule = useCallback((date, period, location) => {
    setWorkSchedule((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        morning: prev[date]?.morning || "재택",
        afternoon: prev[date]?.afternoon || "재택",
        [period]: location,
      },
    }));
  }, []);

  const handleDateChange = useCallback(
    (newStartDate, newEndDate) => {
      const dateRange = getDateRange(newStartDate, newEndDate);
      const newSchedule = {};

      dateRange.forEach((date) => {
        newSchedule[date] = workSchedule[date] || {
          morning: morningLocation,
          afternoon: afternoonLocation,
        };
      });

      setWorkSchedule(newSchedule);
    },
    [morningLocation, afternoonLocation, workSchedule]
  );

  const handleChangeAll = useCallback((start, end, lunchS, lunchE) => {
    setStartTime(start);
    setEndTime(end);
    setLunchStart(lunchS);
    setLunchEnd(lunchE);
  }, []);

  const registerAttendance = useCallback(() => {
    const dateRange = getDateRange(startDate, endDate);
    const newRegistrations = {};

    dateRange.forEach((date) => {
      const schedule = workSchedule[date] || {
        morning: morningLocation,
        afternoon: afternoonLocation,
      };

      newRegistrations[date] = {
        morningLocation: schedule.morning,
        afternoonLocation: schedule.afternoon,
        startTime,
        endTime,
        lunchStart,
        lunchEnd,
        morningVacationType: schedule.morning === "휴가" ? morningVacationType : null,
        afternoonVacationType: schedule.afternoon === "휴가" ? afternoonVacationType : null,
        registeredAt: new Date().toISOString(),
      };
    });

    setRegisteredAttendance((prev) => ({
      ...prev,
      ...newRegistrations,
    }));
  }, [
    startDate,
    endDate,
    workSchedule,
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd,
    morningVacationType,
    afternoonVacationType,
  ]);

  // 특정 날짜의 근무 기록 수정
  const updateAttendance = useCallback((date, data) => {
    setRegisteredAttendance((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // 특정 날짜의 근무 기록 삭제
  const deleteAttendance = useCallback((date) => {
    setRegisteredAttendance((prev) => {
      const newState = { ...prev };
      delete newState[date];
      return newState;
    });
  }, []);

  const value = {
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd,
    startDate,
    endDate,
    workSchedule,
    registeredAttendance,
    morningVacationType,
    afternoonVacationType,
    setMorningLocation,
    setAfternoonLocation,
    setStartTime,
    setEndTime,
    setLunchStart,
    setLunchEnd,
    setStartDate,
    setEndDate,
    setMorningVacationType,
    setAfternoonVacationType,
    updateDaySchedule,
    handleDateChange,
    handleChangeAll,
    registerAttendance,
    updateAttendance,
    deleteAttendance,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendanceStore() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendanceStore must be used within AttendanceProvider");
  }
  return context;
}
