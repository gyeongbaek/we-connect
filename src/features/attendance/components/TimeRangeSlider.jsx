import { useState, useRef, useEffect } from "react";
import { Coffee } from "lucide-react";

// 시간을 "9:00" 또는 "9:30" 형식으로 변환
export const formatTime = (time) => {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  return `${hours}:${String(Math.round(minutes)).padStart(2, "0")}`;
};

// 시간을 "8시간" 또는 "8시간 30분" 형식으로 변환
export const formatHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours % 1) * 60);
  if (m === 0) {
    return `${h}시간`;
  }
  return `${h}시간 ${m}분`;
};

export const TimeRangeSlider = ({
  startTime,
  endTime,
  lunchStart,
  lunchEnd,
  onChangeStart,
  onChangeEnd,
  onChangeLunch,
  onChangeAll,
  morningLocation,
  afternoonLocation,
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const timeBarRef = useRef(null);

  const roundToHalfHour = (hour) => {
    return Math.round(hour * 2) / 2;
  };

  const getBarStyle = (start, end) => {
    const left = ((start - 6) / 16) * 100;
    const width = ((end - start) / 16) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const handleMouseDown = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((type === "work" || type === "lunch") && activeSection !== type) return;

    if (timeBarRef.current) {
      const rect = timeBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const clickedHour = 6 + percentage * 16;

      let baseHour = 0;
      switch (type) {
        case "work":
          baseHour = startTime;
          break;
        case "lunch":
          baseHour = lunchStart;
          break;
        case "start":
          baseHour = startTime;
          break;
        case "end":
          baseHour = endTime;
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
    const adjustedHour = rawHour - dragOffset;
    const hour = roundToHalfHour(adjustedHour);

    switch (isDragging) {
      case "start":
        if (hour < lunchStart && hour >= 6) onChangeStart(hour);
        break;
      case "end":
        if (hour > lunchEnd && hour <= 22) onChangeEnd(hour);
        break;
      case "lunchStart":
        if (hour >= startTime && hour < lunchEnd) onChangeLunch(hour, lunchEnd);
        break;
      case "lunchEnd":
        if (hour > lunchStart && hour <= endTime) onChangeLunch(lunchStart, hour);
        break;
      case "lunch":
        const lunchDuration = lunchEnd - lunchStart;
        const newLunchStart = roundToHalfHour(
          Math.max(startTime, Math.min(adjustedHour, endTime - lunchDuration))
        );
        onChangeLunch(newLunchStart, newLunchStart + lunchDuration);
        break;
      case "work":
        const workDuration = endTime - startTime;
        const newWorkStart = roundToHalfHour(
          Math.max(6, Math.min(adjustedHour, 22 - workDuration))
        );
        const offset = newWorkStart - startTime;
        onChangeAll(
          newWorkStart,
          newWorkStart + workDuration,
          roundToHalfHour(lunchStart + offset),
          roundToHalfHour(lunchEnd + offset)
        );
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
  }, [isDragging, startTime, endTime, lunchStart, lunchEnd]);

  const handleSectionClick = (section) => (e) => {
    e.stopPropagation();
    setActiveSection(activeSection === section ? null : section);
  };

  // 오전/오후가 휴가인지 확인
  const isMorningVacation = morningLocation === "휴가";
  const isAfternoonVacation = afternoonLocation === "휴가";

  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        {[6, 9, 12, 15, 18, 21].map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
      <div
        ref={timeBarRef}
        className="h-10 bg-slate-100 rounded-lg relative cursor-pointer"
        onClick={() => setActiveSection(null)}
      >
        {/* 전체 근무 시간 영역 (클릭 가능) */}
        <div
          className={`absolute h-full rounded transition-all ${
            activeSection === "work"
              ? "outline outline-2 outline-blue-500 outline-offset-2 cursor-move z-20"
              : "cursor-pointer"
          }`}
          style={getBarStyle(startTime, endTime)}
          onClick={handleSectionClick("work")}
          onMouseDown={activeSection === "work" ? handleMouseDown("work") : undefined}
        />

        {/* Morning work */}
        <div
          className={`absolute h-full rounded-l transition-all pointer-events-none ${
            isMorningVacation
              ? "bg-blue-100"
              : "bg-blue-500"
          }`}
          style={getBarStyle(startTime, lunchStart)}
        >
          {isMorningVacation && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-blue-600 font-medium">
              휴가
            </span>
          )}
        </div>

        {/* Lunch break */}
        <div
          className={`absolute h-full flex items-center justify-center transition-all z-10 ${
            activeSection === "lunch"
              ? "bg-amber-500 outline outline-2 outline-amber-500 outline-offset-2 cursor-move"
              : "bg-amber-400 cursor-pointer"
          }`}
          style={getBarStyle(lunchStart, lunchEnd)}
          onClick={handleSectionClick("lunch")}
          onMouseDown={activeSection === "lunch" ? handleMouseDown("lunch") : undefined}
        >
          <Coffee size={14} className="text-white" />
        </div>

        {/* Afternoon work */}
        <div
          className={`absolute h-full rounded-r transition-all pointer-events-none ${
            isAfternoonVacation
              ? "bg-blue-100"
              : "bg-blue-500"
          }`}
          style={getBarStyle(lunchEnd, endTime)}
        >
          {isAfternoonVacation && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-blue-600 font-medium">
              휴가
            </span>
          )}
        </div>

        {/* Drag handles */}
        <div
          className="absolute top-0 h-full w-3 cursor-ew-resize hover:bg-black/20 rounded-l z-30"
          style={{ left: `calc(${((startTime - 6) / 16) * 100}% - 6px)` }}
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
          style={{ left: `calc(${((endTime - 6) / 16) * 100}% - 6px)` }}
          onMouseDown={handleMouseDown("end")}
          onClick={(e) => e.stopPropagation()}
          title="퇴근 시간 조절"
        />
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-[10px] text-slate-500">
          {formatTime(startTime)} ~ {formatTime(lunchStart)}
        </p>
        <p className="text-[10px] text-amber-600 flex items-center gap-1">
          <Coffee size={10} />
          휴게 {formatTime(lunchStart)}-{formatTime(lunchEnd)}
        </p>
        <p className="text-[10px] text-slate-500">
          {formatTime(lunchEnd)} ~ {formatTime(endTime)}
        </p>
      </div>
      <p className="text-[10px] text-center text-slate-400 mt-1">
        경계선 드래그로 시간 조절 (30분 단위) | 영역 클릭 후 전체 이동
      </p>
    </div>
  );
};
