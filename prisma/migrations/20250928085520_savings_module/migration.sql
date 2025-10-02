-- DropForeignKey
ALTER TABLE "public"."personal_transactions" DROP CONSTRAINT "personal_transactions_savingsSavings_id_fkey";

-- AlterTable
ALTER TABLE "public"."personal_transactions" ADD COLUMN     "savings_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."personal_transactions" ADD CONSTRAINT "personal_transactions_savings_id_fkey" FOREIGN KEY ("savings_id") REFERENCES "public"."Savings"("savings_id") ON DELETE SET NULL ON UPDATE CASCADE;
