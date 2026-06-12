# 개인 투자 리서치 시스템 - 이슈 목록

> **상태**: 코드 검토 완료 후 발견된 이슈들  
> **작성일**: 2026-06-12  
> **우선순위**: 6개 이슈 (긴급 3개, 권장 3개)

---

## 🔴 긴급 이슈 (필수 해결)

### Issue #1: XSS 취약점 해결

**심각도**: 높음 (보안)  
**라벨**: `긴급` `보안` `보험취약점`  
**예상 소요시간**: 30분

#### 문제
```javascript
// 현재: HTML 내용을 직접 주입
const cardHTML = `<div class="card">
  <h3>${trend.name}</h3>
  <p>${trend.explanation}</p>  // ⚠️ XSS 취약점
</div>`;
```

#### 해결책
1. `escapeHtml()` 함수 구현
2. `textContent` 대신 사용하여 HTML 인젝션 방지
3. DOM API 활용 (예: `document.createElement` + `appendChild`)

#### 구현 계획
- **Step 1**: escapeHtml 함수 추가
- **Step 2**: renderTrendTab에서 HTML 인젝션 제거
- **Step 3**: renderPortfolioTab, renderLearnTab 수정
- **Step 4**: 단위 테스트 (XSS payload 검증)

---

### ✅ Issue #2: API 키 보안 정책 수립

**심각도**: 높음 (API 키 노출)  
**라벨**: `긴급` `API` `보안`  
**상태**: ✅ 완료

#### 해결 내용
백엔드 프록시 아키텍처 구현:

**구현된 파일**:
- ✅ `backend/server.js` - Express 프록시 서버 (완료)
- ✅ `backend/package.json` - 의존성 설정 (완료)
- ✅ `.env.example` - 환경 변수 템플릿 (완료)
- ✅ `investment-system.html` - 클라이언트 수정 (완료)
- ✅ `BACKEND_SETUP.md` - 설정 가이드 (완료)
- ✅ `start-dev.ps1` - 개발 스크립트 (완료)
- ✅ `test-api-proxy.ps1` - 테스트 스크립트 (완료)

#### 보안 아키텍처
```
브라우저 (API 키 없음)
    ↓ prompt만 전송
Express 백엔드 (포트 3001)
    ↓ API 키로 요청
Claude API
```

#### 주요 기능
1. **API 키 보안**: 환경변수(.env)에 저장, 서버에서만 사용
2. **CORS 처리**: 백엔드에서 CORS 헤더 관리
3. **에러 처리**: 상세한 에러 메시지 반환
4. **로깅**: API 호출 로깅 및 모니터링
5. **환경별 설정**: 개발/프로덕션 환경 분리

#### 사용 방법
```bash
# 1. 의존성 설치
cd backend
npm install

# 2. .env 파일 설정
ANTHROPIC_API_KEY=sk-ant-your-key

# 3. 서버 시작
npm start
```

#### 테스트 결과
- ✅ 헬스 체크 엔드포인트 작동
- ✅ Claude API 프록시 작동
- ✅ CORS 문제 해결
- ✅ 에러 처리 정상

---

### Issue #3: Claude API 실제 연동

**심각도**: 높음 (핵심 기능)  
**라벨**: `필수` `기능` `API`  
**예상 소요시간**: 1시간

#### 현황
현재 정적 mock 데이터만 사용 중:
```javascript
function getMockTrendData() {
  return [
    { name: "AAPL", price: 150, change: 2.5, explanation: "고정 설명" }
    // ... 정적 데이터
  ];
}
```

#### 작업 항목
1. Issue #2 (API 보안) 완료
2. `callClaudeAPI()` 함수 구현
3. 트렌드 요청 프롬프트 작성
4. 응답 파싱 및 UI 업데이트
5. 에러 처리 및 폴백

#### 구현 계획
- **Step 1**: Issue #2 해결 (백엔드 프록시 준비)
- **Step 2**: `renderTrendTab()`에서 mock 대신 API 호출
- **Step 3**: Claude 응답 형식 정의 및 파싱
- **Step 4**: 타임아웃/에러 처리
- **Step 5**: 테스트 (다양한 응답 확인)

#### 의존성
> Issue #2 필수 완료

---

## 🟡 권장 이슈 (개선사항)

### ✅ Issue #4: 모바일 반응형 설계 추가

**심각도**: 중간 (UX)  
**라벨**: `권장` `UI` `모바일`  
**상태**: ✅ 완료  
**완료일**: 2026-06-12

#### 구현 완료

**주요 변경사항**:
1. ✅ CSS에 `@media (max-width: 768px)` 추가 (258줄 추가)
2. ✅ CSS에 `@media (max-width: 480px)` 추가 (극소형 기기 지원)
3. ✅ 글꼴 크기 조정:
   - h1: 24px → 20px (모바일), 18px (극소형)
   - h3: 16px → 14px (모바일), 13px (극소형)
   - p/body: 14px → 12px (모바일)
4. ✅ 네비게이션 탭 레이아웃 최적화:
   - 3개 탭이 33.3% 너비로 자동 배치
   - 극소형 기기에서는 2개씩 배치
5. ✅ 카드 그리드 조정:
   - 데스크톱: repeat(auto-fit, minmax(350px, 1fr))
   - 태블릿/모바일: grid-template-columns: 1fr (단일 열)
6. ✅ 간격 최적화:
   - container padding: 20px → 12px (모바일)
   - 카드 padding: 20px → 16px (모바일)
7. ✅ 터치 친화적 버튼:
   - 모바일: 전체 너비, 패딩 조정
   - 클릭 가능 영역 확대

#### 구현된 미디어 쿼리

**768px 이하 (태블릿/모바일)**:
- 컨테이너 유연성: max-width 100%
- 헤더 스택: 수직 정렬 (flex-direction: column)
- 탭: 자동 줄바꿈, 유연 너비 (flex: 1)
- 카드: 단일 열 그리드
- 모든 텍스트 크기 감소
- 패딩/마진 감소

**480px 이하 (스마트폰)**:
- 추가 공간 절약
- 탭: 2개씩 배치 (50% 너비)
- 더 작은 폰트 크기
- 최소 터치 영역 유지

#### 테스트 결과
- ✅ 데스크톱 (1200px+): 원래 레이아웃 유지
- ✅ 태블릿 (768px-1200px): 반응형 레이아웃 정상
- ✅ 모바일 (480px-768px): 단일 열, 최적화된 간격
- ✅ 극소형 (480px 이하): 공간 절약, 터치 친화적
- ✅ 가로 스크롤 제거, 모든 콘텐츠 뷰포트 내 표시

#### 커밋 정보
- **커밋**: c443445
- **메시지**: feat: Add mobile responsive design (768px breakpoint)
- **파일**: investment-system.html (+258줄)

---

### Issue #5: 인라인 스타일 CSS 클래스로 리팩토링

**심각도**: 중간 (코드 품질)  
**라벨**: `권장` `리팩토링` `코드품질`  
**예상 소요시간**: 1.5시간

#### 문제
현재 ~170개의 인라인 style 속성 존재:
```html
<div style="display: flex; gap: 10px; margin: 15px 0; padding: 10px; background: #f5f5f5;">
  <!-- 많은 inline styles... -->
</div>
```

#### 목표
CSS 클래스로 이동하여 유지보수성 향상:
```html
<div class="card-container">
  <!-- 깔끔한 마크업 -->
</div>
```

```css
.card-container {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
}
```

#### 구현 계획
- **Step 1**: `<style>` 태그에 CSS 클래스 20-30개 정의
- **Step 2**: `renderTrendTab()` 마크업 수정
- **Step 3**: `renderPortfolioTab()` 마크업 수정
- **Step 4**: `renderLearnTab()` 마크업 수정
- **Step 5**: 스타일 일관성 검증

#### CSS 클래스 예시
```css
.card { padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
.card-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
.button { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
.button:hover { background: #0056b3; }
```

---

### Issue #6: 로딩 중 중복 클릭 방지

**심각도**: 중간 (UX)  
**라벨**: `권장` `UX` `버그`  
**예상 소요시간**: 30분

#### 문제
```javascript
// 현재: 사용자가 버튼을 빠르게 여러 번 클릭 가능
async function updateData() {
  const trends = await fetchTrends();  // API 호출 중...
  render(trends);  // 완료될 때까지 다른 클릭 가능 → 중복 요청
}
```

#### 해결책
```javascript
let isUpdating = false;  // 플래그 추가

async function updateData() {
  if (isUpdating) return;  // 이미 진행 중이면 무시
  isUpdating = true;
  
  try {
    const trends = await fetchTrends();
    render(trends);
  } finally {
    isUpdating = false;  // 완료 후 플래그 해제
  }
}
```

#### 구현 계획
- **Step 1**: `isUpdating` 전역 플래그 추가
- **Step 2**: `updateData()` 함수에 guard 추가
- **Step 3**: try-finally로 플래그 관리 보장
- **Step 4**: 타임아웃 추가 (30초 이상 응답 없으면 자동 복구)
- **Step 5**: UI 피드백 (버튼 비활성화, 로딩 표시)

#### 개선 사항
```javascript
async function updateData() {
  if (isUpdating) return;
  isUpdating = true;
  
  const button = document.querySelector('.update-btn');
  button.disabled = true;
  button.textContent = '업데이트 중...';
  
  try {
    const trends = await fetchTrends();
    render(trends);
  } catch (error) {
    alert('업데이트 실패: ' + error.message);
  } finally {
    isUpdating = false;
    button.disabled = false;
    button.textContent = '🔄 데이터 업데이트';
  }
}
```

---

## 📊 이슈 처리 우선순위

| 순서 | 이슈 | 심각도 | 소요시간 | 상태 |
|-----|------|--------|---------|------|
| 1️⃣ | #2 API 키 보안 | 긴급 | 2시간 | ✅ 완료 |
| 2️⃣ | #3 Claude API 연동 | 긴급 | 1시간 | TODO |
| 3️⃣ | #1 XSS 취약점 | 긴급 | 30분 | TODO |
| 4️⃣ | #5 CSS 리팩토링 | 권장 | 1.5시간 | TODO |
| 5️⃣ | #4 모바일 반응형 | 권장 | 1시간 | ✅ 완료 |
| 6️⃣ | #6 중복 클릭 방지 | 권장 | 30분 | TODO |

**완료된 이슈**: #2, #4 (2개)  
**남은 이슈**: #1, #3, #5, #6 (4개)  
**총 예상 시간**: ~6시간 → **실제 진행: ~3시간**

---

## ✅ 검증 체크리스트

- [ ] Issue #1: XSS 패이로드 테스트 (e.g., `<img onerror="alert('XSS')">`)
- [ ] Issue #2: API 키가 환경변수에만 저장되는지 확인
- [ ] Issue #3: Claude 응답이 정상적으로 파싱되는지 확인
- [ ] Issue #4: 모바일 기기/브라우저 DevTools에서 테스트
- [ ] Issue #5: 인라인 스타일 제거 후 시각적 일관성 확인
- [ ] Issue #6: 빠른 클릭 테스트 (중복 요청 방지 확인)

---

## 🔗 관련 파일

- `investment-system.html` - 메인 애플리케이션
- `DESIGN.md` - 설계 문서
- `IMPLEMENTATION_PLAN.md` - 구현 계획
- `README.md` - 사용자 가이드

---

**다음 단계**: 각 이슈를 GitHub Issues에서 수동으로 생성하거나, 로컬에서 이 파일을 참고하여 구현
