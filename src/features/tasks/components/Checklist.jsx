import { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  Pin,
  GripVertical,
  Send,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";

// 체크리스트 상태 정의
const STATUS = {
  PENDING: "pending", // 미완료
  IN_PROGRESS: "in_progress", // 진행 중
  COMPLETED: "completed", // 완료
};

// 커스텀 아이콘 컴포넌트들
const CircleEmpty = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const CircleHalf = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" stroke="none" />
  </svg>
);

const CircleFilled = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const STATUS_CONFIG = {
  [STATUS.PENDING]: {
    icon: CircleEmpty,
    color: "text-slate-400",
    bgColor: "bg-slate-100",
    label: "미완료",
  },
  [STATUS.IN_PROGRESS]: {
    icon: CircleHalf,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    label: "진행 중",
  },
  [STATUS.COMPLETED]: {
    icon: CircleFilled,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "완료",
  },
};

export function Checklist({
  projectGroups,
  shortTermTasks,
  projects,
  onAddItem,
  onToggleItem,
  onUpdateItemStatus,
  onDragStart,
}) {
  const [selectedProject, setSelectedProject] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [expandedProjects, setExpandedProjects] = useState(
    projectGroups.map((g) => g.project.id)
  );

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    onAddItem({
      content: newTaskContent.trim(),
      projectId: selectedProject || null, // 프로젝트 미선택 시 단기 업무
    });
    setNewTaskContent("");
    // 프로젝트 선택 상태 유지
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleDragStart = (e, item, project) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        ...item,
        projectColor: project?.color || "#eab308",
        projectName: project?.name || "단기 업무",
      })
    );
    onDragStart?.(item);
  };

  // 상태 순환: pending -> in_progress -> completed -> pending
  const cycleStatus = (item) => {
    const currentStatus = item.status || STATUS.PENDING;
    let nextStatus;

    if (currentStatus === STATUS.PENDING) {
      nextStatus = STATUS.IN_PROGRESS;
    } else if (currentStatus === STATUS.IN_PROGRESS) {
      nextStatus = STATUS.COMPLETED;
    } else {
      nextStatus = STATUS.PENDING;
    }

    onUpdateItemStatus?.(item.id, nextStatus);
  };

  const renderStatusIcon = (item) => {
    const status = item.status || STATUS.PENDING;
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          cycleStatus(item);
        }}
        className={`p-0.5 rounded-full hover:${config.bgColor} transition-colors`}
        title={`${config.label} (클릭하여 상태 변경)`}
      >
        <Icon className={`h-4 w-4 ${config.color}`} />
      </button>
    );
  };

  const renderTaskItem = (item, project = null) => {
    const status = item.status || STATUS.PENDING;
    const isCompleted = status === STATUS.COMPLETED;

    return (
      <li
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item, project)}
        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-slate-50 cursor-grab active:cursor-grabbing group"
      >
        <GripVertical className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 shrink-0" />
        {renderStatusIcon(item)}
        <span
          className={`text-sm flex-1 ${
            isCompleted ? "line-through text-slate-400" : "text-slate-700"
          }`}
        >
          {item.content}
        </span>
        {status === STATUS.IN_PROGRESS && (
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
            진행 중
          </span>
        )}
      </li>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col" style={{ maxHeight: "780px" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <span>📋</span> 체크리스트
        </h3>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
          Discord 전송
        </button>
      </div>

      {/* 업무 추가 입력 - 프로젝트 선택 + 내용 입력만 */}
      <div className="space-y-2 mb-4">
        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-sm"
        >
          <option value="">📌 단기 업무</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              📁 {project.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input
            placeholder="업무 내용을 입력하세요..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm"
          />
          <button
            onClick={handleAddTask}
            disabled={!newTaskContent.trim()}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 상태 범례 */}
      <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3 pb-3 border-b border-slate-100">
        <span className="flex items-center gap-1">
          <CircleEmpty className="h-3 w-3 text-slate-400" /> 미완료
        </span>
        <span className="flex items-center gap-1">
          <CircleHalf className="h-3 w-3 text-blue-500" /> 진행 중
        </span>
        <span className="flex items-center gap-1">
          <CircleFilled className="h-3 w-3 text-blue-600" /> 완료
        </span>
      </div>

      {/* 체크리스트 목록 */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {/* 프로젝트별 그룹 */}
        {projectGroups.map(({ project, items }) => (
          <div key={project.id}>
            <button
              className="flex items-center gap-2 w-full text-left py-1 hover:bg-slate-50 rounded px-1"
              onClick={() => toggleProject(project.id)}
            >
              {expandedProjects.includes(project.id) ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
              <Folder className="h-4 w-4" style={{ color: project.color }} />
              <span className="text-sm font-medium text-slate-700">
                {project.name}
              </span>
              <span className="text-xs text-slate-400 ml-auto">
                {
                  items.filter(
                    (i) => (i.status || STATUS.PENDING) === STATUS.COMPLETED
                  ).length
                }
                /{items.length}
              </span>
            </button>

            {expandedProjects.includes(project.id) && (
              <ul className="ml-6 mt-1 space-y-0.5">
                {items.map((item) => renderTaskItem(item, project))}
              </ul>
            )}
          </div>
        ))}

        {/* 단기 업무 */}
        {shortTermTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 py-1 px-1">
              <Pin className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">
                단기 업무
              </span>
              <span className="text-xs text-slate-400 ml-auto">
                {
                  shortTermTasks.filter(
                    (i) => (i.status || STATUS.PENDING) === STATUS.COMPLETED
                  ).length
                }
                /{shortTermTasks.length}
              </span>
            </div>
            <ul className="ml-6 mt-1 space-y-0.5">
              {shortTermTasks.map((item) => renderTaskItem(item, null))}
            </ul>
          </div>
        )}

        {/* 빈 상태 */}
        {projectGroups.length === 0 && shortTermTasks.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            업무를 추가해주세요
          </div>
        )}
      </div>
    </div>
  );
}

export { STATUS };
