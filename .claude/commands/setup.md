# 기본 프로젝트 세팅

React + Vite 기반 프론트엔드 프로젝트의 폴더 구조를 설계합니다.
앱 형태로 개발하며, 주요 페이지와 컴포넌트 구조를 포함합니다.

## 기술 스택

- 빌드 도구: Vite
- UI 라이브러리: React
- 언어: JavaScript
- 스타일링: Shadcn/UI
- BE: msw를 활용한 Mock 서버 (추후 supabase 연동 예정)

---

### 프로젝트 구조 (React + Vite)

Vite로 생성한 React + JavaScript 템플릿을 기본으로 한다.
루트 폴더를 기준으로 생성한다. 기존 폴더에 파일이 있는 경우 덮어쓰지 않는다.

```bash
npm create vite@latest . -- --template react
cd my-app
npm install
```

폴더 구조는 다음과 같이 common, features 형태를 따릅니다.

```
src/
  ├── mock/          # mock 서버 및 데이터
  ├── assets/          # 이미지, 폰트 등 정적 자원
  ├── components/      # 공통 컴포넌트
  ├── features/        # 주요 기능별 컴포넌트 및 페이지
  ├── hooks/           # 커스텀 훅
  ├── styles/          # 전역 스타일 및 테마
  ├── utils/           # 유틸리티 함수
  ├── App.jsx          # 메인 앱 컴포넌트
  └── main.jsx         # 진입점
```

- 관심사를 분리하여 유지보수성을 높입니다.
