import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Request } from '@nestjs/common';
import { JobUserService } from './job-user.service';
import { CreateJobUserDto } from './dto/create-job-user.dto';
import { UpdateDone, UpdateJobUserDto } from './dto/update-job-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/role.enum';
import { Response } from 'express';

@Controller('job-user')
@ApiTags('JobUser*')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobUserController {
  constructor(private readonly jobUserService: JobUserService) { }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"freelancer-ին հնարավորություն է տալիս աշխատանքի համար հայտ ուղարկել"})
  @HasRoles(Role.FREELANCER)
  @Post()
  async create(@Body() createJobUserDto: CreateJobUserDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.jobUserService.create({...createJobUserDto, userId:req.user.userId});
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"հնարավորություն է տալիս ըստ jobId-ի տեսնել բոլոր freelancer-ների"})
  @Get('findByJobId/:id')
  async findByJobId(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobUserService.findByJobId(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"հնարավորություն է տալիս ըստ freelancerId-ի տեսնել բոլոր job-ների"})
  @Get('findByUserId/:id')
  async findByUserId(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobUserService.findByUserId(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:"հնարավորություն է տալիս ջնջել freelancer-ի ուղարկած հայտը "})
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      const data = await this.jobUserService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }
}
