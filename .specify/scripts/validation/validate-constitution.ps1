# Validate constitution format and content

$ErrorActionPreference = "Stop"

Write-Host "=== Constitution Validation ===" -ForegroundColor Cyan

# Check constitution exists
if (-not (Test-Path ".specify/memory/constitution.md")) {
    Write-Host "❌ Constitution file not found at .specify/memory/constitution.md" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Constitution exists" -ForegroundColor Green

# Check version format
$content = Get-Content ".specify/memory/constitution.md" -Raw
if ($content -notmatch "Version.*: \d+\.\d+\.\d+") {
    Write-Host "❌ Invalid version format (expected: X.Y.Z)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Version format valid" -ForegroundColor Green

# Check date formats
if ($content -notmatch "Ratified.*: \d{4}-\d{2}-\d{2}") {
    Write-Host "❌ Invalid ratification date (expected: YYYY-MM-DD)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ratification date valid" -ForegroundColor Green

if ($content -notmatch "Last Amended.*: \d{4}-\d{2}-\d{2}") {
    Write-Host "❌ Invalid last amended date (expected: YYYY-MM-DD)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Last amended date valid" -ForegroundColor Green

# Check for placeholder tokens
$placeholders = @(
    '\[PROJECT_NAME\]',
    '\[PRINCIPLE_\d+_NAME\]',
    '\[PRINCIPLE_\d+_DESCRIPTION\]',
    '\[SECTION_\d+_NAME\]',
    '\[SECTION_\d+_CONTENT\]',
    '\[GOVERNANCE_RULES\]',
    '\[CONSTITUTION_VERSION\]',
    '\[RATIFICATION_DATE\]',
    '\[LAST_AMENDED_DATE\]'
)

$pattern = $placeholders -join '|'
if ($content -match $pattern) {
    Write-Host "❌ Found unfilled placeholder tokens in constitution:" -ForegroundColor Red
    Select-String -Path ".specify/memory/constitution.md" -Pattern $pattern
    exit 1
}
Write-Host "✅ No placeholder tokens found" -ForegroundColor Green

# Check for required sections
$requiredSections = @(
    "## Core Principles",
    "## Governance"
)

foreach ($section in $requiredSections) {
    if ($content -notmatch [regex]::Escape($section)) {
        Write-Host "❌ Missing required section: $section" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ All required sections present" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Constitution validation PASSED" -ForegroundColor Green

exit 0
