import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "./Card";
import { TimeRangeBar, TimeScaleHeader } from "./TimeRangeBar";
import { useAttendanceStore, useVacationStore } from "../../../stores";
import { formatHours, formatTime } from "./TimeRangeSlider";
import { VACATION_TYPES } from "../../../mock/attendanceData";

// 해당 날짜가 속한 주의 월요일 구하기
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// 해당 날짜가 몇 주차인지 계산
const getWeekOfMonth = (date) => {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const firstMonday = getMonday(firstDay);

  if (firstMonday.getMonth() < d.getMonth()) {
    firstMonday.setDate(firstMonday.getDate() + 7);
  }

  const monday = getMonday(d);
  const diff = Math.floor((monday - firstMonday) / (7 * 24 * 60 * 60 * 1000));
  return diff + 1;
};

// 해당 주의 월-금 날짜 배열 구하기
const getWeekDays = (monday) => {
  const days = [];
  const dayNames = ["월", "화", "수", "목", "금"];

  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      dayNum: date.getDate(),
      dayName: dayNames[i],
      month: date.getMonth(),
    });
  }

  return days;
};

// 근무 내역 위젯
export const WorkHistoryWidget = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const { registeredAttendance } = useAttendanceStore();
  const { getVacationForDate } = useVacationStore();

  const weekDays = getWeekDays(currentMonday);
  const month = currentMonday.getMonth();
  const weekNum = getWeekOfMonth(currentMonday);

  // 등록된 근무 기록 가져오기
  const getAttendanceForDate = (dateStr) => {
    return registeredAttendance[dateStr] || null;
  };

  // 월별 통계 계산
  const calculateMonthlyStats = () => {
    let totalHours = 0;

    Object.entries(registeredAttendance).forEach(([date, att]) => {
      const d = new Date(date);
      if (d.getFullYear() === currentMonday.getFullYear() && d.getMonth() === month) {
        const morningHours = att.morningLocation === "휴가" ? 0 : (att.lunchStart - att.startTime);
        const afternoonHours = att.afternoonLocation === "휴가" ? 0 : (att.endTime - att.lunchEnd);
        totalHours += morningHours + afternoonHours;
      }
    });

    const workingDays = 22; // 월 평균 근무일
    const standardHours = workingDays * 8;
    const overtimeHours = totalHours - standardHours;

    return {
      totalHours,
      standardHours,
      overtimeHours,
    };
  };

  const stats = calculateMonthlyStats();

  const getLocationIcon = (location) => {
    switch (location) {
      case "재택":
        return "🏠";
      case "사무실":
        return "🏢";
      case "오피스제주":
        return "🏝️";
      default:
        return "📍";
    }
  };

  const handlePrevWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(newMonday);
  };

  const handleNextWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(newMonday);
  };

  return (
    <>
      <Card className="flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            <h3 className="font-medium text-slate-800 text-sm">
              {month + 1}월 {weekNum}주차
            </h3>
            <button
              onClick={handleNextWeek}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs">
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

        {/* Time Scale Header */}
        <div className="px-4 pt-2 pb-1 flex items-center gap-3">
          <div className="w-14 shrink-0" />
          <div className="flex-1">
            <TimeScaleHeader />
          </div>
          <div className="w-10 shrink-0" />
          <div className="w-12 shrink-0" />
        </div>

        <div className="divide-y divide-slate-100">
          {weekDays.map((day) => (
            <WorkHistoryItem
              key={day.date}
              day={day}
              attendance={getAttendanceForDate(day.date)}
              vacation={getVacationForDate(day.date)}
              getLocationIcon={getLocationIcon}
            />
          ))}
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-500">{month + 1}월 근무</span>
                <span className="text-sm font-medium text-slate-800 ml-2">
                  {formatHours(stats.totalHours)} / {formatHours(stats.standardHours)}
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
            <button
              onClick={() => setShowModal(true)}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              전체 내역 <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </Card>

      {/* 전체 내역 모달 */}
      {showModal && (
        <WorkHistoryModal
          onClose={() => setShowModal(false)}
          getAttendanceForDate={getAttendanceForDate}
          getVacationForDate={getVacationForDate}
          getLocationIcon={getLocationIcon}
        />
      )}
    </>
  );
};

// 근무 내역 아이템 컴포넌트
const WorkHistoryItem = ({ day, attendance, vacation, getLocationIcon }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;

  // 휴가 스토어에서 등록된 휴가 확인 (출근 기록이 없는 경우에도 표시)
  const vacationMorning = vacation?.timeType === "MORNING" || vacation?.timeType === "FULL";
  const vacationAfternoon = vacation?.timeType === "AFTERNOON" || vacation?.timeType === "FULL";

  // attendance가 있으면 attendance 기준, 없으면 vacation 기준
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

  return (
    <div
      className={`px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors relative ${
        isToday ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && attendance && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          <div className="font-medium mb-1">{day.date} ({day.dayName})</div>
          <div>{getTooltipContent()}</div>
          <div className="mt-1 text-slate-300">
            {attendance.morningLocation && `${getLocationIcon(attendance.morningLocation)} ${attendance.morningLocation}`}
            {" · "}근무 {formatHours(hours)}
          </div>
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

      <div className="w-10 shrink-0 text-center">
        <span className="text-xs">
          {attendance ? getLocationIcon(attendance.morningLocation || attendance.afternoonLocation) : (isMorningVacation || isAfternoonVacation) ? "🌴" : ""}
        </span>
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

// 전체 내역 모달
const WorkHistoryModal = ({ onClose, getAttendanceForDate, getVacationForDate, getLocationIcon }) => {
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));

  const weekDays = getWeekDays(currentMonday);
  const month = currentMonday.getMonth();
  const weekNum = getWeekOfMonth(currentMonday);

  const handlePrevWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(newMonday);
  };

  const handleNextWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(newMonday);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {month + 1}월 {weekNum}주차 근무 내역
            </h2>
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 border-b border-slate-100 flex items-center gap-4 text-xs shrink-0">
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

        {/* Time Scale Header */}
        <div className="px-6 pt-2 pb-1 flex items-center gap-3 shrink-0">
          <div className="w-14 shrink-0" />
          <div className="flex-1">
            <TimeScaleHeader />
          </div>
          <div className="w-10 shrink-0" />
          <div className="w-12 shrink-0" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {weekDays.map((day) => (
            <WorkHistoryItem
              key={day.date}
              day={day}
              attendance={getAttendanceForDate(day.date)}
              vacation={getVacationForDate(day.date)}
              getLocationIcon={getLocationIcon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
