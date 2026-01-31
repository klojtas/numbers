# Testing Guide for Numbers Project

This document describes how to validate the project constitution and ensure compliance both locally and in the CI/CD pipeline.

## Table of Contents

- [Overview](#overview)
- [Constitution Compliance](#constitution-compliance)
- [TypeScript Quality Checks](#typescript-quality-checks)
- [Local Testing](#local-testing)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Validation Checklist](#validation-checklist)
- [Troubleshooting](#troubleshooting)

## Overview

The Numbers project follows a constitution-based development approach. All features, implementations, and changes must comply with the principles defined in [.specify/memory/constitution.md](.specify/memory/constitution.md).

### Key Principles

1. **Focus-Driven Development** - Features must serve the core mission
2. **Test-First Development** - TDD is mandatory (NON-NEGOTIABLE)
3. **Quality Gates** - Automated checks must pass before merge
4. **Simplicity and YAGNI** - Complexity must be justified
5. **Documentation and Transparency** - Decisions must be documented

## Constitution Compliance

### Constitution Structure Validation

The constitution must maintain specific structure and versioning:

- **Version**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Ratification Date**: ISO format (YYYY-MM-DD)
- **Last Amended Date**: ISO format (YYYY-MM-DD)
- **No Placeholder Tokens**: All `[PLACEHOLDER]` tokens must be replaced

### Required Project Structure

```
.specify/
├── memory/
│   └── constitution.md          # Project constitution
└── templates/
    ├── plan-template.md         # Implementation plan template
    ├── spec-template.md         # Feature specification template
    └── tasks-template.md        # Task list template

specs/                           # Feature specifications (when applicable)
├── [###-feature-name]/
│   ├── spec.md                 # Feature specification
│   ├── plan.md                 # Implementation plan
│   ├── tasks.md                # Task list
│   ├── data-model.md           # Data models
│   └── contracts/              # API contracts

src/                            # Source code (when applicable)
tests/                          # Test code (when applicable)
├── unit/                       # Unit tests
├── integration/                # Integration tests
└── contract/                   # Contract tests
```

## Local Testing

### Prerequisites

- Git installed
- Bash/PowerShell terminal
- Text editor or IDE

### Validation Scripts

#### 1. Validate Constitution Format

**Bash/Linux/macOS:**

```bash
#!/bin/bash

echo "=== Constitution Validation ==="

# Check constitution exists
if [ ! -f ".specify/memory/constitution.md" ]; then
    echo "❌ Constitution file not found"
    exit 1
fi
echo "✅ Constitution exists"

# Check version format
if ! grep -E "Version.*: [0-9]+\.[0-9]+\.[0-9]+" .specify/memory/constitution.md; then
    echo "❌ Invalid version format"
    exit 1
fi
echo "✅ Version format valid"

# Check date formats
if ! grep -E "Ratified.*: [0-9]{4}-[0-9]{2}-[0-9]{2}" .specify/memory/constitution.md; then
    echo "❌ Invalid ratification date"
    exit 1
fi
echo "✅ Ratification date valid"

if ! grep -E "Last Amended.*: [0-9]{4}-[0-9]{2}-[0-9]{2}" .specify/memory/constitution.md; then
    echo "❌ Invalid last amended date"
    exit 1
fi
echo "✅ Last amended date valid"

# Check for placeholder tokens
if grep -E '\[PROJECT_NAME\]|\[PRINCIPLE_[0-9]+_NAME\]|\[SECTION_[0-9]+_NAME\]' .specify/memory/constitution.md; then
    echo "❌ Found unfilled placeholders"
    exit 1
fi
echo "✅ No placeholders found"

echo ""
echo "✅ Constitution validation PASSED"
```

**PowerShell/Windows:**

```powershell
Write-Host "=== Constitution Validation ===" -ForegroundColor Cyan

# Check constitution exists
if (-not (Test-Path ".specify/memory/constitution.md")) {
    Write-Host "❌ Constitution file not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Constitution exists" -ForegroundColor Green

# Check version format
$content = Get-Content ".specify/memory/constitution.md" -Raw
if ($content -notmatch "Version.*: \d+\.\d+\.\d+") {
    Write-Host "❌ Invalid version format" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Version format valid" -ForegroundColor Green

# Check date formats
if ($content -notmatch "Ratified.*: \d{4}-\d{2}-\d{2}") {
    Write-Host "❌ Invalid ratification date" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ratification date valid" -ForegroundColor Green

if ($content -notmatch "Last Amended.*: \d{4}-\d{2}-\d{2}") {
    Write-Host "❌ Invalid last amended date" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Last amended date valid" -ForegroundColor Green

# Check for placeholder tokens
if ($content -match '\[PROJECT_NAME\]|\[PRINCIPLE_\d+_NAME\]|\[SECTION_\d+_NAME\]') {
    Write-Host "❌ Found unfilled placeholders" -ForegroundColor Red
    exit 1
}
Write-Host "✅ No placeholders found" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Constitution validation PASSED" -ForegroundColor Green
```

Save the appropriate script and run it:

```bash
# Bash
chmod +x validate-constitution.sh
./validate-constitution.sh

# PowerShell
.\validate-constitution.ps1
```

#### 2. Validate Feature Specifications

When creating a new feature, validate the specification:

**Bash:**

```bash
#!/bin/bash

SPEC_FILE=$1

if [ -z "$SPEC_FILE" ]; then
    echo "Usage: ./validate-spec.sh <path-to-spec.md>"
    exit 1
fi

echo "=== Validating $SPEC_FILE ==="

# Check required sections
required_sections=(
    "## User Scenarios & Testing"
    "## Requirements"
    "## Success Criteria"
)

for section in "${required_sections[@]}"; do
    if ! grep -q "$section" "$SPEC_FILE"; then
        echo "❌ Missing section: $section"
        exit 1
    fi
    echo "✅ Found: $section"
done

echo ""
echo "✅ Specification validation PASSED"
```

**PowerShell:**

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$SpecFile
)

Write-Host "=== Validating $SpecFile ===" -ForegroundColor Cyan

if (-not (Test-Path $SpecFile)) {
    Write-Host "❌ File not found: $SpecFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $SpecFile -Raw

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

Write-Host ""
Write-Host "✅ Specification validation PASSED" -ForegroundColor Green
```

#### 3. Validate Implementation Plans

**Bash:**

```bash
#!/bin/bash

PLAN_FILE=$1

if [ -z "$PLAN_FILE" ]; then
    echo "Usage: ./validate-plan.sh <path-to-plan.md>"
    exit 1
fi

echo "=== Validating $PLAN_FILE ==="

# Check required sections
required_sections=(
    "## Constitution Check"
    "## Technical Context"
    "## Project Structure"
)

for section in "${required_sections[@]}"; do
    if ! grep -q "$section" "$PLAN_FILE"; then
        echo "❌ Missing section: $section"
        exit 1
    fi
    echo "✅ Found: $section"
done

echo ""
echo "✅ Plan validation PASSED"
```

**PowerShell:**

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$PlanFile
)

Write-Host "=== Validating $PlanFile ===" -ForegroundColor Cyan

if (-not (Test-Path $PlanFile)) {
    Write-Host "❌ File not found: $PlanFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $PlanFile -Raw

$requiredSections = @(
    "## Constitution Check",
    "## Technical Context",
    "## Project Structure"
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
```

### Quick Validation Commands

#### Check Constitution Version

```bash
# Bash
grep -E "Version.*:" .specify/memory/constitution.md

# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern "Version.*:"
```

#### List All Principles

```bash
# Bash
grep -E "^### [IVX]+\." .specify/memory/constitution.md

# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern "^### [IVX]+\."
```

#### Find Unfilled Placeholders

```bash
# Bash
grep -E '\[.*\]' .specify/memory/constitution.md | grep -v "^\#" | grep -v "^\<"

# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern '\[.*\]' | 
    Where-Object { $_.Line -notmatch "^#" -and $_.Line -notmatch "^<" }
```

## GitHub Actions CI/CD

### Workflow Overview

The project uses GitHub Actions for automated constitution compliance validation. The workflow is defined in [.github/workflows/validate-constitution.yml](.github/workflows/validate-constitution.yml).

### Workflow Jobs

1. **validate-structure**: Checks constitution file format and template existence
2. **typescript-quality**: Validates TypeScript code quality (type checking, ESLint, Prettier)
3. **validate-specs**: Validates feature specification format
4. **validate-plans**: Validates implementation plan compliance
5. **validate-test-coverage**: Checks test directory structure
6. **validate-documentation**: Ensures README and testing docs exist
7. **ui-quality**: Validates Material Design framework usage
8. **summary**: Provides overall validation status

### Trigger Events

The workflow runs on:

- **Pull Requests**: To `main` or `develop` branches
- **Pushes**: To `main` or `develop` branches
- **Manual Trigger**: Via workflow_dispatch

### Viewing Results

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Constitution Compliance Validation" workflow
4. View the latest run results

### Understanding Results

- ✅ **Green checkmark**: All validations passed
- ❌ **Red X**: Validation failed (check logs for details)
- ⚠️ **Yellow warning**: Non-critical issues found

### Local Simulation of CI Checks

To run the same checks locally before pushing:

**Bash:**

```bash
#!/bin/bash
# simulate-ci.sh

echo "=== Simulating GitHub Actions Checks ==="

# Job 1: Structure
echo ""
echo "--- Validate Structure ---"
./validate-constitution.sh || exit 1

# Job 2: Specs
echo ""
echo "--- Validate Specs ---"
if [ -d "specs" ]; then
    for spec in $(find specs -name "spec.md" -type f); do
        ./validate-spec.sh "$spec" || exit 1
    done
else
    echo "No specs directory found"
fi

# Job 3: Plans
echo ""
echo "--- Validate Plans ---"
if [ -d "specs" ]; then
    for plan in $(find specs -name "plan.md" -type f); do
        ./validate-plan.sh "$plan" || exit 1
    done
else
    echo "No specs directory found"
fi

# Job 4: Documentation
echo ""
echo "--- Validate Documentation ---"
if [ ! -f "README.md" ]; then
    echo "❌ README.md not found"
    exit 1
fi
echo "✅ README.md exists"

echo ""
echo "✅ All CI checks PASSED locally"
```

**PowerShell:**

```powershell
# simulate-ci.ps1

Write-Host "=== Simulating GitHub Actions Checks ===" -ForegroundColor Cyan

# Job 1: Structure
Write-Host ""
Write-Host "--- Validate Structure ---" -ForegroundColor Yellow
& .\validate-constitution.ps1
if ($LASTEXITCODE -ne 0) { exit 1 }

# Job 2: Specs
Write-Host ""
Write-Host "--- Validate Specs ---" -ForegroundColor Yellow
if (Test-Path "specs") {
    Get-ChildItem -Path "specs" -Recurse -Filter "spec.md" | ForEach-Object {
        & .\validate-spec.ps1 -SpecFile $_.FullName
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }
} else {
    Write-Host "No specs directory found" -ForegroundColor Gray
}

# Job 3: Plans
Write-Host ""
Write-Host "--- Validate Plans ---" -ForegroundColor Yellow
if (Test-Path "specs") {
    Get-ChildItem -Path "specs" -Recurse -Filter "plan.md" | ForEach-Object {
        & .\validate-plan.ps1 -PlanFile $_.FullName
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }
} else {
    Write-Host "No specs directory found" -ForegroundColor Gray
}

# Job 4: Documentation
Write-Host ""
Write-Host "--- Validate Documentation ---" -ForegroundColor Yellow
if (-not (Test-Path "README.md")) {
    Write-Host "❌ README.md not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ README.md exists" -ForegroundColor Green

Write-Host ""
Write-Host "✅ All CI checks PASSED locally" -ForegroundColor Green
```

## Validation Checklist

Use this checklist before committing changes:

### Before Creating a New Feature

- [ ] Read the constitution ([.specify/memory/constitution.md](.specify/memory/constitution.md))
- [ ] Ensure feature aligns with Focus-Driven Development principle
- [ ] Verify TypeScript and Material Design requirements are understood
- [ ] Create feature specification (spec.md) with user scenarios
- [ ] Define acceptance criteria in spec.md
- [ ] Run local spec validation

### During Feature Implementation

- [ ] Create implementation plan (plan.md)
- [ ] Complete Constitution Check section in plan.md
- [ ] Justify any complexity in Complexity Tracking table
- [ ] Ensure TypeScript strict mode is enabled
- [ ] Configure ESLint and Prettier
- [ ] Setup Material Design framework (MUI/Vuetify)
- [ ] Write tests BEFORE implementation (Test-First principle)
- [ ] Ensure tests fail initially (Red phase)
- [ ] Implement to make tests pass (Green phase)
- [ ] Refactor while keeping tests passing (Refactor phase)
- [ ] Run local plan validation

### Before Submitting Pull Request

- [ ] All tests passing locally
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] UI components follow Material Design guidelines
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] Run local CI simulation script
- [ ] Constitution compliance verified
- [ ] Commit messages follow conventional format

### After Pull Request Created

- [ ] GitHub Actions workflow passes
- [ ] TypeScript quality checks pass
- [ ] UI quality checks pass
- [ ] Review any validation warnings
- [ ] Address reviewer feedback
- [ ] Ensure all quality gates pass

## Troubleshooting

### Common Issues

#### "Constitution file not found"

**Problem**: The constitution file doesn't exist at the expected path.

**Solution**:
```bash
# Check if file exists
ls -la .specify/memory/constitution.md

# If missing, ensure you're in the repository root
pwd

# Initialize constitution if needed
# (follow constitution creation process)
```

#### "Invalid version format"

**Problem**: The version doesn't follow semantic versioning (MAJOR.MINOR.PATCH).

**Solution**:
- Update the version line in constitution.md
- Format: `**Version**: X.Y.Z` (e.g., `1.0.0`)
- See [Semantic Versioning](https://semver.org/)

#### "Found unfilled placeholders"

**Problem**: Template placeholders like `[PROJECT_NAME]` weren't replaced.

**Solution**:
- Search for `[` in constitution.md
- Replace all placeholder tokens with actual values
- Ensure no template comments remain in final document

#### "Missing Constitution Check section"

**Problem**: Implementation plan doesn't include constitution compliance check.

**Solution**:
- Add `## Constitution Check` section to plan.md
- List relevant principles that apply
- Document any violations in Complexity Tra
- Check Node.js version compatibility

#### "TypeScript compilation failed"

**Problem**: Type errors in TypeScript code.

**Solution**:
```bash
# Run type checking locally
npx tsc --noEmit

# Enable detailed error output
npx tsc --noEmit --pretty

# Check specific file
npx tsc --noEmit path/to/file.ts
```

#### "ESLint validation failed"

**Problem**: Code doesn't meet linting standards.

**Solution**:
```bash
# See detailed errors
npx eslint . --ext .ts,.tsx

# Auto-fix issues
npx eslint . --ext .ts,.tsx --fix

# Check specific file
npx eslint path/to/file.ts
```

##Constitution Version**: 1.1.0  
**Changes in v1.1.0**: Added TypeScript and UI development standardsing check failed"

**Problem**: Code isn't formatted according to Prettier rules.

**Solution**:
```bash
# Format all files
npx prettier --write "**/*.{ts,tsx,json,md}"

# Check what would be formatted
npx prettier --check "**/*.{ts,tsx}"
```

#### "Strict mode not enabled"

**Problem**: tsconfig.json doesn't have strict mode enabled.

**Solution**:
- Open `tsconfig.json`
- Add or modify: `"strict": true` in compilerOptions
- Run `tsc --noEmit` to see new errors
- Fix type errors before committingcking table

#### GitHub Actions workflow fails but local validation passes

**Problem**: Environment differences between local and CI.

**Solution**:
- Check the workflow logs in GitHub Actions
- Look for path issues (Windows vs. Linux paths)
- Verify file line endings (CRLF vs. LF)
- Ensure all files are committed and pushed

### Getting Help

1. **Check Constitution**: Review [.specify/memory/constitution.md](.specify/memory/constitution.md)
2. **Review Templates**: Check [.specify/templates/](.specify/templates/)
3. **Examine Workflow**: See [.github/workflows/validate-constitution.yml](.github/workflows/validate-constitution.yml)
4. **Run Verbose Validation**: Add debug output to validation scripts

### Debug Mode

Add `-x` flag to bash scripts for detailed execution:

```bash
bash -x validate-constitution.sh
```

For PowerShell, add verbose output:

```powershell
$VerbosePreference = "Continue"
.\validate-constitution.ps1
```

## Additional Resources

- [Constitution File](.specify/memory/constitution.md)
- [Template Files](.specify/templates/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Last Updated**: 2026-01-31  
**Version**: 1.0.0
