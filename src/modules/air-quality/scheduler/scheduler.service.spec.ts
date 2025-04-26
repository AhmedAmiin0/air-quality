import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { AirQualityService } from '../air-quality.service';
import { Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AirQualityEntity } from '../entities/air-quality.entity';

describe('SchedulerService', () => {
  let schedulerService: SchedulerService;
  let airQualityService: AirQualityService;
  let loggerSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: AirQualityService,
          useValue: {
            saveFetchedAirQualityData: jest.fn(),
          },
        },
      ],
    }).compile();

    schedulerService = module.get<SchedulerService>(SchedulerService);
    airQualityService = module.get<AirQualityService>(AirQualityService);
    
    // Spy on the logger methods
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(schedulerService).toBeDefined();
  });

  describe('handleCron', () => {
    it('should save air quality data successfully', (done) => {
      // Arrange
      const mockSavedData: AirQualityEntity = {
        id: 1,
        city: 'Paris',
        lat: 48.856613,
        lon: 2.352222,
        aqius: 50,
        createdAt: new Date(),
      };
      
      jest.spyOn(airQualityService, 'saveFetchedAirQualityData').mockReturnValue(of(mockSavedData));
      
      // Create a spy on the subscribe method to verify it's called
      const subscribeSpy = jest.spyOn(of(mockSavedData), 'subscribe');
      
      // Act
      schedulerService.handleCron();
      
      // Assert
      expect(airQualityService.saveFetchedAirQualityData).toHaveBeenCalled();
      
      // Wait for the asynchronous operations to complete
      setTimeout(() => {
        expect(loggerSpy).toHaveBeenCalledWith(
          'Air quality data saved:',
          expect.anything()
        );
        done();
      }, 0);
    });

    it('should handle errors when saving air quality data', (done) => {
      // Arrange
      const error = new Error('Failed to save data');
      jest.spyOn(airQualityService, 'saveFetchedAirQualityData').mockReturnValue(
        throwError(() => error)
      );
      
      // Act
      schedulerService.handleCron();
      
      // Assert
      expect(airQualityService.saveFetchedAirQualityData).toHaveBeenCalled();
      
      // Wait for the asynchronous operations to complete
      setTimeout(() => {
        expect(errorSpy).toHaveBeenCalledWith(
          'Error checking and saving air quality:',
          error
        );
        done();
      }, 0);
    });
  });
}); 