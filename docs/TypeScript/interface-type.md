---
title: TypeScript type과 interface 개념 및 차이점 정리
date: 2026-10-13
tags:
  - TypeScript
  - Interface
  - Type
  - 타입시스템
---

## **TypeScript의 type과 interface**

이전에는 TypeScript의 원시 타입과 객체, 배열, 튜플 타입에 대해 알아보았다.

이번에는 TypeScript에서 타입을 정의하고 재사용할 때 사용하는 `type`과 `interface`에 대해 정리하려고 한다.

두 문법 모두 데이터의 구조와 타입을 명확하게 표현할 수 있도록 도와준다.

특히 규모가 커지는 프로젝트에서 동일한 타입을 반복해서 작성하지 않고 재사용할 수 있다는 점이 중요하다.

<br>
<br>

## **✅ 1. type과 interface를 사용하는 이유**

TypeScript에서는 변수나 함수의 매개변수에 직접 타입을 지정할 수 있다.

하지만 여러 곳에서 동일한 타입을 사용해야 한다면 어떻게 될까?

<br>

### **타입을 직접 작성하는 경우**

```typescript
const user1: {
  id: number;
  name: string;
  age: number;
} = {
  id: 1,
  name: "Alice",
  age: 25,
};

const user2: {
  id: number;
  name: string;
  age: number;
} = {
  id: 2,
  name: "Bob",
  age: 30,
};
```

위 코드는 정상적으로 동작하지만 동일한 타입 구조가 반복되고 있다.

사용자 정보를 매개변수로 받는 함수를 작성한다면 또다시 타입을 선언해야 한다.

```typescript
function printUser(user: { id: number; name: string; age: number }): void {
  console.log(user.name);
}
```

이러한 방식에는 몇 가지 문제가 있다.

- 동일한 타입을 여러 번 작성해야 한다.
- 타입 구조가 변경되면 여러 곳을 수정해야 한다.
- 수정 과정에서 일부 타입을 누락할 수 있다.
- 프로젝트가 커질수록 데이터 구조를 파악하기 어려워진다.

<br>

### **type과 interface를 이용한 재사용**

이러한 문제를 해결하기 위해 `type`이나 `interface`를 사용할 수 있다.

```typescript
type User = {
  id: number;
  name: string;
  age: number;
};
```

한 번 타입을 정의하면 여러 변수와 함수에서 재사용할 수 있다.

```typescript
const user1: User = {
  id: 1,
  name: "Alice",
  age: 25,
};

const user2: User = {
  id: 2,
  name: "Bob",
  age: 30,
};

function printUser(user: User): void {
  console.log(user.name);
}
```

이제 사용자 정보에 새로운 선택적 속성을 추가해야 한다면 `User` 타입만 수정하면 된다.

```typescript
type User = {
  id: number;
  name: string;
  age: number;
  email?: string;
};
```

`User` 타입을 사용하는 코드에도 변경된 타입 정보가 반영된다.

다만 필수 속성을 추가하면 기존 객체들에도 해당 속성을 추가해야 하므로 타입 오류가 발생할 수 있다.

이러한 오류를 통해 타입 구조가 변경되었을 때 수정해야 할 코드를 파악할 수 있다는 장점도 있다.

<br>

### **타입 재사용이 중요한 이유**

- **재사용성:** 동일한 타입을 여러 변수와 함수에서 사용할 수 있다.
- **유지보수성:** 타입 구조를 한 곳에서 관리할 수 있다.
- **일관성:** 동일한 데이터에 서로 다른 타입을 지정하는 실수를 줄일 수 있다.
- **가독성:** 타입 이름만으로 데이터의 역할을 파악하기 쉽다.
- **자동완성:** IDE가 타입 정보를 활용하여 속성과 메서드를 제안할 수 있다.

<br>

개인적으로는 타입을 재사용할 수 있다는 점이 가장 큰 장점이라고 생각한다.

특히 여러 컴포넌트에서 동일한 API 응답 데이터를 사용하는 경우, 타입을 각각 정의하는 것보다 공통 타입을 만들어 사용하는 편이 훨씬 관리하기 편리할 것 같다.

<br>
<br>

## **✅ 2. type (타입 별칭)**

`type`은 기존 타입이나 타입 표현식에 새로운 이름을 붙이는 문법이다.

정확한 명칭은 **타입 별칭(Type Alias)** 이다.

객체뿐만 아니라 원시 타입, 유니언 타입, 튜플 타입, 함수 타입 등 다양한 타입을 정의할 수 있다.

<br>

### **원시 타입에 이름 붙이기**

```typescript
type UserID = string;

let userId: UserID = "user123";
```

`UserID`는 `string` 타입에 붙인 별칭이다.

따라서 다음 두 선언은 기본적으로 동일한 타입을 사용한다.

```typescript
let id1: string = "123";
let id2: UserID = "123";
```

주의할 점은 `type`으로 별칭을 만들었다고 해서 완전히 새로운 타입이 생성되는 것은 아니라는 것이다.

`UserID`는 여전히 `string` 타입으로 취급된다.

<br>

### **유니언 타입 (Union Type)**

유니언 타입은 `|` 연산자를 사용하여 여러 타입 중 하나를 허용하는 방식이다.

```typescript
type ID = string | number;

let userId: ID = "user123";
userId = 100;
```

`ID`는 문자열 또는 숫자를 허용한다.

<br>

문자열 리터럴을 이용하여 특정 값만 허용할 수도 있다.

```typescript
type Status = "pending" | "success" | "error";

let requestStatus: Status = "pending";

requestStatus = "success"; // 정상
requestStatus = "finished"; // Error
```

이렇게 선언하면 정해진 값 이외의 문자열을 사용할 수 없다.

API 요청 상태나 주문 상태처럼 사용할 수 있는 값이 제한된 경우 유용하다.

<br>

### **객체 타입 정의**

```typescript
type User = {
  id: number;
  name: string;
  email?: string;
};

const user: User = {
  id: 1,
  name: "Alice",
};
```

`email?`은 선택적 속성(Optional Property)을 의미한다.

따라서 `email` 속성이 없어도 오류가 발생하지 않는다.

<br>

### **튜플 타입 정의**

```typescript
type Product = [string, number, boolean];

const product: Product = ["MacBook", 2000000, true];
```

튜플은 각 위치의 타입과 순서를 지정할 수 있는 배열이다.

`type`을 이용하면 이러한 튜플 구조에도 이름을 붙여 재사용할 수 있다.

<br>

### **함수 타입 정의**

`type`은 함수의 매개변수와 반환값도 정의할 수 있다.

```typescript
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => {
  return a + b;
};

console.log(add(5, 3)); // 8
```

`Add`는 숫자 두 개를 받아 숫자를 반환하는 함수 타입이다.

이처럼 함수의 형태를 별도로 정의하면 여러 함수에서 재사용할 수 있다.

<br>
<br>

## **✅ 3. 교차 타입(Intersection Type) — 타입의 결합과 확장**

교차 타입은 `&` 연산자를 사용하여 **여러 타입의 조건을 동시에 만족하는 새로운 타입** 을 만드는 방법이다.

인터섹션 타입(Intersection Type)이라고도 부르며, 객체 타입을 결합하거나 기존 타입의 구조를 재사용할 때 주로 사용한다.

예를 들어 기존 `Person` 타입에 학생 정보를 추가해야 한다고 가정해 보자.

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

`Student`는 `Person`의 속성과 `school` 속성을 모두 가져야 한다.

따라서 새로운 타입을 만들 때 기존 타입의 구조를 재사용할 수 있다.

<br>

### **여러 타입을 조합하기**

교차 타입은 하나의 타입에 속성을 추가하는 것뿐 아니라 여러 타입을 조합하는 데도 사용할 수 있다.

```typescript
type User = {
  id: number;
  name: string;
};

type Contact = {
  email: string;
  phone: string;
};

type UserProfile = User & Contact;
```

`UserProfile`은 `User`와 `Contact`의 조건을 모두 만족해야 한다.

```typescript
const profile: UserProfile = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  phone: "010-1234-5678",
};
```

이처럼 서로 다른 역할을 가진 타입을 분리해 두면 필요한 구조를 조합하여 재사용할 수 있다.

<br>

### **교차 타입 사용 시 주의점 — 속성 충돌**

`&`는 단순히 기존 속성을 덮어쓰는 연산자가 아니다.

두 타입의 조건을 모두 만족해야 하는 타입을 만든다.

```typescript
type A = {
  id: string;
};

type B = {
  id: number;
};

type C = A & B;
```

`C`의 `id`는 `string`과 `number` 조건을 동시에 만족해야 한다.

하지만 문자열이면서 숫자인 값은 존재하지 않으므로 `id` 속성의 타입은 `never`가 된다.

```typescript
const value: C = {
  id: 123, // Error
};
```

따라서 교차 타입을 사용할 때는 같은 이름의 속성이 서로 충돌하지 않는지 주의해야 한다.

<br>

### **교차 타입과 타입 확장의 차이**

교차 타입과 타입 확장은 비슷하게 느껴질 수 있지만 엄밀히 말하면 서로 다른 개념이다.

- **타입 확장(Extension):** 기존 타입의 구조를 재사용하여 새로운 타입을 정의하는 설계 방식
- **교차 타입(Intersection):** `&` 연산자로 여러 타입의 조건을 동시에 만족하는 타입을 만드는 방법

예를 들어 다음과 같이 작성할 수 있다.

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

// 교차 타입을 이용한 타입 확장
type SaleProduct = Product & {
  discount: number;
};
```

`SaleProduct`는 `Product`의 모든 속성과 `discount` 속성을 반드시 가져야 한다.

반면 `interface`에서는 `extends`를 사용하여 타입을 확장할 수 있다.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

interface SaleProduct extends Product {
  discount: number;
}
```

두 코드 모두 비슷한 객체 구조를 표현하지만, 동작 원리가 완전히 동일한 것은 아니다.

특히 기존 속성의 타입이 충돌할 때 `extends`는 호환되지 않는 속성의 재정의를 오류로 감지하지만, 교차 타입은 두 타입의 조건을 결합하면서 `never`가 발생할 수 있다.

즉, **교차 타입은 타입을 확장하는 데 사용할 수 있는 방법 중 하나** 라고 이해하면 된다.

<br>

### **교차 타입은 객체에서만 사용할 수 있을까?**

앞에서는 객체의 속성을 결합하는 방식으로 살펴보았지만, 교차 타입은 객체 타입에서만 사용할 수 있는 것은 아니다.

원시 타입이나 유니언 타입에도 적용할 수 있다.

<br>

**1. 유니언 타입과 교차 타입의 조합**

```typescript
type A = "red" | "blue";
type B = "blue" | "green";

type C = A & B; // "blue"
```

`A`는 `"red"` 또는 `"blue"`를 허용하고, `B`는 `"blue"` 또는 `"green"`을 허용한다.

교차 타입은 두 타입의 조건을 모두 만족해야 하므로, 공통으로 허용되는 `"blue"`만 남는다.

```typescript
const color1: C = "blue"; // 정상
const color2: C = "red"; // Error
```

즉, 교차 타입은 단순히 타입들을 합치는 것이 아니라 **모든 타입의 조건을 동시에 만족하는 값의 범위를 표현한다.**

<br>

**2. 원시 타입의 교차**

서로 다른 원시 타입을 교차하면 어떻게 될까?

```typescript
type A = string;
type B = number;

type C = A & B; // never
```

`string`과 `number`를 동시에 만족하는 값은 존재하지 않는다.

따라서 `C`는 `never` 타입이 된다.

```typescript
const value: C = "hello"; // Error
const value2: C = 123; // Error
```

`never`는 어떤 값도 할당할 수 없는 타입이므로 실제 값을 지정할 수 없다.

<br>

### **실무에서 주의할 점 — 일반 상품과 할인 상품**

교차 타입을 사용할 때는 데이터 구조뿐만 아니라 **각 타입이 실제로 어떤 상태를 의미하는지** 생각해야 한다.

예를 들어 쇼핑몰 API에서 일반 상품과 할인 상품을 관리한다고 가정해 보자.

<br>

**1. 선택적 속성으로 처리하는 경우**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  discount?: number;
};
```

`discount?`를 사용하면 할인 여부와 관계없이 모든 상품을 하나의 타입으로 관리할 수 있다.

하지만 `discount`가 없는 상품도 허용하기 때문에 할인 상품인지 아닌지를 타입만으로 명확하게 구분하기 어렵다.

```typescript
function getDiscountPrice(product: Product): number {
  return product.price * (1 - product.discount / 100);
  // Error: discount가 undefined일 수 있음
}
```

따라서 할인가를 계산하거나 할인율을 화면에 표시할 때마다 값이 존재하는지 확인해야 한다.

또한 할인 상품이어야 하는 데이터에 `discount`가 누락되어도 타입 오류가 발생하지 않는다.

<br>

**2. 교차 타입으로 할인 상품을 분리하는 경우**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

type SaleProduct = Product & {
  discount: number;
};
```

이렇게 정의하면 일반 상품과 할인 상품의 구조를 구분할 수 있다.

```typescript
const saleProduct: SaleProduct = {
  id: 1,
  name: "Laptop",
  price: 1000,
  discount: 20,
};
```

`SaleProduct`에서는 `discount`가 필수 속성이므로 할인가를 계산할 때 별도의 `undefined` 검사가 필요하지 않다.

```typescript
function getDiscountPrice(product: SaleProduct): number {
  return product.price * (1 - product.discount / 100);
}
```

하지만 교차 타입으로 분리했다고 해서 모든 문제가 해결되는 것은 아니다.

<br>

**3. API에서 두 상품을 함께 반환한다면?**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

type SaleProduct = Product & {
  discount: number;
};

const products: (Product | SaleProduct)[] = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 50, discount: 10 },
];
```

API에서 일반 상품과 할인 상품을 함께 반환한다면 두 타입을 유니언으로 관리할 수 있다.

이때 일반 상품에는 `discount` 속성이 정의되어 있지 않기 때문에 바로 접근할 수 없다.

```typescript
products.forEach((product) => {
  console.log(product.discount); // Error
});
```

따라서 할인 정보를 사용하기 전에 타입을 확인해야 한다.

```typescript
products.forEach((product) => {
  if ("discount" in product) {
    console.log(`할인율: ${product.discount}%`);
  }
});
```

즉, **교차 타입으로 구조를 분리하면 각 타입의 필수 속성을 명확하게 표현할 수 있지만, 여러 타입이 함께 사용되는 경우에는 타입을 구분하는 과정이 필요할 수 있다.**

여기서 중요한 점은 타입을 구분하는 과정이 교차 타입 자체의 문제는 아니라는 것이다.

일반 상품과 할인 상품처럼 서로 다른 데이터 구조를 함께 처리하기 때문에 필요한 과정이다.

또한 `SaleProduct`는 `Product`의 모든 조건을 만족하므로 두 타입이 완전히 배타적인 관계는 아니다.

실제로 일반 상품과 할인 상품을 명확히 구분해야 하는 상황이라면 `type: "regular"` 또는 `type: "sale"`과 같은 판별 속성을 추가하는 방법도 고려할 수 있다.

<br>

### **교차 타입을 사용할 때 기억할 점**

- 교차 타입은 여러 타입의 조건을 동시에 만족하는 타입을 만든다.
- 객체뿐 아니라 원시 타입과 유니언 타입에도 적용할 수 있다.
- 서로 충돌하는 타입을 교차하면 `never`가 발생할 수 있다.
- 기존 타입의 구조를 재사용하면서 필수 속성을 추가할 때 유용하다.
- 여러 타입을 유니언으로 함께 사용하는 경우에는 타입을 구분하는 과정이 필요할 수 있다.

따라서 교차 타입을 사용할 때는 단순히 속성을 합치는 것뿐만 아니라 **실제 데이터의 의미와 사용 목적에 맞는 타입 구조인지** 함께 고려해야 한다.

<br>
<br>

## **✅ 4. 유니언(|)과 인터섹션(&)의 차이**

`type`을 공부하면서 가장 헷갈리기 쉬운 부분 중 하나가 `|`와 `&`의 차이다.

두 연산자는 이름은 비슷하지만 역할이 다르다.

<br>

### **유니언 타입 — 여러 타입 중 하나**

```typescript
type A = {
  name: string;
};

type B = {
  age: number;
};

type User = A | B;
```

`User`는 `A` 또는 `B`의 조건을 만족하는 타입이다.

```typescript
const user1: User = {
  name: "Alice",
};

const user2: User = {
  age: 25,
};
```

두 객체 모두 정상적으로 사용할 수 있다.

<br>

### **인터섹션 타입 — 모든 타입의 조건 만족**

```typescript
type A = {
  name: string;
};

type B = {
  age: number;
};

type User = A & B;
```

이번에는 `A`와 `B`의 조건을 모두 만족해야 한다.

```typescript
const user: User = {
  name: "Alice",
  age: 25,
};
```

<br>

| 구분      | 유니언 (`\|`)            | 인터섹션 (`&`)          |
| --------- | ------------------------ | ----------------------- |
| 의미      | 여러 타입 중 하나를 만족 | 모든 타입의 조건을 만족 |
| 주요 용도 | 다양한 값 또는 상태 표현 | 여러 타입의 조합        |
| 예시      | `string \| number`       | `User & Contact`        |

<br>

여기서 주의할 점은 유니언 타입이라고 해서 객체에 반드시 한쪽 타입의 속성만 존재해야 하는 것은 아니라는 것이다.

객체가 두 타입의 조건을 모두 만족하는 경우도 유니언 타입에 할당할 수 있다.

따라서 유니언은 **여러 타입 중 하나의 조건을 만족하면 된다**고 이해하는 것이 정확하다.

<br>
<br>

## **✅ 5. interface (인터페이스)**

`interface`는 주로 **객체가 가져야 할 구조를 정의하는 문법**이다.

객체의 속성, 속성 타입, 메서드 등을 정의할 수 있다.

`type`과 달리 원시 타입이나 유니언 타입 자체에 직접 이름을 붙이는 용도로 사용할 수 없다.

<br>

### **interface 기본 선언**

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const user: User = {
  id: 1,
  name: "Alice",
  age: 25,
};
```

`User` 인터페이스는 객체가 `id`, `name`, `age` 속성을 가져야 한다고 정의한다.

필수 속성이 누락되면 타입 오류가 발생한다.

```typescript
const user: User = {
  id: 1,
  name: "Alice",
  // Error: age 속성이 없음
};
```

<br>

### **선택적 속성과 읽기 전용 속성**

```typescript
interface User {
  readonly id: number;
  name: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: "Alice",
};

user.name = "Bob"; // 정상
user.id = 2; // Error
```

- `?`: 속성이 없을 수도 있음을 의미한다.
- `readonly`: 타입 검사 과정에서 속성의 재할당을 제한한다.

다만 `readonly`는 JavaScript 런타임에서 객체 자체를 동결하는 기능은 아니다.

<br>

### **interface의 메서드 정의**

```typescript
interface User {
  id: number;
  name: string;
  greet(): void;
}

const user: User = {
  id: 1,
  name: "Alice",
  greet() {
    console.log(`안녕하세요, ${this.name}입니다.`);
  },
};

user.greet();
```

`greet(): void`는 반환값이 없는 메서드를 의미한다.

인터페이스는 메서드의 구체적인 구현 방법이 아니라 메서드가 가져야 할 형태를 정의한다.

<br>

### **interface에는 반드시 필드가 있어야 할까?**

인터페이스에는 반드시 일반적인 데이터 속성이 있어야 하는 것은 아니다.

메서드만 정의할 수도 있다.

```typescript
interface Logger {
  log(message: string): void;
}

const logger: Logger = {
  log(message) {
    console.log(message);
  },
};
```

빈 인터페이스 역시 문법적으로 선언할 수 있다.

```typescript
interface Empty {}
```

다만 빈 인터페이스는 생각보다 넓은 범위의 값을 허용할 수 있기 때문에 특별한 목적 없이 사용하는 것은 권장되지 않는다.

또한 인터페이스는 객체의 호출 시그니처를 정의하여 함수 타입을 표현할 수도 있다.

```typescript
interface Add {
  (a: number, b: number): number;
}

const add: Add = (a, b) => a + b;
```

따라서 interface는 단순히 일반적인 속성을 나열하는 문법만은 아니다.

<br>
<br>

## **✅ 6. interface 확장 — extends**

인터페이스는 `extends` 키워드를 사용하여 기존 인터페이스를 확장할 수 있다.

<br>

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

`Student`는 `Person`의 속성과 `school` 속성을 모두 가져야 한다.

<br>

### **여러 인터페이스 확장하기**

```typescript
interface User {
  id: number;
  name: string;
}

interface Contact {
  email: string;
}

interface Member extends User, Contact {
  membershipLevel: string;
}
```

`Member`는 `User`와 `Contact`의 속성을 모두 포함한다.

```typescript
const member: Member = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  membershipLevel: "Gold",
};
```

<br>

### **interface는 어떤 타입을 확장할 수 있을까?**

여기서 중요한 점이 있다.

**interface는 모든 타입을 자유롭게 확장할 수 있는 것이 아니다.**

인터페이스의 `extends` 대상은 정적으로 알려진 멤버를 가진 객체 타입이어야 한다.

<br>

**1. 다른 interface 확장 — 가능**

```typescript
interface Person {
  name: string;
}

interface Student extends Person {
  school: string;
}
```

가장 일반적인 확장 방식이다.

<br>

**2. 객체 형태의 type 확장 — 가능**

```typescript
type Person = {
  name: string;
  age: number;
};

interface Student extends Person {
  school: string;
}
```

`Person`은 `type`으로 선언되었지만 객체 구조를 가지고 있기 때문에 확장할 수 있다.

즉, `interface`가 반드시 다른 `interface`만 확장할 수 있는 것은 아니다.

<br>

**3. 원시 타입 확장 — 불가능**

```typescript
type UserID = string;

interface User extends UserID {
  name: string;
}

// Error
```

`UserID`는 문자열 타입이므로 인터페이스의 확장 대상으로 사용할 수 없다.

<br>

**4. 유니언 타입 확장 — 불가능**

```typescript
type UserInfo = { name: string } | { age: number };

interface User extends UserInfo {
  id: number;
}

// Error
```

유니언 타입은 여러 타입 중 하나를 만족하는 구조이기 때문에 인터페이스가 확장할 수 있는 정적으로 알려진 멤버 집합을 제공하지 않는다.

따라서 이러한 유니언 타입을 `interface extends`에 사용할 수 없다.

<br>

**5. 타입이 확정된 인터섹션 객체 타입 확장 — 가능**

```typescript
type Person = {
  name: string;
};

type Contact = {
  email: string;
};

type UserInfo = Person & Contact;

interface User extends UserInfo {
  id: number;
}
```

`UserInfo`는 두 객체 타입을 결합한 인터섹션 타입이다.

모든 속성이 정적으로 알려진 객체 구조이므로 확장할 수 있다.

<br>

### **extends로 기존 속성의 타입을 변경할 수 있을까?**

기존 인터페이스와 호환되지 않는 타입으로 속성을 재정의하면 오류가 발생한다.

```typescript
interface Person {
  id: string;
}

interface Student extends Person {
  id: number; // Error
}
```

부모 인터페이스에서는 `id`를 문자열로 정의했지만 자식 인터페이스에서는 숫자로 변경하려고 했기 때문이다.

확장한 인터페이스는 기존 인터페이스의 타입 조건을 만족해야 한다.

<br>

반면 기존 타입보다 좁은 타입으로 재정의하는 것은 가능할 수 있다.

```typescript
interface Person {
  role: string;
}

interface Admin extends Person {
  role: "admin";
}
```

`"admin"`은 `string` 타입에 포함되는 문자열 리터럴 타입이므로 기존 조건을 만족한다.

<br>
<br>

## **✅ 7. extends와 &는 완전히 같을까?**

`interface extends`와 `type`의 인터섹션(`&`)은 모두 타입을 확장하거나 조합할 때 사용한다.

하지만 충돌하는 속성을 처리하는 방식에서 차이가 있다.

<br>

### **interface extends의 경우**

```typescript
interface A {
  id: string;
}

interface B extends A {
  id: number; // Error
}
```

기존 속성과 호환되지 않는 타입을 재정의하려고 하면 인터페이스 선언 단계에서 오류가 발생한다.

<br>

### **type 인터섹션의 경우**

```typescript
type A = {
  id: string;
};

type B = {
  id: number;
};

type C = A & B;
```

인터섹션은 두 타입의 조건을 결합한다.

이때 `C`의 `id` 속성은 `never` 타입이 된다.

```typescript
const value: C = {
  id: 123, // Error
};
```

즉, 인터섹션은 타입 결합 자체가 가능하더라도 실제로 사용할 수 없는 타입이 만들어질 수 있다.

**extends는 확장 과정에서 타입 호환성을 검사하고, 인터섹션은 조건을 결합하기 때문에 결과가 다를 수 있다.**

<br>
<br>

## **✅ 8. interface의 선언 병합 (Declaration Merging)**

`interface`의 특징 중 하나는 같은 이름으로 여러 번 선언하면 선언이 합쳐진다는 것이다.

이를 **선언 병합(Declaration Merging)** 이라고 한다.

<br>

```typescript
interface Person {
  name: string;
}

interface Person {
  age: number;
}

const person: Person = {
  name: "Alice",
  age: 20,
};
```

두 인터페이스가 같은 이름으로 선언되었기 때문에 TypeScript는 이를 하나의 인터페이스로 취급한다.

결과적으로 다음과 같은 구조가 된다.

```typescript
interface Person {
  name: string;
  age: number;
}
```

<br>

### **type과의 차이**

`type`은 같은 이름으로 다시 선언할 수 없다.

```typescript
type Person = {
  name: string;
};

type Person = {
  age: number;
};

// Error: Duplicate identifier 'Person'
```

따라서 선언 병합은 `interface`의 중요한 특징이다.

이 기능은 외부 라이브러리의 타입 정의에 속성을 추가해야 할 때 유용하게 사용된다.

<br>

### **선언 병합의 주의점**

같은 이름으로 인터페이스를 선언한다고 해서 모든 속성이 자유롭게 합쳐지는 것은 아니다.

동일한 이름의 일반 속성을 선언하는 경우에는 타입이 호환되어야 한다.

```typescript
interface Person {
  age: number;
}

interface Person {
  age: string; // Error
}
```

동일한 속성을 서로 다른 타입으로 정의했기 때문에 오류가 발생한다.

<br>

또한 `extends`와 선언 병합은 서로 다른 개념이다.

- `extends`: 기존 타입을 기반으로 새로운 이름의 인터페이스를 정의
- 선언 병합: 같은 이름으로 선언한 인터페이스들을 하나로 결합

선언 병합은 편리하지만 의도하지 않은 타입 확장이 발생할 수도 있으므로 일반적인 프로젝트 코드에서는 필요한 상황에 맞게 사용하는 것이 좋다.

<br>
<br>

## **✅ 9. type과 interface의 공통점 및 차이점**

### **공통점**

- 객체의 구조와 속성 타입을 정의할 수 있다.
- 동일한 타입 구조를 여러 곳에서 재사용할 수 있다.
- 선택적 속성(`?`)과 읽기 전용 속성(`readonly`)을 사용할 수 있다.
- 다른 타입과 조합하거나 확장할 수 있다.
- 함수 타입을 표현할 수 있다.
- TypeScript의 타입 검사와 IDE 자동완성을 지원한다.

<br>

### **차이점**

| 구분              | type                    | interface                 |
| ----------------- | ----------------------- | ------------------------- |
| 주요 역할         | 다양한 타입에 별칭 부여 | 객체 구조와 계약 정의     |
| 원시 타입         | 가능                    | 직접 정의 불가            |
| 객체 타입         | 가능                    | 가능                      |
| 유니언 타입       | 가능                    | 직접 정의 불가            |
| 튜플 타입         | 가능                    | 직접 정의 불가            |
| 함수 타입         | 가능                    | 호출 시그니처로 정의 가능 |
| 확장 방법         | `&`                     | `extends`                 |
| 선언 병합         | 불가능                  | 가능                      |
| Mapped Type       | 가능                    | 직접 선언 불가            |
| 클래스 implements | 가능\*                  | 가능                      |

- `implements`는 클래스가 구현할 수 있는 객체 또는 함수 구조를 가진 타입 별칭에 사용할 수 있으며, 유니언 타입 등에는 사용할 수 없다.

<br>

### **Mapped Type — type을 활용한 타입 생성**

Mapped Type은 기존 키 집합을 이용하여 새로운 객체 타입을 생성하는 기능이다.

```typescript
type Keys = "name" | "age";

type Person = {
  [K in Keys]: string;
};
```

위 코드는 다음과 같은 구조가 된다.

```typescript
type Person = {
  name: string;
  age: string;
};
```

`[K in Keys]`는 `Keys`에 포함된 각 키를 이용하여 속성을 생성하는 문법이다.

`interface`에서는 이러한 Mapped Type 문법을 직접 작성할 수 없다.

<br>

다만 Mapped Type과 일반적인 계산된 속성 이름(Computed Property Name)은 구분해야 한다.

```typescript
const NAME_KEY = "name";

interface Person {
  [NAME_KEY]: string;
}
```

이와 같은 계산된 속성 이름은 인터페이스에서도 사용할 수 있다.

따라서 **Mapped Type을 직접 정의할 수 있다는 점이 type의 특징** 이라고 이해하는 것이 정확하다.

<br>
<br>

## **✅ 10. 중첩 객체 타입 정의**

실제 프로젝트에서는 객체 안에 또 다른 객체가 포함되는 경우가 많다.

예를 들어 사용자 정보 안에 주소 정보가 포함될 수 있다.

<br>

### **type을 사용한 중첩 객체**

```typescript
type User = {
  id: number;
  name: string;
  address: {
    city: string;
    zipCode: number;
  };
};

const user: User = {
  id: 1,
  name: "Alice",
  address: {
    city: "Seoul",
    zipCode: 12345,
  },
};
```

중첩 객체에도 타입을 지정할 수 있다.

하지만 주소 정보를 다른 곳에서도 사용해야 한다면 별도의 타입으로 분리하는 편이 좋다.

```typescript
type Address = {
  city: string;
  zipCode: number;
};

type User = {
  id: number;
  name: string;
  address: Address;
};
```

다른 타입에서도 `Address`를 재사용할 수 있다.

```typescript
type Company = {
  name: string;
  address: Address;
};
```

<br>

### **interface를 사용한 중첩 구조**

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  orderId: number;
  products: Product[];
  totalPrice: number;
}

const order: Order = {
  orderId: 101,
  products: [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 50 },
  ],
  totalPrice: 1050,
};
```

`products: Product[]`는 `Product` 인터페이스를 만족하는 객체들로 이루어진 배열이라는 의미다.

이처럼 각 데이터 구조를 별도로 정의하면 복잡한 데이터도 관리하기 쉬워진다.

<br>
<br>

## **✅ 11. type과 interface 함께 사용하기**

`type`과 `interface`는 반드시 하나만 사용해야 하는 것은 아니다.

서로 참조하거나 확장하면서 함께 사용할 수 있다.

<br>

### **type이 interface를 활용하는 경우**

```typescript
interface BaseUser {
  id: number;
  name: string;
}

type AdminUser = BaseUser & {
  role: string;
};

const admin: AdminUser = {
  id: 1,
  name: "Alice",
  role: "Administrator",
};
```

<br>

### **interface가 type을 확장하는 경우**

```typescript
type BaseUser = {
  id: number;
  name: string;
};

interface AdminUser extends BaseUser {
  role: string;
}

const admin: AdminUser = {
  id: 1,
  name: "Alice",
  role: "Administrator",
};
```

객체 구조를 가진 `type`이라면 `interface`가 확장할 수 있다.

하지만 유니언 타입이나 원시 타입처럼 인터페이스의 확장 조건을 만족하지 않는 타입은 `extends`에 사용할 수 없다.

<br>
<br>

## **✅ 12. 구조적 타입 시스템 (Structural Typing)**

TypeScript를 공부하면서 알아두면 좋은 개념이 하나 더 있다.

바로 **구조적 타입 시스템(Structural Type System)** 이다.

TypeScript는 타입의 이름보다 실제 구조가 호환되는지를 중요하게 판단한다.

<br>

```typescript
interface Person {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
};
```

두 타입은 서로 다른 이름으로 선언되었다.

하지만 속성과 타입이 동일하기 때문에 서로 호환된다.

```typescript
const person: Person = {
  name: "Alice",
  age: 25,
};

const user: User = person;
```

`Person`과 `User`는 서로 다른 이름을 가지고 있지만 구조가 동일하므로 할당할 수 있다.

<br>

### **필요한 속성을 모두 가지고 있다면?**

```typescript
interface Person {
  name: string;
}

const user = {
  name: "Alice",
  age: 25,
};

const person: Person = user;
```

`user`에는 `Person`에서 요구하는 `name` 속성이 존재하기 때문에 할당할 수 있다.

추가적인 `age` 속성이 있어도 일반적인 구조적 타입 호환성 검사에서는 문제가 되지 않는다.

<br>

하지만 객체 리터럴을 직접 할당할 때는 주의해야 한다.

```typescript
const person: Person = {
  name: "Alice",
  age: 25, // Error
};
```

새로운 객체 리터럴을 직접 할당할 때는 초과 속성 검사(Excess Property Check)가 적용될 수 있기 때문이다.

따라서 TypeScript는 단순히 타입 이름만 비교하는 것이 아니라 객체의 구조와 할당 상황에 따라 타입을 검사한다는 점을 알아두어야겠다.

<br>
<br>

## **✅ 13. interface와 클래스 — implements**

인터페이스는 클래스가 특정 구조를 만족하도록 할 때도 사용할 수 있다.

이때 사용하는 키워드가 `implements`다.

<br>

```typescript
interface Animal {
  name: string;
  speak(): void;
}

class Dog implements Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log("멍멍!");
  }
}
```

`Dog` 클래스는 `Animal` 인터페이스를 구현한다고 선언했다.

따라서 인터페이스에 정의된 `name` 속성과 `speak()` 메서드의 조건을 만족해야 한다.

<br>

### **implements와 extends의 차이**

두 키워드는 비슷해 보이지만 역할이 다르다.

- `extends`: 인터페이스가 다른 타입을 확장하거나, 클래스가 다른 클래스를 상속할 때 사용한다.
- `implements`: 클래스가 특정 인터페이스 또는 타입의 구조를 만족하는지 검사할 때 사용한다.

`implements`는 인터페이스의 메서드 구현을 자동으로 생성하거나 상속하지 않는다.

개발자가 클래스 내부에 필요한 속성과 메서드를 직접 구현해야 한다.

<br>

참고로 `type`으로 정의한 객체 타입도 `implements`에 사용할 수 있다.

```typescript
type Animal = {
  name: string;
  speak(): void;
};

class Dog implements Animal {
  name = "초코";

  speak(): void {
    console.log("멍멍!");
  }
}
```

따라서 `implements`는 `interface`에만 사용할 수 있는 기능은 아니다.

<br>
<br>

## **✅ 14. type과 interface는 런타임에 남아 있을까?**

TypeScript의 `type`과 `interface`는 개발 및 컴파일 단계에서 타입을 검사하기 위한 문법이다.

일반적으로 JavaScript로 컴파일되면 타입 정보는 제거된다.

<br>

**TypeScript 코드**

```typescript
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Alice",
};
```

**컴파일된 JavaScript 코드 예시**

```javascript
const user = {
  id: 1,
  name: "Alice",
};
```

컴파일된 코드에는 `User` 인터페이스가 남아 있지 않다.

`type`도 마찬가지다.

<br>

### **타입을 정의했다고 실제 데이터가 검증되는 것은 아니다**

예를 들어 서버에서 사용자 정보를 받아온다고 생각해 보자.

```typescript
interface User {
  id: number;
  name: string;
}
```

인터페이스를 정의했다고 해서 서버가 반드시 올바른 데이터를 반환하는 것은 아니다.

서버에서 예상과 다른 데이터가 전달될 수도 있다.

따라서 외부 API 응답이나 사용자가 입력한 데이터는 필요한 경우 런타임에서 별도로 검증해야 한다.

<br>

### **타입 단언(as)도 실제 데이터를 검증하지 않는다**

```typescript
type User = {
  id: number;
  name: string;
};

const data: unknown = {
  id: "123",
  name: "Alice",
};

const user = data as User;
```

`as User`는 개발자가 해당 값을 `User` 타입으로 취급하도록 TypeScript에 알려주는 문법이다.

하지만 실제 데이터의 `id`를 문자열에서 숫자로 변환하지는 않는다.

```typescript
console.log(typeof user.id); // "string"
```

TypeScript에서는 `user.id`를 숫자로 취급하지만 실제 값은 여전히 문자열이다.

따라서 **타입 단언과 데이터 검증은 서로 다른 개념**이라는 점을 기억해야 한다.

<br>
<br>

## **✅ 15. 실무에서는 type과 interface 중 무엇을 사용할까?**

처음에는 `type`과 `interface`의 차이가 크게 느껴지지 않았다.

두 문법 모두 객체의 구조를 정의하고 재사용할 수 있기 때문이다.

실제로 단순한 객체 타입을 작성할 때는 어느 쪽을 사용해도 무방한 경우가 많다.

다만 다음과 같은 기준으로 구분할 수 있다.

<br>

### **interface를 사용하는 경우**

- 객체의 구조를 명확하게 표현할 때
- 기존 객체 타입을 `extends`로 확장할 때
- 선언 병합 기능이 필요할 때
- 클래스가 구현할 계약을 정의할 때

<br>

### **type을 사용하는 경우**

- 원시 타입에 별칭을 붙일 때
- 유니언 타입을 정의할 때
- 튜플 타입을 정의할 때
- 여러 타입을 인터섹션으로 조합할 때
- Mapped Type이나 조건부 타입 등 복잡한 타입을 정의할 때

<br>

### **실무에서 고려해야 할 점**

`type`으로 객체 타입을 정의하는 것이 잘못된 것은 아니고, `interface`가 반드시 클래스와 함께 사용되어야 하는 것도 아니다.

또한 interface를 사용한다고 무조건 type보다 성능이나 유지보수성이 뛰어나다고 단정할 수는 없다.

중요한 것은 프로젝트의 목적과 팀의 컨벤션에 따라 일관성 있게 사용하는 것이다.

개인적으로는 앞으로 프로젝트를 진행하면서 객체의 구조를 정의할 때는 `interface`를 우선 고려하고, 유니언이나 튜플, 여러 타입의 조합이 필요하다면 `type`을 사용해 보려고 한다.

<br>
<br>

## **✅ 16. 오늘 배운 내용 정리**

이번에는 TypeScript에서 타입을 정의하고 재사용할 때 사용하는 `type`과 `interface`에 대해 공부했다.
추가하고 추가하다 보니까 내용이 의도치 않게 엄청나게 길어졌다ㅏ..

<br>

처음에는 두 문법이 비슷해서 굳이 구분해서 사용해야 하는 이유가 궁금했다.

하지만 공부하면서 두 문법의 중요한 역할은 **타입을 반복해서 작성하지 않고 일관되게 관리할 수 있도록 도와준다는 것** 이라는 생각이 들었다.

특히 여러 객체와 함수에서 동일한 타입을 사용하는 경우 공통 타입을 정의해 두면 코드의 가독성과 유지보수성을 높일 수 있다는 점이 인상적이었다.

<br>

또한 `type`은 원시 타입, 유니언, 튜플 등 다양한 타입을 표현할 수 있는 반면, `interface`는 객체의 구조와 확장에 초점을 맞추고 있다는 차이를 이해할 수 있었다.

이번에 새롭게 알게 된 점은 `interface`의 `extends`가 모든 타입을 확장할 수 있는 것은 아니라는 것이다.

객체 구조를 가진 타입 별칭은 확장할 수 있지만, 원시 타입이나 유니언 타입처럼 정적으로 멤버가 확정되지 않은 타입은 직접 확장할 수 없다는 점을 기억해야겠다.

또한 `type`의 인터섹션과 `interface`의 `extends`가 속성 충돌을 처리하는 방식이 다르다는 점도 중요하게 느껴졌다.

<br>

마지막으로 TypeScript의 타입은 컴파일 과정에서 제거되기 때문에, 타입을 정의했다고 해서 실제 데이터의 안전성이 보장되는 것은 아니라는 사실도 다시 확인할 수 있었다.

<br>

아직은 어떤 상황에서 무엇을 선택해야 할지 고민될 때도 있지만, 앞으로 프로젝트에서 타입을 직접 설계하면서 두 문법의 차이를 익혀 나가야겠다.

<br>

끝-!

<br>
