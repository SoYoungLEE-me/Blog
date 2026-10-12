---
title: TypeScript 객체, 배열, 튜플 타입 정리
date: 2026-10-13
tags:
  - TypeScript
  - 객체
  - 배열
  - 튜플
  - 타입시스템
---

## **TypeScript의 객체, 배열, 튜플 타입**

이전에는 TypeScript의 기본 개념과 원시 타입(Primitive Type)에 대해 정리했다. <br>

이번에는 여러 데이터를 하나의 구조로 관리할 수 있는 객체(Object), 배열(Array), 튜플(Tuple)에 대해 알아보려고 한다. <br>

원시 타입이 하나의 값을 표현한다면, 객체와 배열은 여러 값을 묶어서 관리할 수 있는 타입이다.

<br> <br>

## **✅ 1. 객체 타입 (Object Type)**

객체는 여러 데이터를 `key: value` 형태로 저장하는 자료구조다. <br>

TypeScript에서는 객체가 어떤 속성을 가지고 있고, 각 속성에 어떤 타입의 값이 들어가는지 명시할 수 있다.

<br>

```typescript
const user: {
  name: string;
  age: number;
  isAdmin: boolean;
} = {
  name: "Alice",
  age: 25,
  isAdmin: false,
};
```

<br>
위 코드는 `user` 객체에 다음과 같은 타입을 지정한다.

- `name`: 문자열
- `age`: 숫자
- `isAdmin`: 불리언

<br>

객체에 정의되지 않은 속성에 접근하거나, 잘못된 타입의 값을 할당하면 TypeScript에서 오류를 감지할 수 있다.

<br>

```typescript
user.age = "25"; // Error: string은 number에 할당할 수 없음
user.email; // Error: email 속성이 존재하지 않음
```

<br>

### **type을 이용한 객체 타입 선언**

객체의 속성이 많아질수록 타입을 직접 작성하는 방식은 코드가 길어지고 관리하기 어려워진다. <br>

이때 `type`을 사용하면 타입에 이름을 붙여 재사용할 수 있다.
<br>

```typescript
type User = {
  name: string;
  age: number;
  isAdmin: boolean;
};

const user1: User = {
  name: "Alice",
  age: 25,
  isAdmin: false,
};

const user2: User = {
  name: "Bob",
  age: 30,
  isAdmin: true,
};
```

<br>

이렇게 객체의 타입을 분리하면 여러 곳에서 같은 타입을 사용할 수 있다.

또한 객체 구조가 변경되었을 때 `User` 타입만 수정하면 되므로 유지보수에도 유리하다.

<br>

### **선택적 속성 (Optional Property)**

모든 객체가 동일한 속성을 가지고 있는 것은 아니다. <br>

예를 들어 상품 객체에는 상품명과 가격이 반드시 필요하지만, 카테고리는 없는 경우도 있을 수 있다. <br>

이때 사용하는 것이 선택적 속성 `?`이다. <br>

```typescript
type Product = {
  name: string;
  price: number;
  category?: string;
};

const product1: Product = {
  name: "MacBook",
  price: 2000000,
};

const product2: Product = {
  name: "iPhone",
  price: 1200000,
  category: "전자기기",
};
```

<br>
`category?: string`은 해당 속성이 없어도 된다는 의미다.

따라서 `product1`처럼 카테고리를 생략해도 오류가 발생하지 않는다.

<br>

주의할 점은 선택적 속성에 접근할 때 `undefined`가 반환될 수 있다는 것이다.

```typescript
console.log(product1.category); // undefined
console.log(product2.category); // "전자기기"
```

TypeScript에서 선택적 속성을 읽으면 일반적으로 `string | undefined` 타입으로 취급된다.

선택적 속성을 사용할 때는 값이 존재하는지 확인하는 과정이 필요할 수 있다.

<br><br>

## **✅ 2. 배열 타입 (Array Type)**

배열은 여러 개의 값을 순서대로 저장하는 자료구조다.

TypeScript에서는 배열 안에 들어갈 요소의 타입을 지정할 수 있다.

<br>

### **배열 타입 선언 방법**

배열 타입은 크게 두 가지 방식으로 선언할 수 있다.

```typescript
// 방법 1: 타입[]
const numbers: number[] = [1, 2, 3, 4, 5];

// 방법 2: Array<타입>
const names: Array<string> = ["Alice", "Bob", "Charlie"];
```

두 방식은 기본적으로 동일한 의미를 가진다.

일반적으로 간단한 배열 타입은 `number[]`, `string[]`처럼 작성하는 경우가 많다.

<br>

### **배열의 타입 제한**

TypeScript에서는 배열에 지정한 타입과 다른 값을 넣으려고 하면 오류가 발생한다.
<br>

```typescript
const scores: number[] = [90, 85, 100];

scores.push(95); // 정상
scores.push("A"); // Error: string은 number에 할당할 수 없음
```

<br>
이렇게 배열의 요소 타입을 제한하면 의도하지 않은 데이터가 들어가는 것을 방지할 수 있다.

<br>

### **유니온 타입을 사용한 배열**

배열에 여러 타입의 값을 저장해야 한다면 유니온 타입(`|`)을 사용할 수 있다.
<br>

```typescript
const values: (string | number)[] = ["Alice", 25, "Bob", 30];
```

<br>
위 배열은 문자열 또는 숫자 타입의 요소를 저장할 수 있다.

여기서 괄호의 위치에 주의해야 한다.
<br>

```typescript
// 문자열 또는 숫자로 구성된 하나의 배열
let a: (string | number)[];

// 문자열 배열 또는 숫자 배열
let b: string[] | number[];
```

<br>

`a`는 문자열과 숫자가 섞여 있어도 되지만, `b`는 문자열 배열이나 숫자 배열 중 하나의 형태를 가져야 한다.

<br>

### **객체 배열**

실무에서는 객체 여러 개를 배열로 관리하는 경우가 많다.

예를 들어 사용자 목록이나 상품 목록 등을 표현할 때 사용할 수 있다.
<br>

```typescript
type User = {
  id: number;
  name: string;
  age: number;
};

const users: User[] = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 28 },
];
```

<br>

`User[]`는 `User` 타입의 객체들로 구성된 배열이라는 의미다. <br>

이처럼 객체 타입과 배열 타입을 조합하면 여러 데이터를 일관된 형태로 관리할 수 있다.<br>

나중에 배열 메서드를 활용한 데이터 처리에 대해서도 정리하도록 하겠다.

<br>

## **✅ 3. 튜플 타입 (Tuple Type)**

튜플은 배열과 비슷하지만, **각 위치에 들어갈 값의 타입과 순서가 정해져 있는 자료구조**다.<br>

일반 배열은 요소들의 타입을 정의하지만, 튜플은 각 위치의 타입을 개별적으로 정의할 수 있다는 차이가 있다.

<br>

### **튜플 타입 선언 방법**

```typescript
const product: [string, number, boolean] = ["MacBook", 2000000, true];
```

<br>
위 튜플의 구조는 다음과 같다.

| 위치 | 타입    | 의미      |
| ---- | ------- | --------- |
| 0    | string  | 상품명    |
| 1    | number  | 가격      |
| 2    | boolean | 재고 여부 |

튜플에서는 값이 들어가는 순서가 중요하다.
<br>

```typescript
const product: [string, number, boolean] = [2000000, "MacBook", true];
// Error: 각 위치에 지정된 타입이 일치하지 않음
```

<br>
같은 값이 들어 있어도 순서가 달라지면 오류가 발생한다.
<br>
다만 TypeScript의 튜플이 런타임에서 완전히 고정된 배열이 되는 것은 아니다.

일부 배열 메서드를 통해 요소를 추가할 수 있기 때문에, 튜플의 길이까지 변경하지 못하도록 제한하고 싶다면 `readonly`를 사용할 수 있다.
<br>

```typescript
const user: readonly [string, number] = ["Alice", 25];

user.push(30); // Error: push를 사용할 수 없음
```

<br><br>

### **배열(Array) vs 튜플(Tuple)**

배열과 튜플은 모두 여러 값을 순서대로 저장하는 자료구조다.

하지만 타입을 지정하는 방식에서 차이가 있다.

<br>

**1. 배열(Array)**

배열은 요소에 들어갈 수 있는 타입을 지정하며, 일반적으로 길이나 각 위치의 타입을 고정하지 않는다.

```typescript
const product: (string | number | boolean)[] = ["MacBook", 2000000, true];
```

위 배열은 문자열, 숫자, 불리언을 저장할 수 있지만 각 위치에 어떤 타입이 들어가야 하는지는 정해져 있지 않다.

<br>

**2. 튜플(Tuple)**

튜플은 각 위치에 들어갈 요소의 타입과 순서를 지정할 수 있다.

```typescript
const product: [string, number, boolean] = ["MacBook", 2000000, true];
```

첫 번째 요소는 문자열, 두 번째 요소는 숫자, 세 번째 요소는 불리언으로 고정된다.

따라서 순서가 달라지거나 요소의 개수가 맞지 않으면 타입 오류가 발생한다.

<br>

| 구분        | 배열(Array)            | 튜플(Tuple)             |
| ----------- | ---------------------- | ----------------------- |
| 타입 지정   | 요소에 허용되는 타입   | 각 위치의 타입          |
| 길이        | 일반적으로 가변적      | 타입으로 길이 지정 가능 |
| 요소의 순서 | 위치별 타입 제한 없음  | 위치별 타입 제한 가능   |
| 사용 예시   | 상품 목록, 사용자 목록 | 좌표, 고정된 반환값     |

<br>

### **튜플과 객체 중 무엇을 사용해야 할까?**

튜플과 객체는 같은 데이터를 서로 다른 형태로 표현할 수 있다.

튜플은 순서가 명확하고 간단한 데이터를 표현할 때 유용하다.

반면 객체는 속성 이름을 통해 데이터의 의미를 명확하게 나타낼 수 있다.
<br>

```typescript
// 튜플
const product1: [string, number] = ["MacBook", 2000000];

// 객체
const product2: { name: string; price: number } = {
  name: "MacBook",
  price: 2000000,
};
```

<br>

튜플은 코드가 간결하지만 각 인덱스의 의미를 알고 있어야 한다.

반면 객체는 속성 이름만 봐도 데이터의 의미를 이해할 수 있다.

따라서 일반적인 데이터 모델에서는 객체를 사용하는 편이 가독성과 확장성 측면에서 유리하다.

<br><br>

## **✅ 4. ?? 연산자 (Nullish Coalescing Operator)**

객체의 선택적 속성을 다룰 때 유용하게 사용할 수 있는 연산자가 있다.

바로 `??` 연산자다.

`??`는 왼쪽 값이 `null` 또는 `undefined`일 때 오른쪽 값을 반환한다.

<br>

### **기본 사용 방법**

```typescript
const age: number | undefined = undefined;

const result = age ?? 18;

console.log(result); // 18
```

`age`가 `undefined`이므로 기본값인 `18`이 반환된다.

반대로 값이 존재하면 원래 값을 사용한다.

```typescript
const age: number | undefined = 25;

const result = age ?? 18;

console.log(result); // 25
```

<br>

### **객체의 선택적 속성에 기본값 지정**

```typescript
type User = {
  name: string;
  age?: number;
};

const user: User = {
  name: "Alice",
};

const age = user.age ?? 18;

console.log(age); // 18
```

`age`는 선택적 속성이므로 존재하지 않을 수 있다.

이때 `??`를 사용하면 값이 없는 경우에만 기본값을 지정할 수 있다.

<br>

### **??와 ||의 차이**

JavaScript에서는 `||` 연산자도 기본값을 설정할 때 많이 사용한다.

하지만 두 연산자는 동작 방식에 차이가 있다.

- `??`: `null`, `undefined`일 때만 오른쪽 값을 사용
- `||`: 왼쪽 값이 falsy일 때 오른쪽 값을 사용

JavaScript의 falsy 값에는 `false`, `0`, `""`, `null`, `undefined`, `NaN` 등이 있다.

```typescript
console.log(0 || 18); // 18
console.log(0 ?? 18); // 0

console.log(false || true); // true
console.log(false ?? true); // false

console.log("" || "기본값"); // "기본값"
console.log("" ?? "기본값"); // ""
```

여기서 중요한 점은 `0`, `false`, `""`도 정상적인 데이터일 수 있다는 것이다.

예를 들어 사용자의 나이가 `0`이라고 해서 값이 없는 것은 아니다.

```typescript
const age = 0;

console.log(age || 18); // 18
console.log(age ?? 18); // 0
```

따라서 **값이 존재하지 않을 때만 기본값을 설정하려면 `??`를 사용하는 것이 더 적절하다.**

<br><br>

## **✅ 5. 함수에서 객체 업데이트하기**

객체를 다루다 보면 기존 객체의 일부 속성을 수정해야 하는 경우가 많다.

이때 알아두면 좋은 원칙이 있다.

**함수의 매개변수로 받은 객체를 직접 수정하기보다는 새로운 객체를 만들어 반환하는 것이다.**

<br>

### **객체를 직접 수정하는 경우**

<br>

```typescript
type User = {
  name: string;
  age?: number;
};

function updateUser(user: User): User {
  user.age = user.age ?? 18;

  return user;
}

const originalUser: User = {
  name: "Alice",
};

const updatedUser = updateUser(originalUser);

console.log(originalUser);
// { name: "Alice", age: 18 }
```

<br>

이 코드는 정상적으로 동작한다.

하지만 `updateUser` 함수에서 전달받은 객체를 직접 수정했기 때문에 원본 객체도 변경된다.

JavaScript에서 객체는 참조 타입이기 때문이다.

함수 내부에서 객체의 속성을 변경하면 함수 외부에서 사용하던 원본 데이터에도 영향을 줄 수 있다.

<br>

### **Spread 문법을 이용한 객체 복사**

이러한 문제를 방지하기 위해 스프레드 문법(`...`)을 사용할 수 있다.
<br>

```typescript
type User = {
  name: string;
  age?: number;
};

function updateUser(user: User): User {
  return {
    ...user,
    age: user.age ?? 18,
  };
}

const originalUser: User = {
  name: "Alice",
};

const updatedUser = updateUser(originalUser);

console.log(originalUser);
// { name: "Alice" }

console.log(updatedUser);
// { name: "Alice", age: 18 }
```

<br>

`...user`는 기존 객체의 속성을 새로운 객체에 복사한다.

이후 `age` 속성에 기본값을 설정한다.

이렇게 하면 원본 객체는 그대로 유지하면서 필요한 속성만 변경한 새로운 객체를 반환할 수 있다.

<br>

### **Spread 문법의 동작 원리**

<br>

```typescript
const user = {
  name: "Alice",
  age: 25,
};

const updatedUser = {
  ...user,
  age: 30,
};
```

<br>

위 코드는 다음과 같이 이해할 수 있다.

1. 새로운 객체를 생성한다.
2. 기존 `user`의 속성들을 복사한다.
3. `age` 속성을 `30`으로 덮어쓴다.

결과적으로 다음과 같은 객체가 생성된다.

<br>

```typescript
console.log(user);
// { name: "Alice", age: 25 }

console.log(updatedUser);
// { name: "Alice", age: 30 }
```

<br>

### **주의: Spread 문법은 얕은 복사(Shallow Copy)**

스프레드 문법을 사용했다고 해서 객체 내부의 모든 데이터가 완전히 복사되는 것은 아니다.

중첩된 객체는 기존 객체와 참조를 공유한다.
<br>

```typescript
const user = {
  name: "Alice",
  address: {
    city: "Seoul",
  },
};

const copiedUser = {
  ...user,
};

copiedUser.address.city = "Tokyo";

console.log(user.address.city); // "Tokyo"
```

<br>

`copiedUser`는 새로운 객체지만, 내부의 `address` 객체는 원본과 동일한 객체를 참조하고 있다.

따라서 중첩 객체를 수정해야 할 때는 해당 객체도 별도로 복사해야 한다.
<br>

```typescript
const updatedUser = {
  ...user,
  address: {
    ...user.address,
    city: "Osaka",
  },
};
```

<br>

이처럼 객체를 복사할 때는 얕은 복사와 깊은 복사의 차이를 이해할 필요가 있다.

<br>

## **✅ 6. 오늘 배운 내용 정리**

이번에는 TypeScript에서 원시 타입 다음으로 자주 사용하는 객체, 배열, 튜플 타입에 대해 공부했다.

| 개념                      | 핵심 내용                                  |
| ------------------------- | ------------------------------------------ |
| 객체(Object)              | 속성 이름과 타입을 지정하여 데이터 관리    |
| 배열(Array)               | 같은 타입 또는 허용된 타입의 여러 값 관리  |
| 튜플(Tuple)               | 위치별 타입과 순서가 정해진 배열           |
| Optional Property (`?`)   | 객체의 속성이 없을 수도 있음을 표현        |
| Nullish Coalescing (`??`) | null 또는 undefined일 때만 기본값 지정     |
| Spread (`...`)            | 기존 객체의 속성을 복사해 새로운 객체 생성 |
| Shallow Copy              | 중첩된 객체의 참조는 공유될 수 있음        |

<br>

특히 이번에는 튜플과 객체의 차이에 대해 생각해 볼 수 있었다.

튜플은 구조가 단순하고 순서가 중요한 데이터를 표현할 때 유용하지만, 객체는 속성 이름으로 데이터의 의미를 명확하게 전달할 수 있다는 장점이 있다.

또한 `??` 연산자가 `||`와 달리 `0`, `false`, `""`를 정상적인 값으로 취급한다는 점도 기억해 두어야겠다.

마지막으로 객체를 업데이트할 때 기존 데이터를 직접 수정하지 않고 스프레드 문법을 통해 새로운 객체를 반환하는 방식도 중요하게 느껴졌다.

React에서도 상태를 업데이트할 때 불변성을 유지하는 것이 중요하다고 배웠는데, 이번 내용을 통해 그 원칙을 다시 한번 정리할 수 있었다.

<br>

끝-!
