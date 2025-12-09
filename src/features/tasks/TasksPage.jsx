import { useState } from "react";
import { ChevronLeft, ChevronRight, Send, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checklist } from "./components/Checklist";
import { Timetable } from "./components/Timetable";
import { PomodoroTimer } from "./components/PomodoroTimer";
import {
  useVacationStore,
  useAttendanceStore,
  useTaskStore,
} from "../../stores";

export function TasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPublic, setIsPublic] = useState(false);

  // 업무 스토어
  const {
    projects,
    checklistItems,
    timeBlocks,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistStatus,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    getProjectGroups,
    getTimeStats,
  } = useTaskStore();

  // 휴가 및 근태 정보 가져오기
  const { getVacationForDate } = useVacationStore();
  const { registeredAttendance, startTime, endTime, lunchStart, lunchEnd } =
    useAttendanceStore();

  // 현재 날짜의 휴가 정보 확인
  const dateStr = currentDate.toISOString().split("T")[0];
  const todayVacation = getVacationForDate(dateStr);

  // 휴가 정보를 타임테이블 형식으로 변환
  const getVacationType = (vacation) => {
    if (!vacation) return null;
    if (vacation.timeType === "FULL") return "연차";
    if (vacation.timeType === "MORNING") return "오전반차";
    if (vacation.timeType === "AFTERNOON") return "오후반차";
    return null;
  };
  const vacationInfo = todayVacation
    ? { type: getVacationType(todayVacation) }
    : null;

  // 현재 날짜의 출근 정보 확인
  const todayAttendance = registeredAttendance[dateStr] || {
    startTime,
    endTime,
    lunchStart,
    lunchEnd,
  };

  const { projectGroups, shortTermTasks } = getProjectGroups();
  const stats = getTimeStats(
    todayAttendance.lunchStart,
    todayAttendance.lunchEnd
  );

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = days[date.getDay()];
    return { year, month, day, dayName };
  };

  const { year, month, day, dayName } = formatDate(currentDate);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleSendDiscord = () => {
    alert("Discord로 업무일지가 전송되었습니다!");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-14 text-[var(--grayLv3)]">
            오늘의 업무를 기록하고 관리합니다
          </p>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handlePrevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-16 text-semibold">
          {year}년 {month}월 {day}일 {dayName}요일
        </span>
        <Button variant="ghost" size="icon" onClick={handleNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left - Pomodoro & Timetable */}
        <div className="flex flex-col">
          <PomodoroTimer />
          <Timetable
            timeBlocks={timeBlocks}
            stats={stats}
            isPublic={isPublic}
            onTogglePublic={() => setIsPublic(!isPublic)}
            onAddBlock={addTimeBlock}
            onUpdateBlock={updateTimeBlock}
            onDeleteBlock={deleteTimeBlock}
            vacationInfo={vacationInfo}
            attendanceInfo={todayAttendance}
          />
        </div>

        {/* Right - Checklist */}
        <Checklist
          projectGroups={projectGroups}
          shortTermTasks={shortTermTasks}
          projects={projects}
          onAddItem={addChecklistItem}
          onToggleItem={toggleChecklistItem}
          onUpdateItemStatus={updateChecklistStatus}
        />
      </div>
    </div>
  );
}
