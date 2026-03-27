---
title: validator로 데이터 검증하기
date: 2026-02-08
tags:
  - Library
  - Validation
  - React
  - Nodejs
  - Mongoose
---

## validator란?

**validator**는 문자열(string) 데이터를 검증하기 위한 npm 라이브러리이다.  
이메일, URL, UUID, 숫자 문자열 등 **형식(format) 검증**에 특화되어 있다.

<br>

## ✅ 공식 링크

- npm: https://www.npmjs.com/package/validator

<br>

## ✅ 설치

### JavaScript 환경

```bash
npm install validator
```

### TypeScript 환경

validator는 기본적으로 JavaScript 라이브러리이기 때문에
TypeScript에서 사용할 경우 타입 정의 파일을 추가로 설치해야 한다.

```bash
npm install validator
npm install -D @types/validator
```

## <br>

<br>

공식 문서의 **“Here is a list of the validators currently available.”** 섹션을 참고하면, validator 라이브러리에서 제공하는 다양한 validator 함수 목록을 확인할 수 있다. 이건 공식 문서 확인하면서 보면 되니까 굳이 정리는 안 해야지...

<br>

## React에서 validator 사용 예시 (이메일 입력 검증)

```js
import validator from "validator";
import { useState } from "react";

function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validator.isEmail(value)) {
      setError("이메일 형식이 올바르지 않습니다.");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={handleChange} />
      {error && <p>{error}</p>}
    </div>
  );
}
```

<br>

## Mongoose에서 validator 사용 예시 (비밀번호 길이 검증)

```js
const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isLength(value, { min: 8 });
      },
      message: "Password must be at least 8 characters long",
    },
  },
});
```
