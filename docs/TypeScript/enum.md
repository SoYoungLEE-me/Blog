---
title: TypeScript Enum 정리
date: 2026-10-14
tags:
  - TypeScript
  - Enum
---

## **Enum이란?**

Enum(열거형)은 관련된 상수값들을 하나의 이름으로 묶어서 관리하는 TypeScript 고유 문법이다.

예를 들어 주문 상태를 관리한다고 하면, 보통 이렇게 문자열로 관리할 수 있다.

```typescript
// 문자열로 상태를 관리하는 경우
let status: string = "pending";

status = "completed"; // 정상
status = "pendding"; // 오타가 있어도 오류가 발생하지 않음
```

일반적인 `string` 타입은 어떤 문자열이든 허용하기 때문에, 개발자가 의도하지 않은 값이나 오타를 입력해도 TypeScript가 오류를 감지하지 못한다.

또한 주문 상태로 어떤 값들이 사용되는지 파악하기 어렵고, 여러 곳에서 동일한 문자열을 직접 작성해야 한다는 문제도 있다.

<br>

### **Enum을 사용하면?**

```typescript
enum OrderStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
}

let status: OrderStatus = OrderStatus.Pending;

status = OrderStatus.Completed; // 정상
status = OrderStatus.Pendding; // Error: 존재하지 않는 멤버
status = "hello"; // Error: 허용되지 않은 값
```

Enum을 사용하면 **허용되는 상태값을 미리 정의하고, 해당 값들만 사용하도록 제한할 수 있다.**

또한 `OrderStatus.Pending`처럼 작성하기 때문에 단순히 `"pending"`이라는 문자열을 사용하는 것보다 해당 값의 의미와 소속을 명확하게 표현할 수 있다.

<br>

즉, Enum을 사용하면 다음과 같은 장점이 있다.

- **타입 안전성:** 정의되지 않은 상태값의 사용을 방지한다.
- **가독성:** 값이 어떤 상태를 의미하는지 쉽게 파악할 수 있다.
- **재사용성:** 동일한 상수를 여러 곳에서 일관되게 사용할 수 있다.
- **유지보수성:** 관련된 상태값을 한 곳에서 관리할 수 있다.

다만 문자열 리터럴 유니언 타입으로도 허용되는 값을 제한할 수 있으므로, 이러한 장점이 Enum에만 해당하는 것은 아니다.

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

### ❗**일반 Enum의 한계 — 런타임 코드와 트리 셰이킹**

Enum은 TypeScript 고유 문법으로, 일반적인 Enum은 JavaScript로 컴파일할 때 객체를 생성하는 코드로 변환된다.

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
}

const move = Direction.Up;
```

위 코드를 JavaScript로 컴파일하면 다음과 같은 코드가 생성된다.

```javascript
var Direction;

(function (Direction) {
  Direction["Up"] = "UP";
  Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));

const move = Direction.Up;
```

단순히 문자열 상수를 사용하기 위해서도 별도의 객체 생성 코드가 필요한 것이다.

<br>

여기서 알아두어야 할 개념이 **트리 셰이킹(Tree Shaking)** 이다.

트리 셰이킹은 번들링 과정에서 사용하지 않는 코드를 제거하여 최종 번들 크기를 줄이는 최적화 기법이다.

일반 Enum은 객체 초기화 코드가 생성되기 때문에, 번들러에 따라 사용하지 않는 Enum을 제거하기 어려울 수 있다.

따라서 Enum이 많은 대규모 프로젝트에서는 불필요한 런타임 코드가 번들 크기에 영향을 줄 가능성이 있다.

다만 일반 Enum이 항상 트리 셰이킹되지 않는 것은 아니며, 실제 결과는 컴파일러와 번들러의 설정에 따라 달라진다.

<br>

### **const Enum — 런타임 코드 생성을 줄이는 방법**

이러한 런타임 코드 생성 비용을 줄이기 위해 `const enum`을 사용할 수 있다.

`const` 키워드를 붙이면 기본적인 TypeScript 컴파일 설정에서 Enum 선언이 제거되고, 사용하는 위치에 실제 값이 인라인으로 치환된다.

```typescript
const enum Direction {
  Up = "UP",
  Down = "DOWN",
}

const move = Direction.Up;
```

**컴파일된 JavaScript 코드 예시**

```javascript
const move = "UP";
```

일반 Enum과 달리 별도의 Enum 객체를 생성하지 않는다.

따라서 불필요한 런타임 코드와 객체 속성 접근을 줄일 수 있다.

<br>

하지만 `const enum`에도 주의할 점이 있다.

- 컴파일 설정에 따라 인라인 치환 동작이 달라질 수 있다.
- `preserveConstEnums` 설정을 사용하면 Enum 객체 코드가 유지될 수 있다.
- 외부 라이브러리에 공개하거나 일부 빌드 도구와 함께 사용할 때 호환성 문제가 발생할 수 있다.
- 런타임에 Enum 객체 자체가 필요한 경우에는 적합하지 않다.

<br>

따라서 **const enum이 일반 Enum보다 무조건 좋은 것은 아니며**, 프로젝트의 빌드 환경과 사용 목적에 따라 선택해야 한다.

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

Enum과 switch문을 함께 사용하고, never 타입을 활용하면 모든 케이스가 빠짐없이 처리되었는지 TypeScript가 확인하도록 할 수 있다

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

| 구분             | Enum                                            | 유니언 타입                       |
| ---------------- | ----------------------------------------------- | --------------------------------- |
| 코드 가독성      | 이름으로 의미가 명확함                          | 값 자체가 보임                    |
| 자동완성         | ✅                                              | ✅                                |
| 번들 크기        | 일반 Enum은 코드 생성됨                         | 타입만이라 런타임 코드 없음       |
| 트리 셰이킹      | 일반 Enum은 번들러에 따라 제거가 어려울 수 있음 | 타입 선언 자체는 컴파일 시 제거됨 |
| 역방향 매핑      | ✅ (숫자 Enum만)                                | ❌                                |
| 주로 쓰이는 경우 | 상태, 권한 등 명확한 상수 집합                  | 간단한 타입 제한                  |

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

<br>

끝-!

<br>
