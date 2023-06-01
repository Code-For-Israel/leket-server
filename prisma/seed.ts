// npx prisma db seed

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

const fs = require('fs');
const csv = require('csv-parser');

import { polygons } from './mock-data-seed';

// initialize Prisma Client
const prisma = new PrismaClient();

const getField = (index): CreateFieldDto => {
  return {
    name: `שדה ${index}`,
    product_name: chooseRandomlyFromEnum(Product),
    region: chooseRandomlyFromEnum(Region),
    farmer_id: Math.round(Math.random() * 100000).toString(),
    familiarity: chooseRandomlyFromEnum(Familiarity),
    latitude: Math.round(Math.random() * 100000),
    longitude: Math.round(Math.random() * 100000),
    category: chooseRandomlyFromEnum(FieldCategory),
    status: chooseRandomlyFromEnum(FieldStatus),
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

function createRandomPoint() {
  return {
    type: 'Point',
    coordinates: [getRandomFloat(1, 100), getRandomFloat(1, 100)],
  };
}

function chooseRandomlyFromEnum(myEnum) {
  const keys = Object.keys(myEnum);
  return myEnum[keys[(keys.length * Math.random()) << 0]];
}

function readDataFromCsv() {
  const results = [];

  fs.createReadStream('data/check.csv')
    .pipe(csv())
    .on('data', (data) => {
      console.log(data);
      results.push(data);
    })
    .on('end', () => {
      // console.log('CSV file successfully read. Data:', results);
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

async function insertRandomFields(numOfFields: number) {
  let polygon;
  for (let i = 0; i < numOfFields; i++) {
    const field = await prisma.field.create({ data: getField(i) });
    polygon = createRandomPolygon();
    const point = createRandomPoint();
    await prisma.$queryRaw(
      Prisma.sql`INSERT INTO "Geometry" (field_id, polygon, point) VALUES (${field.id}, ST_GeomFromGeoJSON(${polygon}), ST_GeomFromGeoJSON(${point}));`,
    );
  }
}

async function insert5FieldsRealPolygons() {
  let polygon;
  for (let i = 0; i < 5; i++) {
    const field = await prisma.field.create({ data: getField(i) });
    polygon = polygons[i];
    const point = createRandomPoint();
    await prisma.$queryRaw(
      Prisma.sql`INSERT INTO "Geometry" (field_id, polygon, point) VALUES (${field.id}, ST_GeomFromGeoJSON(${polygon}), ST_GeomFromGeoJSON(${point}));`,
    );
  }
}

async function main() {
  // await insertRandomFields(10);
  await insert5FieldsRealPolygons();
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
