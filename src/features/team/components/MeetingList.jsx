import { Plus, Clock, Users, ChevronRight } from "lucide-react";
import { cn } from "../../../utils/cn";

function MeetingItem({ meeting }) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg bg-slate-50",
        "hover:bg-blue-50 transition-colors cursor-pointer"
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-base">{meeting.emoji}</span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-800">
            {meeting.title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {meeting.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {meeting.participantCount}명
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeetingList({ meetings, onAddMeeting }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">오늘 미팅</h3>
        <button
          onClick={onAddMeeting}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <Plus size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Meeting List */}
      <div className="space-y-2">
        {meetings.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            오늘 예정된 미팅이 없습니다
          </p>
        ) : (
          meetings.map((meeting) => (
            <MeetingItem key={meeting.id} meeting={meeting} />
          ))
        )}
      </div>

      {/* View All Link */}
      {meetings.length > 0 && (
        <button
          className={cn(
            "flex items-center justify-end gap-1 w-full mt-4",
            "text-xs text-slate-500 hover:text-blue-600 transition-colors"
          )}
        >
          전체 일정 보기
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
