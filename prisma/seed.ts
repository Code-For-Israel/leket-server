// prisma/seed.ts

import {
  Familiarity,
  FieldStatus,
  PrismaClient,
  Product,
  Region,
} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.field.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'field1',
      product_name: Product.TOMATO,
      farmer_id: '123s',
      region: Region.CENTER,
      familiarity: Familiarity.KNOWN,
      familiarity_desc: 'talked yesterday',
      latitude: 123.546,
      longitude: 234.444,
      polygon: { p1: 123, p2: 255, p3: 275, p4: 3333 },
      category: 'what?',
      status: FieldStatus.IN_PROGRESS,
      status_date: Date.now(),
      delay_date: Date.now() - 100,
      created_date: Date.now(),
    },
  });

  const post2 = await prisma.field.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'field2',
      product_name: Product.CUCAMBER,
      farmer_id: '1223s',
      region: Region.CENTER,
      familiarity: Familiarity.KNOWN,
      familiarity_desc: 'talked yesterday2',
      latitude: 123.546,
      longitude: 234.444,
      polygon: { p1: 123, p2: 255, p3: 275, p4: 3333 },
      category: 'what?',
      status: FieldStatus.IN_PROGRESS,
      status_date: Date.now(),
      delay_date: Date.now() - 100,
      created_date: Date.now(),
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
