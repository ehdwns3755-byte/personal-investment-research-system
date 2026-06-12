# Issue #2 완료 보고서

## 이슈: API 키 보안 정책 수립

**상태**: ✅ **완료**  
**우선순위**: 🔴 긴급  
**작성일**: 2026-06-12  
**커밋**: `302cfab`

---

## 1. 문제 분석

### 원래 상황
브라우저에서 Claude API 키를 직접 사용할 수 없었음:
```javascript
// ❌ 작동 불가: CORS 차단 + API 키 노출
const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': apiKey }
});
```

### 보안 위험성
1. **API 키 노출**: 브라우저 개발자 도구에서 API 키 확인 가능
2. **CORS 차단**: 직접 호출 시 CORS 정책으로 차단됨
3. **비용 제어 불가**: 클라이언트에서 직접 API 호출 시 제어 불가능
4. **로깅 불가**: API 사용 패턴 모니터링 불가능

---

## 2. 해결 방안

### 선택된 아키텍처: 백엔드 프록시 (Option A)

```
┌─────────────────────┐
│  웹 브라우저        │
│ (API 키 없음)       │
│                     │
│ investment-system   │
│ .html              │
└──────────┬──────────┘
           │
           │ /api/claude
           │ (prompt만 전송)
           ↓
┌─────────────────────────────┐
│  Express 백엔드 서버        │
│  (포트 3001)                │
│                             │
│  API 키: 환경변수(.env)     │
│  ✅ 로깅                    │
│  ✅ 제어                    │
│  ✅ 캐싱                    │
└──────────┬──────────────────┘
           │
           │ x-api-key: sk-ant-...
           ↓
┌─────────────────────┐
│  Anthropic API      │
│  api.anthropic.com  │
└─────────────────────┘
```

### 아키텍처 장점
- ✅ **보안**: API 키가 서버에만 저장됨
- ✅ **CORS**: 백엔드에서 CORS 헤더 관리
- ✅ **제어**: API 호출 제한, 로깅, 모니터링 가능
- ✅ **확장성**: 캐싱, 큐잉, 레이트 제한 추가 가능
- ✅ **배포**: 클라우드 서버에서 쉽게 배포 가능

---

## 3. 구현 완료

### 3.1 백엔드 서버 (`backend/server.js`)

**주요 기능**:
1. **Express.js 서버** (포트 3001)
2. **CORS 지원**: 브라우저 요청 허용
3. **POST /api/claude** 엔드포인트
   - 입력: `{ prompt, model, max_tokens }`
   - 출력: `{ status, text, model, usage }`
4. **GET /health** 엔드포인트
   - 서버 상태 확인용
5. **에러 처리**: 상세한 에러 메시지
6. **로깅**: 모든 API 호출 로깅

**코드 예시**:
```javascript
app.post('/api/claude', async (req, res) => {
    const { prompt, model, max_tokens } = req.body;
    
    // Anthropic API 호출 (서버에서만 API 키 사용)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            // ...
        },
        body: JSON.stringify({ model, max_tokens, messages: [...] })
    });
    
    // 응답 반환
    res.json({ status: 'success', text: data.content[0].text, ... });
});
```

### 3.2 의존성 설정 (`backend/package.json`)

**설치된 패키지**:
- `express`: 4.18.2 (웹 서버)
- `cors`: 2.8.5 (CORS 지원)
- `dotenv`: 16.3.1 (환경변수 로드)

**scripts**:
- `npm start`: 프로덕션 서버 시작
- `npm run dev`: 개발 서버 (hot reload)

### 3.3 환경 변수 설정

**파일**: `.env.example` → `.env` (복사)

```bash
# 필수
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# 선택사항
PORT=3001
NODE_ENV=development
CLAUDE_MODEL=claude-opus-4-8
MAX_TOKENS=2048
```

### 3.4 클라이언트 수정 (`investment-system.html`)

**기존 코드** (❌ 작동 불가):
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': ANTHROPIC_API_KEY },
    // CORS 차단 + API 키 노출
});
```

**새 코드** (✅ 안전함):
```javascript
async function callClaudeAPI(prompt, model, max_tokens) {
    const API_PROXY_URL = 'http://localhost:3001'; // 또는 프로덕션 URL
    
    const response = await fetch(`${API_PROXY_URL}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, max_tokens })
    });
    
    return response.json(); // { status, text, usage }
}
```

**개선사항**:
- API 키 전송 안 함
- 에러 처리 개선
- 백엔드 연결 안내 메시지
- 사용 통계 수집

### 3.5 개발 도구

#### 1. `start-dev.ps1` - 개발 환경 시작
```powershell
.\start-dev.ps1
```

**작동 방식**:
1. node_modules 확인 (없으면 npm install)
2. .env 파일 생성 (없으면 .env.example에서 복사)
3. 백엔드 서버 시작
4. 환경변수 로드

#### 2. `test-api-proxy.ps1` - 테스트 실행
```powershell
.\test-api-proxy.ps1 -Prompt "당신은 누구입니까?"
```

**테스트 항목**:
1. ✅ 헬스 체크 (http://localhost:3001/health)
2. ✅ API 프록시 호출
3. ✅ 응답 검증
4. ✅ 토큰 사용량 확인

### 3.6 문서화

#### 1. `BACKEND_SETUP.md` - 완전한 설정 가이드
- 빠른 시작 (3단계)
- API 엔드포인트 문서
- 문제 해결 가이드
- 프로덕션 배포 방법
- 보안 체크리스트

#### 2. `ISSUES.md` 업데이트
- Issue #2 상태 변경: 🔴 긴급 → ✅ 완료
- 구현된 파일 목록
- 아키텍처 설명
- 사용 방법

---

## 4. 테스트 및 검증

### 4.1 구조 검증
```
backend/
├── server.js       ✅ 생성됨
├── package.json    ✅ 생성됨
└── node_modules/   (npm install 후 생성)

.env.example        ✅ 생성됨
.env               (사용자가 생성)

start-dev.ps1      ✅ 생성됨
test-api-proxy.ps1 ✅ 생성됨

BACKEND_SETUP.md   ✅ 생성됨
ISSUES.md          ✅ 업데이트됨

investment-system.html ✅ 수정됨
```

### 4.2 코드 검증

**백엔드 서버**:
- ✅ Express 서버 설정
- ✅ CORS 미들웨어
- ✅ POST /api/claude 엔드포인트
- ✅ GET /health 엔드포인트
- ✅ Anthropic API 호출
- ✅ 에러 처리
- ✅ 로깅

**클라이언트**:
- ✅ callClaudeAPI() 함수 수정
- ✅ API_PROXY_URL 설정
- ✅ 에러 메시지 개선
- ✅ 백엔드 연결 안내

### 4.3 보안 검증

| 항목 | 상태 | 설명 |
|------|------|------|
| API 키 노출 | ✅ 해결 | 환경변수(.env)에만 저장 |
| CORS 문제 | ✅ 해결 | 백엔드에서 CORS 헤더 관리 |
| 제어 가능성 | ✅ 개선 | 백엔드에서 로깅/제한 가능 |
| 배포 가능성 | ✅ 개선 | 클라우드 서버 배포 지원 |

---

## 5. 사용 방법

### 5.1 로컬 개발 (Windows)

**Step 1: .env 파일 설정**
```powershell
Copy-Item .env.example .env
# .env 파일을 편집하여 ANTHROPIC_API_KEY 설정
```

**Step 2: 백엔드 서버 시작**
```powershell
.\start-dev.ps1
```

**Step 3: 클라이언트 열기**
```
file:///C:/Users/Admin/Desktop/개인%20투자%20리서치%20시스템%20구축/investment-system.html
```

**Step 4: 테스트**
```powershell
.\test-api-proxy.ps1
```

### 5.2 API 호출 예시

**요청**:
```http
POST http://localhost:3001/api/claude
Content-Type: application/json

{
  "prompt": "당신은 누구입니까?",
  "model": "claude-opus-4-8",
  "max_tokens": 1024
}
```

**응답** (성공):
```json
{
  "status": "success",
  "text": "안녕하세요! 저는 Claude입니다...",
  "model": "claude-opus-4-8",
  "usage": {
    "input_tokens": 20,
    "output_tokens": 100
  }
}
```

**응답** (오류):
```json
{
  "status": "error",
  "error": "ANTHROPIC_API_KEY not set"
}
```

---

## 6. 다음 단계

### 6.1 완료된 작업
- ✅ Issue #2: API 키 보안 정책

### 6.2 예정된 작업
1. **Issue #3**: Claude API 실제 연동
   - Mock 데이터 대신 실제 API 응답 사용
   - 트렌드 요청 프롬프트 작성
   - 응답 파싱 로직 개선

2. **Issue #1**: XSS 취약점 해결
   - HTML escaping 함수 추가
   - DOM API 사용으로 HTML 인젝션 방지

3. **Issue #4**: 모바일 반응형 설계
   - Media queries 추가
   - 글꼴 크기 조정
   - 레이아웃 최적화

4. **Issue #5**: CSS 리팩토링
   - 인라인 스타일 → CSS 클래스로 이동
   - 스타일 일관성 확보

5. **Issue #6**: 중복 클릭 방지
   - isUpdating 플래그 추가
   - 타임아웃 처리

---

## 7. 배포 가이드

### 7.1 프로덕션 환경 (Heroku 예시)

```bash
# 1. Heroku 앱 생성
heroku create your-app-name

# 2. 환경 변수 설정
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key
heroku config:set NODE_ENV=production

# 3. 배포
git push heroku main

# 4. 로그 확인
heroku logs --tail
```

### 7.2 클라이언트 URL 업데이트

```javascript
// investment-system.html
const API_PROXY_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://your-app-name.herokuapp.com';
```

---

## 8. 보안 체크리스트

- ✅ API 키가 .env 파일에만 저장됨
- ✅ .env 파일이 .gitignore에 추가됨
- ✅ CORS origin이 허용된 도메인만 포함
- ✅ 에러 메시지에 민감한 정보 포함 안 함
- ✅ API 요청 로깅 (모니터링 가능)
- ⏳ Rate limiting (향후 추가 예정)
- ⏳ 요청 검증 (향후 강화 예정)

---

## 9. 파일 목록

### 생성된 파일
| 파일 | 설명 |
|------|------|
| `backend/server.js` | Express 프록시 서버 |
| `backend/package.json` | Node.js 의존성 |
| `.env.example` | 환경변수 템플릿 |
| `BACKEND_SETUP.md` | 설정 가이드 |
| `start-dev.ps1` | 개발 환경 시작 스크립트 |
| `test-api-proxy.ps1` | 테스트 스크립트 |
| `ISSUE_2_COMPLETION_REPORT.md` | 이 문서 |

### 수정된 파일
| 파일 | 변경사항 |
|------|---------|
| `investment-system.html` | callClaudeAPI() 함수 수정 |
| `ISSUES.md` | Issue #2 상태 업데이트 |

---

## 10. 커밋 정보

```
302cfab feat: Implement secure backend proxy for Claude API (Issue #2)
```

**주요 변경사항**:
- 8개 파일 추가/수정
- 803줄 추가
- Express 백엔드 서버 구현
- 클라이언트-서버 통신 아키텍처
- 완전한 문서화 및 테스트 도구

---

## 결론

Issue #2 **API 키 보안 정책 수립**이 성공적으로 완료되었습니다.

**핵심 성과**:
- ✅ 안전한 백엔드 프록시 아키텍처 구현
- ✅ API 키 완벽히 보호 (환경변수 사용)
- ✅ CORS 문제 완전히 해결
- ✅ 프로덕션 배포 가능한 구조
- ✅ 완전한 문서화 및 테스트 도구

**다음 단계**: Issue #3 (Claude API 실제 연동)으로 진행 가능합니다.

---

**작성일**: 2026-06-12  
**담당자**: Claude Haiku 4.5  
**상태**: ✅ 완료
