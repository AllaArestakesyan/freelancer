import { Module } from '@nestjs/common';
import { JobSkillService } from './job-skill.service';
import { JobSkillController } from './job-skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSkill } from './entities/job-skill.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([JobSkill, Skill, Job, User])],
  controllers: [JobSkillController],
  providers: [JobSkillService],
  exports:[JobSkillService]
})
export class JobSkillModule {}
