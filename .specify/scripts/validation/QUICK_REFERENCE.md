# Quick Reference: Constitution Testing

## TypeScript Quality Checks

```bash
# Type checking
npx tsc --noEmit

# ESLint
npx eslint . --ext .ts,.tsx

# Prettier
npx prettier --check "**/*.{ts,tsx}"

# Fix all
npx eslint . --ext .ts,.tsx --fix && npx prettier --write "**/*.{ts,tsx}"
```

## One-Liner Commands

### PowerShell (Windows)

```powershell
# Run all validation checks
.\.specify\scripts\validation\simulate-ci.ps1

# Validate constitution only
.\.specify\scripts\validation\validate-constitution.ps1

# Validate a specific spec
.\.specify\scripts\validation\validate-spec.ps1 -SpecFile "specs/001-feature/spec.md"

# Validate a specific plan
.\.specify\scripts\validation\validate-plan.ps1 -PlanFile "specs/001-feature/plan.md"
```

### Bash (Linux/macOS)

```bash
# Run all validation checks
./.specify/scripts/validation/simulate-ci.sh

# Validate constitution only
./.specify/scripts/validation/validate-constitution.sh

# Validate a specific spec
./.specify/scripts/validation/validate-spec.sh specs/001-feature/spec.md

# Validate a specific plan
./.specify/scripts/validation/validate-plan.sh specs/001-feature/plan.md
```

## Quick Checks

### View Constitution Version

```powershell
# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern "Version.*:"

# Bash
grep -E "Version.*:" .specify/memory/constitution.md
```

### List Principles

```powershell
# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern "^### [IVX]+\."

# Bash
grep -E "^### [IVX]+\." .specify/memory/constitution.md
```

### Check for Placeholders

```powershell
# PowerShell
Select-String -Path ".specify/memory/constitution.md" -Pattern '\[.*\]' | Where-Object { $_.Line -notmatch "^#" }

# Bash
grep -E '\[.*\]' .specify/memory/constitution.md | grep -v "^#"
```

## Pre-Commit Checklist

- [ ] Constitution principles followed
- [ ] TypeScript compiles: `tsc --noEmit` ✅
- [ ] ESLint passes: `eslint . --ext .ts,.tsx` ✅
- [ ] Prettier formatted: `prettier --check` ✅
- [ ] Tests written BEFORE implementation
- [ ] All tests passing
- [ ] UI follows Material Design
- [ ] Local validation passed: `simulate-ci.ps1`
- [ ] Documentation updated
- [ ] Commit message follows convention

## GitHub Actions Status

Check workflow: Repository → Actions → "Constitution Compliance Validation"

**Expected Result**: ✅ All jobs passing

## Troubleshooting

| Issue                           | Solution                                            |
| ------------------------------- | --------------------------------------------------- |
| "Constitution file not found"   | Verify you're in repo root: `pwd` or `Get-Location` |
| "Invalid version format"        | Use semantic versioning: `1.0.0` not `v1.0`         |
| "Placeholder tokens found"      | Replace all `[PLACEHOLDER]` with actual values      |
| Workflow fails but local passes | Check file line endings (CRLF vs LF)                |

## Files to Know

- **Constitution**: `.specify/memory/constitution.md`
- **Testing Guide**: `TESTING.md`
- **CI Workflow**: `.github/workflows/validate-constitution.yml`
- **Validation Scripts**: `.specify/scripts/validation/`

## Constitution Principles (v1.1.0)

1. **Focus-Driven** - Features serve core mission
2. **Test-First** - TDD mandatory (NON-NEGOTIABLE)
3. **Quality Gates** - Automated checks required
4. **Simplicity** - Justify complexity
5. **Documentation** - Document decisions
6. **UI Development** - Simple, readable, Material Design
7. **TypeScript** - Strict type safety (NON-NEGOTIABLE)

---

For full documentation, see [TESTING.md](../../../TESTING.md)
