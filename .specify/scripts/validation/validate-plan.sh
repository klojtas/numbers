#!/bin/bash
# Validate implementation plan format

PLAN_FILE=$1

if [ -z "$PLAN_FILE" ]; then
    echo "Usage: $0 <path-to-plan.md>"
    exit 1
fi

echo "=== Validating $PLAN_FILE ==="

if [ ! -f "$PLAN_FILE" ]; then
    echo "❌ File not found: $PLAN_FILE"
    exit 1
fi

# Check required sections
required_sections=(
    "## Constitution Check"
    "## Technical Context"
    "## Project Structure"
    "## Complexity Tracking"
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
