import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Plus, Users, Check, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { users } from "../../../mock/userData";

// 목 이벤트 데이터
const mockCalendarEvents = [
  {
    id: "1",
    title: "위니버시티 스프린트",
    date: "2025-12-15",
    startTime: "14:00",
    endTime: "16:00",
    participants: ["Kq05gJwDEv", "xBEYJgqZ8g", "5Y06gkQezX"],
    color: "blue",
  },
  {
    id: "2",
    title: "해커톤 발표",
    date: "2025-12-10",
    startTime: "14:00",
    endTime: "16:00",
    participants: [
      "210PA1JRzx",
      "WL8JrKw68K",
      "rjzQAgmxz7",
      "p1ED7XjQzY",
      "Kq05gJwDEv",
      "YG0dV1BGEw",
      "xBEYJgqZ8g",
    ],
    color: "green",
  },
  {
    id: "3",
    title: "크리스마스",
    date: "2025-12-25",
    endDate: "2025-12-25",
    isAllDay: true,
    participants: [],
    color: "red",
  },
  {
    id: "4",
    title: "연말 회식",
    date: "2025-12-27",
    startTime: "18:00",
    endTime: "21:00",
    participants: [],
    color: "purple",
  },
];

// 현재 사용자 ID (로그인 사용자 mock)
const CURRENT_USER_ID = "ODzZq93x0R";

export function AttendanceCalendar({ records, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(mockCalendarEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    side: "right",
  });

  // 드래그 선택 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const calendarRef = useRef(null);
  const containerRef = useRef(null);

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
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
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

    const hasVacation = record.sessions?.some((s) => s.location === "VACATION");
    if (hasVacation) return "vacation";

    return "work";
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    return events.filter((event) => {
      const startDate = event.date;
      const endDate = event.endDate || event.date;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // 이벤트 색상 클래스
  const getEventColorClass = (color, isParticipating) => {
    const colorMap = {
      blue: isParticipating
        ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
        : "bg-blue-50 text-blue-600",
      green: isParticipating
        ? "bg-green-100 text-green-700 border-2 border-green-500"
        : "bg-green-50 text-green-600",
      purple: isParticipating
        ? "bg-purple-100 text-purple-700 border-2 border-purple-500"
        : "bg-purple-50 text-purple-600",
      orange: isParticipating
        ? "bg-orange-100 text-orange-700 border-2 border-orange-500"
        : "bg-orange-50 text-orange-600",
      red: isParticipating
        ? "bg-red-100 text-red-700 border-2 border-red-500"
        : "bg-red-50 text-red-600",
    };
    return (
      colorMap[color] ||
      (isParticipating
        ? "bg-gray-100 text-gray-700 border-2 border-gray-500"
        : "bg-gray-50 text-gray-600")
    );
  };

  // 현재 사용자가 참여하는지 확인 (비어있으면 전체)
  const isUserParticipating = (event) => {
    if (!event.participants || event.participants.length === 0) {
      return true; // 전체 참여
    }
    return event.participants.includes(CURRENT_USER_ID);
  };

  // 날짜 문자열 생성
  const getDateString = (date) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
  };

  // 드래그 시작
  const handleMouseDown = (date) => {
    if (!date) return;
    setIsDragging(true);
    setDragStart(date);
    setDragEnd(date);
  };

  // 드래그 중
  const handleMouseEnter = (date) => {
    if (!isDragging || !date) return;
    setDragEnd(date);
  };

  // 드래그 끝
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragStart && dragEnd) {
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);

      setSelectedDateForEvent({
        start: getDateString(start),
        end: getDateString(end),
        isRange: start !== end,
      });
      setShowEventForm(true);
      setEditingEvent(null);
    }

    setDragStart(null);
    setDragEnd(null);
  };

  // 드래그 선택 범위 확인
  const isInDragRange = (date) => {
    if (!isDragging || !dragStart || !dragEnd || !date) return false;
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    return date >= start && date <= end;
  };

  // 팝오버 위치 계산
  const calculatePopoverPosition = (element) => {
    if (!element || !containerRef.current)
      return { top: 0, left: 0, side: "right" };

    const containerRect = containerRef.current.getBoundingClientRect();
    const cellRect = element.getBoundingClientRect();
    const popoverWidth = 320;

    // 셀의 중앙 위치 기준
    const cellCenterX = cellRect.left + cellRect.width / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;

    // 왼쪽인지 오른쪽인지 판단
    const side = cellCenterX < containerCenterX ? "right" : "left";

    // top은 셀의 상단 기준
    const top = cellRect.top - containerRect.top;

    // left 계산
    let left;
    if (side === "right") {
      left = cellRect.right - containerRect.left + 12; // 셀 오른쪽에 위치
    } else {
      left = cellRect.left - containerRect.left - popoverWidth - 12; // 셀 왼쪽에 위치
    }

    return { top, left, side };
  };

  // 날짜 클릭 핸들러 (단일 클릭)
  const handleDateClick = (date, record, event) => {
    if (!date) return;
    setSelectedDate(date);
    onDateSelect?.(date, record);

    const dateStr = getDateString(date);
    setSelectedDateForEvent({
      start: dateStr,
      end: dateStr,
      isRange: false,
    });

    // 클릭한 셀의 위치 계산
    const cellElement = event.currentTarget;
    const position = calculatePopoverPosition(cellElement);
    setPopoverPosition(position);

    setShowEventForm(true);
    setEditingEvent(null);
  };

  // 이벤트 클릭 (수정)
  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDateForEvent({
      start: event.date,
      end: event.endDate || event.date,
      isRange: event.endDate && event.endDate !== event.date,
    });

    // 클릭한 이벤트의 부모 셀 위치 계산
    const cellElement = e.currentTarget.closest("[data-calendar-cell]");
    if (cellElement) {
      const position = calculatePopoverPosition(cellElement);
      setPopoverPosition(position);
    }

    setShowEventForm(true);
  };

  // 이벤트 추가/수정 핸들러
  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // 수정
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id ? { ...e, ...eventData } : e
        )
      );
    } else {
      // 추가
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
      };
      setEvents([...events, newEvent]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // 이벤트 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // 폼 닫기
  const handleCloseForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setSelectedDateForEvent(null);
  };

  return (
    <div
      ref={containerRef}
      className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] relative"
    >
      <div className="p-4">
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
        <div
          ref={calendarRef}
          className="grid grid-cols-7 gap-1 select-none"
          onMouseLeave={() => {
            if (isDragging) {
              handleMouseUp();
            }
          }}
        >
          {days.map((date, idx) => {
            const status = getDateStatus(date);
            const record = date ? getRecordForDate(date) : null;
            const dateEvents = getEventsForDate(date);
            const isSelected = selectedDate === date;
            const inDragRange = isInDragRange(date);

            return (
              <div
                key={idx}
                data-calendar-cell
                onMouseDown={() => handleMouseDown(date)}
                onMouseEnter={() => handleMouseEnter(date)}
                onMouseUp={handleMouseUp}
                onClick={(e) => !isDragging && handleDateClick(date, record, e)}
                className={`
                    h-24 p-1.5 rounded-lg relative transition-colors flex flex-col items-start overflow-hidden
                    ${!date ? "invisible" : ""}
                    ${
                      inDragRange
                        ? "bg-[var(--primary)]/20 ring-1 ring-[var(--primary)]"
                        : ""
                    }
                    ${
                      isSelected && !inDragRange
                        ? "ring-1 ring-[var(--primary)]/40 bg-[var(--primary)]/10"
                        : ""
                    }
                    ${
                      !isSelected && !inDragRange && isToday(date)
                        ? "ring-1 ring-[var(--primary)]/30 bg-[var(--primary)]/5"
                        : ""
                    }
                    ${
                      date && !isSelected && !inDragRange
                        ? "hover:bg-[var(--grayLv1)] cursor-pointer"
                        : ""
                    }
                    ${date ? "cursor-pointer" : ""}
                  `}
              >
                {date && (
                  <>
                    <span
                      className={`text-12 font-medium ${
                        isSelected || inDragRange
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
                    <div className="w-full mt-0.5 space-y-0.5 flex-1 overflow-hidden">
                      {dateEvents.slice(0, 2).map((event) => {
                        const isParticipating = isUserParticipating(event);
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(e, event)}
                            className={`text-[10px] px-1 py-0.5 rounded truncate flex items-center justify-between gap-1 ${getEventColorClass(
                              event.color,
                              isParticipating
                            )}`}
                          >
                            <span className="truncate text-left flex-1">
                              {event.title}
                            </span>
                            {event.startTime && (
                              <span className="text-[9px] opacity-75 shrink-0">
                                {event.startTime}
                              </span>
                            )}
                          </div>
                        );
                      })}
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
              </div>
            );
          })}
        </div>
      </div>

      {/* 이벤트 팝오버 */}
      {showEventForm && (
        <EventPopover
          key={editingEvent?.id || selectedDateForEvent?.start || "new"}
          dateInfo={selectedDateForEvent}
          editingEvent={editingEvent}
          position={popoverPosition}
          onClose={handleCloseForm}
          onSubmit={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

// 이벤트 팝오버 컴포넌트 (말풍선 스타일)
function EventPopover({
  dateInfo,
  editingEvent,
  position,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [startDate, setStartDate] = useState(
    editingEvent?.date || dateInfo?.start || ""
  );
  const [endDate, setEndDate] = useState(
    editingEvent?.endDate || dateInfo?.end || dateInfo?.start || ""
  );
  const [isRange, setIsRange] = useState(
    editingEvent
      ? editingEvent.endDate && editingEvent.endDate !== editingEvent.date
      : dateInfo?.isRange || false
  );
  const [hasTime, setHasTime] = useState(
    editingEvent ? !!editingEvent.startTime : false
  );
  const [startTime, setStartTime] = useState(
    editingEvent?.startTime || "09:00"
  );
  const [endTime, setEndTime] = useState(editingEvent?.endTime || "10:00");
  const [selectedParticipants, setSelectedParticipants] = useState(
    editingEvent?.participants || []
  );
  const [color, setColor] = useState(editingEvent?.color || "blue");
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const popoverRef = useRef(null);

  const formatDateKorean = (dateStr) => {
    if (!dateStr) return "";
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
      participants: selectedParticipants,
      color,
    });
  };

  const toggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const colorOptions = [
    { value: "blue", label: "파랑", bg: "bg-blue-500" },
    { value: "green", label: "초록", bg: "bg-green-500" },
    { value: "purple", label: "보라", bg: "bg-purple-500" },
    { value: "orange", label: "주황", bg: "bg-orange-500" },
    { value: "red", label: "빨강", bg: "bg-red-500" },
  ];

  // 팝오버 위치 스타일 계산
  const popoverStyle = {
    position: "absolute",
    top: Math.max(0, position.top),
    left: position.left,
    zIndex: 50,
  };

  return (
    <>
      {/* 배경 클릭 영역 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 팝오버 */}
      <div
        ref={popoverRef}
        style={popoverStyle}
        className="w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 말풍선 화살표 */}
        <div
          className={`absolute top-6 w-3 h-3 bg-white border-slate-200 transform rotate-45 ${
            position.side === "right"
              ? "-left-1.5 border-l border-b"
              : "-right-1.5 border-r border-t"
          }`}
        />

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              {editingEvent ? "일정 수정" : "새 일정"}
            </h3>
            <p className="text-xs text-slate-500">
              {formatDateKorean(startDate)}
              {isRange &&
                endDate !== startDate &&
                ` ~ ${formatDateKorean(endDate)}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {editingEvent && (
              <button
                type="button"
                onClick={() => onDelete(editingEvent.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg group"
                title="삭제"
              >
                <Trash2 size={16} className="text-slate-400 group-hover:text-red-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-3 max-h-[400px] overflow-y-auto"
        >
          {/* 제목 */}
          <div>
            <label className="text-xs text-slate-600 mb-1 block">
              일정 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 이름을 입력하세요"
              className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
              autoFocus
            />
          </div>

          {/* 날짜 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600">날짜</label>
              <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRange}
                  onChange={(e) => setIsRange(e.target.checked)}
                  className="rounded w-3.5 h-3.5"
                />
                기간 설정
              </label>
            </div>
            <div
              className={`grid ${
                isRange ? "grid-cols-2" : "grid-cols-1"
              } gap-2`}
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
              {isRange && (
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              )}
            </div>
          </div>

          {/* 시간 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600">시간</label>
              <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTime}
                  onChange={(e) => setHasTime(e.target.checked)}
                  className="rounded w-3.5 h-3.5"
                />
                시간 설정
              </label>
            </div>
            {hasTime ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 h-9 rounded-lg border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-slate-400 text-xs">~</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 h-9 rounded-lg border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400">종일 일정으로 설정됩니다</p>
            )}
          </div>

          {/* 참가자 */}
          <div>
            <label className="text-xs text-slate-600 mb-1 block">참여자</label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowParticipantDropdown(!showParticipantDropdown)
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <span className="text-slate-800">
                  {selectedParticipants.length === 0 || selectedParticipants.includes("ALL")
                    ? "전체"
                    : `${selectedParticipants.length}명 선택됨`}
                </span>
                <Users size={14} className="text-slate-400" />
              </button>

              {showParticipantDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {/* 전체 옵션 */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParticipants([]);
                      setShowParticipantDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        selectedParticipants.length === 0
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedParticipants.length === 0 && (
                        <Check size={8} className="text-white" />
                      )}
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                      <Users size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium">전체</span>
                  </button>
                  {/* 개별 사용자 목록 */}
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleParticipant(user.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          selectedParticipants.includes(user.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedParticipants.includes(user.id) && (
                          <Check size={8} className="text-white" />
                        )}
                      </div>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                          {user.displayName?.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-slate-700">
                        {user.displayName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 참가자 표시 */}
            {selectedParticipants.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedParticipants.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  if (!user) return null;
                  return (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-700"
                    >
                      {user.displayName}
                      <button
                        type="button"
                        onClick={() => toggleParticipant(userId)}
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1">모든 팀원이 참여 대상입니다</p>
            )}
          </div>

          {/* 색상 */}
          <div>
            <label className="text-xs text-slate-600 mb-1.5 block">색상</label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-6 h-6 rounded-full ${
                    option.bg
                  } transition-transform ${
                    color === option.value
                      ? "ring-2 ring-offset-1 ring-slate-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="flex-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center gap-1"
            >
              {editingEvent ? (
                "수정하기"
              ) : (
                <>
                  <Plus size={14} /> 추가하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
