import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Res, Req, Request } from '@nestjs/common';
import { UserSkillsService } from './user-skills.service';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
import { UpdateUserSkillDto } from './dto/update-user-skill.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/user/role/role.enum';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags('UserSkills*')
@Controller('user-skills')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserSkillsController {
  constructor(private readonly userSkillsService: UserSkillsService) { }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"freelancer—ին հնարավորություն է տալիս նոր skills ավելացնել"})
  @HasRoles(Role.FREELANCER)
  @Post()
  async create(@Body() createUserSkillDto: CreateUserSkillDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userSkillsService.create({ ...createUserSkillDto, freelancerId: req.user.userId });
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }


  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"ցույց է տալիս տվյալ freelancer-ի skills"})
  @Get(":freelancerId")
  async findSkillByFreelacerId(@Param("freelancerId") id: number, @Res() res: Response) {
    try {
      const data = await this.userSkillsService.findSkillByFreelacerId(id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }


  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"freelancer—ին հնարավորություն է տալիս skills ջնջել"})
  @HasRoles(Role.FREELANCER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userSkillsService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }
}
