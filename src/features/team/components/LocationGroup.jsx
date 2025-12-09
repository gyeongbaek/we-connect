import { TeamMemberCard } from "./TeamMemberCard";
import { LOCATION_TYPE } from "../../../mock/teamData";

export function LocationGroup({ location, members }) {
  const locationInfo = LOCATION_TYPE[location];

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
        <span className="text-base">{locationInfo.emoji}</span>
        <span className="text-xs font-semibold text-slate-700">
          {locationInfo.label}
        </span>
        <span className="text-xs text-blue-600 font-medium">
          {members.length}명
        </span>
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} variant="working" />
        ))}
      </div>
    </div>
  );
}
