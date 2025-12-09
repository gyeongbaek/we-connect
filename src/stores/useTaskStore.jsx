import { createContext, useContext, useState, useCallback } from "react";
import {
  mockProjects,
  mockChecklistItems,
  mockTimeBlocks,
  groupChecklistByProject,
  calculateTimeStats,
} from "../mock/taskData";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [projects] = useState(mockProjects);
  const [checklistItems, setChecklistItems] = useState(mockChecklistItems);
  const [timeBlocks, setTimeBlocks] = useState(mockTimeBlocks);

  // 체크리스트 아이템 추가
  const addChecklistItem = useCallback(({ content, projectId }) => {
    const newItem = {
      id: `c${Date.now()}`,
      userId: "user1",
      date: new Date().toISOString().split("T")[0],
      content,
      projectId,
      status: "pending",
      isCompleted: false,
      order: checklistItems.length + 1,
    };
    setChecklistItems((prev) => [...prev, newItem]);
  }, [checklistItems.length]);

  // 체크리스트 아이템 토글
  const toggleChecklistItem = useCallback((itemId) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }, []);

  // 체크리스트 상태 업데이트
  const updateChecklistStatus = useCallback((itemId, newStatus) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: newStatus, isCompleted: newStatus === "completed" }
          : item
      )
    );
  }, []);

  // 타임블록 추가
  const addTimeBlock = useCallback((blockData) => {
    const newBlock = {
      id: `t${Date.now()}`,
      userId: "user1",
      date: new Date().toISOString().split("T")[0],
      ...blockData,
      isCompleted: false,
    };
    setTimeBlocks((prev) => [...prev, newBlock]);
  }, []);

  // 타임블록 업데이트
  const updateTimeBlock = useCallback((blockId, updates) => {
    setTimeBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  }, []);

  // 타임블록 삭제
  const deleteTimeBlock = useCallback((blockId) => {
    setTimeBlocks((prev) => prev.filter((block) => block.id !== blockId));
  }, []);

  // 프로젝트 그룹 가져오기
  const getProjectGroups = useCallback(() => {
    return groupChecklistByProject(checklistItems, projects);
  }, [checklistItems, projects]);

  // 시간 통계 계산 (휴게 시간 제외)
  const getTimeStats = useCallback((lunchStart = 12, lunchEnd = 13) => {
    return calculateTimeStats(timeBlocks, lunchStart, lunchEnd);
  }, [timeBlocks]);

  // 프로젝트 ID로 프로젝트 정보 가져오기
  const getProjectById = useCallback((projectId) => {
    return projects.find((p) => p.id === projectId) || null;
  }, [projects]);

  const value = {
    projects,
    checklistItems,
    timeBlocks,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistStatus,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    getProjectGroups,
    getTimeStats,
    getProjectById,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskStore() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskStore must be used within TaskProvider");
  }
  return context;
}
