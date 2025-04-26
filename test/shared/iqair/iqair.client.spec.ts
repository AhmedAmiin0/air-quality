import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IqairClient } from '@/shared/iqair/iqair.client';
import { IQAirApiResponse } from '@/shared/interfaces';
import { GetAirQualityDto } from '@/modules/air-quality/dto/get-air-quality.dto';
import { iqairEndpoints } from '@/shared/iqair/iqair.endpoints';

describe('IqairClient', () => {
    let iqairClient: IqairClient;
    let httpService: HttpService;
    let configService: ConfigService;

    const mockApiKey = 'mock-api-key';
    const mockBaseUrl = 'https://api.iqair.com/v1';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IqairClient,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        axiosRef: {
                            defaults: {
                                baseURL: undefined,
                            },
                        },
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        iqairClient = module.get<IqairClient>(IqairClient);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('getAirQualityDataForNearestCity', () => {
        it('should return air quality data when API call is successful', (done) => {
            // Arrange
            const mockParams: GetAirQualityDto = { lat: 40.7128, lon: -74.006 };
            const mockResponse: IQAirApiResponse = {
                status: 'success',
                data: {
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    location: {
                        type: 'Point',
                        coordinates: [[40.7128, -74.006]],
                    },
                    current: {
                        pollution: {
                            aqius: 42,
                            mainus: 'p2',
                            aqicn: 50,
                            maincn: 'p2',
                            ts: '2023-10-01T12:00:00Z',
                        },
                        weather: {
                            ts: '2023-10-01T12:00:00Z',
                            tp: 20,
                            pr: 1012,
                            hu: 60,
                            ws: 5,
                            wd: 180,
                            ic: '01d',

                        },
                    }
                },
            };



            const axiosResponse: AxiosResponse<IQAirApiResponse> = {
                data: mockResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            // Mock config service
            jest.spyOn(configService, 'get').mockImplementation((key: string) => {
                if (key === 'iqair.apiKey') return mockApiKey;
                if (key === 'iqair.baseUrl') return mockBaseUrl;
                return null;
            });

            // Mock HTTP service
            jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

            // Act & Assert
            iqairClient.getAirQualityDataForNearestCity(mockParams).subscribe({
                next: (response) => {
                    expect(response).toEqual(mockResponse);
                    expect(httpService.get).toHaveBeenCalledWith(iqairEndpoints.nearestCity, {
                        params: { ...mockParams, key: mockApiKey },
                    });
                    done();
                },
                error: (err) => done.fail(err),
            });
        });

        it('should throw an error when API call fails', (done) => {
            // Arrange
            const mockParams: GetAirQualityDto = { lat: 40.7128, lon: -74.006 };
            const mockError = new Error('API error');

            // Mock config service
            jest.spyOn(configService, 'get').mockImplementation((key: string) => {
                if (key === 'iqair.apiKey') return mockApiKey;
                if (key === 'iqair.baseUrl') return mockBaseUrl;
                return null;
            });

            // Mock HTTP service to throw error
            jest.spyOn(httpService, 'get').mockReturnValue(
                throwError(() => ({
                    isAxiosError: true,
                    toJSON: () => ({}),
                    response: {
                        status: 500,
                        data: { message: 'Internal Server Error' },
                    },
                }))
            );

            // Act & Assert
            iqairClient.getAirQualityDataForNearestCity(mockParams).subscribe({
                next: () => done.fail('Expected error but got success'),
                error: (err) => {
                    expect(err.message).toBe('Failed to fetch data from IQAir API');
                    done();
                },
            });
        });
    });
});