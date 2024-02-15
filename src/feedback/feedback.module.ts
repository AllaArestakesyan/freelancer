import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports:[TypeOrmModule.forFeature([User, Job]), JobsModule],
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule {}
