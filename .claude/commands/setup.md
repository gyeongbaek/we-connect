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
-

# 디자인 시스템

## 색상 시스템

### Light Theme (기본)

| Token      | 변수명          | 값        | 용도             |
| ---------- | --------------- | --------- | ---------------- |
| White      | `$white`        | `#fff`    | 공통 흰색        |
| Primary    | `$W-primary`    | `#2e6ff2` | 주 브랜드 색상   |
| Background | `$W-background` | `#fff`    | 배경색           |
| Surface    | `$W-surface`    | `#121314` | 텍스트/표면 색상 |
| Gray Lv1   | `$W-grayLv1`    | `#f3f5fa` | 가장 밝은 회색   |
| Gray Lv2   | `$W-grayLv2`    | `#d9dbe0` | 밝은 회색        |
| Gray Lv3   | `$W-grayLv3`    | `#8d9299` | 중간 회색        |
| Gray Lv4   | `$W-grayLv4`    | `#47494d` | 어두운 회색      |
| Error      | `$W-error`      | `#ff3440` | 에러/위험        |
| Warn       | `$W-warn`       | `#ffc533` | 경고             |
| Activation | `$W-activation` | `#dee8ff` | 활성화 상태      |

#### 접근성 색상

| Token         | 변수명           | 값        | 용도                |
| ------------- | ---------------- | --------- | ------------------- |
| Primary A11y  | `$W-primaryA11y` | `#2861d2` | 접근성 대비 Primary |
| Gray Lv3 A11y | `$W-grayLv3A11y` | `#6c7074` | 접근성 대비 Gray    |

#### 코드 하이라이트 색상

| Token  | 변수명           | 값        |
| ------ | ---------------- | --------- |
| Pink   | `$W-code-pink`   | `#c93864` |
| Purple | `$W-code-purple` | `#964dd1` |
| Blue   | `$W-code-blue`   | `#2e5dd6` |
| Green  | `$W-code-green`  | `#328026` |
| Orange | `$W-code-orange` | `#e37c00` |

#### Shadow

```scss
$W-shadow: 0rem 0.25rem 1.25rem 0rem #0000000a;
```

### Dark Theme

| Token      | 변수명          | 값        |
| ---------- | --------------- | --------- |
| Primary    | `$D-primary`    | `#3075ff` |
| Background | `$D-background` | `#1f2123` |
| Surface    | `$D-surface`    | `#ffffff` |
| Gray Lv1   | `$D-grayLv1`    | `#121314` |
| Gray Lv2   | `$D-grayLv2`    | `#595f66` |
| Gray Lv3   | `$D-grayLv3`    | `#d9dbe0` |
| Gray Lv4   | `$D-grayLv4`    | `#f3f5fa` |
| Error      | `$D-error`      | `#fc7377` |
| Warn       | `$D-warn`       | `#ffe187` |
| Activation | `$D-activation` | `#2b3444` |

#### Dark 코드 하이라이트 색상

| Token  | 변수명           | 값        |
| ------ | ---------------- | --------- |
| Pink   | `$D-code-pink`   | `#ed4779` |
| Purple | `$D-code-purple` | `#c893fd` |
| Blue   | `$D-code-blue`   | `#618dff` |
| Green  | `$D-code-green`  | `#50c140` |
| Orange | `$D-code-orange` | `#ffa52a` |

### CSS Custom Properties 사용법

```scss
// globals.scss에서 body에 CSS 변수로 적용됨
color: var(--surface);
background-color: var(--background);
border: 0.0625rem solid var(--grayLv2);
```

### 테마 적용 방식

```html
<!-- Light (기본) -->
<body>
  <!-- Dark -->
  <body data-theme="dark">
    <body class="dark">
      <!-- 명시적 Light -->
      <body data-theme="light">
        <body class="light"></body>
      </body>
    </body>
  </body>
</body>
```

## 타이포그래피

### 폰트 패밀리

| 용도 | 폰트명          | 적용                                     |
| ---- | --------------- | ---------------------------------------- |
| 본문 | Pretendard      | `font-family: "Pretendard", sans-serif;` |
| 코드 | Source Code Pro | `@include code;`                         |

### Font Weights

| 약어 | 값             | 변수명        |
| ---- | -------------- | ------------- |
| `r`  | 400 (Regular)  | text-regular  |
| `m`  | 500 (Medium)   | text-medium   |
| `sb` | 600 (SemiBold) | text-semibold |
| `b`  | 700 (Bold)     | text-bold     |

### Line Heights

| Font Size | Line Height       | 변수명  |
| --------- | ----------------- | ------- |
| .75rem    | 1rem (25.6px)     | text-12 |
| .875rem   | 1.25rem (32px)    | text-14 |
| 1rem      | 1.375rem (35.2px) | text-16 |
| 1.125rem  | 1.5rem (38.4px)   | text-18 |
| 1.5rem    | 2rem (51.2px)     | text-24 |
| 2rem      | 2.5rem (64px)     | text-32 |
| 2.5rem    | 3.5rem (89.6px)   | text-40 |

## Layout

앱 형태로 개발하며 반응형으로 동작합니다.
모바일과 데스크톱에서 모두 원활하게 작동하도록 설계합니다.

### Breakpoints

| 이름      | 최소 너비 |
| --------- | --------- |
| Mobile    | 0px       |
| Tablet    | 768px     |
| Desktop   | 1024px    |
| LargeDesk | 1440px    |

- 화면의 최대 너비는 1190px로 제한되며, 중앙 정렬됩니다.
- 좌우 여백은 16px로 설정됩니다.

```css
.container {
  max-width: 1190px;
  width: calc(100% - 32px);
  margin: 0 auto;
}
```
