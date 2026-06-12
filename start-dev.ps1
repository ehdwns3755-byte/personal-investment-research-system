# Development Server Startup Script
# 로컬 개발 환경에서 클라이언트 + 백엔드 서버를 함께 실행합니다.

param(
    [switch]$NoWait = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "투자 리서치 시스템 - 개발 서버 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 백엔드 설정 확인
Write-Host "📦 백엔드 환경 확인 중..." -ForegroundColor Yellow

$backendDir = Join-Path $PSScriptRoot "backend"
$nodeModulesDir = Join-Path $backendDir "node_modules"
$packageJsonPath = Join-Path $backendDir "package.json"

if (-not (Test-Path $nodeModulesDir)) {
    Write-Host "   ⚠️  node_modules가 없습니다. npm install 실행 중..." -ForegroundColor Yellow
    Push-Location $backendDir
    npm install
    Pop-Location
    Write-Host "   ✅ npm install 완료" -ForegroundColor Green
} else {
    Write-Host "   ✅ 백엔드 의존성이 이미 설치되어 있습니다." -ForegroundColor Green
}

# 2. .env 파일 확인
Write-Host ""
Write-Host "🔐 환경 설정 확인 중..." -ForegroundColor Yellow

$envPath = Join-Path $PSScriptRoot ".env"
$envExamplePath = Join-Path $PSScriptRoot ".env.example"

if (-not (Test-Path $envPath)) {
    if (Test-Path $envExamplePath) {
        Write-Host "   ℹ️  .env 파일이 없습니다. .env.example에서 복사합니다..." -ForegroundColor Cyan
        Copy-Item $envExamplePath $envPath
        Write-Host "   ✅ .env 파일이 생성되었습니다." -ForegroundColor Green
        Write-Host "   ⚠️  .env 파일을 열어 ANTHROPIC_API_KEY를 설정하세요!" -ForegroundColor Yellow
    }
} else {
    # .env 파일에서 API 키 확인
    $envContent = Get-Content $envPath
    if ($envContent -match "ANTHROPIC_API_KEY=sk-ant-") {
        Write-Host "   ✅ API 키가 설정되어 있습니다." -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  ANTHROPIC_API_KEY가 올바르게 설정되지 않았습니다!" -ForegroundColor Yellow
        Write-Host "   📝 .env 파일을 편집하고 유효한 API 키를 설정하세요." -ForegroundColor Yellow
    }
}

# 3. 서버 시작
Write-Host ""
Write-Host "🚀 서버 시작 중..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📡 백엔드 서버를 시작하는 중... (포트 3001)" -ForegroundColor Cyan
Write-Host "💡 팁: Ctrl+C를 누르면 서버가 중지됩니다." -ForegroundColor Gray
Write-Host ""

# 백엔드 서버 시작
Push-Location $backendDir

# .env 파일의 환경 변수를 읽어서 설정
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            if (-not [string]::IsNullOrEmpty($key)) {
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
                if ($key -eq "ANTHROPIC_API_KEY" -and $value -like "sk-ant-*") {
                    Write-Host "✅ $key 설정됨" -ForegroundColor Green
                }
            }
        }
    }
}

npm start

Pop-Location
