import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@/shared/shared.module';
import { IqairModule } from './shared/iqair/iqair.module';
import { AirQualityModule } from './modules/air-quality/air-quality.module';
@Module({
  imports: [
    SharedModule,
    AirQualityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
