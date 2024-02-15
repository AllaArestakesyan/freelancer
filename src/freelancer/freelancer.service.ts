import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Freelancer } from './entities/freelancer.entity';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer) private freelancerRepository: Repository<Freelancer>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createFreelancerDto: CreateFreelancerDto) {
    await this.freelancerRepository.save(createFreelancerDto);
    return 'This action adds a new freelancer';
  }

  async findAll() {
    return  await this.freelancerRepository
    .createQueryBuilder("freelancer")
    .innerJoinAndSelect("freelancer.user", "user")
    .select(["freelancer","user.id", "user.name", "user.surname", "user.email", "user.role"])
    .getMany();
  }

  async findOne(id: number) {

    const user = await this.freelancerRepository
      .createQueryBuilder('freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .leftJoinAndSelect('freelancer.jobs', 'job')
      .where('freelancer.userId = :id', { id })
      .leftJoinAndSelect('job.customer', 'customer')
      .select(["job.id", "job.title", "job.description", "job.price", "job.status", "job.rate", "customer", "user.id", "user.name", "user.surname", "user.email", "freelancer.profession", "freelancer.salary"])
      .getOne();
    const avg = user.jobs.filter(elm => elm.rate && elm.status == 2).reduce((a, b) => a + b.rate, 0) / user.jobs.filter(elm => elm.rate && elm.status == 2).length
    return { ...user , avg}
  }
  
  async findUserBySkillAndSalary({ skill, minsalary, maxsalary }: { skill: string, minsalary: number, maxsalary: number }) {
    if (!minsalary) { minsalary = 0 }
    if (!maxsalary) {
      const q = await this.freelancerRepository.find({
        order: {
          salary: "DESC",
        },
        take: 1
      })
      if (q.length) {
        maxsalary = q[0].salary
      }
    }
    console.log(minsalary, maxsalary, skill);

    let freelancer = undefined;
    if (skill && skill != ' ') {
      freelancer = await this.freelancerRepository
        .createQueryBuilder('freelancer')
        .innerJoinAndSelect('freelancer.user', "user")
        .where('freelancer.salary >= :minsalary', { minsalary })
        .andWhere('freelancer.salary <= :maxsalary', { maxsalary })
        .leftJoinAndSelect("freelancer.skills", "user_skill")
        .leftJoinAndSelect("user_skill.skill", "skill")
        .andWhere("skill.name = :skill", { skill })
        .getMany()
    } else {
      freelancer = await this.freelancerRepository
        .createQueryBuilder('freelancer')
        .innerJoinAndSelect('freelancer.user', "user")
        .where('freelancer.salary >= :minsalary', { minsalary })
        .andWhere('freelancer.salary <= :maxsalary', { maxsalary })
        .leftJoinAndSelect("freelancer.skills", "user_skill")
        .leftJoinAndSelect("user_skill.skill", "skill")
        .getMany()
    }

    if (!freelancer) {
      throw new UnauthorizedException("freelancer not fount")
    } else {
      return freelancer
    }
  }

  async update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      const us = await this.freelancerRepository.findOneBy({ user });
      if (us) {
        this.freelancerRepository.update({ user }, updateFreelancerDto)
        return true;
      } else {
        throw new NotFoundException('Oops! freelancer not found');
      }
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }
}
