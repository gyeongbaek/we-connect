import { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp, AlertCircle, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";
import { VACATION_TYPES } from "../../../mock/attendanceData";

const LOCATIONS = [
  { value: "REMOTE", label: "재택" },
  { value: "ARA", label: "아라" },
  { value: "YUKJI", label: "육지" },
  { value: "VACATION", label: "휴가" },
];

// 시간을 30분 단위로 변환 (예: 9.5 = 9:30)
const formatTime = (time) => {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
};

export function CheckInPanel({ onSubmit, vacationBalances = [] }) {
  const [morningLocation, setMorningLocation] = useState("REMOTE");
  const [afternoonLocation, setAfternoonLocation] = useState("REMOTE");
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(18);
  const [lunchStart, setLunchStart] = useState(12);
  const [lunchEnd, setLunchEnd] = useState(13);
  const [showPeriodSettings, setShowPeriodSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState(0); // 드래그 시작점과의 offset
  const [activeSection, setActiveSection] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showVacationModal, setShowVacationModal] = useState(null);
  const [morningVacationType, setMorningVacationType] = useState(null);
  const [afternoonVacationType, setAfternoonVacationType] = useState(null);
  const timeBarRef = useRef(null);

  const STANDARD_HOURS = 8; // 기준 근무 시간

  const calculateHours = () => {
    const morningHours = lunchStart - workStart;
    const afternoonHours = workEnd - lunchEnd;

    let effectiveHours = 0;

    // 오전이 휴가가 아니거나, 휴가인데 휴가가 등록된 경우
    if (morningLocation !== "VACATION") {
      effectiveHours += morningHours;
    }

    // 오후가 휴가가 아니거나, 휴가인데 휴가가 등록된 경우
    if (afternoonLocation !== "VACATION") {
      effectiveHours += afternoonHours;
    }

    return effectiveHours;
  };

  // 실제 근무 시간 (휴가 제외)
  const getActualWorkHours = () => {
    const morningHours = lunchStart - workStart;
    const afternoonHours = workEnd - lunchEnd;

    let actualHours = 0;

    if (morningLocation !== "VACATION") {
      actualHours += morningHours;
    }

    if (afternoonLocation !== "VACATION") {
      actualHours += afternoonHours;
    }

    return actualHours;
  };

  // 휴가 등록된 시간 (휴가 타입이 선택된 경우에만)
  const getRegisteredVacationHours = () => {
    const morningHours = lunchStart - workStart;
    const afternoonHours = workEnd - lunchEnd;

    let vacationHours = 0;

    if (morningLocation === "VACATION" && morningVacationType) {
      vacationHours += morningHours;
    }

    if (afternoonLocation === "VACATION" && afternoonVacationType) {
      vacationHours += afternoonHours;
    }

    return vacationHours;
  };

  const getOvertimeHours = () => {
    // 실제 근무 시간 + 등록된 휴가 시간 - 기준 시간
    const actualWork = getActualWorkHours();
    const registeredVacation = getRegisteredVacationHours();
    return actualWork + registeredVacation - STANDARD_HOURS;
  };

  // 30분 단위로 반올림
  const roundToHalfHour = (hour) => {
    return Math.round(hour * 2) / 2;
  };

  const handleMouseDown = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((type === "work" || type === "lunch") && activeSection !== type) return;

    // 드래그 시작 시 현재 위치와 요소 위치의 차이를 저장
    if (timeBarRef.current) {
      const rect = timeBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const clickedHour = 6 + percentage * 16;

      // 각 타입별로 기준점과의 offset 계산
      let baseHour = 0;
      switch (type) {
        case "work":
          baseHour = workStart;
          break;
        case "lunch":
          baseHour = lunchStart;
          break;
        case "start":
          baseHour = workStart;
          break;
        case "end":
          baseHour = workEnd;
          break;
        case "lunchStart":
          baseHour = lunchStart;
          break;
        case "lunchEnd":
          baseHour = lunchEnd;
          break;
      }
      setDragOffset(clickedHour - baseHour);
    }

    setIsDragging(type);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !timeBarRef.current) return;

    const rect = timeBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const rawHour = 6 + percentage * 16;
    // offset을 적용하여 드래그 시작점 기준으로 이동
    const adjustedHour = rawHour - dragOffset;
    const hour = roundToHalfHour(adjustedHour);

    switch (isDragging) {
      case "start":
        if (hour < lunchStart && hour >= 6) setWorkStart(hour);
        break;
      case "end":
        if (hour > lunchEnd && hour <= 22) setWorkEnd(hour);
        break;
      case "lunchStart":
        if (hour >= workStart && hour < lunchEnd) setLunchStart(hour);
        break;
      case "lunchEnd":
        if (hour > lunchStart && hour <= workEnd) setLunchEnd(hour);
        break;
      case "lunch":
        const lunchDuration = lunchEnd - lunchStart;
        const newLunchStart = roundToHalfHour(
          Math.max(workStart, Math.min(adjustedHour, workEnd - lunchDuration))
        );
        setLunchStart(newLunchStart);
        setLunchEnd(newLunchStart + lunchDuration);
        break;
      case "work":
        const workDuration = workEnd - workStart;
        const newWorkStart = roundToHalfHour(
          Math.max(6, Math.min(adjustedHour, 22 - workDuration))
        );
        const offset = newWorkStart - workStart;
        setWorkStart(newWorkStart);
        setWorkEnd(newWorkStart + workDuration);
        setLunchStart(roundToHalfHour(lunchStart + offset));
        setLunchEnd(roundToHalfHour(lunchEnd + offset));
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, workStart, workEnd, lunchStart, lunchEnd]);

  const handleSectionClick = (section) => (e) => {
    e.stopPropagation();
    setActiveSection(activeSection === section ? null : section);
  };

  const handleSubmit = () => {
    onSubmit?.({
      morning: {
        location: morningLocation,
        start: workStart,
        end: lunchStart,
        vacationType: morningVacationType
      },
      afternoon: {
        location: afternoonLocation,
        start: lunchEnd,
        end: workEnd,
        vacationType: afternoonVacationType
      },
      lunch: { start: lunchStart, end: lunchEnd },
      totalHours: calculateHours(),
      period:
        showPeriodSettings && startDate !== endDate
          ? { startDate, endDate }
          : null,
    });
  };

  const getBarStyle = (start, end) => {
    const left = ((start - 6) / 16) * 100;
    const width = ((end - start) / 16) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const handleLocationChange = (period, value) => {
    if (period === "morning") {
      setMorningLocation(value);
      if (value !== "VACATION") {
        setMorningVacationType(null);
      }
    } else {
      setAfternoonLocation(value);
      if (value !== "VACATION") {
        setAfternoonVacationType(null);
      }
    }
  };

  const handleVacationSelect = (vacationType) => {
    if (showVacationModal === "morning") {
      setMorningVacationType(vacationType);
    } else {
      setAfternoonVacationType(vacationType);
    }
    setShowVacationModal(null);
  };

  const availableVacations = vacationBalances.filter((b) => b.remaining > 0);

  const getVacationLabel = (vacationType) => {
    if (!vacationType) return null;
    const typeInfo = VACATION_TYPES[vacationType];
    return typeInfo ? `${typeInfo.emoji} ${typeInfo.label}` : vacationType;
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-16 text-semibold">출근하기</h3>
        <div className="flex items-center gap-2">
          <span className="text-14 text-[var(--grayLv3)]">{calculateHours()}h</span>
          {getOvertimeHours() !== 0 && (
            <span
              className={`text-12 px-1.5 py-0.5 rounded ${
                getOvertimeHours() > 0
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "bg-[var(--error)]/10 text-[var(--error)]"
              }`}
            >
              {getOvertimeHours() > 0 ? "+" : ""}{getOvertimeHours()}h
            </span>
          )}
        </div>
      </div>

      {/* Session Selectors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-12 text-[var(--grayLv3)] mb-1 block">
            오전 (9-12)
          </label>
          <Select
            value={morningLocation}
            onChange={(e) => handleLocationChange("morning", e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </Select>
          {morningLocation === "VACATION" && (
            <button
              onClick={() => setShowVacationModal("morning")}
              className={`mt-1 w-full text-left text-12 px-2 py-1 rounded flex items-center gap-1 ${
                morningVacationType
                  ? "bg-[var(--activation)] text-[var(--primary)]"
                  : "bg-[var(--warn)]/20 text-[var(--warn)] hover:bg-[var(--warn)]/30"
              }`}
            >
              {morningVacationType ? (
                <span>{getVacationLabel(morningVacationType)}</span>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>휴가등록 필요</span>
                </>
              )}
            </button>
          )}
        </div>
        <div>
          <label className="text-12 text-[var(--grayLv3)] mb-1 block">
            오후 (13-18)
          </label>
          <Select
            value={afternoonLocation}
            onChange={(e) => handleLocationChange("afternoon", e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </Select>
          {afternoonLocation === "VACATION" && (
            <button
              onClick={() => setShowVacationModal("afternoon")}
              className={`mt-1 w-full text-left text-12 px-2 py-1 rounded flex items-center gap-1 ${
                afternoonVacationType
                  ? "bg-[var(--activation)] text-[var(--primary)]"
                  : "bg-[var(--warn)]/20 text-[var(--warn)] hover:bg-[var(--warn)]/30"
              }`}
            >
              {afternoonVacationType ? (
                <span>{getVacationLabel(afternoonVacationType)}</span>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>휴가등록 필요</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Time Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-10 text-[var(--grayLv3)] mb-1">
          {[6, 9, 12, 15, 18, 21].map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </div>
        <div
          ref={timeBarRef}
          className="h-10 bg-[var(--grayLv1)] rounded relative cursor-pointer"
          onClick={() => setActiveSection(null)}
        >
          {/* 전체 근무 시간 영역 */}
          <div
            className={`absolute h-full rounded transition-all ${
              activeSection === "work"
                ? "outline outline-2 outline-[var(--primary)] outline-offset-2 cursor-move z-20"
                : "cursor-pointer"
            }`}
            style={getBarStyle(workStart, workEnd)}
            onClick={handleSectionClick("work")}
            onMouseDown={activeSection === "work" ? handleMouseDown("work") : undefined}
          />

          {/* Morning work */}
          <div
            className={`absolute h-full rounded-l transition-all pointer-events-none ${
              morningLocation === "VACATION"
                ? "bg-[var(--activation)]"
                : "bg-[var(--primary)]"
            }`}
            style={getBarStyle(workStart, lunchStart)}
          >
            {morningLocation === "VACATION" && (
              <span className="absolute inset-0 flex items-center justify-center text-10 text-[var(--primary)]">
                휴가
              </span>
            )}
          </div>

          {/* Lunch break */}
          <div
            className={`absolute h-full flex items-center justify-center transition-all z-10 ${
              activeSection === "lunch"
                ? "bg-[var(--warn)] outline outline-2 outline-[var(--warn)] outline-offset-2 cursor-move"
                : "bg-[var(--warn)]/70 cursor-pointer"
            }`}
            style={getBarStyle(lunchStart, lunchEnd)}
            onClick={handleSectionClick("lunch")}
            onMouseDown={activeSection === "lunch" ? handleMouseDown("lunch") : undefined}
          >
            <span className="text-12">{activeSection === "lunch" ? "이동" : "휴게"}</span>
          </div>

          {/* Afternoon work */}
          <div
            className={`absolute h-full rounded-r transition-all pointer-events-none ${
              afternoonLocation === "VACATION"
                ? "bg-[var(--activation)]"
                : "bg-[var(--primary)]"
            }`}
            style={getBarStyle(lunchEnd, workEnd)}
          >
            {afternoonLocation === "VACATION" && (
              <span className="absolute inset-0 flex items-center justify-center text-10 text-[var(--primary)]">
                휴가
              </span>
            )}
          </div>

          {/* Drag handles */}
          <div
            className="absolute top-0 h-full w-3 cursor-ew-resize hover:bg-black/20 rounded-l z-30"
            style={{ left: `calc(${((workStart - 6) / 16) * 100}% - 6px)` }}
            onMouseDown={handleMouseDown("start")}
            onClick={(e) => e.stopPropagation()}
            title="출근 시간 조절"
          />
          <div
            className="absolute top-0 h-full w-3 cursor-ew-resize hover:bg-black/20 z-30"
            style={{ left: `calc(${((lunchStart - 6) / 16) * 100}% - 6px)` }}
            onMouseDown={handleMouseDown("lunchStart")}
            onClick={(e) => e.stopPropagation()}
            title="오전 종료/휴게 시작 조절"
          />
          <div
            className="absolute top-0 h-full w-3 cursor-ew-resize hover:bg-black/20 z-30"
            style={{ left: `calc(${((lunchEnd - 6) / 16) * 100}% - 6px)` }}
            onMouseDown={handleMouseDown("lunchEnd")}
            onClick={(e) => e.stopPropagation()}
            title="휴게 종료/오후 시작 조절"
          />
          <div
            className="absolute top-0 h-full w-3 cursor-ew-resize hover:bg-black/20 rounded-r z-30"
            style={{ left: `calc(${((workEnd - 6) / 16) * 100}% - 6px)` }}
            onMouseDown={handleMouseDown("end")}
            onClick={(e) => e.stopPropagation()}
            title="퇴근 시간 조절"
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-10 text-[var(--grayLv3)]">
            {formatTime(workStart)} ~ {formatTime(lunchStart)}
          </p>
          <p className="text-10 text-[var(--warn)]">
            휴게 {formatTime(lunchStart)}-{formatTime(lunchEnd)}
          </p>
          <p className="text-10 text-[var(--grayLv3)]">
            {formatTime(lunchEnd)} ~ {formatTime(workEnd)}
          </p>
        </div>
        <p className="text-10 text-center text-[var(--grayLv3)] mt-1">
          경계선 드래그로 시간 조절 (30분 단위) | 영역 클릭 후 전체 이동
        </p>
      </div>

      {/* Period Settings Accordion */}
      <button
        className="w-full flex items-center justify-between text-12 text-[var(--grayLv3)] hover:text-[var(--surface)] py-2 border-t border-[var(--grayLv1)]"
        onClick={() => setShowPeriodSettings(!showPeriodSettings)}
      >
        <span>기간 설정</span>
        {showPeriodSettings ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {showPeriodSettings && (
        <div className="p-3 bg-[var(--grayLv1)] rounded mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-10 text-[var(--grayLv3)] mb-1 block">
                시작일
              </label>
              <input
                type="date"
                className="w-full h-8 rounded border border-[var(--grayLv2)] px-2 text-12 bg-[var(--background)]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="text-[var(--grayLv3)] mt-4">~</span>
            <div className="flex-1">
              <label className="text-10 text-[var(--grayLv3)] mb-1 block">
                종료일
              </label>
              <input
                type="date"
                className="w-full h-8 rounded border border-[var(--grayLv2)] px-2 text-12 bg-[var(--background)]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <p className="text-10 text-[var(--grayLv3)] mt-2">
            기간을 설정하면 해당 기간 동안 자동으로 출근이 등록됩니다.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        className="w-full flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={
          (morningLocation === "VACATION" && !morningVacationType) ||
          (afternoonLocation === "VACATION" && !afternoonVacationType)
        }
      >
        출근하기
        <Send className="h-4 w-4" />
      </Button>

      {/* Vacation Selection Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] rounded-lg w-full max-w-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-16 text-semibold">
                {showVacationModal === "morning" ? "오전" : "오후"} 휴가 선택
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVacationModal(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableVacations.length === 0 ? (
                <p className="text-center text-[var(--grayLv3)] py-4">
                  사용 가능한 휴가가 없습니다.
                </p>
              ) : (
                availableVacations.map((balance) => {
                  const typeInfo = VACATION_TYPES[balance.type];
                  return (
                    <button
                      key={balance.type}
                      onClick={() => handleVacationSelect(balance.type)}
                      className="w-full p-3 rounded-lg border border-[var(--grayLv2)] hover:border-[var(--primary)] hover:bg-[var(--activation)] text-left transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-16">{typeInfo.emoji}</span>
                        <span className="text-14">{typeInfo.label}</span>
                      </div>
                      <span className="text-12 text-[var(--grayLv3)]">
                        {balance.remaining}일 남음
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
