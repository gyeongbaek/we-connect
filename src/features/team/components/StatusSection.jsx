import { TeamMemberCard } from "./TeamMemberCard";

export function StatusSection({ title, members, variant }) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {members.map((member) => (
          <div key={member.id} className="w-[180px]">
            <TeamMemberCard member={member} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
