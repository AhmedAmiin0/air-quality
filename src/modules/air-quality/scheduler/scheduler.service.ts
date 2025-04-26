import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AirQualityService } from "../air-quality.service";
import { catchError, of, tap } from "rxjs"; // Import for handling Observables

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly airQualityService: AirQualityService) {}

  @Cron(CronExpression.EVERY_MINUTE) 
  handleCron() {
    this.airQualityService
      .saveFetchedAirQualityData()
      .pipe(
        tap((savedAirQuality) => {
          this.logger.log("Air quality data saved:", savedAirQuality);
        }),
        catchError((error) => {
          this.logger.error("Error checking and saving air quality:", error);
          return of(null); 
        })
      )
      .subscribe();
  }
}
