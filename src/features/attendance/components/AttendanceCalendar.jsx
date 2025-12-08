import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Building2, MapPin, Palmtree } from "lucide-react";
import { Button } from "../../../components/ui/button";

const LOCATION_ICONS = {
  REMOTE: { icon: Home, label: "재택" },
  ARA: { icon: Building2, label: "아라" },
  YUKJI: { icon: MapPin, label: "육지" },
  OFFICE: { icon: Building2, label: "사무실" },
  VACATION: { icon: Palmtree, label: "휴가" },
};

const STANDARD_HOURS = 8;
const STANDARD_MONTHLY_HOURS = 22 * STANDARD_HOURS; // 월 22일 기준

export function AttendanceCalendar({ records, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // 현재 월의 기록만 필터링
  const currentMonthRecords = records.filter((r) => {
    const d = new Date(r.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // 최근 5개 기록
  const recentRecords = currentMonthRecords
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // 월간 통계
  const totalHours = currentMonthRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
  const overtimeHours = totalHours - STANDARD_MONTHLY_HOURS;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return {
      display: `${date.getMonth() + 1}/${String(date.getDate()).padStart(2, "0")}`,
      day: days[date.getDay()],
    };
  };

  const renderTimeBar = (sessions) => {
    const startHour = 6;
    const totalHours = 16;

    return (
      <div className="flex-1 h-3 bg-[var(--grayLv1)] rounded relative overflow-hidden">
        {sessions.map((session, idx) => {
          const start = parseInt(session.startTime.split(":")[0]);
          const end = parseInt(session.endTime.split(":")[0]);
          const left = ((start - startHour) / totalHours) * 100;
          const width = ((end - start) / totalHours) * 100;

          const isVacation = session.location === "VACATION";

          return (
            <div
              key={idx}
              className={`absolute h-full ${isVacation ? "bg-[var(--activation)]" : "bg-[var(--primary)]"}`}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
        <div className="flex items-center gap-3 text-12">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            근무
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--activation)]" />
            휴가
          </span>
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

          return (
            <button
              key={idx}
              onClick={() => date && onDateSelect?.(date, record)}
              disabled={!date}
              className={`
                aspect-square p-1 rounded-lg text-center relative transition-colors
                ${!date ? "invisible" : ""}
                ${isToday(date) ? "ring-2 ring-[var(--primary)]" : ""}
                ${status === "work" ? "bg-[var(--primary)]/10" : ""}
                ${status === "vacation" ? "bg-[var(--activation)]" : ""}
                ${date ? "hover:bg-[var(--grayLv1)] cursor-pointer" : ""}
              `}
            >
              {date && (
                <>
                  <span
                    className={`text-12 ${
                      idx % 7 === 0
                        ? "text-[var(--error)]"
                        : idx % 7 === 6
                          ? "text-[var(--primary)]"
                          : ""
                    }`}
                  >
                    {date}
                  </span>
                  {record && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <span className="text-8 text-[var(--grayLv3)]">
                        {record.totalHours}h
                      </span>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Monthly Summary */}
      <div className="mt-4 pt-4 border-t border-[var(--grayLv2)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-14 text-semibold">이번 달 요약</span>
          <div className="flex items-center gap-2">
            <span className="text-12 text-[var(--grayLv3)]">
              {totalHours}h / {STANDARD_MONTHLY_HOURS}h
            </span>
            {overtimeHours !== 0 && (
              <span
                className={`text-12 px-1.5 py-0.5 rounded ${
                  overtimeHours > 0
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "bg-[var(--error)]/10 text-[var(--error)]"
                }`}
              >
                {overtimeHours > 0 ? "+" : ""}{overtimeHours}h
              </span>
            )}
          </div>
        </div>

        {/* Recent Records */}
        <div className="space-y-2">
          {recentRecords.length === 0 ? (
            <p className="text-center text-[var(--grayLv3)] text-12 py-4">
              이번 달 근무 기록이 없습니다.
            </p>
          ) : (
            recentRecords.map((record) => {
              const { display, day } = formatDate(record.date);
              const LocationIcon =
                LOCATION_ICONS[record.sessions[0]?.location]?.icon || Home;
              const dailyOvertime = record.totalHours - STANDARD_HOURS;

              return (
                <div
                  key={record.id}
                  className="flex items-center gap-2 py-1.5 border-b border-[var(--grayLv1)] last:border-0"
                >
                  <div className="w-14">
                    <div className="text-12 text-semibold">{display}</div>
                    <div className="text-10 text-[var(--grayLv3)]">{day}</div>
                  </div>
                  {renderTimeBar(record.sessions)}
                  <LocationIcon className="h-3 w-3 text-[var(--grayLv3)]" />
                  <div className="w-16 text-right flex items-center justify-end gap-1">
                    <span className="text-12">{record.totalHours}h</span>
                    {dailyOvertime !== 0 && (
                      <span
                        className={`text-10 ${
                          dailyOvertime > 0 ? "text-[var(--primary)]" : "text-[var(--error)]"
                        }`}
                      >
                        ({dailyOvertime > 0 ? "+" : ""}{dailyOvertime})
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {currentMonthRecords.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full mt-2 text-[var(--primary)] text-12">
            전체 {currentMonthRecords.length}건 보기
          </Button>
        )}
      </div>
    </div>
  );
}
