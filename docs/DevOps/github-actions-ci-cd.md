---
title: CI/CD 개념 및 GitHub Actions 정리
date: 2026-03-30
tags:
  - DevOps
  - CI/CD
  - GitHub Actions
  - ESLint
  - Husky
---

## CI/CD란?

개발한 코드를 검사하고 배포하는 과정을 **자동화**하는 방법론이다.

- **CI (Continuous Integration, 지속적 통합)** → 코드를 푸시/PR할 때마다 자동으로 검사
- **CD (Continuous Delivery/Deployment, 지속적 배포)** → 검사를 통과하면 자동으로 배포

<br>

## ✅ 1. 오류를 잡는 단계들

코드를 작성해서 배포되기까지 여러 단계에서 오류를 잡는다.
**앞 단계에서 잡을수록 수정 비용이 적다.**

```
✍️ 코드 작성
    ↓
💻 VSCode ESLint        → 저장할 때마다 실시간 검사
    ↓
📦 git commit
    ↓
🐶 Husky + lint-staged  → 커밋 전 자동 검사 (오류 있으면 커밋 차단)
    ↓
🚀 git push / PR 오픈
    ↓
⚙️ GitHub Actions (CI)  → 공통 환경에서 빌드 + 테스트 자동 실행
    ↓
✅ 통과 → 머지 → 배포 (CD)
❌ 실패 → 머지 차단 → 로컬에서 수정
    ↓
🔍 Sentry               → 배포 후에도 예상치 못한 오류 실시간 감지
```

<br>

각 단계의 역할을 정리하면:

| 단계  | 도구                | 시점         | 역할                                       |
| ----- | ------------------- | ------------ | ------------------------------------------ |
| 1단계 | VSCode ESLint       | 코드 작성 중 | 실시간 문법/스타일 오류 표시               |
| 2단계 | Husky + lint-staged | 커밋 전      | staged 파일 ESLint 검사, 오류 시 커밋 차단 |
| 3단계 | GitHub Actions      | PR / 머지 전 | 빌드, 테스트 자동 실행, 오류 시 머지 차단  |
| 4단계 | Sentry              | 배포 후      | 프로덕션 오류 실시간 감지 및 알림          |

<br>

## ✅ 2. GitHub Actions란?

GitHub에서 제공하는 CI/CD 자동화 도구다.
`.github/workflows/` 폴더 안에 `.yml` 파일을 작성하면,
특정 이벤트(PR 오픈, 머지 등)가 발생할 때 자동으로 설정한 작업들이 실행된다.

```
프로젝트/
└── .github/
    └── workflows/
        └── ci.yml   ← 여기에 자동화할 작업을 정의
```

<br>

## ✅ 3. GitHub Actions 기본 문법

`.yml` 파일의 구조와 각 키워드의 의미를 이해하는 것이 핵심이다.

```yaml
name: CI # 워크플로우 이름 (GitHub Actions 탭에 표시됨)

on: # 언제 실행할지 (트리거)
  push:
    branches: [main] # main 브랜치에 push할 때
  pull_request:
    branches: [main] # main 브랜치로 PR을 열 때

jobs: # 실행할 작업들
  build: # job 이름 (자유롭게 설정)
    runs-on: ubuntu-latest # 어떤 환경에서 실행할지 (가상 머신)

    steps: # 순서대로 실행할 단계들
      - name: 코드 체크아웃 # 스텝 이름
        uses: actions/checkout@v3 # GitHub에서 제공하는 액션 사용

      - name: Node.js 설정
        uses: actions/setup-node@v3
        with:
          node-version: 18 # Node 버전 지정

      - name: 의존성 설치
        run: npm ci # 직접 실행할 명령어

      - name: 빌드
        run: npm run build
```

<br>

### 주요 키워드 정리

| 키워드    | 설명                                 |
| --------- | ------------------------------------ |
| `on`      | 워크플로우를 실행시킬 트리거 이벤트  |
| `jobs`    | 실행할 작업 묶음 (병렬 실행 가능)    |
| `runs-on` | 실행 환경 (ubuntu, windows, macos)   |
| `steps`   | job 안에서 순서대로 실행할 단계들    |
| `uses`    | GitHub에서 만들어둔 액션을 가져다 씀 |
| `run`     | 직접 실행할 쉘 명령어                |
| `with`    | 액션에 전달할 옵션값                 |

<br>

## ✅ 4. 실제 워크플로우 예시 — ESLint + 빌드 + 테스트

PR을 올리면 ESLint 검사 → 빌드 → 테스트가 순서대로 자동 실행되는 워크플로우다.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      # 1. 현재 브랜치 코드를 가상 머신에 체크아웃
      - name: 코드 체크아웃
        uses: actions/checkout@v3

      # 2. Node.js 환경 세팅
      - name: Node.js 설정
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm" # npm 캐시를 재사용해 설치 속도 향상

      # 3. 패키지 설치
      - name: 의존성 설치
        run: npm ci
        # npm install 대신 npm ci를 쓰는 이유:
        # package-lock.json을 기준으로 정확히 설치해 환경을 통일시킴

      # 4. ESLint 검사
      - name: ESLint 검사
        run: npm run lint
        # 오류가 있으면 여기서 실패 → 이후 스텝 실행 안 됨

      # 5. 빌드
      - name: 빌드
        run: npm run build
        # 실제 배포 환경과 동일하게 빌드가 되는지 미리 확인

      # 6. 테스트
      - name: 테스트
        run: npm test
```

<br>

### 실행 결과

PR을 올리면 GitHub에서 아래처럼 각 단계의 결과를 보여준다.

```
✅ 코드 체크아웃       (2s)
✅ Node.js 설정        (3s)
✅ 의존성 설치         (25s)
❌ ESLint 검사         (4s) ← 여기서 실패하면 머지 버튼이 비활성화됨
```

> ESLint 검사에서 실패하면 이후 빌드, 테스트는 실행되지 않는다.
> 오류를 고친 후 다시 푸시하면 워크플로우가 재실행된다.

<br>

## ✅ 5. npm install vs npm ci

CI 환경에서는 `npm install` 대신 `npm ci`를 쓰는 것이 좋다.

| 구분      | npm install                | npm ci                             |
| --------- | -------------------------- | ---------------------------------- |
| 기준      | `package.json`             | `package-lock.json`                |
| 동작      | 버전 범위 내에서 최신 설치 | lock 파일 기준으로 정확히 설치     |
| 속도      | 느림                       | 빠름 (node_modules 삭제 후 재설치) |
| 사용 목적 | 로컬 개발                  | CI 환경 (재현 가능한 환경 보장)    |

> CI에서 `npm install`을 쓰면 팀원마다, 실행할 때마다 설치되는 버전이 미묘하게 달라질 수 있다.
> `npm ci`는 항상 동일한 환경을 보장해서 "내 로컬에서는 됐는데 CI에서 안 돼요" 를 방지한다.

---

<br>

**핵심 요약:**

- **CI** → PR/푸시 시 자동으로 ESLint, 빌드, 테스트를 실행해 오류를 머지 전에 차단
- **CD** → CI 통과 후 자동으로 배포까지 이어지는 흐름
- **GitHub Actions** → `.yml` 파일로 CI/CD 워크플로우를 정의하는 도구
- **오류를 잡는 흐름** → ESLint(실시간) → Husky(커밋 전) → GitHub Actions(머지 전) → Sentry(배포 후)
- **npm ci** → CI 환경에서 `npm install` 대신 사용, 동일한 환경 보장
