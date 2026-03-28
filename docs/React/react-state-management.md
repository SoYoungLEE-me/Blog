---
title: React 상태관리 개념 및 라이브러리 비교
date: 2026-03-27
tags:
  - React
  - 상태관리
  - Redux
  - Recoil
  - Zustand
  - Context API
---

## 상태관리가 왜 필요한가?

React에서 상태(state)는 기본적으로 컴포넌트 안에서 관리된다.
그런데 앱이 커질수록 여러 컴포넌트가 같은 상태를 공유해야 하는 상황이 생긴다.

<br>

## ✅ 1. Props Drilling 문제

부모 컴포넌트의 상태를 자식 컴포넌트에 전달하려면 `props`를 사용한다.
그런데 컴포넌트 depth가 깊어질수록 중간 컴포넌트들이 사용하지도 않는 props를
단순히 전달만을 위해 받아야 하는 문제가 생긴다. 이를 **Props Drilling**이라고 한다.

```
App (user 상태 보유)
 └── Layout (user props 전달만 함)
      └── Sidebar (user props 전달만 함)
           └── UserProfile (user를 실제로 사용)
```

```javascript
// Props Drilling — 중간 컴포넌트들이 불필요하게 props를 전달
const App = () => {
  const [user, setUser] = useState({ name: "홍길동" });
  return <Layout user={user} />;
};

const Layout = ({ user }) => <Sidebar user={user} />; // 사용 안 함
const Sidebar = ({ user }) => <UserProfile user={user} />; // 사용 안 함
const UserProfile = ({ user }) => <p>{user.name}</p>; // 실제 사용
```

**문제점:**

- 중간 컴포넌트들이 불필요한 props를 받아야 함
- 상태가 변경되면 중간 컴포넌트들도 모두 리렌더링
- 컴포넌트 depth가 깊어질수록 유지보수가 어려워짐

<br>

## ✅ 2. Context API — React 내장 해결책

React가 기본으로 제공하는 전역 상태 공유 방법이다.
Provider로 감싸진 하위 컴포넌트 어디서든 상태를 직접 꺼내 쓸 수 있다.

```javascript
// Context 생성
const UserContext = createContext(null);

// Provider로 감싸기
const App = () => {
  const [user, setUser] = useState({ name: "홍길동" });
  return (
    <UserContext.Provider value={user}>
      <Layout /> {/* props 전달 없이도 하위에서 꺼내 쓸 수 있음 */}
    </UserContext.Provider>
  );
};

// 어디서든 바로 꺼내 쓰기
const UserProfile = () => {
  const user = useContext(UserContext);
  return <p>{user.name}</p>;
};
```

**한계:**

- 상태가 변경되면 해당 Context를 구독하는 **모든 컴포넌트가 리렌더링**됨
- 전역 상태가 많아지면 Provider를 중첩해서 써야 해서 코드가 복잡해짐
- 복잡한 상태 로직(비동기, 파생 상태 등) 처리가 어려움

```javascript
// Provider 중첩 지옥
<AuthContext.Provider>
  <ThemeContext.Provider>
    <LanguageContext.Provider>
      <App />
    </LanguageContext.Provider>
  </ThemeContext.Provider>
</AuthContext.Provider>
```

→ 이 한계를 극복하기 위해 **외부 상태관리 라이브러리**가 등장했다.

<br>

## ✅ 3. 상태관리 라이브러리 비교

### Redux

가장 오래되고 유명한 상태관리 라이브러리.
**단방향 데이터 흐름**을 강제하여 상태 변화를 예측 가능하게 만든다.

```
Action 발생 → Reducer가 새 상태 생성 → Store 업데이트 → 컴포넌트 리렌더링
```

```javascript
// Redux Toolkit 기준
const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

// 컴포넌트에서 사용
const count = useSelector((state) => state.counter.count);
const dispatch = useDispatch();
dispatch(increment());
```

| 장점                                | 단점                             |
| ----------------------------------- | -------------------------------- |
| 예측 가능한 상태 흐름               | 설정 코드(보일러플레이트)가 많음 |
| Redux DevTools로 디버깅 용이        | 학습 곡선이 높음                 |
| 대규모 팀 프로젝트에 적합           | 작은 프로젝트엔 과한 경우가 많음 |
| 미들웨어(Thunk, Saga)로 비동기 처리 | 코드 구조가 복잡해질 수 있음     |

<br>

### Recoil

Facebook(Meta)이 만든 React 전용 상태관리 라이브러리.
**Atom(상태 단위)** 과 **Selector(파생 상태)** 개념을 기반으로 한다.

```javascript
// Atom — 상태의 최소 단위
const userState = atom({
  key: "userState",
  default: { name: "홍길동" },
});

// Selector — Atom에서 파생된 상태
const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => get(userState).name,
});

// 컴포넌트에서 사용
const user = useRecoilValue(userState);
const setUser = useSetRecoilState(userState);
```

| 장점                                        | 단점                              |
| ------------------------------------------- | --------------------------------- |
| React 친화적 (hooks 기반)                   | 상대적으로 낮은 점유율            |
| Atom 단위로 구독 → 불필요한 리렌더링 최소화 | 메모리 누수 이슈가 보고된 적 있음 |
| 파생 상태(Selector) 처리가 직관적           | Meta의 지원이 줄어드는 추세       |
| 비동기 상태 처리 내장 지원                  | 번들 크기가 Zustand보다 큼        |

<br>

### Zustand / TanStack Query

각각 별도 문서에 정리되어 있으므로 간략히 비교만 하겠다.
개인적으로는 이 조합으로 쓰는걸 좋아한다.

**Zustand** — 전역 클라이언트 상태관리 (로그인 유저 정보, UI 상태 등)
**TanStack Query** — 서버 상태관리 (API 데이터 패칭, 캐싱, 동기화)

이 둘은 **경쟁 관계가 아니라 역할이 다르다.** 함께 쓰는 것이 일반적이다.

<br>

## ✅ 4. 한눈에 비교

| 구분            | Context API | Redux           | Recoil    | Zustand          |
| --------------- | ----------- | --------------- | --------- | ---------------- |
| 제공 주체       | React 내장  | 외부 라이브러리 | Meta      | 외부 라이브러리  |
| 학습 곡선       | 낮음        | 높음            | 중간      | 낮음             |
| 보일러플레이트  | 적음        | 많음            | 중간      | 거의 없음        |
| 리렌더링 최적화 | 없음        | 있음            | 있음      | 있음             |
| 번들 크기       | 0 (내장)    | 중간            | 중간      | 매우 작음 (~1kb) |
| 비동기 처리     | 직접 구현   | 미들웨어 필요   | 내장 지원 | 직접 구현        |
| 적합한 규모     | 소규모      | 대규모          | 중~대규모 | 중소규모         |

<br>

## ✅ 5. 요즘 추세

- **Redux**는 여전히 대규모 레거시 프로젝트에서 많이 쓰이지만,
  신규 프로젝트에서의 채택률은 점점 낮아지고 있다.
- **Recoil**은 Meta의 지원이 줄어들면서 커뮤니티 활성도가 떨어지는 추세다.
- **Zustand**가 가볍고 간결하다는 이유로 빠르게 점유율을 높이고 있다.
- **TanStack Query**의 등장으로 서버 상태는 별도로 관리하는 것이 표준이 되었다.
- 요즘 신규 프로젝트의 가장 흔한 조합:

```
Zustand (전역 클라이언트 상태) + TanStack Query (서버 상태)
```

---

<br>

**핵심 요약:**

- **Props Drilling** → 컴포넌트 depth가 깊어질수록 props 전달이 복잡해지는 문제
- **Context API** → React 내장 해결책이지만 리렌더링 최적화 한계 존재
- **Redux** → 강력하지만 무겁고 복잡, 대규모 프로젝트에 적합
- **Recoil** → React 친화적이지만 점유율 하락 추세
- **요즘 트렌드** → Zustand + TanStack Query 조합
