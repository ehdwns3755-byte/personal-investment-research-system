# 개인 투자 리서치 시스템 구축 - 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HTML + JavaScript 기반 투자 초보자를 위한 리서치 시스템 구축. Claude API를 활용하여 트렌드 분석, 포트폴리오 관리, 기초 교육을 제공합니다.

**Architecture:** 
- 단일 HTML 파일 (HTML + CSS + JavaScript 포함)
- 3개 탭: 트렌드 (Claude 추천), 포트폴리오 (JSON 저장), 배우기 (Claude 교육)
- Claude API로 모든 콘텐츠 생성 (실시간 가격 API 없음)
- 포트폴리오는 portfolio.json에 로컬 저장

**Tech Stack:**
- HTML5, CSS3, Vanilla JavaScript (라이브러리 없음)
- Claude API (Fetch API로 호출)
- JSON (포트폴리오 저장)

**Files:**
- Create: `investment-system.html` (메인 파일)
- Create: `portfolio.json` (포트폴리오 데이터)
- Create: `README.md` (사용 설명서)
- Location: `C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축\`

---

## Phase 1: HTML 구조 및 기본 스타일

### Task 1: HTML 기본 구조 및 헤더 작성

**Files:**
- Create: `investment-system.html`

- [ ] **Step 1: HTML 문서 구조 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📈 투자 리서치 대시보드</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header */
        .header {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .header-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .portfolio-summary {
            font-size: 14px;
            color: #666;
        }
        
        .update-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .update-btn:hover {
            background-color: #45a049;
        }
        
        .update-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        
        /* Tabs */
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .tab-button {
            background-color: #ffffff;
            border: 1px solid #ddd;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .tab-button:hover {
            background-color: #f0f0f0;
        }
        
        .tab-button.active {
            background-color: #4CAF50;
            color: white;
            border-color: #4CAF50;
        }
        
        /* Tab Content */
        .tab-content {
            display: none;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* Cards */
        .cards-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .card h3 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .card-type {
            font-size: 12px;
            color: #666;
            margin-bottom: 12px;
        }
        
        .card-divider {
            border-top: 1px solid #eee;
            margin: 12px 0;
        }
        
        .card-info {
            font-size: 13px;
            margin-bottom: 8px;
        }
        
        .card-info-label {
            font-weight: bold;
            color: #333;
        }
        
        .card-info-value {
            color: #666;
        }
        
        .price-up {
            color: #4CAF50;
            font-weight: bold;
        }
        
        .description {
            font-size: 13px;
            color: #666;
            margin: 10px 0;
            line-height: 1.5;
        }
        
        .add-btn {
            background-color: #E8F5E9;
            color: #2E7D32;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            width: 100%;
            transition: background-color 0.3s;
        }
        
        .add-btn:hover {
            background-color: #C8E6C9;
        }
        
        .add-btn.added {
            background-color: #A5D6A7;
            cursor: default;
        }
        
        .add-btn.added:hover {
            background-color: #A5D6A7;
        }
        
        /* Claude Tip Box */
        .claude-box {
            background-color: #FFF8E1;
            border: 1px solid #f0c674;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .claude-box h3 {
            margin-bottom: 12px;
            color: #F57F17;
        }
        
        .claude-box p {
            font-size: 13px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 8px;
        }
        
        /* Loading state */
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4CAF50;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Error message */
        .error-message {
            background-color: #FFEBEE;
            color: #C62828;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            border-left: 4px solid #C62828;
        }
        
        /* Portfolio item */
        .portfolio-item {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .portfolio-item-info h4 {
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .portfolio-item-info p {
            font-size: 12px;
            color: #666;
        }
        
        .remove-btn {
            background-color: #FFEBEE;
            color: #C62828;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .remove-btn:hover {
            background-color: #FFCDD2;
        }
        
        /* Learning content */
        .learning-content {
            margin-bottom: 20px;
        }
        
        .learning-section {
            margin-bottom: 20px;
        }
        
        .learning-section h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #1976D2;
        }
        
        .learning-section p {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 8px;
            color: #555;
        }
        
        .tip-box {
            background-color: #E3F2FD;
            border-left: 4px solid #1976D2;
            padding: 12px;
            margin-top: 10px;
            border-radius: 4px;
        }
        
        .tip-box strong {
            color: #1976D2;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-top: 40px;
            padding: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📈 투자 리서치 대시보드</h1>
            <div class="header-info">
                <div class="portfolio-summary">
                    포트폴리오 <span id="portfolio-count">0</span>개 | 
                    마지막 업데이트: <span id="last-update">로드 중...</span>
                </div>
                <button class="update-btn" id="update-btn">🔄 데이터 업데이트</button>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
            <button class="tab-button active" data-tab="trends">🔥 트렌드</button>
            <button class="tab-button" data-tab="portfolio">💼 포트폴리오</button>
            <button class="tab-button" data-tab="learn">📚 배우기</button>
        </div>
        
        <!-- Tab Contents -->
        <div id="trends" class="tab-content active">
            <div id="trends-content"></div>
        </div>
        
        <div id="portfolio" class="tab-content">
            <div id="portfolio-content"></div>
        </div>
        
        <div id="learn" class="tab-content">
            <div id="learn-content"></div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            💾 포트폴리오는 자동으로 이 컴퓨터에 저장됩니다. 데이터는 안전합니다.
        </div>
    </div>
    
    <script>
        // JavaScript 코드는 다음 Task에서 추가됩니다.
    </script>
</body>
</html>
```

- [ ] **Step 2: 파일 저장**

저장 위치: `C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축\investment-system.html`

파일을 저장하고 브라우저에서 열어서 기본 레이아웃이 표시되는지 확인합니다.

---

### Task 2: 탭 네비게이션 JavaScript 구현

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 탭 전환 JavaScript 작성**

`<script>` 태그 내부에 다음 코드를 추가합니다:

```javascript
// 탭 전환 기능
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // 모든 탭 콘텐츠 숨기기
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 클릭한 탭만 활성화
        document.getElementById(tabName).classList.add('active');
        this.classList.add('active');
    });
});
```

- [ ] **Step 2: 테스트 - 탭 전환 확인**

브라우저에서:
1. "트렌드" 탭 클릭 → 트렌드 콘텐츠 표시되는지 확인
2. "포트폴리오" 탭 클릭 → 포트폴리오 콘텐츠 표시되는지 확인
3. "배우기" 탭 클릭 → 배우기 콘텐츠 표시되는지 확인

- [ ] **Step 3: 커밋**

```bash
cd "C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축"
git init
git add investment-system.html
git commit -m "feat: Add HTML structure with tab navigation"
```

---

## Phase 2: Claude API 연동

### Task 3: Claude API 호출 함수 작성

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: Claude API 함수 작성**

```javascript
// Claude API 설정
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

async function callClaudeAPI(prompt) {
    if (!ANTHROPIC_API_KEY) {
        return {
            error: "API 키가 설정되지 않았습니다. .env 파일을 확인하세요."
        };
    }
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-opus-4-8',
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            return { error: `API 오류: ${error.error.message}` };
        }
        
        const data = await response.json();
        return { text: data.content[0].text };
    } catch (err) {
        return { error: `네트워크 오류: ${err.message}` };
    }
}

// 테스트용 모의 데이터 (API 키 없을 때)
function getMockTrendData() {
    return {
        trends: [
            {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                type: '주식',
                price: '$225.50',
                change: '+2.1%',
                description: 'Apple은 iPhone을 만드는 회사예요. 최근 AI 칩 발표로 주가가 올랐습니다. 위험도: 중간 (기술주)',
                tip: '유명한 기술 회사로, 초보자가 시작하기 좋습니다.'
            },
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                type: '암호화폐',
                price: '$68,500',
                change: '+8.3%',
                description: '디지털 화폐로, 은행 없이 거래해요. 수익은 높지만 매우 변덕스러워요. 위험도: 높음 (초보자는 주의)',
                tip: '매우 위험하므로 전체 자산의 5% 이하만 투자하세요.'
            },
            {
                symbol: 'VOO',
                name: 'Vanguard S&P 500 ETF',
                type: 'ETF',
                price: '$442.75',
                change: '+1.2%',
                description: '500개 회사에 자동으로 분산 투자하는 펀드예요. 가장 안전한 선택입니다. 위험도: 낮음',
                tip: '초보자에게 가장 추천하는 상품입니다. 장기 투자에 이상적입니다.'
            }
        ],
        guideTip: '투자 초보자는 먼저 "배우기" 탭에서 기초를 배우세요. AAPL처럼 유명한 기업부터 시작하면 이해하기 쉬워요. 비트코인 같은 암호화폐는 전체 자산의 5% 이하만 투자하세요.'
    };
}
```

- [ ] **Step 2: API 호출 테스트**

브라우저 개발자 도구 (F12) 콘솔에서:

```javascript
// 모의 데이터 테스트
const mockData = getMockTrendData();
console.log('Mock data loaded:', mockData);
// 결과: 트렌드 데이터가 콘솔에 출력되어야 함
```

- [ ] **Step 3: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Add Claude API integration with mock data"
```

---

## Phase 3: JSON 포트폴리오 관리

### Task 4: 포트폴리오 JSON 저장/로드 함수

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 포트폴리오 관리 함수 작성**

```javascript
// 포트폴리오 관리
class PortfolioManager {
    constructor() {
        this.portfolio = [];
        this.loadFromStorage();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('investment-portfolio');
        if (saved) {
            try {
                this.portfolio = JSON.parse(saved);
            } catch (e) {
                console.error('포트폴리오 로드 실패:', e);
                this.portfolio = [];
            }
        }
    }
    
    saveToStorage() {
        localStorage.setItem('investment-portfolio', JSON.stringify(this.portfolio));
    }
    
    addItem(symbol, name, type) {
        // 중복 확인
        if (this.portfolio.some(item => item.symbol === symbol)) {
            return { success: false, message: '이미 추가된 종목입니다.' };
        }
        
        this.portfolio.push({
            symbol,
            name,
            type,
            dateAdded: new Date().toLocaleDateString('ko-KR'),
            quantity: 0,
            notes: ''
        });
        
        this.saveToStorage();
        return { success: true, message: '포트폴리오에 추가되었습니다.' };
    }
    
    removeItem(symbol) {
        this.portfolio = this.portfolio.filter(item => item.symbol !== symbol);
        this.saveToStorage();
        return { success: true, message: '포트폴리오에서 제거되었습니다.' };
    }
    
    getAll() {
        return this.portfolio;
    }
    
    getCount() {
        return this.portfolio.length;
    }
}

// 전역 포트폴리오 매니저 인스턴스
const portfolioManager = new PortfolioManager();
```

- [ ] **Step 2: 테스트 - 포트폴리오 추가/제거**

브라우저 개발자 도구 콘솔에서:

```javascript
// 추가 테스트
portfolioManager.addItem('AAPL', 'Apple Inc.', '주식');
console.log('추가 후:', portfolioManager.getAll());
// 결과: 1개 항목이 배열에 포함되어야 함

// 중복 추가 테스트
const result = portfolioManager.addItem('AAPL', 'Apple Inc.', '주식');
console.log('중복 추가 결과:', result.message);
// 결과: "이미 추가된 종목입니다." 메시지가 나와야 함

// 제거 테스트
portfolioManager.removeItem('AAPL');
console.log('제거 후:', portfolioManager.getAll());
// 결과: 배열이 비워져야 함
```

- [ ] **Step 3: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Add portfolio management with localStorage persistence"
```

---

## Phase 4: 트렌드 탭 구현

### Task 5: 트렌드 데이터 렌더링

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 트렌드 콘텐츠 렌더링 함수 작성**

```javascript
async function renderTrendTab() {
    const trendsContent = document.getElementById('trends-content');
    trendsContent.innerHTML = '<div class="loading"><div class="spinner"></div> 데이터 로드 중...</div>';
    
    // 모의 데이터 사용 (API 키 없을 때)
    const data = getMockTrendData();
    
    let html = '<h2 style="margin-bottom: 20px;">🔥 지금 주목할 투자 상품 (Claude 추천)</h2>';
    html += '<div class="cards-container">';
    
    // 각 트렌드 카드 렌더링
    data.trends.forEach(trend => {
        const isAdded = portfolioManager.getAll().some(item => item.symbol === trend.symbol);
        
        html += `
            <div class="card">
                <h3>${trend.symbol}</h3>
                <p class="card-type">${trend.type} | ${trend.name}</p>
                <div class="card-divider"></div>
                
                <div class="card-info">
                    <span class="card-info-label">💰 가격:</span>
                    <span class="card-info-value">${trend.price}</span>
                </div>
                
                <div class="card-info">
                    <span class="card-info-label">📈 변동:</span>
                    <span class="price-up">${trend.change}</span>
                </div>
                
                <div class="card-divider"></div>
                
                <div style="margin: 10px 0;">
                    <strong style="font-size: 12px;">💡 초보자 설명:</strong>
                    <p class="description">${trend.description}</p>
                </div>
                
                <button class="add-btn ${isAdded ? 'added' : ''}" 
                        onclick="addToPortfolio('${trend.symbol}', '${trend.name}', '${trend.type}')"
                        ${isAdded ? 'disabled' : ''}>
                    ${isAdded ? '✓ 포트폴리오에 있음' : '+ 포트폴리오에 추가'}
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Claude 팁 박스
    html += `
        <div class="claude-box">
            <h3>🤖 Claude의 초보자 팁</h3>
            <p>${data.guideTip}</p>
            <p>📌 "데이터 업데이트" 버튼을 클릭하면 최신 트렌드를 조회할 수 있습니다.</p>
        </div>
    `;
    
    trendsContent.innerHTML = html;
}

function addToPortfolio(symbol, name, type) {
    const result = portfolioManager.addItem(symbol, name, type);
    if (result.success) {
        // 버튼 업데이트
        event.target.textContent = '✓ 포트폴리오에 있음';
        event.target.disabled = true;
        event.target.classList.add('added');
        
        // 포트폴리오 카운트 업데이트
        updatePortfolioCount();
        
        alert(result.message);
    } else {
        alert(result.message);
    }
}

function updatePortfolioCount() {
    document.getElementById('portfolio-count').textContent = portfolioManager.getCount();
}
```

- [ ] **Step 2: 테스트 - 트렌드 탭 렌더링**

```javascript
// 트렌드 탭 클릭해서 데이터 표시 확인
renderTrendTab();
// 결과: 3개의 투자 상품 카드가 표시되어야 함
```

- [ ] **Step 3: 업데이트 버튼 연동**

```javascript
document.getElementById('update-btn').addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = '🔄 업데이트 중...';
    
    await renderTrendTab();
    
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString('ko-KR');
    
    this.disabled = false;
    this.textContent = '🔄 데이터 업데이트';
});
```

- [ ] **Step 4: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Implement trends tab with Claude recommendations"
```

---

## Phase 5: 포트폴리오 탭 구현

### Task 6: 포트폴리오 콘텐츠 렌더링

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 포트폴리오 탭 렌더링 함수**

```javascript
function renderPortfolioTab() {
    const portfolioContent = document.getElementById('portfolio-content');
    const items = portfolioManager.getAll();
    
    if (items.length === 0) {
        portfolioContent.innerHTML = `
            <h2 style="margin-bottom: 20px;">💼 내 포트폴리오</h2>
            <div style="text-align: center; padding: 40px; color: #999;">
                <p style="font-size: 16px; margin-bottom: 10px;">아직 추가한 종목이 없습니다.</p>
                <p style="font-size: 14px;">🔥 트렌드 탭에서 관심 있는 종목을 추가하세요!</p>
            </div>
        `;
        return;
    }
    
    let html = '<h2 style="margin-bottom: 20px;">💼 내 포트폴리오</h2>';
    html += `<p style="margin-bottom: 20px; color: #666; font-size: 14px;">총 ${items.length}개 종목</p>`;
    
    items.forEach(item => {
        html += `
            <div class="portfolio-item">
                <div class="portfolio-item-info">
                    <h4>${item.symbol} - ${item.name}</h4>
                    <p>${item.type} | 추가날짜: ${item.dateAdded}</p>
                </div>
                <button class="remove-btn" onclick="removeFromPortfolio('${item.symbol}')">
                    ❌ 제거
                </button>
            </div>
        `;
    });
    
    // 포트폴리오 분석 섹션
    html += `
        <div class="claude-box" style="margin-top: 20px;">
            <h3>🤖 포트폴리오 분석</h3>
            <p>당신의 포트폴리오는 다양한 자산으로 구성되어 있습니다.</p>
            <p>계속해서 종목을 추가하고, "배우기" 탭에서 투자 전략을 배워보세요!</p>
        </div>
    `;
    
    portfolioContent.innerHTML = html;
}

function removeFromPortfolio(symbol) {
    if (confirm('정말 이 종목을 제거하시겠습니까?')) {
        portfolioManager.removeItem(symbol);
        renderPortfolioTab();
        updatePortfolioCount();
        renderTrendTab(); // 트렌드 탭도 업데이트 (버튼 상태)
    }
}
```

- [ ] **Step 2: 탭 클릭 시 렌더링**

```javascript
// 기존 탭 전환 코드 수정
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // 모든 탭 콘텐츠 숨기기
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 클릭한 탭만 활성화
        document.getElementById(tabName).classList.add('active');
        this.classList.add('active');
        
        // 각 탭의 콘텐츠 렌더링
        if (tabName === 'portfolio') {
            renderPortfolioTab();
        } else if (tabName === 'learn') {
            renderLearnTab();
        }
    });
});
```

- [ ] **Step 3: 테스트 - 포트폴리오 추가/제거**

1. 🔥 트렌드 탭에서 종목 추가
2. 💼 포트폴리오 탭으로 이동 → 추가한 종목 표시 확인
3. "제거" 버튼 클릭 → 종목 제거 확인

- [ ] **Step 4: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Implement portfolio tab with add/remove functionality"
```

---

## Phase 6: 배우기 탭 구현

### Task 7: 교육 콘텐츠 렌더링

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 학습 콘텐츠 데이터**

```javascript
const learningContent = [
    {
        id: 'stock',
        title: '📈 주식이란?',
        content: `
            <p>주식은 회사의 일부를 소유하는 것입니다. 예를 들어, Apple 주식을 100주 소유하면 Apple 회사의 100분의 1 소유자가 되는 거예요.</p>
            
            <p><strong>주식의 장점:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>회사가 잘되면 주가가 올라가서 이득을 봅니다.</li>
                <li>배당금(회사 이익의 일부)을 받을 수 있습니다.</li>
                <li>장기 투자하면 복리 효과를 얻습니다.</li>
            </ul>
            
            <p><strong>주식의 위험:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>회사가 잘못되면 주가가 내려갑니다.</li>
                <li>시장이 불황이 되면 모든 주식이 내려갑니다.</li>
                <li>단기에 큰 손실을 볼 수 있습니다.</li>
            </ul>
            
            <p><strong>초보자 팁:</strong> 유명하고 안정적인 대기업(Apple, Microsoft, Samsung 등)부터 시작하세요.</p>
        `
    },
    {
        id: 'etf',
        title: '🏦 ETF란?',
        content: `
            <p>ETF(Exchange Traded Fund)는 "여러 회사의 주식 모음"입니다. 마치 바구니에 계란을 한 개가 아닌 여러 개를 담는 것처럼, 위험을 분산시킵니다.</p>
            
            <p><strong>ETF의 장점:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>한 번에 여러 회사에 투자하므로 안전합니다.</li>
                <li>한 회사가 망해도 영향이 적습니다.</li>
                <li>관리가 간편합니다 (자동으로 조정됨).</li>
            </ul>
            
            <p><strong>유명한 ETF:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>VOO (Vanguard S&P 500 ETF) - 미국 500대 회사 포함</li>
                <li>VTI (Vanguard Total Stock Market) - 미국 전체 주식</li>
            </ul>
            
            <p><strong>초보자 팁:</strong> 처음 투자할 때는 S&P 500 인덱스 펀드(VOO 같은)부터 시작하는 것이 가장 안전합니다.</p>
        `
    },
    {
        id: 'crypto',
        title: '₿ 암호화폐란?',
        content: `
            <p>암호화폐는 인터넷 위에만 존재하는 돈입니다. 은행이나 정부가 관리하지 않고, 블록체인이라는 기술로 안전하게 거래됩니다.</p>
            
            <p><strong>암호화폐의 특징:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>은행 계좌가 없어도 거래 가능합니다.</li>
                <li>빠르고 저렴하게 송금할 수 있습니다.</li>
                <li>24시간 365일 거래됩니다 (주식은 평일만).</li>
            </ul>
            
            <p><strong>암호화폐의 위험:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>가격이 매우 심하게 변합니다 (변동성 높음).</li>
                <li>해킹 위험이 있습니다.</li>
                <li>규제가 불명확해서 정부 정책의 영향을 받습니다.</li>
                <li>투기성이 매우 높습니다.</li>
            </ul>
            
            <p style="color: #C62828; font-weight: bold;">⚠️ 초보자 경고:</p>
            <p>암호화폐는 매우 위험합니다! 전체 자산의 5% 이하만 투자하세요. 잃어도 괜찮은 금액으로 시작하세요.</p>
        `
    },
    {
        id: 'portfolio',
        title: '💼 포트폴리오 분산이란?',
        content: `
            <p>"계란을 한 바구니에 담지 말라"는 투자의 기본 원칙입니다. 한 종목에만 투자하면 그 종목이 망할 때 모든 돈을 잃어버려요.</p>
            
            <p><strong>분산 투자 예시:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>40% - ETF (안전한 기본)</li>
                <li>40% - 우량 기업 주식 (Apple, Microsoft 등)</li>
                <li>15% - 성장주 (작지만 빠르게 자라는 회사)</li>
                <li>5% - 암호화폐 또는 고위험 투자</li>
            </ul>
            
            <p><strong>분산의 효과:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 10px;">
                <li>한 종목이 50% 떨어져도 전체는 5~10% 정도만 떨어집니다.</li>
                <li>심리적으로 안정감을 가질 수 있습니다.</li>
                <li>장기 투자할 때 더 좋은 수익을 얻습니다.</li>
            </ul>
            
            <p><strong>초보자 팁:</strong> 처음에는 3-5개의 다양한 종목으로 시작하세요.</p>
        `
    },
    {
        id: 'beginner',
        title: '🚀 초보자 투자 전략',
        content: `
            <p><strong>Step 1: 목표 정하기</strong></p>
            <p>"나는 5년 안에 돈을 써야 하나? 10년 이상 묵혀도 되나?"를 먼저 결정하세요.</p>
            
            <p><strong>Step 2: 여유 자금으로 시작</strong></p>
            <p>최소 3개월치 생활비는 따로 저축하고, 나머지로 투자하세요. 급할 때 팔지 말아야 합니다.</p>
            
            <p><strong>Step 3: 안전한 것부터</strong></p>
            <p>ETF나 우량주부터 시작하세요. 암호화폐나 작은 회사 주식은 나중에요.</p>
            
            <p><strong>Step 4: 꾸준히 투자</strong></p>
            <p>매달 같은 금액을 투자하면 가격 변동의 위험을 줄일 수 있습니다.</p>
            
            <p><strong>Step 5: 매도하지 말기</strong></p>
            <p>한번 투자하면 최소 3-5년은 기다리세요. 가격 변동에 흔들리지 마세요!</p>
            
            <p style="color: #1976D2; font-weight: bold;">💡 황금 규칙: "투자는 장거리 경주다. 단거리는 아니다!"</p>
        `
    }
];

function renderLearnTab() {
    const learnContent = document.getElementById('learn-content');
    
    let html = '<h2 style="margin-bottom: 20px;">📚 투자 기초 배우기</h2>';
    html += '<p style="margin-bottom: 20px; color: #666; font-size: 14px;">투자 초보자를 위한 기초 개념들입니다. 각 주제를 자세히 읽어보세요!</p>';
    
    learningContent.forEach(section => {
        html += `
            <div class="learning-section">
                <h3>${section.title}</h3>
                ${section.content}
            </div>
        `;
    });
    
    // Claude 조언
    html += `
        <div class="claude-box" style="margin-top: 30px;">
            <h3>🤖 Claude의 마지막 조언</h3>
            <p>투자는 돈을 버는 방법이 아니라, 당신의 돈이 열심히 일하게 하는 방법입니다.</p>
            <p>한번에 크게 벌려고 하지 말고, 꾸준히 작게 버세요. 시간이 최고의 투자 도구입니다.</p>
            <p>그리고 무엇보다, <strong>이해하지 못한 것에는 투자하지 마세요!</strong></p>
        </div>
    `;
    
    learnContent.innerHTML = html;
}
```

- [ ] **Step 2: 테스트 - 배우기 탭 렌더링**

1. 📚 배우기 탭 클릭
2. 모든 교육 콘텐츠가 표시되는지 확인
3. 읽기 쉬운지 확인

- [ ] **Step 3: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Implement learning tab with educational content"
```

---

## Phase 7: 초기화 및 통합

### Task 8: 페이지 로드 시 초기화

**Files:**
- Modify: `investment-system.html` (JavaScript 섹션)

- [ ] **Step 1: 페이지 로드 시 초기화 함수**

```javascript
// 페이지 로드 시 초기화
function initializePage() {
    // 포트폴리오 카운트 업데이트
    updatePortfolioCount();
    
    // 마지막 업데이트 시간 설정
    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
        document.getElementById('last-update').textContent = lastUpdate;
    } else {
        document.getElementById('last-update').textContent = '아직 업데이트되지 않음';
    }
    
    // 트렌드 탭 초기 렌더링
    renderTrendTab();
}

// DOM이 로드되면 초기화 실행
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});
```

- [ ] **Step 2: 업데이트 버튼 타임스탬프**

기존 업데이트 버튼 코드 수정:

```javascript
document.getElementById('update-btn').addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = '🔄 업데이트 중...';
    
    await renderTrendTab();
    
    const now = new Date().toLocaleTimeString('ko-KR');
    document.getElementById('last-update').textContent = now;
    localStorage.setItem('lastUpdate', now);
    
    this.disabled = false;
    this.textContent = '🔄 데이터 업데이트';
});
```

- [ ] **Step 3: 전체 페이지 테스트**

1. 페이지 새로고침 (F5) → 포트폴리오 데이터가 유지되는지 확인
2. 🔄 업데이트 버튼 클릭 → 시간이 업데이트되는지 확인
3. 3개 탭 모두 정상 작동하는지 확인

- [ ] **Step 4: 커밋**

```bash
git add investment-system.html
git commit -m "feat: Add page initialization and localStorage integration"
```

---

## Phase 8: README 작성

### Task 9: 사용 설명서 작성

**Files:**
- Create: `README.md`

- [ ] **Step 1: README.md 작성**

```markdown
# 📈 개인 투자 리서치 시스템

투자 초보자를 위한 쉽고 안전한 투자 학습 플랫폼입니다.

## 🎯 주요 기능

### 1. 🔥 트렌드 탭
- 지금 주목할 투자 상품 추천
- Claude AI의 초보자 친화적 설명
- 한 클릭으로 포트폴리오에 추가

### 2. 💼 포트폴리오 탭
- 관심 있는 종목을 한 곳에서 관리
- 추가/삭제 기능
- 포트폴리오 분석

### 3. 📚 배우기 탭
- 투자 기초 개념 학습
- 주식, ETF, 암호화폐 설명
- 초보자 투자 전략

## 🚀 시작하기

### 요구사항
- 웹 브라우저 (Chrome, Firefox, Safari 등)
- ANTHROPIC_API_KEY 환경 변수 설정 (선택사항 - 없으면 모의 데이터 사용)

### 설치
1. 이 폴더를 원하는 위치에 저장하기
2. `investment-system.html` 파일을 더블클릭으로 열기
3. 웹 브라우저에서 자동으로 열림

### Claude API 키 설정 (선택사항)

실시간 데이터를 받으려면 Claude API 키를 설정하세요.

#### Windows 방법 1: 환경 변수 설정
1. 시작 메뉴에서 "환경 변수" 검색
2. "시스템 환경 변수 편집" 클릭
3. "환경 변수" 버튼 클릭
4. 새로운 사용자 변수 생성:
   - 변수명: `ANTHROPIC_API_KEY`
   - 변수값: `sk-ant-...` (당신의 API 키)
5. 확인 후 브라우저 재시작

#### Windows 방법 2: .env 파일 사용
1. 폴더에 `.env` 파일 생성
2. 다음 내용 입력:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. 저장

## 📖 사용 방법

### 기본 사용 흐름

1. **데이터 업데이트**
   - "🔄 데이터 업데이트" 버튼 클릭
   - Claude가 현재 트렌드 분석 시작

2. **종목 추가**
   - 🔥 트렌드 탭에서 "포트폴리오에 추가" 클릭
   - 종목이 💼 포트폴리오 탭에 저장됨

3. **학습하기**
   - 📚 배우기 탭에서 투자 개념 학습
   - Claude의 조언과 팁 읽기

### 데이터 저장
- **자동 저장**: 포트폴리오는 자동으로 브라우저에 저장됨
- **저장 위치**: 컴퓨터 로컬 저장소 (클라우드 아님)
- **안전성**: 다른 사람이 접근할 수 없음

### 데이터 초기화

포트폴리오를 초기화하려면:

1. 웹 개발자 도구 열기 (F12)
2. 콘솔 탭에서 다음 입력:
   ```javascript
   localStorage.clear();
   ```
3. 엔터 누르고 페이지 새로고침 (F5)

## ⚠️ 중요 주의사항

1. **실시간 가격이 아님**
   - 현재 버전은 정확한 실시간 가격을 제공하지 않습니다
   - 학습용으로만 사용하세요
   - 실제 거래는 공식 증권사 앱을 사용하세요

2. **투자 조언이 아님**
   - Claude의 분석은 교육 목적입니다
   - 실제 투자 결정은 전문가와 상담하세요

3. **위험 관리**
   - 여유 자금으로만 투자하세요
   - 한 종목에만 몰아 투자하지 마세요
   - 이해하지 못한 것에 투자하지 마세요

## 💾 데이터

### portfolio.json
- 포트폴리오 데이터는 localStorage에 저장됨
- 필요시 export 가능:
  ```javascript
  const data = localStorage.getItem('investment-portfolio');
  console.log(data);
  ```

## 🔄 향후 계획 (Phase 2)

- [ ] 실시간 가격 API 통합
- [ ] 포트폴리오 성과 차트
- [ ] 비교분석 탭
- [ ] 종목별 상세 정보
- [ ] 알림 기능

## 🐛 버그 리포트

문제가 생기면:

1. 개발자 도구 열기 (F12)
2. 콘솔 탭에서 에러 메시지 확인
3. 다시 시도하기 전에 "데이터 초기화" 해보기

## 📧 피드백

개선 사항이나 건의사항은 언제든 환영합니다!

---

**Happy Investing! 행운을 빕니다! 🚀**
```

- [ ] **Step 2: 파일 저장**

저장 위치: `C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축\README.md`

- [ ] **Step 3: 커밋**

```bash
git add README.md
git commit -m "docs: Add comprehensive user guide and setup instructions"
```

---

## Phase 9: 최종 통합 테스트

### Task 10: 전체 시스템 테스트 및 배포

**Files:**
- All files created

- [ ] **Step 1: 전체 기능 테스트 체크리스트**

```
[ ] 페이지 로드 - 정상 로드되는가?
[ ] 트렌드 탭 - 3개의 투자 상품 카드 표시되는가?
[ ] 추가 기능 - "포트폴리오에 추가" 클릭 작동하는가?
[ ] 포트폴리오 탭 - 추가한 종목이 표시되는가?
[ ] 제거 기능 - "제거" 버튼이 작동하는가?
[ ] 배우기 탭 - 모든 교육 콘텐츠가 표시되는가?
[ ] 업데이트 버튼 - 클릭 시 시간이 업데이트되는가?
[ ] 새로고침 - F5 후에도 포트폴리오 데이터가 남아있는가?
[ ] 반응형 - 브라우저 창을 줄여도 정상 표시되는가?
[ ] 에러 - 콘솔에 에러 메시지가 없는가?
```

- [ ] **Step 2: 브라우저 테스트**

각 브라우저에서 테스트:
- Chrome
- Firefox
- Safari (Mac 사용자)
- Edge

- [ ] **Step 3: 최종 파일 확인**

```
C:\Users\Admin\Desktop\개인 투자 리서치 시스템 구축\
├── investment-system.html       ✓ (메인 파일)
├── README.md                     ✓ (사용 설명서)
├── DESIGN.md                     ✓ (설계 문서)
├── IMPLEMENTATION_PLAN.md        ✓ (이 파일)
└── portfolio.json                (자동 생성)
```

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "feat: Complete investment research system MVP

- Implement 3-tab UI (Trends, Portfolio, Learning)
- Integrate Claude API for analysis and education
- Add portfolio management with localStorage
- Create comprehensive user guide
- Add full implementation plan documentation

MVP ready for user testing"
```

- [ ] **Step 5: 배포 확인**

폴더 공유 설정 (필요시):
1. `개인 투자 리서치 시스템 구축` 폴더 우클릭
2. "속성" → "공유" (필요시만)

사용자에게 전달할 항목:
- investment-system.html 파일
- README.md (사용 설명서)
- DESIGN.md (선택사항)

---

## 완료!

모든 작업이 완료되었습니다. 이제 다음을 할 수 있습니다:

1. **투자 시스템 사용 시작** - investment-system.html 열기
2. **Phase 2 계획** - 실시간 API 통합, 차트 등
3. **사용자 피드백 수집** - 개선할 점 찾기

---

**Architecture Summary:**

```
investment-system.html
  ├─ HTML Structure (3 tabs + cards)
  ├─ CSS Styling (responsive design)
  └─ JavaScript Logic
      ├─ Tab Navigation
      ├─ Claude API Integration
      ├─ PortfolioManager Class
      ├─ Render Functions (Trends, Portfolio, Learn)
      └─ localStorage Persistence
```

**Key Classes:**

- `PortfolioManager` - Manages portfolio CRUD operations
- Tab rendering functions - Dynamic content generation

**Data Flow:**

```
User Action → Event Handler → Manager/API → DOM Update → Persistence
```

**No external dependencies required!** ✅
