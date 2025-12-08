export const TimeRangeBar = ({
  startHour,
  endHour,
  lunchStart,
  lunchEnd,
  isMorningVacation = false,
  isAfternoonVacation = false,
}) => {
  const minHour = 6;
  const maxHour = 22;
  const totalHours = maxHour - minHour;

  const getPosition = (hour) => ((hour - minHour) / totalHours) * 100;
  const getWidth = (start, end) => ((end - start) / totalHours) * 100;

  // 근무: 파란색, 휴가: 연한 하늘색
  const workColor = "bg-blue-500";
  const vacationColor = "bg-blue-100";
  const lunchColor = "bg-slate-300";

  return (
    <div className="relative h-4 bg-slate-100 rounded flex-1 overflow-hidden">
      {/* Morning work/vacation */}
      <div
        className={`absolute h-full ${isMorningVacation ? vacationColor : workColor} rounded-l`}
        style={{
          left: `${getPosition(startHour)}%`,
          width: `${getWidth(startHour, lunchStart)}%`,
        }}
      />
      {/* Lunch break */}
      <div
        className={`absolute h-full ${lunchColor}`}
        style={{
          left: `${getPosition(lunchStart)}%`,
          width: `${getWidth(lunchStart, lunchEnd)}%`,
        }}
      />
      {/* Afternoon work/vacation */}
      <div
        className={`absolute h-full ${isAfternoonVacation ? vacationColor : workColor} rounded-r`}
        style={{
          left: `${getPosition(lunchEnd)}%`,
          width: `${getWidth(lunchEnd, endHour)}%`,
        }}
      />
    </div>
  );
};

// 시간 스케일 헤더
export const TimeScaleHeader = () => {
  const hours = [6, 9, 12, 15, 18, 21];

  return (
    <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
      {hours.map((hour) => (
        <span key={hour}>{hour}</span>
      ))}
    </div>
  );
};
