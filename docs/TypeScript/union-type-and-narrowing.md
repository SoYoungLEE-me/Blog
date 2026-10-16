---
title: TypeScript 유니온 타입과 타입 좁히기(Type Narrowing) 정리
date: 2026-10-15
tags:
  - TypeScript
  - Union Type
  - Type Narrowing
  - Type Guard
---

## **TypeScript 유니온 타입과 타입 좁히기**

이전에는 `type`과 `interface`를 이용해 타입을 정의하고 재사용하는 방법을 알아보았다.

그 과정에서 유니온 타입(`|`)을 사용하면 여러 타입 중 하나를 허용할 수 있다는 것도 배웠다.

이번에는 유니온 타입을 조금 더 자세히 살펴보고, 여러 타입을 안전하게 처리하기 위한 **타입 좁히기(Type Narrowing)** 에 대해 정리하려고 한다.

특히 유니온 타입을 사용할 때 발생할 수 있는 문제와 `typeof`, `instanceof`, `in`, `is` 등을 활용해 타입을 구분하는 방법을 알아보자.

<br>
<br>

## **✅ 1. 유니온 타입(Union Type)이란?**

유니온 타입은 `|` 기호를 사용해 **여러 타입 중 하나를 사용할 수 있도록 하는 방법** 이다.

수학의 합집합과 비슷한 개념으로, 하나의 변수에 여러 타입의 값이 들어올 수 있을 때 사용한다.

```typescript
let id: string | number;

id = "user-01"; // 문자열 가능
id = 100; // 숫자 가능
// id = true;   // Error
```

위 코드에서 `id`는 `string` 또는 `number` 타입의 값을 가질 수 있다.

유니온 타입은 API 응답 상태나 사용자 유형처럼 여러 형태의 데이터를 하나의 타입으로 표현할 때 유용하다.

하지만 여러 타입을 허용한다고 해서 모든 타입의 속성을 자유롭게 사용할 수 있는 것은 아니다.

<br>
<br>

## **✅ 2. 유니온 타입에서는 왜 공통 필드만 사용할 수 있을까?**

다음과 같이 강아지와 고양이 타입을 만들었다고 가정해 보자.

```typescript
type Dog = {
  name: string;
  bark: () => void;
};

type Cat = {
  name: string;
  meow: () => void;
};

type Animal = Dog | Cat;

function printAnimal(animal: Animal): void {
  console.log(animal.name); // 정상

  // animal.bark(); // Error
  // animal.meow(); // Error
}
```

`Animal`은 `Dog`일 수도 있고 `Cat`일 수도 있다.

하지만 TypeScript는 함수에 실제로 어떤 타입의 값이 들어올지 알 수 없다.

- `name`은 두 타입 모두 가지고 있으므로 사용할 수 있다.
- `bark()`는 `Dog`에만 있으므로 바로 사용할 수 없다.
- `meow()`는 `Cat`에만 있으므로 바로 사용할 수 없다.

실제로 고양이가 들어왔는데 `bark()`를 실행하면 런타임 오류가 발생할 것이다.

TypeScript는 이러한 문제를 막기 위해 **타입을 구분하기 전에는 모든 경우에 안전하게 사용할 수 있는 속성만 접근하도록 제한한다.**

> `Dog | Cat`은 강아지와 고양이의 모든 속성을 합친 새로운 객체 타입이 아니다. `Dog` 또는 `Cat`의 조건을 만족하는 값을 받겠다는 의미이다.

<br>

### **유니온 타입과 교차 타입의 차이**

앞서 배웠던 교차 타입(`&`)과 비교하면 다음과 같다.

```typescript
type Dog = {
  name: string;
  bark: () => void;
};

type Cat = {
  name: string;
  meow: () => void;
};

type UnionAnimal = Dog | Cat;
type IntersectionAnimal = Dog & Cat;
```

- `Dog | Cat`: 두 타입 중 하나의 조건을 만족하면 된다.
- `Dog & Cat`: 두 타입의 조건을 모두 만족해야 한다.

따라서 교차 타입은 `bark()`와 `meow()`를 모두 요구하지만, 유니온 타입은 그렇지 않다.

이 차이를 이해하면 왜 유니온 타입에서 속성에 접근하기 전에 타입을 확인해야 하는지 알 수 있다.

<br>
<br>

## **✅ 3. 유니온 타입 사용 시 주의점 — 객체의 필드 검사**

유니온 타입은 여러 타입 중 하나를 허용한다.

그렇다면 다음 코드는 어떻게 될까?

```typescript
type Dog = {
  name: string;
  bark: () => void;
};

type Cat = {
  name: string;
  meow: () => void;
};

type Animal = Dog | Cat;

const animal: Animal = {
  name: "Momo",
  bark: () => console.log("멍멍"),
  meow: () => console.log("야옹"),
};
```

`Dog`에는 `meow()`가 없고, `Cat`에는 `bark()`가 없다.

그런데 위 코드는 오류가 발생하지 않는다.

<br>

### **왜 오류가 발생하지 않을까?**

TypeScript는 기본적으로 타입의 이름보다 **객체가 필요한 속성과 타입을 만족하는지**를 중요하게 판단하기 때문이다.

위 객체는 다음 조건을 모두 만족한다.

- `Dog`에서 요구하는 `name`과 `bark()`를 가지고 있다.
- `Cat`에서 요구하는 `name`과 `meow()`를 가지고 있다.

즉, 두 타입의 구조를 모두 만족하기 때문에 `Animal` 타입으로 사용할 수 있다.

이러한 방식을 **구조적 타입 시스템(Structural Type System)** 이라고 한다.

이 개념은 이전 `type`과 `interface` 글에서도 살펴보았다.

<br>

### **유니온 타입은 배타적인 관계를 보장할까?**

유니온 타입이라고 해서 반드시 하나의 타입에 해당하는 속성만 가지고 있어야 하는 것은 아니다.

예를 들어 다음과 같은 사용자 타입이 있다고 가정해 보자.

```typescript
type Admin = {
  name: string;
  permissions: string[];
};

type User = {
  name: string;
  email: string;
};

type Account = Admin | User;
```

`Account`에는 관리자와 일반 사용자의 속성을 모두 가진 객체도 할당할 수 있다.

```typescript
const account: Account = {
  name: "Alice",
  permissions: ["read", "write"],
  email: "alice@example.com",
};
```

이 코드도 정상이다.

하지만 실제 서비스에서는 관리자와 일반 사용자를 명확하게 구분해야 하는 상황이 있을 수 있다.

이때 단순히 유니온 타입을 사용하는 것만으로는 두 사용자 종류가 서로 배타적이라는 의미를 충분히 표현하기 어렵다.

**유니온 타입의 타입 검사가 부정확한 것이 아니라, 유니온 타입 자체가 서로 배타적인 구조를 의미하지 않는 것이다.**

이러한 문제를 해결하는 방법 중 하나가 `type: "admin"`처럼 구분용 속성을 추가하는 **판별 유니온(Discriminated Union)** 이다.

이 내용은 다음 글에서 자세히 다룰 예정이다.

<br>
<br>

## **✅ 4. 타입 좁히기(Type Narrowing)란?**

유니온 타입에서는 실제 값이 어떤 타입인지에 따라 사용할 수 있는 속성과 메서드가 달라진다.

따라서 특정 타입의 기능을 사용하려면 먼저 타입을 확인해야 한다.

이때 사용하는 것이 **타입 좁히기(Type Narrowing)**이다.

타입 좁히기란 **조건문 등을 통해 값이 가질 수 있는 타입의 범위를 줄이는 것**이다.

<br>

### **4-1. typeof — 원시 타입 확인**

`typeof`는 문자열, 숫자, 불리언 등 값의 기본 타입을 확인할 때 사용할 수 있다.

```typescript
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

`if`문에서는 `id`가 `string`으로 좁혀지고, `else`문에서는 `number`로 좁혀진다.

따라서 각 타입에서 사용할 수 있는 메서드를 안전하게 호출할 수 있다.

`typeof`의 기본 사용법과 `null` 처리에 대해서는 이전 타입 안전성 글에서 정리했으므로 여기서는 생략한다.

<br>

### **4-2. Array.isArray() — 배열인지 확인하기**

배열과 객체를 함께 받는 유니온 타입에서는 `Array.isArray()`를 사용할 수 있다.

```typescript
type Input = number[] | string[] | { message: string };

function processInput(input: Input): number | string {
  if (Array.isArray(input)) {
    if (input.every((item) => typeof item === "number")) {
      return input.reduce((a, b) => a + b, 0);
    }

    return input.join("");
  }

  return input.message.toUpperCase();
}
```

`Array.isArray(input)`이 참이면 배열에 해당하는 타입으로 좁혀진다.

따라서 `number[]`와 `string[]`에 공통으로 존재하는 배열 메서드를 사용할 수 있다.

반대로 배열이 아니라면 남은 타입은 `{ message: string }`이므로 `input.message`에 접근할 수 있다.

이 예제에서는 `every()`를 이용해 배열의 모든 요소가 숫자인지도 검사했다.

다만 빈 배열(`[]`)은 `every()`가 `true`를 반환하므로, 위 코드에서는 숫자 배열로 처리되어 `0`을 반환한다.

<br>

### **4-3. instanceof — 클래스의 인스턴스인지 확인하기**

`instanceof`는 값이 특정 클래스의 인스턴스인지 확인할 때 사용한다.

```typescript
class Car {
  constructor(public brand: string) {}
}

class Bike {
  constructor(public type: string) {}
}

function processVehicle(vehicle: Car | Bike): string {
  if (vehicle instanceof Car) {
    return vehicle.brand.toUpperCase();
  }

  return `Bike: ${vehicle.type}`;
}

console.log(processVehicle(new Car("Tesla"))); // TESLA
console.log(processVehicle(new Bike("Mountain"))); // Bike: Mountain
```

`vehicle instanceof Car`가 참이라면 `Car` 타입으로 좁혀진다.

반대로 조건이 거짓이라면 남은 `Bike` 타입으로 처리할 수 있다.

단, `interface`나 `type`은 JavaScript 실행 시 타입 정보가 제거되므로 `instanceof`의 검사 대상으로 사용할 수 없다.

또한 `instanceof`는 실제 인스턴스 관계를 확인하는 연산자이므로, 단순히 클래스와 비슷한 속성을 가진 객체라고 해서 반드시 참이 되는 것은 아니다.

<br>

### **4-4. in — 특정 속성이 존재하는지 확인하기**

`in`은 객체에 특정 속성이 존재하는지 검사할 때 사용한다.

```typescript
type Admin = {
  type: "admin";
  permissions: string[];
};

type User = {
  type: "user";
  email: string;
};

function processUser(user: Admin | User): string {
  if ("permissions" in user) {
    return user.permissions.join(",");
  }

  return user.email;
}
```

위 코드에서 `permissions`는 `Admin`에만 정의되어 있다.

따라서 해당 속성이 존재한다면 `Admin`으로 타입을 좁힐 수 있다.

반대로 존재하지 않는다면 `User`로 처리할 수 있다.

<br>

**선택적 속성이 있는 경우 주의해야 한다.**

```typescript
type Human = {
  swim?: () => void;
};

type Fish = {
  swim: () => void;
};

function check(value: Human | Fish): void {
  if ("swim" in value) {
    // Human도 swim 속성을 가질 수 있다.
    // 따라서 반드시 Fish 타입이라고 할 수 없다.
  }
}
```

`Human`은 `swim` 속성을 가질 수도 있고, 가지지 않을 수도 있다.

따라서 `"swim" in value`가 참이더라도 반드시 `Fish`라고 판단할 수는 없다.

또한 **속성이 존재한다는 것과 해당 속성의 값이 유효하다는 것은 다른 문제**다.

```typescript
type Person = {
  name?: string;
};

const person: Person = {
  name: undefined,
};

console.log("name" in person); // true
```

`name` 속성은 존재하지만 값은 `undefined`다.

따라서 속성의 존재 여부뿐 아니라 실제 값까지 확인해야 하는 경우가 있다.

<br>

### **4-5. 동등성 검사 — 특정 값으로 타입 좁히기**

`===`, `!==`와 같은 비교 연산자도 타입 좁히기에 사용할 수 있다.

```typescript
function printValue(value: string | null): void {
  if (value !== null) {
    console.log(value.toUpperCase());
  }
}
```

`value !== null` 조건을 만족하면 `null`이 제외되므로 문자열 메서드를 사용할 수 있다.

또한 특정 문자열 리터럴을 비교하여 타입을 좁히는 방법도 있다.

```typescript
type Status = "pending" | "success" | "error";

function getMessage(status: Status): string {
  if (status === "success") {
    return "성공";
  }

  return "아직 성공하지 않았습니다.";
}
```

이처럼 조건문에서 특정 값을 비교하면 TypeScript가 가능한 타입의 범위를 좁힐 수 있다.

<br>
<br>

## **✅ 5. 사용자 정의 타입 가드와 is 키워드**

앞에서는 `typeof`, `instanceof`, `in` 등을 이용해 타입을 좁혔다.

그런데 동일한 타입 검사를 여러 곳에서 반복해야 한다면 어떨까?

이때는 **타입을 검사하는 함수를 직접 만들어 재사용할 수 있다.**

이러한 함수를 사용자 정의 타입 가드(User-defined Type Guard)라고 한다.

<br>

### **사용자 정의 타입 가드 만들기**

```typescript
type Dog = {
  name: string;
  bark: () => void;
};

type Cat = {
  name: string;
  meow: () => void;
};

function isDog(animal: Dog | Cat): animal is Dog {
  return "bark" in animal;
}

function makeSound(animal: Dog | Cat): void {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

`isDog()`는 전달된 객체에 `bark` 속성이 있는지 확인한다.

그리고 검사 결과를 이용해 `makeSound()`에서 타입을 좁힌다.

<br>

### **is 키워드는 어떤 역할을 할까?**

다음 부분을 살펴보자.

```typescript
function isDog(animal: Dog | Cat): animal is Dog {
  return "bark" in animal;
}
```

`animal is Dog`는 **함수가 `true`를 반환하면 `animal`을 `Dog` 타입으로 판단하라는 의미**다.

이를 타입 서술어(Type Predicate)라고 한다.

함수의 반환 타입으로 `boolean`을 지정하는 대신 `animal is Dog`를 작성하면, TypeScript가 검사 결과를 타입 좁히기에 활용할 수 있다.

즉, 단순히 참과 거짓을 반환하는 함수를 넘어 **검사 결과를 사용하는 코드에도 타입 정보를 전달하는 역할**을 한다.

<br>

### **is를 사용하면 타입 검사가 자동으로 정확해질까?**

주의할 점은 `is` 키워드 자체가 실제 객체의 구조를 검사해 주는 것은 아니라는 것이다.

TypeScript는 사용자 정의 타입 가드의 반환 타입을 신뢰하지만, 함수 내부의 검사 조건이 올바른지는 개발자가 확인해야 한다.

예를 들어 다음과 같은 코드를 작성할 수도 있다.

```typescript
type Dog = {
  bark: () => void;
};

type Cat = {
  meow: () => void;
};

function isDog(animal: Dog | Cat): animal is Dog {
  return true; // 잘못된 타입 검사
}
```

이 함수는 실제 값이 `Cat`이어도 항상 `true`를 반환한다.

하지만 TypeScript는 `isDog()`가 참을 반환하면 `Dog`로 판단하기 때문에 실행 중 문제가 발생할 수 있다.

따라서 사용자 정의 타입 가드를 작성할 때는 **검사 조건이 실제 타입의 구조를 정확하게 판별하는지** 확인해야 한다.

<br>

### **언제 사용자 정의 타입 가드를 사용할까?**

사용자 정의 타입 가드는 다음과 같은 상황에서 유용하다.

- 동일한 타입 검사 로직을 여러 함수에서 재사용할 때
- 하나의 조건문으로 검사하기 어려운 객체 구조를 확인할 때
- 복잡한 유니온 타입에서 특정 타입을 구분할 때
- 외부 데이터의 구조를 검증하는 로직을 별도 함수로 관리할 때

다만 모든 타입 검사를 별도의 함수로 분리할 필요는 없다.

단순한 조건문 하나로 충분하고 재사용할 필요도 없다면 함수 내부에서 직접 타입을 좁히는 편이 더 직관적일 수 있다.

<br>
<br>

## **✅ 6. 오늘 배운 내용 정리**

<br>

유니온 타입은 여러 타입을 허용하지만, 실제로 어떤 타입인지 확인하지 않으면 각 타입에만 존재하는 속성을 사용할 수 없다.

또한 유니온 타입은 서로 배타적인 객체 구조를 자동으로 보장하지 않기 때문에, 데이터의 의미에 따라 구분 방법을 설계해야 할 수도 있다.

<br>

이러한 상황에서 `typeof`, `instanceof`, `in`, `is` 등을 활용하면 타입을 안전하게 좁힐 수 있다.

특히 사용자 정의 타입 가드를 활용하면 여러 곳에서 반복되는 타입 검사 로직을 재사용할 수 있다는 점이 인상적이었다.

다만 타입을 좁히는 과정과 실제 외부 데이터가 올바른지 검증하는 과정은 구분해야 한다.

TypeScript의 타입 정보만으로 런타임 데이터의 안전성이 자동으로 보장되는 것은 아니기 때문이다.

<br>

다음 글에서는 `type`과 같은 구분용 속성을 이용해 타입을 더 명확하게 구분하는 **판별 유니온(Discriminated Union)**과, 모든 경우를 빠짐없이 처리했는지 확인하는 **`never`를 활용한 완전성 검사**에 대해 알아보려고 한다.

<br>

끝-!
