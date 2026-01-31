# Validate implementation plan format

param(
    [Parameter(Mandatory=$true)]
    [string]$PlanFile
)

$ErrorActionPreference = "Stop"

Write-Host "=== Validating $PlanFile ===" -ForegroundColor Cyan

if (-not (Test-Path $PlanFile)) {
    Write-Host "❌ File not found: $PlanFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $PlanFile -Raw

# Check required sections
$requiredSections = @(
    "## Constitution Check",
    "## Technical Context",
    "## Project Structure",
    "## Complexity Tracking"
)

foreach ($section in $requiredSections) {
    if ($content -notmatch [regex]::Escape($section)) {
        Write-Host "❌ Missing section: $section" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Found: $section" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Plan validation PASSED" -ForegroundColor Green

exit 0
