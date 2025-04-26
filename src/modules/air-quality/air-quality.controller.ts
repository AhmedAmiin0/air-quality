import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { airQualityConstants } from './constants/air-quality.constants';

@Controller(airQualityConstants.airQualityRoute)
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) { }

  @ApiOperation({ summary: 'Get nearest city air quality' })
  @Get(airQualityConstants.nearestCityRoute)
  async getNearestCityAirQuality(
    @Query() query: GetAirQualityDto
  ) {
    return this.airQualityService.getNearestCityAirQuality(query)
  }

  @ApiOperation({ summary: 'Get most polluted time for paris' })
  @Get(airQualityConstants.mostPopulatedTimeRoute)
  async getMostPollutedTimeForParis(
  ) {
    return this.airQualityService.getMostPollutedTimeForParis()
  }
}
