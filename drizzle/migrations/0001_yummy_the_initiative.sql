CREATE TYPE "public"."payment_transaction_type" AS ENUM('payable', 'receivable');--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "payment_transaction_type" NOT NULL,
	"payable_id" integer,
	"receivable_id" integer,
	"amount" numeric(12, 2) NOT NULL,
	"payment_date" timestamp NOT NULL,
	"reference" varchar(100),
	"notes" text,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_amount_positive" CHECK ("payment_transactions"."amount" > 0),
	CONSTRAINT "payment_transactions_type_check" CHECK ((
        ("payment_transactions"."type" = 'payable' AND "payment_transactions"."payable_id" IS NOT NULL AND "payment_transactions"."receivable_id" IS NULL)
        OR
        ("payment_transactions"."type" = 'receivable' AND "payment_transactions"."receivable_id" IS NOT NULL AND "payment_transactions"."payable_id" IS NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "stock_outs" ALTER COLUMN "paid_amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_outs" ADD COLUMN "payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payable_id_payables_id_fk" FOREIGN KEY ("payable_id") REFERENCES "public"."payables"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_receivable_id_receivables_id_fk" FOREIGN KEY ("receivable_id") REFERENCES "public"."receivables"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_transactions_payable_id_idx" ON "payment_transactions" USING btree ("payable_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_receivable_id_idx" ON "payment_transactions" USING btree ("receivable_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_payment_date_idx" ON "payment_transactions" USING btree ("payment_date");--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_previous_non_negative" CHECK ("stock_adjustments"."previous_quantity" >= 0);--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_resulting_equals_previous_plus_adjustment" CHECK ("stock_adjustments"."resulting_quantity" = "stock_adjustments"."previous_quantity" + "stock_adjustments"."adjustment_quantity");--> statement-breakpoint
ALTER TABLE "stock_outs" ADD CONSTRAINT "stock_outs_paid_amount_non_negative" CHECK ("stock_outs"."paid_amount" >= 0);--> statement-breakpoint
ALTER TABLE "stock_outs" ADD CONSTRAINT "stock_outs_paid_amount_limit" CHECK ("stock_outs"."total_amount" IS NULL OR "stock_outs"."paid_amount" <= "stock_outs"."total_amount");--> statement-breakpoint
ALTER TABLE "stock_outs" ADD CONSTRAINT "stock_outs_sale_unit_price_check" CHECK ("stock_outs"."type" <> 'sale' OR ("stock_outs"."unit_price" IS NOT NULL AND "stock_outs"."unit_price" > 0));