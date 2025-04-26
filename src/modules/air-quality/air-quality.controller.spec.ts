import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { IqairClient } from '@/shared/iqair/iqair.client';
import { Logger } from '@nestjs/common';
import { AirQualityRepository } from './repositories/air-quality.repositories';
import { of, firstValueFrom } from 'rxjs';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { AirQualityResponseDto } from './dto/air-quality.response.dto';
import { PollutionPeakDto } from './dto/pollution-peak.dto';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let service: AirQualityService;
  let mockIqairClient: Partial<IqairClient>;
  let mockAirQualityRepository: Partial<AirQualityRepository>;

  beforeEach(async () => {
    mockIqairClient = {
      getAirQualityDataForNearestCity: jest.fn().mockReturnValue(of({
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
      }))
    };

    mockAirQualityRepository = {
      createAirQuality: jest.fn().mockResolvedValue({}),
      getMostPollutedTime: jest.fn().mockResolvedValue({
        date: '2024-04-26T12:00:00.000Z',
        aqius: 100
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        AirQualityService,
        { provide: IqairClient, useValue: mockIqairClient },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn() } },
        { provide: AirQualityRepository, useValue: mockAirQualityRepository }
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    service = module.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNearestCityAirQuality', () => {
    it('should return air quality data for nearest city', async () => {
      const query: GetAirQualityDto = { lat: 40.7128, lon: -74.0060 };
      
      const responseDto = new AirQualityResponseDto();
      
      jest.spyOn(service, 'getNearestCityAirQuality').mockReturnValue(of(responseDto));

      const resultObservable = await controller.getNearestCityAirQuality(query);
      const result = await firstValueFrom(resultObservable);
      
      expect(result).toEqual(responseDto);
      expect(service.getNearestCityAirQuality).toHaveBeenCalledWith(query);
    });
  });

  describe('getMostPollutedTimeForParis', () => {
    it('should return most polluted time for Paris', async () => {
      const expectedResponse = new PollutionPeakDto();
      
      if ('date' in expectedResponse) {
        expectedResponse.date = '2024-04-26';
      }
      
      if ('aqius' in expectedResponse) {
        expectedResponse.aqius = 100;
      }
      
      jest.spyOn(service, 'getMostPollutedTimeForParis').mockReturnValue(of(expectedResponse));

      const resultObservable = await controller.getMostPollutedTimeForParis();
      const result = await firstValueFrom(resultObservable);
      
      expect(result).toEqual(expectedResponse);
      expect(service.getMostPollutedTimeForParis).toHaveBeenCalled();
    });
  });
});
