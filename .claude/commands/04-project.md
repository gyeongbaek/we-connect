## 4. 프로젝트 페이지

### 개요

진행 중인 프로젝트 관리 및 링크 허브

### 기능 요구사항

| 기능          | 설명                             | 우선순위 |
| ------------- | -------------------------------- | -------- |
| 프로젝트 목록 | 전체 프로젝트 카드 리스트        | P0       |
| 프로젝트 추가 | 새 프로젝트 생성                 | P0       |
| 링크 연결     | Discord 채널, Notion 페이지 링크 | P0       |
| 담당자 지정   | 프로젝트별 담당자 배정           | P1       |
| 상태 관리     | 진행중/완료/보류 상태 변경       | P1       |
| 템플릿        | 프로젝트 생성 시 템플릿 선택     | P2       |

### 화면 구성

- **상단**: 프로젝트 추가 버튼 + 필터 (상태별)
- **중앙**: 프로젝트 카드 그리드
  - 카드 내용: 프로젝트명, 상태 뱃지, 담당자, 링크 아이콘들
- **모달**: 프로젝트 상세/편집 폼

### 데이터 모델

```
Project {
  id: string
  name: string
  description: string
  status: "IN_PROGRESS" | "COMPLETED" | "ON_HOLD"
  discordLink: string
  notionLink: string
  assignees: string[]  // userId 배열
  templateId: string (optional)
  createdAt: datetime
  updatedAt: datetime
}

ProjectTemplate {
  id: string
  name: string
  defaultDescription: string
  defaultLinks: object
}
```

### API 엔드포인트

```
GET    /api/projects            - 프로젝트 목록
POST   /api/projects            - 프로젝트 생성
GET    /api/projects/:id        - 프로젝트 상세
PUT    /api/projects/:id        - 프로젝트 수정
DELETE /api/projects/:id        - 프로젝트 삭제
GET    /api/projects/templates  - 템플릿 목록
```
