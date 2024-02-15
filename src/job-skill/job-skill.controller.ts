import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Request } from '@nestjs/common';
import { JobSkillService } from './job-skill.service';
import { CreateJobSkillDto } from './dto/create-job-skill.dto';
import { UpdateJobSkillDto } from './dto/update-job-skill.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/role.enum';
import { Response } from 'express';

@Controller('job-skill')
@ApiTags('JobSkills*')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobSkillController {
  constructor(private readonly jobSkillService: JobSkillService) { }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer-ին հնարավորություն է տալիս գոյություն ունեցող job-ին նոր skill ավելացնել" })
  @HasRoles(Role.CUSTOMER)
  @Post()
  async create(@Body() createJobSkillDto: CreateJobSkillDto, @Res() res: Response, @Request() req) {
    try {
        const data = await this.jobSkillService.create({ ...createJobSkillDto, userId: req.user.userId });
        return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer-ին հնարավորություն է տալիս  գոյություն ունեցող job-ից ջնջել skills" })
  @HasRoles(Role.CUSTOMER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
        const data = await this.jobSkillService.remove({id:+id, userId: req.user.userId });
        return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }
}
