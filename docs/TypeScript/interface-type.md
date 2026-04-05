---
title: TypeScript 타입과 인터페이스 정리
date: 2026-04-04
tags:
  - TypeScript
  - Interface
  - Type
---

## ✅ 1. type

하나 이상의 타입을 조합하거나 기존 타입에 이름을 붙이는 타입 정의 도구다.
객체뿐만 아니라 원시 타입, 유니언, 튜플 등 **모든 타입을 정의**할 수 있다.

```typescript
// 기본 타입에 이름 붙이기
type UserID = string;

// 유니언 타입 — 여러 타입 중 하나
type Status = "pending" | "success" | "error";

// 객체 타입 정의
type User = {
  id: number;
  name: string;
};
```

<br>

### type 확장 — `&` (인터섹션)

`&`를 사용해서 두 타입을 합쳐 새로운 타입을 만들 수 있다.

```typescript
type Person = {
  name: string;
  age: number;
};

type Student = Person & {
  school: string;
};

const student: Student = {
  name: "Alice",
  age: 20,
  school: "HY",
};
```

<br>
<br>

## ✅ 2. interface

객체의 구조(속성, 타입, 메서드)를 정의하는 도구다.
**객체 타입을 정의할 때** 사용하며, 원시 타입(`string`, `number` 등)에는 사용할 수 없다.

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 선택 속성
  greet(): void; // 메서드 정의도 가능
}

const user: User = {
  id: 1,
  name: "Alice",
  greet() {
    console.log(`안녕하세요, ${this.name}입니다.`);
  },
};
```

<br>

### interface 확장 — `extends`

`extends` 키워드로 기존 인터페이스를 확장할 수 있다.

```typescript
interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  school: string;
}

const student: Student = {
  name: "Alice",
  age: 20,
  school: "HY",
};
```

<br>

### interface의 선언적 확장 (Declaration Merging)

interface는 같은 이름으로 다시 선언하면 자동으로 합쳐진다.
type은 이 기능이 없다.

```typescript
interface Person {
  name: string;
}

interface Person {
  age: number; // 같은 이름으로 선언 → 자동으로 합쳐짐
}

const person: Person = {
  name: "Alice",
  age: 20,
};
```

> 외부 라이브러리의 타입을 확장할 때 유용하게 쓰이는 기능이다.

<br>
<br>

## ✅ 3. type vs interface 비교

### 공통점

- 객체 타입 정의 가능
- 확장 가능 (방법은 다름)
- TypeScript의 타입 체크, 자동완성 등 모든 기능 활용 가능

<br>

### 차이점

| 구분                     | type                              | interface                      |
| ------------------------ | --------------------------------- | ------------------------------ |
| 정의 가능한 타입         | 모든 타입 (원시, 유니언, 튜플 등) | 객체, 함수 타입만              |
| 확장 방법                | `&` (인터섹션)                    | `extends`                      |
| 선언적 확장              | ❌ 불가능                         | ✅ 가능 (같은 이름으로 재선언) |
| 유니언 타입              | ✅ 가능                           | ❌ 불가능                      |
| 계산된 키 (Computed Key) | ✅ 가능                           | ❌ 불가능                      |

<br>

### 계산된 키 (Computed Key) — type만 가능

```typescript
type Keys = "name" | "age";

type Person = {
  [K in Keys]: string; // Keys의 각 값을 키로 사용
};

// 결과:
// type Person = {
//   name: string;
//   age: string;
// }
```

<br>
<br>

## ✅ 4. 중첩 객체 타입 정의

객체 안에 객체가 포함된 구조도 타입으로 표현할 수 있다.

```typescript
type TUser = {
  id: number;
  name: string;
  address: {
    city: string;
    zipCode: number;
  };
};

const user: TUser = {
  id: 1,
  name: "Alice",
  address: {
    city: "Seoul",
    zipCode: 12345,
  },
};
```

<br>
<br>

## ✅ 5. interface와 type 함께 쓰기

interface와 type은 서로 확장할 수 있다.
interface가 type을 확장하거나, type이 interface를 인터섹션으로 합칠 수 있다.

```typescript
interface IBaseUser {
  id: number;
  name: string;
}

// type이 interface를 확장
type TAdminUser = IBaseUser & {
  role: string;
};

type TGuestUser = IBaseUser & {
  visitCount: number;
};

const admin: TAdminUser = {
  id: 1,
  name: "Alice",
  role: "Administrator",
};

const guest: TGuestUser = {
  id: 2,
  name: "Bob",
  visitCount: 5,
};
```

<br>
<br>

## ✅ 6. 인터페이스로 중첩 구조 표현하기

인터페이스를 여러 개 조합해서 복잡한 데이터 구조를 표현할 수 있다.
각 인터페이스가 하나의 책임만 지도록 분리하면 재사용하기 쉬워진다.

```typescript
interface IProduct {
  id: number;
  name: string;
  price: number;
}

interface IOrder {
  orderId: number;
  products: IProduct[]; // IProduct 타입의 배열
  totalPrice: number;
}

const order: IOrder = {
  orderId: 101,
  products: [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 50 },
  ],
  totalPrice: 1050,
};
```

<br>
<br>

## 언제 뭘 써야 할까

실무에서는 팀 컨벤션에 따라 다르지만, 일반적인 기준은 이렇다.

- **interface** → 객체의 구조를 정의하고, 확장/상속이 필요한 경우
- **type** → 원시 타입, 유니언, 튜플 등 유연한 타입 조합이 필요한 경우

솔직히 처음엔 둘의 차이가 잘 느껴지지 않는다.
실제로 많은 팀에서 어느 쪽을 써도 큰 문제가 없는 경우가 대부분이고,
중요한 건 **팀 안에서 일관성 있게 사용하는 것**이다.
다만 확장이 필요한 객체 구조라면 `interface`, 유니언이나 조합이 필요하다면 `type`을 선택하면 자연스럽다.

---

<br>

**핵심 요약:**

- **type** → 모든 타입 정의 가능, `&`로 확장, 유니언/계산된 키 사용 가능
- **interface** → 객체 구조 정의, `extends`로 확장, 선언적 확장(병합) 가능
- **interface + type 혼용** → 서로 확장 가능, 팀 컨벤션에 따라 조합해서 사용
