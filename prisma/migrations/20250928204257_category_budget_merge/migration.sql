/*
  Warnings:

  - You are about to drop the column `budget_id` on the `personal_transactions` table. All the data in the column will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total_budget` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."personal_transactions" DROP CONSTRAINT "personal_transactions_budget_id_fkey";

-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "amount_remaining" INTEGER,
ADD COLUMN     "amount_spent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_budget" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."personal_transactions" DROP COLUMN "budget_id";

-- DropTable
DROP TABLE "public"."Budget";
