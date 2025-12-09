import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ReservationTable } from "./components/ReservationTable";
import { ReservationModal } from "./components/ReservationModal";
import { ReservationDetailModal } from "./components/ReservationDetailModal";
import {
  ROOMS,
  mockReservations,
  formatDate,
} from "../../mock/reservationData";
import { useAppStore } from "../../stores";

export function ReservationPage() {
  const { currentUser } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservations, setReservations] = useState(mockReservations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [initialSlotData, setInitialSlotData] = useState(null);

  const currentUserId = currentUser?.id || "guest";

  // 날짜 이동
  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // 빈 슬롯 클릭 - 예약 생성 모달 열기
  const handleSlotClick = (roomId, time) => {
    // 다음 슬롯 시간 계산 (1시간 후)
    const [hour, minute] = time.split(":").map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    setInitialSlotData({
      roomId,
      date: selectedDate,
      startTime: time,
      endTime,
    });
    setIsCreateModalOpen(true);
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
        nickname: currentUser?.displayName || "Guest",
        initial: (currentUser?.displayName || "G").charAt(0).toUpperCase(),
        role: "Member",
      },
    };
    setReservations([...reservations, newReservation]);
  };

  // 예약 삭제
  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter((r) => r.id !== id));
  };

  // 선택된 날짜의 예약만 필터링
  const filteredReservations = reservations.filter(
    (r) => r.date === selectedDate
  );

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <p className="text-sm text-slate-500">
        방송실 및 강의실을 예약하세요
      </p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday}>
            오늘
          </Button>
        </div>

        {/* Room Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">공간:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedRoom(null)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                !selectedRoom
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              전체
            </button>
            {ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? "text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                style={
                  selectedRoom === room.id
                    ? { backgroundColor: room.color }
                    : undefined
                }
              >
                {room.emoji} {room.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Table */}
      <ReservationTable
        reservations={filteredReservations}
        selectedRoom={selectedRoom}
        onSlotClick={handleSlotClick}
        onReservationClick={handleReservationClick}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>범례:</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-slate-100 border border-slate-200 rounded" />
          예약 가능 (클릭 시 등록)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-100 border-l-2 border-blue-500 rounded" />
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
        reservations={filteredReservations}
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
      />
    </div>
  );
}
