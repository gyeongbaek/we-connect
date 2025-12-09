import { ROOMS, OPERATION_HOURS, timeToMinutes } from "../../../mock/reservationData";

const TIME_SLOTS = [];
for (let hour = OPERATION_HOURS.start; hour <= OPERATION_HOURS.end; hour++) {
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:00`);
}

export function ReservationTable({
  reservations,
  selectedRoom,
  onSlotClick,
  onReservationClick,
}) {
  const filteredRooms = selectedRoom
    ? ROOMS.filter((r) => r.id === selectedRoom)
    : ROOMS;

  // 특정 공간, 시간에 해당하는 예약 찾기
  const getReservationAt = (roomId, time) => {
    const timeMinutes = timeToMinutes(time);
    return reservations.find((r) => {
      if (r.roomId !== roomId) return false;
      const startMinutes = timeToMinutes(r.startTime);
      const endMinutes = timeToMinutes(r.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  };

  // 예약 블록이 시작되는 시간인지 확인
  const isReservationStart = (roomId, time) => {
    return reservations.some((r) => r.roomId === roomId && r.startTime === time);
  };

  // 예약 블록의 높이 계산 (1시간 = 60px 기준)
  const getReservationHeight = (reservation) => {
    const startMinutes = timeToMinutes(reservation.startTime);
    const endMinutes = timeToMinutes(reservation.endTime);
    const durationHours = (endMinutes - startMinutes) / 60;
    return durationHours * 60; // 1시간 = 60px
  };

  const room = ROOMS.find((r) => r.id === selectedRoom);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: `60px repeat(${filteredRooms.length}, 1fr)` }}>
        <div className="p-3 bg-slate-50 border-r border-slate-200" />
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="p-3 bg-slate-50 border-r border-slate-200 last:border-r-0 text-center"
          >
            <span className="text-lg mr-1">{room.emoji}</span>
            <span className="text-sm font-medium text-slate-700">{room.name}</span>
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="relative">
        {TIME_SLOTS.map((time, idx) => (
          <div
            key={time}
            className="grid border-b border-slate-100 last:border-b-0"
            style={{ gridTemplateColumns: `60px repeat(${filteredRooms.length}, 1fr)`, height: "60px" }}
          >
            {/* Time Label */}
            <div className="p-2 border-r border-slate-200 flex items-start justify-end pr-3">
              <span className="text-xs text-slate-400">{time}</span>
            </div>

            {/* Room Cells */}
            {filteredRooms.map((room) => {
              const reservation = getReservationAt(room.id, time);
              const isStart = reservation && isReservationStart(room.id, time);

              return (
                <div
                  key={room.id}
                  className="relative border-r border-slate-100 last:border-r-0"
                >
                  {/* Empty slot - clickable */}
                  {!reservation && (
                    <button
                      onClick={() => onSlotClick(room.id, time)}
                      className="absolute inset-0 hover:bg-blue-50 transition-colors cursor-pointer"
                    />
                  )}

                  {/* Reservation Block */}
                  {isStart && (
                    <button
                      onClick={() => onReservationClick(reservation)}
                      className="absolute left-1 right-1 top-1 rounded-lg p-2 text-left transition-all hover:shadow-md cursor-pointer overflow-hidden z-10"
                      style={{
                        height: `${getReservationHeight(reservation) - 8}px`,
                        backgroundColor: `${ROOMS.find((r) => r.id === room.id)?.color}20`,
                        borderLeft: `3px solid ${ROOMS.find((r) => r.id === room.id)?.color}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: ROOMS.find((r) => r.id === room.id)?.color }}
                      >
                        {reservation.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {reservation.user?.nickname}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {reservation.startTime}-{reservation.endTime}
                      </p>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
