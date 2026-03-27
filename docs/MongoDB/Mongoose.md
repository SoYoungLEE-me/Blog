---
title: Mongoose로 MongoDB 구조화하기
date: 2026-02-03
tags:
  - MongoDB
  - Mongoose
  - Backend
  - Database
---

## Mongoose란?

Mongoose는 **MongoDB를 더 구조적으로 사용하기 위한 ODM(Object Data Modeling) 라이브러리**이다.

MongoDB가 스키마가 없는(NoSQL) 데이터베이스라면, Mongoose는 그 위에 **Schema / Model 개념을 추가**해 다음을 가능하게 한다.

- 데이터 구조 정의
- 타입 관리
- 기본값 설정
- 유효성 검사(validation)
- 미들웨어(hook) 사용

<br>

### Mongoose를 사용하는 이유 (장점)

---

스키마 기반으로 **데이터 구조가 명확해짐**

- 잘못된 데이터가 DB에 들어가는 것을 사전에 차단
- 실무에서 사용하는 CRUD 패턴과 잘 맞음
- MongoDB native driver보다 코드 가독성이 좋음

<br>

## ✅ 설치

```bash
npm install mongoose
```

<br>

## ✅ Mongoose 사용 방법

### 1. MongoDB 연결

Mongoose를 사용하려면 먼저 애플리케이션과 MongoDB 서버를 연결해야 한다.
이 연결은 보통 서버 시작 시 한 번만 실행하고 재사용한다.

```js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mongoose-til");
```

<br>

### 2. Schema 정의

Schema는 MongoDB document의 구조와 규칙을 정의하는 설계도이다.
필드의 타입, 기본값, 유효성 검사 규칙 등을 설정할 수 있다.

이 예제에서는 validator 라이브러리를 사용해
이메일 형식에 대한 커스텀 유효성 검사를 추가했다.

```js
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    validate: {
      // validator 라이브러리를 사용한 이메일 형식 검증
      validator: (value) => validator.isEmail(value),
      message: "Invalid email format",
    },
  },

  password: {
    type: String,
    required: true,
    trim: true, // 문자열 앞뒤 공백 제거
  },

  age: {
    type: Number,
    default: 18, // 값이 없을 경우 기본값 설정
  },
});
```

<br>

### 3. Model 생성

Model은 Schema를 기반으로 만들어진 데이터 접근 객체이다.
Model을 통해 실제 CRUD 작업을 수행한다.

```js
const User = mongoose.model("User", userSchema);
```

<br>

### 4. Document 생성 및 저장

```js
const newUser = new User({
  name: "Bob",
  email: "bob@example.com",
  password: "  password123  ",
});

newUser
  .save()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err.message);
  });
```
