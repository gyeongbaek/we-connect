import { cn } from "../../../utils/cn";

export function TeamMemberCard({ member, variant = "working" }) {
  const isScheduled = variant === "scheduled";
  const isVacation = variant === "vacation";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-lg",
        "bg-slate-50 hover:bg-blue-50 transition-colors"
      )}
    >
      {/* Avatar */}
      {member.profileImage ? (
        <img
          src={member.profileImage}
          alt={member.nickname}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-slate-900 text-white text-sm font-semibold"
          )}
        >
          {member.initial}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800 truncate">
            {member.nickname}
          </span>
          {member.role && (
            <span className="text-xs text-slate-500">{member.role}</span>
          )}
        </div>

        {/* Time info */}
        <div className="text-xs text-slate-500">
          {isScheduled && member.scheduledTime && (
            <span>{member.scheduledTime} 출근 예정</span>
          )}
          {isVacation && member.vacationType && (
            <span>{member.vacationType}</span>
          )}
          {!isScheduled && !isVacation && member.checkInTime && (
            <span>{member.checkInTime}~</span>
          )}
        </div>
      </div>
    </div>
  );
}
