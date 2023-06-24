import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { FieldStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async alertFinishedStatusDelay() {
    this.logger.log(
      'Executor started - looking for paused fields that need to be resumed',
    );
    const delayDatePassedFields = await this.prisma.field.findMany({
      where: { delay_date: { lte: new Date() } },
      select: { id: true, delay_date: true },
    });
    if (delayDatePassedFields.length > 0) {
      this.logger.log(
        'Executor found fields with delay date passed: ',
        delayDatePassedFields,
      );
      await this.prisma.field.updateMany({
        where: {
          id: {
            in: delayDatePassedFields.map((field) => field.id),
          },
        },
        data: {
          status: FieldStatus.REQUIRES_CARE,
          delay_date: null,
        },
      });
      this.logger.log("Updated fields' status to REQUIRES_CARE");
    }
  }
}
