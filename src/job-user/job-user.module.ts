import { Module } from '@nestjs/common';
import { JobUserService } from './job-user.service';
import { JobUserController } from './job-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobUser } from './entities/job-user.entity';
import { User } from 'src/user/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports:[TypeOrmModule.forFeature([JobUser, User, Job])],
  controllers: [JobUserController],
  providers: [JobUserService]
})
export class JobUserModule {}
