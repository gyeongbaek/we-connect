import { X, Calendar, Clock, User, FileText, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ROOMS, formatDate, calculateDuration } from "../../../mock/reservationData";

export function ReservationDetailModal({
  isOpen,
  reservation,
  currentUserId,
  onClose,
  onDelete,
}) {
  if (!isOpen || !reservation) return null;

  const room = ROOMS.find((r) => r.id === reservation.roomId);
  const isOwner = reservation.userId === currentUserId;
  const duration = calculateDuration(reservation.startTime, reservation.endTime);

  const handleDelete = () => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      onDelete(reservation.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">예약 상세</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Room */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{room?.emoji}</span>
            <span className="text-lg font-medium text-slate-800">{room?.name}</span>
          </div>

          {/* Title */}
          <h4 className="text-xl font-semibold text-slate-900">{reservation.title}</h4>

          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(reservation.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                {reservation.startTime} - {reservation.endTime} ({duration}시간)
              </span>
            </div>
          </div>

          {/* User */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: room?.color || "#6366f1" }}
              >
                {reservation.user?.initial}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {reservation.user?.nickname}
                </p>
                <p className="text-xs text-slate-500">{reservation.user?.role}</p>
              </div>
              {isOwner && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                  내 예약
                </span>
              )}
            </div>
          </div>

          {/* Memo */}
          {reservation.memo && (
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <FileText className="w-3 h-3" />
                메모
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                {reservation.memo}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-200 flex gap-2">
          {isOwner && (
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:bg-red-50 hover:border-red-200"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              예약 취소
            </Button>
          )}
          <Button variant={isOwner ? "default" : "outline"} className="flex-1" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
