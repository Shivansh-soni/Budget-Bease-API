/*
  Warnings:

  - You are about to drop the column `type` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "public"."personal_transactions" ADD COLUMN     "savingsSavings_id" INTEGER;

-- DropEnum
DROP TYPE "public"."budget_type";

-- CreateTable
CREATE TABLE "public"."Savings" (
    "savings_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "total_savings" INTEGER NOT NULL,
    "amount_saved" INTEGER NOT NULL DEFAULT 0,
    "amount_remaining" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Savings_pkey" PRIMARY KEY ("savings_id")
);

-- AddForeignKey
ALTER TABLE "public"."personal_transactions" ADD CONSTRAINT "personal_transactions_savingsSavings_id_fkey" FOREIGN KEY ("savingsSavings_id") REFERENCES "public"."Savings"("savings_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Savings" ADD CONSTRAINT "Savings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
