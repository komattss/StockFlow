# StockFlow — UI Guidelines

## 1. Design Direction

StockFlow uses a bold, modern, high-contrast visual identity built around three core brand colors:

* Obsidian Root
* Hyper Neon
* Electric Sun

The interface should feel:

* Modern
* Bold
* Clean
* Professional
* High-energy
* Data-oriented
* Confident

The design should remain suitable for a business management application.

The existing shadcn-admin design system remains the structural foundation. StockFlow should customize the visual identity without discarding the existing component architecture.

---

# 2. Brand Color Palette

## Obsidian Root

```text
#0C0E09
```

Primary dark brand color.

Use for:

* Sidebar
* Dark navigation surfaces
* Dark cards
* Primary dark text
* Headers where appropriate
* Strong contrast surfaces
* Brand marks

Do not use Obsidian Root for every surface.

---

## Hyper Neon

```text
#FF2070
```

Primary accent color.

Use for:

* Active states
* Important highlights
* Selected navigation indicators
* Accent borders
* Notifications
* Important chart series
* Secondary CTAs
* Interactive emphasis

Avoid using Hyper Neon for large areas of text.

---

## Electric Sun

```text
#FCFF1A
```

Primary brand highlight.

Use for:

* Logo/wordmark
* Primary brand elements
* Primary CTA emphasis
* Selected navigation states where appropriate
* Important highlights
* Brand illustrations
* High-visibility UI accents

Electric Sun should not be used as the default background for large application surfaces.

---

# 3. Color Hierarchy

The visual hierarchy should generally follow:

```text
Obsidian Root
    ↓
Structure and contrast

Electric Sun
    ↓
Brand identity and primary emphasis

Hyper Neon
    ↓
Interaction and attention
```

Brand colors should be used intentionally rather than covering the entire interface.

The application should still use neutral colors for:

* Backgrounds
* Cards
* Tables
* Inputs
* Borders
* Secondary text
* Disabled states

---

# 4. Light Mode

Light mode should use a neutral background rather than Electric Sun as the page background.

Recommended hierarchy:

* Page background: neutral/off-white
* Card background: white
* Primary text: Obsidian Root
* Secondary text: neutral gray
* Primary brand accent: Electric Sun
* Interactive accent: Hyper Neon
* Borders: subtle neutral gray

Electric Sun should primarily function as an accent rather than a large background.

---

# 5. Dark Mode

Dark mode should be an important part of the StockFlow visual identity.

Recommended hierarchy:

* Page background: near-black/Obsidian-derived neutral
* Sidebar: Obsidian Root
* Cards: dark neutral slightly lighter than page background
* Primary text: off-white
* Secondary text: muted gray
* Brand highlight: Electric Sun
* Interactive accent: Hyper Neon

Avoid using pure black everywhere.

Maintain enough tonal difference between:

* Page
* Sidebar
* Cards
* Dialogs
* Inputs

---

# 6. Typography

Typography should prioritize readability and information hierarchy.

Use the existing project typography system unless there is a strong reason to change it.

Recommended hierarchy:

### Page Title

Strong and prominent.

### Section Title

Clear but less dominant than the page title.

### Body

Highly readable and neutral.

### Metadata

Smaller and visually muted.

### Financial Numbers

Large, bold, and easy to scan.

Important financial values may use stronger visual emphasis.

Avoid excessive use of bold typography.

---

# 7. Sidebar

The sidebar is one of the main StockFlow brand surfaces.

Recommended visual direction:

* Obsidian Root base
* Electric Sun for logo/brand emphasis
* High-contrast navigation text
* Subtle active-state treatment
* Hyper Neon for selected/interactive accents where appropriate

Navigation should be grouped logically:

```text
Overview

Inventory
  Products
  Categories
  Suppliers
  Inventory
  Stock In
  Stock Out
  Stock Adjustment
  Inventory History
  Low Stock

Finance
  Finance Overview
  Income
  Expenses
  Transactions
  Payables
  Receivables
  Cash Flow
  Financial Reports

Administration
  Users
  Settings
```

Actual navigation visibility must respect user roles and permissions.

---

# 8. Buttons

Buttons should use clear hierarchy.

## Primary Button

Use for the main action on a page.

Possible examples:

* Add Product
* Add Expense
* Record Stock In
* Save Changes

Primary buttons should use the StockFlow brand treatment while maintaining sufficient text contrast.

## Secondary Button

Use for less important actions.

Use neutral styling.

## Destructive Button

Use semantic destructive styling rather than Hyper Neon.

Examples:

* Delete
* Remove
* Permanently disable

Do not use brand colors to communicate destructive meaning.

---

# 9. Cards

Cards should be clean and information-focused.

Dashboard cards should prioritize:

1. Metric
2. Context
3. Trend/change
4. Optional supporting information

Example:

```text
Revenue

Rp 128.4M

↑ 12.4%
vs previous month
```

Do not overload metric cards with decorative elements.

---

# 10. Data Tables

StockFlow contains many data-heavy workflows.

Tables should prioritize:

* Readability
* Search
* Filtering
* Sorting
* Pagination
* Clear column hierarchy
* Consistent actions
* Responsive behavior

Important identifiers such as SKU should be easy to scan.

Monetary values should be aligned consistently.

Quantities should be easy to compare.

Avoid excessive color usage inside tables.

---

# 11. Status Colors

Brand colors must not replace semantic status colors.

Use dedicated semantic colors for:

### Success

Used for:

* Completed
* Paid
* Available
* Successful operations

### Warning

Used for:

* Low stock
* Pending
* Approaching due date

### Destructive/Error

Used for:

* Failed operations
* Invalid data
* Overdue conditions where appropriate
* Destructive actions

### Neutral

Used for:

* Inactive
* Archived
* Unknown
* Informational states

Hyper Neon and Electric Sun should remain brand accents rather than being used as generic replacements for every semantic status.

---

# 12. Inventory Visualization

Inventory status should be immediately understandable.

Recommended conceptual hierarchy:

```text
Healthy Stock
    ↓
Normal neutral/success treatment

Low Stock
    ↓
Warning treatment

Out of Stock
    ↓
Destructive treatment
```

Do not rely only on color.

Use:

* Labels
* Icons
* Numbers
* Status badges

to communicate meaning.

---

# 13. Financial Visualization

Financial dashboards should emphasize readability and comparison.

Use charts for:

* Revenue trends
* Expense trends
* Cash flow
* Inventory value
* Financial distribution

Charts should use a restrained palette.

Electric Sun and Hyper Neon may be used as primary visual accents, but charts should not become visually overwhelming.

Always preserve sufficient contrast between data series.

---

# 14. Forms

Forms should follow the existing shadcn/ui form patterns.

Prioritize:

* Clear labels
* Helpful descriptions
* Validation feedback
* Logical grouping
* Appropriate input types
* Clear required-field indicators
* Consistent spacing

Important forms should clearly distinguish:

* Editable fields
* Read-only fields
* Calculated values
* System-generated values

---

# 15. Financial Formatting

Financial values should be visually consistent.

Use Indonesian Rupiah formatting where appropriate:

```text
Rp 125.000
Rp 1.250.000
Rp 12.500.000
```

Do not display inconsistent monetary formats across different modules.

Financial values should not use excessive decimal precision unless required.

Positive and negative values should remain visually distinguishable.

---

# 16. Inventory Formatting

Inventory quantities should display:

* Quantity
* Unit
* Optional stock status

Examples:

```text
120 pcs
24 boxes
8 kg
```

Do not assume every product uses the same unit.

---

# 17. Empty States

Every major data-driven page should have a useful empty state.

An empty state should communicate:

1. What is missing
2. Why it matters
3. What the user can do next

Example:

```text
No products yet

Add your first product to start managing inventory.

[ Add Product ]
```

Avoid blank tables with no explanation.

---

# 18. Loading States

Use appropriate loading feedback.

Prefer:

* Skeletons
* Loading indicators
* Disabled action states

Avoid blocking the entire application when only a small section is loading.

---

# 19. Error States

Errors should be visible and actionable.

Examples:

```text
Unable to load inventory

Something went wrong while retrieving inventory data.

[ Try Again ]
```

Do not expose raw technical errors to normal users unless appropriate.

---

# 20. Responsive Design

StockFlow must work across:

* Desktop
* Laptop
* Tablet
* Mobile

The primary experience is expected to be desktop-oriented because StockFlow is a business management application.

However:

* Tables should remain usable
* Forms should adapt
* Sidebar should collapse appropriately
* Important dashboard information should remain accessible

Do not simply shrink desktop layouts to fit mobile.

---

# 21. Accessibility

Accessibility is required.

Prioritize:

* Keyboard navigation
* Visible focus states
* Sufficient contrast
* Semantic HTML
* Accessible labels
* Accessible dialogs
* Accessible forms
* Non-color-only status communication

Brand colors must not compromise text readability.

When a neon brand color produces insufficient contrast, use it as an accent rather than as a text/background combination.

---

# 22. Border Radius

Maintain the existing shadcn-admin radius system where practical.

Avoid excessive rounded containers.

Use stronger radius for:

* Cards
* Dialogs
* Major containers

Use smaller radius for:

* Inputs
* Buttons
* Badges
* Table elements

The UI should feel modern without becoming overly playful.

---

# 23. Shadows

Use shadows sparingly.

Prefer:

* Subtle elevation
* Borders
* Surface contrast

over large decorative shadows.

The interface should remain clean and business-oriented.

---

# 24. Icons

Use Lucide React icons through the existing project icon system.

Icons should:

* Reinforce meaning
* Have consistent sizing
* Align with surrounding text
* Not replace important labels

Avoid using icons purely for decoration when they add no value.

---

# 25. Motion

Motion should be subtle and functional.

Use animation for:

* Navigation transitions
* Dialog appearance
* Loading states
* State changes
* Feedback

Avoid excessive animation in data-heavy workflows.

Motion should never interfere with productivity.

---

# 26. Brand Consistency

StockFlow should feel visually consistent across all modules.

The following should remain consistent:

* Colors
* Typography
* Spacing
* Buttons
* Forms
* Tables
* Cards
* Dialogs
* Status badges
* Icons
* Charts

Do not create a unique visual language for individual pages.

---

# 27. Design Principle

StockFlow should feel like:

> A modern operational command center for inventory and business finances.

It should NOT feel like:

* A generic admin dashboard
* A banking application
* A full accounting ERP
* A marketing landing page
* A neon-themed gaming dashboard

The neon palette is part of the brand identity, while usability and information clarity remain the priority.
