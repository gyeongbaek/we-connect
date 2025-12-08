import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Users,
  Calendar,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Rocket,
  Video,
  Folder,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  mockProjectsData,
  PROJECT_STATUS,
  PROJECT_TYPES,
  getProjectParticipants,
} from "../../mock/projectData";

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

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // localStorage와 mockData 모두 확인
  const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
  const allProjects = [...storedProjects, ...mockProjectsData];
  const project = allProjects.find((p) => p.id === projectId);

  const handleBack = () => {
    navigate("/projects");
  };

  const handleEdit = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = existingProjects.filter((p) => p.id !== projectId);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));

      // mockData에 있는 프로젝트 삭제 표시
      const deletedProjects = JSON.parse(localStorage.getItem("deletedProjects") || "[]");
      if (!deletedProjects.includes(projectId)) {
        deletedProjects.push(projectId);
        localStorage.setItem("deletedProjects", JSON.stringify(deletedProjects));
      }

      navigate("/projects");
    }
  };

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-14 text-[var(--grayLv3)] hover:text-[var(--grayLv4)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록으로
          </button>
        </div>
        <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-6 text-center">
          <p className="text-[var(--grayLv3)]">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const status = PROJECT_STATUS[project.status];
  const type = PROJECT_TYPES[project.type] || PROJECT_TYPES.OTHER;
  const TypeIcon = TypeIcons[project.type] || Folder;
  const participants = getProjectParticipants(project);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-14 text-[var(--grayLv3)] hover:text-[var(--grayLv4)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          프로젝트 목록으로
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] overflow-hidden">
        {/* Project Header */}
        <div className="p-6 border-b border-[var(--grayLv2)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Type & Status Badges */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-12"
                  style={{ backgroundColor: `${type.color}15`, color: type.color }}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span className="text-medium">{type.label}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-12"
                  style={{ backgroundColor: `${status.color}15`, color: status.color }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-medium">{status.label}</span>
                </div>
              </div>

              {/* Project Name */}
              <h1 className="text-24 text-semibold mb-2">{project.name}</h1>

              {/* Dates */}
              <div className="flex items-center gap-4 text-14 text-[var(--grayLv3)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>생성: {formatDate(project.createdAt)}</span>
                </div>
                <span>|</span>
                <span>수정: {formatDate(project.updatedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                편집
              </Button>
              <Button
                variant="ghost"
                className="text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-[var(--grayLv2)]">
          <h2 className="text-14 text-medium text-[var(--grayLv3)] mb-2">설명</h2>
          <p className="text-16 leading-relaxed">
            {project.description || "설명이 없습니다."}
          </p>
        </div>

        {/* Links */}
        <div className="p-6 border-b border-[var(--grayLv2)]">
          <h2 className="text-14 text-medium text-[var(--grayLv3)] mb-3">링크</h2>
          <div className="flex flex-wrap gap-3">
            {project.discordLink ? (
              <a
                href={project.discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--grayLv1)] hover:bg-[var(--grayLv2)] transition-colors"
              >
                <DiscordIcon className="w-5 h-5" />
                <span className="text-14">Discord</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--grayLv3)]" />
              </a>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--grayLv1)] text-[var(--grayLv3)]">
                <DiscordIcon className="w-5 h-5" />
                <span className="text-14">Discord 링크 없음</span>
              </div>
            )}
            {project.notionLink ? (
              <a
                href={project.notionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--grayLv1)] hover:bg-[var(--grayLv2)] transition-colors"
              >
                <NotionIcon className="w-5 h-5" />
                <span className="text-14">Notion</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--grayLv3)]" />
              </a>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--grayLv1)] text-[var(--grayLv3)]">
                <NotionIcon className="w-5 h-5" />
                <span className="text-14">Notion 링크 없음</span>
              </div>
            )}
          </div>
        </div>

        {/* Participants */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[var(--grayLv3)]" />
            <h2 className="text-14 text-medium text-[var(--grayLv3)]">
              참가자 ({participants.length}명)
            </h2>
          </div>

          {participants.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--grayLv1)]"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--grayLv2)] flex items-center justify-center text-14 text-semibold">
                      {user.displayName?.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-14 text-medium truncate">
                      {user.displayName}
                    </div>
                    <div className="text-12 text-[var(--grayLv3)] truncate">
                      {user.role || user.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-14 text-[var(--grayLv3)]">참가자가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
