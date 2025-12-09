// 프로젝트 목록
export const mockProjects = [
  { id: "p1", name: "we:connect 프로젝트", color: "#2e6ff2" },
  { id: "p2", name: "사내 워크숍 준비", color: "#964dd1" },
  { id: "p3", name: "마케팅 캠페인", color: "#328026" },
];

// 체크리스트 아이템
// status: "pending" (미완료), "in_progress" (진행 중), "completed" (완료)
export const mockChecklistItems = [
  {
    id: "c1",
    userId: "user1",
    date: "2024-12-06",
    content: "API 설계 문서 작성",
    projectId: "p1",
    status: "in_progress",
    isCompleted: false,
    order: 1,
  },
  {
    id: "c2",
    userId: "user1",
    date: "2024-12-06",
    content: "로그인 페이지 구현",
    projectId: "p1",
    status: "pending",
    isCompleted: false,
    order: 2,
  },
  {
    id: "c3",
    userId: "user1",
    date: "2024-12-06",
    content: "DB 스키마 설계",
    projectId: "p1",
    status: "completed",
    isCompleted: true,
    order: 3,
  },
  {
    id: "c4",
    userId: "user1",
    date: "2024-12-06",
    content: "발표 자료 준비",
    projectId: "p2",
    status: "pending",
    isCompleted: false,
    order: 1,
  },
  {
    id: "c5",
    userId: "user1",
    date: "2024-12-06",
    content: "참석자 명단 정리",
    projectId: "p2",
    status: "in_progress",
    isCompleted: false,
    order: 2,
  },
  {
    id: "c6",
    userId: "user1",
    date: "2024-12-06",
    content: "점심 미팅 준비",
    projectId: null,
    status: "pending",
    isCompleted: false,
    order: 1,
  },
  {
    id: "c7",
    userId: "user1",
    date: "2024-12-06",
    content: "이메일 회신",
    projectId: null,
    status: "completed",
    isCompleted: true,
    order: 2,
  },
];

// 타임테이블 블록 (휴게 시간은 시스템에서 자동 생성됨)
export const mockTimeBlocks = [];

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

// 시간 통계 계산 (휴게 시간 제외)
export function calculateTimeStats(timeBlocks, lunchStart = 12, lunchEnd = 13) {
  let workMinutes = 0;
  let breakMinutes = 0;
  let completedMinutes = 0;

  const lunchStartMin = lunchStart * 60;
  const lunchEndMin = lunchEnd * 60;

  timeBlocks.forEach((block) => {
    if (block.type === "LUNCH" || block.type === "BREAK") {
      const [startH, startM] = block.startTime.split(":").map(Number);
      const [endH, endM] = block.endTime.split(":").map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      breakMinutes += duration;
      return;
    }

    const [startH, startM] = block.startTime.split(":").map(Number);
    const [endH, endM] = block.endTime.split(":").map(Number);
    const blockStart = startH * 60 + startM;
    const blockEnd = endH * 60 + endM;

    // 휴게 시간과 겹치는 부분 계산
    let effectiveDuration = blockEnd - blockStart;

    // 블록이 휴게 시간과 겹치는 경우
    if (blockStart < lunchEndMin && blockEnd > lunchStartMin) {
      const overlapStart = Math.max(blockStart, lunchStartMin);
      const overlapEnd = Math.min(blockEnd, lunchEndMin);
      const overlapDuration = overlapEnd - overlapStart;
      effectiveDuration -= overlapDuration;
    }

    if (effectiveDuration > 0) {
      workMinutes += effectiveDuration;
      if (block.isCompleted) {
        completedMinutes += effectiveDuration;
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
