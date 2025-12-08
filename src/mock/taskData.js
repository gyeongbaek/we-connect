// 프로젝트 목록
export const mockProjects = [
  { id: "p1", name: "we:connect 프로젝트", color: "#2e6ff2" },
  { id: "p2", name: "사내 워크숍 준비", color: "#964dd1" },
  { id: "p3", name: "마케팅 캠페인", color: "#328026" },
];

// 체크리스트 아이템
export const mockChecklistItems = [
  {
    id: "c1",
    userId: "user1",
    date: "2024-12-06",
    content: "API 설계 문서 작성",
    projectId: "p1",
    isCompleted: false,
    order: 1,
  },
  {
    id: "c2",
    userId: "user1",
    date: "2024-12-06",
    content: "로그인 페이지 구현",
    projectId: "p1",
    isCompleted: false,
    order: 2,
  },
  {
    id: "c3",
    userId: "user1",
    date: "2024-12-06",
    content: "DB 스키마 설계",
    projectId: "p1",
    isCompleted: true,
    order: 3,
  },
  {
    id: "c4",
    userId: "user1",
    date: "2024-12-06",
    content: "발표 자료 준비",
    projectId: "p2",
    isCompleted: false,
    order: 1,
  },
  {
    id: "c5",
    userId: "user1",
    date: "2024-12-06",
    content: "참석자 명단 정리",
    projectId: "p2",
    isCompleted: false,
    order: 2,
  },
  {
    id: "c6",
    userId: "user1",
    date: "2024-12-06",
    content: "점심 미팅 준비",
    projectId: null,
    isCompleted: false,
    order: 1,
  },
  {
    id: "c7",
    userId: "user1",
    date: "2024-12-06",
    content: "이메일 회신",
    projectId: null,
    isCompleted: false,
    order: 2,
  },
];

// 타임테이블 블록
export const mockTimeBlocks = [
  {
    id: "t1",
    userId: "user1",
    date: "2024-12-06",
    startTime: "13:00",
    endTime: "14:00",
    content: "점심 식사",
    type: "LUNCH",
    projectId: null,
    checklistItemId: null,
    isCompleted: false,
  },
];

// 체크리스트를 프로젝트별로 그룹핑
export function groupChecklistByProject(items, projects) {
  const projectGroups = {};
  const shortTermTasks = [];

  items.forEach((item) => {
    if (item.projectId) {
      if (!projectGroups[item.projectId]) {
        const project = projects.find((p) => p.id === item.projectId);
        projectGroups[item.projectId] = {
          project,
          items: [],
        };
      }
      projectGroups[item.projectId].items.push(item);
    } else {
      shortTermTasks.push(item);
    }
  });

  return {
    projectGroups: Object.values(projectGroups),
    shortTermTasks,
  };
}

// 시간 통계 계산
export function calculateTimeStats(timeBlocks) {
  let workMinutes = 0;
  let breakMinutes = 0;
  let completedMinutes = 0;

  timeBlocks.forEach((block) => {
    const [startH, startM] = block.startTime.split(":").map(Number);
    const [endH, endM] = block.endTime.split(":").map(Number);
    const duration = (endH * 60 + endM) - (startH * 60 + startM);

    if (block.type === "LUNCH" || block.type === "BREAK") {
      breakMinutes += duration;
    } else {
      workMinutes += duration;
      if (block.isCompleted) {
        completedMinutes += duration;
      }
    }
  });

  return {
    workHours: Math.floor(workMinutes / 60),
    workMinutes: workMinutes % 60,
    breakHours: Math.floor(breakMinutes / 60),
    breakMinutes: breakMinutes % 60,
    completedHours: Math.floor(completedMinutes / 60),
    completedMinutes: completedMinutes % 60,
  };
}
