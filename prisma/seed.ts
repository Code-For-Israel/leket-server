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
import {CreateFieldDto} from "../src/fields/dto/create-field.dto";

// initialize Prisma Client
const prisma = new PrismaClient();

const getField = (index, product, familiarity, status): CreateFieldDto => {
    return {
        "name": `שדה ${index}`,
        "product_name": product,
        "region": index%3 === 0 ? Region.CENTER : index%3 === 1 ? Region.NORTH : Region.SOUTH,
        "farmer_id": Math.round(Math.random() * 100000).toString(),
        "familiarity": familiarity,
        "latitude": Math.round(Math.random() * 100000),
        "longitude": Math.round(Math.random() * 100000),
        "status": status
    } as CreateFieldDto;
};

async function main() {
    let i=0;

    await prisma.field.create({ data: getField(i++, Product.EGGPLANT, Familiarity.KNOWN_NOT_PICKED, FieldStatus.IRRELEVANT)});
    await prisma.field.create({ data: getField(i++, Product.TOMATO, Familiarity.KNOWN_PICKED, FieldStatus.NOT_IN_TREATMENT)});
    await prisma.field.create({ data: getField(i++, Product.TOMATO, Familiarity.NOT_KNOWN, FieldStatus.IN_FOCAL_CARE)});
    await prisma.field.create({ data: getField(i++, Product.STRAWBERRIES, Familiarity.NOT_KNOWN, FieldStatus.REQUIRES_CARE)});
    await prisma.field.create({ data: getField(i++, Product.CARROT, Familiarity.IRRELEVANT, FieldStatus.UNDER_THE_CARE_OF_AN_AREA_MANAGER)});
    await prisma.field.create({ data: getField(i++, Product.EGGPLANT, Familiarity.NOT_KNOWN, FieldStatus.UNDER_THE_CARE_OF_A_COORDINATOR)});
    await prisma.field.create({ data: getField(i++, Product.GAMBA, Familiarity.IRRELEVANT, FieldStatus.TAKEN_CARE_OF)});
    await prisma.field.create({ data: getField(i++, Product.CUCUMBER, Familiarity.KNOWN_NOT_PICKED, FieldStatus.REQUIRES_CARE)});
    await prisma.field.create({ data: getField(i++, Product.TOMATO, Familiarity.IRRELEVANT, FieldStatus.ON_HOLD)});
    await prisma.field.create({ data: getField(i++, Product.CUCUMBER, Familiarity.KNOWN_NOT_PICKED, FieldStatus.IN_FOCAL_CARE)});
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
