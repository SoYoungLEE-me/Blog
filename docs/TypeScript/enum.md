---
title: TypeScript Enum 정리
date: 2026-04-06
tags:
  - TypeScript
  - Enum
---

## Enum이란?

Enum(열거형)은 관련된 상수값들을 하나의 이름으로 묶어서 관리하는 TypeScript 고유 문법이다.

예를 들어 주문 상태를 관리한다고 하면, 보통 이렇게 문자열로 관리하게 된다.

```typescript
// ❌ 문자열로 상태를 관리하면 생기는 문제
const status = "pending";

if (status === "pendding") {
  // 오타가 나도 컴파일 에러가 없음
  // ...
}
```

문자열은 오타가 나도 TypeScript가 잡아주지 못하고,
어떤 값이 유효한 값인지 코드만 봐서는 알기 어렵다.
Enum을 쓰면 이 문제를 해결할 수 있다.

```typescript
// Enum으로 관리하면
enum OrderStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
}

const status = OrderStatus.Pending;

if (status === OrderStatus.Pendding) {
  // 오타 → 컴파일 에러로 즉시 감지
  // ...
}
```

<br>
<br>

## ✅ 1. Enum의 종류

### 숫자 Enum (Numeric Enum)

기본값은 0부터 자동으로 할당된다.
명시적으로 시작값을 지정하면 그 이후 값은 자동으로 1씩 증가한다.

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

enum Priority {
  Low = 1, // 1
  Medium, // 2
  High, // 3
}

console.log(Direction.Up); // 0
console.log(Priority.High); // 3
```

숫자 Enum은 **역방향 매핑**이 가능하다.
숫자로 Enum 이름을 가져올 수 있다.

```typescript
console.log(Direction[0]); // "Up"
console.log(Direction[2]); // "Left"
```

<br>

### 문자열 Enum (String Enum)

각 멤버에 직접 문자열 값을 지정한다.
숫자 Enum과 달리 역방향 매핑은 지원하지 않지만,
**값이 명확하게 보여서 디버깅이 쉽고 실무에서 더 많이 쓰인다.**

```typescript
enum OrderStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

console.log(OrderStatus.Pending); // "PENDING"
console.log(OrderStatus.Completed); // "COMPLETED"
```

<br>

### const Enum

`const` 키워드를 붙이면 컴파일 시 Enum 코드가 사라지고
**실제 값으로 인라인 치환**된다.
불필요한 코드가 번들에 포함되지 않아 성능상 이점이 있다.

```typescript
const enum Direction {
  Up = "UP",
  Down = "DOWN",
}

const move = Direction.Up;

// 컴파일 후 JavaScript
// const move = "UP"; ← Enum 코드 없이 값으로 바로 치환됨
```

<br>
<br>

## ✅ 2. Enum을 쓰는 이유

### 1. 오타를 컴파일 타임에 잡을 수 있다

```typescript
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

// 문자열 직접 비교 — 오타를 잡을 수 없음
if (userRole === "ADMINE") { ... } // 오타지만 오류 없음

// Enum 비교 — 오타 즉시 감지
if (userRole === Role.Admine) { ... } // 컴파일 에러!
```

<br>

### 2. 유효한 값의 범위를 명확하게 정의한다

함수를 보는 것만으로 어떤 값이 유효한지 바로 알 수 있다.

```typescript
// string만 보면 어떤 값이 유효한지 알 수 없음
function setUserRole(role: string) { ... }

// Enum을 보면 유효한 값이 명확함
function setUserRole(role: Role) { ... }
```

<br>

### 3. 자동완성이 된다

Enum을 사용하면 IDE에서 유효한 값 목록이 자동완성으로 제공된다.
문자열을 직접 입력하는 것보다 실수할 가능성이 크게 줄어든다.

<br>
<br>

## ✅ 3. 실무에서의 활용 예시

### API 상태 관리

```typescript
enum ApiStatus {
  Idle = "IDLE",
  Loading = "LOADING",
  Success = "SUCCESS",
  Error = "ERROR",
}

const fetchData = async () => {
  let status: ApiStatus = ApiStatus.Idle;

  try {
    status = ApiStatus.Loading;
    const data = await fetch("/api/data");
    status = ApiStatus.Success;
    return data;
  } catch {
    status = ApiStatus.Error;
  }
};
```

<br>

### 권한(Role) 관리

```typescript
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

const canEdit = (role: UserRole): boolean => {
  return role === UserRole.Admin || role === UserRole.Editor;
};

console.log(canEdit(UserRole.Admin)); // true
console.log(canEdit(UserRole.Viewer)); // false
```

<br>

### switch문과 함께 사용

Enum과 switch문을 함께 쓰면 모든 케이스를 빠짐없이 처리하고 있는지
TypeScript가 확인해준다.

```typescript
enum PaymentMethod {
  Card = "CARD",
  Cash = "CASH",
  Transfer = "TRANSFER",
}

const getPaymentMessage = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.Card:
      return "카드로 결제합니다.";
    case PaymentMethod.Cash:
      return "현금으로 결제합니다.";
    case PaymentMethod.Transfer:
      return "계좌이체로 결제합니다.";
    default:
      // 모든 케이스를 처리했다면 여기에 도달하지 않음
      const exhaustiveCheck: never = method;
      return exhaustiveCheck;
  }
};
```

<br>
<br>

## ✅ 4. Enum vs 유니언 타입

Enum과 비슷한 역할을 하는 것으로 **유니언 타입**도 있다.
실무에서는 둘 중 어떤 것을 쓸지 고민이 될 수 있다.

```typescript
// Enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 유니언 타입
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
```

| 구분             | Enum                           | 유니언 타입                   |
| ---------------- | ------------------------------ | ----------------------------- |
| 코드 가독성      | 이름으로 의미가 명확함         | 값 자체가 보임                |
| 자동완성         | ✅                             | ✅                            |
| 번들 크기        | 일반 Enum은 코드 생성됨        | 타입만이라 런타임 코드 없음   |
| 역방향 매핑      | ✅ (숫자 Enum만)               | ❌                            |
| 확장성           | 나중에 값 추가가 명확함        | 추가 시 모든 곳을 확인해야 함 |
| 주로 쓰이는 경우 | 상태, 권한 등 명확한 상수 집합 | 간단한 타입 제한              |

> 상태나 권한처럼 **의미 있는 이름이 중요한 상수 집합**이라면 Enum,
> 단순히 타입을 제한하는 용도라면 유니언 타입이 더 가볍고 간결하다.

<br>
<br>

## Enum이 나한테는 왜이렇게 어렵게 느껴졌을까

Enum이란 개념은 나에게 이렇게 따로 별도의 TIL까지 작성해야할 정도로 어렵게 느껴지는 내용 중 하나이다. <br>
Enum이 어렵게 느껴지는 건 "이게 왜 필요한가"가 처음엔 잘 와닿지 않기 때문인 것 같다.
문자열이나 숫자로도 충분히 상태를 관리할 수 있는데 굳이 Enum을 써야 하나 싶은 것이다.

<br>

하지만 프로젝트가 커질수록 상태를 나타내는 문자열이 여러 파일에 흩어지고,
오타가 나도 잡기 어렵고, 어떤 값이 유효한지 파악하기도 힘들어진다.

<br>

Enum은 그런 상황에서 **"이 값들의 집합은 여기서 관리한다"** 는 단일 진실 공급원(Single Source of Truth) 역할을 한다.

처음엔 번거로워 보여도, 규모가 커질수록 Enum의 가치를 느끼게 되는 것 같다.

---

<br>

**핵심 요약:**

- **Enum** → 관련 상수를 하나로 묶어 관리, 오타를 컴파일 타임에 감지
- **숫자 Enum** → 기본값 0부터 자동 할당, 역방향 매핑 가능
- **문자열 Enum** → 값이 명확히 보여 디버깅 쉬움, 실무에서 더 많이 사용
- **const Enum** → 컴파일 시 값으로 치환, 번들 크기 최적화
- **Enum vs 유니언 타입** → 의미 있는 상수 집합엔 Enum, 단순 타입 제한엔 유니언 타입
