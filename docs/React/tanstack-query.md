---
title: TanStack Query (React Query)
date: 2025-11-10
tags:
  - React
  - TanStack Query
  - React Query
  - 비동기
---

## TanStack Query란?

서버 상태(Server State)를 관리하기 위한 라이브러리다.
기존에 `useEffect` + `useState`로 처리하던 데이터 패칭, 로딩/에러 상태 관리를 훨씬 간결하게 처리할 수 있다.

<br>

## ✅ 1. 기존 방식과의 비교

### 기존 방식 (useEffect + useState)

Redux 혹은 직접 구현 시, 아래 항목들을 **모두 수동으로** 처리해야 했다.

```javascript
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setIsLoading(true);
  fetch("/api/posts")
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      setIsLoading(false);
    })
    .catch((err) => {
      setError(err);
      setIsLoading(false);
    });
}, []);
```

### TanStack Query 방식

아래 기능들을 **자동으로** 처리해준다.

| 기능             | 기존 방식              | TanStack Query                    |
| ---------------- | ---------------------- | --------------------------------- |
| 로딩 상태        | `useState`로 직접 관리 | `isLoading` 자동 제공             |
| 에러 처리        | `try/catch` 직접 작성  | `isError`, `error` 자동 제공      |
| 캐싱             | 별도 구현 필요         | `queryKey` 기반 자동 캐싱         |
| 재요청           | 직접 트리거            | `invalidateQueries`로 간단히 처리 |
| 중복 요청 방지   | 직접 구현 필요         | 동일 `queryKey` 요청 자동 병합    |
| 포커스 시 재요청 | 직접 구현 필요         | `refetchOnWindowFocus` 기본 지원  |

<br>

## ✅ 2. 기본 세팅

```javascript
// main.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

<br>

## ✅ 3. useQuery — 데이터 조회

서버에서 데이터를 **가져올 때(GET)** 사용한다.

```javascript
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPosts = async () => {
  const response = await axios.get("/api/posts");
  return response.data;
};

const PostList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"], // 캐시 키. 동일한 키면 캐시된 데이터를 재사용
    queryFn: fetchPosts, // 실제 데이터 패칭 함수
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (재요청 방지)
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러: {error.message}</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

> `queryKey` 배열에 변수를 추가하면, 해당 값이 변경될 때 자동으로 재요청한다.
>
> ```javascript
> queryKey: ["posts", userId]; // userId가 바뀌면 자동 refetch
> queryKey: ["posts", { category, page }]; // 여러 조건도 객체로 묶을 수 있음
> ```

<br>

## ✅ 4. useMutation — 데이터 변경

서버의 데이터를 **생성/수정/삭제(POST, PUT, DELETE)** 할 때 사용한다.

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createPost = async (newPost) => {
  const response = await axios.post("/api/posts", newPost);
  return response.data;
};

const CreatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 성공 시 posts 캐시를 무효화 → 자동으로 최신 데이터 재요청
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("생성 실패:", error.message);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title: "새 게시글", content: "내용" });
  };

  return (
    <button onClick={handleSubmit} disabled={mutation.isPending}>
      {mutation.isPending ? "작성 중..." : "게시글 작성"}
    </button>
  );
};
```

<br>

## ✅ 5. 페이지네이션 — useQuery

`queryKey`에 `page`를 포함시켜, 페이지가 바뀔 때마다 자동으로 재요청한다.

```javascript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPosts = async (page) => {
  const response = await axios.get(`/api/posts?page=${page}&limit=10`);
  return response.data;
};

const PaginatedPosts = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    placeholderData: (prev) => prev, // 페이지 전환 시 이전 데이터를 유지해 깜빡임 방지
  });

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div>
      <ul>
        {data.posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        이전
      </button>
      <span>{page} 페이지</span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={isPlaceholderData || !data.hasNextPage}
      >
        다음
      </button>
    </div>
  );
};
```

<br>

## ✅ 6. 무한 스크롤 — useInfiniteQuery

스크롤이 끝에 닿을 때마다 다음 페이지를 이어서 불러온다.

```javascript
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import axios from "axios";

const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await axios.get(`/api/posts?page=${pageParam}&limit=10`);
  return response.data; // { posts: [...], nextPage: 2, hasNextPage: true }
};

const InfinitePostList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["posts", "infinite"],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
      initialPageParam: 1,
    });

  // IntersectionObserver로 마지막 요소 감지
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <ul>
      {data.pages.map((page, pageIdx) =>
        page.posts.map((post, postIdx) => {
          const isLast =
            pageIdx === data.pages.length - 1 &&
            postIdx === page.posts.length - 1;
          return (
            <li key={post.id} ref={isLast ? lastPostRef : null}>
              {post.title}
            </li>
          );
        })
      )}
      {isFetchingNextPage && <p>더 불러오는 중...</p>}
    </ul>
  );
};
```

---

<br>

**핵심 요약:**

- `useQuery` → 데이터 조회, 캐싱, 자동 재요청
- `useMutation` → 데이터 변경 후 `invalidateQueries`로 캐시 갱신
- `useQuery` + `page` state → 페이지네이션
- `useInfiniteQuery` → 무한 스크롤
