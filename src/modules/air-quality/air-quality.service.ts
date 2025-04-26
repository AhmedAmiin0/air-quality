import { IqairClient } from '@/shared/iqair/iqair.client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { catchError, first, from, map, Observable, switchMap, tap } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { AirQualityRepository } from './repositories/air-quality.repositories';
import { AirQualityEntity } from './entities/air-quality.entity';
import { PollutionPeakDto } from './dto/pollution-peak.dto';
import { AirQualityResponseDto } from './dto/air-quality.response.dto';
import { IQAirApiResponse } from '@/shared/interfaces';

@Injectable()
export class AirQualityService {
    constructor(private readonly iqairClient: IqairClient, private readonly logger: Logger, private readonly airQualityRepository: AirQualityRepository) { }
    getNearestCityAirQuality(query: GetAirQualityDto): Observable<AirQualityResponseDto> {
        return this.iqairClient.getAirQualityDataForNearestCity(query)
            .pipe(
                map((response) => {
                    return plainToInstance(AirQualityResponseDto, response.data.current.pollution, {
                        excludeExtraneousValues: true,
                    })
                }),
                catchError((error) => {
                    console.error('Error fetching data from IQAir API:', error);
                    throw new BadRequestException('Failed to fetch data from IQAir API');
                })
            )
    }
    saveFetchedAirQualityData(): Observable<AirQualityEntity> {
        const payload = { lat: 48.856613, lon: 2.352222 };

        return from(this.iqairClient.getAirQualityDataForNearestCity(payload)).pipe(
            first(),
            tap((data) => this.logger.log("Air quality data fetched", data)),
            switchMap(({ data }: IQAirApiResponse) => {
                Object.assign(payload, {
                    aqius: data.current.pollution.aqius,
                    city: data.city,
                })
                return from(this.airQualityRepository.createAirQuality(payload)).pipe(
                    map((data) => data)
                );
            }),
            tap((airQuality) =>
                this.logger.log("Air Quality Data Has been saved !!!!", airQuality)
            ),
            catchError((error) => {
                this.logger.error("Error saving air quality data:", error);
                throw new BadRequestException("Failed to save air quality data");
            })
        );
    }


    getMostPollutedTimeForParis(): Observable<PollutionPeakDto> {
        return from(this.airQualityRepository.getMostPollutedTime("Paris")).pipe(
            first(),
            map((data) => {
                return plainToInstance(PollutionPeakDto, data, {
                    excludeExtraneousValues: true,
                });
            }),
            catchError((error) => {
                this.logger.error("Error fetching most polluted time:", error);
                throw new BadRequestException("Failed to fetch most polluted time");
            })
        );
    }

}
