---
title: TypeScript 타입 안전성
date: 2026-04-05
tags:
  - TypeScript
  - 타입안전성
  - any
  - unknown
---

## TypeScript에서 타입 안전성이란?

TypeScript를 쓰는 가장 큰 이유는 **실행 전에 오류를 잡을 수 있다**는 것이다.
그런데 타입을 잘못 다루면 TypeScript를 쓰면서도 런타임 오류가 발생하거나,
로컬에서 빨간 줄이 사라지지 않는 상황이 생긴다.

타입 안전성이란 **어떤 값이 어떤 타입인지를 코드 실행 전에 보장하는 것**이다.
이를 위해 TypeScript는 여러 가지 도구를 제공한다.

<br>
<br>

## ✅ 1. `any` — 타입 체크를 포기하는 선택

`any`는 TypeScript의 타입 체크를 **완전히 무력화**시키는 타입이다.
`any`로 선언된 값은 어떤 타입이든 허용되고, 어떤 메서드를 호출해도 컴파일 에러가 나지 않는다.

```typescript
const process = (input: any) => {
  return input.toUpperCase(); // 컴파일 에러 없음
};

process(42); // 런타임 오류! number에는 toUpperCase가 없음
```

타입 체크를 완전히 끄는 것이기 때문에 **가급적 사용하지 않는 것이 원칙**이다.

<br>

### 그래도 any를 써야 하는 경우

현실에서는 어쩔 수 없이 `any`를 써야 하는 상황이 존재한다.

**1. 타입 정의가 없는 외부 라이브러리를 사용할 때**
오래된 JavaScript 라이브러리 중에는 TypeScript 타입 정의(`.d.ts`)가 없는 경우가 있다.
이 경우 `any`를 임시로 사용하고, 나중에 타입을 직접 정의하는 방향으로 개선하는 것이 좋다.

```typescript
// 타입 정의가 없는 라이브러리
const result: any = someOldLibrary.doSomething();
```

**2. 빠른 프로토타이핑 또는 마이그레이션 중일 때**
JavaScript 프로젝트를 TypeScript로 전환하는 과정에서
모든 타입을 한 번에 정의하기 어려울 때 임시로 `any`를 사용하기도 한다.
이 경우에도 최종적으로는 정확한 타입으로 교체해야 한다.

**3. 정말 어떤 타입이든 받아야 하는 유틸리티 함수**
`JSON.parse()`처럼 결과 타입을 미리 알 수 없는 경우에 사용한다.
단, 이 경우에도 가능하면 `unknown`으로 받고 타입을 좁히는 방식이 더 안전하다.

```typescript
// any보다 unknown이 더 안전
const parseJSON = (json: string): unknown => {
  return JSON.parse(json);
};
```

> `any`를 써야 하는 상황이라면, 최소한 그 범위를 좁게 유지하고
> 주석으로 왜 `any`를 사용했는지 이유를 남기는 것이 좋다.

<br>
<br>

## ✅ 2. `unknown` — 안전한 any의 대안

`unknown`도 타입을 특정하지 않을 때 사용하지만, `any`와 달리
**사용하기 전에 반드시 타입을 확인해야 한다.**
이 강제성 덕분에 타입 안전성이 유지된다.

```typescript
const process = (input: unknown): string => {
  // ❌ 타입 확인 없이 바로 사용하면 컴파일 에러
  // return input.toUpperCase();

  // ✅ 타입 확인 후 사용
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  throw new Error("문자열만 허용합니다.");
};
```

<br>

### unknown을 써야 하는 경우

**1. 외부에서 들어오는 데이터를 처리할 때**
API 응답, 사용자 입력, 파일 파싱 결과처럼 어떤 타입이 올지 모르는 경우에 사용한다.
`any`로 받으면 타입 체크가 사라지지만, `unknown`으로 받으면 사용 전에 타입을 확인하게 된다.

```typescript
// API 응답처럼 어떤 타입이 올지 모를 때
const handleResponse = (response: unknown): string => {
  if (typeof response === "string") return response;
  if (typeof response === "object" && response !== null) {
    return JSON.stringify(response);
  }
  return "알 수 없는 응답";
};
```

**2. 에러 핸들링에서 catch의 에러 타입**
`try/catch`에서 잡히는 에러는 기본적으로 `unknown` 타입이다.
`any`로 처리하면 타입 체크가 없어지지만, `unknown`으로 처리하면 타입을 확인 후 사용할 수 있다.

```typescript
try {
  // 어떤 작업
} catch (error) {
  // error는 unknown 타입
  if (error instanceof Error) {
    console.log(error.message); // Error 타입으로 확정 후 사용
  }
}
```

<br>

| 구분      | any                                        | unknown                                  |
| --------- | ------------------------------------------ | ---------------------------------------- |
| 타입 체크 | ❌ 없음                                    | ✅ 사용 전 타입 확인 필요                |
| 안전성    | 낮음                                       | 높음                                     |
| 언제 쓰나 | 타입 정의 없는 라이브러리, 마이그레이션 중 | 외부 데이터, 에러 핸들링, 타입 불명확 시 |
| 사용 권장 | ❌ 최소화                                  | ✅ any 대신 권장                         |

<br>
<br>

## ✅ 3. 타입 안전하게 다루는 방법들

타입 안전성을 유지하면서 `undefined`, `null`, 복합 타입 등을 처리하는 방법들이다.
상황에 따라 적절한 방법을 골라 쓰면 된다.

<br>

### typeof — 원시 타입 확인

`string`, `number`, `boolean` 등 원시 타입을 확인할 때 사용한다.
조건문 안에서 타입을 확인하면 해당 블록 안에서 TypeScript가 타입을 자동으로 좁혀준다.

```typescript
const printValue = (value: unknown): void => {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // 이 블록에서 value는 string으로 확정
  } else if (typeof value === "number") {
    console.log(value.toFixed(2)); // 이 블록에서 value는 number로 확정
  }
};
```

<br>

### 옵셔널 체이닝 `?.` — 없을 수도 있는 값에 안전하게 접근

객체의 속성이 `undefined`나 `null`일 수 있을 때 사용한다.
중간에 값이 없으면 오류 대신 `undefined`를 반환한다.

```typescript
type User = {
  name: string;
  address?: {
    city: string;
  };
};

const user: User = { name: "Alice" };

// ❌ address가 없으면 런타임 오류
console.log(user.address.city); // TypeError!

// ✅ address가 없으면 undefined 반환 (오류 없음)
console.log(user.address?.city); // undefined
```

<br>

### Nullish Coalescing `??` — null/undefined일 때 기본값 설정

값이 `null` 또는 `undefined`일 때만 기본값을 사용한다.
`||`와 달리 `0`, `false`, `""` 같은 falsy 값은 정상 값으로 취급하기 때문에
더 안전하게 기본값을 처리할 수 있다.

```typescript
const getUserName = (name: string | null | undefined): string => {
  return name ?? "이름 없음";
};

console.log(getUserName("Alice")); // "Alice"
console.log(getUserName(null)); // "이름 없음"
console.log(getUserName(undefined)); // "이름 없음"
```

`||`와 `??`의 차이는 실무에서 자주 헷갈리는 부분이다.

```typescript
const count = 0;
console.log(count || 10); // 10 → 0은 falsy라서 기본값으로 처리됨 (의도와 다를 수 있음)
console.log(count ?? 10); // 0  → null/undefined가 아니므로 그대로 사용
```

> `0`이나 `false`가 유효한 값인 상황에서는 `||` 대신 `??`를 쓰는 것이 안전하다.

<br>

### 타입 가드 — 조건문으로 타입 좁히기

유니언 타입처럼 여러 타입이 섞여 있을 때, 조건문으로 타입을 확인하면
TypeScript가 해당 블록 안에서 타입을 자동으로 좁혀준다.
이를 **타입 가드**라고 한다.

```typescript
type Admin = { role: string; name: string };
type Guest = { visitCount: number; name: string };
type User = Admin | Guest;

const printUserInfo = (user: User): void => {
  console.log(user.name);

  if ("role" in user) {
    // 이 블록에서 user는 Admin으로 확정
    console.log(`관리자 권한: ${user.role}`);
  } else {
    // 이 블록에서 user는 Guest로 확정
    console.log(`방문 횟수: ${user.visitCount}`);
  }
};
```

<br>

### Non-null Assertion `!` — 최후의 수단

TypeScript에게 "이 값은 절대 null이나 undefined가 아니다"라고 단언하는 방법이다.
타입 체크를 우회하기 때문에 **정말 확실한 경우에만, 최후의 수단으로** 사용해야 한다.

```typescript
const input = document.getElementById("username"); // HTMLElement | null

// ❌ null일 수 있다고 오류 발생
input.value;

// ✅ Non-null Assertion — null이 아님을 단언
input!.value; // 실제로 null이면 런타임 오류 발생

// ✅ 더 안전한 방법 — if로 확인 후 접근
if (input) {
  input.value; // 안전
}
```

> `!`는 타입 체크를 우회한다는 점에서 `any`와 비슷한 위험성이 있다.
> 가급적 `if`로 확인하는 방식으로 대체하는 것이 좋다.

<br>
<br>

## 상황별 정리

| 상황                                   | 사용할 방법                  |
| -------------------------------------- | ---------------------------- |
| 타입 정의 없는 라이브러리 사용 시      | `any` (임시, 이유 주석 필수) |
| 타입을 모르는 값을 받아야 할 때        | `unknown` + `typeof`         |
| 객체 속성이 없을 수도 있을 때          | `?.` (옵셔널 체이닝)         |
| 값이 없을 때 기본값을 설정하고 싶을 때 | `??` (Nullish Coalescing)    |
| 유니언 타입을 분기 처리할 때           | `in` 연산자, 타입 가드       |
| 절대 null이 아님을 확신할 때           | `!` (최후의 수단)            |

<br>

타입 안전성의 핵심은 **TypeScript가 타입을 모르는 상황을 최소화**하는 것이다.
`any`로 오류를 없애버리는 것은 해결이 아니라 문제를 숨기는 것이고,
`unknown`과 타입 가드를 활용해서 TypeScript가 타입을 확정할 수 있도록 코드를 작성하는 것이 올바른 방향이다.

---

<br>

**핵심 요약:**

- **`any`** → 타입 체크 무력화, 불가피한 경우에만 최소 범위로 사용, 이유 주석 필수
- **`unknown`** → any의 안전한 대안, 외부 데이터나 에러 핸들링에 사용
- **`?.`** → 없을 수도 있는 속성에 안전하게 접근
- **`??`** → null/undefined일 때만 기본값, `||`와 달리 0/false는 정상 값으로 처리
- **타입 가드** → 조건문으로 타입을 좁혀 안전하게 사용
- **`!`** → 확실할 때만, 가급적 if로 대체
