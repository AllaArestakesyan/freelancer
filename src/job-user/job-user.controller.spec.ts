import { Test, TestingModule } from '@nestjs/testing';
import { JobUserController } from './job-user.controller';
import { JobUserService } from './job-user.service';

describe('JobUserController', () => {
  let controller: JobUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobUserController],
      providers: [JobUserService],
    }).compile();

    controller = module.get<JobUserController>(JobUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
