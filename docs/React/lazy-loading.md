---
title: Lazy Loading 개념 정리
date: 2025-10-15
tags:
  - React
  - Performance
  - LazyLoading
---

## Lazy Loading이란?

필요한 시점에만 리소스를 로드하는 기법이다.
앱을 처음 실행할 때 모든 코드를 한 번에 불러오지 않고, 실제로 필요한 순간에만 해당 코드를 불러온다.

<br>

## ✅ 1. 왜 필요한가?

React SPA는 빌드 시 모든 코드를 하나의 번들 파일로 합친다.
앱이 커질수록 번들 크기가 커지고, 초기 로딩 속도가 느려진다.

Lazy Loading을 적용하면 **코드 스플리팅(Code Splitting)** 이 가능해져
사용자가 실제로 방문하는 페이지의 코드만 그때그때 로드한다.

| 구분        | 설명                                                    |
| ----------- | ------------------------------------------------------- |
| **적용 전** | 앱 전체 코드를 한 번에 다운로드 → 첫 화면까지 오래 걸림 |
| **적용 후** | 현재 페이지 코드만 다운로드 → 첫 화면 빠르게 표시       |

<br>

## ✅ 2. React.lazy + Suspense

`React.lazy()`로 컴포넌트를 동적으로 import하고,
`Suspense`로 로드되는 동안 보여줄 fallback UI를 지정한다.

```javascript
import { lazy, Suspense } from "react";

// 기존 방식 — 앱 시작 시 즉시 로드
// import MyPage from "./MyPage";

// Lazy Loading — 해당 컴포넌트가 렌더링될 때 로드
const MyPage = lazy(() => import("./MyPage"));

const App = () => (
  <Suspense fallback={<p>로딩 중...</p>}>
    <MyPage />
  </Suspense>
);
```

<br>

## ✅ 3. 라우터 단위 적용

페이지 단위로 적용할 때 효과가 가장 크다.
각 페이지 컴포넌트를 `lazy()`로 감싸고, 라우터 전체를 `Suspense`로 감싼다.

```javascript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const PostDetail = lazy(() => import("./pages/PostDetail"));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<p>페이지 로딩 중...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

> 사용자가 `/about`에 접근할 때 비로소 `About` 컴포넌트의 코드를 다운로드한다.
> 방문하지 않은 페이지의 코드는 다운로드하지 않는다.

---

<br>

**핵심 개념:** 한 번에 다 받지 않고, 필요할 때 필요한 것만 받는다.
