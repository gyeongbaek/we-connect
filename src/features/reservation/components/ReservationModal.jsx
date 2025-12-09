import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  ROOMS,
  generateTimeSlots,
  formatDate,
  checkConflict,
  timeToMinutes,
  RESERVATION_RULES,
} from "../../../mock/reservationData";
import { getTodayString } from "../../../utils/date";

export function ReservationModal({
  isOpen,
  onClose,
  onSubmit,
  reservations,
  initialData,
}) {
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  const timeSlots = generateTimeSlots();

  // 외부 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (initialData) {
      setRoomId(initialData.roomId || "");
      setDate(initialData.date || getTodayString());
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setTitle("");
      setError(null);
    }
  }, [initialData, isOpen]);

  // 종료 시간 옵션 생성 (시작 시간 이후만)
  const getEndTimeOptions = () => {
    if (!startTime) return timeSlots;
    const startMinutes = timeToMinutes(startTime);
    return timeSlots.filter((t) => {
      const minutes = timeToMinutes(t);
      const duration = minutes - startMinutes;
      return duration > 0 && duration <= RESERVATION_RULES.maxDuration;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!roomId || !date || !startTime || !endTime || !title.trim()) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 시간 유효성 검사
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;

    if (duration < RESERVATION_RULES.minDuration) {
      setError(`최소 ${RESERVATION_RULES.minDuration}분 이상 예약해야 합니다.`);
      return;
    }

    if (duration > RESERVATION_RULES.maxDuration) {
      setError(`최대 ${RESERVATION_RULES.maxDuration / 60}시간까지 예약 가능합니다.`);
      return;
    }

    // 중복 예약 확인
    const conflicts = checkConflict(reservations, roomId, date, startTime, endTime);
    if (conflicts.length > 0) {
      const room = ROOMS.find((r) => r.id === roomId);
      setError(
        <div>
          <p className="font-medium mb-2">선택하신 시간대에 이미 예약이 있습니다.</p>
          <div className="p-2 bg-slate-100 rounded text-xs">
            <p>{room?.emoji} {room?.name}</p>
            <p>{conflicts[0].startTime} - {conflicts[0].endTime}</p>
            <p>{conflicts[0].title} - {conflicts[0].user?.nickname}</p>
          </div>
        </div>
      );
      return;
    }

    onSubmit({
      roomId,
      date,
      startTime,
      endTime,
      title: title.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  const selectedRoom = ROOMS.find((r) => r.id === roomId);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">예약 등록</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Room */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">공간</label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              {selectedRoom ? (
                <>
                  <span className="text-lg">{selectedRoom.emoji}</span>
                  <span className="text-sm font-medium">{selectedRoom.name}</span>
                </>
              ) : (
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                >
                  <option value="">공간을 선택하세요</option>
                  {ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.emoji} {room.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">날짜</label>
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              {formatDate(date)}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              시간 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setEndTime("");
                }}
                className="p-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">시작 시간</option>
                {timeSlots.slice(0, -1).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-sm"
                disabled={!startTime}
              >
                <option value="">종료 시간</option>
                {getEndTimeOptions().map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              예약 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 팟캐스트 녹음, 유튜브 촬영 등"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              예약하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
