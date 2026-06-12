# API Proxy 테스트 스크립트
# 백엔드 프록시 서버가 정상 작동하는지 확인합니다.

param(
    [string]$Prompt = "당신은 누구입니까?",
    [string]$ApiUrl = "http://localhost:3001/api/claude"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Claude API 프록시 테스트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 헬스 체크
Write-Host "1️⃣  헬스 체크 수행 중..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -ErrorAction Stop
    $healthData = $healthResponse.Content | ConvertFrom-Json

    Write-Host "   ✅ 서버가 응답합니다" -ForegroundColor Green
    Write-Host "   상태: $($healthData.status)" -ForegroundColor Gray
    Write-Host "   시간: $($healthData.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ 헬스 체크 실패" -ForegroundColor Red
    Write-Host "   오류: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   💡 백엔드 서버를 시작하세요:" -ForegroundColor Yellow
    Write-Host "      cd backend" -ForegroundColor Gray
    Write-Host "      npm install" -ForegroundColor Gray
    Write-Host "      npm start" -ForegroundColor Gray
    exit 1
}

# 2. API 프록시 테스트
Write-Host ""
Write-Host "2️⃣  API 프록시 테스트 중..." -ForegroundColor Yellow
Write-Host "   프롬프트: '$Prompt'" -ForegroundColor Gray
Write-Host "   API URL: $ApiUrl" -ForegroundColor Gray

try {
    $payload = @{
        prompt = $Prompt
        model = "claude-opus-4-8"
        max_tokens = 1024
    } | ConvertTo-Json

    Write-Host "   📤 요청 전송 중..." -ForegroundColor Cyan

    $response = Invoke-WebRequest -Uri $ApiUrl `
        -Method POST `
        -Headers @{'Content-Type' = 'application/json'} `
        -Body $payload `
        -TimeoutSec 30 `
        -ErrorAction Stop

    $responseData = $response.Content | ConvertFrom-Json

    if ($responseData.status -eq "success") {
        Write-Host "   ✅ API 호출 성공" -ForegroundColor Green
        Write-Host ""
        Write-Host "   📝 응답:" -ForegroundColor Cyan
        Write-Host "   ---" -ForegroundColor Gray
        Write-Host $responseData.text -ForegroundColor White
        Write-Host "   ---" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   📊 사용 통계:" -ForegroundColor Cyan
        Write-Host "   입력 토큰: $($responseData.usage.input_tokens)" -ForegroundColor Gray
        Write-Host "   출력 토큰: $($responseData.usage.output_tokens)" -ForegroundColor Gray
        Write-Host "   모델: $($responseData.model)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ API 오류: $($responseData.error)" -ForegroundColor Red
        if ($responseData.details) {
            Write-Host "   세부정보: $($responseData.details | ConvertTo-Json)" -ForegroundColor Red
        }
        exit 1
    }

} catch {
    Write-Host "   ❌ API 호출 실패" -ForegroundColor Red
    Write-Host "   오류: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.Exception.Message -match "API key") {
        Write-Host ""
        Write-Host "   💡 .env 파일에 API 키를 설정하세요:" -ForegroundColor Yellow
        Write-Host "      ANTHROPIC_API_KEY=sk-ant-your-api-key-here" -ForegroundColor Gray
    }
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ 모든 테스트 통과!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 백엔드 프록시 서버가 정상 작동합니다!" -ForegroundColor Green
Write-Host "   이제 investment-system.html을 열어서 사용할 수 있습니다." -ForegroundColor Green
Write-Host ""
