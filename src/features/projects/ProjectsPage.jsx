import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FolderOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ProjectCard } from "./components/ProjectCard";
import {
  mockProjectsData,
  PROJECT_STATUS,
  PROJECT_TYPES,
} from "../../mock/projectData";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

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
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [projects, searchQuery, filterType, filterStatus]);

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
            {searchQuery || filterType !== "ALL" || filterStatus !== "ALL"
              ? "검색 결과가 없습니다"
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
