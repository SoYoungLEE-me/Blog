---
title: TypeScript API Request/Response 타입 정의
date: 2026-04-06
tags:
  - TypeScript
  - API
  - Axios
  - Request
  - Response
---

## 왜 API 타입 정의가 중요한가?

TypeScript를 쓰면서 타입 정의를 가장 많이 하게 되는 곳이 바로 API 통신 부분이다.
API 요청과 응답에 타입을 제대로 정의해두면:

- 응답 데이터의 구조를 코드만 봐도 바로 알 수 있다
- 없는 속성에 접근하거나 잘못된 타입을 사용하면 즉시 에러가 난다
- 자동완성이 되어 개발 속도가 빨라진다

반대로 타입 정의 없이 `any`로 처리하면 TypeScript를 쓰는 의미가 없어진다.

<br>
<br>

## ✅ 1. 기본 응답 구조 타입 정의

대부분의 API는 응답 구조가 일정한 패턴을 따른다.
공통 응답 타입을 제네릭으로 만들어두면 재사용하기 편하다.

```typescript
// 공통 API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// 페이지네이션이 포함된 응답 타입
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
```

제네릭 `T` 자리에 실제 데이터 타입을 넣어서 사용한다.

```typescript
// 유저 타입
interface User {
  id: number;
  name: string;
  email: string;
}

// 사용 예시
type UserResponse = ApiResponse<User>; // 단건
type UserListResponse = PaginatedResponse<User>; // 목록
```

<br>
<br>

## ✅ 2. Request 타입 정의

API 요청 시 보내는 데이터(body, query, params)에도 타입을 정의한다.

```typescript
// 로그인 요청
interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청
interface SignupRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// 유저 정보 수정 요청 — 일부 필드만 보낼 수 있음
interface UpdateUserRequest {
  name?: string;
  email?: string;
  profileImage?: string;
}
```

<br>
<br>

## ✅ 3. Axios와 함께 타입 적용하기

Axios는 제네릭을 지원하기 때문에 응답 타입을 직접 지정할 수 있다.

```typescript
import axios from "axios";

// GET 요청 — 유저 단건 조회
const getUser = async (id: number): Promise<User> => {
  const response = await axios.get<ApiResponse<User>>(`/api/users/${id}`);
  return response.data.data;
};

// GET 요청 — 유저 목록 조회
const getUsers = async (page: number): Promise<PaginatedResponse<User>> => {
  const response = await axios.get<PaginatedResponse<User>>("/api/users", {
    params: { page, limit: 10 },
  });
  return response.data;
};

// POST 요청 — 로그인
const login = async (
  body: LoginRequest
): Promise<ApiResponse<{ token: string }>> => {
  const response = await axios.post<ApiResponse<{ token: string }>>(
    "/api/auth/login",
    body
  );
  return response.data;
};

// PUT 요청 — 유저 정보 수정
const updateUser = async (
  id: number,
  body: UpdateUserRequest
): Promise<ApiResponse<User>> => {
  const response = await axios.put<ApiResponse<User>>(`/api/users/${id}`, body);
  return response.data;
};

// DELETE 요청
const deleteUser = async (id: number): Promise<ApiResponse<null>> => {
  const response = await axios.delete<ApiResponse<null>>(`/api/users/${id}`);
  return response.data;
};
```

<br>
<br>

## ✅ 4. 에러 응답 타입 정의

API 요청이 실패했을 때의 응답 구조도 타입으로 정의해두면
에러 처리를 안전하게 할 수 있다.

```typescript
// 에러 응답 타입
interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}

// Axios 에러 처리
const fetchUser = async (id: number): Promise<User | null> => {
  try {
    const response = await axios.get<ApiResponse<User>>(`/api/users/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 에러일 때 응답 데이터에 접근
      const apiError = error.response?.data as ApiError;
      console.error(apiError.message);
    }
    return null;
  }
};
```

<br>
<br>

## ✅ 5. API 함수 파일 구조 예시

실무에서는 API 함수와 타입을 파일로 분리해서 관리하는 경우가 많다.

```
src/
├── types/
│   └── user.ts       ← 타입 정의
└── api/
    └── userApi.ts    ← API 함수
```

```typescript
// types/user.ts — 타입만 모아두는 파일
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

```typescript
// api/userApi.ts — API 함수만 모아두는 파일
import axios from "axios";
import type {
  User,
  LoginRequest,
  UpdateUserRequest,
  ApiResponse,
} from "../types/user";

export const userApi = {
  getUser: async (id: number): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>(`/api/users/${id}`);
    return response.data.data;
  },

  login: async (body: LoginRequest): Promise<{ token: string }> => {
    const response = await axios.post<ApiResponse<{ token: string }>>(
      "/api/auth/login",
      body
    );
    return response.data.data;
  },

  updateUser: async (id: number, body: UpdateUserRequest): Promise<User> => {
    const response = await axios.put<ApiResponse<User>>(
      `/api/users/${id}`,
      body
    );
    return response.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`/api/users/${id}`);
  },
};
```

<br>
<br>

## ✅ 6. TanStack Query와 함께 사용하기

TanStack Query를 사용할 때도 타입을 지정하면 `data`의 타입이 자동으로 추론된다.

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { UpdateUserRequest } from "../types/user";

// useQuery — data의 타입이 User로 자동 추론됨
const UserProfile = ({ id }: { id: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUser(id),
  });

  if (isLoading) return <p>로딩 중...</p>;

  return <p>{data?.name}</p>; // data는 User 타입으로 자동완성됨
};

// useMutation — 요청 body 타입도 자동 추론됨
const EditUser = ({ id }: { id: number }) => {
  const mutation = useMutation({
    mutationFn: (body: UpdateUserRequest) => userApi.updateUser(id, body),
  });

  return (
    <button onClick={() => mutation.mutate({ name: "새 이름" })}>수정</button>
  );
};
```

---

<br>

**핵심 요약:**

- **공통 응답 타입** → `ApiResponse<T>` 제네릭으로 만들어 재사용
- **Request 타입** → 요청 body에도 타입을 정의해서 잘못된 데이터 전송을 방지
- **Axios 제네릭** → `axios.get<T>()` 형태로 응답 타입 지정
- **에러 타입** → `axios.isAxiosError()`로 에러를 확인하고 타입 안전하게 처리
- **파일 분리** → `types/`에 타입, `api/`에 함수를 분리해서 관리
- **TanStack Query** → API 함수에 타입이 있으면 `data` 타입이 자동 추론됨
