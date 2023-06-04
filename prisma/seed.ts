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
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - Math.round(Math.random() * 100));

  return {
    name: `שדה ${index}`,
    product_name: chooseRandomlyFromEnum(Product),
    region: chooseRandomlyFromEnum(Region),
    farmer_id: Math.round(Math.random() * 100000).toString(),
    familiarity: chooseRandomlyFromEnum(Familiarity),
    latest_satelite_metric: Math.round(Math.random() * 100) / 100,
    latest_attractiveness_metric: Math.round(Math.random() * 100) / 100,
    latitude: Math.round(Math.random() * 100000),
    longitude: Math.round(Math.random() * 100000),
    category: chooseRandomlyFromEnum(FieldCategory),
    status: chooseRandomlyFromEnum(FieldStatus),
    created_date: currentDate,
    status_date: currentDate,
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

async function readDataFromCsv(): Promise<string[]> {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream('data/check.csv')
      .pipe(csv())
      .on('data', (data: any) => {
        data.plot = data.plot.replace(/\(/g, '[').replace(/\)/g, ']');
        data.plot = `{"coordinates": [${data.plot}], "type": "Polygon"}`;
        results.push(data.plot);
      })
      .on('end', () => resolve(results))
      .on('error', (error: any) => reject(error));
  });

  /*const results = [];
console.log("enter");
  await fs.createReadStream('data/check.csv')
    .pipe(csv())
    .on('data', (data) => {
      data.plot = data.plot.replace("((", "[").replace("))", "]").replace(/\(/g, '').replace(/\)/g, '');
        polygons1.push(data.plot);
      console.log("pushing");
    })
    .on('end', () => {
      console.log('CSV file successfully read. Data:', results.length);
        // return results;
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    })
  // console.log("Exit. results=", results.length);
  //   return results;*/
}

function getPolygonCenter(polygon: number[][]) {
  const centerX =
    polygon.reduce((sum, point) => sum + point[0], 0) / polygon.length;
  const centerY =
    polygon.reduce((sum, point) => sum + point[1], 0) / polygon.length;

  return {
    type: 'Point',
    coordinates: [centerX, centerY],
  };
}

async function insertRandomFields(polygons: any[]) {
  let polygon;
  let point;
  for (let i = 0; i < polygons.length; i++) {
    const field = await prisma.field.create({ data: getField(i) });

    polygon = JSON.parse(polygons[i]);
    point = getPolygonCenter(polygon.coordinates[0]);
    // point = createRandomPoint();

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
  const polygons = await readDataFromCsv();
  await insertRandomFields(polygons);
  // await insert5FieldsRealPolygons();
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
