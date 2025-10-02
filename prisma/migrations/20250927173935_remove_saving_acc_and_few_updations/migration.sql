/*
  Warnings:

  - You are about to drop the column `raw_metadata` on the `personal_transactions` table. All the data in the column will be lost.
  - You are about to drop the `savings_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `savings_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."savings_accounts" DROP CONSTRAINT "savings_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."savings_transactions" DROP CONSTRAINT "savings_transactions_savings_account_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."savings_transactions" DROP CONSTRAINT "savings_transactions_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."personal_transactions" DROP COLUMN "raw_metadata";

-- DropTable
DROP TABLE "public"."savings_accounts";

-- DropTable
DROP TABLE "public"."savings_transactions";
