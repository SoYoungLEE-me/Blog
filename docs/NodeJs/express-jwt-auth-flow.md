---
title: Express JWT 인증 및 미들웨어 흐름 정리
date: 2026-02-09
tags:
  - Backend
  - Nodejs
  - JWT
  - Middleware
  - Security
---

## Express JWT 인증 흐름 (Middleware & Router)

이 문서는 발급된 JWT를 Express 서버에서 어떻게 검증하고(Middleware), 실제 라우터에 어떻게 적용하는지를 정리한다.

<br>

## ✅ 1. Auth 미들웨어 (토큰 검증)

클라이언트가 보낸 토큰이 유효한지 확인하고, 유효하다면 해당 사용자의 `id`를 `req` 객체에 담아 다음 단계(컨트롤러)로 넘겨주는 역할을 한다.

```javascript
// authController.js
const authController = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("invalid token");

    const token = tokenString.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET_KEY); // 동기 방식, 실패 시 자동으로 catch로 이동

    req.userId = payload._id;
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", error: err.message });
  }
};

module.exports = authController;
```

<br>

## ✅ 2. Router 및 Frontend 적용

### 서버 라우터 설정

인증이 필요한 API 주소에 미들웨어를 배치한다. 미들웨어를 통과해야만 실제 비즈니스 로직 ex) `getUser` 등이 실행된다.

```javascript
// GET /me 요청 시 먼저 토큰을 검증(authenticate)하고 성공하면 유저 정보를 가져옴(getUser)

router.get("/me", authController.authenticate, userController.getUser);
```

### 프론트엔드 요청 예시 (Axios/Fetch)

클라이언트는 로그인 시 받은 토큰을 `sessionStorage` 등에 저장해두었다가 요청 시 헤더에 담아 보낸다.

> ⚠️ `sessionStorage`는 XSS 공격에 노출될 수 있으므로, 보안이 중요한 서비스라면 `httpOnly Cookie` 방식을 고려할 것.

```javascript
// frontend 예시
const token = sessionStorage.getItem("token");

const response = await axios.get("http://localhost:5000/api/user/me", {
  headers: {
    authorization: "Bearer " + token,
  },
});
```

---

<br>

**Stateless:** 서버는 상태를 저장하지 않고 토큰의 유효성만 판단함.
