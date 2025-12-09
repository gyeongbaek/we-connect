import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus, Users, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";

// 목 이벤트 데이터
const mockCalendarEvents = [
  {
    id: "1",
    title: "팀 스프린트 회의",
    date: "2025-12-10",
    startTime: "10:00",
    endTime: "11:00",
    participants: ["김철수", "이영희", "박민수"],
    color: "blue",
  },
  {
    id: "2",
    title: "프로젝트 리뷰",
    date: "2025-12-12",
    startTime: "14:00",
    endTime: "16:00",
    participants: ["김철수", "박민수"],
    color: "green",
  },
  {
    id: "3",
    title: "워크숍",
    date: "2025-12-15",
    startTime: null,
    endTime: null,
    isAllDay: true,
    participants: ["전체 팀"],
    color: "purple",
  },
  {
    id: "4",
    title: "송년회",
    date: "2025-12-20",
    endDate: "2025-12-20",
    startTime: "18:00",
    endTime: "21:00",
    participants: ["전체 팀"],
    color: "orange",
  },
  {
    id: "5",
    title: "연말 휴가",
    date: "2025-12-24",
    endDate: "2025-12-31",
    isAllDay: true,
    participants: [],
    color: "red",
  },
];

export function AttendanceCalendar({ records, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(mockCalendarEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);

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

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return events.filter((event) => {
      const startDate = event.date;
      const endDate = event.endDate || event.date;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // 이벤트 색상 클래스
  const getEventColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
      red: "bg-red-100 text-red-700",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700";
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date, record) => {
    if (!date) return;
    setSelectedDate(date);
    onDateSelect?.(date, record);

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    setSelectedDateForEvent(dateStr);
    setShowEventModal(true);
  };

  // 이벤트 추가 핸들러
  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
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
          const dateEvents = getEventsForDate(date);
          const isSelected = selectedDate === date;

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date, record)}
              disabled={!date}
              className={`
                h-20 p-1.5 rounded-lg relative transition-colors flex flex-col items-start overflow-hidden
                ${!date ? "invisible" : ""}
                ${isSelected ? "ring-1 ring-[var(--primary)]/40 bg-[var(--primary)]/10" : ""}
                ${!isSelected && isToday(date) ? "ring-1 ring-[var(--primary)]/30 bg-[var(--primary)]/5" : ""}
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
                  {/* 이벤트 표시 */}
                  <div className="w-full mt-0.5 space-y-0.5">
                    {dateEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[9px] px-1 py-0.5 rounded truncate ${getEventColorClass(event.color)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dateEvents.length > 2 && (
                      <div className="text-[9px] text-slate-400 px-1">
                        +{dateEvents.length - 2}개 더
                      </div>
                    )}
                  </div>
                  {status === "vacation" && !dateEvents.length && (
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

      {/* 이벤트 추가 모달 */}
      {showEventModal && (
        <EventModal
          date={selectedDateForEvent}
          events={getEventsForDate(selectedDate)}
          getEventColorClass={getEventColorClass}
          onClose={() => setShowEventModal(false)}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
}

// 이벤트 모달 컴포넌트
function EventModal({ date, events, getEventColorClass, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [isRange, setIsRange] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [participants, setParticipants] = useState("");
  const [color, setColor] = useState("blue");

  const formatDateKorean = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      date: startDate,
      endDate: isRange ? endDate : startDate,
      startTime: hasTime ? startTime : null,
      endTime: hasTime ? endTime : null,
      isAllDay: !hasTime,
      participants: participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      color,
    });
  };

  const colorOptions = [
    { value: "blue", label: "파랑", bg: "bg-blue-500" },
    { value: "green", label: "초록", bg: "bg-green-500" },
    { value: "purple", label: "보라", bg: "bg-purple-500" },
    { value: "orange", label: "주황", bg: "bg-orange-500" },
    { value: "red", label: "빨강", bg: "bg-red-500" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {formatDateKorean(date)}
            </h3>
            <p className="text-xs text-slate-400">이벤트 추가</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* 기존 이벤트 목록 */}
        {events.length > 0 && (
          <div className="px-6 py-3 border-b border-slate-100">
            <p className="text-xs text-slate-500 mb-2">이 날의 이벤트</p>
            <div className="space-y-1.5">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${getEventColorClass(event.color)}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{event.title}</span>
                    {event.startTime && (
                      <span className="text-xs opacity-75">
                        {event.startTime} - {event.endTime}
                      </span>
                    )}
                    {event.isAllDay && (
                      <span className="text-xs opacity-75">종일</span>
                    )}
                  </div>
                  {event.participants?.length > 0 && (
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Users size={10} />
                      {event.participants.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 새 이벤트 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 제목 */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              항목 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="이벤트 이름을 입력하세요"
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
              required
            />
          </div>

          {/* 날짜 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-500">
                날짜 <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={isRange}
                  onChange={(e) => setIsRange(e.target.checked)}
                  className="rounded"
                />
                기간 설정
              </label>
            </div>
            <div className={`grid ${isRange ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                required
              />
              {isRange && (
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                />
              )}
            </div>
          </div>

          {/* 시간 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-500">시간</label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={hasTime}
                  onChange={(e) => setHasTime(e.target.checked)}
                  className="rounded"
                />
                시간 설정
              </label>
            </div>
            {hasTime && (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">~</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            )}
            {!hasTime && (
              <p className="text-xs text-slate-400">종일 이벤트로 설정됩니다</p>
            )}
          </div>

          {/* 참가자 */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              참가 인원 (쉼표로 구분)
            </label>
            <div className="relative">
              <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="예: 김철수, 이영희"
                className="w-full h-10 rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* 색상 */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block">색상</label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full ${option.bg} transition-transform ${
                    color === option.value
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1 gap-1">
              <Plus size={16} />
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
