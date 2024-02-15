import { Customer } from './../customer/entities/customer.entity';
import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobSkillService } from 'src/job-skill/job-skill.service';
import { JobSkillModule } from 'src/job-skill/job-skill.module';
import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { JobUser } from 'src/job-user/entities/job-user.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Job, Freelancer, JobUser, User, Customer]), JobSkillModule ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
