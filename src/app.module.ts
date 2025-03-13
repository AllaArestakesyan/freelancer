import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { UserSkillsModule } from './user-skills/user-skills.module';
import { Skill } from './skills/entities/skill.entity';
import { UserSkill } from './user-skills/entities/user-skill.entity';
import { JobsModule } from './jobs/jobs.module';
import { JobUserModule } from './job-user/job-user.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JobSkillModule } from './job-skill/job-skill.module';
import { Job } from './jobs/entities/job.entity';
import { JobSkill } from './job-skill/entities/job-skill.entity';
import { JobUser } from './job-user/entities/job-user.entity';
import { CustomerModule } from './customer/customer.module';
import { FreelancerModule } from './freelancer/freelancer.module';
import { Customer } from './customer/entities/customer.entity';
import { Freelancer } from './freelancer/entities/freelancer.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [User, Skill, UserSkill, Job, JobSkill, JobUser, Customer, Freelancer],
      synchronize: true,
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '...',
          pass: '...',
        },
      },
    }),
    AuthModule,
    UserModule,
    CustomerModule,
    FreelancerModule,

    SkillsModule,
    UserSkillsModule,

    JobsModule,
    JobSkillModule,
    JobUserModule,

    FeedbackModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
