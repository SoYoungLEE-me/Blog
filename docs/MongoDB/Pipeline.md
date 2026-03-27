---
title: MongoDB Aggregation Pipeline
date: 2026-03-10
tags:
  - Backend
  - MongoDB
  - Aggregation
  - Pipeline
---

## Aggregation Pipeline이란?

MongoDB에서 데이터를 **단계별로 가공**하여 원하는 결과를 만들어내는 방법이다.

Pipeline이라는 이름은 공장의 컨베이어 벨트에서 따왔다.
컨베이어 벨트 위의 제품이 각 공정을 거치며 완성품이 되듯,
데이터도 각 스테이지(stage)를 순서대로 통과하며 원하는 형태로 가공된다.

```javascript
// Pipeline은 스테이지 객체들의 배열이다
const pipeline = [
  { $match: { ... } },   // 1단계: 필터링
  { $lookup: { ... } },  // 2단계: 조인
  { $sort: { ... } },    // 3단계: 정렬
  { $facet: { ... } },   // 4단계: 페이지네이션
];

await UserWord.aggregate(pipeline);
```

각 스테이지는 **이전 스테이지의 출력을 입력으로 받는다.**
즉, 앞 단계에서 걸러진 데이터만 다음 단계로 넘어간다.

```
[ 전체 문서 1000개 ]
        ↓
  [ $match ]   → 조건 필터링 후 200개만 통과
        ↓
  [ $lookup ]  → 200개에 대해서만 조인 수행
        ↓
  [ $sort ]    → 200개 정렬
        ↓
  [ $facet ]   → 페이지네이션 + 전체 개수 동시 처리
        ↓
  [ 최종 결과 12개 + 총 개수 200 ]
```

> `find()`는 단순 조회만 가능하지만, `aggregate()`는 조인, 그룹핑, 계산 등
> 복잡한 데이터 가공을 **순서대로 제어**할 수 있다는 것이 핵심 차이다.

<br>

## ✅ 왜 Pipeline을 쓰게 된 이유

처음에는 `find()`로 데이터를 가져온 뒤 JS 코드로 필터링/정렬/페이지네이션을 처리했다.
그런데 **필터 + 정렬 + 페이지네이션이 동시에 적용**되어야 하는 상황에서 문제가 생겼다.

| 문제                                 | 원인                                 |
| ------------------------------------ | ------------------------------------ |
| 페이지네이션이 필터 결과와 맞지 않음 | 전체 데이터 기준으로 skip/limit 적용 |
| 정렬 후 필터가 적용되지 않음         | 순서 제어 불가                       |
| 연관 컬렉션 데이터 조합이 어려움     | `find()`는 단일 컬렉션만 조회        |

→ **Pipeline으로 순서를 직접 제어**하면서 이 문제들이 한 번에 해결됐다.

<br>

## ✅ 주요 스테이지 정리

### $match — 필터링

SQL의 `WHERE`절과 같다. 조건에 맞는 문서만 통과시킨다.

```javascript
// 특정 유저의 문서만 필터
{ $match: { user: new mongoose.Types.ObjectId(userId) } }

// 학습 완료 상태만 필터
{ $match: { isDone: true } }

// 텍스트 검색 (대소문자 무시)
{ $match: { "wordDetail.text": { $regex: q, $options: "i" } } }
```

> `$match`는 **파이프라인 초반**에 배치할수록 처리할 데이터 양이 줄어 성능이 좋다.

<br>

### $lookup — 컬렉션 조인

SQL의 `JOIN`과 같다. 다른 컬렉션의 데이터를 가져와 합친다.

```javascript
{
  $lookup: {
    from: "words",         // 조인할 컬렉션명
    localField: "word",    // 현재 컬렉션의 기준 필드
    foreignField: "_id",   // 조인할 컬렉션의 기준 필드
    as: "wordDetail",      // 결과를 담을 필드명 (배열로 들어옴)
  }
}
```

<br>

### $unwind — 배열 펼치기

`$lookup` 결과는 항상 배열로 들어온다. `$unwind`로 배열을 풀어 단일 객체로 만든다.

```javascript
// wordDetail: [{ ... }] → wordDetail: { ... }
{
  $unwind: "$wordDetail";
}
```

<br>

### $sort — 정렬

```javascript
{ $sort: { createdAt: -1 } }           // 최신순
{ $sort: { createdAt: 1 } }            // 오래된 순
{ $sort: { "wordDetail.text": 1 } }    // 알파벳순
```

<br>

### $project — 필드 선택

응답에 포함할 필드만 골라서 반환한다. SQL의 `SELECT`와 같다.

```javascript
{
  $project: {
    _id: 1,
    isDone: 1,
    word: {
      _id: "$wordDetail._id",
      text: "$wordDetail.text",
      meaning: "$wordDetail.meaning",
    }
  }
}
```

> `1`은 포함, `0`은 제외. 명시하지 않은 필드는 기본적으로 제외된다.

<br>

### $facet — 여러 결과 동시 처리

하나의 파이프라인에서 **서로 다른 처리를 동시에** 실행할 수 있다.
페이지네이션에서 **데이터 목록 + 전체 개수**를 한 번의 쿼리로 가져올 때 유용하다.

```javascript
{
  $facet: {
    // 실제 데이터 (페이지네이션 적용)
    data: [
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 1, isDone: 1, "wordDetail.text": 1 } }
    ],
    // 전체 개수
    total: [
      { $count: "count" }
    ]
  }
}

// 결과
// result.data   → 현재 페이지 데이터
// result.total  → [{ count: 42 }]
```

<br>

## ✅ 파이프라인 흐름 예시

필터 + 조인 + 정렬 + 페이지네이션을 한 번에 처리하는 구조다.

```javascript
const pipeline = [
  // 1. 내 데이터만 필터
  { $match: { user: new mongoose.Types.ObjectId(userId) } },

  // 2. 학습 상태 필터
  { $match: { isDone: true } },

  // 3. 단어 상세 정보 조인
  {
    $lookup: {
      from: "words",
      localField: "word",
      foreignField: "_id",
      as: "wordDetail",
    },
  },
  { $unwind: "$wordDetail" },

  // 4. 검색어 필터
  { $match: { "wordDetail.text": { $regex: "apple", $options: "i" } } },

  // 5. 정렬
  { $sort: { createdAt: -1 } },

  // 6. 페이지네이션 + 전체 개수 동시 처리
  {
    $facet: {
      data: [
        { $skip: 0 },
        { $limit: 12 },
        { $project: { _id: 1, isDone: 1, "wordDetail.text": 1 } },
      ],
      total: [{ $count: "count" }],
    },
  },
];

const [result] = await UserWord.aggregate(pipeline);
const totalItems = result.total[0]?.count ?? 0;
```

---

<br>

**핵심 요약:**

- `$match` → 필터 (초반에 배치할수록 성능 좋음)
- `$lookup` + `$unwind` → 다른 컬렉션 조인
- `$sort` → 정렬
- `$project` → 반환할 필드 선택
- `$facet` → 데이터 목록 + 전체 개수를 한 번의 쿼리로 처리
- **Pipeline을 쓰면 필터 → 조인 → 정렬 → 페이지네이션 순서를 직접 제어할 수 있다**
