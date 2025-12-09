import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { TimeRangeBar, TimeScaleHeader } from "./TimeRangeBar";
import { useAttendanceStore, useVacationStore } from "../../../stores";
import { formatHours, formatTime } from "./TimeRangeSlider";
import { cn } from "../../../utils/cn";
import { formatDateString, getTodayString } from "../../../utils/date";

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
      date: formatDateString(date),
      dayNum: date.getDate(),
      dayName: dayNames[i],
      month: date.getMonth(),
    });
  }

  return days;
};

// 근무 내역 위젯
export const WorkHistoryWidget = () => {
  const navigate = useNavigate();
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [editingDate, setEditingDate] = useState(null);
  const { registeredAttendance, updateAttendance } = useAttendanceStore();
  const { getVacationForDate } = useVacationStore();

  const weekDays = getWeekDays(currentMonday);
  const month = currentMonday.getMonth();
  const weekNum = getWeekOfMonth(currentMonday);

  // 등록된 근무 기록 가져오기
  const getAttendanceForDate = (dateStr) => {
    return registeredAttendance[dateStr] || null;
  };

  // 오늘까지의 근무일 수 계산 (주말 제외)
  const getWorkingDaysUntilToday = () => {
    const today = new Date();
    const year = currentMonday.getFullYear();
    const startOfMonth = new Date(year, month, 1);
    const endDate =
      today.getMonth() === month && today.getFullYear() === year
        ? today
        : new Date(year, month + 1, 0); // 해당 월의 마지막 날

    let workingDays = 0;
    for (
      let d = new Date(startOfMonth);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 주말 제외
        workingDays++;
      }
    }
    return workingDays;
  };

  // 월별 통계 계산 (오늘 기준)
  const calculateMonthlyStats = () => {
    let totalHours = 0;

    Object.entries(registeredAttendance).forEach(([date, att]) => {
      const d = new Date(date);
      if (
        d.getFullYear() === currentMonday.getFullYear() &&
        d.getMonth() === month
      ) {
        const morningHours =
          att.morningLocation === "휴가" ? 0 : att.lunchStart - att.startTime;
        const afternoonHours =
          att.afternoonLocation === "휴가" ? 0 : att.endTime - att.lunchEnd;
        totalHours += morningHours + afternoonHours;
      }
    });

    const workingDays = getWorkingDaysUntilToday();
    const standardHours = workingDays * 8; // 오늘까지 예상 근무시간
    const overtimeHours = totalHours - standardHours;

    return {
      totalHours,
      standardHours,
      overtimeHours,
      workingDays,
    };
  };

  const stats = calculateMonthlyStats();

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

  const handleSaveEdit = (data) => {
    if (editingDate) {
      updateAttendance(editingDate, data);
      setEditingDate(null);
    }
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
          <div className="w-12 shrink-0" />
        </div>

        <div className="divide-y divide-slate-100">
          {weekDays.map((day) => (
            <WorkHistoryItem
              key={day.date}
              day={day}
              attendance={getAttendanceForDate(day.date)}
              vacation={getVacationForDate(day.date)}
              onEdit={() => setEditingDate(day.date)}
            />
          ))}
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-500">
                  {month + 1}월 근무 <span className="text-slate-400">(오늘 기준)</span>
                </span>
                <span className="text-sm font-medium text-slate-800 ml-2">
                  {formatHours(stats.totalHours)} /{" "}
                  {formatHours(stats.standardHours)}
                </span>
              </div>
              {stats.overtimeHours !== 0 && (
                <div>
                  <span className="text-xs text-slate-500">
                    {stats.overtimeHours > 0 ? "추가 근무" : "조기 퇴근"}
                  </span>
                  <span
                    className={`text-sm font-medium ml-2 ${
                      stats.overtimeHours > 0 ? "text-blue-600" : "text-amber-600"
                    }`}
                  >
                    {stats.overtimeHours > 0 ? "+" : ""}
                    {formatHours(stats.overtimeHours)}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/attendance/month")}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              전체 내역 <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </Card>

      {/* 수정 모달 */}
      {editingDate && (
        <EditAttendanceModal
          date={editingDate}
          attendance={getAttendanceForDate(editingDate)}
          onClose={() => setEditingDate(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

// 근무 내역 아이템 컴포넌트
const WorkHistoryItem = ({ day, attendance, vacation, onEdit }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const today = getTodayString();
  const isToday = day.date === today;

  // 휴가 스토어에서 등록된 휴가 확인 (근무 기록이 없는 경우에도 표시)
  const vacationMorning =
    vacation?.timeType === "MORNING" || vacation?.timeType === "FULL";
  const vacationAfternoon =
    vacation?.timeType === "AFTERNOON" || vacation?.timeType === "FULL";

  // attendance가 있으면 attendance 기준, 없으면 vacation 기준
  const isMorningVacation =
    attendance?.morningLocation === "휴가" || (!attendance && vacationMorning);
  const isAfternoonVacation =
    attendance?.afternoonLocation === "휴가" ||
    (!attendance && vacationAfternoon);
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
      : `오전 ${formatTime(attendance.startTime)}-${formatTime(
          attendance.lunchStart
        )}`;
    const lunch = `휴게 ${formatTime(attendance.lunchStart)}-${formatTime(
      attendance.lunchEnd
    )}`;
    const afternoon = isAfternoonVacation
      ? "오후 휴가"
      : `오후 ${formatTime(attendance.lunchEnd)}-${formatTime(
          attendance.endTime
        )}`;
    return `${morning} | ${lunch} | ${afternoon}`;
  };

  const hours = attendance
    ? (isMorningVacation ? 0 : attendance.lunchStart - attendance.startTime) +
      (isAfternoonVacation ? 0 : attendance.endTime - attendance.lunchEnd)
    : 0;

  return (
    <div
      className={cn(
        "px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors relative cursor-pointer group",
        isToday && "bg-blue-50 border-l-4 border-l-blue-500"
      )}
      onMouseEnter={() => { setShowTooltip(true); setShowEditButton(true); }}
      onMouseLeave={() => { setShowTooltip(false); setShowEditButton(false); }}
      onClick={onEdit}
    >
      {/* Tooltip */}
      {showTooltip && attendance && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          <div className="font-medium mb-1">
            {day.date} ({day.dayName})
          </div>
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
          className={`text-xs ${isToday ? "text-blue-500" : "text-slate-400"}`}
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

      <div className="w-12 text-right shrink-0 flex items-center justify-end gap-1">
        {showEditButton && (
          <Pencil size={12} className="text-slate-400 group-hover:text-slate-600" />
        )}
        {(attendance || isMorningVacation || isAfternoonVacation) && (
          <span
            className={`text-xs font-medium ${
              isFullVacation ||
              (!attendance && (isMorningVacation || isAfternoonVacation))
                ? "text-orange-600"
                : hours > 8
                ? "text-blue-600"
                : hours < 8
                ? "text-amber-600"
                : "text-slate-700"
            }`}
          >
            {isFullVacation
              ? "휴가"
              : !attendance && (isMorningVacation || isAfternoonVacation)
              ? "4h"
              : formatHours(hours)}
          </span>
        )}
      </div>
    </div>
  );
};

// 근무 수정 모달
const EditAttendanceModal = ({ date, attendance, onClose, onSave }) => {
  const [startTime, setStartTime] = useState(attendance?.startTime || 9);
  const [endTime, setEndTime] = useState(attendance?.endTime || 18);
  const [lunchStart, setLunchStart] = useState(attendance?.lunchStart || 12);
  const [lunchEnd, setLunchEnd] = useState(attendance?.lunchEnd || 13);
  const [morningLocation, setMorningLocation] = useState(attendance?.morningLocation || "재택");
  const [afternoonLocation, setAfternoonLocation] = useState(attendance?.afternoonLocation || "재택");

  const locations = ["재택", "사무실", "외근", "휴가"];

  const formatDateKorean = (dateStr) => {
    const d = new Date(dateStr);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      startTime,
      endTime,
      lunchStart,
      lunchEnd,
      morningLocation,
      afternoonLocation,
    });
  };

  const workHours =
    (morningLocation === "휴가" ? 0 : lunchStart - startTime) +
    (afternoonLocation === "휴가" ? 0 : endTime - lunchEnd);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-5 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">근무 기록 수정</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">{formatDateKorean(date)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 오전 근무 */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">오전 근무</label>
            <div className="flex gap-2">
              <select
                value={morningLocation}
                onChange={(e) => setMorningLocation(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                min={6}
                max={12}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400 self-center">~</span>
              <input
                type="number"
                value={lunchStart}
                onChange={(e) => setLunchStart(Number(e.target.value))}
                min={11}
                max={14}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 점심 시간 */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">점심 시간</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lunchStart}
                onChange={(e) => setLunchStart(Number(e.target.value))}
                min={11}
                max={14}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400">~</span>
              <input
                type="number"
                value={lunchEnd}
                onChange={(e) => setLunchEnd(Number(e.target.value))}
                min={12}
                max={15}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-400">({lunchEnd - lunchStart}시간)</span>
            </div>
          </div>

          {/* 오후 근무 */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">오후 근무</label>
            <div className="flex gap-2">
              <select
                value={afternoonLocation}
                onChange={(e) => setAfternoonLocation(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <input
                type="number"
                value={lunchEnd}
                onChange={(e) => setLunchEnd(Number(e.target.value))}
                min={12}
                max={15}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400 self-center">~</span>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                min={17}
                max={23}
                className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 근무 시간 요약 */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">총 근무시간</span>
              <span className={cn(
                "font-medium",
                workHours > 8 ? "text-blue-600" : workHours < 8 ? "text-amber-600" : "text-slate-800"
              )}>
                {formatHours(workHours)}
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
