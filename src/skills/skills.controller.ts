import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpCode, UseGuards, Request } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Role } from 'src/user/role/role.enum';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags("Skills*")
@Controller('skills')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս ավելացնել նոր skills,\n եթե տվյալ skills արդեն իսկ գոյություն ունի, ապա այն չի ավելացնում" })
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.skillsService.create(createSkillDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "ցույց է տալիս բոլոր skill-երը" })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.skillsService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "ցույց է տալիս տվյալ skill-ը և բոլոր այն freelancer-ներին, ովքեր տիրապետում են այդ skill-ին" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.skillsService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "ցույց է տալիս տվյալ skill-ը և բոլոր այն freelancer-ներին, ովքեր տիրապետում են այդ skill-ին" })
  @Get('findJobBySkillId/:id')
  async findJobBySkillId(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.skillsService.findJobBySkillId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս թարմացնել skills-ի name-ը" })
  @HasRoles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.skillsService.update(+id, updateSkillDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս ջնջել skill" })
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      const data = await this.skillsService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }
}
