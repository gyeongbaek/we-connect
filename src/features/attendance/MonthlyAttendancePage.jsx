import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeRangeBar, TimeScaleHeader } from "./components/TimeRangeBar";
import { useAttendanceStore, useVacationStore } from "../../stores";
import { formatHours, formatTime } from "./components/TimeRangeSlider";

// 해당 날짜가 속한 주의 월요일 구하기
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// 해당 월의 모든 주 가져오기
const getWeeksInMonth = (year, month) => {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let currentMonday = getMonday(firstDay);

  while (currentMonday <= lastDay) {
    const weekDays = [];
    const dayNames = ["월", "화", "수", "목", "금"];

    for (let i = 0; i < 5; i++) {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + i);
      weekDays.push({
        date: date.toISOString().split("T")[0],
        dayNum: date.getDate(),
        dayName: dayNames[i],
        month: date.getMonth(),
        isCurrentMonth: date.getMonth() === month,
      });
    }

    weeks.push(weekDays);
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  return weeks;
};

export function MonthlyAttendancePage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { registeredAttendance } = useAttendanceStore();
  const { getVacationForDate } = useVacationStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getWeeksInMonth(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAttendanceForDate = (dateStr) => {
    return registeredAttendance[dateStr] || null;
  };

  // 월별 통계 계산
  const calculateMonthlyStats = () => {
    let totalHours = 0;
    let workDays = 0;

    Object.entries(registeredAttendance).forEach(([date, att]) => {
      const d = new Date(date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const morningHours = att.morningLocation === "휴가" ? 0 : (att.lunchStart - att.startTime);
        const afternoonHours = att.afternoonLocation === "휴가" ? 0 : (att.endTime - att.lunchEnd);
        totalHours += morningHours + afternoonHours;
        workDays++;
      }
    });

    // 오늘까지의 근무일 수 계산 (주말 제외)
    const today = new Date();
    const startOfMonth = new Date(year, month, 1);
    const endDate = today.getMonth() === month && today.getFullYear() === year
      ? today
      : new Date(year, month + 1, 0);

    let expectedWorkingDays = 0;
    for (let d = new Date(startOfMonth); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        expectedWorkingDays++;
      }
    }

    const standardHours = expectedWorkingDays * 8;
    const overtimeHours = totalHours - standardHours;

    return {
      totalHours,
      standardHours,
      overtimeHours,
      workDays,
      expectedWorkingDays,
    };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/attendance")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          돌아가기
        </button>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {year}년 {month + 1}월 근무 내역
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              근무
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              휴게
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-100 border border-blue-200" />
              휴가
            </span>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-500">총 근무시간</span>
                <span className="text-sm font-medium text-slate-800 ml-2">
                  {formatHours(stats.totalHours)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500">예상 근무시간 (오늘 기준)</span>
                <span className="text-sm font-medium text-slate-800 ml-2">
                  {formatHours(stats.standardHours)}
                </span>
              </div>
              {stats.overtimeHours !== 0 && (
                <div>
                  <span className="text-xs text-slate-500">
                    {stats.overtimeHours > 0 ? "초과 근무" : "부족"}
                  </span>
                  <span
                    className={`text-sm font-medium ml-2 ${
                      stats.overtimeHours > 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {stats.overtimeHours > 0 ? "+" : ""}
                    {formatHours(stats.overtimeHours)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {stats.workDays}일 출근 / {stats.expectedWorkingDays}일 예정
            </div>
          </div>
        </div>

        {/* Time Scale Header */}
        <div className="px-4 pt-2 pb-1 flex items-center gap-3">
          <div className="w-14 shrink-0" />
          <div className="flex-1">
            <TimeScaleHeader />
          </div>
          <div className="w-12 shrink-0" />
        </div>

        {/* Weekly Records */}
        <div className="divide-y divide-slate-100">
          {weeks.map((weekDays, weekIndex) => (
            <div key={weekIndex} className="py-2">
              <div className="text-xs text-slate-400 px-4 mb-1">
                {weekIndex + 1}주차
              </div>
              {weekDays.map((day) => (
                <WorkHistoryItem
                  key={day.date}
                  day={day}
                  attendance={getAttendanceForDate(day.date)}
                  vacation={getVacationForDate(day.date)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 근무 내역 아이템 컴포넌트
const WorkHistoryItem = ({ day, attendance, vacation }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;

  const vacationMorning = vacation?.timeType === "MORNING" || vacation?.timeType === "FULL";
  const vacationAfternoon = vacation?.timeType === "AFTERNOON" || vacation?.timeType === "FULL";

  const isMorningVacation = attendance?.morningLocation === "휴가" || (!attendance && vacationMorning);
  const isAfternoonVacation = attendance?.afternoonLocation === "휴가" || (!attendance && vacationAfternoon);
  const isFullVacation = isMorningVacation && isAfternoonVacation;

  const getTooltipContent = () => {
    if (isFullVacation) return "휴가 (종일)";
    if (!attendance && vacation) {
      if (vacationMorning) return "오전 휴가";
      if (vacationAfternoon) return "오후 휴가";
    }
    if (!attendance) return "근무 기록 없음";

    const morning = isMorningVacation
      ? "오전 휴가"
      : `오전 ${formatTime(attendance.startTime)}-${formatTime(attendance.lunchStart)}`;
    const lunch = `휴게 ${formatTime(attendance.lunchStart)}-${formatTime(attendance.lunchEnd)}`;
    const afternoon = isAfternoonVacation
      ? "오후 휴가"
      : `오후 ${formatTime(attendance.lunchEnd)}-${formatTime(attendance.endTime)}`;
    return `${morning} | ${lunch} | ${afternoon}`;
  };

  const hours = attendance
    ? (isMorningVacation ? 0 : attendance.lunchStart - attendance.startTime) +
      (isAfternoonVacation ? 0 : attendance.endTime - attendance.lunchEnd)
    : 0;

  if (!day.isCurrentMonth) {
    return (
      <div className="px-4 py-2 flex items-center gap-3 opacity-30">
        <div className="w-14 shrink-0">
          <div className="text-sm font-medium text-slate-400">
            {day.date.slice(5)}
          </div>
          <div className="text-xs text-slate-300">{day.dayName}</div>
        </div>
        <div className="flex-1 h-4 bg-slate-50 rounded" />
        <div className="w-12 shrink-0" />
      </div>
    );
  }

  return (
    <div
      className={`px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors relative ${
        isToday ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && attendance && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          <div className="font-medium mb-1">{day.date} ({day.dayName})</div>
          <div>{getTooltipContent()}</div>
          <div className="mt-1 text-slate-300">근무 {formatHours(hours)}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
        </div>
      )}

      <div className="w-14 shrink-0">
        <div
          className={`text-sm font-medium ${
            isToday ? "text-blue-600" : "text-slate-800"
          }`}
        >
          {day.date.slice(5)}
        </div>
        <div
          className={`text-xs ${
            isToday ? "text-blue-500" : "text-slate-400"
          }`}
        >
          {day.dayName}
          {isToday && (
            <span className="ml-1 text-blue-600 font-medium">오늘</span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {isFullVacation ? (
          <div className="flex items-center gap-2 h-4">
            <span className="text-sm">🌴</span>
            <span className="text-xs text-orange-600 font-medium">휴가</span>
          </div>
        ) : !attendance && (isMorningVacation || isAfternoonVacation) ? (
          <div className="flex items-center gap-2 h-4">
            <span className="text-sm">🌴</span>
            <span className="text-xs text-orange-600 font-medium">
              {isMorningVacation ? "오전 휴가" : "오후 휴가"}
            </span>
          </div>
        ) : !attendance ? (
          <div className="h-4 bg-slate-100 rounded" />
        ) : (
          <TimeRangeBar
            startHour={attendance.startTime}
            endHour={attendance.endTime}
            lunchStart={attendance.lunchStart}
            lunchEnd={attendance.lunchEnd}
            isMorningVacation={isMorningVacation}
            isAfternoonVacation={isAfternoonVacation}
          />
        )}
      </div>

      <div className="w-12 text-right shrink-0">
        {(attendance || isMorningVacation || isAfternoonVacation) && (
          <span
            className={`text-xs font-medium ${
              isFullVacation || (!attendance && (isMorningVacation || isAfternoonVacation))
                ? "text-orange-600"
                : hours > 8
                ? "text-blue-600"
                : hours < 8
                ? "text-amber-600"
                : "text-slate-700"
            }`}
          >
            {isFullVacation ? "휴가" : !attendance && (isMorningVacation || isAfternoonVacation) ? "4h" : formatHours(hours)}
          </span>
        )}
      </div>
    </div>
  );
};
