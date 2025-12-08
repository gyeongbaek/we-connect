import { users, getUserById } from "./userData";

// 프로젝트 타입
export const PROJECT_TYPES = {
  BOOTCAMP: { label: "부트캠프", icon: "GraduationCap", color: "#2e6ff2" },
  LECTURE: { label: "강의 기획", icon: "BookOpen", color: "#964dd1" },
  DEVELOPMENT: { label: "개발 프로젝트", icon: "Rocket", color: "#328026" },
  CONTENT: { label: "콘텐츠", icon: "Video", color: "#e37c00" },
  OTHER: { label: "기타", icon: "Folder", color: "#8d9299" },
};

// 프로젝트 상태
export const PROJECT_STATUS = {
  IN_PROGRESS: { label: "진행중", color: "var(--primary)" },
  COMPLETED: { label: "완료", color: "var(--code-green)" },
  ON_HOLD: { label: "보류", color: "var(--warn)" },
};

// Mock 프로젝트 데이터 (실제 유저 ID 사용)
export const mockProjectsData = [
  {
    id: "p1",
    name: "we:connect",
    description:
      "팀 협업 도구 MVP 개발. 근태관리, 업무일지, 프로젝트 관리 기능을 포함합니다.",
    type: "DEVELOPMENT",
    status: "IN_PROGRESS",
    discordLink: "https://discord.gg/weconnect",
    notionLink: "https://notion.so/weconnect",
    participants: [
      "ODzZq93x0R",
      "xBEYJgqZ8g",
      "rM0APGlw8l",
      "rjzQAaqRz7",
      "YG0dV1BGEw",
    ], // Binky, Hati, Zeezee, Ona, SoulGom
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-12-06T15:30:00Z",
  },
  {
    id: "p2",
    name: "프론트엔드 부트캠프 10기",
    description: "2025.01 ~ 2025.03 진행 예정인 프론트엔드 부트캠프",
    type: "BOOTCAMP",
    status: "IN_PROGRESS",
    discordLink: "https://discord.gg/bootcamp10",
    notionLink: "https://notion.so/bootcamp10",
    participants: ["eB8qDjBaEK", "210PA1JRzx", "ODzZq93x0R"], // Licat, Wade, Binky
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-12-05T11:00:00Z",
  },
  {
    id: "p3",
    name: "유튜브 채널 운영",
    description: "개발 관련 콘텐츠 제작 및 유튜브 채널 운영",
    type: "CONTENT",
    status: "IN_PROGRESS",
    discordLink: "https://discord.gg/youtube",
    notionLink: "https://notion.so/youtube",
    participants: ["eB8qDjBaEK", "YG0dV1BGEw"], // Licat, SoulGom
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-07T10:00:00Z",
  },
  {
    id: "p4",
    name: "Python 기초 강의",
    description: "입문자를 위한 파이썬 기초 강의 기획 및 제작",
    type: "LECTURE",
    status: "IN_PROGRESS",
    discordLink: "https://discord.gg/python",
    notionLink: "https://notion.so/python",
    participants: ["eB8qDjBaEK", "vYzRbRgdzZ", "5Y06gkQezX"], // Licat, Max, Benny
    createdAt: "2024-11-20T09:00:00Z",
    updatedAt: "2024-12-06T14:00:00Z",
  },
  {
    id: "p5",
    name: "사내 어드민 개선",
    description: "어드민 UX 개선 프로젝트",
    type: "DEVELOPMENT",
    status: "IN_PROGRESS",
    discordLink: "https://discord.gg/admin",
    notionLink: "https://notion.so/admin",
    participants: ["vYzRbRgdzZ", "rjzQAgmxz7", "5Y06gkQezX", "w303nxvJ8D"], // Max, Sunny, Benny, Allosa
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-07T16:00:00Z",
  },
  {
    id: "p6",
    name: "백엔드 부트캠프 9기",
    description: "2024.10 ~ 2024.12 백엔드 부트캠프 9기 운영 완료",
    type: "BOOTCAMP",
    status: "COMPLETED",
    discordLink: "",
    notionLink: "https://notion.so/bootcamp9",
    participants: ["eB8qDjBaEK", "Kq05gJwDEv"], // Licat, Mura
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-01T18:00:00Z",
  },
  {
    id: "p7",
    name: "기술 블로그 리뉴얼",
    description: "팀 기술 블로그 디자인 및 콘텐츠 리뉴얼",
    type: "CONTENT",
    status: "COMPLETED",
    discordLink: "",
    notionLink: "https://notion.so/blog",
    participants: ["YG0dV1BGEw", "rjzQAaqRz7"], // SoulGom, Ona
    createdAt: "2024-09-01T09:00:00Z",
    updatedAt: "2024-11-15T14:00:00Z",
  },
  {
    id: "p8",
    name: "레거시 API 마이그레이션",
    description: "기존 REST API를 GraphQL로 마이그레이션",
    type: "DEVELOPMENT",
    status: "ON_HOLD",
    discordLink: "",
    notionLink: "https://notion.so/migration",
    participants: ["vYzRbRgdzZ", "5Y06gkQezX"], // Max, Benny
    createdAt: "2024-08-01T09:00:00Z",
    updatedAt: "2024-10-15T14:00:00Z",
  },
];

// 프로젝트 참여자 정보 조회
export function getProjectParticipants(project) {
  return project.participants.map((id) => getUserById(id)).filter(Boolean);
}

// Mock 템플릿 데이터
export const mockTemplates = [
  {
    id: "t1",
    name: "개발 프로젝트",
    type: "DEVELOPMENT",
    defaultDescription: "소프트웨어 개발 프로젝트입니다.",
  },
  {
    id: "t2",
    name: "부트캠프",
    type: "BOOTCAMP",
    defaultDescription: "부트캠프 프로젝트입니다.",
  },
  {
    id: "t3",
    name: "강의 기획",
    type: "LECTURE",
    defaultDescription: "강의 기획 프로젝트입니다.",
  },
  {
    id: "t4",
    name: "콘텐츠 제작",
    type: "CONTENT",
    defaultDescription: "콘텐츠 제작 프로젝트입니다.",
  },
];
