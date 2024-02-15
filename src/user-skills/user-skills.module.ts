import { Module } from '@nestjs/common';
import { UserSkillsService } from './user-skills.service';
import { UserSkillsController } from './user-skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSkill } from './entities/user-skill.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserSkill, Skill, User])],
  controllers: [UserSkillsController],
  providers: [UserSkillsService]
})
export class UserSkillsModule {}
