---
title: Express로 웹 서버 구축하기
date: 2026-02-02
tags:
  - Nodejs
  - Express
  - Backend
  - Middleware
---

## Express란?

Express는 Node.js로 **웹 서버를 쉽게 만들 수 있게 도와주는 프레임워크**이다.

Node.js만으로도 서버를 만들 수 있지만,
요청 처리, URL 분기(라우팅) 같은 작업을 직접 구현해야 해서 번거롭다.
Express는 이런 작업을 미리 정리해둔 도구를 제공해
서버 코드를 훨씬 간단하게 작성할 수 있게 해준다.

### Express를 사용하는 이유

- 라우팅이 간단함
- 미들웨어 구조로 확장성 높음
- REST API 서버 구성에 적합
- Mongoose, 인증, 로깅 등과 쉽게 결합 가능

<br>

## ✅ 설치

#### Node.js 프로젝트 초기화

```bash
npm init -y
```

#### Express 설치

```bash
npm install express
```

<br>

## ✅ Express 기본 사용 예제

아래 예제는 Express로 간단한 웹 서버를 만들고, 두 개의 GET 요청을 처리하는 기본 구조이다.

```js
//Express 불러오기 및 서버 객체 생성
const express = require("express");
const app = express();

// "/" 경로로 GET 요청이 들어왔을 때 실행
app.get("/", (req, res) => {
  res.send("hello my world");
});

// "/about" 경로로 GET 요청이 들어왔을 때 실행
app.get("/about", (req, res) => {
  res.send("This is AboutPage");
});

// 5000번 포트에서 서버 실행
app.listen(5000, () => {
  console.log("server is on 5000");
});
```

<br>

#### 라우팅(Routing)

```js
app.get("/", (req, res) => {
  res.send("hello my world");
});
```

- 클라이언트가 특정 URL로 요청하면 실행되는 함수 정의
- req : 요청(request) 객체
- res : 응답(response) 객체
- res.send()는 클라이언트에게 응답을 보내는 역할

<br>

#### 서버 실행

```js
app.listen(5000, () => {
  console.log("server is on 5000");
});
```

- 지정한 포트 번호에서 서버를 실행
- 브라우저에서 http://localhost:5000으로 접근 가능

<br><br>

## Express 미들웨어(Middleware)

### 미들웨어란?

Express에서 **미들웨어(Middleware)** 는 **요청(Request)이 들어온 뒤, 응답(Response)을 보내기 전에 실행되는 함수**이다.

요청 처리 과정 중간에 끼어들어 요청을 검사하거나, 필요한 작업을 수행한 뒤 다음 단계로 넘길지 말지를 결정한다.

<br>

## ✅ Express 요청 흐름

Express에서 하나의 요청은 다음 순서로 처리된다.

```
Request
   ↓
Middleware
   ↓
Route Handler
   ↓
Response
```

- 미들웨어는 **라우트 핸들러보다 먼저 실행**
- 여러 개의 미들웨어를 순서대로 실행할 수 있음

<br>
미들웨어는 항상 다음 형태를 가진 함수이다.

- req : 요청 객체
- res : 응답 객체
- next : 다음 단계로 넘기기 위한 함수
  - next() 호출 → 다음 미들웨어 또는 라우트 핸들러 실행
  - next() 미호출 → 요청 흐름이 여기서 멈춤

<br>

## ✅미들웨어 예제 코드

```js
const express = require("express");
const app = express();

// 미들웨어 함수
const checkAuth = (req, res, next) => {
  console.log("she has admin permission");
  next(); // 다음 단계로 이동
};

// 라우트 핸들러
const getUser = (req, res) => {
  res.send("here is user info");
};

// /users 요청 시
// checkAuth → getUser 순서로 실행됨
app.get("/users", checkAuth, getUser);

app.listen(5000, () => {
  console.log("server is on 5000");
});
```

next()가 없으면 브라우저에서는 무한 로딩 상태가 되겠지..

<br>

미들웨어는 여러 라우트에서 공통으로 처리해야 하는 작업을 분리하기 위해 사용한다.
예를 들어 로그인 여부 확인, 권한 검사 (admin 여부 등), 요청 로그 출력, 요청 데이터 파싱 등등..
