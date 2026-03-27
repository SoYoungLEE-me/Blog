---
title: bcrypt로 비밀번호 암호화하기
date: 2026-02-02
tags:
  - Security
  - Backend
  - bcrypt
---

## bcrypt란?

**bcrypt**는 비밀번호를 **단방향 해시(one-way hash)** 방식으로 암호화하기 위한 npm 라이브러리이다.  
주로 **회원가입 / 로그인** 과정에서 사용되며,  
**평문 비밀번호를 그대로 저장하지 않고 해시 값으로 변환**하여 보안을 강화한다.

- 같은 비밀번호라도 **매번 다른 해시 값**이 생성됨 (salt 사용)
- 해시된 값으로는 원래 비밀번호를 **복호화할 수 없음**

<br>

## ✅ 공식 링크

- npm: [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)

<br>

## ✅ 설치

```bash
npm install bcrypt
```

<br><br>

## bcrypt 암호화 방식

![bcrypt 작동 원리 다이어그램](/images/bcrypt_hash.png)

### 1. salt

Salt는 비밀번호 해시 전에 추가되는 랜덤 문자열이다.
이를 통해 같은 비밀번호라도 항상 다른 해시 값이 생성된다.

```bash
password + salt → hash
```

### 2. saltRounds란?

salt를 생성할 때의 연산 강도(cost factor)로 값이 클수록 보안이 강해지지만 속도가 느려진다. 일반적으로 10~12 정도를 많이 사용하는 듯

```bash
const saltRounds = 10;
```

<br>

## Node.js에서 bcrypt 사용 방법

### 회원가입

회원가입에서 비밀번호를 받을 때 DB에는 보안을 위해서 해시로 저장하는데 이때 bcrypt를 쓰면 편해진다.

1. 클라이언트로부터 비밀번호를 전달받음
2. bcrypt로 salt 생성
3. 비밀번호 + salt → hash
4. DB에는 hash 값만 저장

```js
const saltRounds = 10;

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw new Error("이미 가입이 된 유저입니다.");
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      name,
      password: hash,
    });

    await newUser.save();

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};
```

<br>

**genSaltSync – salt 생성**

```js
const salt = bcrypt.genSaltSync(saltRounds);
```

- bcrypt가 내부적으로 랜덤한 salt 문자열을 생성한다.

- 이 salt는 비밀번호 해시 전에 추가되는 고유한 값이다.

- 같은 비밀번호라도 salt가 다르면 결과 해시 값은 완전히 달라진다.

<br>

**hashSync – 비밀번호 해시화**

```js
const hash = bcrypt.hashSync(password, salt);
```

- 사용자가 입력한 평문 비밀번호(password) 와

- 위에서 생성한 salt 를 합쳐서

- 단방향 해시 값(hash) 을 생성한다.

=> DB에는 이 hash 값만 저장되는 것.

<br>

### 로그인

로그인 시에는 새로 해시를 만들지 않고 bcrypt의 compare 함수를 사용해 입력값과 저장된 해시를 비교한다.

```js
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);

      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }

    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};
```

<br>

**compareSync로 비밀번호 비교하기**

```js
const isMatch = bcrypt.compareSync(password, user.password);
```

- password
  → 사용자가 로그인 화면에서 입력한 평문 비밀번호

- user.password
  → 회원가입 시 bcrypt로 생성해 DB에 저장된 해시된 비밀번호

입력된 password를 user.password에 포함된 salt 값으로 다시 해시해서 생성된 해시 값과 DB에 저장된 해시 값 비교하는 과정을 갖는 것이다.

=> 따라서 로그인 시에는 새로운 hash를 만들지 않고 compare 함수를 사용해야 한다는 것

compareSync가 내부적으로 salt 추출 + 해시 + 비교까지 자동으로 처리해주는 것이다.
