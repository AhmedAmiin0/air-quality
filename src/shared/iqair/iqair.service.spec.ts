import { Test, TestingModule } from '@nestjs/testing';
import { IqairClient } from './iqair.client';

describe('IQairClient', () => {
  let service: IqairClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IqairClient],
    }).compile();

    service = module.get<IqairClient>(IqairClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
