# 백엔드 프록시 설정 가이드

## 개요

이 문서는 Claude API를 안전하게 사용하기 위한 백엔드 프록시 서버 설정 방법을 설명합니다.

### 보안 아키텍처

```
브라우저 클라이언트
    ↓ (prompt만 전송)
Express 백엔드 서버 (포트 3001)
    ↓ (API 키는 서버에서만 사용)
Claude API (api.anthropic.com)
```

**장점**:
- ✅ API 키가 브라우저에 노출되지 않음
- ✅ CORS 문제 없음
- ✅ API 요청 로깅 가능
- ✅ 프로덕션 배포 시 보안 강화

---

## 필수 요구사항

- Node.js 16+ (npm 포함)
- Anthropic API 키 ([console.anthropic.com](https://console.anthropic.com/account/keys)에서 발급)
- Windows PowerShell 또는 터미널

---

## 빠른 시작

### 1단계: 프로젝트 설정

```powershell
# 프로젝트 디렉토리로 이동
cd "C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축"

# .env 파일 생성
Copy-Item .env.example .env
```

### 2단계: API 키 설정

**.env 파일 편집**:
```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
PORT=3001
NODE_ENV=development
```

**API 키 발급 방법**:
1. https://console.anthropic.com/account/keys 방문
2. "Create Key" 클릭
3. API 키 복사
4. .env 파일의 `sk-ant-your-actual-api-key-here` 부분 교체

### 3단계: 백엔드 서버 시작

**옵션 A: PowerShell 스크립트 (권장)**
```powershell
.\start-dev.ps1
```

**옵션 B: 수동 시작**
```powershell
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치 (처음 한 번만)
npm install

# 서버 시작
npm start
```

**성공 메시지**:
```
═══════════════════════════════════════════
🚀 Backend Proxy Server Started
═══════════════════════════════════════════
📌 Server running on http://localhost:3001
📝 Health check: http://localhost:3001/health
🤖 Claude proxy: POST http://localhost:3001/api/claude
═══════════════════════════════════════════
```

### 4단계: 클라이언트 실행

1. 웹 브라우저에서 열기:
   ```
   file:///C:/Users/Admin/Desktop/개인%20투자%20리서치%20시스템%20구축/investment-system.html
   ```
   또는
   ```
   http://localhost:3001/investment-system.html
   ```

2. "🔥 트렌드" 탭에서 "🔄 데이터 업데이트" 버튼 클릭

---

## API 엔드포인트

### Health Check
```http
GET http://localhost:3001/health

응답:
{
  "status": "ok",
  "timestamp": "2026-06-12T10:30:45.123Z"
}
```

### Claude API Proxy
```http
POST http://localhost:3001/api/claude
Content-Type: application/json

요청:
{
  "prompt": "당신의 프롬프트",
  "model": "claude-opus-4-8",
  "max_tokens": 2048
}

응답 (성공):
{
  "status": "success",
  "text": "Claude의 응답 텍스트",
  "model": "claude-opus-4-8",
  "usage": {
    "input_tokens": 100,
    "output_tokens": 50
  }
}

응답 (오류):
{
  "status": "error",
  "error": "오류 메시지"
}
```

---

## 문제 해결

### 문제 1: "Cannot find module 'express'"
**해결책**:
```powershell
cd backend
npm install
cd ..
```

### 문제 2: "ANTHROPIC_API_KEY not set"
**해결책**:
1. .env 파일이 존재하는지 확인
2. `ANTHROPIC_API_KEY=sk-ant-...` 형식인지 확인
3. 터미널을 재시작하고 다시 시도

### 문제 3: "Port 3001 is already in use"
**해결책**:
```powershell
# 포트 3001을 사용 중인 프로세스 찾기
netstat -ano | Select-String "3001"

# 또는 다른 포트 사용 (예: 3002)
$env:PORT = 3002
npm start
```

### 문제 4: CORS 오류
**증상**: "Access to XMLHttpRequest blocked by CORS policy"

**해결책**:
- 클라이언트가 `http://localhost:3001`에서 로드되는지 확인
- 또는 `backend/server.js`의 CORS 설정 확인

---

## 프로덕션 배포

### 1. 환경 변수 설정

배포 환경 (AWS, Heroku 등)에서:
```bash
ANTHROPIC_API_KEY=sk-ant-your-production-key
PORT=80 또는 8080
NODE_ENV=production
```

### 2. CORS 설정 업데이트

`backend/server.js`의 CORS origin 수정:
```javascript
app.use(cors({
    origin: ['https://your-domain.com', 'https://www.your-domain.com'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
```

### 3. 클라이언트 API_PROXY_URL 설정

`investment-system.html`의 API_PROXY_URL 수정:
```javascript
const API_PROXY_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://localhost:3001`
    : 'https://your-api-domain.com';  // 프로덕션 백엔드 URL
```

### 4. 배포 예시 (Heroku)

```bash
# Heroku CLI 설치
npm install -g heroku

# Heroku 앱 생성
heroku create your-app-name

# 환경 변수 설정
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key

# 배포
git push heroku main

# 서버 로그 확인
heroku logs --tail
```

---

## 개발 팁

### Hot Reload 활성화

파일 변경 시 자동 재시작:
```powershell
cd backend
npm install --save-dev nodemon
```

`package.json` 수정:
```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

실행:
```powershell
npm run dev
```

### 로깅 및 디버깅

환경 변수 추가:
```bash
NODE_ENV=development
DEBUG=true
```

`backend/server.js`에서 요청/응답 로깅 확인:
```
[2026-06-12T10:30:45.123Z] POST /api/claude
📤 Calling Claude API (model: claude-opus-4-8)
📝 Prompt length: 245 characters
✅ Claude API response received (1234 chars)
```

---

## 보안 체크리스트

- [ ] API 키가 .env 파일에만 저장됨
- [ ] .env 파일이 .gitignore에 추가됨
- [ ] 프로덕션에서 NODE_ENV=production 설정
- [ ] CORS origin이 허용된 도메인만 포함
- [ ] API 요청/응답이 로깅되고 모니터링됨
- [ ] 타임아웃 설정 (기본값: 30초)
- [ ] Rate limiting 구현 (필요시)

---

## 다음 단계

1. ✅ Issue #2 완료: API 키 보안 정책
2. 🔄 Issue #3: Claude API 실제 연동
   - `callClaudeAPI()` 백엔드 프록시 호출 확인
   - 트렌드 데이터 Mock → 실제 API로 변경
3. 🔄 Issue #1: XSS 취약점 해결
4. 🔄 Issue #4: 모바일 반응형 설계
5. 🔄 Issue #5: CSS 리팩토링
6. 🔄 Issue #6: 중복 클릭 방지

---

**문제 해결**: wireqm@dsr.com으로 문의하세요.
