// prisma/seed.ts

import {
  Familiarity,
  FieldCategory,
  FieldStatus,
  PrismaClient,
  Product,
  Region,
} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy fields
  const post1 = await prisma.field.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'field1',
      product_name: Product.TOMATO,
      farmer_id: '123s',
      region: Region.CENTER,
      familiarity: Familiarity.KNOWN_PICKED,
      familiarity_desc: 'talked yesterday',
      latitude: 123.546,
      longitude: 234.444,
      polygon: [1, 2, 3, 4, 5],
      category: FieldCategory.BUILDING,
      status: FieldStatus.IRRELEVANT,
      status_date: new Date().toISOString(),
      delay_date: new Date().toISOString(),
      created_date: new Date().toISOString(),
    },
  });

  const post2 = await prisma.field.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'field2',
      product_name: Product.CUCUMBER,
      farmer_id: '1223s',
      region: Region.CENTER,
      familiarity: Familiarity.KNOWN_PICKED,
      familiarity_desc: 'talked yesterday2',
      latitude: 123.546,
      longitude: 234.444,
      polygon: [1, 2, 3, 4, 5],
      category: FieldCategory.CHAIN_HOUSE,
      status: FieldStatus.UNDER_THE_CARE_OF_AN_AREA_MANAGER,
      status_date: new Date().toISOString(),
      delay_date: new Date().toISOString(),
      created_date: new Date().toISOString(),
    },
  });

  console.log({ post1, post2 });
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
