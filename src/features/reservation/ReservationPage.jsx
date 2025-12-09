import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ReservationTable } from "./components/ReservationTable";
import { WeeklyView } from "./components/WeeklyView";
import { MonthlyView } from "./components/MonthlyView";
import { ReservationModal } from "./components/ReservationModal";
import { ReservationDetailModal } from "./components/ReservationDetailModal";
import { mockReservations } from "../../mock/reservationData";
import { useAppStore } from "../../stores";
import { formatDateString, getTodayString } from "../../utils/date";

const VIEW_TYPES = [
  { id: "day", label: "일" },
  { id: "week", label: "주" },
  { id: "month", label: "월" },
];

export function ReservationPage() {
  const { currentUser } = useAppStore();
  const [viewType, setViewType] = useState("day");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [reservations, setReservations] = useState(mockReservations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [initialSlotData, setInitialSlotData] = useState(null);

  const currentUserId = currentUser?.id || "guest";
  const currentDate = new Date(selectedDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 날짜/주/월 이동
  const handlePrev = () => {
    const date = new Date(selectedDate);
    if (viewType === "day") {
      date.setDate(date.getDate() - 1);
    } else if (viewType === "week") {
      date.setDate(date.getDate() - 7);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    setSelectedDate(formatDateString(date));
  };

  const handleNext = () => {
    const date = new Date(selectedDate);
    if (viewType === "day") {
      date.setDate(date.getDate() + 1);
    } else if (viewType === "week") {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    setSelectedDate(formatDateString(date));
  };

  const handleToday = () => {
    setSelectedDate(getTodayString());
  };

  // 날짜 포맷 함수
  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = days[d.getDay()];
    return { year, month, day, dayName };
  };

  const {
    year: displayYear,
    month: displayMonth,
    day: displayDay,
    dayName,
  } = formatDateDisplay(selectedDate);

  // 주간 날짜 범위 계산
  const getWeekRange = () => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: formatDateDisplay(monday),
      end: formatDateDisplay(sunday),
    };
  };

  // 빈 슬롯 클릭 - 예약 생성 모달 열기
  const handleSlotClick = (roomId, time, date = selectedDate) => {
    const [hour, minute] = time.split(":").map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    setInitialSlotData({
      roomId,
      date,
      startTime: time,
      endTime,
    });
    setIsCreateModalOpen(true);
  };

  // 드래그로 시간 범위 선택 - 예약 생성 모달 열기
  const handleDragSelect = (
    roomId,
    startTime,
    endTime,
    date = selectedDate
  ) => {
    setInitialSlotData({
      roomId,
      date,
      startTime,
      endTime,
    });
    setIsCreateModalOpen(true);
  };

  // 날짜 클릭 (월간 뷰에서)
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setViewType("day");
  };

  // 예약 블록 클릭 - 상세 모달 열기
  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  // 예약 생성
  const handleCreateReservation = (data) => {
    const newReservation = {
      id: `r${Date.now()}`,
      ...data,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
      user: {
        id: currentUserId,
        nickname: currentUser?.displayName,
        initial: (currentUser?.displayName).charAt(0).toUpperCase(),
        role: "Member",
      },
    };
    setReservations([...reservations, newReservation]);
  };

  // 예약 삭제
  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter((r) => r.id !== id));
  };

  // 예약 수정
  const handleUpdateReservation = (id, data) => {
    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  // 뷰 타입에 따른 예약 필터링
  const getFilteredReservations = () => {
    if (viewType === "day") {
      return reservations.filter((r) => r.date === selectedDate);
    } else if (viewType === "week") {
      const date = new Date(selectedDate);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date);
      monday.setDate(diff);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return reservations.filter((r) => {
        const rDate = new Date(r.date);
        return rDate >= monday && rDate <= sunday;
      });
    } else {
      return reservations.filter((r) => {
        const rDate = new Date(r.date);
        return (
          rDate.getFullYear() === currentYear &&
          rDate.getMonth() === currentMonth
        );
      });
    }
  };

  const filteredReservations = getFilteredReservations();

  const weekRange = getWeekRange();

  return (
    <div className="space-y-4">
      {/* Header */}
      <p className="text-14 text-[var(--grayLv3)]">
        방송실 및 강의실을 예약하세요
      </p>

      {/* Date Navigation - 업무 일지 스타일 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-16 text-semibold">
            {viewType === "day" && (
              <>
                {displayYear}년 {displayMonth}월 {displayDay}일 {dayName}요일
              </>
            )}
            {viewType === "week" && (
              <>
                {weekRange.start.month}월 {weekRange.start.day}일 ~{" "}
                {weekRange.end.month}월 {weekRange.end.day}일
              </>
            )}
            {viewType === "month" && (
              <>
                {currentYear}년 {currentMonth + 1}월
              </>
            )}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="text-xs text-slate-500"
          >
            오늘
          </Button>
        </div>

        {/* View Type Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {VIEW_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setViewType(type.id)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewType === type.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      {viewType === "day" && (
        <ReservationTable
          reservations={filteredReservations}
          onSlotClick={handleSlotClick}
          onReservationClick={handleReservationClick}
          onDragSelect={handleDragSelect}
          onReservationUpdate={handleUpdateReservation}
        />
      )}

      {viewType === "week" && (
        <WeeklyView
          reservations={filteredReservations}
          baseDate={selectedDate}
          onSlotClick={handleSlotClick}
          onReservationClick={handleReservationClick}
          onDragSelect={handleDragSelect}
        />
      )}

      {viewType === "month" && (
        <MonthlyView
          reservations={filteredReservations}
          year={currentYear}
          month={currentMonth}
          onDateClick={handleDateClick}
          onReservationClick={handleReservationClick}
          onSlotClick={handleDateClick}
        />
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>범례:</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-slate-100 border border-slate-200 rounded" />
          예약 가능 (클릭 시 등록)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300 border border-gray-500 rounded" />
          예약됨 (클릭 시 상세)
        </span>
      </div>

      {/* Modals */}
      <ReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setInitialSlotData(null);
        }}
        onSubmit={handleCreateReservation}
        reservations={reservations}
        initialData={initialSlotData}
      />

      <ReservationDetailModal
        isOpen={isDetailModalOpen}
        reservation={selectedReservation}
        currentUserId={currentUserId}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReservation(null);
        }}
        onDelete={handleDeleteReservation}
        onUpdate={handleUpdateReservation}
      />
    </div>
  );
}
