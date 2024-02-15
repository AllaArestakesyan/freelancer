import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Freelancer } from './entities/freelancer.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Freelancer, User])],
  controllers: [FreelancerController],
  providers: [FreelancerService],
  exports: [FreelancerService],

})
export class FreelancerModule {}
