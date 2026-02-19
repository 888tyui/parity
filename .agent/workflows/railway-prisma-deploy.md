---
description: Railway + Prisma + PostgreSQL 배포 시 주의사항 & 체크리스트
---

# Railway + Prisma + PostgreSQL 배포 가이드

## 🚨 핵심 규칙

### 1. Build vs Runtime — DB 접근 분리
Railway 빌드 컨테이너에서는 **내부 DB에 접근 불가** (`postgres.railway.internal`은 런타임에서만 resolve됨).

```json
{
  "build": "prisma generate && next build",
  "start": "prisma db push --skip-generate && next start"
}
```

- `prisma generate` → 빌드 시 (DB 연결 불필요, 코드 생성만)
- `prisma db push` → 런타임 시 (DB 연결 필요)

> ⚠️ `prisma db push`를 build에 넣으면 **P1001: Can't reach database server** 에러 발생

### 2. 스키마 변경은 Additive로
이미 라이브 중인 DB에서:
- 새 테이블 추가 → ✅ 안전 (`prisma db push`가 CREATE)
- 기존 컬럼 삭제/이름 변경 → ❌ 데이터 손실 위험
- 타입 변경 → ⚠️ 호환되는 경우만 안전

### 3. SQLite ↔ PostgreSQL 차이
| | SQLite | PostgreSQL |
|---|---|---|
| JSON 필드 | `String` + `JSON.parse/stringify` | 네이티브 `Json` (Prisma 자동 직렬화) |
| Auto-increment | `@default(autoincrement())` | 동일 |
| 배포 환경 | 로컬 dev만 | Railway / Vercel / 프로덕션 |
| 파일 경로 | `file:./prisma/dev.db` | `postgresql://...` |

### 4. 환경변수 체크리스트
Railway에서 반드시 설정:
- `DATABASE_URL` — PostgreSQL 플러그인 추가 시 자동 생성
- `ANTHROPIC_API_KEY` — 수동 설정 필요
- 기타 `NEXT_PUBLIC_*` 변수들 — Railway Variables 탭에서 설정

### 5. Prisma Client 생성 위치
```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"  // Next.js app 디렉토리 내부
}
```
- `output` 경로가 `.gitignore`에 포함되지 않도록 주의
- Railway 빌드에서 `prisma generate`가 이 경로에 생성

### 6. `prisma.config.ts`에서 dotenv
```ts
import "dotenv/config";  // .env 파일 로드
```
- Railway에서는 환경변수가 시스템에 직접 주입되므로 dotenv 없어도 동작
- 로컬 dev에서는 `.env` 파일 필요

### 7. 긴 요청 타임아웃
- `export const maxDuration = 120` → Vercel 전용 (Railway에서는 무시됨)
- Railway는 별도 타임아웃 설정 없으면 기본 무제한
- Verepo 같은 긴 분석 작업은 Railway에서 문제 없음

## 디플로이 전 체크리스트

```
[ ] prisma generate가 build 스크립트에 있는가?
[ ] prisma db push가 start 스크립트에 있는가? (build 아님!)
[ ] schema.prisma의 provider가 "postgresql"인가?
[ ] DATABASE_URL이 Railway Variables에 설정되어 있는가?
[ ] 새 환경변수(예: ANTHROPIC_API_KEY)가 추가되었는가?
[ ] Json 필드를 쓸 때 JSON.parse/stringify 안 쓰는가? (PostgreSQL 네이티브)
[ ] .env에 민감 정보가 없고 .gitignore에 포함되어 있는가?
```
