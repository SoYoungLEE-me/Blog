---
title: ESLint + Husky + lint-staged 설정
date: 2026-03-27
tags:
  - DX
  - ESLint
  - Husky
  - lint-staged
  - Git
---

## 전체 구조

코드 품질을 자동으로 유지하기 위한 세 가지 도구의 조합이다.

| 도구            | 역할                                             |
| --------------- | ------------------------------------------------ |
| **ESLint**      | 코드 문법/스타일 오류를 검사하고 알려줌          |
| **Husky**       | Git 이벤트(커밋, 푸시) 시점에 명령어를 자동 실행 |
| **lint-staged** | 커밋 대상 파일(staged)만 골라서 ESLint 실행      |

```
코드 작성
    ↓
git add (staged 상태)
    ↓
git commit 시도
    ↓
Husky가 pre-commit hook 실행
    ↓
lint-staged가 staged 파일만 추려서 ESLint 실행
    ↓
❌ 오류 있으면 → 커밋 차단, 오류 출력
✅ 오류 없으면 → 커밋 완료
```

<br>

## ✅ 1. ESLint — 코드 검사 도구

JavaScript/React 코드에서 **문법 오류, 잠재적 버그, 스타일 규칙 위반**을 잡아준다.
VSCode에 ESLint 익스텐션을 설치하면 저장할 때마다 실시간으로 오류를 표시해준다.

### 설치

```bash
npm install --save-dev eslint
npx eslint --init  # 설정 파일 자동 생성
```

### 설정 파일 (`eslint.config.js` 또는 `.eslintrc.json`)

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-unused-vars": "warn", // 사용하지 않는 변수 경고
    "no-console": "warn", // console.log 경고
    "react/prop-types": "off" // prop-types 검사 비활성화
  }
}
```

### VSCode 연동

VSCode에 **ESLint 익스텐션**을 설치하고, `settings.json`에 아래를 추가하면
파일 저장 시 자동으로 ESLint 규칙에 맞게 코드를 수정해준다.

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

> 저장할 때마다 자동 수정되므로 코드 스타일을 일관되게 유지할 수 있다.

<br>

## ✅ 2. Husky — Git Hook 실행 도구

Git 이벤트(`commit`, `push` 등) 발생 시 **자동으로 특정 명령어를 실행**시켜주는 도구다.
ESLint 단독으로는 검사를 강제할 수 없지만, Husky와 함께 쓰면
**오류가 있는 코드는 아예 커밋이 안 되도록** 막을 수 있다.

### 설치 및 초기화

```bash
npm install --save-dev husky
npx husky init
```

### pre-commit hook 설정

커밋 직전에 실행할 명령어를 등록한다.

```bash
# .husky/pre-commit
npx lint-staged
```

### pre-push hook 설정 (선택)

푸시 직전에 전체 테스트를 실행하고 싶을 때 사용한다.

```bash
# .husky/pre-push
npm run test
```

> `pre-commit` → 커밋 직전 실행
> `pre-push` → 푸시 직전 실행

<br>

## ✅ 3. lint-staged — 변경 파일만 검사

`git add`로 staged 상태인 파일, 즉 **이번 커밋에 포함될 파일만** 골라서 ESLint를 실행한다.
전체 파일을 검사하면 느리기 때문에 변경된 파일만 검사해 속도를 최적화한다.

### 설치

```bash
npm install --save-dev lint-staged
```

### 설정 (`package.json`)

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix", // 자동 수정 후
      "git add" // 수정된 파일 다시 staged에 추가
    ]
  }
}
```

<br>

## ✅ 4. 전체 동작 흐름 예시

```bash
# 1. 코드 작성 후 스테이징
git add src/App.jsx

# 2. 커밋 시도
git commit -m "feat: 로그인 기능 추가"

# 3. Husky가 pre-commit hook 실행
# → lint-staged 실행
# → staged 파일(App.jsx)만 ESLint 검사

# 오류가 있을 경우
✖ eslint --fix:
  src/App.jsx
    5:10  error  'user' is defined but never used  no-unused-vars
# → 커밋 차단됨

# 오류가 없을 경우
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
# → 커밋 완료
```

---

<br>

**핵심 요약:**

- **ESLint** → 코드 문법/스타일 검사, VSCode 익스텐션으로 실시간 피드백
- **Husky** → 커밋/푸시 시점에 자동으로 명령어 실행
- **lint-staged** → staged 파일만 골라서 ESLint 실행 (속도 최적화)
- 세 가지를 조합하면 **오류가 있는 코드는 커밋 자체가 차단**되어 코드 품질을 강제로 유지할 수 있다.
