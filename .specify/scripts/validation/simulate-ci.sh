#!/bin/bash
# Simulate GitHub Actions checks locally

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Simulating GitHub Actions Checks ==="
echo ""

# Job 1: Structure
echo "--- Job 1: Validate Structure ---"
bash "$SCRIPT_DIR/validate-constitution.sh"
echo ""

# Check templates
echo "Checking required templates..."
required_templates=(
    ".specify/templates/plan-template.md"
    ".specify/templates/spec-template.md"
    ".specify/templates/tasks-template.md"
)

for template in "${required_templates[@]}"; do
    if [ ! -f "$template" ]; then
        echo "❌ Required template not found: $template"
        exit 1
    fi
    echo "✅ Template exists: $template"
done
echo ""

# Job 2: Specs
echo "--- Job 2: Validate Specs ---"
if [ -d "specs" ]; then
    spec_count=$(find specs -name "spec.md" -type f | wc -l)
    echo "Found $spec_count spec file(s)"
    
    if [ "$spec_count" -gt 0 ]; then
        for spec in $(find specs -name "spec.md" -type f); do
            bash "$SCRIPT_DIR/validate-spec.sh" "$spec"
        done
    fi
else
    echo "No specs directory found (skipping)"
fi
echo ""

# Job 3: Plans
echo "--- Job 3: Validate Plans ---"
if [ -d "specs" ]; then
    plan_count=$(find specs -name "plan.md" -type f | wc -l)
    echo "Found $plan_count plan file(s)"
    
    if [ "$plan_count" -gt 0 ]; then
        for plan in $(find specs -name "plan.md" -type f); do
            bash "$SCRIPT_DIR/validate-plan.sh" "$plan"
        done
    fi
else
    echo "No specs directory found (skipping)"
fi
echo ""

# Job 4: Documentation
echo "--- Job 4: Validate Documentation ---"
if [ ! -f "README.md" ]; then
    echo "❌ README.md not found"
    exit 1
fi
echo "✅ README.md exists"

if [ -f "TESTING.md" ]; then
    echo "✅ TESTING.md exists"
else
    echo "⚠️  TESTING.md not found"
fi
echo ""

echo "=== Summary ==="
echo "✅ All CI checks PASSED locally"
