/*
  Warnings:

  - You are about to drop the column `Remaining` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `Spent` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `amount_remaining` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "Remaining",
DROP COLUMN "Spent",
ADD COLUMN     "amount_remaining" INTEGER NOT NULL,
ADD COLUMN     "amount_spent" INTEGER NOT NULL DEFAULT 0;
