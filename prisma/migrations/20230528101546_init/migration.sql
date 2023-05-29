-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "familiarity_desc" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "status_date" DROP NOT NULL,
ALTER COLUMN "delay_date" DROP NOT NULL;
