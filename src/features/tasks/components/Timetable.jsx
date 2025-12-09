import { useState, useRef, useEffect, useMemo } from "react";
import { Lock, Unlock, X, Palmtree } from "lucide-react";

// 시간 -> 분 변환
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// 분 -> 시간 변환
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export function Timetable({
  timeBlocks,
  stats,
  isPublic,
  onTogglePublic,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  vacationInfo = null,
  attendanceInfo = null,
}) {
  // 근무 시간 기반 운영 시간 계산
  const operationHours = useMemo(() => {
    const start = attendanceInfo?.startTime ?? 9;
    const end = attendanceInfo?.endTime ?? 18;
    return { start, end };
  }, [attendanceInfo]);

  // 시간 슬롯 동적 생성
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = operationHours.start; hour <= operationHours.end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, [operationHours]);
  // 블록 드래그 (리사이즈만)
  const [draggingBlock, setDraggingBlock] = useState(null);
  const [dragType, setDragType] = useState(null); // 'resize-start' | 'resize-end'
  const [dragPreview, setDragPreview] = useState(null);
  const [dragStartY, setDragStartY] = useState(0);

  // 외부에서 드래그 오버
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const bodyRef = useRef(null);

  // Y 좌표를 시간(분)으로 변환
  const yToMinutes = (y) => {
    if (!bodyRef.current) return 0;
    const rect = bodyRef.current.getBoundingClientRect();
    const relativeY = y - rect.top;
    const totalHeight = rect.height;
    const totalMinutes = (operationHours.end - operationHours.start) * 60;
    const minutes =
      (relativeY / totalHeight) * totalMinutes + operationHours.start * 60;
    // 30분 단위로 반올림
    return Math.round(minutes / 30) * 30;
  };

  // 충돌 확인
  const hasConflict = (startMin, endMin, excludeBlockId = null) => {
    return timeBlocks.some((block) => {
      if (excludeBlockId && block.id === excludeBlockId) return false;
      if (block.type === "VACATION") return false; // 휴가는 충돌 체크 제외
      const blockStart = timeToMinutes(block.startTime);
      const blockEnd = timeToMinutes(block.endTime);
      return startMin < blockEnd && endMin > blockStart;
    });
  };

  // 체크리스트에서 드래그 오버
  const handleDragOver = (e) => {
    e.preventDefault();
    const minutes = yToMinutes(e.clientY);
    setDragOverSlot(minutes);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  // 체크리스트에서 드롭
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverSlot(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const dropMinutes = yToMinutes(e.clientY);
      const startMinutes = dropMinutes;
      const endMinutes = startMinutes + 60; // 기본 1시간

      // 충돌 확인
      if (!hasConflict(startMinutes, endMinutes)) {
        onAddBlock({
          startTime: minutesToTime(startMinutes),
          endTime: minutesToTime(
            Math.min(endMinutes, operationHours.end * 60)
          ),
          content: data.content,
          type: "WORK",
          projectId: data.projectId,
          checklistItemId: data.id,
          projectColor: data.projectColor || "#8d9299",
          projectName: data.projectName || "단기 업무",
        });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  // 블록 이동 시작
  const handleBlockMoveDrag = (block, e) => {
    if (block.type === "VACATION" || block.type === "BREAK") return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingBlock(block);
    setDragType("move");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: block.startTime,
      endTime: block.endTime,
    });
  };

  // 블록 리사이즈 시작 (상단)
  const handleResizeStartDrag = (block, e) => {
    if (block.type === "VACATION" || block.type === "BREAK") return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingBlock(block);
    setDragType("resize-start");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: block.startTime,
      endTime: block.endTime,
    });
  };

  // 블록 리사이즈 시작 (하단)
  const handleResizeEndDrag = (block, e) => {
    if (block.type === "VACATION" || block.type === "BREAK") return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingBlock(block);
    setDragType("resize-end");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: block.startTime,
      endTime: block.endTime,
    });
  };

  // 블록 드래그 중 (이동 + 리사이즈)
  const handleBlockDragMove = (e) => {
    if (!draggingBlock || !dragType) return;

    const currentMinutes = yToMinutes(e.clientY);
    const originalStart = timeToMinutes(draggingBlock.startTime);
    const originalEnd = timeToMinutes(draggingBlock.endTime);
    const duration = originalEnd - originalStart;

    let newStart, newEnd;

    if (dragType === "move") {
      // 이동: 블록 중심을 기준으로 이동
      const blockCenter = (originalStart + originalEnd) / 2;
      const offset = currentMinutes - blockCenter;
      newStart = Math.round((originalStart + offset) / 30) * 30;
      newEnd = newStart + duration;

      // 범위 제한
      if (newStart < operationHours.start * 60) {
        newStart = operationHours.start * 60;
        newEnd = newStart + duration;
      }
      if (newEnd > operationHours.end * 60) {
        newEnd = operationHours.end * 60;
        newStart = newEnd - duration;
      }
    } else if (dragType === "resize-start") {
      newStart = Math.max(
        operationHours.start * 60,
        Math.min(currentMinutes, originalEnd - 30)
      );
      newEnd = originalEnd;
    } else if (dragType === "resize-end") {
      newStart = originalStart;
      newEnd = Math.min(
        operationHours.end * 60,
        Math.max(currentMinutes, originalStart + 30)
      );
    }

    setDragPreview({
      startTime: minutesToTime(newStart),
      endTime: minutesToTime(newEnd),
    });
  };

  // 블록 리사이즈 종료
  const handleBlockDragEnd = () => {
    if (!draggingBlock || !dragPreview || !onUpdateBlock) {
      setDraggingBlock(null);
      setDragType(null);
      setDragPreview(null);
      return;
    }

    const hasChanges =
      dragPreview.startTime !== draggingBlock.startTime ||
      dragPreview.endTime !== draggingBlock.endTime;

    if (hasChanges) {
      const newStart = timeToMinutes(dragPreview.startTime);
      const newEnd = timeToMinutes(dragPreview.endTime);

      // 충돌 확인
      if (!hasConflict(newStart, newEnd, draggingBlock.id)) {
        onUpdateBlock(draggingBlock.id, {
          startTime: dragPreview.startTime,
          endTime: dragPreview.endTime,
        });
      }
    }

    setDraggingBlock(null);
    setDragType(null);
    setDragPreview(null);
  };

  // 전역 마우스 이벤트 (블록 드래그용)
  useEffect(() => {
    if (draggingBlock) {
      const handleMove = (e) => handleBlockDragMove(e);
      const handleUp = () => handleBlockDragEnd();

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [draggingBlock, dragType, dragPreview, dragStartY]);

  // 블록 스타일 계산
  const getBlockStyle = (block) => {
    const startMinutes = timeToMinutes(block.startTime);
    const endMinutes = timeToMinutes(block.endTime);
    const startOffset = startMinutes - operationHours.start * 60;
    const duration = endMinutes - startMinutes;
    const top = (startOffset / 60) * 60; // 1시간 = 60px
    const height = (duration / 60) * 60;
    return { top: `${top}px`, height: `${Math.max(height, 30)}px` };
  };

  // 블록 색상
  const getBlockColor = (block) => {
    if (block.type === "VACATION") return "#10b981"; // 휴가는 초록색
    if (block.type === "BREAK") return "#94a3b8"; // 휴게는 회색
    return block.projectColor || "#3b82f6";
  };

  // 시간 포맷팅
  const formatHours = (hours, minutes) => {
    if (hours === 0 && minutes === 0) return "0시간";
    if (minutes === 0) return `${hours}시간`;
    return `${hours}시간 ${minutes}분`;
  };

  // 블록 이동 미리보기 스타일
  const getBlockPreviewStyle = () => {
    if (!dragPreview) return null;
    const startMinutes = timeToMinutes(dragPreview.startTime);
    const endMinutes = timeToMinutes(dragPreview.endTime);
    const startOffset = startMinutes - operationHours.start * 60;
    const duration = endMinutes - startMinutes;
    return {
      top: `${(startOffset / 60) * 60 + 4}px`,
      height: `${Math.max((duration / 60) * 60 - 8, 22)}px`,
    };
  };

  // 드래그 오버 미리보기 스타일
  const getDragOverStyle = () => {
    if (dragOverSlot === null) return null;
    const startOffset = dragOverSlot - operationHours.start * 60;
    return {
      top: `${(startOffset / 60) * 60}px`,
      height: "60px",
    };
  };

  // 휴가 및 점심 블록 생성
  const getSystemBlocks = () => {
    const blocks = [];

    // 점심 시간 블록 (출근 정보 기반)
    if (attendanceInfo) {
      const lunchStartTime = `${String(
        attendanceInfo.lunchStart || 12
      ).padStart(2, "0")}:00`;
      const lunchEndTime = `${String(attendanceInfo.lunchEnd || 13).padStart(
        2,
        "0"
      )}:00`;
      blocks.push({
        id: "lunch-break",
        type: "BREAK",
        content: "휴게 시간",
        startTime: lunchStartTime,
        endTime: lunchEndTime,
      });
    }

    // 휴가 블록
    if (vacationInfo) {
      if (vacationInfo.type === "연차") {
        blocks.push({
          id: "vacation-full",
          type: "VACATION",
          content: "연차",
          startTime: "09:00",
          endTime: "19:00",
        });
      } else if (vacationInfo.type === "오전반차") {
        blocks.push({
          id: "vacation-am",
          type: "VACATION",
          content: "오전반차",
          startTime: "09:00",
          endTime: `${String(attendanceInfo?.lunchStart || 12).padStart(
            2,
            "0"
          )}:00`,
        });
      } else if (vacationInfo.type === "오후반차") {
        blocks.push({
          id: "vacation-pm",
          type: "VACATION",
          content: "오후반차",
          startTime: `${String(attendanceInfo?.lunchEnd || 13).padStart(
            2,
            "0"
          )}:00`,
          endTime: "19:00",
        });
      }
    }
    return blocks;
  };

  // 전체 블록 (시스템 블록 포함: 휴가, 점심)
  const allBlocks = [...timeBlocks, ...getSystemBlocks()];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🗓️</span>
          <h3 className="text-base font-semibold">타임테이블</h3>
          <button
            onClick={onTogglePublic}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
              isPublic
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-500"
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
      <div className="flex gap-4 text-xs mb-4 text-slate-500">
        <span>
          기록:{" "}
          <span className="text-slate-700 font-medium">
            {formatHours(stats.workHours, stats.workMinutes)}
          </span>
        </span>
        <span>
          완료:{" "}
          <span className="text-blue-600 font-medium">
            {formatHours(stats.completedHours, stats.completedMinutes)}
          </span>
        </span>
      </div>

      {/* Timetable Grid */}
      <div
        ref={bodyRef}
        className="relative select-none ml-10"
        style={{
          height: `${(operationHours.end - operationHours.start) * 60}px`,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 드래그 오버 미리보기 */}
        {dragOverSlot !== null &&
          (() => {
            const overStyle = getDragOverStyle();
            if (!overStyle) return null;
            return (
              <div
                className="absolute left-0 right-2 z-20 pointer-events-none"
                style={overStyle}
              >
                <div className="h-full rounded-lg border-2 border-dashed border-blue-500 bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    여기에 놓기
                  </span>
                </div>
              </div>
            );
          })()}

        {/* 블록 리사이즈 미리보기 */}
        {draggingBlock &&
          dragPreview &&
          (() => {
            const previewStyle = getBlockPreviewStyle();
            if (!previewStyle) return null;
            const blockColor = getBlockColor(draggingBlock);
            return (
              <div
                className="absolute left-0 right-2 z-30 pointer-events-none"
                style={previewStyle}
              >
                <div
                  className="h-full rounded-lg border-2 border-dashed flex items-center justify-center"
                  style={{
                    backgroundColor: `${blockColor}30`,
                    borderColor: blockColor,
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: blockColor }}
                  >
                    {dragPreview.startTime} - {dragPreview.endTime}
                  </span>
                </div>
              </div>
            );
          })()}

        {/* Time Labels & Grid Lines */}
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className="absolute w-full h-[60px] border-b border-slate-100 border-l border-l-slate-200"
            style={{ top: `${index * 60}px` }}
          >
            <span className="absolute -left-10 w-9 text-right text-[10px] text-slate-400">
              {time}
            </span>
            {/* 30분 라인 */}
            <div
              className="absolute w-full h-px bg-slate-50"
              style={{ top: "30px" }}
            />
          </div>
        ))}

        {/* Time Blocks */}
        {allBlocks.map((block) => {
          const isDraggingThis = draggingBlock?.id === block.id;
          const blockColor = getBlockColor(block);
          const blockStyle = getBlockStyle(block);
          const heightNum = parseInt(blockStyle.height);
          const isCompact = heightNum <= 60;
          const isVacation = block.type === "VACATION";
          const isBreak = block.type === "BREAK";
          const canResize = !isVacation && !isBreak;
          const canDelete = !isVacation && !isBreak;

          // 시스템 블록(휴게/휴가)은 상단에 표시
          const zIndex = isBreak || isVacation ? 10 : 1;
          // 휴게: 연한 색 + 작은 영역, 휴가: 불투명, 일반: 반투명
          const bgColor = isBreak ? `${blockColor}50` : isVacation ? blockColor : `${blockColor}30`;

          // 휴게 시간은 업무 블록보다 작게 가운데 정렬
          const breakStyle = isBreak ? {
            width: "96%",
            height: `${parseInt(blockStyle.height) * 0.85}px`,
            left: "2%",
            top: `${parseInt(blockStyle.top) + parseInt(blockStyle.height) * 0.075}px`,
          } : {};

          return (
            <div
              key={block.id}
              className={`time-block absolute rounded-lg transition-all group border ${
                isDraggingThis
                  ? "opacity-50"
                  : canResize
                  ? "hover:shadow-lg cursor-move"
                  : ""
              }`}
              style={{
                ...blockStyle,
                backgroundColor: bgColor,
                borderColor: `${blockColor}60`,
                zIndex,
                left: isBreak ? undefined : "1%",
                right: isBreak ? undefined : "1%",
                width: isBreak ? undefined : "98%",
                ...breakStyle,
              }}
              onMouseDown={canResize ? (e) => handleBlockMoveDrag(block, e) : undefined}
            >
              {/* 상단 리사이즈 핸들 */}
              {canResize && (
                <div
                  className="absolute -top-1 left-0 right-0 h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleResizeStartDrag(block, e)}
                >
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ backgroundColor: blockColor }}
                  />
                </div>
              )}

              {/* 메인 콘텐츠 */}
              <div className="h-full px-2 py-1">
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-medium truncate block ${
                        isVacation ? "text-white" : isBreak ? "text-slate-600" : ""
                      }`}
                      style={{ color: isVacation || isBreak ? undefined : blockColor }}
                    >
                      {isVacation && (
                        <Palmtree className="inline h-3 w-3 mr-1" />
                      )}
                      {isBreak && "☕ "}
                      {block.content}
                    </span>
                    {!isCompact &&
                      block.projectName &&
                      block.type === "WORK" && (
                        <span className="text-[10px] text-slate-500 truncate block">
                          {block.projectName}
                        </span>
                      )}
                    {!isBreak && (
                      <span
                        className={`text-[10px] block ${
                          isVacation ? "text-white/80" : "text-slate-400"
                        }`}
                      >
                        {block.startTime} - {block.endTime}
                      </span>
                    )}
                  </div>
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                      className="p-0.5 rounded hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" style={{ color: blockColor }} />
                    </button>
                  )}
                </div>
              </div>

              {/* 하단 리사이즈 핸들 */}
              {canResize && (
                <div
                  className="absolute -bottom-1 left-0 right-0 h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleResizeEndDrag(block, e)}
                >
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ backgroundColor: blockColor }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="mt-2 pt-2 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400">
          드래그: 이동 | 상하 핸들: 시간 조절 | 체크리스트에서 드래그: 추가
        </p>
      </div>
    </div>
  );
}
