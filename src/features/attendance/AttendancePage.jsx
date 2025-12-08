import { useState } from "react";
import { WorkRecordList } from "./components/WorkRecordList";
import { CheckInPanel } from "./components/CheckInPanel";
import { VacationStatus } from "./components/VacationStatus";
import {
  mockAttendanceRecords,
  mockVacationBalance,
  calculateMonthlyStats,
} from "../../mock/attendanceData";

export function AttendancePage() {
  const [records, setRecords] = useState(mockAttendanceRecords);
  const [vacationBalances, setVacationBalances] = useState(mockVacationBalance);

  const stats = calculateMonthlyStats(records);

  const handleCheckIn = (data) => {
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
          endTime: "12:00",
          lunchBreak: false,
        },
        {
          id: `s${Date.now()}-2`,
          type: "AFTERNOON",
          location: data.afternoon.location,
          startTime: "13:00",
          endTime: `${String(data.afternoon.end).padStart(2, "0")}:00`,
          lunchBreak: true,
        },
      ],
      totalHours: data.totalHours,
      status: "IN_PROGRESS",
    };

    setRecords([newRecord, ...records]);
    alert("출근이 등록되었습니다!");
  };

  const handleVacationRequest = (data) => {
    console.log("Vacation request:", data);
    alert(`${data.type} 휴가가 신청되었습니다!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-14 text-[var(--grayLv3)]">
          출퇴근 기록과 휴가를 관리합니다
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Work Records & Vacation */}
        <div className="lg:col-span-2 space-y-6">
          <WorkRecordList records={records} stats={stats} />
          <VacationStatus
            balances={vacationBalances}
            onRequestVacation={handleVacationRequest}
          />
        </div>

        {/* Right Column - Check In Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CheckInPanel onSubmit={handleCheckIn} />
          </div>
        </div>
      </div>
    </div>
  );
}
