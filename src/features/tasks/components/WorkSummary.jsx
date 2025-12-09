import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, BarChart2 } from "lucide-react";

export function WorkSummary({ timeBlocks, projects }) {
  const [expandedProjects, setExpandedProjects] = useState([]);

  // 프로젝트별로 타임블록 그룹화 및 시간 집계
  const projectSummary = timeBlocks.reduce((acc, block) => {
    if (block.type !== "WORK") return acc;

    const projectId = block.projectId || "none";
    if (!acc[projectId]) {
      acc[projectId] = {
        project: projects.find((p) => p.id === projectId) || {
          id: "none",
          name: "단기 업무",
          color: "#8d9299",
        },
        totalMinutes: 0,
        tasks: {},
      };
    }

    // 시간 계산
    const [startH, startM] = block.startTime.split(":").map(Number);
    const [endH, endM] = block.endTime.split(":").map(Number);
    const duration = endH * 60 + endM - (startH * 60 + startM);

    acc[projectId].totalMinutes += duration;

    // 업무별 집계
    const taskKey = block.content;
    if (!acc[projectId].tasks[taskKey]) {
      acc[projectId].tasks[taskKey] = {
        content: block.content,
        totalMinutes: 0,
        blocks: [],
      };
    }
    acc[projectId].tasks[taskKey].totalMinutes += duration;
    acc[projectId].tasks[taskKey].blocks.push(block);

    return acc;
  }, {});

  // 전체 합계 계산
  const totalMinutes = Object.values(projectSummary).reduce(
    (sum, p) => sum + p.totalMinutes,
    0
  );

  // 시간 포맷팅
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  // 프로젝트 펼치기/접기
  const toggleProject = (projectId) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  // 프로젝트 목록을 시간 순으로 정렬
  const sortedProjects = Object.values(projectSummary).sort(
    (a, b) => b.totalMinutes - a.totalMinutes
  );

  if (sortedProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          업무 요약
        </h3>
        <p className="text-sm text-slate-400 text-center py-4">
          타임테이블에 업무를 추가하면 요약이 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <BarChart2 className="h-4 w-4" />
        업무 요약
      </h3>

      {/* 전체 합계 */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">
            오늘 총 업무 시간
          </span>
          <span className="text-lg font-bold text-blue-600">
            {formatDuration(totalMinutes)}
          </span>
        </div>
        {/* 비율 바 */}
        <div className="mt-2 flex gap-0.5 h-2 rounded-full overflow-hidden bg-slate-200">
          {sortedProjects.map((p) => (
            <div
              key={p.project.id}
              className="h-full transition-all"
              style={{
                width: `${(p.totalMinutes / totalMinutes) * 100}%`,
                backgroundColor: p.project.color,
              }}
              title={`${p.project.name}: ${formatDuration(p.totalMinutes)}`}
            />
          ))}
        </div>
      </div>

      {/* 프로젝트별 요약 */}
      <div className="space-y-2">
        {sortedProjects.map((item) => {
          const isExpanded = expandedProjects.includes(item.project.id);
          const tasks = Object.values(item.tasks).sort(
            (a, b) => b.totalMinutes - a.totalMinutes
          );

          return (
            <div
              key={item.project.id}
              className="border border-slate-100 rounded-lg overflow-hidden"
            >
              {/* 프로젝트 헤더 */}
              <button
                onClick={() => toggleProject(item.project.id)}
                className="w-full flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.project.color }}
                />
                <span className="text-sm font-medium text-slate-700 flex-1 text-left">
                  {item.project.name}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  {formatDuration(item.totalMinutes)}
                </span>
                <span className="text-xs text-slate-400">
                  ({Math.round((item.totalMinutes / totalMinutes) * 100)}%)
                </span>
              </button>

              {/* 업무 상세 목록 */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 p-2 space-y-1">
                  {tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2 py-1.5 bg-white rounded"
                    >
                      <Clock className="h-3 w-3 text-slate-300" />
                      <span className="text-sm text-slate-600 flex-1 truncate">
                        {task.content}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDuration(task.totalMinutes)}
                      </span>
                      {/* 시간대 표시 */}
                      <div className="flex gap-1">
                        {task.blocks.map((block, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded"
                          >
                            {block.startTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 mb-2">프로젝트별 시간 비율</p>
        <div className="flex flex-wrap gap-2">
          {sortedProjects.map((item) => (
            <div key={item.project.id} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.project.color }}
              />
              <span className="text-[10px] text-slate-500">
                {item.project.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
