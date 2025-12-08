// 휴가 종류
export const VACATION_TYPES = {
  PAID: { label: "유급휴가", emoji: "🌴", defaultDays: 20 },
  UNPAID: { label: "무급휴가", emoji: "📁", defaultDays: 40 },
  FOUNDATION: { label: "창립일", emoji: "🎉", defaultDays: 1 },
  BIRTHDAY: { label: "생일반차", emoji: "🎂", defaultDays: 0.5 },
  MARRIAGE_SELF: { label: "결혼본인", emoji: "💒", defaultDays: 5 },
  MARRIAGE_CHILD: { label: "결혼자녀", emoji: "💐", defaultDays: 1 },
  BEREAVEMENT_1: { label: "조의(배우자/부모)", emoji: "🕯️", defaultDays: 5 },
  BEREAVEMENT_2: { label: "조의(조부모/형제)", emoji: "🕯️", defaultDays: 3 },
  PARENTAL: { label: "육아휴직", emoji: "👶", defaultDays: 90 },
};

// Mock 근태 데이터
export const mockAttendanceRecords = [
  {
    id: "1",
    userId: "user1",
    date: "2024-12-04",
    sessions: [
      {
        id: "s1",
        type: "MORNING",
        location: "REMOTE",
        startTime: "09:00",
        endTime: "12:00",
        lunchBreak: false,
      },
      {
        id: "s2",
        type: "AFTERNOON",
        location: "REMOTE",
        startTime: "13:00",
        endTime: "18:00",
        lunchBreak: true,
      },
    ],
    totalHours: 8,
    status: "COMPLETED",
  },
  {
    id: "2",
    userId: "user1",
    date: "2024-12-05",
    sessions: [
      {
        id: "s3",
        type: "MORNING",
        location: "OFFICE",
        startTime: "09:00",
        endTime: "12:00",
        lunchBreak: false,
      },
      {
        id: "s4",
        type: "AFTERNOON",
        location: "OFFICE",
        startTime: "13:00",
        endTime: "18:00",
        lunchBreak: true,
      },
    ],
    totalHours: 8,
    status: "COMPLETED",
  },
];

// Mock 휴가 잔여 현황
export const mockVacationBalance = [
  { type: "PAID", total: 20, used: 3, remaining: 17 },
  { type: "UNPAID", total: 40, used: 0, remaining: 40 },
  { type: "FOUNDATION", total: 1, used: 0, remaining: 1 },
  { type: "BIRTHDAY", total: 0.5, used: 0, remaining: 0.5 },
  { type: "MARRIAGE_SELF", total: 5, used: 0, remaining: 5 },
  { type: "MARRIAGE_CHILD", total: 1, used: 0, remaining: 1 },
  { type: "BEREAVEMENT_1", total: 5, used: 0, remaining: 5 },
  { type: "BEREAVEMENT_2", total: 3, used: 0, remaining: 3 },
  { type: "PARENTAL", total: 90, used: 0, remaining: 90 },
];

// 월간 통계 계산
export function calculateMonthlyStats(records) {
  const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0);
  const workingDays = 22; // 월 평균 근무일
  const standardHours = workingDays * 8;
  const overtimeHours = totalHours - standardHours;

  return {
    totalHours,
    standardHours,
    overtimeHours,
    workingDays: records.length,
  };
}
