import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checklist } from "./components/Checklist";
import { Timetable } from "./components/Timetable";
import {
  mockProjects,
  mockChecklistItems,
  mockTimeBlocks,
  groupChecklistByProject,
  calculateTimeStats,
} from "../../mock/taskData";

export function TasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [checklistItems, setChecklistItems] = useState(mockChecklistItems);
  const [timeBlocks, setTimeBlocks] = useState(mockTimeBlocks);
  const [isPublic, setIsPublic] = useState(false);

  const { projectGroups, shortTermTasks } = groupChecklistByProject(
    checklistItems,
    mockProjects
  );
  const stats = calculateTimeStats(timeBlocks);

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

  const handleAddChecklistItem = ({ content, projectId }) => {
    const newItem = {
      id: `c${Date.now()}`,
      userId: "user1",
      date: currentDate.toISOString().split("T")[0],
      content,
      projectId,
      isCompleted: false,
      order: checklistItems.length + 1,
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const handleToggleItem = (itemId) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleAddTimeBlock = (blockData) => {
    const newBlock = {
      id: `t${Date.now()}`,
      userId: "user1",
      date: currentDate.toISOString().split("T")[0],
      ...blockData,
      isCompleted: false,
    };
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const handleUpdateTimeBlock = (blockId, updates) => {
    setTimeBlocks(
      timeBlocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const handleDeleteTimeBlock = (blockId) => {
    setTimeBlocks(timeBlocks.filter((block) => block.id !== blockId));
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
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleSendDiscord}
        >
          <Send className="h-4 w-4" />
          Discord 전송
        </Button>
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
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        style={{ minHeight: "600px" }}
      >
        {/* Left - Checklist */}
        <Checklist
          projectGroups={projectGroups}
          shortTermTasks={shortTermTasks}
          projects={mockProjects}
          onAddItem={handleAddChecklistItem}
          onToggleItem={handleToggleItem}
        />

        {/* Right - Timetable */}
        <Timetable
          timeBlocks={timeBlocks}
          stats={stats}
          isPublic={isPublic}
          onTogglePublic={() => setIsPublic(!isPublic)}
          onAddBlock={handleAddTimeBlock}
          onUpdateBlock={handleUpdateTimeBlock}
          onDeleteBlock={handleDeleteTimeBlock}
        />
      </div>
    </div>
  );
}
