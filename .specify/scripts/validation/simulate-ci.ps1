# Simulate GitHub Actions checks locally

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== Simulating GitHub Actions Checks ===" -ForegroundColor Cyan
Write-Host ""

# Job 1: Structure
Write-Host "--- Job 1: Validate Structure ---" -ForegroundColor Yellow
& "$ScriptDir\validate-constitution.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host ""

# Check templates
Write-Host "Checking required templates..." -ForegroundColor Cyan
$requiredTemplates = @(
    ".specify/templates/plan-template.md",
    ".specify/templates/spec-template.md",
    ".specify/templates/tasks-template.md"
)

foreach ($template in $requiredTemplates) {
    if (-not (Test-Path $template)) {
        Write-Host "❌ Required template not found: $template" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Template exists: $template" -ForegroundColor Green
}
Write-Host ""

# Job 2: Specs
Write-Host "--- Job 2: Validate Specs ---" -ForegroundColor Yellow
if (Test-Path "specs") {
    $specs = Get-ChildItem -Path "specs" -Recurse -Filter "spec.md"
    Write-Host "Found $($specs.Count) spec file(s)" -ForegroundColor Cyan
    
    if ($specs.Count -gt 0) {
        foreach ($spec in $specs) {
            & "$ScriptDir\validate-spec.ps1" -SpecFile $spec.FullName
            if ($LASTEXITCODE -ne 0) { exit 1 }
        }
    }
} else {
    Write-Host "No specs directory found (skipping)" -ForegroundColor Gray
}
Write-Host ""

# Job 3: Plans
Write-Host "--- Job 3: Validate Plans ---" -ForegroundColor Yellow
if (Test-Path "specs") {
    $plans = Get-ChildItem -Path "specs" -Recurse -Filter "plan.md"
    Write-Host "Found $($plans.Count) plan file(s)" -ForegroundColor Cyan
    
    if ($plans.Count -gt 0) {
        foreach ($plan in $plans) {
            & "$ScriptDir\validate-plan.ps1" -PlanFile $plan.FullName
            if ($LASTEXITCODE -ne 0) { exit 1 }
        }
    }
} else {
    Write-Host "No specs directory found (skipping)" -ForegroundColor Gray
}
Write-Host ""

# Job 4: Documentation
Write-Host "--- Job 4: Validate Documentation ---" -ForegroundColor Yellow
if (-not (Test-Path "README.md")) {
    Write-Host "❌ README.md not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ README.md exists" -ForegroundColor Green

if (Test-Path "TESTING.md") {
    Write-Host "✅ TESTING.md exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  TESTING.md not found" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ All CI checks PASSED locally" -ForegroundColor Green
