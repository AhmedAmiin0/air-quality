import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable } from 'rxjs';
import { IQAirApiResponse } from '../interfaces';
import { iqairEndpoints } from './iqair.endpoints';
import { GetAirQualityDto } from '@/modules/air-quality/dto/get-air-quality.dto';

@Injectable()
export class IqairClient {
    protected apiKey?: string;
    protected baseUrl?: string;
    protected serviceName?: string;
    constructor(private readonly axiosService: HttpService, configService: ConfigService) {
        this.apiKey = configService.get<string>('iqair.apiKey');
        this.baseUrl = configService.get<string>('iqair.baseUrl');
        this.serviceName = configService.get<string>('iqair.serviceName');
        this.axiosService.axiosRef.defaults.baseURL = this.baseUrl;
    }

    getAirQualityDataForNearestCity(params: GetAirQualityDto): Observable<IQAirApiResponse> {

        Object.assign(params, { key: this.apiKey })

        return this.axiosService.get<IQAirApiResponse>(iqairEndpoints.nearestCity, { params }).pipe(
            map((response) => response.data),
            catchError((error) => {
                console.error('Error fetching data from IQAir API:', error);
                throw new Error('Failed to fetch data from IQAir API');
            })
        )
    }
}
