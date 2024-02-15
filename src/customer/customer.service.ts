import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
    await this.customerRepository.save(createCustomerDto);
    return 'adds a new customer';
  }

  async findAll() {
    return await this.customerRepository
    .createQueryBuilder("customer")
    .innerJoinAndSelect("customer.user", "user")
    .select(["customer","user.id", "user.name", "user.surname", "user.email", "user.role"])
    .getMany();
  }

  async findOne(id: number) {
    const user =  await this.customerRepository
    .createQueryBuilder("customer")
    .where("user.id = :id", {id})
    .innerJoinAndSelect("customer.user", "user")
    .select(["customer","user.id", "user.name", "user.surname", "user.email", "user.role"])
    .getOne();
    if (user) {
      return user
    } else {
      throw new NotFoundException("user not found")
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (user) {
      const us = await this.customerRepository.findOneBy({ user });
      if (us) {
        this.customerRepository.update({ user }, updateCustomerDto)
        return true;
      } else {
        throw new NotFoundException('Oops! customer not found');
      }
    } else {
      throw new NotFoundException('Oops! customer not found');
    }
  }
}
