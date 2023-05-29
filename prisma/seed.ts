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
import { CreateFieldDto } from '../src/fields/dto/create-field.dto';
import { FieldsService } from '../src/fields/fields.service';

// initialize Prisma Client
const prisma = new PrismaClient();

const getField = (index, product, familiarity, status): CreateFieldDto => {
  return {
    name: `שדה ${index}`,
    product_name: product,
    region: chooseRandomlyFromEnum(Region),
    farmer_id: Math.round(Math.random() * 100000).toString(),
    familiarity: familiarity,
    latitude: Math.round(Math.random() * 100000),
    longitude: Math.round(Math.random() * 100000),
    status: status,
  } as CreateFieldDto;
};

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomCoordinates(min, max) {
  const coordinates = [];
  for (let i = 0; i < 5; i++) {
    coordinates.push([getRandomFloat(min, max), getRandomFloat(min, max)]);
  }
  return [coordinates];
}

function createRandomPolygon() {
  return {
    type: 'Polygon',
    coordinates: createRandomCoordinates(1, 100),
  };
}

function chooseRandomlyFromEnum(myEnum) {
  const keys = Object.keys(myEnum);
  return myEnum[keys[(keys.length * Math.random()) << 0]];
}

async function main() {
  let polygon;
  for (let i = 0; i < 10; i++) {
    const field = await prisma.field.create({
      data: getField(
        i,
        chooseRandomlyFromEnum(Product),
        chooseRandomlyFromEnum(Familiarity),
        chooseRandomlyFromEnum(FieldStatus),
      ),
    });
    console.log(field);
    polygon = createRandomPolygon();
    await prisma.$queryRaw(
      Prisma.sql`INSERT INTO "Polygon" (field_id, polygon) VALUES (${field.id}, ST_GeomFromGeoJSON(${polygon}));`,
    );
  }
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
