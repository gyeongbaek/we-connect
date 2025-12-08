import { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  Pin,
  GripVertical,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";

export function Checklist({
  projectGroups,
  shortTermTasks,
  projects,
  onAddItem,
  onToggleItem,
  onDragStart,
}) {
  const [selectedProject, setSelectedProject] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newShortTask, setNewShortTask] = useState("");
  const [expandedProjects, setExpandedProjects] = useState(
    projectGroups.map((g) => g.project.id)
  );

  const handleAddProjectTask = () => {
    if (!newTaskContent.trim() || !selectedProject) return;
    onAddItem({
      content: newTaskContent.trim(),
      projectId: selectedProject,
    });
    setNewTaskContent("");
  };

  const handleAddShortTask = () => {
    if (!newShortTask.trim()) return;
    onAddItem({
      content: newShortTask.trim(),
      projectId: null,
    });
    setNewShortTask("");
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
        projectColor: project?.color || "#8d9299",
        projectName: project?.name || "단기 업무",
      })
    );
    onDragStart?.(item);
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4 h-full">
      <h3 className="text-16 text-semibold mb-4 flex items-center gap-2">
        📋 체크리스트
      </h3>

      {/* Drag Hint */}
      <p className="text-12 text-[var(--grayLv3)] mb-4 flex items-center gap-1">
        🔗 타임테이블로 드래그하세요
      </p>

      {/* Project Task Input */}
      <div className="space-y-2 mb-4">
        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">📁 프로젝트 선택...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input
            placeholder="업무 내용 입력..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddProjectTask()}
          />
          <Button size="icon" onClick={handleAddProjectTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-[var(--grayLv2)]" />
        <span className="px-3 text-12 text-[var(--grayLv3)]">또는</span>
        <div className="flex-1 border-t border-[var(--grayLv2)]" />
      </div>

      {/* Short Task Input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="단기 업무 추가..."
          value={newShortTask}
          onChange={(e) => setNewShortTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddShortTask()}
        />
        <Button size="icon" onClick={handleAddShortTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-t border-[var(--grayLv2)] pt-4 space-y-4 max-h-[400px] overflow-y-auto">
        {/* Project Groups */}
        {projectGroups.map(({ project, items }) => (
          <div key={project.id}>
            <button
              className="flex items-center gap-2 w-full text-left py-1 hover:bg-[var(--grayLv1)] rounded px-1"
              onClick={() => toggleProject(project.id)}
            >
              {expandedProjects.includes(project.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder
                className="h-4 w-4"
                style={{ color: project.color }}
              />
              <span className="text-14 text-semibold">{project.name}</span>
            </button>

            {expandedProjects.includes(project.id) && (
              <ul className="ml-6 mt-1 space-y-1">
                {items.map((item) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, project)}
                    className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[var(--grayLv1)] cursor-grab active:cursor-grabbing group"
                  >
                    <GripVertical className="h-3 w-3 text-[var(--grayLv3)] opacity-0 group-hover:opacity-100" />
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => onToggleItem(item.id)}
                      className="h-4 w-4 rounded border-[var(--grayLv2)]"
                    />
                    <span
                      className={`text-14 ${item.isCompleted ? "line-through text-[var(--grayLv3)]" : ""}`}
                    >
                      {item.content}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Short Term Tasks */}
        {shortTermTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 py-1 px-1">
              <Pin className="h-4 w-4 text-[var(--grayLv3)]" />
              <span className="text-14 text-semibold">단기 업무</span>
            </div>
            <ul className="ml-6 mt-1 space-y-1">
              {shortTermTasks.map((item) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, null)}
                  className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[var(--grayLv1)] cursor-grab active:cursor-grabbing group"
                >
                  <GripVertical className="h-3 w-3 text-[var(--grayLv3)] opacity-0 group-hover:opacity-100" />
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => onToggleItem(item.id)}
                    className="h-4 w-4 rounded border-[var(--grayLv2)]"
                  />
                  <span
                    className={`text-14 ${item.isCompleted ? "line-through text-[var(--grayLv3)]" : ""}`}
                  >
                    {item.content}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
