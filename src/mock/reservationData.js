// 공간 목록
export const ROOMS = [
  {
    id: "studio1",
    name: "방송실1",
    type: "STUDIO",
    emoji: "🎙️",
    color: "#3B82F6", // blue-500
  },
  {
    id: "studio2",
    name: "방송실2",
    type: "STUDIO",
    emoji: "🎙️",
    color: "#8B5CF6", // violet-500
  },
  {
    id: "classroom",
    name: "강의실",
    type: "CLASSROOM",
    emoji: "📚",
    color: "#10B981", // emerald-500
  },
];

// 오늘 날짜 기준 예약 목록
const today = new Date().toISOString().split("T")[0];

export const mockReservations = [
  {
    id: "r1",
    roomId: "studio2",
    userId: "licat",
    date: today,
    startTime: "09:00",
    endTime: "11:00",
    title: "유튜브 촬영",
    memo: "신제품 소개 영상 촬영 예정",
    createdAt: new Date().toISOString(),
    user: {
      id: "licat",
      nickname: "Licat",
      initial: "L",
      role: "DA",
    },
  },
  {
    id: "r2",
    roomId: "studio1",
    userId: "ali",
    date: today,
    startTime: "10:00",
    endTime: "12:00",
    title: "팟캐스트 녹음",
    memo: null,
    createdAt: new Date().toISOString(),
    user: {
      id: "ali",
      nickname: "Ali",
      initial: "A",
      role: "DA",
    },
  },
  {
    id: "r3",
    roomId: "classroom",
    userId: "hati",
    date: today,
    startTime: "11:00",
    endTime: "13:00",
    title: "Python 기초",
    memo: "입문자 대상 파이썬 강의",
    createdAt: new Date().toISOString(),
    user: {
      id: "hati",
      nickname: "Hati",
      initial: "H",
      role: "FE",
    },
  },
  {
    id: "r4",
    roomId: "studio1",
    userId: "sunny",
    date: today,
    startTime: "14:00",
    endTime: "16:00",
    title: "라이브 방송",
    memo: null,
    createdAt: new Date().toISOString(),
    user: {
      id: "sunny",
      nickname: "Sunny",
      initial: "S",
      role: "BE",
    },
  },
  {
    id: "r5",
    roomId: "studio2",
    userId: "binky",
    date: today,
    startTime: "14:00",
    endTime: "16:00",
    title: "인터뷰 촬영",
    memo: "외부 게스트 인터뷰",
    createdAt: new Date().toISOString(),
    user: {
      id: "binky",
      nickname: "Binky",
      initial: "B",
      role: "FE",
    },
  },
  {
    id: "r6",
    roomId: "classroom",
    userId: "wade",
    date: today,
    startTime: "15:00",
    endTime: "18:00",
    title: "React 심화",
    memo: "Hooks 심화 강의",
    createdAt: new Date().toISOString(),
    user: {
      id: "wade",
      nickname: "Wade",
      initial: "W",
      role: "FE",
    },
  },
];

// 운영 시간 설정
export const OPERATION_HOURS = {
  start: 9, // 09:00
  end: 21, // 21:00
};

// 예약 규칙
export const RESERVATION_RULES = {
  minDuration: 30, // 최소 30분
  maxDuration: 240, // 최대 4시간
  interval: 30, // 30분 단위
  cancelDeadline: 60, // 시작 1시간 전까지 취소 가능
};

// 시간 슬롯 생성 헬퍼
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = OPERATION_HOURS.start; hour <= OPERATION_HOURS.end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < OPERATION_HOURS.end) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

// 시간 문자열을 분으로 변환
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// 분을 시간 문자열로 변환
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

// 예약 충돌 확인
export const checkConflict = (reservations, roomId, date, startTime, endTime, excludeId = null) => {
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  return reservations.filter((r) => {
    if (r.id === excludeId) return false;
    if (r.roomId !== roomId || r.date !== date) return false;

    const existingStart = timeToMinutes(r.startTime);
    const existingEnd = timeToMinutes(r.endTime);

    // 시간 겹침 확인
    return newStart < existingEnd && newEnd > existingStart;
  });
};

// 날짜 포맷
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};

// 시간 차이 계산 (시간 단위)
export const calculateDuration = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return (endMinutes - startMinutes) / 60;
};
