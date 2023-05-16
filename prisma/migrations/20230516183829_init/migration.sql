-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.3.2";

-- CreateEnum
CREATE TYPE "FieldCategory" AS ENUM ('BUILDING', 'TUNNELS', 'CHAIN_HOUSE', 'GROWTH_HOUSES', 'NETWORK_COVERAGE', 'OPEN_SPACE');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('IRRELEVANT', 'TAKEN_CARE_OF', 'REQUIRES_CARE', 'IN_FOCAL_CARE', 'UNDER_THE_CARE_OF_AN_AREA_MANAGER', 'UNDER_THE_CARE_OF_A_COORDINATOR', 'NOT_IN_TREATMENT', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "Familiarity" AS ENUM ('NOT_RELEVANT', 'NOT_KNOWN', 'KNOWN_PICKED', 'KNOWN_NOT_PICKED');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SOUTH', 'NORTH', 'CENTER');

-- CreateEnum
CREATE TYPE "Product" AS ENUM ('AVOCADO', 'WATERMELON', 'PECAN', 'PEAR', 'PINEAPPLE', 'PERSIMMON', 'PEACH', 'ARTICHOKE', 'GRAPEFRUIT', 'BASIL', 'SWEET_POTATO', 'BANANAS', 'GREEN_ONIONS', 'ONION', 'BROCCOLI', 'GIVAY', 'CARROT', 'CHERRY', 'SQUASH', 'PUMPKIN', 'QUINCE', 'ACID', 'LETTUCE', 'EGGPLANT', 'CORIANDER', 'CABBAGE', 'CAULIFLOWER', 'LOVIA', 'ARUM', 'LEMON', 'LICHY', 'TURNIP', 'HOTEL', 'CUCUMBER', 'MANGO', 'USED', 'MANDARIN', 'NECTARINE', 'BEET', 'CELERY', 'TOMATO', 'CHERRY_TOMATO', 'BEET_LEAVES', 'GRAPE', 'POMELA', 'POMLIT', 'PARSLEY', 'MUSHROOMS', 'HOT_PEPPER', 'PEPPER', 'PASSIONFRUIT', 'PAPAYA', 'SABRA', 'RADISH', 'RADISHES', 'COLORBY', 'KIWI', 'ZUCCHINI', 'CLEMENTINE', 'CARAMBOLA', 'POMEGRANATE', 'GARLIC', 'GUARD', 'PLUM', 'LOQUAT', 'DILL', 'BEAN', 'STRAWBERRIES', 'CORN', 'TAMAR', 'POTATO', 'APPLE', 'ORANGE');

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "product_name" "Product",
    "farmer_id" TEXT,
    "region" "Region" NOT NULL,
    "familiarity" "Familiarity" NOT NULL,
    "familiarity_desc" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "polygon" geometry NOT NULL,
    "latest_satelite_metric" DOUBLE PRECISION,
    "category" "FieldCategory" NOT NULL,
    "status" "FieldStatus" NOT NULL,
    "status_date" TIMESTAMP(3) NOT NULL,
    "delay_date" TIMESTAMP(3) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satellite" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "field_id" INTEGER NOT NULL,
    "statistics" JSONB NOT NULL,
    "like" BOOLEAN NOT NULL,

    CONSTRAINT "Satellite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attractiveness" (
    "id" SERIAL NOT NULL,
    "field_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mission_score" DOUBLE PRECISION NOT NULL,
    "market_score" DOUBLE PRECISION NOT NULL,
    "satellite_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "like" BOOLEAN NOT NULL,

    CONSTRAINT "Attractiveness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "product_name" "Product" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "field_id" INTEGER NOT NULL,
    "product_name" "Product" NOT NULL,
    "amount_kg" DOUBLE PRECISION NOT NULL,
    "was_ripe" TEXT NOT NULL,
    "was_picked" BOOLEAN NOT NULL,
    "not_picked_desc" TEXT NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_id" INTEGER NOT NULL,
    "product_name" "Product" NOT NULL,
    "farmer_id" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Field_category_idx" ON "Field"("category");

-- CreateIndex
CREATE INDEX "Field_familiarity_idx" ON "Field"("familiarity");

-- CreateIndex
CREATE INDEX "Field_region_idx" ON "Field"("region");

-- CreateIndex
CREATE INDEX "Field_status_idx" ON "Field"("status");

-- CreateIndex
CREATE INDEX "Field_product_name_region_status_idx" ON "Field"("product_name", "region", "status");

-- CreateIndex
CREATE INDEX "Satellite_field_id_idx" ON "Satellite"("field_id");

-- CreateIndex
CREATE INDEX "Attractiveness_field_id_date_idx" ON "Attractiveness"("field_id", "date");

-- CreateIndex
CREATE INDEX "Market_product_name_idx" ON "Market"("product_name");

-- CreateIndex
CREATE INDEX "Mission_field_id_product_name_idx" ON "Mission"("field_id", "product_name");

-- CreateIndex
CREATE INDEX "Mission_product_name_idx" ON "Mission"("product_name");

-- CreateIndex
CREATE INDEX "History_field_id_product_name_idx" ON "History"("field_id", "product_name");

-- AddForeignKey
ALTER TABLE "Satellite" ADD CONSTRAINT "Satellite_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attractiveness" ADD CONSTRAINT "Attractiveness_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
