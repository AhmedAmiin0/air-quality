import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityRepository } from './air-quality.repositories';
import { AirQualityEntity } from '../entities/air-quality.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AirQualityRepository', () => {
  let repository: AirQualityRepository;
  let typeOrmRepository: jest.Mocked<Repository<AirQualityEntity>>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityRepository,
        {
          provide: getRepositoryToken(AirQualityEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<AirQualityRepository>(AirQualityRepository);
    typeOrmRepository = module.get(getRepositoryToken(AirQualityEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createAirQuality', () => {
    it('should create and save an air quality entity', async () => {
      const airQualityData: Partial<AirQualityEntity> = {
        city: 'Paris',
        lat: 48.856613,
        lon: 2.352222,
        aqius: 50,
      };

      const createdEntity = { ...airQualityData, id: 1 };
      const savedEntity = { ...createdEntity, createdAt: new Date() };

      typeOrmRepository.create.mockReturnValue(createdEntity as AirQualityEntity);
      typeOrmRepository.save.mockResolvedValue(savedEntity as AirQualityEntity);

      const result = await repository.createAirQuality(airQualityData);

      expect(typeOrmRepository.create).toHaveBeenCalledWith(airQualityData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('getMostPollutedTime', () => {
    it('should find most polluted time for a city', async () => {
      const city = 'Paris';
      const mockEntity: AirQualityEntity = {
        id: 1,
        city: 'Paris',
        lat: 48.856613,
        lon: 2.352222,
        aqius: 100,
        createdAt: new Date(),
      };

      typeOrmRepository.findOneOrFail.mockResolvedValue(mockEntity);

      const result = await repository.getMostPollutedTime(city);

      expect(typeOrmRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { city },
        order: { aqius: 'DESC' },
      });
      expect(result).toEqual(mockEntity);
    });

    it('should throw an error if no record is found', async () => {
      const city = 'NonExistentCity';
      const errorMessage = 'Entity not found';
      
      typeOrmRepository.findOneOrFail.mockRejectedValue(new Error(errorMessage));

      await expect(repository.getMostPollutedTime(city)).rejects.toThrow(errorMessage);
      expect(typeOrmRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { city },
        order: { aqius: 'DESC' },
      });
    });
  });
}); 