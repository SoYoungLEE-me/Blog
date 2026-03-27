---
title: Zustand 개념 및 기본 사용법
date: 2025-11-12
tags:
  - React
  - Zustand
  - 상태관리
---

## Zustand란?

React를 위한 경량 전역 상태관리 라이브러리다.
Redux처럼 전역 상태를 관리하지만, 보일러플레이트 없이 훨씬 간결하게 사용할 수 있다.

<br>

## ✅ 1. 기존 방식과의 비교

| 구분               | Redux                                   | Zustand                       |
| ------------------ | --------------------------------------- | ----------------------------- |
| 설정 복잡도        | 높음 (store, action, reducer 모두 필요) | 낮음 (store 하나로 끝)        |
| 보일러플레이트     | 많음                                    | 거의 없음                     |
| Provider 필요 여부 | 필요 (`<Provider store={store}>`)       | 불필요                        |
| 번들 크기          | 큼                                      | 매우 작음 (~1kb)              |
| 사용 목적          | 대규모 앱, 복잡한 상태                  | 중소규모 앱, 간단한 전역 상태 |

> Zustand는 전역 UI 상태(모달 열림 여부, 로그인 유저 정보 등) 관리에 적합하다.
> 서버 데이터 관리는 TanStack Query와 함께 사용하는 것이 일반적이다.

<br>

## ✅ 2. 기본 세팅

별도의 Provider 설정 없이 바로 store를 만들어 사용한다.

```javascript
// store/useCounterStore.js
import { create } from "zustand";

const useCounterStore = create((set) => ({
  // 상태 (state)
  count: 0,

  // 액션 (state를 변경하는 함수)
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

<br>

## ✅ 3. 상태 읽기 / 쓰기

store를 훅처럼 불러와서 상태와 액션을 가져온다.

```javascript
// components/Counter.jsx
import useCounterStore from "../store/useCounterStore";

const Counter = () => {
  // 필요한 상태/액션만 선택적으로 가져옴
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>초기화</button>
    </div>
  );
};
```

<br>

> 상태를 통째로 가져오면 불필요한 리렌더링이 발생할 수 있다.
>
> ```javascript
> // store 전체를 가져오면 어떤 상태가 바뀌어도 리렌더링됨
> const store = useCounterStore();
>
> // 필요한 값만 선택적으로 가져오기 (리렌더링 최소화)
> const count = useCounterStore((state) => state.count);
> ```

<br>

## ✅ 4. 예시 — 로그인 유저 정보 관리

```javascript
// store/useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  login: (userData) => set({ user: userData, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
```

```javascript
// 로그인 처리
import useAuthStore from "../store/useAuthStore";

const LoginButton = () => {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    const response = await axios.post("/api/auth/login", { email, password });
    login(response.data.user); // 전역 상태에 유저 정보 저장
  };

  return <button onClick={handleLogin}>로그인</button>;
};

// 다른 컴포넌트에서 유저 정보 읽기
const Header = () => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header>
      {isLoggedIn ? (
        <>
          <span>{user.name}님 안녕하세요</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <span>로그인이 필요합니다</span>
      )}
    </header>
  );
};
```

---

<br>

**핵심 요약:**

- `create()` → store 생성 (state + 액션을 한 곳에)
- `useXxxStore((state) => state.xxx)` → 필요한 값만 선택적으로 구독
- Provider 불필요, 보일러플레이트 최소화
- 서버 데이터는 TanStack Query, 전역 UI 상태는 Zustand로 역할 분리
