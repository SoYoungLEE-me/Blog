---
title: TypeScript 기본 개념 및 원시 타입 정리
date: 2026-04-03
tags:
  - TypeScript
  - 원시타입
  - 타입시스템
---

## TypeScript란?

TypeScript는 JavaScript에 **타입 시스템**을 추가한 언어다.
JavaScript의 상위 집합(Superset)으로, TypeScript로 작성한 코드는
결국 JavaScript로 변환(컴파일)되어 실행된다.

<br>

### JavaScript의 한계

JavaScript는 타입을 명시하지 않아도 되는 동적 타입 언어다.
이 유연함이 오히려 문제가 되는 경우가 많다.

```javascript
// JavaScript — 타입 오류를 실행 전에 알 수 없음
function add(a, b) {
  return a + b;
}

console.log(add(5, "3")); // 53 → 의도와 다른 결과지만 오류가 나지 않음
```

프로젝트가 커질수록 이런 실수가 쌓이고,
어디서 잘못된 값이 들어왔는지 추적하기 어려워진다.

<br>

### TypeScript를 쓰는 이유

```typescript
// TypeScript — 잘못된 타입을 코드 작성 중에 바로 감지
function add(a: number, b: number): number {
  return a + b;
}

add(5, "3"); // 컴파일 에러 → 실행 전에 바로 알 수 있음
```

- **실행 전에 오류를 잡을 수 있다** → 배포 후 버그를 줄일 수 있음
- **코드 자체가 문서가 된다** → 함수를 보면 어떤 값을 받고 반환하는지 바로 알 수 있음
- **IDE 자동완성이 강력해진다** → 타입 정보를 기반으로 정확한 자동완성 제공
- **팀 협업에 유리하다** → 다른 사람이 짠 코드도 타입만 보면 사용법을 알 수 있음

<br>

### TypeScript 실행 과정

TypeScript는 브라우저나 Node.js가 직접 실행할 수 없기 때문에
`tsc`(TypeScript Compiler)로 JavaScript로 변환하는 과정이 필요하다.

```
TypeScript 작성 (.ts)
    ↓
tsc로 컴파일 (tsc main.ts)
    ↓
JavaScript 생성 (.js)
    ↓
Node.js 또는 브라우저에서 실행 (node main.js)
```

<br>

### 언제 TypeScript를 쓰는가

- 규모가 큰 프로젝트 (파일, 함수가 많아질수록 타입의 가치가 높아짐)
- 팀 협업 (여러 명이 같은 코드를 수정할 때 타입이 안전망 역할)
- 장기적으로 유지보수해야 하는 서비스
- React, Next.js 등 현대 프론트엔드 프레임워크와 함께 사용할 때

<br>
<br>

## ✅ 1. 원시 타입 (Primitive Types)

TypeScript의 원시 타입은 다음과 같다.

| 타입        | 설명                        | 예시            |
| ----------- | --------------------------- | --------------- |
| `string`    | 문자열                      | `"hello"`       |
| `number`    | 숫자 (정수, 실수 모두)      | `42`, `3.14`    |
| `boolean`   | 참/거짓                     | `true`, `false` |
| `null`      | 의도적으로 값이 없음을 명시 | `null`          |
| `undefined` | 아직 값이 할당되지 않음     | `undefined`     |
| `symbol`    | 고유한 식별자               | `Symbol("id")`  |

원시 타입을 제외한 모든 값은 `object`로 분류된다.

<br>

### 타입 선언 방법

```typescript
// 선언과 동시에 초기값 없이 타입만 지정
let userName: string;
let userAge: number;
let isAdmin: boolean;

// 나중에 값 할당
userName = "Alice";
userAge = 25;
isAdmin = true;

// 선언과 동시에 초기값 지정
let productName: string = "맥북 프로";
let productPrice: number = 3000000;
let isAvailable: boolean = true;
```

<br>

### 함수의 매개변수와 반환 타입 지정

```typescript
// 매개변수와 반환값에 타입 지정
const addNumbers = (a: number, b: number): number => {
  return a + b;
};

console.log(addNumbers(5, 3)); // 8
```

<br>
<br>

## ✅ 2. null과 undefined의 차이

둘 다 "값이 없는 상태"를 나타내지만 의미가 다르다.

```typescript
let a: undefined; // 아직 값이 할당되지 않은 상태
let b: null = null; // 의도적으로 값이 없음을 명시한 상태
```

<br>
<br>

## ✅ 3. typeof로 타입 판별 시 주의점

JavaScript(그리고 TypeScript)에서 `typeof null`은 `"object"`를 반환한다.
이는 JavaScript 초기 설계 당시의 구현 오류로, 하위 호환성 때문에 지금까지 수정되지 않고 있다.

```typescript
typeof "hello"; // "string"
typeof 42; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" ← 원시 타입이지만 object가 반환됨 (주의!)
typeof {}; // "object"
typeof []; // "object"
```

따라서 `typeof`로 원시 타입을 판별할 때는 **null을 반드시 예외 처리**해야 한다.

```typescript
// null을 예외 처리해서 원시 타입 여부를 정확히 판별
const isPrimitive = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  return false;
};

console.log(isPrimitive("Hello")); // true
console.log(isPrimitive(42)); // true
console.log(isPrimitive(null)); // true  ← null 예외 처리 덕분에 정확히 판별
console.log(isPrimitive({})); // false
console.log(isPrimitive([])); // false
```

<br>
<br>

## ✅ 4. 유니온 타입으로 여러 타입 허용

`|`를 사용하면 여러 타입 중 하나를 허용할 수 있다.

```typescript
// string, null, undefined 중 하나를 받을 수 있는 함수
const stringifyValue = (value: string | null | undefined): string => {
  if (typeof value === "string") {
    return value;
  }
  return "값이 없습니다";
};

console.log(stringifyValue("Hello")); // "Hello"
console.log(stringifyValue(null)); // "값이 없습니다"
console.log(stringifyValue(undefined)); // "값이 없습니다"
```

<br>
<br>

## ✅ 5. == vs === (느슨한 동등성 vs 엄격한 동등성)

`===`는 타입과 값이 모두 같아야 `true`를 반환한다. 타입이 다르면 값이 같아도 `false`다.

```typescript
5 === 5; // true
5 === "5"; // false → 숫자 5와 문자열 "5"는 타입이 다르기 때문
```

`==`는 타입이 달라도 내부적으로 타입 변환을 시도한 후 값을 비교한다.
그래서 의도하지 않은 결과가 나올 수 있다.

```typescript
5 == "5"; // true → 문자열 "5"가 숫자 5로 변환된 후 비교됨
```

<br>

### 주의해야 할 특수 케이스

`null`과 `undefined`는 둘 다 "값이 없음"을 의미하는 상태이기 때문에
`==` 비교에서는 같다고 취급된다. 하지만 타입 자체가 다르기 때문에 `===`에서는 `false`다.

```typescript
null == undefined; // true
null === undefined; // false
```

`NaN`은 "숫자가 아님(Not a Number)"을 의미하는 특수한 값으로,
자기 자신을 포함한 어떤 값과 비교해도 항상 `false`를 반환한다.

```typescript
NaN == NaN; // false
NaN === NaN; // false
```

> 실무에서는 예상치 못한 타입 변환으로 인한 버그를 방지하기 위해
> **`===`를 사용하는 것이 원칙**이다.

---

<br>

**핵심 요약:**

- **TypeScript** → JavaScript에 타입을 추가한 언어, 실행 전에 오류를 잡을 수 있음
- **원시 타입** → `string`, `number`, `boolean`, `null`, `undefined`, `symbol`
- **typeof null** → `"object"` 반환 (설계 오류), null은 반드시 예외 처리 필요
- **유니온 타입** → `|`로 여러 타입을 허용
- **===** → 타입과 값 모두 비교, 실무에서는 `===` 사용이 원칙
