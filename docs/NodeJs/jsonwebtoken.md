---
title: JWT로 인증 구현하기
date: 2026-02-04
tags:
  - Security
  - Backend
  - JWT
  - Nodejs
---

## jsonwebtoken 라이브러리란?

jsonwebtoken은
Node.js 환경에서 JWT를 생성하고 검증하기 위한 npm 라이브러리이다.

그럼 JWT랑 무엇인가.

**JWT (JSON Web Token)** 는 사용자의 **인증(Authentication) 정보**를 담아 서버와 클라이언트 간에 전달하는 **토큰 기반 인증 방식**이다.

- JSON 형태의 데이터를 사용
- 서버에서 토큰을 발급
- 클라이언트는 이후 요청마다 토큰을 함께 전송
- 서버는 토큰을 검증하여 사용자 인증을 처리

<br>

**토큰(Token)** 은 “이 사용자가 누구인지 이미 인증되었음을 증명하는 문자열”이다.

### 기존 세션 방식 vs 토큰 방식

- **세션 기반 인증**
  - 서버에 로그인 상태 저장
  - 서버 메모리 사용
- **토큰 기반 인증 (JWT)**
  - 인증 정보가 토큰 자체에 포함
  - 서버는 상태를 저장하지 않음 (Stateless)

<br>

다시 jsonwebtoken 라이브러리로 돌아와서 공식 링크와 설치 방법은 다음과 같다

## ✅ 공식 링크

- npm: https://www.npmjs.com/package/jsonwebtoken

<br>

## ✅설치

```bash
npm install jsonwebtoken
```

<br>

## ✅ 사용 방법

### JWT 생성

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: user._id, email: user.email }, // payload
  process.env.JWT_SECRET, // secret key
  { expiresIn: "1h" } // 옵션
);
```

**sign 함수**

jwt.sign()은 JWT 토큰을 생성하는 함수로, 아래 세 가지 요소를 기반으로 하나의 토큰 문자열을 만든다.

1. payload: 토큰에 담을 정보

- 토큰에 포함될 사용자 식별 정보
- 서버가 “이 요청이 누구의 요청인지” 판단하기 위한 데이터
- 보통 id 같은 고유 식별자만 포함해도 충분하다.
- 주의해야하는 점은 payload는 암호화되지 않고 Base64로 인코딩되기 때문에 누구나 디코딩해서 내용을 볼 수 있다. 그래서 비밀번호 이런거 넣으면 안됨

2. secret key : 토큰 서명에 사용되는 비밀 키

- 토큰의 Signature를 생성하고 검증하는 데 사용되는 비밀 키
- 서버만 알고 있어야 하는 값
- 이 키가 같아야만 토큰 검증(verify)에 성공함

3. expiresIn: 토큰 유효 시간

- JWT의 유효 기간(expiration time) 을 설정하는 옵션
- 설정된 시간이 지나면 토큰은 자동으로 만료됨
- 무한 로그인 상태를 방지하는 등 필수 설정임

<br><br>

## ✅ Node.js에서 JWT 사용 방법 (Schema method 활용)

Node.js + Mongoose 환경에서는 JWT 생성 로직을 **Controller가 아니라 Schema(Model)에 분리**해서 작성하는 경우가 많다. 이렇게 하면 **토큰 생성 책임을 User 모델이 가지게 되어 코드가 더 깔끔해진다.**

<br>

### User Schema에서 JWT 생성 메서드 정의

```js
userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    { _id: this.id }, // payload
    JWT_SECRET_KEY, // secret key
    { expiresIn: "1d" } // 옵션
  );
  return token;
};
```

<br>

### Controller에서 generateToken 사용하기- 로그인 전체 흐름에서의 역할

```js
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");

    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);

      if (isMatch) {
        const token = await user.generateToken();

        return res.status(200).json({
          status: "success",
          user,
          token,
        });
      }
    }

    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};
```

<br>
이 구조를 쓰면 JWT 생성 로직이 Model에 캡슐화 되면서 인증 관련 책임 분리가 명확해진다느 장점이 있다.

생성된 토큰을 검증해서 사용자 정보를 식별하는 방법은 nodejs에 따로 정리해두도록 하겠다.

끝-!
