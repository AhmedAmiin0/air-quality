import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { IqairClient } from './iqair.client';
import { GetAirQualityDto } from '@/modules/air-quality/dto/get-air-quality.dto';
import { IQAirApiResponse } from '../interfaces';

describe('IqairClient', () => {
  let iqairClient: IqairClient;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  const mockConfig = {
    apiKey: 'test-api-key',
    serviceName: 'test-service',
    baseUrl: 'https://api.test.com'
  };

  const mockAirQualityData: IQAirApiResponse = {
    status: 'success',
    data: {
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      location: {
        type: 'Point',
        coordinates: [[0, 0]]
      },
      current: {
        pollution: {
          ts: '2024-04-26T12:00:00.000Z',
          aqius: 50,
          mainus: 'p2',
          aqicn: 20,
          maincn: 'p2'
        },
        weather: {
          ts: '2024-04-26T12:00:00.000Z',
          tp: 20,
          pr: 1013,
          hu: 50,
          ws: 5,
          wd: 180,
          ic: '01d'
        }
      }
    }
  };

  beforeEach(() => {
    mockHttpService = {
      get: jest.fn(),
      axiosRef: {
        defaults: {
          baseURL: ''
        }
      }
    } as any;

    mockConfigService = {
      get: jest.fn().mockReturnValue(mockConfig)
    } as any;

    iqairClient = new IqairClient(mockHttpService, mockConfigService);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('iqair');
      expect(mockHttpService.axiosRef.defaults.baseURL).toBe(mockConfig.baseUrl);
    });
  });

  describe('getAirQualityDataForNearestCity', () => {
    const testParams: GetAirQualityDto = {
      lat: 40.7128,
      lon: -74.0060
    };

    it('should make correct API call and return data', (done) => {
      const mockResponse = {
        data: mockAirQualityData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      iqairClient.getAirQualityDataForNearestCity(testParams).subscribe({
        next: (result) => {
          expect(result).toEqual(mockAirQualityData);
          expect(mockHttpService.get).toHaveBeenCalledWith(
            expect.any(String),
            {
              params: {
                ...testParams,
                key: mockConfig.apiKey
              }
            }
          );
          done();
        }
      });
    });

    it('should handle API errors', (done) => {
      const error = new Error('API Error');
      mockHttpService.get.mockReturnValue(throwError(() => error));

      iqairClient.getAirQualityDataForNearestCity(testParams).subscribe({
        error: (err) => {
          expect(err.message).toBe('Failed to fetch data from IQAir API');
          done();
        }
      });
    });
  });
});
