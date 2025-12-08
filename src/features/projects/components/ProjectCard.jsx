import {
  Users,
  MoreVertical,
  GraduationCap,
  BookOpen,
  Rocket,
  Video,
  Folder,
} from "lucide-react";
import { PROJECT_STATUS, PROJECT_TYPES, getProjectParticipants } from "../../../mock/projectData";

// Discord 아이콘 SVG
function DiscordIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Notion 아이콘 SVG
function NotionIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.934-.56.934-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.046-.748.326-.748.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.326-1.167.513-1.634.513-.747 0-.934-.234-1.494-.933l-4.577-7.186v6.952l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.763 7.279v-6.44l-1.214-.14c-.093-.513.28-.886.747-.933l3.222-.187zM2.523 1.075l13.589-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.933c-.98.047-1.448-.093-1.962-.746l-3.129-4.06c-.56-.746-.793-1.306-.793-1.96V2.62c0-.839.374-1.54 1.168-1.54v-.005z" />
    </svg>
  );
}

// 타입별 아이콘 컴포넌트
const TypeIcons = {
  BOOTCAMP: GraduationCap,
  LECTURE: BookOpen,
  DEVELOPMENT: Rocket,
  CONTENT: Video,
  OTHER: Folder,
};

export function ProjectCard({ project, onClick, onMenuClick }) {
  const status = PROJECT_STATUS[project.status];
  const type = PROJECT_TYPES[project.type] || PROJECT_TYPES.OTHER;
  const TypeIcon = TypeIcons[project.type] || Folder;
  const participantUsers = getProjectParticipants(project);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onMenuClick?.(project);
  };

  return (
    <div
      className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4 cursor-pointer hover:border-[var(--primary)] transition-colors flex flex-col"
      onClick={onClick}
    >
      {/* Header - Type badge and menu */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-12"
          style={{ backgroundColor: `${type.color}15`, color: type.color }}
        >
          <TypeIcon className="w-3.5 h-3.5" />
          <span className="text-medium">{type.label}</span>
        </div>
        <button
          onClick={handleMenuClick}
          className="p-1 rounded hover:bg-[var(--grayLv1)] transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-[var(--grayLv3)]" />
        </button>
      </div>

      {/* Project name */}
      <h3 className="text-16 text-semibold mb-1 truncate">{project.name}</h3>

      {/* Description */}
      <p className="text-14 text-[var(--grayLv3)] line-clamp-2 mb-4 flex-1">
        {project.description}
      </p>

      {/* Participants */}
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-[var(--grayLv3)]" />
        <span className="text-14 text-[var(--grayLv3)]">
          {participantUsers.length}명
        </span>
        <div className="flex -space-x-2 ml-1">
          {participantUsers.slice(0, 4).map((user) => (
            user.profileImage ? (
              <img
                key={user.id}
                src={user.profileImage}
                alt={user.displayName}
                className="w-6 h-6 rounded-full border-2 border-[var(--background)] object-cover"
                title={user.displayName}
              />
            ) : (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full bg-[var(--grayLv2)] border-2 border-[var(--background)] flex items-center justify-center text-10 text-semibold"
                title={user.displayName}
              >
                {user.displayName?.charAt(0)}
              </div>
            )
          ))}
          {participantUsers.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-[var(--grayLv1)] border-2 border-[var(--background)] flex items-center justify-center text-10 text-[var(--grayLv3)]">
              +{participantUsers.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Links and Status */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--grayLv1)]">
        {/* Links */}
        <div className="flex items-center gap-2">
          {project.discordLink && (
            <a
              href={project.discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--grayLv1)] hover:bg-[var(--grayLv2)] transition-colors text-12"
              onClick={(e) => e.stopPropagation()}
              title="Discord"
            >
              <DiscordIcon className="w-3.5 h-3.5" />
              <span>Discord</span>
            </a>
          )}
          {project.notionLink && (
            <a
              href={project.notionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--grayLv1)] hover:bg-[var(--grayLv2)] transition-colors text-12"
              onClick={(e) => e.stopPropagation()}
              title="Notion"
            >
              <NotionIcon className="w-3.5 h-3.5" />
              <span>Notion</span>
            </a>
          )}
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 text-12"
          style={{ color: status.color }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          {status.label}
        </div>
      </div>
    </div>
  );
}
