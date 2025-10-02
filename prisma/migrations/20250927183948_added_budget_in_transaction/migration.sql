-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "amount_remaining" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."personal_transactions" ADD COLUMN     "budget_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."personal_transactions" ADD CONSTRAINT "personal_transactions_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."Budget"("budget_id") ON DELETE SET NULL ON UPDATE CASCADE;
