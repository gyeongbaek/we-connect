import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, MapPin, User, Trash2, Edit2, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ROOMS, formatDate, calculateDuration, generateTimeSlots, timeToMinutes } from "../../../mock/reservationData";
import { getUserByDisplayName } from "../../../mock/userData";

export function ReservationDetailModal({
  isOpen,
  reservation,
  currentUserId,
  onClose,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const timeSlots = generateTimeSlots();
  const modalRef = useRef(null);

  useEffect(() => {
    if (reservation) {
      setEditData({
        title: reservation.title,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        roomId: reservation.roomId,
      });
      setIsEditing(false);
    }
  }, [reservation]);

  // 외부 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen || !reservation) return null;

  const room = ROOMS.find((r) => r.id === (isEditing ? editData.roomId : reservation.roomId));
  const isOwner = reservation.userId === currentUserId;
  const duration = calculateDuration(
    isEditing ? editData.startTime : reservation.startTime,
    isEditing ? editData.endTime : reservation.endTime
  );
  const userData = getUserByDisplayName(reservation.user?.nickname);

  const handleDelete = () => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      onDelete(reservation.id);
      onClose();
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(reservation.id, editData);
    }
    setIsEditing(false);
  };

  const getEndTimeOptions = () => {
    if (!editData.startTime) return timeSlots;
    const startMinutes = timeToMinutes(editData.startTime);
    return timeSlots.filter((t) => timeToMinutes(t) > startMinutes);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {isEditing ? "예약 수정" : "예약 상세"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {isEditing ? (
            /* 수정 모드 */
            <>
              {/* Room */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">공간</label>
                <div className="flex gap-2">
                  {ROOMS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setEditData({ ...editData, roomId: r.id })}
                      className={`flex-1 p-2 rounded-lg border text-center text-sm transition-all ${
                        editData.roomId === r.id
                          ? "border-2"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      style={editData.roomId === r.id ? { borderColor: r.color, backgroundColor: `${r.color}10` } : {}}
                    >
                      <span className="text-lg">{r.emoji}</span>
                      <p className="text-xs mt-1">{r.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">예약 제목</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">시작</label>
                  <select
                    value={editData.startTime}
                    onChange={(e) => setEditData({ ...editData, startTime: e.target.value, endTime: "" })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  >
                    {timeSlots.slice(0, -1).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">종료</label>
                  <select
                    value={editData.endTime}
                    onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="">선택</option>
                    {getEndTimeOptions().map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* 조회 모드 - 제목 / 날짜+시간 / 장소 / 담당자 순서 */
            <>
              {/* Title */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">제목</label>
                <h4 className="text-lg font-semibold text-slate-900">{reservation.title}</h4>
              </div>

              {/* Date & Time */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">날짜 및 시간</label>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formatDate(reservation.date)}</span>
                  <span className="text-slate-300">|</span>
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{reservation.startTime} - {reservation.endTime} ({duration}시간)</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">장소</label>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-lg">{room?.emoji}</span>
                  <span className="font-medium">{room?.name}</span>
                </div>
              </div>

              {/* User / Manager */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">담당자</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <img
                    src={`/images/profiles/${reservation.user?.nickname?.toLowerCase()}.png`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-10 h-10 rounded-full items-center justify-center text-white font-medium hidden"
                    style={{ backgroundColor: room?.color || "#6366f1" }}
                  >
                    {reservation.user?.initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {userData?.name || reservation.user?.nickname}
                    </p>
                  </div>
                  {isOwner && (
                    <span className="ml-auto text-xs px-2.5 py-1 bg-blue-500 text-white rounded-full font-medium">
                      내 예약
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-200 flex gap-2">
          {isOwner && !isEditing && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                예약 취소
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                수정하기
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                onClick={() => setIsEditing(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleSave}
                disabled={!editData.title || !editData.startTime || !editData.endTime}
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </>
          )}
          {!isOwner && !isEditing && (
            <Button
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              onClick={onClose}
            >
              닫기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
