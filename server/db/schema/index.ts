import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  index,
  check,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ---- Enums ----

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'inventory_staff',
  'finance_admin',
  'manager',
])

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive'])

export const supplierStatusEnum = pgEnum('supplier_status', [
  'active',
  'inactive',
])

export const productStatusEnum = pgEnum('product_status', [
  'active',
  'inactive',
])

export const stockOutTypeEnum = pgEnum('stock_out_type', [
  'sale',
  'damage',
  'internal_use',
  'other',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'paid',
  'unpaid',
  'partially_paid',
])

export const paymentTransactionTypeEnum = pgEnum('payment_transaction_type', [
  'payable',
  'receivable',
])

export const payableSourceTypeEnum = pgEnum('payable_source_type', [
  'stock_in',
  'manual',
])

export const receivableSourceTypeEnum = pgEnum('receivable_source_type', [
  'stock_out',
  'manual',
])

export const incomeSourceTypeEnum = pgEnum('income_source_type', [
  'stock_out',
  'manual',
])

export const expenseSourceTypeEnum = pgEnum('expense_source_type', [
  'stock_in',
  'manual',
])

// ---- Tables ----

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('inventory_staff'),
    status: userStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    emailUnique: uniqueIndex('users_email_unique').on(t.email),
  })
)

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    nameUnique: uniqueIndex('categories_name_unique').on(t.name),
  })
)

export const suppliers = pgTable(
  'suppliers',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    contactPerson: varchar('contact_person', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    notes: text('notes'),
    status: supplierStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  }
)

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 100 }).notNull(),
    categoryId: integer('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    supplierId: integer('supplier_id').references(() => suppliers.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    unit: varchar('unit', { length: 50 }).notNull().default('pcs'),
    purchasePrice: numeric('purchase_price', { precision: 12, scale: 2 }),
    sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }),
    minStockLevel: integer('min_stock_level').notNull().default(0),
    status: productStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    skuUnique: uniqueIndex('products_sku_unique').on(t.sku),
    categoryIdx: index('products_category_id_idx').on(t.categoryId),
    supplierIdx: index('products_supplier_id_idx').on(t.supplierId),
  })
)

export const inventory = pgTable(
  'inventory',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(0),
    averageCost: numeric('average_cost', { precision: 12, scale: 4 })
      .notNull()
      .default('0'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    productUnique: uniqueIndex('inventory_product_id_unique').on(t.productId),
    quantityCheck: check(
      'inventory_quantity_non_negative',
      sql`${t.quantity} >= 0`
    ),
  })
)

export const stockIns = pgTable(
  'stock_ins',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    supplierId: integer('supplier_id').references(() => suppliers.id, {
      onDelete: 'set null',
    }),
    quantity: integer('quantity').notNull(),
    unitCost: numeric('unit_cost', { precision: 12, scale: 2 }).notNull(),
    totalCost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
    paymentStatus: paymentStatusEnum('payment_status')
      .notNull()
      .default('unpaid'),
    paidAmount: numeric('paid_amount', { precision: 12, scale: 2 })
      .notNull()
      .default('0'),
    referenceNumber: varchar('reference_number', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    productIdx: index('stock_ins_product_id_idx').on(t.productId),
    supplierIdx: index('stock_ins_supplier_id_idx').on(t.supplierId),
    userIdx: index('stock_ins_user_id_idx').on(t.userId),
    dateIdx: index('stock_ins_transaction_date_idx').on(t.transactionDate),
    quantityCheck: check('stock_ins_quantity_positive', sql`${t.quantity} > 0`),
    paidAmountCheck: check(
      'stock_ins_paid_amount_check',
      sql`${t.paidAmount} >= 0 AND ${t.paidAmount} <= ${t.totalCost}`
    ),
  })
)

export const stockOuts = pgTable(
  'stock_outs',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    type: stockOutTypeEnum('type').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 12, scale: 2 }),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }),
    paidAmount: numeric('paid_amount', { precision: 12, scale: 2 })
      .notNull()
      .default('0'),
    paymentStatus: paymentStatusEnum('payment_status')
      .notNull()
      .default('unpaid'),
    referenceNumber: varchar('reference_number', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    productIdx: index('stock_outs_product_id_idx').on(t.productId),
    userIdx: index('stock_outs_user_id_idx').on(t.userId),
    dateIdx: index('stock_outs_transaction_date_idx').on(t.transactionDate),
    typeIdx: index('stock_outs_type_idx').on(t.type),
    quantityCheck: check(
      'stock_outs_quantity_positive',
      sql`${t.quantity} > 0`
    ),
    paidAmountNonNegative: check(
      'stock_outs_paid_amount_non_negative',
      sql`${t.paidAmount} >= 0`
    ),
    paidAmountCheck: check(
      'stock_outs_paid_amount_limit',
      sql`${t.totalAmount} IS NULL OR ${t.paidAmount} <= ${t.totalAmount}`
    ),
    saleUnitPriceCheck: check(
      'stock_outs_sale_unit_price_check',
      sql`${t.type} <> 'sale' OR (${t.unitPrice} IS NOT NULL AND ${t.unitPrice} > 0)`
    ),
  })
)

export const stockAdjustments = pgTable(
  'stock_adjustments',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    previousQuantity: integer('previous_quantity').notNull(),
    adjustmentQuantity: integer('adjustment_quantity').notNull(),
    resultingQuantity: integer('resulting_quantity').notNull(),
    reason: text('reason').notNull(),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    productIdx: index('stock_adjustments_product_id_idx').on(t.productId),
    userIdx: index('stock_adjustments_user_id_idx').on(t.userId),
    dateIdx: index('stock_adjustments_transaction_date_idx').on(
      t.transactionDate
    ),
    previousCheck: check(
      'stock_adjustments_previous_non_negative',
      sql`${t.previousQuantity} >= 0`
    ),
    resultingCheck: check(
      'stock_adjustments_resulting_non_negative',
      sql`${t.resultingQuantity} >= 0`
    ),
    mathCheck: check(
      'stock_adjustments_resulting_equals_previous_plus_adjustment',
      sql`${t.resultingQuantity} = ${t.previousQuantity} + ${t.adjustmentQuantity}`
    ),
  })
)

export const income = pgTable(
  'income',
  {
    id: serial('id').primaryKey(),
    description: varchar('description', { length: 500 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    category: varchar('category', { length: 100 }),
    sourceType: incomeSourceTypeEnum('source_type').notNull().default('manual'),
    stockOutId: integer('stock_out_id').references(() => stockOuts.id, {
      onDelete: 'set null',
    }),
    paymentDate: timestamp('payment_date'),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    stockOutIdx: index('income_stock_out_id_idx').on(t.stockOutId),
    userIdx: index('income_user_id_idx').on(t.userId),
    dateIdx: index('income_transaction_date_idx').on(t.transactionDate),
    amountCheck: check('income_amount_positive', sql`${t.amount} > 0`),
  })
)

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    description: varchar('description', { length: 500 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    category: varchar('category', { length: 100 }),
    sourceType: expenseSourceTypeEnum('source_type')
      .notNull()
      .default('manual'),
    stockInId: integer('stock_in_id').references(() => stockIns.id, {
      onDelete: 'set null',
    }),
    paymentDate: timestamp('payment_date'),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    stockInIdx: index('expenses_stock_in_id_idx').on(t.stockInId),
    userIdx: index('expenses_user_id_idx').on(t.userId),
    dateIdx: index('expenses_transaction_date_idx').on(t.transactionDate),
    amountCheck: check('expenses_amount_positive', sql`${t.amount} > 0`),
  })
)

export const payables = pgTable(
  'payables',
  {
    id: serial('id').primaryKey(),
    supplierName: varchar('supplier_name', { length: 255 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paidAmount: numeric('paid_amount', { precision: 12, scale: 2 })
      .notNull()
      .default('0'),
    dueDate: timestamp('due_date').notNull(),
    sourceType: payableSourceTypeEnum('source_type')
      .notNull()
      .default('manual'),
    stockInId: integer('stock_in_id').references(() => stockIns.id, {
      onDelete: 'set null',
    }),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    stockInIdx: index('payables_stock_in_id_idx').on(t.stockInId),
    userIdx: index('payables_user_id_idx').on(t.userId),
    dueDateIdx: index('payables_due_date_idx').on(t.dueDate),
    amountCheck: check('payables_amount_positive', sql`${t.amount} > 0`),
    paidAmountCheck: check(
      'payables_paid_amount_check',
      sql`${t.paidAmount} >= 0 AND ${t.paidAmount} <= ${t.amount}`
    ),
  })
)

export const receivables = pgTable(
  'receivables',
  {
    id: serial('id').primaryKey(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paidAmount: numeric('paid_amount', { precision: 12, scale: 2 })
      .notNull()
      .default('0'),
    dueDate: timestamp('due_date').notNull(),
    sourceType: receivableSourceTypeEnum('source_type')
      .notNull()
      .default('manual'),
    stockOutId: integer('stock_out_id').references(() => stockOuts.id, {
      onDelete: 'set null',
    }),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    transactionDate: timestamp('transaction_date').notNull().defaultNow(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    stockOutIdx: index('receivables_stock_out_id_idx').on(t.stockOutId),
    userIdx: index('receivables_user_id_idx').on(t.userId),
    dueDateIdx: index('receivables_due_date_idx').on(t.dueDate),
    amountCheck: check('receivables_amount_positive', sql`${t.amount} > 0`),
    paidAmountCheck: check(
      'receivables_paid_amount_check',
      sql`${t.paidAmount} >= 0 AND ${t.paidAmount} <= ${t.amount}`
    ),
  })
)

export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    id: serial('id').primaryKey(),
    type: paymentTransactionTypeEnum('type').notNull(),
    payableId: integer('payable_id').references(() => payables.id, {
      onDelete: 'restrict',
    }),
    receivableId: integer('receivable_id').references(() => receivables.id, {
      onDelete: 'restrict',
    }),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp('payment_date').notNull(),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    payableIdx: index('payment_transactions_payable_id_idx').on(t.payableId),
    receivableIdx: index('payment_transactions_receivable_id_idx').on(
      t.receivableId
    ),
    userIdx: index('payment_transactions_user_id_idx').on(t.userId),
    dateIdx: index('payment_transactions_payment_date_idx').on(t.paymentDate),
    amountCheck: check(
      'payment_transactions_amount_positive',
      sql`${t.amount} > 0`
    ),
    typeCheck: check(
      'payment_transactions_type_check',
      sql`(
        (${t.type} = 'payable' AND ${t.payableId} IS NOT NULL AND ${t.receivableId} IS NULL)
        OR
        (${t.type} = 'receivable' AND ${t.receivableId} IS NOT NULL AND ${t.payableId} IS NULL)
      )`
    ),
  })
)