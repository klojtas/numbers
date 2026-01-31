<!--
=== SYNC IMPACT REPORT ===
Version Change: 1.0.0 → 1.1.0
Amendment Type: MINOR (new principles and standards added)

Modified Principles:
  - Quality Gates (Principle III) - Expanded with TypeScript-specific checks

Added Principles:
  - VI. UI Development Standards (NEW)
  - VII. TypeScript Standards (NEW)

Added Sections:
  - Technology Stack section with TypeScript, UI framework requirements
  - UI/UX Guidelines with Material Design theming

Template Consistency Status:
  ✅ .specify/templates/plan-template.md - Constitution Check section already aligned
  ✅ .specify/templates/spec-template.md - User scenarios support UI workflows
  ✅ .specify/templates/tasks-template.md - Test tasks include UI component testing
  ✅ .github/workflows/validate-constitution.yml - Enhanced with TypeScript checks
  ✅ TESTING.md - Updated with TypeScript testing procedures

Changes from v1.0.0:
  - Added UI Development Standards principle
  - Added TypeScript Standards principle
  - Enhanced Quality Gates with TS/ESLint/Prettier requirements
  - Added Technology Stack section
  - Updated GitHub Actions workflow with TypeScript linting and type checking
  - All automated quality checks now include UI/TypeScript validation

Rationale for Version 1.1.0 (MINOR):
  - New principles added without removing existing ones
  - Backward compatible - existing principles unchanged
  - Material expansion of governance scope to include UI/TypeScript
  - No breaking changes to existing workflows
=== END SYNC IMPACT REPORT ===
-->

# Numbers Constitution

## Core Principles

### I. Focus-Driven Development

**All features MUST serve the core mission**: finding numbers efficiently.

- Features that dilute focus MUST be rejected or moved to separate projects
- Each component MUST have a single, clear responsibility related to number extraction or processing
- UI/UX MUST optimize for speed and accuracy in number identification
- Performance MUST be measured against the primary use case: finding numbers in various contexts

**Rationale**: A focused application delivers superior user experience by excelling at one task rather than attempting many tasks poorly.

### II. Test-First Development (NON-NEGOTIABLE)

**Test-Driven Development is MANDATORY for all code**:

- Tests MUST be written BEFORE implementation
- Tests MUST fail initially (Red phase)
- Implementation proceeds only to make tests pass (Green phase)
- Code MUST be refactored for quality after passing (Refactor phase)
- All user stories MUST have acceptance scenarios written before development begins

**Rationale**: TDD ensures code correctness, prevents regressions, enables confident refactoring, and serves as living documentation. This is non-negotiable to maintain code quality and reliability.

### III. Quality Gates

**All code changes MUST pass automated quality gates**:

- Automated tests MUST pass in CI/CD pipeline before merge
- Code coverage MUST meet minimum threshold (defined per project type)
- Linting and formatting checks MUST pass
- Integration tests MUST validate cross-component contracts
- Constitution compliance MUST be verified for new features

**Specific quality requirements**:

- Unit tests for all business logic
- Integration tests for component interactions
- Contract tests for all public APIs/interfaces
- End-to-end tests for critical user journeys

**Rationale**: Automated quality gates prevent defects from entering the codebase and maintain consistent code quality across all contributors.

### IV. Simplicity and YAGNI

**Complexity MUST be justified; simplicity is the default**:

- Implement only what is needed NOW (You Aren't Gonna Need It)
- Dependencies MUST be minimized and justified
- Abstractions MUST solve real, current problems (not hypothetical future ones)
- Architecture MUST start simple and evolve based on actual requirements
- Any complexity introduced MUST be documented in plan.md with justification

**Rationale**: Over-engineering wastes time, introduces bugs, and makes maintenance difficult. Simple solutions are easier to understand, test, and modify.

### V. Documentation and Transparency

**All design decisions and changes MUST be documented**:

- Feature specifications MUST exist before implementation begins (spec.md)
- Implementation plans MUST document technical approach (plan.md)
- Data models MUST be explicitly documented (data-model.md)
- API contracts MUST be defined before implementation (contracts/)
- Testing procedures MUST be documented for both local and CI/CD environments

**Rationale**: Documentation enables team collaboration, onboarding, maintenance, and provides context for future decisions.

### VI. UI Development Standards

**User interfaces MUST prioritize readability and user experience**:

- Code MUST be simple and readable - avoid clever abstractions in UI components
- UI components MUST follow Material Design principles
- Visual design MUST use Material-inspired theming for consistency
- Component structure MUST be logical and easy to navigate
- UI code MUST be self-documenting with clear component names

**Specific UI requirements**:

- Follow Material Design guidelines for spacing, typography, and colors
- Maintain consistent look and feel across all interfaces
- Prioritize accessibility (WCAG 2.1 AA minimum)
- Responsive design for multiple screen sizes
- Clear visual hierarchy and intuitive layouts

**Rationale**: Simple, readable UI code reduces bugs and maintenance burden. Material Design provides proven patterns for excellent user experience.

### VII. TypeScript Standards (NON-NEGOTIABLE)

**All code MUST be written in TypeScript with strict type safety**:

- TypeScript MUST be used for all JavaScript/Node.js code
- Strict mode MUST be enabled (`"strict": true` in tsconfig.json)
- Type definitions MUST be explicit - minimize use of `any`
- Interfaces and types MUST be defined for all data structures
- Type errors MUST be fixed - no `@ts-ignore` without justification

**TypeScript quality requirements**:

- All functions MUST have explicit return types
- All function parameters MUST have type annotations
- Generics MUST be used appropriately for reusable components
- Union types and type guards MUST be used for type safety
- ESLint with TypeScript rules MUST be configured and passing

**Rationale**: TypeScript prevents entire classes of runtime errors, improves IDE support, serves as living documentation, and enables safer refactoring.

## Technology Stack

**Required Technologies**:

- **Language**: TypeScript (strict mode)
- **UI Framework**: Material Design-based framework (Material-UI, Vuetify, or equivalent)
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest/Vitest for unit tests, Testing Library for component tests
- **Build**: Modern bundler (Vite, esbuild, or equivalent)

**Tooling Standards**:

- ESLint MUST be configured with TypeScript rules
- Prettier MUST enforce consistent formatting
- Pre-commit hooks SHOULD run linting and type checking
- All dependencies MUST be up-to-date and security-scanned

## Quality Standards

**Code Quality Requirements**:

- All production code MUST have corresponding tests
- Tests MUST be maintainable, readable, and fast
- Code MUST pass linting/formatting standards before commit
- TypeScript MUST compile without errors
- ESLint MUST pass with zero warnings in strict mode
- Prettier MUST format all code consistently
- Commit messages MUST follow conventional commit format
- Breaking changes MUST be clearly documented and versioned

**TypeScript Quality Gates**:

- `tsc --noEmit` MUST pass (no type errors)
- `eslint` MUST pass with TypeScript rules enabled
- `prettier --check` MUST pass for all TypeScript files
- Type coverage MUST be > 95% (minimal use of `any`)
- No `@ts-ignore` comments without documented justification

**UI Quality Gates**:

- Component tests MUST pass for all UI components
- Visual regression tests SHOULD be implemented for critical screens
- Accessibility audit MUST pass (axe-core or equivalent)
- Material Design guidelines MUST be followed
- Mobile responsiveness MUST be verified

**Testing Requirements**:

- Local testing MUST be documented and easily executable
- CI/CD pipeline MUST run all automated tests
- Integration tests MUST validate real-world scenarios
- UI component tests MUST verify rendering and interactions
- Type checking MUST run in CI/CD pipeline
- Test data MUST be representative and managed properly
- Test failures MUST block merges to main branch

## Development Workflow

**Feature Development Process**:

1. **Specification**: Create spec.md with user stories and acceptance criteria
2. **Planning**: Generate plan.md with technical approach and constitution check
3. **Design**: Document data models, APIs, and contracts
4. **Test Creation**: Write failing tests for all user stories
5. **Implementation**: Write code to make tests pass
6. **Refactoring**: Improve code quality while maintaining passing tests
7. **Validation**: Verify constitution compliance and quality gates
8. **Review**: Code review verifies test coverage and design alignment
9. **Integration**: Merge only after all gates pass

**Constitution Compliance**:

- All new features MUST pass constitution check in plan.md
- Violations MUST be justified in Complexity Tracking table
- Simpler alternatives MUST be evaluated before accepting complexity
- Regular reviews MUST verify ongoing compliance

## Governance

**Amendment Process**:

1. Proposed changes MUST be documented with rationale
2. Version number MUST be updated following semantic versioning:
   - MAJOR: Breaking changes to core principles or governance removal
   - MINOR: New1principles added or material expansions
   - PATCH: Clarifications, wording improvements, non-semantic changes
3. All affected templates and documentation MUST be updated for consistency
4. Changes MUST be reviewed and approved before ratification
5. Migration plan REQUIRED for breaking changes affecting existing work

**Compliance and Review**:

- All PRs MUST verify constitution compliance
- Regular audits MUST check adherence to principles
- Template files (.specify/templates/) MUST align with constitution
- Constitution supersedes all other project practices
- Exceptions require explicit justification in project documentation

**Version Control**:

- Ratification date MUST be preserved from initial adoption
- Last amended date MUST be updated with each change
- Version history MUST be tracked in git commits
- Sync Impact Report MUST be generated for each amendment

**Version**: 1.1.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31
