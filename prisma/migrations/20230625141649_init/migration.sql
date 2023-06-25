-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.3.2";

-- CreateEnum
CREATE TYPE "FieldCategory" AS ENUM ('BUILDING', 'TUNNELS', 'CHAIN_HOUSE', 'GROWTH_HOUSES', 'NETWORK_COVERAGE', 'OPEN_SPACE');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('IRRELEVANT', 'TAKEN_CARE_OF', 'REQUIRES_CARE', 'IN_FOCAL_CARE', 'UNDER_THE_CARE_OF_AN_AREA_MANAGER', 'UNDER_THE_CARE_OF_A_COORDINATOR', 'NOT_IN_TREATMENT', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "Familiarity" AS ENUM ('IRRELEVANT', 'NOT_KNOWN', 'KNOWN_PICKED', 'KNOWN_NOT_PICKED');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SOUTH', 'NORTH', 'CENTER');

-- CreateEnum
CREATE TYPE "Product" AS ENUM ('AVOCADO', 'WATERMELON', 'PECAN', 'PEAR', 'PINEAPPLE', 'PERSIMMON', 'PEACH', 'ARTICHOKE', 'GRAPEFRUIT', 'BASIL', 'SWEET_POTATO', 'BANANA', 'GREEN_ONIONS', 'ONION', 'BROCCOLI', 'GAMBA', 'GIVAY', 'CARROT', 'CHERRY', 'SQUASH', 'PUMPKIN', 'QUINCE', 'LETTUCE', 'EGGPLANT', 'CORIANDER', 'CABBAGE', 'CAULIFLOWER', 'LOVIA', 'ARUM', 'LEMON', 'LICHY', 'TURNIP', 'CUCUMBER', 'MANGO', 'APRICOT', 'MANDARIN', 'NECTARINE', 'BEET', 'CELERY', 'TOMATO', 'CHERRY_TOMATO', 'CHARD', 'GRAPE', 'POMELA', 'POMLIT', 'PARSLEY', 'MUSHROOMS', 'HOT_PEPPER', 'PEPPER', 'PASSIONFRUIT', 'PAPAYA', 'SABRA', 'RADISH', 'COLORBY', 'KIWI', 'ZUCCHINI', 'CLEMENTINE', 'CARAMBOLA', 'POMEGRANATE', 'GARLIC', 'FENNEL', 'PLUM', 'LOQUAT', 'DILL', 'BEAN', 'STRAWBERRY', 'CORN', 'DATE', 'POTATO', 'APPLE', 'ORANGE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Geometry" (
    "field_id" INTEGER NOT NULL,
    "polygon" geometry,
    "point" geometry,

    CONSTRAINT "Geometry_pkey" PRIMARY KEY ("field_id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "product_name" "Product",
    "farmer_id" TEXT,
    "region" "Region" NOT NULL,
    "familiarity" "Familiarity" NOT NULL,
    "familiarity_desc" TEXT,
    "sentinel_id" TEXT,
    "latest_satellite_metric" DOUBLE PRECISION,
    "latest_satellite_date" TIMESTAMP(3),
    "latest_attractiveness_metric" DOUBLE PRECISION,
    "category" "FieldCategory",
    "status" "FieldStatus" NOT NULL,
    "status_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "delay_date" TIMESTAMP(3),
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satellite" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_id" INTEGER NOT NULL,
    "ndvi_max" DOUBLE PRECISION,
    "ndvi_min" DOUBLE PRECISION,
    "ndvi_std" DOUBLE PRECISION,
    "ndvi_mean" DOUBLE PRECISION NOT NULL,
    "ndvi_median" DOUBLE PRECISION,
    "like" BOOLEAN,

    CONSTRAINT "Satellite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attractiveness" (
    "id" SERIAL NOT NULL,
    "field_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mission_score" DOUBLE PRECISION NOT NULL,
    "market_score" DOUBLE PRECISION NOT NULL,
    "satellite_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "like" BOOLEAN,

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
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Field_latest_satellite_metric_latest_attractiveness_metric__idx" ON "Field"("latest_satellite_metric", "latest_attractiveness_metric", "status_date");

-- CreateIndex
CREATE INDEX "Field_latest_attractiveness_metric_latest_satellite_metric__idx" ON "Field"("latest_attractiveness_metric", "latest_satellite_metric", "status_date");

-- CreateIndex
CREATE INDEX "Field_status_date_latest_satellite_metric_latest_attractive_idx" ON "Field"("status_date", "latest_satellite_metric", "latest_attractiveness_metric");

-- CreateIndex
CREATE INDEX "Field_status_date_latest_attractiveness_metric_latest_satel_idx" ON "Field"("status_date", "latest_attractiveness_metric", "latest_satellite_metric");

-- CreateIndex
CREATE INDEX "Field_latest_satellite_metric_status_date_latest_attractive_idx" ON "Field"("latest_satellite_metric", "status_date", "latest_attractiveness_metric");

-- CreateIndex
CREATE INDEX "Field_delay_date_status_idx" ON "Field"("delay_date", "status");

-- CreateIndex
CREATE INDEX "Field_name_idx" ON "Field" USING SPGIST ("name");

-- CreateIndex
CREATE INDEX "Satellite_field_id_idx" ON "Satellite" USING HASH ("field_id");

-- CreateIndex
CREATE INDEX "Market_product_name_idx" ON "Market"("product_name");

-- CreateIndex
CREATE INDEX "Mission_field_id_idx" ON "Mission" USING HASH ("field_id");

-- CreateIndex
CREATE INDEX "History_field_id_idx" ON "History" USING HASH ("field_id");

-- AddForeignKey
ALTER TABLE "Geometry" ADD CONSTRAINT "Geometry_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Satellite" ADD CONSTRAINT "Satellite_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attractiveness" ADD CONSTRAINT "Attractiveness_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
