import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Building2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

const LOCATION_ICONS = {
  REMOTE: { icon: Home, label: "재택" },
  OFFICE: { icon: Building2, label: "사무실" },
};

export function WorkRecordList({ records, stats }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return {
      display: `${date.getMonth() + 1}-${String(date.getDate()).padStart(2, "0")}`,
      day: days[date.getDay()],
    };
  };

  const renderTimeBar = (sessions) => {
    // 6시부터 22시까지 16시간 기준
    const startHour = 6;
    const totalHours = 16;

    return (
      <div className="flex-1 h-4 bg-[var(--grayLv1)] rounded relative overflow-hidden">
        {sessions.map((session, idx) => {
          const start = parseInt(session.startTime.split(":")[0]);
          const end = parseInt(session.endTime.split(":")[0]);
          const left = ((start - startHour) / totalHours) * 100;
          const width = ((end - start) / totalHours) * 100;

          return (
            <div
              key={idx}
              className="absolute h-full bg-[var(--primary)]"
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
        {/* 점심시간 표시 */}
        <div
          className="absolute h-full bg-[var(--warn)] opacity-50"
          style={{
            left: `${((12 - startHour) / totalHours) * 100}%`,
            width: `${(1 / totalHours) * 100}%`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-16 text-semibold">
            {year}년 {month}월
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-12">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[var(--primary)]" />
            근무
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[var(--activation)]" />
            휴가
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[var(--warn)]" />
            휴게
          </span>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-center text-[var(--grayLv3)] py-8">
            근무 기록이 없습니다.
          </p>
        ) : (
          records.map((record) => {
            const { display, day } = formatDate(record.date);
            const LocationIcon =
              LOCATION_ICONS[record.sessions[0]?.location]?.icon || Home;

            return (
              <div
                key={record.id}
                className="flex items-center gap-3 py-2 border-b border-[var(--grayLv1)] last:border-0"
              >
                <div className="w-16">
                  <div className="text-14 text-semibold">{display}</div>
                  <div className="text-12 text-[var(--grayLv3)]">{day}요일</div>
                </div>
                {renderTimeBar(record.sessions)}
                <LocationIcon className="h-4 w-4 text-[var(--grayLv3)]" />
                <span className="text-14 w-12 text-right">
                  {record.totalHours}h
                </span>
                <span
                  className={`text-12 px-2 py-0.5 rounded ${
                    record.status === "COMPLETED"
                      ? "bg-[var(--activation)] text-[var(--primary)]"
                      : "bg-[var(--warn)] text-[var(--surface)]"
                  }`}
                >
                  {record.status === "COMPLETED" ? "완료" : "진행중"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Monthly Summary */}
      <div className="mt-4 pt-4 border-t border-[var(--grayLv2)] flex items-center justify-between">
        <div className="text-14">
          <span className="text-[var(--grayLv3)]">이번 달 근무</span>{" "}
          <span className="text-semibold">
            {stats.totalHours}h / {stats.standardHours}h
          </span>
          <span className="ml-4 text-[var(--grayLv3)]">초과 근무</span>{" "}
          <span
            className={`text-semibold ${stats.overtimeHours >= 0 ? "text-[var(--primary)]" : "text-[var(--error)]"}`}
          >
            {stats.overtimeHours >= 0 ? "+" : ""}
            {stats.overtimeHours}h
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-[var(--primary)]">
          전체 내역 &gt;
        </Button>
      </div>
    </div>
  );
}
