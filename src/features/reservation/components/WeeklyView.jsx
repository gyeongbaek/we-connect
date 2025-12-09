import { useState, useEffect } from "react";
import { ROOMS, OPERATION_HOURS, timeToMinutes, minutesToTime } from "../../../mock/reservationData";
import { getUserByDisplayName } from "../../../mock/userData";
import { formatDateString, getTodayString } from "../../../utils/date";

const TIME_SLOTS = [];
for (let hour = OPERATION_HOURS.start; hour <= OPERATION_HOURS.end; hour += 2) {
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:00`);
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 주간 날짜 배열 생성
const getWeekDates = (baseDate) => {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDateString(d));
  }
  return dates;
};

export function WeeklyView({
  reservations,
  baseDate,
  onSlotClick,
  onReservationClick,
  onDragSelect,
}) {
  const weekDates = getWeekDates(baseDate);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [dragRoom, setDragRoom] = useState(null);
  const [dragDate, setDragDate] = useState(null);

  const getReservationAt = (date, roomId, time) => {
    const timeMinutes = timeToMinutes(time);
    return reservations.find((r) => {
      if (r.roomId !== roomId || r.date !== date) return false;
      const startMinutes = timeToMinutes(r.startTime);
      const endMinutes = timeToMinutes(r.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  };

  // 해당 시간 슬롯에서 예약 블록을 시작해야 하는지 확인
  // 2시간 간격 슬롯이므로, 예약 시작 시간이 현재 슬롯 ~ 다음 슬롯 사이면 현재 슬롯에서 시작
  const isReservationStart = (date, roomId, time) => {
    const slotMinutes = timeToMinutes(time);
    const nextSlotMinutes = slotMinutes + 120; // 2시간 후

    return reservations.some((r) => {
      if (r.roomId !== roomId || r.date !== date) return false;
      const startMinutes = timeToMinutes(r.startTime);
      // 예약 시작 시간이 현재 슬롯 이상, 다음 슬롯 미만이면 이 슬롯에서 표시
      return startMinutes >= slotMinutes && startMinutes < nextSlotMinutes;
    });
  };

  // 특정 슬롯에서 시작해야 하는 예약 찾기
  const getReservationStartingAt = (date, roomId, time) => {
    const slotMinutes = timeToMinutes(time);
    const nextSlotMinutes = slotMinutes + 120;

    return reservations.find((r) => {
      if (r.roomId !== roomId || r.date !== date) return false;
      const startMinutes = timeToMinutes(r.startTime);
      return startMinutes >= slotMinutes && startMinutes < nextSlotMinutes;
    });
  };

  const getReservationHeight = (reservation) => {
    const startMinutes = timeToMinutes(reservation.startTime);
    const endMinutes = timeToMinutes(reservation.endTime);
    const durationHours = (endMinutes - startMinutes) / 60;
    return (durationHours / 2) * 36;
  };

  // 드래그 핸들러
  const handleMouseDown = (roomId, time, date, e) => {
    if (getReservationAt(date, roomId, time)) return;
    e.preventDefault();
    setIsDragging(true);
    setDragRoom(roomId);
    setDragDate(date);
    setDragStart(time);
    setDragEnd(time);
  };

  const handleMouseEnter = (roomId, time, date) => {
    if (!isDragging || roomId !== dragRoom || date !== dragDate) return;
    setDragEnd(time);
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd && dragRoom && dragDate) {
      const startMinutes = timeToMinutes(dragStart);
      const endMinutes = timeToMinutes(dragEnd);
      const minTime = Math.min(startMinutes, endMinutes);
      const maxTime = Math.max(startMinutes, endMinutes) + 120;

      const finalStart = minutesToTime(minTime);
      const finalEnd = minutesToTime(Math.min(maxTime, OPERATION_HOURS.end * 60));

      if (onDragSelect) {
        onDragSelect(dragRoom, finalStart, finalEnd, dragDate);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragRoom(null);
    setDragDate(null);
  };

  const isInDragSelection = (roomId, time, date) => {
    if (!isDragging || roomId !== dragRoom || date !== dragDate) return false;
    const startMinutes = Math.min(timeToMinutes(dragStart), timeToMinutes(dragEnd));
    const endMinutes = Math.max(timeToMinutes(dragStart), timeToMinutes(dragEnd));
    const timeMinutes = timeToMinutes(time);
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  };

  const getDragColor = (roomId) => {
    const room = ROOMS.find((r) => r.id === roomId);
    return room?.color || "#3B82F6";
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd, dragRoom, dragDate]);

  const today = getTodayString();

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden select-none">
      {/* Header - Days */}
      <div
        className="grid border-b border-slate-200"
        style={{ gridTemplateColumns: `40px repeat(7, 1fr)` }}
      >
        <div className="p-2 bg-slate-50 border-r border-slate-200" />
        {weekDates.map((date, idx) => {
          const d = new Date(date);
          const isToday = date === today;
          const isWeekend = idx === 5 || idx === 6;
          return (
            <div
              key={date}
              className={`p-2 bg-slate-50 border-r border-slate-200 last:border-r-0 text-center ${
                isToday ? "bg-blue-50" : ""
              }`}
            >
              <p className={`text-[10px] ${isWeekend ? "text-red-400" : "text-slate-400"}`}>
                {DAYS[d.getDay()]}
              </p>
              <p className={`text-sm font-medium ${
                isToday ? "text-blue-600" : isWeekend ? "text-red-500" : "text-slate-700"
              }`}>
                {d.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="max-h-[450px] overflow-y-auto">
        {TIME_SLOTS.map((time) => (
          <div
            key={time}
            className="grid border-b border-slate-100 last:border-b-0"
            style={{ gridTemplateColumns: `40px repeat(7, 1fr)`, height: "36px" }}
          >
            <div className="p-1 border-r border-slate-200 flex items-start justify-end pr-1">
              <span className="text-[9px] text-slate-400">{time}</span>
            </div>

            {weekDates.map((date) => (
              <div key={date} className="grid grid-cols-3 border-r border-slate-100 last:border-r-0">
                {ROOMS.map((room) => {
                  const reservationInSlot = getReservationAt(date, room.id, time);
                  const isStart = isReservationStart(date, room.id, time);
                  const startingReservation = isStart ? getReservationStartingAt(date, room.id, time) : null;
                  const inSelection = isInDragSelection(room.id, time, date);

                  return (
                    <div
                      key={room.id}
                      className="relative border-r border-slate-50 last:border-r-0"
                      onMouseDown={(e) => handleMouseDown(room.id, time, date, e)}
                      onMouseEnter={() => handleMouseEnter(room.id, time, date)}
                    >
                      {!reservationInSlot && !startingReservation && (
                        <div
                          className={`absolute inset-0 transition-colors cursor-pointer ${
                            inSelection ? "border" : "hover:bg-slate-50"
                          }`}
                          style={inSelection ? {
                            backgroundColor: `${getDragColor(room.id)}25`,
                            borderColor: `${getDragColor(room.id)}60`,
                          } : undefined}
                        />
                      )}

                      {isStart && startingReservation && (
                        <button
                          onClick={() => onReservationClick(startingReservation)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="absolute inset-x-0 top-0 rounded text-left transition-all hover:shadow-md cursor-pointer overflow-hidden z-10 border"
                          style={{
                            height: `${getReservationHeight(startingReservation)}px`,
                            backgroundColor: `${room?.color}18`,
                            borderColor: `${room?.color}50`,
                          }}
                        >
                          <div
                            className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: room?.color }}
                          />
                          <div className="p-0.5 h-full flex flex-col">
                            <p className="text-[7px] font-semibold text-slate-700 truncate pr-2 leading-tight">
                              {startingReservation.title}
                            </p>
                            <div className="mt-auto flex items-center gap-0.5">
                              <img
                                src={`/images/profiles/${startingReservation.user?.nickname?.toLowerCase()}.png`}
                                alt=""
                                className="w-3 h-3 rounded-full object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                              <span className="text-[6px] text-slate-500 truncate">
                                {getUserByDisplayName(startingReservation.user?.nickname)?.name || startingReservation.user?.nickname}
                              </span>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-4">
        {ROOMS.map((room) => (
          <div key={room.id} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: room.color }}
            />
            <span className="text-[10px] text-slate-500">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
