import { useState, useRef, useEffect } from "react";
import {
  ROOMS,
  OPERATION_HOURS,
  timeToMinutes,
  minutesToTime,
} from "../../../mock/reservationData";
import { getUserByDisplayName } from "../../../mock/userData";

const TIME_SLOTS = [];
for (let hour = OPERATION_HOURS.start; hour <= OPERATION_HOURS.end; hour++) {
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:00`);
}

export function ReservationTable({
  reservations,
  onSlotClick,
  onReservationClick,
  onDragSelect,
  onReservationUpdate,
}) {
  // 빈 슬롯 드래그 (새 예약 생성)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [dragRoom, setDragRoom] = useState(null);

  // 예약 블록 드래그 (이동/리사이즈)
  const [draggingReservation, setDraggingReservation] = useState(null);
  const [dragType, setDragType] = useState(null); // 'move' | 'resize-start' | 'resize-end'
  const [dragPreview, setDragPreview] = useState(null); // { startTime, endTime, roomId }
  const [dragStartY, setDragStartY] = useState(0);

  // 드래그 직후 클릭 방지용
  const justDraggedRef = useRef(false);

  const tableRef = useRef(null);
  const bodyRef = useRef(null);

  // 항상 모든 공간 표시
  const displayRooms = ROOMS;

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

  // 해당 시간 슬롯에서 예약 블록을 시작해야 하는지 확인
  // 1시간 간격 슬롯이므로, 예약 시작 시간이 현재 슬롯 ~ 다음 슬롯 사이면 현재 슬롯에서 시작
  const isReservationStart = (roomId, time) => {
    const slotMinutes = timeToMinutes(time);
    const nextSlotMinutes = slotMinutes + 60; // 1시간 후

    return reservations.some((r) => {
      if (r.roomId !== roomId) return false;
      const startMinutes = timeToMinutes(r.startTime);
      // 예약 시작 시간이 현재 슬롯 이상, 다음 슬롯 미만이면 이 슬롯에서 표시
      return startMinutes >= slotMinutes && startMinutes < nextSlotMinutes;
    });
  };

  // 특정 슬롯에서 시작해야 하는 예약 찾기
  const getReservationStartingAt = (roomId, time) => {
    const slotMinutes = timeToMinutes(time);
    const nextSlotMinutes = slotMinutes + 60;

    return reservations.find((r) => {
      if (r.roomId !== roomId) return false;
      const startMinutes = timeToMinutes(r.startTime);
      return startMinutes >= slotMinutes && startMinutes < nextSlotMinutes;
    });
  };

  // 예약 블록의 높이 계산 (1시간 = 60px 기준)
  const getReservationHeight = (reservation) => {
    const startMinutes = timeToMinutes(reservation.startTime);
    const endMinutes = timeToMinutes(reservation.endTime);
    const durationHours = (endMinutes - startMinutes) / 60;
    return durationHours * 60; // 1시간 = 60px
  };

  // 드래그 시작 (Y 좌표 기반 30분 단위)
  const handleMouseDown = (roomId, time, e) => {
    // 이미 예약된 슬롯이면 드래그 시작하지 않음
    if (getReservationAt(roomId, time)) return;

    e.preventDefault();
    const startMinutes = yToMinutes(e.clientY);
    setIsDragging(true);
    setDragRoom(roomId);
    setDragStart(minutesToTime(startMinutes));
    setDragEnd(minutesToTime(startMinutes));
  };

  // 드래그 중 (Y 좌표 기반)
  const handleMouseMove = (e) => {
    if (!isDragging || !dragRoom) return;
    const currentMinutes = yToMinutes(e.clientY);
    setDragEnd(minutesToTime(currentMinutes));
  };

  // 드래그 종료
  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd && dragRoom) {
      const startMinutes = timeToMinutes(dragStart);
      const endMinutes = timeToMinutes(dragEnd);

      // 30분 단위로 정리, 최소 30분
      const minTime = Math.min(startMinutes, endMinutes);
      const maxTime = Math.max(startMinutes, endMinutes);

      // 같은 위치면 30분 추가
      const finalEndMinutes = maxTime === minTime ? minTime + 30 : maxTime;

      const finalStart = minutesToTime(minTime);
      const finalEnd = minutesToTime(
        Math.min(finalEndMinutes, OPERATION_HOURS.end * 60)
      );

      // 드래그 범위 내에 예약이 있는지 확인
      const hasConflict = reservations.some((r) => {
        if (r.roomId !== dragRoom) return false;
        const rStart = timeToMinutes(r.startTime);
        const rEnd = timeToMinutes(r.endTime);
        return minTime < rEnd && finalEndMinutes > rStart;
      });

      if (!hasConflict && onDragSelect) {
        onDragSelect(dragRoom, finalStart, finalEnd);
      } else if (!hasConflict) {
        onSlotClick(dragRoom, finalStart);
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragRoom(null);
  };

  // 전역 마우스 이벤트 (새 예약 드래그용)
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, dragEnd, dragRoom]);

  // 드래그 선택된 시간 범위 표시
  const getDragTimeRange = () => {
    if (!dragStart || !dragEnd) return null;
    const startMinutes = Math.min(
      timeToMinutes(dragStart),
      timeToMinutes(dragEnd)
    );
    const maxMinutes = Math.max(
      timeToMinutes(dragStart),
      timeToMinutes(dragEnd)
    );
    // 같은 위치면 30분 추가
    const endMinutes = maxMinutes === startMinutes ? startMinutes + 30 : maxMinutes;
    return `${minutesToTime(startMinutes)} - ${minutesToTime(
      Math.min(endMinutes, OPERATION_HOURS.end * 60)
    )}`;
  };

  // Y 좌표를 시간(분)으로 변환
  const yToMinutes = (y) => {
    if (!bodyRef.current) return 0;
    const rect = bodyRef.current.getBoundingClientRect();
    const relativeY = y - rect.top;
    const totalHeight = rect.height;
    const totalMinutes = (OPERATION_HOURS.end - OPERATION_HOURS.start) * 60;
    const minutes =
      (relativeY / totalHeight) * totalMinutes + OPERATION_HOURS.start * 60;
    // 30분 단위로 반올림
    return Math.round(minutes / 30) * 30;
  };

  // X 좌표를 공간(roomId)으로 변환
  const xToRoomId = (x) => {
    if (!bodyRef.current) return null;
    const rect = bodyRef.current.getBoundingClientRect();
    const relativeX = x - rect.left - 60; // 60px는 시간 컬럼
    const roomWidth = (rect.width - 60) / displayRooms.length;
    const roomIndex = Math.floor(relativeX / roomWidth);
    const clampedIndex = Math.max(
      0,
      Math.min(roomIndex, displayRooms.length - 1)
    );
    return displayRooms[clampedIndex]?.id;
  };

  // 예약 블록 드래그 시작 (이동)
  const handleReservationDragStart = (reservation, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingReservation(reservation);
    setDragType("move");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      roomId: reservation.roomId,
    });
  };

  // 예약 블록 리사이즈 시작 (상단 - 시작 시간)
  const handleResizeStartDrag = (reservation, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingReservation(reservation);
    setDragType("resize-start");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      roomId: reservation.roomId,
    });
  };

  // 예약 블록 리사이즈 시작 (하단 - 종료 시간)
  const handleResizeEndDrag = (reservation, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingReservation(reservation);
    setDragType("resize-end");
    setDragStartY(e.clientY);
    setDragPreview({
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      roomId: reservation.roomId,
    });
  };

  // 예약 드래그 중 마우스 이동
  const handleReservationDragMove = (e) => {
    if (!draggingReservation || !dragType) return;

    const currentMinutes = yToMinutes(e.clientY);
    const originalStart = timeToMinutes(draggingReservation.startTime);
    const originalEnd = timeToMinutes(draggingReservation.endTime);
    const duration = originalEnd - originalStart;

    let newStart, newEnd;
    let newRoomId = draggingReservation.roomId;

    if (dragType === "move") {
      // 이동: 드래그 시작점 기준으로 전체 블록 이동
      const startMinutesAtDragStart = yToMinutes(dragStartY);
      const offset = currentMinutes - startMinutesAtDragStart;
      newStart = originalStart + offset;
      newEnd = originalEnd + offset;

      // 범위 제한
      if (newStart < OPERATION_HOURS.start * 60) {
        newStart = OPERATION_HOURS.start * 60;
        newEnd = newStart + duration;
      }
      if (newEnd > OPERATION_HOURS.end * 60) {
        newEnd = OPERATION_HOURS.end * 60;
        newStart = newEnd - duration;
      }

      // 공간 이동 (가로 드래그)
      const targetRoomId = xToRoomId(e.clientX);
      if (targetRoomId) {
        newRoomId = targetRoomId;
      }
    } else if (dragType === "resize-start") {
      // 시작 시간 변경
      newStart = Math.max(
        OPERATION_HOURS.start * 60,
        Math.min(currentMinutes, originalEnd - 30)
      );
      newEnd = originalEnd;
    } else if (dragType === "resize-end") {
      // 종료 시간 변경
      newStart = originalStart;
      newEnd = Math.min(
        OPERATION_HOURS.end * 60,
        Math.max(currentMinutes, originalStart + 30)
      );
    }

    setDragPreview({
      startTime: minutesToTime(newStart),
      endTime: minutesToTime(newEnd),
      roomId: newRoomId,
    });
  };

  // 예약 드래그 종료
  const handleReservationDragEnd = () => {
    // 드래그가 있었음을 표시 (클릭 방지용)
    justDraggedRef.current = true;
    setTimeout(() => {
      justDraggedRef.current = false;
    }, 100);

    if (!draggingReservation || !dragPreview || !onReservationUpdate) {
      setDraggingReservation(null);
      setDragType(null);
      setDragPreview(null);
      return;
    }

    // 변경 사항이 있는지 확인
    const hasChanges =
      dragPreview.startTime !== draggingReservation.startTime ||
      dragPreview.endTime !== draggingReservation.endTime ||
      dragPreview.roomId !== draggingReservation.roomId;

    if (hasChanges) {
      // 충돌 확인 (새 공간에서)
      const newStart = timeToMinutes(dragPreview.startTime);
      const newEnd = timeToMinutes(dragPreview.endTime);
      const hasConflict = reservations.some((r) => {
        if (r.id === draggingReservation.id) return false;
        if (r.roomId !== dragPreview.roomId) return false;
        const rStart = timeToMinutes(r.startTime);
        const rEnd = timeToMinutes(r.endTime);
        return newStart < rEnd && newEnd > rStart;
      });

      if (!hasConflict) {
        onReservationUpdate(draggingReservation.id, {
          startTime: dragPreview.startTime,
          endTime: dragPreview.endTime,
          roomId: dragPreview.roomId,
        });
      }
    }

    setDraggingReservation(null);
    setDragType(null);
    setDragPreview(null);
  };

  // 전역 마우스 이벤트 (예약 드래그용)
  useEffect(() => {
    if (draggingReservation) {
      const handleMove = (e) => handleReservationDragMove(e);
      const handleUp = () => handleReservationDragEnd();

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [draggingReservation, dragType, dragPreview, dragStartY]);

  // 드래그 중인 예약의 미리보기 높이/위치 계산
  const getPreviewStyle = () => {
    if (!dragPreview || !draggingReservation) return null;
    const startMinutes = timeToMinutes(dragPreview.startTime);
    const endMinutes = timeToMinutes(dragPreview.endTime);
    const durationHours = (endMinutes - startMinutes) / 60;
    const topOffset = ((startMinutes - OPERATION_HOURS.start * 60) / 60) * 60; // 1시간 = 60px
    const roomIndex = displayRooms.findIndex(
      (r) => r.id === dragPreview.roomId
    );
    return {
      height: `${durationHours * 60 - 8}px`,
      top: `${topOffset + 4}px`,
      roomIndex,
    };
  };

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
      ref={tableRef}
    >
      {/* Drag Selection Info */}
      {isDragging && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          {getDragTimeRange()} 선택 중...
        </div>
      )}

      {/* Table Header */}
      <div
        className="grid border-b border-slate-200"
        style={{
          gridTemplateColumns: `60px repeat(${displayRooms.length}, 1fr)`,
        }}
      >
        <div className="p-3 bg-slate-50 border-r border-slate-200" />
        {displayRooms.map((room) => (
          <div
            key={room.id}
            className="p-3 bg-slate-50 border-r border-slate-200 last:border-r-0 text-center"
          >
            <span className="text-lg mr-1">{room.emoji}</span>
            <span className="text-sm font-medium text-slate-700">
              {room.name}
            </span>
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="relative select-none" ref={bodyRef}>
        {/* 새 예약 드래그 선택 미리보기 */}
        {isDragging && dragStart && dragEnd && dragRoom && (() => {
          const startMinutes = Math.min(timeToMinutes(dragStart), timeToMinutes(dragEnd));
          const maxMinutes = Math.max(timeToMinutes(dragStart), timeToMinutes(dragEnd));
          const endMinutes = maxMinutes === startMinutes ? startMinutes + 30 : maxMinutes;
          const durationHours = (endMinutes - startMinutes) / 60;
          const topOffset = ((startMinutes - OPERATION_HOURS.start * 60) / 60) * 60;
          const roomIndex = displayRooms.findIndex((r) => r.id === dragRoom);
          const roomColor = displayRooms[roomIndex]?.color || "#3B82F6";

          return (
            <div
              className="absolute z-30 pointer-events-none"
              style={{
                left: `calc(60px + ${roomIndex} * ((100% - 60px) / ${displayRooms.length}) + 4px)`,
                width: `calc((100% - 60px) / ${displayRooms.length} - 8px)`,
                top: `${topOffset + 4}px`,
                height: `${Math.max(durationHours * 60 - 8, 22)}px`,
              }}
            >
              <div
                className="h-full rounded-lg border-2 border-dashed flex items-center justify-center"
                style={{
                  backgroundColor: `${roomColor}30`,
                  borderColor: roomColor,
                }}
              >
                <span className="text-xs font-medium" style={{ color: roomColor }}>
                  {minutesToTime(startMinutes)} - {minutesToTime(Math.min(endMinutes, OPERATION_HOURS.end * 60))}
                </span>
              </div>
            </div>
          );
        })()}

        {/* 드래그 중인 예약 미리보기 */}
        {draggingReservation &&
          dragPreview &&
          (() => {
            const previewStyle = getPreviewStyle();
            if (!previewStyle) return null;

            const { roomIndex, ...styleProps } = previewStyle;
            const roomColor = displayRooms[roomIndex]?.color;
            const roomName = displayRooms[roomIndex]?.name;
            const isRoomChanged =
              dragPreview.roomId !== draggingReservation.roomId;

            return (
              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  left: `calc(60px + ${roomIndex} * ((100% - 60px) / ${displayRooms.length}) + 4px)`,
                  width: `calc((100% - 60px) / ${displayRooms.length} - 8px)`,
                  ...styleProps,
                }}
              >
                <div
                  className="h-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: `${roomColor}30`,
                    borderColor: roomColor,
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: roomColor }}
                  >
                    {dragPreview.startTime} - {dragPreview.endTime}
                  </span>
                  {isRoomChanged && (
                    <span
                      className="text-[10px] font-medium mt-0.5"
                      style={{ color: roomColor }}
                    >
                      → {roomName}
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

        {TIME_SLOTS.map((time) => (
          <div
            key={time}
            className="grid border-b border-slate-100 last:border-b-0"
            style={{
              gridTemplateColumns: `60px repeat(${displayRooms.length}, 1fr)`,
              height: "60px",
            }}
          >
            {/* Time Label */}
            <div className="p-2 border-r border-slate-200 flex items-start justify-end pr-3">
              <span className="text-xs text-slate-400">{time}</span>
            </div>

            {/* Room Cells */}
            {displayRooms.map((room) => {
              const reservationInSlot = getReservationAt(room.id, time);
              const isStart = isReservationStart(room.id, time);
              const startingReservation = isStart
                ? getReservationStartingAt(room.id, time)
                : null;

              return (
                <div
                  key={room.id}
                  className="relative border-r border-slate-100 last:border-r-0"
                  onMouseDown={(e) => handleMouseDown(room.id, time, e)}
                >
                  {/* Empty slot */}
                  {!reservationInSlot && !startingReservation && (
                    <div className="absolute inset-0 transition-colors cursor-pointer hover:bg-slate-50" />
                  )}

                  {/* Reservation Block */}
                  {isStart &&
                    startingReservation &&
                    (() => {
                      const heightPx =
                        getReservationHeight(startingReservation);
                      const isCompact = heightPx <= 60;
                      const roomColor = ROOMS.find(
                        (r) => r.id === room.id
                      )?.color;
                      const isDraggingThis =
                        draggingReservation?.id === startingReservation.id;

                      // 30분 단위 오프셋 계산 (슬롯 내에서의 위치)
                      const slotMinutes = timeToMinutes(time);
                      const reservationStartMinutes = timeToMinutes(startingReservation.startTime);
                      const offsetMinutes = reservationStartMinutes - slotMinutes;
                      const topOffsetPx = (offsetMinutes / 60) * 60; // 1시간 = 60px

                      return (
                        <div
                          className={`absolute left-1 right-1 rounded-lg text-left transition-all cursor-pointer overflow-visible z-10 border group ${
                            isDraggingThis ? "opacity-50" : "hover:shadow-lg"
                          }`}
                          style={{
                            top: `${topOffsetPx + 4}px`,
                            height: `${heightPx - 8}px`,
                            backgroundColor: `${roomColor}30`,
                            borderColor: `${roomColor}60`,
                          }}
                        >
                          {/* 상단 리사이즈 핸들 */}
                          <div
                            className="absolute -top-1 left-0 right-0 h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) =>
                              handleResizeStartDrag(startingReservation, e)
                            }
                          >
                            <div
                              className="w-8 h-1 rounded-full"
                              style={{ backgroundColor: roomColor }}
                            />
                          </div>

                          {/* 메인 콘텐츠 (클릭 시 상세, 드래그 시 이동) */}
                          <div
                            className="h-full cursor-move"
                            onClick={(e) => {
                              e.stopPropagation();
                              // 드래그 직후에는 클릭 이벤트 무시
                              if (!justDraggedRef.current && !draggingReservation) {
                                onReservationClick(startingReservation);
                              }
                            }}
                            onMouseDown={(e) =>
                              handleReservationDragStart(startingReservation, e)
                            }
                          >
                            {/* On Air 스타일 색상 dot */}
                            <div
                              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full animate-pulse"
                              style={{ backgroundColor: roomColor }}
                            />

                            {isCompact ? (
                              /* 1시간 예약일 때 - 컴팩트 레이아웃 */
                              <div className="p-2 h-full flex items-center gap-2">
                                <img
                                  src={`/images/profiles/${startingReservation.user?.nickname?.toLowerCase()}.png`}
                                  alt={startingReservation.user?.nickname}
                                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-white shadow-sm"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div
                                  className="w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-white shrink-0 hidden"
                                  style={{ backgroundColor: roomColor }}
                                >
                                  {startingReservation.user?.initial}
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {startingReservation.title}{" "}
                                    <span className="font-normal text-slate-400">
                                      ({startingReservation.startTime}-
                                      {startingReservation.endTime})
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ) : (
                              /* 2시간 이상 예약일 때 - 기존 레이아웃 */
                              <div className="p-3 h-full flex flex-col">
                                <p className="text-sm font-semibold text-slate-800 truncate pr-4">
                                  {startingReservation.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {startingReservation.startTime} -{" "}
                                  {startingReservation.endTime}
                                </p>
                                <div className="mt-auto flex items-center gap-2">
                                  <img
                                    src={`/images/profiles/${startingReservation.user?.nickname?.toLowerCase()}.png`}
                                    alt={startingReservation.user?.nickname}
                                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                  <div
                                    className="w-7 h-7 rounded-full items-center justify-center text-xs font-bold text-white shrink-0 hidden"
                                    style={{ backgroundColor: roomColor }}
                                  >
                                    {startingReservation.user?.initial}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-slate-700 font-medium truncate">
                                      {getUserByDisplayName(
                                        startingReservation.user?.nickname
                                      )?.name ||
                                        startingReservation.user?.nickname}
                                    </span>
                                    <span className="text-[10px] text-slate-400 truncate">
                                      {startingReservation.user?.nickname}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 하단 리사이즈 핸들 */}
                          <div
                            className="absolute -bottom-1 left-0 right-0 h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) =>
                              handleResizeEndDrag(startingReservation, e)
                            }
                          >
                            <div
                              className="w-8 h-1 rounded-full"
                              style={{ backgroundColor: roomColor }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-[10px] text-slate-400">
          빈 슬롯 드래그: 새 예약 | 예약 블록 드래그: 시간/공간 이동 | 상하 핸들
          드래그: 시간 조절
        </p>
      </div>
    </div>
  );
}
