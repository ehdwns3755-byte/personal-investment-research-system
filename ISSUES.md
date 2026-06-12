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

### Issue #2: API 키 보안 정책 수립

**심각도**: 높음 (API 키 노출)  
**라벨**: `긴급` `API` `보안`  
**예상 소요시간**: 2시간

#### 현황
브라우저에서 Claude API 키를 직접 사용할 수 없음:
```javascript
// 현재 (작동 불가):
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': apiKey }  // ❌ 브라우저에서 CORS 차단
});
```

#### 해결 옵션

**옵션 A: 백엔드 프록시 (권장)**
- Express.js 서버 구성
- `/api/claude` 엔드포인트 작성
- 서버 환경변수에 API 키 저장
- 클라이언트는 프록시 엔드포인트만 호출

**옵션 B: 사용자 입력 방식**
- 사용자가 자신의 API 키 입력
- localStorage에 저장 (낮은 보안 수준)

#### 구현 계획 (옵션 A)
- **Step 1**: Express 서버 추가 (`backend/server.js`)
- **Step 2**: `/api/claude` POST 엔드포인트 구현
- **Step 3**: API 키 환경변수 (.env 사용)
- **Step 4**: CORS 설정
- **Step 5**: 클라이언트 fetch URL 변경
- **Step 6**: 배포 스크립트 추가

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

### Issue #4: 모바일 반응형 설계 추가

**심각도**: 중간 (UX)  
**라벨**: `권장` `UI` `모바일`  
**예상 소요시간**: 1시간

#### 문제
```css
/* 현재: 고정 너비, media query 없음 */
#container {
  max-width: 1200px;  /* 모바일에서 가로 스크롤 필요 */
  margin: 0 auto;
}
```

#### 해결책
```css
/* 목표: 반응형 디자인 */
@media (max-width: 768px) {
  #container { max-width: 100%; padding: 0 10px; }
  .card { flex: 1 0 100%; }  /* 카드 너비 조정 */
  h1 { font-size: 24px; }     /* 글꼴 크기 조정 */
}
```

#### 구현 계획
- **Step 1**: CSS에 `@media (max-width: 768px)` 추가
- **Step 2**: 글꼴 크기 조정 (h1, h3, p)
- **Step 3**: 네비게이션 탭 레이아웃 최적화
- **Step 4**: 카드 너비 및 간격 조정
- **Step 5**: 모바일 기기에서 테스트

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

| 순서 | 이슈 | 심각도 | 소요시간 | 의존성 |
|-----|------|--------|---------|--------|
| 1️⃣ | #2 API 키 보안 | 긴급 | 2시간 | 없음 |
| 2️⃣ | #3 Claude API 연동 | 긴급 | 1시간 | #2 필수 |
| 3️⃣ | #1 XSS 취약점 | 긴급 | 30분 | 없음 |
| 4️⃣ | #5 CSS 리팩토링 | 권장 | 1.5시간 | 없음 |
| 5️⃣ | #4 모바일 반응형 | 권장 | 1시간 | 없음 |
| 6️⃣ | #6 중복 클릭 방지 | 권장 | 30분 | 없음 |

**총 예상 시간**: ~6시간

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
