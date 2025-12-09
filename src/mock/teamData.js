import { users, getUserById } from "./userData";

// 팀원 상태 타입
export const MEMBER_STATUS = {
  WORKING: { label: "근무중", color: "var(--primary)" },
  SCHEDULED: { label: "출근 예정", color: "var(--warn)" },
  VACATION: { label: "휴가", color: "var(--grayLv3)" },
  OFF: { label: "퇴근", color: "var(--grayLv2)" },
};

// 근무지 타입
export const LOCATION_TYPE = {
  REMOTE: { label: "재택", emoji: "🏠" },
  OFFICE_JEJU: { label: "오피스제주", emoji: "🏝️" },
  OFFICE: { label: "사무실", emoji: "🏢" },
};

// Mock 팀원 현황 데이터 (실제 유저 ID 사용)
export const mockTeamMembers = [
  // 재택 근무
  {
    id: "GM81lY9nE4",
    oderId: 1,
    nickname: "Ali",
    initial: "A",
    role: "DA",
    profileImage: getUserById("GM81lY9nE4")?.profileImage,
    status: "WORKING",
    location: "REMOTE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "xBEYJgqZ8g",
    oderId: 2,
    nickname: "Hati",
    initial: "H",
    role: "FE",
    profileImage: getUserById("xBEYJgqZ8g")?.profileImage,
    status: "WORKING",
    location: "REMOTE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "rjzQAaqRz7",
    oderId: 3,
    nickname: "Ona",
    initial: "O",
    role: "디자이너",
    profileImage: getUserById("rjzQAaqRz7")?.profileImage,
    status: "WORKING",
    location: "REMOTE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "rjzQAgmxz7",
    oderId: 4,
    nickname: "Sunny",
    initial: "S",
    role: "BE",
    profileImage: getUserById("rjzQAgmxz7")?.profileImage,
    status: "WORKING",
    location: "REMOTE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "rM0APGlw8l",
    oderId: 5,
    nickname: "Zeezee",
    initial: "Z",
    role: "FE",
    profileImage: getUserById("rM0APGlw8l")?.profileImage,
    status: "WORKING",
    location: "REMOTE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  // 오피스제주
  {
    id: "5Y06gkQezX",
    oderId: 6,
    nickname: "Benny",
    initial: "B",
    role: "BE",
    profileImage: getUserById("5Y06gkQezX")?.profileImage,
    status: "WORKING",
    location: "OFFICE_JEJU",
    checkInTime: "10:00",
    scheduledTime: null,
    vacationType: null,
  },
  // 사무실
  {
    id: "ODzZq93x0R",
    oderId: 7,
    nickname: "Binky",
    initial: "B",
    role: "FE",
    profileImage: getUserById("ODzZq93x0R")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "eB8qDjBaEK",
    oderId: 8,
    nickname: "Licat",
    initial: "L",
    role: "",
    profileImage: getUserById("eB8qDjBaEK")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "p1ED7XjQzY",
    oderId: 9,
    nickname: "Rosy",
    initial: "R",
    role: "경영지원",
    profileImage: getUserById("p1ED7XjQzY")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "YG0dV1BGEw",
    oderId: 10,
    nickname: "SoulGom",
    initial: "S",
    role: "디자이너",
    profileImage: getUserById("YG0dV1BGEw")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "210PA1JRzx",
    oderId: 11,
    nickname: "Wade",
    initial: "W",
    role: "FE",
    profileImage: getUserById("210PA1JRzx")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  {
    id: "WL8JrKw68K",
    oderId: 12,
    nickname: "Woongi",
    initial: "W",
    role: "DA",
    profileImage: getUserById("WL8JrKw68K")?.profileImage,
    status: "WORKING",
    location: "OFFICE",
    checkInTime: "09:00",
    scheduledTime: null,
    vacationType: null,
  },
  // 출근 예정
  {
    id: "w303nxvJ8D",
    oderId: 13,
    nickname: "Allosa",
    initial: "A",
    role: "디자이너",
    profileImage: getUserById("w303nxvJ8D")?.profileImage,
    status: "SCHEDULED",
    location: null,
    checkInTime: null,
    scheduledTime: "13:00",
    vacationType: null,
  },
  {
    id: "vYzRbRgdzZ",
    oderId: 14,
    nickname: "Max",
    initial: "M",
    role: "BE",
    profileImage: getUserById("vYzRbRgdzZ")?.profileImage,
    status: "SCHEDULED",
    location: null,
    checkInTime: null,
    scheduledTime: "14:00",
    vacationType: null,
  },
  // 휴가
  {
    id: "Kq05gJwDEv",
    oderId: 15,
    nickname: "Mura",
    initial: "M",
    role: "BE",
    profileImage: getUserById("Kq05gJwDEv")?.profileImage,
    status: "VACATION",
    location: null,
    checkInTime: null,
    scheduledTime: null,
    vacationType: "연차",
  },
];

// Mock 오늘 미팅 데이터
export const mockTodayMeetings = [
  {
    id: "m1",
    title: "스프린트 회의",
    emoji: "👥",
    time: "10:00",
    participantCount: 5,
    participants: ["Licat", "Binky", "Wade", "HATI", "Zeezee"],
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "m2",
    title: "we:connect 킥오프",
    emoji: "💻",
    time: "14:00",
    participantCount: 3,
    participants: ["Licat", "Binky", "Ona"],
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "m3",
    title: "1:1 미팅",
    emoji: "💬",
    time: "16:00",
    participantCount: 2,
    participants: ["Licat", "Ali"],
    date: new Date().toISOString().split("T")[0],
  },
];

// Mock 퀵노트 데이터
export const mockQuickNotes = [
  {
    id: "q1",
    content: "점심 옥돌 해장국",
    emoji: "🍚",
    creatorId: "eB8qDjBaEK",
    creatorName: "Licat",
    time: "12:00",
    location: "옥돌해장국 제주점",
    participants: ["Licat", "Binky", "Wade"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "q2",
    content: "유스 주문 받습니다",
    emoji: "☕",
    creatorId: "w303nxvJ8D",
    creatorName: "Allosa",
    time: "15:00",
    location: "1층 카페",
    participants: ["Allosa"],
    comments: [
      {
        id: "c1",
        text: "아메리카노 아이스요!",
        authorId: "ODzZq93x0R",
        authorName: "Binky",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c2",
        text: "카페라떼 핫으로 부탁드려요~",
        authorId: "rjzQAaqRz7",
        authorName: "Ona",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c3",
        text: "바닐라라떼 아이스 샷추가요",
        authorId: "210PA1JRzx",
        authorName: "Wade",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

// 팀 상태 요약 계산
export function calculateTeamStatusSummary(members) {
  const working = members.filter((m) => m.status === "WORKING");
  const scheduled = members.filter((m) => m.status === "SCHEDULED");
  const vacation = members.filter((m) => m.status === "VACATION");

  const byLocation = {
    remote: working.filter((m) => m.location === "REMOTE"),
    officeJeju: working.filter((m) => m.location === "OFFICE_JEJU"),
    office: working.filter((m) => m.location === "OFFICE"),
  };

  return {
    workingCount: working.length,
    scheduledCount: scheduled.length,
    vacationCount: vacation.length,
    byLocation,
    scheduled,
    vacation,
  };
}

// 퀵노트 이모지 옵션
export const QUICKNOTE_EMOJIS = [
  { emoji: "🍚", label: "밥" },
  { emoji: "☕", label: "카페" },
  { emoji: "🍺", label: "술" },
  { emoji: "🎮", label: "게임" },
  { emoji: "🏊", label: "운동" },
  { emoji: "💬", label: "기타" },
];
