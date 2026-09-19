# StockFlow — Agent Instructions

## 1. Project Context

StockFlow is a full-stack inventory and operational business-finance management system.

The project is based on the existing shadcn-admin template and must evolve from the existing codebase rather than being rebuilt from scratch.

The primary goal is to create a functional, maintainable, demo-ready application that can run locally first and be deployed later.

---

## 2. Core Principles

### Preserve Before Replacing

Before creating a new implementation:

1. Inspect the existing codebase.
2. Identify reusable components, layouts, routes, utilities, hooks, types, and patterns.
3. Reuse existing shadcn/ui components and established project conventions whenever practical.
4. Modify existing functionality when it already provides a suitable foundation.
5. Do not replace working architecture without a documented technical reason.

Do not rebuild the admin template from scratch.

---

## 3. Read Project Documentation First

Before making implementation changes, read:

* `AGENTS.md`
* `PROJECT_SPEC.md`
* `DATABASE.md` if it exists
* `UI_GUIDELINES.md` if it exists

These documents define the project's requirements and development rules.

If requirements conflict, stop and ask for clarification instead of guessing.

---

## 4. Development Workflow

Follow this workflow for substantial tasks:

### Phase 1 — Understand

Inspect the relevant existing code and determine:

* Current architecture
* Existing routes
* Existing components
* Existing state management
* Existing data fetching patterns
* Existing authentication
* Existing styling/theme system
* Existing dependencies
* Existing mock/demo data

### Phase 2 — Plan

Before implementation:

1. Explain the files/components that need to change.
2. Explain the data flow.
3. Explain important dependencies or architectural decisions.
4. Identify potential risks.
5. Identify anything that should be removed or replaced.

For large changes, wait for approval before implementing.

### Phase 3 — Implement

Implement incrementally.

After each meaningful change:

1. Run relevant type checks.
2. Run linting when applicable.
3. Run tests when applicable.
4. Fix errors before continuing.

### Phase 4 — Verify

Verify:

* TypeScript compilation
* Application build
* Relevant tests
* Routes
* Forms
* Loading states
* Empty states
* Error states
* Responsive behavior
* Accessibility
* Data consistency

Do not consider a feature complete simply because the UI renders.

---

## 5. Do Not Guess Requirements

Never invent business requirements when the specification is unclear.

If a feature, role, permission, database relationship, financial behavior, or workflow is ambiguous:

* identify the ambiguity
* explain the possible interpretations
* ask for clarification

Do not silently choose a business rule that could affect data integrity.

---

## 6. Database Rules

StockFlow uses PostgreSQL as the intended database.

Database design must prioritize:

* Data integrity
* Clear relationships
* Appropriate foreign keys
* Appropriate indexes
* Consistent naming
* Validation
* Auditability where appropriate

Do not create duplicate sources of truth for the same business data.

Inventory and financial data must remain consistent.

For example:

* Stock In should affect inventory quantities.
* Stock Out should affect inventory quantities.
* Financial transactions related to inventory operations must follow the business rules defined in `PROJECT_SPEC.md`.
* Inventory history should preserve meaningful stock movement records.

Do not implement financial behavior based on assumptions.

---

## 7. Frontend Rules

The existing frontend stack is authoritative unless there is a strong technical reason to change it.

Current stack includes:

* React
* TypeScript
* Vite
* TanStack Router
* TanStack Query
* TanStack Table
* Tailwind CSS
* shadcn/ui
* Radix UI
* React Hook Form
* Zod
* Zustand
* Axios
* Recharts
* Lucide React

Prefer existing project libraries and patterns.

Do not introduce another framework or major library when the existing stack can solve the problem.

Do not migrate the project to Next.js unless explicitly requested.

---

## 8. UI/UX Rules

StockFlow should retain the overall design philosophy and usability of the existing shadcn-admin template while adapting its branding, colors, navigation, content, and business workflows.

Prioritize:

* Clear information hierarchy
* Consistent spacing
* Consistent typography
* Reusable components
* Responsive layouts
* Accessible interactions
* Clear feedback
* Useful empty states
* Useful loading states
* Useful error states
* Efficient data-heavy workflows

Avoid unnecessary visual complexity.

Do not add animations merely for decoration.

---

## 9. Component Reuse

Before creating a new component, check whether an existing component can be reused or extended.

Prefer:

* Existing UI primitives
* Existing layout components
* Existing table patterns
* Existing form patterns
* Existing modal/dialog patterns
* Existing navigation patterns
* Existing chart patterns

Create new abstractions only when they provide meaningful reuse or improve maintainability.

---

## 10. Dependency Rules

Do not install dependencies automatically.

Before adding a new dependency:

1. Check whether the existing stack already provides the required functionality.
2. Explain why the dependency is necessary.
3. Prefer lightweight and well-maintained solutions.
4. Avoid duplicate libraries that solve the same problem.

Do not add packages simply because they are popular.

---

## 11. TypeScript Rules

Use strict, maintainable TypeScript.

Avoid:

* `any` unless genuinely unavoidable
* unnecessary type assertions
* duplicated types
* hidden type coercion
* ignoring TypeScript errors

Prefer shared domain types where appropriate.

Keep business logic typed and predictable.

---

## 12. Forms and Validation

Use the existing form architecture where possible.

Validate user input at appropriate boundaries.

Use schema validation for important forms and API boundaries.

User-facing validation messages should be clear and actionable.

Do not rely exclusively on frontend validation for data integrity.

---

## 13. API and Data Fetching

Use the project's established data-fetching architecture.

Prefer TanStack Query for server state where appropriate.

Separate:

* UI state
* Server state
* Domain/business logic

Do not put large amounts of business logic directly inside page components.

Handle:

* loading
* success
* empty
* error
* retry

states appropriately.

---

## 14. Security

Never expose secrets in source code.

Never commit:

* API keys
* database passwords
* authentication secrets
* private tokens
* `.env` files containing secrets

Use environment variables for sensitive configuration.

Do not disable security mechanisms simply to make development easier.

Authentication and authorization must be treated separately.

A user interface restriction is not sufficient authorization.

---

## 15. Roles and Permissions

Respect the role definitions in `PROJECT_SPEC.md`.

Do not assume that hiding a UI element is sufficient permission control.

Authorization must eventually be enforced at the appropriate backend/API boundary.

Do not invent new roles without approval.

---

## 16. Financial Data

Financial features require extra care.

Do not silently change:

* transaction amounts
* balances
* payable/receivable status
* inventory valuation
* transaction relationships

Avoid floating-point arithmetic for monetary calculations where the backend/database supports a safer representation.

Financial calculations should be deterministic and traceable.

---

## 17. Inventory Data

Inventory quantities must have a clear source of truth.

Avoid directly manipulating stock quantities in multiple unrelated places.

Stock movements should be traceable.

Important inventory operations should preserve sufficient history for debugging and auditing.

Prevent impossible states such as unintended negative stock unless explicitly allowed by the specification.

---

## 18. Error Handling

Do not hide errors.

Provide useful error handling for:

* API failures
* validation failures
* database failures
* authentication failures
* permission failures
* network failures

Do not use silent catch blocks.

---

## 19. Testing

Tests should focus on meaningful behavior.

Prioritize testing:

* Business rules
* Inventory calculations
* Financial calculations
* Permission boundaries
* Important forms
* API behavior
* Critical user flows

Do not create meaningless tests solely to increase test count.

---

## 20. Code Quality

Prefer simple, readable code over clever abstractions.

Avoid:

* unnecessary abstraction
* premature optimization
* duplicated business logic
* giant components
* giant utility files
* magic numbers
* unexplained constants
* dead code

Keep modules focused.

---

## 21. Git Rules

Do not perform destructive Git operations unless explicitly approved.

Never automatically:

* delete branches
* rewrite history
* force push
* reset user work
* remove uncommitted changes

Before potentially destructive operations, explain what will happen and ask for approval.

Keep commits meaningful and focused.

---

## 22. Agent Behavior

Do not start coding immediately when given a large feature request.

For substantial tasks:

1. Inspect first.
2. Understand existing architecture.
3. Check the specification.
4. Plan the implementation.
5. Present the plan.
6. Wait for approval when appropriate.
7. Implement.
8. Test.
9. Report what changed.

Do not modify unrelated files.

Do not refactor unrelated code merely because it could be improved.

Do not create placeholder functionality and present it as complete functionality.

---

## 23. Definition of Done

A feature is considered complete only when:

* The intended functionality works.
* The implementation follows the project architecture.
* Types are valid.
* Relevant validation exists.
* Relevant error states exist.
* Relevant loading and empty states exist.
* Permissions are considered.
* Tests or verification have been performed.
* No unnecessary dependencies were introduced.
* No unrelated functionality was broken.

---

## 24. Important Rule

When uncertain:

**Inspect first. Ask second. Implement third.**

Never guess important business requirements.
Never rewrite working architecture without a reason.
Never sacrifice data integrity for speed.
Never claim a feature is complete without verification.
