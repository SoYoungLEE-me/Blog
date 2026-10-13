---
title: TypeScript 고급 타입 any, unknown, void, never 정리
date: 2026-10-14
tags:
  - TypeScript
  - any
  - unknown
  - void
  - never
---

## **TypeScript의 고급 타입**

이번에는 TypeScript에서 사용하는 `any`, `unknown`, `void`, `never` 타입에 대해 알아보려고 한다.

이 네 가지 타입은 일반적인 `string`, `number`, `boolean`과 달리 값의 타입을 알 수 없거나, 함수의 반환값이 없거나, 특정 상황이 발생할 수 없음을 표현할 때 사용한다.

특히 `any`와 `unknown`, `void`와 `never`는 비슷해 보이지만 실제 역할에는 중요한 차이가 있다.

<br>
<br>

## **✅ 1. any — 타입 검사를 우회하는 타입**

`any`는 어떤 타입의 값이든 허용하는 타입이다.

또한 `any`로 선언한 값에 대해서는 TypeScript의 타입 검사가 대부분 적용되지 않는다.

```typescript
let value: any = "Hello";

value = 42;
value = true;
value = { name: "Alice" };
```

어떤 타입의 값을 할당해도 오류가 발생하지 않는다.

<br>

### **any의 문제점**

```typescript
let value: any = 42;

console.log(value.toUpperCase());
```

숫자에는 `toUpperCase()` 메서드가 없지만 TypeScript는 오류를 감지하지 못한다.

따라서 실제 실행 시 런타임 오류가 발생한다.

`any`는 타입 검사를 우회하기 때문에 TypeScript를 사용하는 장점인 타입 안전성을 떨어뜨릴 수 있다.

다만 기존 JavaScript 프로젝트를 TypeScript로 전환하거나, 타입 정보가 없는 외부 라이브러리를 다루는 상황에서는 임시로 사용하기도 한다.

가능하면 사용 범위를 최소화하고 구체적인 타입으로 교체하는 것이 좋다.

<br>
<br>

## **✅ 2. unknown — 타입을 알 수 없는 값**

`unknown`도 어떤 타입의 값이든 할당할 수 있다.

하지만 `any`와 달리 값을 사용하기 전에 타입을 확인해야 한다.

```typescript
let value: unknown = "Hello";

value = 42;
value = true;
```

여기까지는 `any`와 동일하게 동작한다.

<br>

### **unknown과 any의 차이**

```typescript
let value: unknown = "Hello";

console.log(value.toUpperCase()); // Error
```

`unknown`은 현재 값이 문자열인지 확신할 수 없기 때문에 바로 문자열 메서드를 사용할 수 없다.

따라서 타입을 확인해야 한다.

```typescript
let value: unknown = "Hello";

if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

`typeof`를 통해 문자열임을 확인하면 TypeScript가 해당 블록 안에서 `value`를 `string` 타입으로 좁혀준다.

이러한 과정을 **타입 좁히기(Type Narrowing)**라고 한다.

<br>

### **unknown을 사용하는 경우**

외부 API 응답이나 사용자 입력처럼 어떤 타입의 값이 전달될지 확신할 수 없는 경우에 유용하다.

```typescript
function printValue(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    console.log(value.toFixed(2));
  }
}
```

각 타입에 맞는 동작을 안전하게 수행할 수 있다.

<br>

### **any vs unknown**

| 구분                       | any    | unknown                  |
| -------------------------- | ------ | ------------------------ |
| 모든 타입 할당             | 가능   | 가능                     |
| 타입 확인 없이 속성 접근   | 가능   | 불가능                   |
| 타입 확인 없이 메서드 호출 | 가능   | 불가능                   |
| 타입 안전성                | 낮음   | 상대적으로 높음          |
| 권장 사용                  | 최소화 | 타입을 모를 때 우선 고려 |

**둘 다 어떤 값이든 받을 수 있지만, unknown은 값을 사용하기 전에 타입을 확인하도록 한다는 점이 핵심적인 차이다.**

<br>
<br>

## **✅ 3. void — 반환값을 사용하지 않는 함수**

`void`는 주로 함수의 반환 타입으로 사용하며, **함수의 반환값을 사용하지 않는다는 의미**를 나타낸다.

```typescript
function printMessage(message: string): void {
  console.log(message);
}
```

`printMessage()`는 메시지를 출력하지만 별도의 값을 반환하지 않는다.

이러한 경우 반환 타입으로 `void`를 사용할 수 있다.

<br>

### **void와 undefined의 차이**

JavaScript에서 반환문이 없는 함수는 실행 결과로 `undefined`를 반환한다.

```typescript
function printMessage(): void {
  console.log("Hello");
}

console.log(printMessage());
// Hello
// undefined
```

그렇다면 `void`와 `undefined`는 같은 타입일까?

완전히 같지는 않다.

- `undefined`: 실제 값인 `undefined`의 타입
- `void`: 주로 함수의 반환값을 사용하지 않는다는 의미를 표현하는 타입

<br>

```typescript
function getValue(): undefined {
  return undefined;
}

function printValue(): void {
  console.log("Hello");
}
```

`undefined` 반환 타입은 반환 결과가 `undefined`여야 한다는 조건을 나타낸다.

반면 `void`는 반환값을 활용하지 않는 함수에 주로 사용한다.

<br>

### **void를 사용하는 경우**

이벤트 처리 함수나 로그 출력 함수처럼 값을 반환할 필요가 없는 동작에 자주 사용한다.

```typescript
function handleClick(): void {
  console.log("버튼이 클릭되었습니다.");
}
```

또한 콜백 함수의 반환 타입으로 사용할 수도 있다.

```typescript
const numbers = [1, 2, 3];

numbers.forEach((number): void => {
  console.log(number);
});
```

여기서 `forEach()`는 각 요소에 대해 작업을 실행하며, 콜백의 반환값을 사용하지 않는다.

<br>
<br>

## **✅ 4. never — 발생할 수 없는 상태**

`never`는 **값이 존재할 수 없는 타입**을 의미한다.

주로 함수가 정상적으로 종료되지 않거나, 모든 경우를 처리한 뒤 남아 있는 경우가 없음을 표현할 때 사용한다.

<br>

### **항상 예외를 발생시키는 함수**

```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

이 함수는 항상 예외를 발생시키므로 정상적으로 호출한 위치에 값을 반환하지 않는다.

따라서 반환 타입으로 `never`를 사용할 수 있다.

<br>

### **무한 반복하는 함수**

```typescript
function infiniteLoop(): never {
  while (true) {
    // 무한 반복
  }
}
```

이 함수 역시 정상적으로 종료되지 않기 때문에 `never`를 반환 타입으로 사용할 수 있다.

<br>

### **void와 never의 차이**

두 타입 모두 반환값이 없다는 점에서 비슷하게 느껴질 수 있다.

하지만 실제 의미는 다르다.

```typescript
// 정상적으로 종료되는 함수
function printMessage(): void {
  console.log("Hello");
}

// 정상적으로 종료되지 않는 함수
function throwError(): never {
  throw new Error("오류 발생");
}
```

- `void`: 반환값을 사용하지 않지만 함수는 정상적으로 종료될 수 있다.
- `never`: 함수가 정상적으로 종료되어 호출한 위치로 돌아오는 일이 없다.

즉, **void는 반환값을 사용하지 않는다는 의미이고, never는 정상적인 반환 자체가 불가능하다는 의미**다.

<br>
<br>

## **✅ 5. never를 활용한 완전성 검사**

`never`는 단순히 예외를 발생시키는 함수에서만 사용되는 것이 아니다.

유니언 타입이나 Enum의 모든 경우를 처리했는지 확인하는 데에도 활용할 수 있다.

이를 **완전성 검사(Exhaustiveness Checking)**라고 한다.

<br>

```typescript
type Status = "pending" | "success" | "error";

function getStatusMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "대기 중";

    case "success":
      return "성공";

    case "error":
      return "오류 발생";

    default:
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}
```

모든 상태를 처리했기 때문에 `default`에서는 `status`가 `never` 타입으로 좁혀진다.

<br>

그런데 새로운 상태가 추가된다면 어떻게 될까?

```typescript
type Status = "pending" | "success" | "error" | "cancelled";
```

`switch`문에는 아직 `"cancelled"`를 처리하는 코드가 없다.

따라서 `default`에서 `status`는 `"cancelled"` 타입이 되고, 이를 `never`에 할당하려고 하면 타입 오류가 발생한다.

이러한 방식으로 새로운 상태가 추가되었을 때 처리하지 않은 경우를 발견할 수 있다.

이전에 공부했던 Enum과 `switch`문에서도 동일한 원리로 활용할 수 있다.

<br>
<br>

## **✅ 6. 네 가지 타입 비교**

| 타입      | 의미                    | 주요 사용 상황                    |
| --------- | ----------------------- | --------------------------------- |
| `any`     | 타입 검사를 대부분 우회 | 타입 정보가 없는 코드의 임시 처리 |
| `unknown` | 타입을 알 수 없는 값    | 외부 데이터, 타입 검사            |
| `void`    | 반환값을 사용하지 않음  | 이벤트 처리, 로그 출력            |
| `never`   | 값이 존재할 수 없음     | 예외 함수, 완전성 검사            |

<br>
<br>

## **✅ 7. 실무에서는 언제 사용해야 할까?**

`any`, `unknown`, `void`, `never`는 각각 사용 목적이 다르다.

특히 API 개발이나 외부 데이터를 처리할 때는 타입을 어떻게 지정하느냐에 따라 코드의 안전성이 달라질 수 있다.

<br>

### **1. API 응답 타입을 알고 있는 경우**

서버에서 반환하는 데이터의 구조가 명확하다면 해당 구조를 타입으로 정의하는 것이 좋다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(): Promise<User> {
  const response = await fetch("/api/users/1");

  if (!response.ok) {
    throw new Error("사용자 조회 실패");
  }

  return response.json();
}
```

`Promise<User>`는 비동기 함수가 최종적으로 `User` 타입의 값을 반환한다는 의미다.

다만 여기서 주의해야 할 점은 `response.json()`으로 받은 데이터가 실제로 `User` 구조를 만족하는지 자동으로 검사되는 것은 아니라는 것이다.

TypeScript의 타입 선언은 런타임 데이터의 안전성을 보장하지 않는다.

<br>

### **2. API 응답 타입을 알 수 없는 경우 — unknown**

외부 API나 사용자 입력처럼 어떤 형태의 데이터가 전달될지 확신할 수 없는 경우에는 `unknown`을 사용할 수 있다.

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

async function getUser(): Promise<User> {
  const response = await fetch("/api/users/1");

  if (!response.ok) {
    throw new Error("사용자 조회 실패");
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("잘못된 사용자 데이터");
  }

  return data;
}
```

여기서 `unknown`으로 데이터를 받은 후 `isUser()` 함수를 통해 구조를 검사한다.

`value is User`는 사용자 정의 타입 가드(Type Predicate)로, 조건이 참이면 해당 값이 `User` 타입이라고 TypeScript에 알려준다.

이처럼 **데이터의 형태를 신뢰할 수 없는 경우 unknown으로 받고 검증한 후 사용하는 것이 안전하다.**

<br>

### **3. API 개발 초기 단계 — any를 사용해도 될까?**

API 명세가 아직 확정되지 않았거나 JavaScript 프로젝트를 TypeScript로 전환하는 과정에서는 타입을 정확하게 정의하기 어려울 수 있다.

이러한 상황에서 임시로 `any`를 사용하기도 한다.

```typescript
function processResponse(data: any) {
  return data.user.name;
}
```

하지만 실제 데이터에 `user`나 `name` 속성이 없다면 런타임 오류가 발생할 수 있다.

따라서 API 구조가 아직 확정되지 않았다는 이유만으로 `any`를 사용하는 것은 권장되지 않는다.

가능하면 `unknown`으로 받은 후 필요한 속성을 확인하거나, 현재까지 알려진 데이터 구조를 선택적 속성으로 표현하는 편이 좋다.

<br>

### **4. API 요청을 처리하고 반환값을 사용하지 않는 경우 — void**

`void`는 주로 반환값을 사용하지 않는 함수에 사용한다.

예를 들어 요청 성공 여부를 화면에 출력하는 함수가 있다.

```typescript
function showSuccessMessage(): void {
  console.log("요청이 성공했습니다.");
}
```

이 함수는 작업을 수행하지만 별도의 결과값을 반환하지 않는다.

따라서 반환 타입으로 `void`를 지정할 수 있다.

비동기 함수라면 `Promise<void>`를 사용할 수 있다.

```typescript
async function sendLog(message: string): Promise<void> {
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("로그 전송 실패");
  }
}
```

`Promise<void>`는 비동기 작업이 완료되지만 호출자가 사용할 별도의 결과값은 반환하지 않는다는 의미다.

<br>

### **5. 예외 처리나 발생할 수 없는 상태 — never**

`never`는 함수가 정상적으로 반환할 수 없거나, 모든 경우를 처리하여 남은 값이 없다는 사실을 표현할 때 사용한다.

```typescript
function throwApiError(message: string): never {
  throw new Error(message);
}
```

이 함수는 항상 예외를 발생시키기 때문에 정상적인 반환값이 존재하지 않는다.

또한 API 요청 상태를 처리할 때 모든 상태를 빠짐없이 처리했는지 검사하는 용도로도 활용할 수 있다.

```typescript
type ApiStatus = "idle" | "loading" | "success" | "error";

function getStatusMessage(status: ApiStatus): string {
  switch (status) {
    case "idle":
      return "대기 중";
    case "loading":
      return "로딩 중";
    case "success":
      return "요청 성공";
    case "error":
      return "요청 실패";
    default:
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}
```

새로운 상태가 추가되었는데 `switch`문에서 처리하지 않았다면 타입 오류를 통해 누락된 상태를 발견할 수 있다.

<br>

### **상황별 타입 선택**

| 상황                                | 추천 타입                              |
| ----------------------------------- | -------------------------------------- |
| API 응답 구조를 알고 있음           | `interface`, `type`                    |
| API 응답 구조를 신뢰할 수 없음      | `unknown` + 타입 검사                  |
| API 개발 초기로 타입이 미확정       | 가능한 범위의 타입 정의 또는 `unknown` |
| 타입 없는 외부 라이브러리 임시 사용 | 제한적으로 `any`                       |
| 반환값이 필요 없는 일반 함수        | `void`                                 |
| 반환값이 필요 없는 비동기 함수      | `Promise<void>`                        |
| 반드시 예외를 발생시키는 함수       | `never`                                |
| 모든 상태를 처리했는지 확인         | `never`                                |

<br>
<br>

## **✅ 8. 오늘 배운 내용 정리**

이번에는 TypeScript의 `any`, `unknown`, `void`, `never` 타입에 대해 공부했다.

<br>

`any`와 `unknown`은 모두 어떤 타입의 값이든 받을 수 있다는 공통점이 있지만, `unknown`은 사용하기 전에 타입을 확인해야 한다는 차이가 있었다.

<br>

특히 TypeScript를 사용하는 이유가 타입 안전성을 높이기 위한 것이라는 점을 생각하면, 타입 검사를 우회하는 `any`보다는 `unknown`을 사용하는 것이 더 적절한 상황이 많을 것 같다.

<br>

또한 `void`와 `never`의 차이도 새롭게 알게 되었다.

처음에는 둘 다 반환값이 없는 함수에서 사용하는 타입이라고 생각했지만, `void`는 반환값을 사용하지 않는다는 의미이고 `never`는 정상적으로 반환할 수 없다는 의미라는 차이가 있었다.

<br>

그중에서도 `never`를 이용한 완전성 검사가 인상적이었다.

이전에 공부했던 Enum이나 유니언 타입과 연결하여 모든 상태를 처리했는지 확인할 수 있다는 점에서 실무에서도 유용하게 사용할 수 있을 것 같다.

<br>

앞으로는 단순히 타입 오류를 없애기 위해 타입을 지정하기보다, 각 타입이 어떤 의미를 가지고 있고 어떤 상황에 적합한지 생각하면서 코드를 작성해야겠다.

<br>

끝-!

<br>
