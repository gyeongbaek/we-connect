import { useState, useRef } from "react";
import { Lock, Unlock, GripVertical } from "lucide-react";

const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => i + 9); // 9:00 ~ 18:00

export function Timetable({
  timeBlocks,
  stats,
  isPublic,
  onTogglePublic,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
}) {
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const containerRef = useRef(null);

  const handleDragOver = (e, hour) => {
    e.preventDefault();
    setDragOverSlot(hour);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    setDragOverSlot(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      onAddBlock({
        startTime: `${String(hour).padStart(2, "0")}:00`,
        endTime: `${String(hour + 1).padStart(2, "0")}:00`,
        content: data.content,
        type: "WORK",
        projectId: data.projectId,
        checklistItemId: data.id,
        projectColor: data.projectColor,
        projectName: data.projectName,
      });
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const getBlockStyle = (block) => {
    const [startH, startM] = block.startTime.split(":").map(Number);
    const [endH, endM] = block.endTime.split(":").map(Number);

    const startOffset = (startH - 9) * 60 + startM;
    const duration = (endH - startH) * 60 + (endM - startM);

    // 60px per hour
    const top = (startOffset / 60) * 60;
    const height = (duration / 60) * 60;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 30)}px`,
    };
  };

  const getBlockColor = (block) => {
    if (block.type === "LUNCH") return "var(--warn)";
    if (block.type === "BREAK") return "var(--grayLv2)";
    return block.projectColor || "var(--primary)";
  };

  const formatHours = (hours, minutes) => {
    if (hours === 0 && minutes === 0) return "0시간";
    if (minutes === 0) return `${hours}시간`;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-16">🍅</span>
          <h3 className="text-16 text-semibold">타임테이블</h3>
          <button
            onClick={onTogglePublic}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-10 ${
              isPublic
                ? "bg-[var(--activation)] text-[var(--primary)]"
                : "bg-[var(--grayLv1)] text-[var(--grayLv3)]"
            }`}
          >
            {isPublic ? (
              <>
                <Unlock className="h-3 w-3" /> 공개
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> 비공개
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-12 mb-4 text-[var(--grayLv3)]">
        <span>
          기록:{" "}
          <span className="text-[var(--surface)]">
            {formatHours(stats.workHours, stats.workMinutes)}
          </span>
        </span>
        <span>
          휴식:{" "}
          <span className="text-[var(--surface)]">
            {formatHours(stats.breakHours, stats.breakMinutes)}
          </span>
        </span>
        <span>
          완료:{" "}
          <span className="text-[var(--primary)]">
            {formatHours(stats.completedHours, stats.completedMinutes)}
          </span>
        </span>
      </div>

      {/* Timetable Grid */}
      <div
        ref={containerRef}
        className="relative border-l border-[var(--grayLv2)]"
        style={{ height: `${TIME_SLOTS.length * 60}px` }}
      >
        {/* Time Labels & Grid Lines */}
        {TIME_SLOTS.map((hour) => (
          <div
            key={hour}
            className={`absolute w-full h-[60px] border-b border-[var(--grayLv1)] ${
              dragOverSlot === hour ? "bg-[var(--activation)]" : ""
            }`}
            style={{ top: `${(hour - 9) * 60}px` }}
            onDragOver={(e) => handleDragOver(e, hour)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, hour)}
          >
            <span className="absolute -left-1 -translate-x-full text-10 text-[var(--grayLv3)] pr-2">
              {String(hour).padStart(2, "0")}:00
            </span>
          </div>
        ))}

        {/* Time Blocks */}
        {timeBlocks.map((block) => (
          <div
            key={block.id}
            className="absolute left-8 right-2 rounded px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity group"
            style={{
              ...getBlockStyle(block),
              backgroundColor: getBlockColor(block),
            }}
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <span className="text-12 text-white font-medium truncate block">
                  {block.type === "LUNCH" && "🍽️ "}
                  {block.content}
                </span>
                {block.projectName && block.type === "WORK" && (
                  <span className="text-10 text-white/70 truncate block">
                    {block.projectName}
                  </span>
                )}
              </div>
              <GripVertical className="h-4 w-4 text-white/50 opacity-0 group-hover:opacity-100 cursor-grab flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {timeBlocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-14 text-[var(--grayLv3)]">
            체크리스트에서 업무를 드래그해주세요
          </p>
        </div>
      )}
    </div>
  );
}
