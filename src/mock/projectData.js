import { users, getUserById } from "./userData";

// 프로젝트 타입
export const PROJECT_TYPES = {
  DEVELOPMENT: { label: "개발 프로젝트", icon: "Rocket", color: "#328026" },
  CONTENT: { label: "콘텐츠", icon: "Video", color: "#e37c00" },
  LECTURE: { label: "강의 기획", icon: "BookOpen", color: "#964dd1" },
  BOOTCAMP: { label: "부트캠프", icon: "GraduationCap", color: "#2e6ff2" },
  OPERATION: { label: "운영 기획", icon: "Settings", color: "#0891b2" },
  DESIGN: { label: "디자인", icon: "Palette", color: "#ec4899" },
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
    progress: 65,
    discordLink: "https://discord.gg/weconnect",
    notionLink: "https://notion.so/weconnect",
    participants: [
      "5Y06gkQezX",
      "xBEYJgqZ8g",
      "rM0APGlw8l",
      "rjzQAaqRz7",
      "YG0dV1BGEw",
    ], // Benny, Hati, Zeezee, Ona, SoulGom
    checklists: [
      { id: "c1", title: "기획안 확정", done: true },
      { id: "c2", title: "ERD 설계", done: true },
      { id: "c3", title: "와이어프레임", done: true },
      { id: "c4", title: "API 명세서", done: false },
      { id: "c5", title: "프론트엔드 개발", done: false },
    ],
    memos: [
      {
        id: "m1",
        title: "킥오프 미팅",
        author: "Hati",
        date: "12/01",
        content: "프로젝트 방향성 논의",
      },
      {
        id: "m2",
        title: "기술 스택 논의",
        author: "Binky",
        date: "12/03",
        content: "React + Vite 선정",
      },
    ],
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-12-06T15:30:00Z",
  },
  {
    id: "p2",
    name: "프론트엔드 부트캠프 10기",
    description: "2025.01 ~ 2025.03 진행 예정인 프론트엔드 부트캠프",
    type: "BOOTCAMP",
    status: "IN_PROGRESS",
    progress: 30,
    discordLink: "https://discord.gg/bootcamp10",
    notionLink: "https://notion.so/bootcamp10",
    participants: ["eB8qDjBaEK", "210PA1JRzx", "ODzZq93x0R"], // Licat, Wade, Binky
    checklists: [
      { id: "c1", title: "커리큘럼 확정", done: true },
      { id: "c2", title: "강사진 섭외", done: true },
      { id: "c3", title: "모집 공고", done: false },
      { id: "c4", title: "홍보", done: false },
    ],
    memos: [
      {
        id: "m1",
        title: "일정 조율",
        author: "Licat",
        date: "12/05",
        content: "1월 중순 시작 예정",
      },
    ],
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-12-05T11:00:00Z",
  },
  {
    id: "p3",
    name: "유튜브 채널 운영",
    description: "개발 관련 콘텐츠 제작 및 유튜브 채널 운영",
    type: "CONTENT",
    status: "IN_PROGRESS",
    progress: 80,
    discordLink: "https://discord.gg/youtube",
    notionLink: "https://notion.so/youtube",
    participants: ["eB8qDjBaEK", "YG0dV1BGEw"], // Licat, SoulGom
    checklists: [
      { id: "c1", title: "12월 콘텐츠 기획", done: true },
      { id: "c2", title: "촬영 일정 조율", done: true },
      { id: "c3", title: "편집", done: true },
      { id: "c4", title: "업로드", done: false },
    ],
    memos: [],
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-07T10:00:00Z",
  },
  {
    id: "p4",
    name: "Python 기초 강의",
    description: "입문자를 위한 파이썬 기초 강의 기획 및 제작",
    type: "LECTURE",
    status: "IN_PROGRESS",
    progress: 45,
    discordLink: "https://discord.gg/python",
    notionLink: "https://notion.so/python",
    participants: ["eB8qDjBaEK", "vYzRbRgdzZ", "5Y06gkQezX"], // Licat, Max, Benny
    checklists: [
      { id: "c1", title: "목차 구성", done: true },
      { id: "c2", title: "1-5강 스크립트", done: true },
      { id: "c3", title: "6-10강 스크립트", done: false },
      { id: "c4", title: "녹화", done: false },
    ],
    memos: [
      {
        id: "m1",
        title: "강의 컨셉",
        author: "Licat",
        date: "11/25",
        content: "입문자 친화적으로",
      },
    ],
    createdAt: "2024-11-20T09:00:00Z",
    updatedAt: "2024-12-06T14:00:00Z",
  },
  {
    id: "p5",
    name: "사내 어드민 개선",
    description: "어드민 UX 개선 프로젝트",
    type: "DEVELOPMENT",
    status: "IN_PROGRESS",
    progress: 20,
    discordLink: "https://discord.gg/admin",
    notionLink: "https://notion.so/admin",
    participants: ["vYzRbRgdzZ", "rjzQAgmxz7", "5Y06gkQezX", "w303nxvJ8D"], // Max, Sunny, Benny, Allosa
    checklists: [
      { id: "c1", title: "현재 문제점 분석", done: true },
      { id: "c2", title: "개선안 도출", done: false },
      { id: "c3", title: "디자인", done: false },
      { id: "c4", title: "개발", done: false },
    ],
    memos: [],
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-07T16:00:00Z",
  },
  {
    id: "p6",
    name: "백엔드 부트캠프 9기",
    description: "2024.10 ~ 2024.12 백엔드 부트캠프 9기 운영 완료",
    type: "BOOTCAMP",
    status: "COMPLETED",
    progress: 100,
    discordLink: "",
    notionLink: "https://notion.so/bootcamp9",
    participants: ["eB8qDjBaEK", "Kq05gJwDEv"], // Licat, Mura
    checklists: [
      { id: "c1", title: "커리큘럼 확정", done: true },
      { id: "c2", title: "강의 진행", done: true },
      { id: "c3", title: "프로젝트 발표", done: true },
      { id: "c4", title: "수료식", done: true },
    ],
    memos: [
      {
        id: "m1",
        title: "수료 회고",
        author: "Licat",
        date: "12/01",
        content: "성공적으로 마무리",
      },
    ],
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-01T18:00:00Z",
  },
  {
    id: "p7",
    name: "기술 블로그 리뉴얼",
    description: "팀 기술 블로그 디자인 및 콘텐츠 리뉴얼",
    type: "CONTENT",
    status: "COMPLETED",
    progress: 100,
    discordLink: "",
    notionLink: "https://notion.so/blog",
    participants: ["YG0dV1BGEw", "rjzQAaqRz7"], // SoulGom, Ona
    checklists: [
      { id: "c1", title: "디자인 컨셉", done: true },
      { id: "c2", title: "퍼블리싱", done: true },
      { id: "c3", title: "콘텐츠 이관", done: true },
    ],
    memos: [],
    createdAt: "2024-09-01T09:00:00Z",
    updatedAt: "2024-11-15T14:00:00Z",
  },
  {
    id: "p8",
    name: "레거시 API 마이그레이션",
    description: "기존 REST API를 GraphQL로 마이그레이션",
    type: "DEVELOPMENT",
    status: "ON_HOLD",
    progress: 15,
    discordLink: "",
    notionLink: "https://notion.so/migration",
    participants: ["vYzRbRgdzZ", "5Y06gkQezX"], // Max, Benny
    checklists: [
      { id: "c1", title: "현재 API 분석", done: true },
      { id: "c2", title: "GraphQL 스키마 설계", done: false },
      { id: "c3", title: "마이그레이션", done: false },
    ],
    memos: [
      {
        id: "m1",
        title: "보류 사유",
        author: "Max",
        date: "10/15",
        content: "다른 프로젝트 우선순위",
      },
    ],
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
