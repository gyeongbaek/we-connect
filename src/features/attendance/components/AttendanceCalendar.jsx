import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function AttendanceCalendar({ records, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getRecordForDate = (date) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return records.find((r) => r.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === date
    );
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const getDateStatus = (date) => {
    if (!date) return null;
    const record = getRecordForDate(date);
    if (!record) return null;

    const hasVacation = record.sessions?.some(
      (s) => s.location === "VACATION"
    );
    if (hasVacation) return "vacation";

    return "work";
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-16 text-semibold">
            {year}년 {month + 1}월
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, idx) => (
          <div
            key={day}
            className={`text-center text-12 py-1 ${
              idx === 0
                ? "text-[var(--error)]"
                : idx === 6
                  ? "text-[var(--primary)]"
                  : "text-[var(--grayLv3)]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const status = getDateStatus(date);
          const record = date ? getRecordForDate(date) : null;

          const isSelected = selectedDate === date;

          return (
            <button
              key={idx}
              onClick={() => {
                if (date) {
                  setSelectedDate(date);
                  onDateSelect?.(date, record);
                }
              }}
              disabled={!date}
              className={`
                h-16 p-1.5 rounded-lg relative transition-colors flex flex-col items-start
                ${!date ? "invisible" : ""}
                ${isSelected ? "ring-2 ring-[var(--primary)] bg-[var(--primary)]/20" : ""}
                ${!isSelected && isToday(date) ? "ring-2 ring-[var(--primary)]/50" : ""}
                ${date && !isSelected ? "hover:bg-[var(--grayLv1)] cursor-pointer" : ""}
                ${date && isSelected ? "cursor-pointer" : ""}
              `}
            >
              {date && (
                <>
                  <span
                    className={`text-12 font-medium ${
                      isSelected
                        ? "text-[var(--primary)]"
                        : idx % 7 === 0
                          ? "text-[var(--error)]"
                          : idx % 7 === 6
                            ? "text-[var(--primary)]"
                            : "text-slate-700"
                    }`}
                  >
                    {date}
                  </span>
                  {status === "vacation" && (
                    <span className="absolute bottom-1 right-1.5 text-blue-300 text-sm font-bold">
                      *
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
