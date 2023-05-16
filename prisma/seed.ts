// prisma/seed.ts

import { Polygon } from 'geojson';
import {
  Familiarity,
  FieldCategory,
  FieldStatus,
  Prisma,
  PrismaClient,
  Product,
  Region,
} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy fields
  await create_field(
    5,
    'field1',
    Product.CUCUMBER,
    '123s',
    Region.CENTER,
    Familiarity.KNOWN_PICKED,
    'talked yesterday',
    123.546,
    234.444,
    {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0],
        ],
      ],
    },
    0,
    FieldCategory.BUILDING,
    FieldStatus.IRRELEVANT,
    new Date().toISOString(),
    new Date().toISOString(),
    new Date().toISOString(),
  );
}

async function create_field(
  id: number,
  name: string,
  product_name: Product,
  farmer_id: string,
  region: Region,
  familiarity: Familiarity,
  familiarity_desc,
  latitude: number,
  longitude: number,
  polygon: Polygon,
  latest_satelite_metric: number,
  category: FieldCategory,
  status: FieldStatus,
  status_date: string,
  delay_date: string,
  created_date: string,
) {
  const post1 =
    await prisma.$queryRaw(Prisma.sql`INSERT INTO "Field" (id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, polygon, latest_satelite_metric,
            category, status, status_date, delay_date, created_date)
             VALUES (${id}, ${name}, CAST(${product_name} AS "Product"), ${farmer_id}, CAST(${region} AS "Region"),
                     CAST(${familiarity} AS "Familiarity"), ${familiarity_desc}, ${latitude}, ${longitude}, ST_GeomFromGeoJSON(${polygon}),
                     ${latest_satelite_metric}, CAST(${category} AS "FieldCategory"), CAST(${status} AS "FieldStatus"),
                     CAST(${status_date} AS date), CAST(${delay_date} AS date), CAST(${created_date} AS date))
             ON CONFLICT (id) DO NOTHING
             RETURNING id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, CAST(polygon AS varchar), latest_satelite_metric,
            category, status, status_date, delay_date, created_date;`);

  console.log(post1);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
