CREATE TYPE "public"."expense_source_type" AS ENUM('stock_in', 'manual');--> statement-breakpoint
CREATE TYPE "public"."income_source_type" AS ENUM('stock_out', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payable_source_type" AS ENUM('stock_in', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'unpaid', 'partially_paid');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."receivable_source_type" AS ENUM('stock_out', 'manual');--> statement-breakpoint
CREATE TYPE "public"."stock_out_type" AS ENUM('sale', 'damage', 'internal_use', 'other');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'inventory_staff', 'finance_admin', 'manager');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" varchar(100),
	"source_type" "expense_source_type" DEFAULT 'manual' NOT NULL,
	"stock_in_id" integer,
	"payment_date" timestamp,
	"reference" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "expenses_amount_positive" CHECK ("expenses"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "income" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" varchar(100),
	"source_type" "income_source_type" DEFAULT 'manual' NOT NULL,
	"stock_out_id" integer,
	"payment_date" timestamp,
	"reference" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "income_amount_positive" CHECK ("income"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"average_cost" numeric(12, 4) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_quantity_non_negative" CHECK ("inventory"."quantity" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payables" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_name" varchar(255) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"paid_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"due_date" timestamp NOT NULL,
	"source_type" "payable_source_type" DEFAULT 'manual' NOT NULL,
	"stock_in_id" integer,
	"reference" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payables_amount_positive" CHECK ("payables"."amount" > 0),
	CONSTRAINT "payables_paid_amount_check" CHECK ("payables"."paid_amount" >= 0 AND "payables"."paid_amount" <= "payables"."amount")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"category_id" integer,
	"supplier_id" integer,
	"description" text,
	"unit" varchar(50) DEFAULT 'pcs' NOT NULL,
	"purchase_price" numeric(12, 2),
	"selling_price" numeric(12, 2),
	"min_stock_level" integer DEFAULT 0 NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receivables" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"paid_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"due_date" timestamp NOT NULL,
	"source_type" "receivable_source_type" DEFAULT 'manual' NOT NULL,
	"stock_out_id" integer,
	"reference" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "receivables_amount_positive" CHECK ("receivables"."amount" > 0),
	CONSTRAINT "receivables_paid_amount_check" CHECK ("receivables"."paid_amount" >= 0 AND "receivables"."paid_amount" <= "receivables"."amount")
);
--> statement-breakpoint
CREATE TABLE "stock_adjustments" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"previous_quantity" integer NOT NULL,
	"adjustment_quantity" integer NOT NULL,
	"resulting_quantity" integer NOT NULL,
	"reason" text NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stock_adjustments_resulting_non_negative" CHECK ("stock_adjustments"."resulting_quantity" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_ins" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"supplier_id" integer,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(12, 2) NOT NULL,
	"total_cost" numeric(12, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"paid_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"reference_number" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stock_ins_quantity_positive" CHECK ("stock_ins"."quantity" > 0),
	CONSTRAINT "stock_ins_paid_amount_check" CHECK ("stock_ins"."paid_amount" >= 0 AND "stock_ins"."paid_amount" <= "stock_ins"."total_cost")
);
--> statement-breakpoint
CREATE TABLE "stock_outs" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"type" "stock_out_type" NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2),
	"total_amount" numeric(12, 2),
	"paid_amount" numeric(12, 2) DEFAULT '0',
	"reference_number" varchar(100),
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stock_outs_quantity_positive" CHECK ("stock_outs"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_person" varchar(255),
	"phone" varchar(50),
	"email" varchar(255),
	"address" text,
	"notes" text,
	"status" "supplier_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'inventory_staff' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_stock_in_id_stock_ins_id_fk" FOREIGN KEY ("stock_in_id") REFERENCES "public"."stock_ins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_stock_out_id_stock_outs_id_fk" FOREIGN KEY ("stock_out_id") REFERENCES "public"."stock_outs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payables" ADD CONSTRAINT "payables_stock_in_id_stock_ins_id_fk" FOREIGN KEY ("stock_in_id") REFERENCES "public"."stock_ins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payables" ADD CONSTRAINT "payables_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_stock_out_id_stock_outs_id_fk" FOREIGN KEY ("stock_out_id") REFERENCES "public"."stock_outs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ins" ADD CONSTRAINT "stock_ins_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ins" ADD CONSTRAINT "stock_ins_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ins" ADD CONSTRAINT "stock_ins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_outs" ADD CONSTRAINT "stock_outs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_outs" ADD CONSTRAINT "stock_outs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_unique" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "expenses_stock_in_id_idx" ON "expenses" USING btree ("stock_in_id");--> statement-breakpoint
CREATE INDEX "expenses_user_id_idx" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expenses_transaction_date_idx" ON "expenses" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "income_stock_out_id_idx" ON "income" USING btree ("stock_out_id");--> statement-breakpoint
CREATE INDEX "income_user_id_idx" ON "income" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "income_transaction_date_idx" ON "income" USING btree ("transaction_date");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_product_id_unique" ON "inventory" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "payables_stock_in_id_idx" ON "payables" USING btree ("stock_in_id");--> statement-breakpoint
CREATE INDEX "payables_user_id_idx" ON "payables" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payables_due_date_idx" ON "payables" USING btree ("due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_unique" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_supplier_id_idx" ON "products" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "receivables_stock_out_id_idx" ON "receivables" USING btree ("stock_out_id");--> statement-breakpoint
CREATE INDEX "receivables_user_id_idx" ON "receivables" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "receivables_due_date_idx" ON "receivables" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "stock_adjustments_product_id_idx" ON "stock_adjustments" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_adjustments_user_id_idx" ON "stock_adjustments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_adjustments_transaction_date_idx" ON "stock_adjustments" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "stock_ins_product_id_idx" ON "stock_ins" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_ins_supplier_id_idx" ON "stock_ins" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "stock_ins_user_id_idx" ON "stock_ins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_ins_transaction_date_idx" ON "stock_ins" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "stock_outs_product_id_idx" ON "stock_outs" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_outs_user_id_idx" ON "stock_outs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_outs_transaction_date_idx" ON "stock_outs" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "stock_outs_type_idx" ON "stock_outs" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");