import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AirQualityService } from '../src/modules/air-quality/air-quality.service';
import { of } from 'rxjs';
import { AirQualityResponseDto } from '../src/modules/air-quality/dto/air-quality.response.dto';
import { PollutionPeakDto } from '../src/modules/air-quality/dto/pollution-peak.dto';
import { AirQualityController } from '../src/modules/air-quality/air-quality.controller';
import { Logger } from '@nestjs/common';
import { IqairClient } from '../src/shared/iqair/iqair.client';
import { AirQualityRepository } from '../src/modules/air-quality/repositories/air-quality.repositories';
import { airQualityConstants } from '../src/modules/air-quality/constants/air-quality.constants';

describe('AirQualityController (e2e)', () => {
  let app: INestApplication;
  let airQualityService: AirQualityService;
  
  beforeEach(async () => {
    // Create a test module with only the necessary components
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getNearestCityAirQuality: jest.fn(),
            getMostPollutedTimeForParis: jest.fn(),
            saveFetchedAirQualityData: jest.fn(),
          }
        },
        {
          provide: IqairClient,
          useValue: {
            getAirQualityDataForNearestCity: jest.fn(),
          }
        },
        {
          provide: AirQualityRepository,
          useValue: {
            createAirQuality: jest.fn(),
            getMostPollutedTime: jest.fn(),
          }
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          }
        }
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Important: Set the global prefix to match your routes properly
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    airQualityService = moduleFixture.get<AirQualityService>(AirQualityService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/air-quality (GET)', () => {
    it('should return air quality data for nearest city', async () => {
      // Mock service response
      const mockResponse = new AirQualityResponseDto();
      mockResponse.Result = {
        Pollution: {
          aqius: 50,
          mainus: 'p2',
          aqicn: 20,
          maincn: 'p2',
          ts: '2024-04-26T12:00:00.000Z'
        }
      };
      
      jest.spyOn(airQualityService, 'getNearestCityAirQuality').mockReturnValue(of(mockResponse));
      
      // Make request
      return request(app.getHttpServer())
        .get(`/api/${airQualityConstants.airQualityRoute}?lat=48.856613&lon=2.352222`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.Result).toBeDefined();
          expect(res.body.Result.Pollution).toBeDefined();
          expect(res.body.Result.Pollution.aqius).toBe(50);
        });
    });
    
    it('should validate input parameters', async () => {
      // Make request with invalid parameters
      return request(app.getHttpServer())
        .get(`/api/${airQualityConstants.airQualityRoute}?lat=invalid&lon=2.352222`)
        .expect(400);
    });
  });
  
  describe('/api/air-quality/paris/peak (GET)', () => {
    it('should return most polluted time for Paris', async () => {
      // Mock service response
      const mockResponse = new PollutionPeakDto();
      mockResponse.date = '2024-04-26';
      mockResponse.time = '12:00:00';
      mockResponse.aqius = 100;
      
      jest.spyOn(airQualityService, 'getMostPollutedTimeForParis').mockReturnValue(of(mockResponse));
      
      // Make request
      return request(app.getHttpServer())
        .get(`/api/${airQualityConstants.airQualityRoute}${airQualityConstants.mostPopulatedTimeRoute}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.date).toBe('2024-04-26');
          expect(res.body.time).toBe('12:00:00');
          expect(res.body.aqius).toBe(100);
        });
    });
  });
}); 