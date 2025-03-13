import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { And, getConnection, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Role } from 'src/user/role/role.enum';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { v4 as uuidv4 } from 'uuid';
import { UserSkill } from 'src/user-skills/entities/user-skill.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { FreelancerService } from 'src/freelancer/freelancer.service';
import { CustomerService } from 'src/customer/customer.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPassword } from './dto/reset-password';
import { ForgotPassword } from './dto/forgot-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly freelancerService: FreelancerService,
    private readonly customerService: CustomerService
  ) { }


  async create(createUserDto: CreateUserDto) {
    console.log("createUserDto=>", createUserDto);
    
    const users = await this.userRepository.find({
      where: {
        email: createUserDto.email
      }
    })
    console.log(users);

    if (users.length) {
      throw new UnauthorizedException("Oops! email has already")
    } 
    // else if (createUserDto.role == Role.FREELANCER && !createUserDto.profession) {
    //   throw new UnauthorizedException("Oops! Freelancer must have profession")
    // } else if (createUserDto.role == Role.CUSTOMER && createUserDto.profession) {
    //   throw new UnauthorizedException("Oops! Customer already have profession")
    // }
    const { password, profession, description, salary, ...body } = createUserDto
    const hash = await bcrypt.hash(password, 10)
    const emailToken = uuidv4();
    const user = this.userRepository.create({ ...body, password: hash, isVerified: 0, emailToken });
    const us = await this.userRepository.save(user);
    console.log("us=>", us);
    
    if (us.role == Role.CUSTOMER) {
      await this.customerService.create({ userId: us.id, description })
    } else if (us.role == Role.FREELANCER) {
      await this.freelancerService.create({
        userId: us.id,
        salary: salary,
        profession: profession
      })
    }

    // const url = `http://localhost:3000/verify?email=${body.email}&emailToken=${emailToken}`;
    // await this.mailerService.sendMail({
    //   to: body.email,
    //   from: '...',
    //   subject: 'Welcome to CustomerFreelancer page! Confirm your Email',
    //   html: `Hi! There, You have recently visited 
    //   our website and entered your email.
    //   Please follow the given link to verify your email
    //   <a href='${url}'>click</a>       
    //   Thanks`
    // });
    return "add user"
  }

  findAll() {
    return this.userRepository.find();
  }


  async verify(user: { email: string, emailToken: string }) {
    const us = await this.userRepository.findOne({
      where: {
        email: user.email,
        emailToken: user.emailToken
      },
      relations: {
        freelancer: true,
        customer: true
      }
    })
    if (us) {
      await this.userRepository.update({ id: us.id }, { emailToken: null, isVerified: 1 })
      return "you are verified"
    } else {
      throw new NotFoundException("Oops! data not found")
    }
  }

  async findOne(username: string) {
    console.log(username);
    
    const user: any = await this.userRepository.findOne({
      where: {
        email: username
      },
      relations: {
        freelancer: true,
        customer: true
      }
    });
    if (!user) {
      throw new UnauthorizedException("Oops!  user not fount")
    } else {
      if (user.freelancer[0]) {
        user.freelancer = user.freelancer[0]
      } else {
        delete user.freelancer
      }
      if (user.customer[0]) {
        user.customer = user.customer[0]
      } else {
        delete user.customer
      }
      return user
    }
  }

  // async findOneById(id: number) {
  //   return await this.userRepository.findOne({
  //     where: {
  //       id
  //     },
  //     relations: ['skills']
  //   })
  // }

  async changePassword(data: ChangePasswordDto, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    console.log(user);
    let comp1 = bcrypt.compareSync(data.currentPassword, user.password);
    let comp = bcrypt.compareSync(data.password, user.password);
    console.log(data);
    console.log(comp1);

    if (!comp1) {
      throw new HttpException('Wrong passwors', HttpStatus.BAD_REQUEST);
    }
    if (!!comp) {
      throw new HttpException(
        'Current and new password can not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.password === data.confirmationPassword) {
      if (user) {
        this.userRepository.update(
          { id: id },
          { password: bcrypt.hashSync(data.password, 10) },
        );
        return 'password updated';
      } else {
        throw new NotFoundException('user not found');
      }
    } else {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const us = await this.userRepository.findOneBy({ id });
    if (us) {
      const {name, surname} = updateUserDto
      this.userRepository.update({ id }, {name, surname})
      return "update user - " + us.name;
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }

  async forgotPassword(fPass: ForgotPassword) {
    const user = await this.userRepository.findOne({
      where: {
        email: fPass.email,
      }
    })
    if (user) {
      const code = Math.floor(Math.random() * 10000000)
      await this.userRepository.update({ id: user.id }, { code });
      try {
        await this.mailerService.sendMail({
          to:user.email,
          from: '...',
          subject: 'Resetting your account password',
          html: `
          <h3 style='color:#0aa'>Hello ${user.name}</h3>\n
          You have requested to reset the password of your account.\n\n\n
          Here is the security code to change your password. 
          \n <h3 style='font-family:cursive'>${code}</h3>`
        });
      } catch (e) {
        console.log(e.message);
      }
      return 'forgotPassword - ' + user.email;
    } else {
      return new NotFoundException('user not found');
    }
  }

  async resetPassword(rPass: ResetPassword, email:string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        code:rPass.code
      }
    })
    if (user) {
      if(rPass.password !=rPass.confirm_password){
        throw new BadRequestException('Passwords do not match.');
      }
      await this.userRepository.update({id:user.id}, {
        password: bcrypt.hashSync(rPass.password, 10),
        code:null
      })
      return 'resetPassword - ' + user.email;
    } else {
      throw new BadRequestException('Invalid or expired reset code.');
    }
  }



  async remove(id: number) {
    const us = await this.userRepository.findOneBy({ id });
    if (us) {
      this.userRepository.delete({ id })
      return "delete user - " + us.name;
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }
}
