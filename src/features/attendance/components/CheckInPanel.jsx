import { useState } from "react";
import { ChevronDown, Send, Clock, Calendar, Edit2, AlertCircle } from "lucide-react";
import { Card } from "./Card";
import { TimeRangeSlider, formatHours, formatTime } from "./TimeRangeSlider";
import { VacationModal } from "./VacationModal";
import {
  useAttendanceStore,
  getDateRange,
  formatDate,
  calculateWorkHours,
  calculateOvertimeHours,
  useVacationStore,
} from "../../../stores";
import { VACATION_TYPES } from "../../../mock/attendanceData";

const locationOptions = ["휴가", "재택", "사무실", "오피스제주"];

const getLocationIcon = (location) => {
  switch (location) {
    case "재택":
      return "🏠";
    case "사무실":
      return "🏢";
    case "오피스제주":
      return "🏝️";
    case "휴가":
      return "🌴";
    default:
      return "📍";
  }
};

export const CheckInWidget = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { openModal: openVacationModal } = useVacationStore();

  const {
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
  } = useAttendanceStore();

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = registeredAttendance[today];
  const dateRange = getDateRange(startDate, endDate);
  const isMultipleDays = dateRange.length > 1;

  // 미래 날짜에 등록된 근무가 있는지 확인
  const futureRegisteredDates = Object.keys(registeredAttendance)
    .filter((date) => date > today)
    .sort();
  const hasFutureSchedule = futureRegisteredDates.length > 0;

  const workHours = calculateWorkHours(
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd
  );

  const overtimeHours = calculateOvertimeHours(
    morningLocation,
    afternoonLocation,
    startTime,
    endTime,
    lunchStart,
    lunchEnd
  );

  // 전체 기간 근무 시간 계산
  const calculateTotalWorkHours = () => {
    if (!isMultipleDays) return workHours;

    let total = 0;
    dateRange.forEach((date) => {
      const schedule = workSchedule[date] || {
        morning: morningLocation,
        afternoon: afternoonLocation,
      };
      total += calculateWorkHours(
        schedule.morning,
        schedule.afternoon,
        startTime,
        endTime,
        lunchStart,
        lunchEnd
      );
    });
    return total;
  };

  const handleRegister = () => {
    registerAttendance();
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleVacationSelect = (period, vacationType) => {
    if (period === "morning") {
      setMorningVacationType(vacationType);
    } else {
      setAfternoonVacationType(vacationType);
    }
  };

  const getVacationLabel = (vacationType) => {
    if (!vacationType) return null;
    const typeInfo = VACATION_TYPES[vacationType];
    return typeInfo ? `${typeInfo.emoji} ${typeInfo.label}` : vacationType;
  };

  // 등록된 상태이고 수정 모드가 아닌 경우 요약 화면 표시
  const showSummary = todayAttendance && !isEditMode;

  // 요약 화면
  if (showSummary) {
    const todayWorkHours = calculateWorkHours(
      todayAttendance.morningLocation,
      todayAttendance.afternoonLocation,
      todayAttendance.startTime,
      todayAttendance.endTime,
      todayAttendance.lunchStart,
      todayAttendance.lunchEnd
    );

    return (
      <Card className="flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-medium text-slate-800 text-sm">출근 완료</h3>
          </div>
          <span className="text-xs text-green-600 font-medium">
            {formatHours(todayWorkHours)}
          </span>
        </div>
        <div className="p-4 space-y-4">
          {/* 오늘 근무 요약 */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">오늘 근무</span>
              <span className="text-xs text-slate-400">
                {formatDate(today)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getLocationIcon(todayAttendance.morningLocation)}
                </span>
                <div>
                  <p className="text-[10px] text-slate-400">오전</p>
                  <p className="text-sm font-medium text-slate-700">
                    {todayAttendance.morningLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getLocationIcon(todayAttendance.afternoonLocation)}
                </span>
                <div>
                  <p className="text-[10px] text-slate-400">오후</p>
                  <p className="text-sm font-medium text-slate-700">
                    {todayAttendance.afternoonLocation}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTime(todayAttendance.startTime)} - {formatTime(todayAttendance.endTime)}
              </span>
              <span className="flex items-center gap-1">
                점심 {formatTime(todayAttendance.lunchStart)} -{" "}
                {formatTime(todayAttendance.lunchEnd)}
              </span>
            </div>
          </div>

          {/* 미래 예정된 근무 */}
          {hasFutureSchedule && (
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-blue-700">
                  근무 자동 등록
                </span>
                <span className="text-[10px] text-blue-500 ml-auto">
                  {futureRegisteredDates.length}일 예정
                </span>
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {futureRegisteredDates.slice(0, 5).map((date) => {
                  const att = registeredAttendance[date];
                  const hours = calculateWorkHours(
                    att.morningLocation,
                    att.afternoonLocation,
                    att.startTime,
                    att.endTime,
                    att.lunchStart,
                    att.lunchEnd
                  );
                  return (
                    <div
                      key={date}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-600">{formatDate(date)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                          {getLocationIcon(att.morningLocation)}{" "}
                          {getLocationIcon(att.afternoonLocation)}
                        </span>
                        <span className="text-blue-600 font-medium">
                          {formatHours(hours)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {futureRegisteredDates.length > 5 && (
                  <p className="text-[10px] text-blue-500 text-center pt-1">
                    +{futureRegisteredDates.length - 5}일 더 있음
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 font-medium flex items-center justify-center gap-2"
            >
              <Edit2 size={14} />
              수정하기
            </button>
            <button
              className="px-3 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50"
              title="디스코드 전송"
            >
              <Send size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // 등록/수정 화면
  return (
    <Card className="flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-medium text-slate-800 text-sm">
          {isEditMode ? "근무 수정" : "출근하기"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {isMultipleDays
              ? `${dateRange.length}일 총 ${formatHours(calculateTotalWorkHours())}`
              : formatHours(workHours)}
          </span>
          {overtimeHours !== 0 && !isMultipleDays && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                overtimeHours > 0
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {overtimeHours > 0 ? "+" : ""}{formatHours(overtimeHours)}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">
              오전 ({formatTime(startTime)}-{formatTime(lunchStart)})
            </label>
            <div className="relative">
              <select
                value={morningLocation}
                onChange={(e) => {
                  setMorningLocation(e.target.value);
                  if (e.target.value !== "휴가") {
                    setMorningVacationType(null);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg text-sm appearance-none cursor-pointer ${
                  morningLocation === "휴가"
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            {morningLocation === "휴가" && (
              <button
                type="button"
                onClick={() => openVacationModal("morning")}
                className={`mt-1.5 w-full text-left text-[11px] px-2 py-1 rounded flex items-center gap-1 ${
                  morningVacationType
                    ? "bg-blue-50 text-blue-600"
                    : "text-orange-600 hover:text-orange-700"
                }`}
              >
                {morningVacationType ? (
                  <span>{getVacationLabel(morningVacationType)}</span>
                ) : (
                  <>
                    <AlertCircle size={12} />
                    휴가등록 필요
                  </>
                )}
              </button>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">
              오후 ({formatTime(lunchEnd)}-{formatTime(endTime)})
            </label>
            <div className="relative">
              <select
                value={afternoonLocation}
                onChange={(e) => {
                  setAfternoonLocation(e.target.value);
                  if (e.target.value !== "휴가") {
                    setAfternoonVacationType(null);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg text-sm appearance-none cursor-pointer ${
                  afternoonLocation === "휴가"
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            {afternoonLocation === "휴가" && (
              <button
                type="button"
                onClick={() => openVacationModal("afternoon")}
                className={`mt-1.5 w-full text-left text-[11px] px-2 py-1 rounded flex items-center gap-1 ${
                  afternoonVacationType
                    ? "bg-blue-50 text-blue-600"
                    : "text-orange-600 hover:text-orange-700"
                }`}
              >
                {afternoonVacationType ? (
                  <span>{getVacationLabel(afternoonVacationType)}</span>
                ) : (
                  <>
                    <AlertCircle size={12} />
                    휴가등록 필요
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <TimeRangeSlider
          startTime={startTime}
          endTime={endTime}
          lunchStart={lunchStart}
          lunchEnd={lunchEnd}
          onChangeStart={setStartTime}
          onChangeEnd={setEndTime}
          onChangeLunch={(s, e) => {
            setLunchStart(s);
            setLunchEnd(e);
          }}
          onChangeAll={handleChangeAll}
          morningLocation={morningLocation}
          afternoonLocation={afternoonLocation}
        />
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
          >
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-2 flex items-center gap-1">
              기간 설정
              <ChevronDown
                size={12}
                className={`transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </button>
          {showAdvanced && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      handleDateChange(e.target.value, endDate);
                    }}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      handleDateChange(startDate, e.target.value);
                    }}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
              {isMultipleDays && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-500">
                      날짜별 근무 설정
                    </label>
                    <span className="text-[10px] text-slate-400">
                      주말 제외 {dateRange.length}일
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {dateRange.map((date) => {
                      const schedule = workSchedule[date] || {
                        morning: morningLocation,
                        afternoon: afternoonLocation,
                      };
                      const dayTotal = calculateWorkHours(
                        schedule.morning,
                        schedule.afternoon,
                        startTime,
                        endTime,
                        lunchStart,
                        lunchEnd
                      );
                      return (
                        <div
                          key={date}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100"
                        >
                          <span className="text-xs font-medium text-slate-700 w-16">
                            {formatDate(date)}
                          </span>
                          <select
                            value={schedule.morning}
                            onChange={(e) =>
                              updateDaySchedule(date, "morning", e.target.value)
                            }
                            className={`flex-1 px-2 py-1 border rounded text-[11px] ${
                              schedule.morning === "휴가"
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            {locationOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <select
                            value={schedule.afternoon}
                            onChange={(e) =>
                              updateDaySchedule(
                                date,
                                "afternoon",
                                e.target.value
                              )
                            }
                            className={`flex-1 px-2 py-1 border rounded text-[11px] ${
                              schedule.afternoon === "휴가"
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            {locationOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <span className="text-[10px] text-slate-400 w-12 text-right">
                            {formatHours(dayTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 font-medium"
              >
                취소
              </button>
              <button
                onClick={handleRegister}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 font-medium"
              >
                저장하기
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRegister}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 font-medium"
              >
                등록하기
              </button>
              <button
                className="px-3 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50"
                title="디스코드 전송"
              >
                <Send size={16} className="text-slate-500" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Vacation Modal */}
      <VacationModal onSelect={handleVacationSelect} />
    </Card>
  );
};

// Alias for backward compatibility
export const CheckInPanel = CheckInWidget;
