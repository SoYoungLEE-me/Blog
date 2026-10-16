---
title: TypeScript 판별 유니온과 never를 활용한 완전성 검사
date: 2026-10-15
tags:
  - TypeScript
  - Discriminated Union
  - never
  - Exhaustiveness Checking
---

## **TypeScript 판별 유니온과 완전성 검사**

이전 글에서는 유니온 타입과 타입 좁히기에 대해 알아보았다.

유니온 타입은 여러 타입을 허용하지만, 각 타입이 반드시 서로 배타적인 객체 구조를 가지는 것은 아니다.

또한 여러 타입을 처리하는 과정에서 새로운 타입이 추가되었을 때 특정 분기를 빠뜨릴 수도 있다.

이번에는 이러한 문제를 해결하기 위한 **판별 유니온(Discriminated Union)** 과 **완전성 검사(Exhaustiveness Checking)** 에 대해 정리하려고 한다.

<br>
<br>

## **✅ 1. 일반 유니온 타입만으로는 부족할 때**

유니온 타입은 `|` 기호를 사용해 여러 타입 중 하나를 허용하는 방법이다.

하지만 유니온 타입은 **각 타입의 속성이 서로 섞이지 않도록 자동으로 제한하지는 않는다.**

다음 예제를 살펴보자.

```typescript
type Success = {
  data: string;
};

type Failure = {
  error: string;
};

type Result = Success | Failure;

const result: Result = {
  data: "성공",
  error: "오류",
};
```

`Result`는 성공(`Success`) 또는 실패(`Failure`)를 나타내는 타입이다.

그런데 위 코드에서는 `data`와 `error`를 동시에 가지고 있어도 오류가 발생하지 않는다.

이는 객체가 `Success`와 `Failure`에서 요구하는 속성을 모두 만족하기 때문이다.

하지만 실제 서비스에서는 성공했을 때 `data`를, 실패했을 때 `error`를 사용하도록 구분하고 싶을 수 있다.

이러한 상황에서 사용하는 방법이 **판별 유니온(Discriminated Union)** 이다.

<br>
<br>

## **✅ 2. 판별 유니온(Discriminated Union)이란?**

판별 유니온은 **유니온에 포함된 각 타입에 공통된 구분용 속성을 두고, 그 속성의 값으로 타입을 구분하는 방법**이다.

예를 들어 `type`이라는 속성을 추가해 보자.

```typescript
type Success = {
  type: "success";
  data: string;
};

type Failure = {
  type: "failure";
  error: string;
};

type Result = Success | Failure;
```

이제 두 타입을 `type` 속성으로 구분할 수 있다.

- `type: "success"`라면 `Success` 타입
- `type: "failure"`라면 `Failure` 타입

여기서 `type`처럼 타입을 구분하기 위해 사용하는 속성을 **판별자(Discriminant)** 라고 한다.

또한 `"success"`와 `"failure"`처럼 특정 값만 허용하는 타입을 **리터럴 타입(Literal Type)**이라고 한다.

판별자로 사용하는 속성의 이름이 반드시 `type`이어야 하는 것은 아니다.

`status`, `kind`, `category` 등 데이터의 의미에 맞는 이름을 사용할 수 있다.

<br>

### **2-1. 판별 유니온을 이용한 타입 좁히기**

```typescript
function printResult(result: Result): void {
  if (result.type === "success") {
    console.log(result.data); // Success 타입
  } else {
    console.log(result.error); // Failure 타입
  }
}
```

TypeScript는 `type` 속성의 값을 확인해 어떤 타입인지 판단한다.

따라서 `if`문에서는 `Success` 타입의 속성을, `else`문에서는 `Failure` 타입의 속성을 안전하게 사용할 수 있다.

이전 글에서 살펴본 `in` 연산자와 달리, 판별 유니온에서는 **속성의 존재 여부가 아니라 명시적으로 정해 둔 값으로 타입을 구분한다.**

이는 데이터가 어떤 종류인지 표현할 때 특히 유용하다.

<br>

### **2-2. 잘못된 속성 조합 확인하기**

```typescript
const result: Result = {
  type: "success",
  error: "실패",
  // Error: Success 타입에는 필수 속성인 data가 필요함
};
```

위 객체는 `type`이 `"success"`이므로 `Success` 타입이어야 한다.

하지만 `Success`에 필요한 `data`가 없으므로 오류가 발생한다.

즉, **구분용 속성을 추가하면 각 타입에 맞는 필수 속성이 들어왔는지 더 명확하게 확인할 수 있다.**

다만 판별 유니온이 모든 추가 속성을 무조건 금지하는 것은 아니다.

구조적 타입 시스템의 특성상 상황에 따라 추가 속성을 가진 객체가 허용될 수 있다.

따라서 판별 유니온의 주요 목적은 객체를 완전히 배타적으로 만드는 것이 아니라, **각 데이터의 종류를 명확하게 표현하고 타입을 안전하게 좁힐 수 있도록 하는 것**이다.

<br>
<br>

## **✅ 3. switch를 이용한 타입 구분**

판별 유니온은 `if`문뿐만 아니라 `switch`문과 함께 사용할 수도 있다.

```typescript
type Dog = {
  type: "dog";
  bark: () => void;
};

type Cat = {
  type: "cat";
  meow: () => void;
};

type Animal = Dog | Cat;

function makeSound(animal: Animal): void {
  switch (animal.type) {
    case "dog":
      animal.bark();
      break;

    case "cat":
      animal.meow();
      break;
  }
}
```

`switch`문은 `animal.type`의 값에 따라 실행할 코드를 구분한다.

- `"dog"`라면 `Dog` 타입으로 판단한다.
- `"cat"`이라면 `Cat` 타입으로 판단한다.

그런데 나중에 새로운 동물 타입이 추가된다면 어떨까?

```typescript
type Bird = {
  type: "bird";
  chirp: () => void;
};

type Animal = Dog | Cat | Bird;
```

이제 `Animal`에는 `Bird`도 포함된다.

하지만 기존 `makeSound()` 함수에는 `"bird"`를 처리하는 코드가 없다.

그렇다고 반드시 TypeScript 오류가 발생하는 것은 아니다.

현재 함수는 반환 타입이 `void`이므로, `Bird`가 들어왔을 때 아무 작업도 하지 않고 종료해도 타입 오류가 발생하지 않을 수 있다.

즉, **새로운 타입을 추가했는데 해당 타입을 처리하는 코드를 빠뜨릴 수 있다는 문제**가 있다.

이러한 상황에서 `never` 타입을 활용한 완전성 검사를 사용할 수 있다.

<br>
<br>

## **✅ 4. never 타입과 완전성 검사**

`never`는 가능한 값이 존재하지 않는 타입이다.

기존 고급 타입 글에서는 `never`가 무엇인지, 반환하지 않는 함수에서 어떻게 사용하는지 알아보았다.

이번에는 **모든 경우를 처리하고 남은 타입이 없다는 사실을 검사하는 용도**에 집중하려고 한다.

<br>

### **모든 타입을 처리하면 무엇이 남을까?**

다음과 같은 타입이 있다고 생각해 보자.

```typescript
type Status = "pending" | "success" | "failure";
```

`Status`는 세 가지 값만 허용한다.

이때 조건문에서 세 가지 경우를 모두 처리했다면 더 이상 처리할 수 있는 값은 존재하지 않는다.

TypeScript는 이러한 상황에서 남은 타입을 `never`로 좁힐 수 있다.

이 특징을 이용해 **가능한 모든 타입을 빠짐없이 처리했는지 검사하는 방법** 을 완전성 검사(Exhaustiveness Checking)라고 한다.

<br>
<br>

## **✅ 5. never를 활용한 완전성 검사(Exhaustiveness Checking)**

완전성 검사는 **가능한 모든 타입을 빠짐없이 처리했는지 확인하는 방법**이다.

예를 들어 `Dog`, `Cat`, `Bird`가 있다면 세 가지 경우를 모두 처리했는지 검사하는 것이다.

<br>

### **5-1. 완전성 검사 함수 만들기**

먼저 다음과 같은 함수를 작성한다.

```typescript
function assertNever(value: never): never {
  throw new Error(`처리하지 않은 타입: ${JSON.stringify(value)}`);
}
```

함수 이름은 `assertNever`이며, 매개변수로 `never` 타입만 받을 수 있다.

여기서 중요한 점은 **`never`에는 일반적인 타입의 값을 전달할 수 없다는 것**이다.

따라서 모든 타입을 처리해 더 이상 남은 경우가 없을 때만 이 함수를 타입 오류 없이 호출할 수 있다.

<br>

### **5-2. switch문에서 사용하기**

```typescript
type Dog = {
  type: "dog";
  bark: () => void;
};

type Cat = {
  type: "cat";
  meow: () => void;
};

type Animal = Dog | Cat;

function assertNever(value: never): never {
  throw new Error(`처리하지 않은 타입: ${JSON.stringify(value)}`);
}

function makeSound(animal: Animal): void {
  switch (animal.type) {
    case "dog":
      animal.bark();
      return;

    case "cat":
      animal.meow();
      return;

    default:
      return assertNever(animal);
  }
}
```

위 코드에서 `Animal`은 `Dog` 또는 `Cat` 타입이다.

`switch`문에서는 두 타입을 모두 처리하고 있다.

따라서 `default`에 도달할 수 있는 타입이 더 이상 남아 있지 않다.

TypeScript는 이때 `animal`의 타입을 `never`로 판단한다.

**모든 타입을 처리했기 때문에 `assertNever(animal)`에서도 타입 오류가 발생하지 않는 것이다.**

<br>

### **5-3. 새로운 타입이 추가된다면?**

이번에는 `Bird` 타입을 추가해 보자.

```typescript
type Bird = {
  type: "bird";
  chirp: () => void;
};

type Animal = Dog | Cat | Bird;
```

이제 `Animal`에는 `Dog`, `Cat`, `Bird`가 포함된다.

그런데 기존 `makeSound()` 함수에서는 `Dog`와 `Cat`만 처리하고 있다.

```typescript
function makeSound(animal: Animal): void {
  switch (animal.type) {
    case "dog":
      animal.bark();
      return;

    case "cat":
      animal.meow();
      return;

    default:
      return assertNever(animal); // 컴파일 오류!
  }
}
```

왜 오류가 발생할까?

`Dog`와 `Cat`은 처리했지만 `Bird`는 처리하지 않았기 때문이다.

따라서 `default`에서는 `animal`이 `Bird` 타입일 가능성이 남아 있다.

하지만 `assertNever()`는 `never` 타입만 받을 수 있으므로 `Bird` 타입을 전달하면 타입 오류가 발생한다.

즉, **새로운 타입이 추가되었지만 처리하지 않은 경우가 있다는 사실을 TypeScript가 알려주는 것이다.**

<br>

### **5-4. 오류 해결하기**

누락된 `"bird"` 케이스를 추가하면 된다.

```typescript
function makeSound(animal: Animal): void {
  switch (animal.type) {
    case "dog":
      animal.bark();
      return;

    case "cat":
      animal.meow();
      return;

    case "bird":
      animal.chirp();
      return;

    default:
      return assertNever(animal);
  }
}
```

이제 `Dog`, `Cat`, `Bird`를 모두 처리했으므로 `default`에 남아 있는 타입은 `never`가 된다.

따라서 컴파일 오류도 사라진다.

이처럼 `never`를 이용한 완전성 검사는 **나중에 새로운 타입이 추가되더라도 처리해야 할 코드를 빠뜨리지 않도록 도와준다.**

<br>

### **assertNever 함수의 역할**

여기서 한 가지 주의해야 할 점이 있다.

`assertNever()`가 실제로 실행되면서 모든 타입을 하나씩 검사하는 것은 아니다.

완전성 검사는 TypeScript의 타입 검사 과정에서 이루어진다.

| 시점        | 역할                                     |
| ----------- | ---------------------------------------- |
| 컴파일 시점 | 누락된 타입이 남아 있는지 `never`로 확인 |
| 실행 시점   | 예상하지 못한 값이 전달되면 예외 발생    |

즉, **`never` 매개변수를 이용한 타입 검사와 `throw new Error()`를 이용한 런타임 예외 처리** 를 구분해서 이해해야 한다.

또한 완전성 검사는 TypeScript가 알고 있는 타입을 기준으로 이루어진다.

외부 API에서 실제로 잘못된 데이터가 전달되는 문제까지 자동으로 막아주는 것은 아니다.

<br>
<br>

## **✅ 6. assertNever 함수 없이 검사하는 방법**

완전성 검사는 반드시 `assertNever()` 함수를 만들어야만 사용할 수 있는 것은 아니다.

`never` 타입의 변수를 직접 선언하는 방법도 있다.

```typescript
type Status = "pending" | "success" | "failure";

function getMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "대기 중";

    case "success":
      return "성공";

    case "failure":
      return "실패";

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}
```

`Status`는 세 가지 값 중 하나만 가질 수 있다.

그리고 `switch`문에서 세 가지 경우를 모두 처리했으므로 `default`에 남아 있는 타입은 `never`이다.

만약 `Status`에 `"cancelled"`를 추가하고 해당 `case`를 작성하지 않는다면 `never` 변수에 값을 할당할 수 없다는 타입 오류가 발생한다.

두 방법의 차이는 다음과 같다.

- **`assertNever()`**: 완전성 검사 함수를 만들어 여러 곳에서 재사용할 수 있다.
- **`never` 변수 선언**: 별도의 함수를 만들지 않고 간단하게 검사할 수 있다.

<br>
<br>

## **✅ 7. 실무에서는 어떻게 활용할까? — API 응답 상태 처리**

판별 유니온과 완전성 검사는 실제 서비스에서도 활용할 수 있다.

예를 들어 API 요청 상태에 따라 화면에 표시할 메시지를 변경하는 상황을 생각해 보자.

<br>

### **모든 속성을 선택적으로 정의한다면?**

```typescript
type ApiState = {
  status: "loading" | "success" | "error";
  data?: string[];
  message?: string;
};
```

이렇게 작성하면 하나의 타입으로 여러 상태를 표현할 수 있다.

하지만 다음과 같은 데이터도 타입 오류 없이 작성할 수 있다.

```typescript
const state: ApiState = {
  status: "success",
};
```

성공 상태인데 실제 데이터가 없어도 타입 오류가 발생하지 않는다.

`data`가 선택적 속성이기 때문이다.

이처럼 **상태에 따라 반드시 필요한 속성이 다르다면 모든 속성을 선택적으로 정의하는 방식이 적절하지 않을 수 있다.**

<br>

### **판별 유니온으로 상태를 구분하기**

```typescript
type ApiState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: string[];
    }
  | {
      status: "error";
      message: string;
    };
```

이제 상태에 따라 필요한 속성이 달라진다.

- `loading`: 추가 데이터가 필요하지 않다.
- `success`: `data`가 반드시 필요하다.
- `error`: `message`가 반드시 필요하다.

따라서 성공 상태에 `data`가 없다면 타입 오류가 발생한다.

<br>

### **상태에 따라 다른 메시지 반환하기**

```typescript
function assertNever(value: never): never {
  throw new Error(`처리하지 않은 상태: ${JSON.stringify(value)}`);
}

function getApiMessage(state: ApiState): string {
  switch (state.status) {
    case "loading":
      return "데이터를 불러오는 중입니다.";

    case "success":
      return state.data.join(", ");

    case "error":
      return state.message;

    default:
      return assertNever(state);
  }
}
```

판별 유니온을 사용했기 때문에 각 `case`에서 해당 상태에 필요한 속성에 안전하게 접근할 수 있다.

또한 새로운 상태가 추가된다면 `assertNever()`를 통해 처리하지 않은 경우를 발견할 수 있다.

예를 들어 API 상태에 `"cancelled"`를 추가했는데 `switch`문에서 처리하지 않았다면 타입 오류가 발생한다.

이렇게 하면 **상태별 데이터 구조를 명확하게 표현하면서, 새로운 상태가 추가되었을 때 처리 누락까지 확인할 수 있다.**

<br>

### **실제 API 응답 데이터와의 차이**

다만 여기서 한 가지 구분해야 할 점이 있다.

위 예시는 TypeScript에서 정의한 `ApiState` 타입의 값을 처리하는 코드다.

실제로 외부 서버에서 전달받은 JSON 데이터가 반드시 해당 타입을 만족한다고 보장되는 것은 아니다.

예를 들어 서버가 다음과 같은 응답을 반환할 수도 있다.

```typescript
{
  status: "success";
}
```

하지만 `ApiState`에서는 성공 상태일 때 `data`가 반드시 필요하다.

따라서 외부 API 응답을 직접 처리한다면 필요한 경우 런타임에서 데이터의 구조를 별도로 검증해야 한다.

**판별 유니온은 타입을 명확하게 설계하는 방법이고, 완전성 검사는 정의된 타입의 모든 경우를 처리했는지 확인하는 방법이다.**

두 기능 모두 유용하지만 실제 데이터 검증 자체를 대신하지는 않는다.

<br>
<br>

## **✅ 8. 오늘 배운 내용 정리**

이번에는 판별 유니온과 `never`를 이용한 완전성 검사에 대해 알아보았다.

앞서 유니온 타입을 공부하면서 여러 타입을 허용할 수 있다는 장점을 알게 되었지만, 각 타입을 명확하게 구분하거나 모든 경우를 처리하는 데에는 추가적인 설계가 필요하다는 사실을 알게 되었다.

특히 판별 유니온은 단순히 타입을 구분하기 위한 문법이 아니라, **각 상태에 어떤 데이터가 필요한지 명확하게 표현할 수 있다는 점**이 인상적이었다.

<br>

또한 `never`를 이용한 완전성 검사는 새로운 타입이 추가되었을 때 처리하지 않은 부분을 컴파일 단계에서 발견할 수 있다는 점에서 유용하다고 생각한다.

실제 프로젝트에서도 API 상태나 사용자 유형 등 여러 경우를 처리해야 하는 상황이 많기 때문에 이러한 방법을 활용할 수 있을 것 같다.

<br>

앞으로 타입을 설계할 때는 단순히 어떤 속성이 필요한지만 생각하는 것이 아니라, **데이터가 어떤 상태를 나타내고 각 상태에서 어떤 값이 반드시 필요한지** 함께 고려해야겠다.

<br>

끝-!
