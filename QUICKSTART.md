# 빠른 시작 가이드

## 5분 안에 시작하기

### 1. 환경 설정 (1분)

```powershell
# .env 파일 생성
Copy-Item .env.example .env

# 텍스트 에디터에서 .env 파일 열기
notepad .env

# ANTHROPIC_API_KEY=sk-ant-your-actual-api-key 입력
# API 키는 https://console.anthropic.com/account/keys 에서 발급받음
```

### 2. 백엔드 서버 시작 (2분)

```powershell
# PowerShell에서 실행 (자동으로 npm install + 서버 시작)
.\start-dev.ps1

# 성공하면 이 메시지 보임:
# 🚀 Backend Proxy Server Started
# 📌 Server running on http://localhost:3001
```

### 3. 클라이언트 열기 (1분)

**옵션 A: 파일로 직접 열기**
```
Windows 탐색기에서: investment-system.html 더블클릭
```

**옵션 B: 브라우저 주소창**
```
http://localhost:3001/investment-system.html
```

### 4. 테스트 (1분)

```powershell
# 새 PowerShell 창 열고 실행
.\test-api-proxy.ps1
```

**성공 메시지**:
```
✅ 모든 테스트 통과!
🎉 백엔드 프록시 서버가 정상 작동합니다!
```

---

## 문제 해결

### Q1: "npm: 명령을 찾을 수 없습니다"
**A**: Node.js를 설치하세요
- 다운로드: https://nodejs.org/ (LTS 버전)
- 설치 후 PowerShell 재시작

### Q2: "ANTHROPIC_API_KEY not set"
**A**: .env 파일 확인
1. `.env` 파일이 존재하는지 확인
2. `ANTHROPIC_API_KEY=sk-ant-...` 형식 확인
3. PowerShell 재시작 후 다시 시도

### Q3: "Cannot find module 'express'"
**A**: 의존성 설치
```powershell
cd backend
npm install
cd ..
```

### Q4: "Port 3001 is already in use"
**A**: 다른 포트 사용
```powershell
$env:PORT = 3002
cd backend
npm start
```

---

## 주요 파일

| 파일 | 설명 |
|------|------|
| `investment-system.html` | 메인 애플리케이션 |
| `backend/server.js` | Express 프록시 서버 |
| `.env` | API 키 설정 (사용자 생성) |
| `BACKEND_SETUP.md` | 상세 설정 가이드 |

---

## 다음 단계

1. ✅ **Issue #2 완료**: API 키 보안
2. 🔄 **Issue #3**: 실제 Claude API 연동
3. 🔄 **Issue #1**: XSS 취약점 해결
4. 🔄 **Issue #4**: 모바일 반응형
5. 🔄 **Issue #5**: CSS 리팩토링
6. 🔄 **Issue #6**: 중복 클릭 방지

자세한 내용: `ISSUES.md` 참고

---

## 명령어 모음

```powershell
# 백엔드 시작 (자동 설정)
.\start-dev.ps1

# 백엔드 테스트
.\test-api-proxy.ps1

# 수동 시작 (상세 제어)
cd backend
npm install    # 처음 한 번만
npm start      # 매번 실행

# 개발 모드 (hot reload)
npm run dev

# 클라이언트 테스트
Open investment-system.html
```

---

**완료 상태**: Issue #2 ✅ 완료 (API 키 보안)  
**작성일**: 2026-06-12
