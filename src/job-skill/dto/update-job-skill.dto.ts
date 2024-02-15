import { PartialType } from '@nestjs/swagger';
import { CreateJobSkillDto } from './create-job-skill.dto';

export class UpdateJobSkillDto extends PartialType(CreateJobSkillDto) {}
