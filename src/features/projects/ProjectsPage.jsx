import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FolderOpen, Users, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ProjectCard } from "./components/ProjectCard";
import {
  mockProjectsData,
  PROJECT_STATUS,
  PROJECT_TYPES,
} from "../../mock/projectData";
import { users } from "../../mock/userData";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMember, setFilterMember] = useState(null);
  const [showMemberFilter, setShowMemberFilter] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  // localStorage와 mockData 통합
  const projects = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const deletedProjects = JSON.parse(localStorage.getItem("deletedProjects") || "[]");

    // mockData 중 수정된 것은 제외하고, 삭제된 것도 제외
    const filteredMockData = mockProjectsData.filter(
      (mock) =>
        !storedProjects.some((stored) => stored.id === mock.id) &&
        !deletedProjects.includes(mock.id)
    );

    return [...storedProjects, ...filteredMockData];
  }, []);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = filterType === "ALL" || project.type === filterType;
      const matchesStatus =
        filterStatus === "ALL" || project.status === filterStatus;
      const matchesMember = !filterMember ||
        (project.participants && project.participants.includes(filterMember.id));
      return matchesSearch && matchesType && matchesStatus && matchesMember;
    });
  }, [projects, searchQuery, filterType, filterStatus, filterMember]);

  // 멤버 검색 필터
  const filteredMembers = useMemo(() => {
    return users.filter((user) =>
      user.displayName.toLowerCase().includes(memberSearch.toLowerCase())
    );
  }, [memberSearch]);

  // Group projects by status
  const groupedProjects = useMemo(() => {
    const groups = {
      IN_PROGRESS: [],
      COMPLETED: [],
      ON_HOLD: [],
    };

    filteredProjects.forEach((project) => {
      if (groups[project.status]) {
        groups[project.status].push(project);
      }
    });

    return groups;
  }, [filteredProjects]);

  const handleAddProject = () => {
    navigate("/projects/new");
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const renderProjectGroup = (status, label) => {
    const projectsInGroup = groupedProjects[status];
    if (projectsInGroup.length === 0) return null;

    const statusInfo = PROJECT_STATUS[status];

    return (
      <div key={status} className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusInfo.color }}
          />
          <h2 className="text-16 text-semibold">
            {label} ({projectsInGroup.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectsInGroup.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleViewProject(project)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-14 text-[var(--grayLv3)]">
            진행 중인 프로젝트를 관리하고 빠르게 접근하세요
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleAddProject}
        >
          <Plus className="h-4 w-4" />새 프로젝트
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--grayLv3)]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="프로젝트 검색..."
          className="pl-9"
        />
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-14 text-[var(--grayLv3)]">
          타입:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-full text-14 transition-colors ${
              filterType === "ALL"
                ? "bg-[var(--surface)] text-white"
                : "bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
            }`}
          >
            전체
          </button>
          {Object.entries(PROJECT_TYPES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 rounded-full text-14 transition-colors ${
                filterType === key
                  ? "bg-[var(--surface)] text-white"
                  : "bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-14 text-[var(--grayLv3)]">
          상태:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-full text-14 transition-colors ${
              filterStatus === "ALL"
                ? "bg-[var(--surface)] text-white"
                : "bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
            }`}
          >
            전체
          </button>
          {Object.entries(PROJECT_STATUS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-14 transition-colors ${
                filterStatus === key
                  ? "bg-[var(--surface)] text-white"
                  : "bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    filterStatus === key ? "white" : value.color,
                }}
              />
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-14 text-[var(--grayLv3)]">
          <Users className="w-4 h-4" />
          멤버별:
        </div>
        <div className="relative">
          {filterMember ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)] text-white text-14">
                {filterMember.profileImage ? (
                  <img
                    src={filterMember.profileImage}
                    alt={filterMember.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-10">
                    {filterMember.displayName.charAt(0)}
                  </div>
                )}
                <span>{filterMember.displayName}의 프로젝트</span>
                <button
                  onClick={() => setFilterMember(null)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowMemberFilter(!showMemberFilter)}
              className="px-3 py-1.5 rounded-full text-14 transition-colors bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
            >
              멤버 선택
            </button>
          )}

          {/* Member Dropdown */}
          {showMemberFilter && !filterMember && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--background)] border border-[var(--grayLv2)] rounded-lg shadow-lg z-10">
              <div className="p-2 border-b border-[var(--grayLv2)]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--grayLv3)]" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="멤버 검색..."
                    className="w-full pl-8 pr-3 py-1.5 text-14 border border-[var(--grayLv2)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredMembers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setFilterMember(user);
                      setShowMemberFilter(false);
                      setMemberSearch("");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--grayLv1)] transition-colors"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.displayName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[var(--grayLv2)] flex items-center justify-center text-10 text-semibold">
                        {user.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-14">{user.displayName}</div>
                      <div className="text-12 text-[var(--grayLv3)]">
                        {user.role || user.rank}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-[var(--grayLv2)]">
                <button
                  onClick={() => {
                    setShowMemberFilter(false);
                    setMemberSearch("");
                  }}
                  className="w-full py-1.5 text-14 text-[var(--grayLv3)] hover:text-[var(--grayLv4)]"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Groups */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-6 pt-2">
          {renderProjectGroup("IN_PROGRESS", "진행중")}
          {renderProjectGroup("COMPLETED", "완료")}
          {renderProjectGroup("ON_HOLD", "보류")}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--grayLv1)] flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-[var(--grayLv3)]" />
          </div>
          <p className="text-16 text-[var(--grayLv4)] mb-2">
            {searchQuery || filterType !== "ALL" || filterStatus !== "ALL" || filterMember
              ? filterMember
                ? `${filterMember.displayName}님이 참여 중인 프로젝트가 없습니다`
                : "검색 결과가 없습니다"
              : "등록된 프로젝트가 없습니다"}
          </p>
          <p className="text-14 text-[var(--grayLv3)]">
            새 프로젝트를 추가해보세요
          </p>
        </div>
      )}
    </div>
  );
}
