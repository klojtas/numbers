# Validate feature specification format

param(
    [Parameter(Mandatory=$true)]
    [string]$SpecFile
)

$ErrorActionPreference = "Stop"

Write-Host "=== Validating $SpecFile ===" -ForegroundColor Cyan

if (-not (Test-Path $SpecFile)) {
    Write-Host "❌ File not found: $SpecFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $SpecFile -Raw

# Check required sections
$requiredSections = @(
    "## User Scenarios & Testing",
    "## Requirements",
    "## Success Criteria"
)

foreach ($section in $requiredSections) {
    if ($content -notmatch [regex]::Escape($section)) {
        Write-Host "❌ Missing section: $section" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Found: $section" -ForegroundColor Green
}

# Check for user stories with priorities
if ($content -notmatch "Priority: P\d") {
    Write-Host "⚠️  Warning: No user stories with priorities found (expected 'Priority: P1', etc.)" -ForegroundColor Yellow
}

# Check for acceptance scenarios
if ($content -notmatch "Given.*When.*Then") {
    Write-Host "⚠️  Warning: No Given-When-Then scenarios found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Specification validation PASSED" -ForegroundColor Green

exit 0
