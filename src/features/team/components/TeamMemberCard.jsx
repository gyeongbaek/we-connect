import { cn } from "../../../utils/cn";

export function TeamMemberCard({ member, variant = "working", compact = false }) {
  const isScheduled = variant === "scheduled";
  const isVacation = variant === "vacation";

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        {/* Avatar */}
        {member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.nickname}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-700 text-white text-xs font-semibold">
            {member.initial}
          </div>
        )}

        {/* Info */}
        <span className="text-xs font-medium text-slate-700 truncate">
          {member.nickname}
        </span>
        {isScheduled && member.scheduledTime && (
          <span className="text-xs text-orange-500">{member.scheduledTime}</span>
        )}
        {isVacation && member.vacationType && (
          <span className="text-xs text-blue-500">{member.vacationType}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg",
        "bg-white hover:bg-blue-50 transition-colors"
      )}
    >
      {/* Avatar */}
      {member.profileImage ? (
        <img
          src={member.profileImage}
          alt={member.nickname}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
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
            <span className="text-xs text-slate-400">{member.role}</span>
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
