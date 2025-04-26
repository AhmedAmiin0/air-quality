import { Logger, Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { AirQualityController } from './air-quality.controller';
import { IqairModule } from '@/shared/iqair/iqair.module';
import { AirQualityRepository } from './repositories/air-quality.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityEntity } from './entities/air-quality.entity';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  controllers: [AirQualityController],
  providers: [AirQualityService, AirQualityRepository, Logger, SchedulerService],
  imports: [IqairModule, TypeOrmModule.forFeature([AirQualityEntity])],
})
export class AirQualityModule { }
