import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';
import { IqairClient } from '@/shared/iqair/iqair.client';
import { Logger, BadRequestException } from '@nestjs/common';
import { AirQualityRepository } from './repositories/air-quality.repositories';
import { of, throwError } from 'rxjs';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { AirQualityResponseDto } from './dto/air-quality.response.dto';
import { PollutionPeakDto } from './dto/pollution-peak.dto';
import { IQAirApiResponse } from '@/shared/interfaces';
import { AirQualityEntity } from './entities/air-quality.entity';

describe('AirQualityService', () => {
  let service: AirQualityService;
  let iqairClient: IqairClient;
  let repository: AirQualityRepository;
  let logger: Logger;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: IqairClient,
          useValue: {
            getAirQualityDataForNearestCity: jest.fn()
          }
        },
        {
          provide: AirQualityRepository,
          useValue: {
            createAirQuality: jest.fn(),
            getMostPollutedTime: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    iqairClient = module.get<IqairClient>(IqairClient);
    repository = module.get<AirQualityRepository>(AirQualityRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNearestCityAirQuality', () => {
    const query: GetAirQualityDto = { lat: 40.7128, lon: -74.0060 };

    it('should return air quality data for nearest city', (done) => {
      jest.spyOn(iqairClient, 'getAirQualityDataForNearestCity').mockReturnValue(of(mockAirQualityData));

      service.getNearestCityAirQuality(query).subscribe({
        next: (result) => {
          expect(result).toBeInstanceOf(AirQualityResponseDto);
          expect(iqairClient.getAirQualityDataForNearestCity).toHaveBeenCalledWith(query);
          done();
        }
      });
    });

    it('should handle API errors', (done) => {
      jest.spyOn(iqairClient, 'getAirQualityDataForNearestCity').mockReturnValue(
        throwError(() => new Error('API Error'))
      );
      
      service.getNearestCityAirQuality(query).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('Failed to fetch data from IQAir API');
          done();
        }
      });
    });
  });

  describe('saveFetchedAirQualityData', () => {
    it('should save fetched air quality data', (done) => {
      jest.spyOn(iqairClient, 'getAirQualityDataForNearestCity').mockReturnValue(of(mockAirQualityData));
      
      const mockEntity: AirQualityEntity = {
        id: 1,
        city: 'Test City',
        lat: 48.856613,
        lon: 2.352222,
        aqius: 50,
        createdAt: new Date()
      };
      
      jest.spyOn(repository, 'createAirQuality').mockResolvedValue(mockEntity);

      service.saveFetchedAirQualityData().subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(iqairClient.getAirQualityDataForNearestCity).toHaveBeenCalled();
          expect(repository.createAirQuality).toHaveBeenCalled();
          expect(logger.log).toHaveBeenCalled();
          done();
        }
      });
    });

    it('should handle errors when saving data', (done) => {
      jest.spyOn(iqairClient, 'getAirQualityDataForNearestCity').mockReturnValue(of(mockAirQualityData));
      jest.spyOn(repository, 'createAirQuality').mockRejectedValue(new Error('Database error'));

      service.saveFetchedAirQualityData().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('Failed to save air quality data');
          expect(logger.error).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  describe('getMostPollutedTimeForParis', () => {
    it('should return most polluted time for Paris', (done) => {
      const mockPollutionData: Partial<AirQualityEntity> = {
        id: 1,
        city: 'Paris',
        lat: 48.856613,
        lon: 2.352222,
        aqius: 100,
        createdAt: new Date(),
        date: '2024-04-26T12:00:00.000Z'
      };
      
      jest.spyOn(repository, 'getMostPollutedTime').mockResolvedValue(mockPollutionData as AirQualityEntity);

      service.getMostPollutedTimeForParis().subscribe({
        next: (result) => {
          expect(result).toBeInstanceOf(PollutionPeakDto);
          expect(repository.getMostPollutedTime).toHaveBeenCalledWith('Paris');
          done();
        }
      });
    });

    it('should handle errors when fetching most polluted time', (done) => {
      jest.spyOn(repository, 'getMostPollutedTime').mockRejectedValue(new Error('Database error'));

      service.getMostPollutedTimeForParis().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('Failed to fetch most polluted time');
          expect(logger.error).toHaveBeenCalled();
          done();
        }
      });
    });
  });
}); 