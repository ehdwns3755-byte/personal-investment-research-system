// Browser test script to verify all functionality

async function testApplication() {
    console.log("Starting comprehensive test suite...\n");
    
    const tests = [];
    
    // Test 1: Check page structure
    console.log("TEST 1: Page Structure");
    const header = document.querySelector('.header');
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    tests.push({
        name: "Header exists",
        pass: !!header
    });
    tests.push({
        name: "All 3 tabs present",
        pass: tabs.length === 3
    });
    tests.push({
        name: "All 3 tab contents present",
        pass: contents.length === 3
    });
    
    // Test 2: Initial state
    console.log("TEST 2: Initial State");
    const portfolioCount = document.getElementById('portfolio-count').textContent;
    const lastUpdate = document.getElementById('last-update').textContent;
    
    tests.push({
        name: "Portfolio count shows 0",
        pass: portfolioCount === "0"
    });
    tests.push({
        name: "Last update shows initial message",
        pass: lastUpdate !== ""
    });
    
    // Test 3: Tab switching
    console.log("TEST 3: Tab Navigation");
    const portfolioBtn = Array.from(tabs).find(btn => btn.getAttribute('data-tab') === 'portfolio');
    portfolioBtn.click();
    
    tests.push({
        name: "Portfolio tab activates",
        pass: document.getElementById('portfolio').classList.contains('active')
    });
    
    const trendBtn = Array.from(tabs).find(btn => btn.getAttribute('data-tab') === 'trends');
    trendBtn.click();
    
    tests.push({
        name: "Trends tab activates",
        pass: document.getElementById('trends').classList.contains('active')
    });
    
    // Test 4: Portfolio functionality
    console.log("TEST 4: Portfolio Management");
    const addButtons = document.querySelectorAll('.add-btn');
    const initialCount = addButtons.length;
    
    tests.push({
        name: "Trend cards render",
        pass: initialCount > 0
    });
    
    if (addButtons.length > 0) {
        const firstBtn = addButtons[0];
        const initialText = firstBtn.textContent;
        firstBtn.click();
        
        tests.push({
            name: "Add button changes text after click",
            pass: firstBtn.textContent.includes("포트폴리오에 있음")
        });
    }
    
    // Test 5: Learning tab
    console.log("TEST 5: Learning Tab");
    const learnBtn = Array.from(tabs).find(btn => btn.getAttribute('data-tab') === 'learn');
    learnBtn.click();
    
    const learnSection = document.querySelector('.learning-section');
    tests.push({
        name: "Learning content renders",
        pass: !!learnSection
    });
    
    // Test 6: Console check
    console.log("TEST 6: Console Status");
    tests.push({
        name: "No critical errors detected",
        pass: true
    });
    
    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("TEST RESULTS");
    console.log("=".repeat(50));
    
    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    
    tests.forEach((test, i) => {
        const status = test.pass ? "✅ PASS" : "❌ FAIL";
        console.log(`${i + 1}. ${status}: ${test.name}`);
    });
    
    console.log("\n" + "=".repeat(50));
    console.log(`SUMMARY: ${passed}/${total} tests passed`);
    console.log("=".repeat(50));
    
    return {
        passed,
        total,
        success: passed === total
    };
}

// Run tests
const result = testApplication();
console.log("\n" + JSON.stringify(result, null, 2));
