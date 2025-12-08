import { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";

const LOCATIONS = [
  { value: "REMOTE", label: "재택" },
  { value: "OFFICE", label: "사무실" },
  { value: "VACATION", label: "휴가" },
];

const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => i + 6); // 6시 ~ 22시

export function CheckInPanel({ onSubmit }) {
  const [morningLocation, setMorningLocation] = useState("REMOTE");
  const [afternoonLocation, setAfternoonLocation] = useState("REMOTE");
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(18);
  const [lunchStart, setLunchStart] = useState(12);
  const [lunchEnd, setLunchEnd] = useState(13);
  const [showPeriodSettings, setShowPeriodSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const timeBarRef = useRef(null);

  const calculateHours = () => {
    const workHours = workEnd - workStart;
    const lunchHours = lunchEnd - lunchStart;
    return workHours - lunchHours;
  };

  const handleMouseDown = (type) => (e) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !timeBarRef.current) return;

    const rect = timeBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const hour = Math.round(6 + percentage * 16);

    switch (isDragging) {
      case "start":
        if (hour < lunchStart && hour >= 6) setWorkStart(hour);
        break;
      case "end":
        if (hour > lunchEnd && hour <= 22) setWorkEnd(hour);
        break;
      case "lunchStart":
        if (hour > workStart && hour < lunchEnd) setLunchStart(hour);
        break;
      case "lunchEnd":
        if (hour > lunchStart && hour < workEnd) setLunchEnd(hour);
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
  }, [isDragging]);

  const handleSubmit = () => {
    onSubmit?.({
      morning: { location: morningLocation, start: workStart, end: 12 },
      afternoon: { location: afternoonLocation, start: 13, end: workEnd },
      lunch: { start: lunchStart, end: lunchEnd },
      totalHours: calculateHours(),
    });
  };

  const getBarStyle = (start, end) => {
    const left = ((start - 6) / 16) * 100;
    const width = ((end - start) / 16) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-16 text-semibold">출근하기</h3>
        <span className="text-14 text-[var(--grayLv3)]">
          오늘 {calculateHours()}h
        </span>
      </div>

      {/* Session Selectors */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-12 text-[var(--grayLv3)] mb-1 block">
            오전 (8-12)
          </label>
          <Select
            value={morningLocation}
            onChange={(e) => setMorningLocation(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-12 text-[var(--grayLv3)] mb-1 block">
            오후 (13-18)
          </label>
          <Select
            value={afternoonLocation}
            onChange={(e) => setAfternoonLocation(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </Select>
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
          className="h-8 bg-[var(--grayLv1)] rounded relative cursor-pointer"
        >
          {/* Morning work */}
          <div
            className="absolute h-full bg-[var(--primary)] rounded-l"
            style={getBarStyle(workStart, lunchStart)}
          />
          {/* Lunch break */}
          <div
            className="absolute h-full bg-[var(--warn)] flex items-center justify-center"
            style={getBarStyle(lunchStart, lunchEnd)}
          >
            <span className="text-10">🍽️</span>
          </div>
          {/* Afternoon work */}
          <div
            className="absolute h-full bg-[var(--primary)] rounded-r"
            style={getBarStyle(lunchEnd, workEnd)}
          />

          {/* Drag handles */}
          <div
            className="absolute top-0 h-full w-2 cursor-ew-resize hover:bg-black/10"
            style={{ left: `calc(${((workStart - 6) / 16) * 100}% - 4px)` }}
            onMouseDown={handleMouseDown("start")}
          />
          <div
            className="absolute top-0 h-full w-2 cursor-ew-resize hover:bg-black/10"
            style={{ left: `calc(${((lunchStart - 6) / 16) * 100}% - 4px)` }}
            onMouseDown={handleMouseDown("lunchStart")}
          />
          <div
            className="absolute top-0 h-full w-2 cursor-ew-resize hover:bg-black/10"
            style={{ left: `calc(${((lunchEnd - 6) / 16) * 100}% - 4px)` }}
            onMouseDown={handleMouseDown("lunchEnd")}
          />
          <div
            className="absolute top-0 h-full w-2 cursor-ew-resize hover:bg-black/10"
            style={{ left: `calc(${((workEnd - 6) / 16) * 100}% - 4px)` }}
            onMouseDown={handleMouseDown("end")}
          />
        </div>
        <p className="text-10 text-center text-[var(--grayLv3)] mt-1">
          드래그하여 시간 조정
        </p>
      </div>

      {/* Period Settings */}
      <button
        className="w-full flex items-center justify-center gap-1 text-12 text-[var(--grayLv3)] hover:text-[var(--surface)] py-2"
        onClick={() => setShowPeriodSettings(!showPeriodSettings)}
      >
        기간 설정
        {showPeriodSettings ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {showPeriodSettings && (
        <div className="p-3 bg-[var(--grayLv1)] rounded mb-4 text-12 text-[var(--grayLv3)]">
          기간 설정 기능은 추후 구현 예정입니다.
        </div>
      )}

      {/* Submit Button */}
      <Button className="w-full flex items-center justify-center gap-2" onClick={handleSubmit}>
        등록하기
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
