import { ROOMS } from "../../../mock/reservationData";
import { getTodayString } from "../../../utils/date";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const getMonthCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendar = [];
  let week = [];

  for (let i = 0; i < startDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);
  }

  return calendar;
};

export function MonthlyView({
  reservations,
  year,
  month,
  onDateClick,
  onReservationClick,
  onSlotClick,
}) {
  const calendar = getMonthCalendar(year, month);
  const todayStr = getTodayString();

  const getReservationsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const dayReservations = reservations.filter((r) => r.date === dateStr);

    return dayReservations.sort((a, b) => {
      const roomOrder = { studio1: 0, studio2: 1, classroom: 2 };
      const roomDiff = (roomOrder[a.roomId] || 0) - (roomOrder[b.roomId] || 0);
      if (roomDiff !== 0) return roomDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const formatDateStr = (day) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {DAYS.map((day, idx) => (
          <div
            key={day}
            className={`p-2 bg-slate-50 text-center text-xs font-medium ${
              idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-slate-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="divide-y divide-slate-100">
        {calendar.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 divide-x divide-slate-100">
            {week.map((day, dayIdx) => {
              const dateStr = day ? formatDateStr(day) : null;
              const isToday = dateStr === todayStr;
              const dayReservations = getReservationsForDate(day);
              const isWeekend = dayIdx === 0 || dayIdx === 6;

              return (
                <div
                  key={dayIdx}
                  className={`min-h-[100px] p-1.5 ${
                    day ? "cursor-pointer hover:bg-slate-50" : "bg-slate-50"
                  } ${isToday ? "bg-blue-50" : ""}`}
                  onClick={() => day && onSlotClick && onSlotClick(dateStr)}
                >
                  {day && (
                    <>
                      <p
                        className={`text-xs font-medium mb-1.5 ${
                          isToday
                            ? "text-blue-600"
                            : isWeekend
                            ? dayIdx === 0
                              ? "text-red-500"
                              : "text-blue-500"
                            : "text-slate-700"
                        }`}
                      >
                        {day}
                      </p>
                      <div className="space-y-1">
                        {dayReservations.slice(0, 3).map((r) => {
                          const room = ROOMS.find((rm) => rm.id === r.roomId);
                          return (
                            <button
                              key={r.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReservationClick(r);
                              }}
                              className="w-full text-left px-1.5 py-1 rounded border text-[8px] transition-all hover:shadow-sm flex items-center gap-1"
                              style={{
                                backgroundColor: `${room?.color}15`,
                                borderColor: `${room?.color}40`,
                              }}
                            >
                              {/* On Air dot (공간 색상) */}
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: room?.color }}
                              />
                              {/* 프로필 이미지 */}
                              <img
                                src={`/images/profiles/${r.user?.nickname?.toLowerCase()}.png`}
                                alt=""
                                className="w-4 h-4 rounded-full object-cover shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full items-center justify-center text-[7px] font-bold text-white shrink-0 hidden"
                                style={{ backgroundColor: room?.color }}
                              >
                                {r.user?.initial}
                              </div>
                              {/* 시간 */}
                              <span className="text-slate-400 shrink-0">{r.startTime.slice(0, 5)}</span>
                              {/* 제목 */}
                              <span className="text-slate-600 truncate flex-1">{r.title}</span>
                            </button>
                          );
                        })}
                        {dayReservations.length > 3 && (
                          <p className="text-[8px] text-slate-400 text-center">
                            +{dayReservations.length - 3}개 더
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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
        <span className="text-[10px] text-slate-400 ml-2">클릭하여 예약</span>
      </div>
    </div>
  );
}
