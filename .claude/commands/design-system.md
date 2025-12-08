# 스타일링 가이드

- Tailwind CSS v4 기반 유틸리티 클래스 방식
- 별도 CSS 모듈 없이 인라인 className으로 관리

## 컬러 팔레트

| 용도        | 클래스                            |
| ----------- | --------------------------------- |
| 배경        | bg-white, bg-gray-50, bg-slate-50 |
| 텍스트 기본 | text-slate-800, text-gray-900     |
| 텍스트 보조 | text-slate-500, text-gray-500     |
| 보더        | border-slate-200, border-gray-200 |
| 주요 버튼   | bg-slate-900                      |

악센트 색상:

- 파랑: bg-blue-50/500, text-blue-600/700 (활성, 링크)
- 초록: bg-green-500, text-green-600 (완료, 성공)
- 빨강: bg-red-100, text-red-600 (오류, 경고)
- 주황/보라: 태그, 카테고리 구분용

## 공통 컴포넌트 (src/common/components/)

| 컴포넌트 | 용도                        |
| -------- | --------------------------- |
| Modal    | 고정 위치 모달, 반투명 배경 |
| NavItem  | 사이드바 네비게이션 아이템  |
| Card     | 위젯/카드 컨테이너          |

## 레이아웃 구조

MainLayout
├── Sidebar (w-56, 고정)
│ ├── 로고
│ ├── 메인 메뉴 (5개)
│ ├── 서브 메뉴 (2개)
│ └── 사용자 정보
└── Main Content (flex-1)
└── <Outlet />

## 버튼 스타일

Primary: px-4 py-2.5 bg-slate-900 text-white rounded-lg
Secondary: px-4 py-2 bg-slate-100 text-slate-600
rounded-lg
Tertiary: text-blue-600 hover:underline
Icon: p-1 hover:bg-slate-100 rounded

## 입력 필드

w-full px-3 py-2 border border-slate-200 rounded-lg
text-sm
focus:outline-none focus:ring-2 focus:ring-blue-500

## 타이포그래피

| 크기    | 용도        |
| ------- | ----------- |
| text-xs | 라벨, 설명  |
| text-sm | 본문, 메뉴  |
| text-lg | 서브 제목   |
| text-xl | 페이지 제목 |

| 굵기          | 용도        |
| ------------- | ----------- |
| font-medium   | 라벨        |
| font-semibold | 서브 헤더   |
| font-bold     | 페이지 제목 |

## 간격 시스템

- 기본 단위: 4px (Tailwind 기본)
- 패딩: p-1 ~ p-6
- 갭: gap-1 ~ gap-4
- 마진: mb-1 ~ mb-8

## 아이콘

- Lucide React 사용
- 주요: Home, Clock, FileText, FolderKanban, Users,
  Settings

## 상태 인디케이터

// 활성 점
<span className="w-2 h-2 bg-green-500 rounded-full 
  animate-pulse" />

// 배지
<span className="text-xs bg-red-100 text-red-600 px-1.5 
  py-0.5 rounded-full" />

// 진행률 바

  <div className="h-2.5 bg-slate-100 rounded-full">
    <div className="h-full bg-blue-500 rounded-full" />
  </div>

## 프로젝트 색상 (동적)

const colors = [
{ color: "bg-blue-500", light: "bg-blue-100" },
{ color: "bg-green-500", light: "bg-green-100" },
{ color: "bg-purple-500", light: "bg-purple-100" },
{ color: "bg-pink-500", light: "bg-pink-100" },
{ color: "bg-orange-500", light: "bg-orange-100" },
{ color: "bg-cyan-500", light: "bg-cyan-100" },
]
