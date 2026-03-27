---
title: RESTful API 개념 및 URI 설계 컨벤션 정리
date: 2026-02-17
tags:
  - Backend
  - REST
  - HTTP
  - API
  - URI
---

## RESTful API 개요

REST(Representational State Transfer)는 자원을 URI로 식별하고, HTTP 메서드를 통해 자원에 대한 행위를 표현하는 아키텍처 스타일이다.<br><br>
RESTful API는 아래 원칙을 따른다.

- **Stateless**: 서버는 클라이언트의 상태를 저장하지 않는다. 모든 요청은 독립적이어야 한다.
- **Resource 중심 URI**: 행위가 아닌 자원(명사)으로 URI를 설계한다.
- **HTTP 메서드로 행위 표현**: 자원에 대한 행위는 HTTP 메서드(GET, POST, PUT, DELETE)로 구분한다.
- **Uniform Interface**: 일관된 인터페이스를 유지한다.

<br>

## ✅ 1. HTTP 메서드

| 메서드   | 역할           | 예시                   |
| -------- | -------------- | ---------------------- |
| `GET`    | 자원 조회      | `GET /articles`        |
| `POST`   | 자원 생성      | `POST /articles`       |
| `PUT`    | 자원 전체 수정 | `PUT /articles/:id`    |
| `PATCH`  | 자원 일부 수정 | `PATCH /articles/:id`  |
| `DELETE` | 자원 삭제      | `DELETE /articles/:id` |

<br>

## ✅ 2. 주요 상태코드

| 코드  | 의미                  | 사용 상황                  |
| ----- | --------------------- | -------------------------- |
| `200` | OK                    | 조회, 수정 성공            |
| `201` | Created               | 생성 성공                  |
| `400` | Bad Request           | 잘못된 요청 파라미터       |
| `401` | Unauthorized          | 인증 실패 (토큰 없음/만료) |
| `403` | Forbidden             | 권한 없음                  |
| `404` | Not Found             | 자원 없음                  |
| `500` | Internal Server Error | 서버 오류                  |

<br>

## ✅ 3. URI 설계 규칙 / 컨벤션

### 핵심 규칙

| 규칙                      | 나쁜 예 ❌               | 좋은 예 ✅             | 이유                                   |
| ------------------------- | ------------------------ | ---------------------- | -------------------------------------- |
| 명사(복수형) 사용         | `/getArticle` `/article` | `/articles`            | URI는 자원을 표현, 행위는 메서드로     |
| 소문자만 사용             | `/Articles` `/ARTICLES`  | `/articles`            | 대소문자 혼용 시 혼란 및 오류 유발     |
| 하이픈(`-`)으로 단어 구분 | `/related_articles`      | `/related-articles`    | 언더스코어는 일부 환경에서 가려짐      |
| 언더스코어(`_`) 사용 금지 | `/user_profile`          | `/user-profile`        | 가독성 및 링크 표시 문제               |
| 마지막 슬래시 금지        | `/articles/`             | `/articles`            | 슬래시는 계층을 의미, 끝에 붙이면 혼란 |
| 파일 확장자 금지          | `/articles.json`         | `/articles`            | 확장자는 `Content-Type` 헤더로 표현    |
| 행위를 URI에 포함 금지    | `/deleteArticle/:id`     | `DELETE /articles/:id` | 행위는 HTTP 메서드의 역할              |

<br>

### 계층 구조로 관계 표현

자원 간의 관계(소유, 포함)는 슬래시(`/`)로 계층을 표현한다.

```
# 블로그 서비스 예시

GET    /articles                        # 게시글 전체 조회
GET    /articles/:articleId             # 게시글 단건 조회
POST   /articles                        # 게시글 생성
PUT    /articles/:articleId             # 게시글 수정
DELETE /articles/:articleId             # 게시글 삭제

GET    /articles/:articleId/comments            # 특정 게시글의 댓글 전체 조회
POST   /articles/:articleId/comments            # 특정 게시글에 댓글 생성
DELETE /articles/:articleId/comments/:commentId # 특정 게시글의 댓글 삭제

GET    /users/:userId/profile           # 특정 유저의 프로필 조회
GET    /users/:userId/articles          # 특정 유저가 작성한 게시글 조회
```

<br>

### 필터링 / 정렬 / 페이지네이션은 쿼리스트링으로

자원의 상태를 좁히거나 가공하는 조건은 URI 경로가 아닌 쿼리스트링(`?`)으로 표현한다.

```
# 필터링
GET /articles?category=tech             # 카테고리가 tech인 게시글 조회

# 정렬
GET /articles?sort=createdAt&order=desc # 최신순 정렬

# 페이지네이션
GET /articles?page=2&limit=10           # 2페이지, 10개씩

# 검색
GET /articles?search=REST               # 'REST' 키워드로 검색

# 복합 조건
GET /articles?category=tech&sort=createdAt&page=1&limit=20
```

---

<br>

**핵심 원칙:** URI는 **"무엇을(자원)"** 을 표현하고, **"어떻게(행위)"** 는 HTTP 메서드가 담당한다.
