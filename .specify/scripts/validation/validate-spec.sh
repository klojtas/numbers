#!/bin/bash
# Validate feature specification format

SPEC_FILE=$1

if [ -z "$SPEC_FILE" ]; then
    echo "Usage: $0 <path-to-spec.md>"
    exit 1
fi

echo "=== Validating $SPEC_FILE ==="

if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ File not found: $SPEC_FILE"
    exit 1
fi

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

# Check for user stories with priorities
if ! grep -q "Priority: P[0-9]" "$SPEC_FILE"; then
    echo "⚠️  Warning: No user stories with priorities found (expected 'Priority: P1', etc.)"
fi

# Check for acceptance scenarios
if ! grep -q "Given.*When.*Then" "$SPEC_FILE"; then
    echo "⚠️  Warning: No Given-When-Then scenarios found"
fi

echo ""
echo "✅ Specification validation PASSED"
