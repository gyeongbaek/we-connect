import { useState } from "react";
import { AttendanceCalendar } from "./components/AttendanceCalendar";
import { CheckInPanel } from "./components/CheckInPanel";
import { VacationStatus } from "./components/VacationStatus";
import { WorkHistoryWidget } from "./components/WorkHistoryWidget";
import {
  mockAttendanceRecords,
  mockVacationBalance,
} from "../../mock/attendanceData";

export function AttendancePage() {
  const [records, setRecords] = useState(mockAttendanceRecords);
  const [vacationBalances, setVacationBalances] = useState(mockVacationBalance);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCheckIn = (data) => {
    // 기간 설정이 있는 경우 여러 날짜에 대해 기록 생성
    if (data.period) {
      const start = new Date(data.period.startDate);
      const end = new Date(data.period.endDate);
      const newRecords = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // 주말 제외
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const dateStr = d.toISOString().split("T")[0];
        newRecords.push({
          id: `${Date.now()}-${dateStr}`,
          userId: "user1",
          date: dateStr,
          sessions: [
            {
              id: `s${Date.now()}-1`,
              type: "MORNING",
              location: data.morning.location,
              startTime: `${String(data.morning.start).padStart(2, "0")}:00`,
              endTime: `${String(data.lunch.start).padStart(2, "0")}:00`,
              lunchBreak: false,
            },
            {
              id: `s${Date.now()}-2`,
              type: "AFTERNOON",
              location: data.afternoon.location,
              startTime: `${String(data.lunch.end).padStart(2, "0")}:00`,
              endTime: `${String(data.afternoon.end).padStart(2, "0")}:00`,
              lunchBreak: true,
            },
          ],
          totalHours: data.totalHours,
          status: "COMPLETED",
        });
      }

      setRecords([...newRecords, ...records]);
      alert(`${newRecords.length}일의 출근이 등록되었습니다!`);
    } else {
      // 단일 날짜 등록
      const today = new Date().toISOString().split("T")[0];
      const newRecord = {
        id: Date.now().toString(),
        userId: "user1",
        date: today,
        sessions: [
          {
            id: `s${Date.now()}-1`,
            type: "MORNING",
            location: data.morning.location,
            startTime: `${String(data.morning.start).padStart(2, "0")}:00`,
            endTime: `${String(data.lunch.start).padStart(2, "0")}:00`,
            lunchBreak: false,
          },
          {
            id: `s${Date.now()}-2`,
            type: "AFTERNOON",
            location: data.afternoon.location,
            startTime: `${String(data.lunch.end).padStart(2, "0")}:00`,
            endTime: `${String(data.afternoon.end).padStart(2, "0")}:00`,
            lunchBreak: true,
          },
        ],
        totalHours: data.totalHours,
        status: "IN_PROGRESS",
      };

      setRecords([newRecord, ...records]);
      alert("출근이 등록되었습니다!");
    }
  };

  const handleVacationRequest = (data) => {
    console.log("Vacation request:", data);
    alert(`${data.type} 휴가가 신청되었습니다!`);
  };

  const handleDateSelect = (date, record) => {
    setSelectedDate({ date, record });
    console.log("Selected date:", date, record);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-14 text-[var(--grayLv3)]">
          출퇴근 기록과 휴가를 관리합니다
        </p>
      </div>

      {/* Main Content - 모바일: 캘린더 > 출근하기 > 휴가현황 > 근무히스토리 순서 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 1. 캘린더 */}
        <div className="lg:col-span-2 order-1">
          <AttendanceCalendar
            records={records}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* 2. 출근하기 */}
        <div className="order-2 lg:order-2">
          <CheckInPanel />
        </div>

        {/* 3. 휴가 현황 */}
        <div className="order-3 lg:order-4">
          <VacationStatus
            balances={vacationBalances}
            onRequestVacation={handleVacationRequest}
          />
        </div>

        {/* 4. 근무 히스토리 */}
        <div className="lg:col-span-2 order-4 lg:order-3">
          <WorkHistoryWidget />
        </div>
      </div>
    </div>
  );
}
