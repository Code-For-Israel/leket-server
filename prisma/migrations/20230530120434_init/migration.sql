-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "sentinel_id" TEXT;

-- CreateTable
CREATE TABLE "Geometry" (
    "field_id" INTEGER NOT NULL,
    "polygon" geometry,
    "point" geometry,

    CONSTRAINT "Geometry_pkey" PRIMARY KEY ("field_id")
);

-- AddForeignKey
ALTER TABLE "Geometry" ADD CONSTRAINT "Geometry_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
