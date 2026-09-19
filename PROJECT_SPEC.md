# StockFlow — Product Specification

## 1. Product Overview

**StockFlow** is a full-stack inventory and operational business-finance management system designed to help small and medium-sized businesses monitor inventory, stock movements, suppliers, income, expenses, payables, receivables, and overall business performance from one centralized system.

StockFlow is not intended to be a full accounting system.

The primary focus is:

* Inventory management
* Stock movement management
* Supplier management
* Operational income and expense management
* Payables and receivables
* Cash-flow visibility
* Business performance overview
* Role-based access

The system should provide a clear relationship between operational inventory activity and financial activity.

---

# 2. Product Goals

StockFlow should help a business:

1. Know what products are currently available.
2. Monitor stock movement over time.
3. Identify products with low stock.
4. Manage product categories and suppliers.
5. Record incoming and outgoing stock.
6. Record stock adjustments.
7. Track business income and expenses.
8. Track unpaid payables and receivables.
9. Understand operational cash flow.
10. Provide managers/owners with a centralized business overview.
11. Reduce manual spreadsheet-based tracking.
12. Provide traceable and consistent inventory and financial records.

---

# 3. Target Users

StockFlow is intended primarily for small and medium-sized businesses that need a centralized operational management system without the complexity of a full enterprise accounting platform.

Typical businesses may include:

* Retail stores
* Small distributors
* Small wholesalers
* Product-based businesses
* Small trading businesses
* Other businesses that manage physical inventory

The system should remain generic enough to support different business types.

---

# 4. User Roles

StockFlow initially supports four main roles.

## 4.1 Admin

Admin has full access to the system.

Responsibilities:

* Manage users
* Manage roles and permissions
* Manage products
* Manage categories
* Manage suppliers
* Manage inventory
* Manage stock movements
* Manage financial records
* View reports
* View dashboards
* Manage system-level configuration where applicable

---

## 4.2 Inventory Staff

Inventory Staff focuses on physical inventory operations.

Primary access:

* Dashboard relevant to inventory
* Products
* Categories
* Suppliers
* Inventory
* Stock In
* Stock Out
* Stock Adjustment
* Inventory History
* Low Stock

Inventory Staff should not have unrestricted access to financial information.

---

## 4.3 Finance Admin

Finance Admin focuses on operational financial records.

Primary access:

* Finance Overview
* Income
* Expenses
* Transactions
* Payables
* Receivables
* Cash Flow
* Financial Reports

Finance Admin may need access to inventory-related information when required to understand financial transactions, but should not automatically receive full inventory-management permissions.

---

## 4.4 Manager / Owner

Manager/Owner focuses on business performance and decision-making.

Primary access:

* Overall Dashboard
* Inventory overview
* Financial overview
* Business performance
* Reports
* Relevant operational information

Manager/Owner should have broad read access to business information.

Write permissions should follow the final permission matrix.

---

# 5. Main Application Modules

The application is divided into two major operational areas:

## Inventory

* Dashboard
* Products
* Categories
* Suppliers
* Inventory
* Stock In
* Stock Out
* Stock Adjustment
* Inventory History
* Low Stock

## Finance

* Finance Overview
* Income
* Expenses
* Transactions
* Payables
* Receivables
* Cash Flow
* Financial Reports

Additional modules may be added only when they support a clear business requirement.

---

# 6. Dashboard

The dashboard provides a high-level overview of business operations.

Potential dashboard information includes:

### Business Metrics

* Revenue
* Expenses
* Estimated Profit/Loss
* Inventory Value
* Outstanding Payables
* Outstanding Receivables

### Inventory Metrics

* Total Products
* Total Stock
* Low Stock Products
* Out-of-Stock Products
* Recent Stock In
* Recent Stock Out

### Financial Metrics

* Income over time
* Expenses over time
* Cash-flow trend
* Recent financial transactions

### Activity

* Recent inventory activity
* Recent financial activity

Dashboard data should be derived from actual application data rather than permanently hardcoded values.

---

# 7. Product Management

Products are the central entities of inventory management.

A product should support information such as:

* Product name
* SKU
* Category
* Supplier
* Description
* Unit
* Purchase price
* Selling price
* Current stock
* Minimum stock level
* Status
* Created date
* Updated date

The final database schema should determine exact field names and data types.

---

# 8. Category Management

Categories organize products.

Category functionality should support:

* Create category
* View categories
* Edit category
* Delete category when safe
* Search/filter categories

The system should prevent destructive operations that would violate product relationships.

---

# 9. Supplier Management

Suppliers represent businesses or parties that provide products.

Supplier information may include:

* Supplier name
* Contact person
* Phone
* Email
* Address
* Notes
* Status

Supplier records should be reusable across inventory operations.

---

# 10. Inventory

The inventory module provides the current stock position.

It should allow users to understand:

* Current quantity
* Minimum stock level
* Stock status
* Product value
* Recent movements
* Stock availability

Possible stock statuses:

* In Stock
* Low Stock
* Out of Stock

Exact thresholds should be determined by product-level minimum stock configuration.

---

# 11. Stock In

Stock In represents inventory entering the business.

Typical causes:

* Purchase from supplier
* Restocking
* Returned goods
* Other approved inventory additions

A Stock In transaction should contain enough information to identify:

* Product
* Quantity
* Unit cost when applicable
* Supplier when applicable
* Transaction date
* Reference number
* Notes
* User responsible for the operation

Stock In should increase inventory quantity.

When the Stock In represents a purchase that has a financial impact, the appropriate financial record should be created according to the defined business rules.

---

# 12. Stock Out

Stock Out represents inventory leaving the business.

Typical causes:

* Sale
* Damaged goods
* Internal usage
* Other approved inventory reductions

A Stock Out transaction should contain enough information to identify:

* Product
* Quantity
* Unit price/value when applicable
* Transaction date
* Reference number
* Notes
* User responsible for the operation

Stock Out should decrease inventory quantity.

When the Stock Out represents a sale, the appropriate income/revenue record should be created according to the defined business rules.

---

# 13. Stock Adjustment

Stock Adjustment allows authorized users to correct inventory quantities when the physical stock differs from the recorded stock.

Examples:

* Damaged goods
* Lost goods
* Counting discrepancies
* Data correction
* Other approved adjustments

Adjustments must record:

* Product
* Previous quantity
* Adjustment quantity
* Resulting quantity
* Reason
* Date
* User responsible

Adjustments must be traceable.

---

# 14. Inventory History

Inventory History provides an audit-oriented view of stock movement.

Each meaningful inventory movement should be traceable.

History should provide information such as:

* Date/time
* Product
* Movement type
* Quantity
* Previous stock
* Resulting stock
* Reference
* User
* Notes

Users should be able to filter history by relevant fields.

---

# 15. Low Stock

The Low Stock module identifies products that require attention.

A product is considered low stock when:

`current_stock <= minimum_stock_level`

An out-of-stock product is:

`current_stock <= 0`

The UI should clearly distinguish between low-stock and out-of-stock conditions.

---

# 16. Finance Overview

Finance Overview provides a summary of operational financial activity.

Potential information includes:

* Total income
* Total expenses
* Net operational result
* Outstanding payables
* Outstanding receivables
* Cash-flow summary
* Recent transactions

Financial calculations must be based on actual financial records.

---

# 17. Income

Income represents money or business revenue received or recognized by the business.

Income records may include:

* Description
* Amount
* Category
* Date
* Payment status
* Reference
* Related transaction
* Notes

Income categories should be manageable or predefined depending on the final implementation.

---

# 18. Expenses

Expenses represent business spending.

Expense records may include:

* Description
* Amount
* Category
* Date
* Payment status
* Reference
* Related transaction
* Notes

Expense records must be distinguishable from inventory stock movements while allowing relationships between them when appropriate.

---

# 19. Transactions

Transactions provide a unified operational view of financial activity.

A transaction may represent:

* Income
* Expense
* Inventory-related financial activity
* Other approved business financial activity

Transactions should be traceable to their source where applicable.

The system should avoid creating duplicate financial records for the same event.

---

# 20. Payables

Payables represent money the business owes to another party.

Common example:

A business purchases inventory from a supplier but has not paid the supplier yet.

A payable should support information such as:

* Supplier/payee
* Reference
* Amount
* Due date
* Status
* Related transaction
* Payment information
* Notes

Possible statuses:

* Pending
* Partially Paid
* Paid
* Overdue

The exact status transition rules should be defined during database and business-rule design.

---

# 21. Receivables

Receivables represent money owed to the business.

Common example:

A customer receives products but has not yet paid the business.

A receivable should support:

* Customer/debtor
* Reference
* Amount
* Due date
* Status
* Related transaction
* Payment information
* Notes

Possible statuses:

* Pending
* Partially Paid
* Paid
* Overdue

The customer entity may be introduced during implementation if required by the final workflow.

---

# 22. Cash Flow

Cash Flow provides an operational view of money entering and leaving the business.

It should distinguish between:

* Cash inflow
* Cash outflow

Potential views:

* Daily
* Weekly
* Monthly
* Custom date range

Cash-flow calculations should be based on appropriate financial transaction records and should not simply equate revenue with cash received.

---

# 23. Financial Reports

Financial Reports provide summarized operational financial information.

Potential reports include:

* Income report
* Expense report
* Profit/Loss overview
* Cash-flow report
* Payables report
* Receivables report
* Inventory value overview

Reports should support filtering by date range where appropriate.

---

# 24. Inventory and Finance Integration

Inventory and finance are related but should not be treated as the same entity.

The system should support relationships such as:

### Purchase / Stock In

Example:

Business purchases 10 units from a supplier.

Possible effects:

1. Inventory increases by 10.
2. A purchase-related expense or payable is recorded according to payment status.
3. The inventory movement is recorded in inventory history.
4. The financial record references the originating inventory operation where appropriate.

### Sale / Stock Out

Example:

Business sells 5 units.

Possible effects:

1. Inventory decreases by 5.
2. Revenue/income is recorded when the operation represents a sale.
3. The inventory movement is recorded in inventory history.
4. A receivable may be created if the sale is on credit.

The exact accounting/financial behavior must be finalized before implementation.

StockFlow should provide operational financial visibility without attempting to implement full accounting standards.

---

# 25. Business Rules

The following rules are important.

## Inventory

* Stock quantities must remain consistent.
* Inventory movements must be traceable.
* Stock cannot unintentionally become negative.
* Every stock adjustment requires a reason.
* Stock changes should be associated with a user and timestamp.
* Product SKU should be unique.

## Products

* Product names should be meaningful.
* SKU should uniquely identify a product.
* Products should not be hard-deleted when historical records depend on them.
* Prefer archive/inactive states for records that must remain historically relevant.

## Financial Data

* Monetary values must use appropriate precision.
* Financial records should not be silently altered.
* Important financial changes should be traceable.
* Paid/unpaid status must be consistent with payment information.
* Duplicate financial records should be prevented.

## Relationships

* Historical inventory and financial records must remain referentially consistent.
* Deleting a referenced entity must not accidentally destroy historical records.

---

# 26. Non-Goals

StockFlow is NOT intended to initially provide:

* Full general ledger accounting
* Complex journal-entry workflows
* Tax management
* Payroll
* Bank reconciliation
* Multi-company accounting
* Advanced budgeting
* Full ERP functionality
* Complex manufacturing/MRP
* Advanced warehouse management
* Advanced procurement automation
* AI forecasting as a core requirement

These may be considered future features but should not be implemented in the MVP without explicit approval.

---

# 27. MVP Scope

The MVP should prioritize the following.

## Authentication & Access

* Authentication
* User roles
* Role-aware navigation
* Basic authorization structure

## Inventory

* Dashboard
* Products
* Categories
* Suppliers
* Inventory
* Stock In
* Stock Out
* Stock Adjustment
* Inventory History
* Low Stock

## Finance

* Finance Overview
* Income
* Expenses
* Transactions
* Payables
* Receivables
* Cash Flow
* Financial Reports

## Integration

* Inventory movements affect inventory quantities.
* Relevant inventory operations can create related financial records.
* Financial records can reference originating operational transactions.
* Dashboard values are derived from actual data.

---

# 28. UI/UX Direction

StockFlow should use the existing shadcn-admin template as its visual and structural foundation.

The application should preserve:

* Sidebar-based navigation
* Dashboard-oriented layout
* Data-table patterns
* Form patterns
* Dialog patterns
* Cards
* Charts
* Consistent spacing
* Responsive behavior
* shadcn/ui design language

The existing template should be adapted rather than discarded.

StockFlow branding should use its own:

* Name
* Logo/wordmark
* Color palette
* Navigation structure
* Business terminology

The final UI should feel like a coherent product rather than an unchanged template.

---

# 29. Technical Requirements

The existing frontend stack should remain the foundation.

Current frontend technologies include:

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

Database:

* PostgreSQL

The exact backend architecture is intentionally not finalized yet and should be determined after repository analysis and database/business-rule design.

Do not migrate the frontend to another framework without explicit approval.

---

# 30. Development Environment

The application must work locally before deployment.

Initial development priorities:

1. Local development
2. Local database
3. Functional MVP
4. Testing
5. Production build
6. Deployment preparation
7. Production deployment

Deployment should not be treated as a prerequisite for completing local functionality.

---

# 31. Deployment Direction

The project should eventually be deployable using practical low-cost/free-tier infrastructure where possible.

Potential deployment architecture may include:

* Frontend hosting
* Backend/API hosting
* PostgreSQL hosting

The exact providers should be decided later based on technical requirements and project constraints.

Do not optimize the architecture around a deployment provider before the application requirements are finalized.

---

# 32. Data Integrity Priority

Data integrity is more important than implementation speed.

The agent must prioritize:

1. Correct business behavior
2. Correct data relationships
3. Consistent inventory
4. Consistent financial records
5. Traceability
6. Security
7. Usability
8. Visual polish

A visually complete feature with incorrect underlying data is not considered complete.

---

# 33. Implementation Principle

StockFlow should evolve incrementally.

Recommended implementation order:

1. Repository and architecture audit
2. Database/business-rule design
3. Backend foundation
4. Authentication and authorization
5. Core inventory
6. Inventory history
7. Finance foundation
8. Inventory-finance integration
9. Dashboard
10. Reports
11. Testing
12. UX refinement
13. Security review
14. Production preparation

Do not implement all modules simultaneously without validating the underlying architecture.

---

# 34. Specification Status

This document defines the initial product direction.

Some detailed business rules intentionally remain open and must be resolved during database and architecture planning.

When an implementation decision could materially affect:

* inventory quantities
* financial records
* payment status
* user permissions
* database relationships
* data integrity

the agent must stop and request clarification rather than inventing a rule.
