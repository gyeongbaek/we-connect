import { TeamMemberCard } from "./TeamMemberCard";
import { LOCATION_TYPE } from "../../../mock/teamData";

export function LocationGroup({ location, members }) {
  const locationInfo = LOCATION_TYPE[location];

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <span className="text-lg">{locationInfo.emoji}</span>
        <span className="text-sm font-semibold text-slate-800">
          {locationInfo.label}
        </span>
        <span className="text-sm text-blue-600 font-medium">
          {members.length}명
        </span>
      </div>

      {/* Member List */}
      <div className="space-y-2.5">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} variant="working" />
        ))}
      </div>
    </div>
  );
}
