#!/bin/bash
# Validate constitution format and content

set -e

echo "=== Constitution Validation ==="

# Check constitution exists
if [ ! -f ".specify/memory/constitution.md" ]; then
    echo "❌ Constitution file not found at .specify/memory/constitution.md"
    exit 1
fi
echo "✅ Constitution exists"

# Check version format
if ! grep -E "Version.*: [0-9]+\.[0-9]+\.[0-9]+" .specify/memory/constitution.md > /dev/null; then
    echo "❌ Invalid version format (expected: X.Y.Z)"
    exit 1
fi
echo "✅ Version format valid"

# Check date formats
if ! grep -E "Ratified.*: [0-9]{4}-[0-9]{2}-[0-9]{2}" .specify/memory/constitution.md > /dev/null; then
    echo "❌ Invalid ratification date (expected: YYYY-MM-DD)"
    exit 1
fi
echo "✅ Ratification date valid"

if ! grep -E "Last Amended.*: [0-9]{4}-[0-9]{2}-[0-9]{2}" .specify/memory/constitution.md > /dev/null; then
    echo "❌ Invalid last amended date (expected: YYYY-MM-DD)"
    exit 1
fi
echo "✅ Last amended date valid"

# Check for placeholder tokens
if grep -E '\[PROJECT_NAME\]|\[PRINCIPLE_[0-9]+_NAME\]|\[PRINCIPLE_[0-9]+_DESCRIPTION\]|\[SECTION_[0-9]+_NAME\]|\[SECTION_[0-9]+_CONTENT\]|\[GOVERNANCE_RULES\]|\[CONSTITUTION_VERSION\]|\[RATIFICATION_DATE\]|\[LAST_AMENDED_DATE\]' .specify/memory/constitution.md > /dev/null; then
    echo "❌ Found unfilled placeholder tokens in constitution:"
    grep -E '\[PROJECT_NAME\]|\[PRINCIPLE_[0-9]+_NAME\]|\[SECTION_[0-9]+_NAME\]' .specify/memory/constitution.md
    exit 1
fi
echo "✅ No placeholder tokens found"

# Check for required sections
required_sections=(
    "## Core Principles"
    "## Governance"
)

for section in "${required_sections[@]}"; do
    if ! grep -q "$section" .specify/memory/constitution.md; then
        echo "❌ Missing required section: $section"
        exit 1
    fi
done
echo "✅ All required sections present"

echo ""
echo "✅ Constitution validation PASSED"
