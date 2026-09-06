# Frontend Development Guidelines --- Church Management Platform

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 1. Purpose

This document defines the engineering rules and development standards
that AI agents must follow when developing the frontend of the Church
Management Platform.

The frontend is a professional, modular, responsive web application
built with Next.js and TypeScript.

These rules exist to prevent: - monolithic page files - duplicated UI
logic - duplicated business logic - tightly coupled components -
inconsistent UX - uncontrolled state management - inaccessible
interfaces - unnecessary abstractions - architecture that becomes
difficult to maintain as the platform grows

The goal is not to maximize the number of files or abstractions. The
goal is to create a codebase that is easy for another professional
developer to understand, modify, test, and extend.

---

# 2. Source of Truth

The project requirements and module definitions are described in the
project planning document.

The frontend must support the platform's planned modules:

1.  Church Management
2.  Member Management
3.  Ministry Management
4.  Announcement Management
5.  Event Management
6.  Inventory Management
7.  Contribution Management
8.  Bible Studies Management
9.  Document Management

The initial interface language is Brazilian Portuguese (`pt-BR`).

The application must be responsive across desktop, tablet, and mobile.

The frontend must respect authentication, authorization, roles, and
permissions enforced by the backend.

The backend remains the final authority for authorization. Frontend
permission checks are for UX and navigation purposes and must never be
treated as a security boundary.

---

# 3. Non-Negotiable Architectural Rules

## 3.1 Never create a monolithic page

NEVER implement an entire application page inside a single file.

For example, this is prohibited:

```text
app/membros/page.tsx
  ├── table
  ├── filters
  ├── dialogs
  ├── forms
  ├── member cards
  ├── pagination
  ├── API calls
  ├── validation
  └── business logic
```

A page must primarily compose smaller components.

A good page should look conceptually like:

```tsx
export default function MembersPage() {
  return (
    <Page>
      <PageHeader />
      <MemberFilters />
      <MemberTable />
      <MemberPagination />
    </Page>
  );
}
```

The exact implementation may differ, but the principle is mandatory:

> Pages compose features; pages should not contain the entire
> implementation of those features.

---

# 4. Recommended Project Architecture

Use the Next.js App Router.

Prefer a feature-oriented architecture over a purely technical folder
structure.

A recommended structure is:

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── membros/
│   │   ├── ministerios/
│   │   ├── avisos/
│   │   ├── eventos/
│   │   ├── estoque/
│   │   ├── contribuicoes/
│   │   ├── estudos-biblicos/
│   │   ├── documentos/
│   │   └── configuracoes/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── members/
│   ├── ministries/
│   ├── announcements/
│   ├── events/
│   ├── inventory/
│   ├── contributions/
│   ├── bible-studies/
│   ├── documents/
│   ├── church/
│   └── users/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   ├── utils/
│   └── constants/
│
├── hooks/
│
├── types/
│
├── config/
│
└── providers/
```

This is a guideline, not an excuse to create empty folders.

Create a directory only when there is a real reason for it.

---

# 5. Page Responsibilities

A page is responsible for:

- defining the route
- composing the page layout
- loading route-specific data when appropriate
- passing data to feature components
- coordinating high-level page state

A page should NOT normally contain:

- large forms
- complex tables
- API implementation
- validation schemas
- reusable business logic
- complex filtering logic
- large modal implementations
- repeated UI structures

If a page becomes difficult to read because of implementation details,
extract those details into components or feature modules.

---

# 6. Feature-Based Organization

Each business domain should have its own feature boundary.

Example:

```text
features/members/
├── components/
│   ├── member-table.tsx
│   ├── member-filters.tsx
│   ├── member-form.tsx
│   ├── member-status-badge.tsx
│   └── member-profile.tsx
│
├── hooks/
│   ├── use-members.ts
│   └── use-member-filters.ts
│
├── services/
│   └── members.service.ts
│
├── schemas/
│   └── member.schema.ts
│
├── types/
│   └── member.types.ts
│
├── constants/
│   └── member.constants.ts
│
└── index.ts
```

Do not create every possible subdirectory by default.

Use the smallest structure that keeps responsibilities separated.

---

# 7. Component Design

Components must have a clear responsibility.

Prefer:

```text
MemberTable
MemberFilters
MemberForm
MemberProfile
MemberStatusBadge
```

over:

```text
MemberEverything
MemberPageContent
MemberManager
```

A component should answer one primary question:

> "What responsibility does this component own?"

If the answer is unclear, the component is probably doing too much.

---

# 8. Component Extraction Rules

Extract a component when:

- it is reused
- it represents a meaningful UI concept
- it has its own state
- it contains significant conditional rendering
- it has a meaningful interaction
- it makes the parent difficult to understand
- it belongs to a specific feature

Do NOT extract components simply because a piece of markup has five
lines.

Avoid both extremes:

```text
Bad:
Everything is inside one 800-line page.

Also bad:
Every <div> becomes its own component.
```

Use judgment.

---

# 9. Shared Components vs Feature Components

Use:

```text
components/ui/
```

for generic UI primitives.

Examples:

- Button
- Input
- Select
- Dialog
- Drawer
- Dropdown
- Table
- Tabs
- Badge
- Tooltip
- Skeleton

Use:

```text
features/members/components/
```

for components that understand the member domain.

Examples:

- MemberTable
- MemberForm
- MemberStatus
- MemberFilters

A generic `Table` must not contain member-specific logic.

---

# 10. Do Not Duplicate Components

Before creating a new component, search the existing codebase.

If a suitable component already exists:

> Reuse it.

If it is almost suitable:

> Determine whether it should be improved or generalized.

Do not create:

```text
Button.tsx
PrimaryButton.tsx
CustomButton.tsx
MemberButton.tsx
ActionButton.tsx
```

when one well-designed button component can handle the use cases.

---

# 11. Server and Client Components

Use Server Components by default when working with the Next.js App
Router.

Use Client Components only when client-side behavior is actually
required.

Client Components are appropriate for functionality such as:

- interactive forms
- local UI state
- dialogs
- dropdowns
- client-side event handlers
- browser APIs
- interactive filters
- components that require client-side libraries

Do not add `"use client"` automatically to every component.

Keep the client boundary as small as practical.

Example:

```text
Page (Server Component)
 ├── Header (Server)
 ├── MemberList (Server)
 │    └── MemberTable (Client, if interaction requires it)
 └── AddMemberDialog (Client)
```

Avoid turning an entire route into a Client Component when only one
small interaction requires client-side behavior.

---

# 12. API and Data Access

Do not place API implementation directly inside visual components.

Bad:

```tsx
export function MemberTable() {
  const response = await fetch("/api/members");
  ...
}
```

unless there is a deliberate architectural reason for the component
itself to own that data-fetching responsibility.

Prefer a clear data-access boundary:

```text
features/members/
└── services/
    └── members.service.ts
```

or an appropriate shared API client:

```text
lib/api/
```

Components should consume data through an intentional interface.

Keep:

- API configuration
- authentication headers
- request handling
- response transformation
- error handling

outside presentational components whenever practical.

---

# 13. Backend Is the Authority

Never reproduce backend business rules only in the frontend.

For example, contribution limits must not be enforced exclusively
through UI logic.

The frontend may:

- disable an unavailable option
- display remaining quantity
- show validation feedback
- prevent obviously invalid interaction

But the backend must remain responsible for enforcing the actual rule.

The same principle applies to:

- roles
- permissions
- contribution limits
- document access
- announcement visibility
- account status
- member permissions

---

# 14. Validation

Use schema-based validation consistently.

Keep validation schemas separate from large UI components.

Example:

```text
features/members/schemas/member.schema.ts
```

The frontend should provide immediate validation feedback.

However:

> Frontend validation improves UX; backend validation provides security
> and correctness.

Never assume that frontend validation is sufficient.

---

# 15. Forms

Forms must:

- have clear labels
- provide useful validation
- preserve user input when appropriate
- show loading/submitting states
- prevent accidental duplicate submission
- provide success feedback
- provide meaningful error feedback

Large forms should be divided into logical sections.

Avoid giant forms containing dozens of unrelated fields.

---

# 16. State Management

Do not introduce global state unless there is a real need.

Prefer, in order:

1.  Server state / server fetching
2.  URL state for filters, pagination, sorting, and shareable views
3.  Local component state
4.  Feature-level state
5.  Global state only when genuinely necessary

Examples of URL state:

```text
/membros?status=ativo&page=2&ministerio=louvor
```

Filters that affect the current view should preferably be represented in
the URL when practical.

Do not create a global store for every piece of state.

---

# 17. Loading, Error, and Empty States

Every data-driven page must consider:

- loading
- success
- empty
- error
- unauthorized
- unavailable

Do not leave users staring at a blank page while data loads.

Use:

- skeletons
- loading indicators
- empty-state explanations
- retry actions
- contextual error messages

Example:

```text
Nenhum membro encontrado.

Tente alterar os filtros ou cadastre um novo membro.
```

Avoid technical messages such as:

```text
Error: 500 Internal Server Error
```

in the user interface.

---

# 18. Error Handling

Centralize common error handling.

The UI should distinguish between:

- validation errors
- authentication errors
- authorization errors
- network errors
- server errors
- unexpected errors

Never expose stack traces, internal API details, tokens, database
errors, or implementation details to users.

---

# 19. Authentication UX

The planned authentication flow is email-first.

The frontend should support:

1.  Email input
2.  Backend checks whether the email exists
3.  Existing account → password step
4.  Unknown account → registration
5.  Google authentication
6.  Apple authentication
7.  Password recovery
8.  Pending approval state
9.  Rejected/suspended/inactive states

The frontend must not assume that a user is authorized merely because
authentication succeeded.

Account status and permissions must be respected.

---

# 20. Authorization UX

The frontend should use permissions to control the interface.

For example:

- hide actions the user cannot perform
- disable actions when appropriate
- prevent navigation to unauthorized screens
- display appropriate unauthorized states

However:

> Hiding a button is not authorization.

The backend must always perform final permission checks.

---

# 21. Routing

Use meaningful route structures.

Examples:

```text
/

/membros
/membros/novo
/membros/[id]
/membros/[id]/editar

/ministerios
/ministerios/[id]

/avisos
/avisos/novo
/avisos/[id]
/avisos/[id]/editar

/eventos
/eventos/novo
/eventos/[id]

/estoque
/estoque/novo
/estoque/[id]

/contribuicoes
/contribuicoes/nova
/contribuicoes/[id]

/estudos-biblicos
/estudos-biblicos/[id]

/documentos

/configuracoes
/configuracoes/igreja
/configuracoes/usuarios
/configuracoes/permissoes
```

Do not create arbitrary routes merely because they are convenient for
one component.

Routes should represent meaningful application resources and workflows.

---

# 22. Dynamic Routes

Use dynamic routes for resources identified by an ID.

Example:

```text
/membros/[id]
/eventos/[id]
/ministerios/[id]
```

Do not create separate files such as:

```text
member-1.tsx
member-2.tsx
member-3.tsx
```

---

# 23. Layouts

Use Next.js layouts to share structural UI.

Examples:

```text
app/(dashboard)/layout.tsx
```

may contain:

- sidebar
- header
- notification area
- user menu
- responsive navigation

Individual pages should not recreate the application shell.

---

# 24. Route Groups

Use route groups when they improve organization without changing URLs.

Example:

```text
app/
├── (auth)/
└── (dashboard)/
```

This allows authentication pages and authenticated application pages to
have different layouts.

---

# 25. Naming Conventions

Use consistent naming.

React components:

```text
PascalCase
MemberTable.tsx
MemberForm.tsx
```

Hooks:

```text
camelCase with use prefix
useMembers.ts
useMemberFilters.ts
```

Utilities:

```text
camelCase
formatCurrency.ts
formatDate.ts
```

Services:

```text
members.service.ts
events.service.ts
```

Schemas:

```text
member.schema.ts
event.schema.ts
```

Types:

```text
member.types.ts
event.types.ts
```

Avoid meaningless names:

```text
helper.ts
misc.ts
stuff.ts
common2.ts
utils2.ts
component.tsx
```

A filename should communicate what it contains.

---

# 26. TypeScript

Use TypeScript strictly.

Avoid:

```ts
any;
```

unless there is a documented and justified reason.

Prefer:

```ts
unknown;
```

when the type is genuinely unknown.

Define domain types explicitly.

Do not duplicate the same type definition in multiple files.

Centralize or derive types where appropriate.

Avoid excessive type abstractions that make simple code difficult to
understand.

---

# 27. Business Logic

Business logic must not be hidden inside JSX.

Bad:

```tsx
<div>
  {user.role === "ADMIN" &&
   user.status === "ACTIVE" &&
   campaign.remaining > 0 &&
   campaign.deadline > new Date()
    ? ...
    : ...}
</div>
```

Prefer a meaningful abstraction:

```ts
const canCommitToCampaign = ...
```

or an appropriate domain-level function.

Business rules should be:

- understandable
- testable
- reusable
- independent of presentation when possible

---

# 28. Constants

Do not scatter repeated values throughout the code.

Bad:

```ts
if (status === "PENDING_APPROVAL") ...
```

repeated in dozens of places without structure.

Prefer domain constants/enums where appropriate.

Example:

```text
features/users/constants/
```

However, do not create constants for values that are only used once and
have no semantic meaning.

---

# 29. Internationalization

The default language is:

```text
pt-BR
```

Do not hardcode user-facing text throughout complex components when the
project has an established translation system.

Prepare the application for future languages.

User-facing text should be natural Brazilian Portuguese.

Avoid mixing languages such as:

```text
Salvar
Cancel
Delete
```

within the same interface.

---

# 30. Date and Currency Formatting

Use Brazilian conventions.

Currency:

```text
R$ 1.250,00
```

Dates and times should follow Brazilian conventions.

Do not manually format dates in multiple inconsistent ways throughout
the application.

Create shared formatting utilities where appropriate.

---

# 31. Responsive Design

Every feature must work on:

- desktop
- tablet
- mobile

Do not treat responsiveness as a final step.

Design responsive behavior while implementing the feature.

Consider:

- navigation
- tables
- filters
- forms
- dialogs
- drawers
- cards
- action buttons
- typography
- spacing

Do not simply reduce desktop dimensions.

Mobile should be intentionally designed.

---

# 32. Accessibility

Accessibility is part of implementation, not a later enhancement.

Use:

- semantic HTML
- labels for form controls
- keyboard navigation
- visible focus states
- appropriate ARIA only when needed
- sufficient contrast
- accessible dialogs
- meaningful button labels
- non-color indicators for status

Do not use a `<div>` as a button when a `<button>` is appropriate.

---

# 33. Design System

The frontend must have a coherent design system.

Before creating new UI patterns, inspect existing components.

Maintain consistency in:

- spacing
- typography
- colors
- borders
- radius
- shadows
- buttons
- inputs
- tables
- dialogs
- status indicators

Do not introduce a new visual style for every feature.

The application should look like one product.

---

# 34. Avoid AI-Generated UI Patterns

The interface should not look like a collection of generic AI-generated
screens.

Avoid:

- excessive cards
- excessive gradients
- decorative statistics
- meaningless charts
- arbitrary icons
- inconsistent spacing
- excessive rounded containers
- fake analytics
- unnecessary glassmorphism
- excessive animations
- repetitive layouts

Every visual element should have a functional purpose.

Prefer information hierarchy and usability over decoration.

---

# 35. Reuse the Existing Design Reference

The approved dashboard/reference design should establish the visual
language for the application.

When implementing another screen:

1.  Inspect the existing dashboard.
2.  Reuse established components.
3.  Reuse spacing and typography.
4.  Reuse navigation.
5.  Reuse status patterns.
6.  Reuse table/form patterns.
7.  Extend the design system only when necessary.

Do not redesign the application independently for each module.

---

# 36. Accessibility and UX for Tables

Desktop tables should be used for information that benefits from column
comparison.

Tables should support, when relevant:

- sorting
- filtering
- pagination
- row actions
- status
- selection

On mobile, evaluate whether the table should become:

- stacked list
- compact cards
- horizontally scrollable table
- detail-first list

Do not automatically force every table into horizontal scrolling.

---

# 37. Modals, Drawers, and Pages

Use a full page when the user is completing a substantial workflow.

Use a modal for:

- confirmations
- short forms
- focused actions

Use a drawer when:

- the user needs contextual information
- the underlying page should remain visible
- the interaction is relatively contained

Do not place entire complex workflows into tiny modals.

---

# 38. Destructive Actions

Actions such as:

- deleting
- archiving
- deactivating
- removing
- canceling

must require appropriate confirmation.

The confirmation should clearly state:

- what will happen
- what item is affected
- whether the operation can be reversed

Do not use generic:

```text
Are you sure?
```

when the operation has meaningful consequences.

---

# 39. Performance

Avoid unnecessary client-side JavaScript.

Prefer Server Components where possible.

Avoid:

- unnecessary global state
- unnecessary effects
- repeated API calls
- large client components
- loading entire datasets when pagination is appropriate
- rendering huge lists without virtualization when needed

Follow the principle:

> Ship the minimum JavaScript required for the interaction.

---

# 40. Data Fetching

Avoid fetching the same data independently in multiple components when
it can be fetched at an appropriate higher level.

Avoid waterfalls when possible.

For large datasets, use:

- pagination
- server-side filtering
- server-side sorting
- appropriate caching/revalidation strategy

Do not load thousands of records into the browser simply to display 20.

---

# 41. URL State

Use URL parameters for state that should survive refresh or be
shareable.

Examples:

```text
?search=maria
?status=active
?page=2
?sort=name
```

This is especially useful for administrative lists.

---

# 42. Testing

Important components and business-critical interactions should be
testable.

Prioritize testing for:

- authentication flows
- permission-dependent UI
- forms
- validation
- filters
- contribution limits
- event registration
- member creation
- document permissions
- destructive actions

Do not write tests merely to increase test count.

Test behavior and important business rules.

---

# 43. Logging and Debugging

Do not leave debugging statements in production code.

Avoid:

```ts
console.log("HERE");
console.log(data);
console.log(user);
```

Remove temporary debugging code before completing a task.

Never log:

- passwords
- access tokens
- refresh tokens
- sensitive personal information
- confidential API responses

---

# 44. Dependencies

Before installing a new dependency:

1.  Check whether the project already has a library that solves the
    problem.
2.  Check whether the functionality can reasonably be implemented with
    existing tools.
3.  Consider bundle size and maintenance.
4.  Avoid adding a dependency for trivial functionality.

Do not install libraries merely because they are popular.

---

# 45. Refactoring

When modifying existing code:

- understand the existing architecture first
- preserve working behavior
- avoid unnecessary rewrites
- improve structure incrementally
- remove duplication when appropriate
- do not introduce unrelated changes

If a component is poorly structured, refactor it rather than building
another layer on top of the problem.

---

# 46. No "Quick Fix" Architecture

Do not solve a problem with a shortcut that creates technical debt.

Avoid:

```text
// TODO: move this later
```

when the correct architecture is reasonably easy to implement now.

Do not place code in the wrong layer simply because it is faster.

If a temporary workaround is genuinely necessary:

1.  clearly document it
2.  explain why it is temporary
3.  create a follow-up task if the project uses task tracking

---

# 47. Before Creating a New File

Ask:

1.  Does this responsibility already exist?
2.  Is there an existing component that can be reused?
3.  Can the existing component be generalized?
4.  Does this belong to a feature?
5.  Is the new abstraction actually useful?

Do not create files simply to make a page smaller.

---

# 48. Before Modifying a Feature

AI agents MUST inspect:

- the route
- its layout
- related feature components
- shared components
- API/service layer
- types
- schemas
- authentication/authorization behavior
- existing tests

Do not modify a page based only on the page file.

---

# 49. Development Workflow for AI Agents

For every task, follow this process.

## Step 1 --- Understand

Read the task carefully.

Identify:

- feature
- user role
- route
- expected behavior
- API requirements
- responsive requirements
- permissions
- affected components

## Step 2 --- Inspect

Search the existing codebase before writing code.

Find:

- similar components
- shared UI
- existing services
- existing hooks
- existing types
- existing schemas
- existing patterns

## Step 3 --- Plan

Before implementing, determine:

- files that must change
- files that should be created
- components to reuse
- components that need extraction
- data flow
- state management
- responsive behavior

For non-trivial tasks, briefly describe the plan before making changes.

## Step 4 --- Implement

Implement according to the existing architecture.

Do not introduce unnecessary patterns.

## Step 5 --- Validate

Check:

- TypeScript
- linting
- formatting
- build
- tests
- responsive behavior
- loading state
- error state
- empty state
- permission behavior

## Step 6 --- Review

Before finishing, inspect the diff.

Ask:

- Did I create unnecessary files?
- Did I duplicate code?
- Did I make a page too large?
- Did I introduce `"use client"` unnecessarily?
- Did I bypass the existing API/service layer?
- Did I break responsive behavior?
- Did I introduce a new visual pattern unnecessarily?
- Did I leave debugging code?
- Did I modify unrelated files?

---

# 50. Definition of Done

A frontend task is not complete merely because the page renders.

A task is complete when:

- functionality works
- TypeScript passes
- linting passes
- formatting is consistent
- relevant tests pass
- loading states exist where needed
- error states exist where needed
- empty states exist where needed
- authorization behavior is respected
- responsive behavior works
- accessibility has been considered
- existing components were reused where appropriate
- no unnecessary duplication was introduced
- no debug code remains
- the implementation follows the project's architecture

---

# 51. Forbidden Patterns

The following patterns require strong justification and should generally
be avoided:

```text
❌ One 500+ line page containing an entire feature
❌ One 1000+ line component
❌ API calls scattered through presentation components
❌ Business rules embedded inside JSX
❌ Global state for local UI state
❌ "use client" on the entire application unnecessarily
❌ any without justification
❌ duplicated UI components
❌ duplicated domain types
❌ duplicated API logic
❌ hardcoded user-facing strings throughout complex code
❌ arbitrary folder structures
❌ generic "utils2.ts" or "helpers.ts" dumping grounds
❌ console.log left in production code
❌ exposing backend errors directly to users
❌ trusting frontend authorization
❌ installing dependencies without justification
❌ rewriting unrelated modules during a feature task
❌ desktop-only implementations
❌ treating mobile as an afterthought
```

---

# 52. Architecture Principle

The most important rule in this document is:

> **Optimize the codebase for the next developer, not only for the
> current task.**

Every implementation should make the next feature easier to build.

The application will grow from a small MVP into a modular church
management platform. Architecture decisions must therefore favor:

- separation of concerns
- maintainability
- readability
- reusability
- testability
- predictable conventions
- incremental growth

Do not optimize for the fewest files.

Do not optimize for the fastest possible implementation.

Optimize for a codebase that remains understandable after dozens of
additional features are implemented.

---

# 53. Final Instruction to AI Agents

You are working in an existing professional software project.

Do not assume that creating the fastest possible implementation is the
goal.

Before writing code:

> **Inspect → Understand → Plan → Implement → Validate → Review**

When uncertain, prefer the solution that:

1.  preserves existing architecture
2.  separates responsibilities
3.  minimizes duplication
4.  keeps components understandable
5.  keeps business logic outside presentation
6.  uses existing abstractions
7.  remains responsive
8.  remains testable
9.  respects backend authorization
10. makes future development easier

If a task appears to require placing a large amount of code into one
page, stop and reconsider the architecture before implementing it.

The frontend should remain a collection of **small, cohesive,
understandable features**, not a collection of giant pages.
