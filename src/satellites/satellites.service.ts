import { Injectable } from '@nestjs/common';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Satellite } from '@prisma/client';
import { FieldsService } from '../fields/fields.service';

@Injectable()
export class SatellitesService {
  constructor(
    private prisma: PrismaService,
    private readonly fieldService: FieldsService,
  ) {}
  async create(createSatelliteDto: CreateSatelliteDto) {
    try {
      const createSatelliteRes = await this.prisma.satellite.create({
        data: createSatelliteDto,
      });
      const updateFieldRes = await this.updateFieldLastNdvi(createSatelliteRes); // once satellite is updated, update the field's latest_satelite_metric
      console.log('created Satellite info:', createSatelliteRes);
      console.log('updated field last NDVI info:', updateFieldRes);
    } catch (e) {
      console.error('Error creating satellite', e);
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
      console.error('Error updating satellite', e);
    }
  }

  remove(id: number) {
    return this.prisma.field.delete({ where: { id } });
  }

  private async updateFieldLastNdvi(satelliteRes: Satellite) {
    const fieldId = satelliteRes.field_id;
    const updateFieldDto = { latest_satelite_metric: satelliteRes.id };
    await this.fieldService.updateOne(fieldId, updateFieldDto);
  }
}
