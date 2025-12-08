// 프로필 이미지 경로 생성 함수
const getProfileImage = (displayName) =>
  `/images/profiles/${displayName.toLowerCase()}.png`;

// 유저 데이터
export const users = [
  {
    id: "GM81lY9nE4",
    name: "김진",
    displayName: "Ali",
    email: "kimlynnjean@gmail.com",
    department: "데이터팀",
    role: "DA",
    rank: "팀원",
    profileImage: getProfileImage("Ali"),
    color: "orange",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "w303nxvJ8D",
    name: "김남희",
    displayName: "Allosa",
    email: "skagml3098@naver.com",
    department: "디자인팀",
    role: "디자이너",
    rank: "팀원",
    profileImage: getProfileImage("Allosa"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "5Y06gkQezX",
    name: "황병헌",
    displayName: "Benny",
    email: "elwl5515@gmail.com",
    department: "개발팀",
    role: "BE",
    rank: "팀원",
    profileImage: getProfileImage("Benny"),
    color: "blue",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "ODzZq93x0R",
    name: "김유진",
    displayName: "Binky",
    email: "kyj9982@naver.com",
    department: "C-Level",
    role: "FE",
    rank: "CTO",
    profileImage: getProfileImage("Binky"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "xBEYJgqZ8g",
    name: "백경현",
    displayName: "Hati",
    email: "gyeongbaek110@gmail.com",
    department: "개발팀",
    role: "FE",
    rank: "팀원",
    profileImage: getProfileImage("Hati"),
    color: "blue",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "eB8qDjBaEK",
    name: "이호준",
    displayName: "Licat",
    email: "paullabkorea@gmail.com",
    department: "C-Level",
    role: null,
    rank: "CEO",
    profileImage: getProfileImage("Licat"),
    color: "green",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "vYzRbRgdzZ",
    name: "김승주",
    displayName: "Max",
    email: "pipiru100@gmail.com",
    department: "개발팀",
    role: "BE",
    rank: "기술수석",
    profileImage: getProfileImage("Max"),
    color: "blue",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "Kq05gJwDEv",
    name: "김혜원",
    displayName: "Mura",
    email: "coope0357@gmail.com",
    department: "C-Level",
    role: "BE",
    rank: "COO",
    profileImage: getProfileImage("Mura"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "rjzQAaqRz7",
    name: "이희지",
    displayName: "Ona",
    email: "wndls96@gmail.com",
    department: "디자인팀",
    role: "디자이너",
    rank: "팀원",
    profileImage: getProfileImage("Ona"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "p1ED7XjQzY",
    name: "김민승",
    displayName: "Rosy",
    email: "weniv0107@gmail.com",
    department: "경영지원",
    role: "경영지원",
    rank: "팀원",
    profileImage: getProfileImage("Rosy"),
    color: "green",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "YG0dV1BGEw",
    name: "차경림",
    displayName: "SoulGom",
    email: "dkdk7422@gmail.com",
    department: "C-Level",
    role: "디자이너",
    rank: "CDO",
    profileImage: getProfileImage("SoulGom"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "rjzQAgmxz7",
    name: "문순려",
    displayName: "Sunny",
    email: "elma9700@gmail.com",
    department: "개발팀",
    role: "BE",
    rank: "팀원",
    profileImage: getProfileImage("Sunny"),
    color: "blue",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "210PA1JRzx",
    name: "한재현",
    displayName: "Wade",
    email: "nugurejeil1@gmail.com",
    department: "C-Level",
    role: "FE",
    rank: "CPO",
    profileImage: getProfileImage("Wade"),
    color: "purple",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "WL8JrKw68K",
    name: "김진환",
    displayName: "Woongi",
    email: "happydata1510@gmail.com",
    department: "데이터팀",
    role: "DA",
    rank: "팀장",
    profileImage: getProfileImage("Woongi"),
    color: "orange",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "rM0APGlw8l",
    name: "전유진",
    displayName: "Zeezee",
    email: "dklvmf0106@gmail.com",
    department: "개발팀",
    role: "FE",
    rank: "팀원",
    profileImage: getProfileImage("Zeezee"),
    color: "blue",
    status: "IN_EMPLOY",
    createdAt: "2024-01-15T09:00:00Z",
  },
];

// 부서 데이터
export const departments = [
  { id: "pVEkjO64zM", name: "C-Level", memberCount: 5 },
  { id: "pVEkjrG7zM", name: "개발팀", memberCount: 5 },
  { id: "5M0n9nwN86", name: "디자인팀", memberCount: 2 },
  { id: "53Ej9MNOzr", name: "데이터팀", memberCount: 2 },
  { id: "7907qPjaEg", name: "경영지원", memberCount: 1 },
];

// 직무 데이터
export const roles = [
  { id: "ODzZgZLoER", name: "FE" },
  { id: "210PQZoXzx", name: "BE" },
  { id: "w303JBNl8D", name: "DA" },
  { id: "248NxZraze", name: "디자이너" },
  { id: "p1EDwZM5zY", name: "기획자" },
  { id: "GBzMoZbl8J", name: "경영지원" },
];

// 직급 데이터
export const ranks = [
  { id: "5Y06bJq0Xp", name: "CEO" },
  { id: "rjzQr7QE7n", name: "COO" },
  { id: "w30321n8D9", name: "CTO" },
  { id: "xBEYde5zgl", name: "CPO" },
  { id: "vYzRX9M8Z3", name: "CDO" },
  { id: "eR0x1GXzmD", name: "기술수석" },
  { id: "210Pymmzxv", name: "팀장" },
  { id: "k1EBkBe8yq", name: "팀원" },
];

// 유저를 displayName으로 찾기
export function getUserByDisplayName(displayName) {
  return users.find(
    (user) => user.displayName.toLowerCase() === displayName.toLowerCase()
  );
}

// 유저를 ID로 찾기
export function getUserById(id) {
  return users.find((user) => user.id === id);
}

// 부서별 유저 목록
export function getUsersByDepartment(departmentName) {
  return users.filter((user) => user.department === departmentName);
}
