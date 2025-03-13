import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,

  ) { }


  async create(createFeedbackDto: any) {
    const us = await this.userRepository.findOne({where:{ id: createFeedbackDto.user.userId }, relations:{freelancer:true}})
    if (!us) {
      throw new NotFoundException('Oops! user not found');
    }
    const job = await this.jobRepository.findOneBy({ id: createFeedbackDto.jobId })
    if (!job) {
      throw new NotFoundException('Oops! job not found');
    }
    const { user, jobId, ...data } = createFeedbackDto;
    if (job.customerId == user.customer[0].id && job.status == 2) {
      await this.jobRepository.update({id:jobId},data)
      return 'adds a new feedback';
    } else {
      if (job.status != 2) {
        throw new NotFoundException('Oops! that job is not done');
      } else {
        throw new NotFoundException('Oops! you do not have access');
      }
    }
  }
}
