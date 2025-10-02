-- CreateEnum
CREATE TYPE "public"."budget_type" AS ENUM ('savings', 'budget');

-- CreateTable
CREATE TABLE "public"."Budget" (
    "budget_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "total_budget" INTEGER NOT NULL,
    "Spent" INTEGER NOT NULL DEFAULT 0,
    "Remaining" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "public"."budget_type" NOT NULL DEFAULT 'budget',

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("budget_id")
);

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
