import { Injectable, Logger } from '@nestjs/common';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Satellite } from '@prisma/client';
import { FieldsService } from '../fields/fields.service';

@Injectable()
export class SatellitesService {
  constructor(
    private prisma: PrismaService,
    private readonly fieldService: FieldsService,
    private logger: Logger = new Logger(SatellitesService.name),
  ) {}
  async create(createSatelliteDto: CreateSatelliteDto) {
    const satelliteRes = await this.prisma.$transaction(
      async (transactionPrisma: PrismaClient) => {
        const satellite = await transactionPrisma.satellite.create({
          data: createSatelliteDto,
        });
        await this.updateFieldLastNdvi(satellite, transactionPrisma);
        return satellite;
      },
    );
    this.logger.log('satellite created: ', satelliteRes);
  }

  async createMany(createSatelliteDtoArray: CreateSatelliteDto[]) {
    try {
      await this.prisma.$transaction(
        async (transactionPrisma: PrismaClient) => {
          const satellites = await transactionPrisma.satellite.createMany({
            data: createSatelliteDtoArray,
          });
          await Promise.all(
            createSatelliteDtoArray.map((satellite) =>
              this.updateFieldLastNdvi(satellite, transactionPrisma),
            ),
          );
          return satellites;
        },
      );
      this.logger.log('satellite values created');
      return true;
    } catch (e) {
      this.logger.log('Error creating satellite values', e);
      throw e;
    }
  }

  findAll(limit: number, offset: number) {
    return this.prisma.satellite.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.satellite.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSatelliteDto: UpdateSatelliteDto) {
    try {
      return this.prisma.satellite.update({
        where: { id },
        data: updateSatelliteDto,
      });
    } catch (e) {
      this.logger.log('Error updating satellite', e);
    }
  }

  remove(id: number) {
    return this.prisma.field.delete({ where: { id } });
  }

  private async updateFieldLastNdvi(
    satelliteRes: Satellite | CreateSatelliteDto,
    prismaClient: PrismaClient = this.prisma,
  ) {
    const fieldId = satelliteRes.field_id;
    const updateFieldDto = {
      latest_satellite_metric: satelliteRes.ndvi_mean,
      latest_satellite_date: satelliteRes.date,
    };
    return this.fieldService.updateOne(
      fieldId,
      updateFieldDto,
      prismaClient,
      false,
    );
  }
}
