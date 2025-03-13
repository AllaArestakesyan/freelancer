import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateJobSkillDto } from './dto/create-job-skill.dto';
import { UpdateJobSkillDto } from './dto/update-job-skill.dto';
import { JobSkill } from './entities/job-skill.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class JobSkillService {

  constructor(
    @InjectRepository(JobSkill) private jobSkillRepository: Repository<JobSkill>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(User) private userRepository: Repository<User>,

  ) { }

  async create({ userId, jobId, skillId }: any) {
    console.log(userId, jobId, skillId);
    
    const skill = await this.skillRepository.findOneBy({ id: skillId })
    if (!skill) {
      throw new NotFoundException('Oops! skills not found');
    }
    const job = await this.jobRepository.findOneBy({ id: jobId })
    if (!job) {
      throw new NotFoundException('Oops! job not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { customer: true } })
    console.log(user);
    
    if (!user) {
      throw new NotFoundException('Oops! user not found');
    }
    if (user.id != userId) {
      throw new NotFoundException('Oops! you do not have access');
    }
    const userskill = await this.jobSkillRepository.find({
      where: {
        skillId: skillId,
        jobId: jobId
      },
    })
    if (userskill.length) {
      throw new NotFoundException('Oops! job skills has already');
    } else {
      await this.jobSkillRepository.save({ jobId, skillId })
      return 'adds a new job skill';
    }
  }

  async findSkillByJobId(id: number) {
    const jobSkill = await this.jobSkillRepository.find({
      where: {
        jobId: id
      },
      relations: ['skill']
    })
    if (jobSkill) {
      return jobSkill;
    } else {
      throw new NotFoundException('Oops! job skills not found');
    }
  }

  async remove({ id, userId }: { id: number, userId: number }) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { freelancer: true } })
    if (!user) {
      throw new NotFoundException('Oops! user not found');
    }
    if (user.freelancer[0].id != userId) {
      throw new NotFoundException('Oops! you do not have access');
    } else {
      const jskill = await this.jobSkillRepository.findOneBy({ id });
      if (jskill) {
        this.jobSkillRepository.delete({ id })
        return "delete job skill - " + jskill.id;
      } else {
        throw new NotFoundException('Oops! job skills not found');
      }
    }
  }
}
