import { TeamMemberCard } from "./TeamMemberCard";

export function StatusSection({ title, members, variant }) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <h3 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
        {variant === "scheduled" && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
        {variant === "vacation" && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
        {title}
        <span className="text-slate-400 font-normal">({members.length}명)</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div key={member.id} className="w-full">
            <TeamMemberCard member={member} variant={variant} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
