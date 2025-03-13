import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpCode, UseGuards, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPassword } from './dto/forgot-password';
import { ResetPassword } from './dto/reset-password';

class Verify {
  @ApiProperty()
  email: string
  @ApiProperty()
  emailToken: string
}
@ApiTags("User*")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "գրանցվելիս հարկավոր է իրականացնել վերիֆիկացիա ըստ email, հարցմանը հարկավոր է ուղարկել 2 տվյալ email և emailToken, որը հարկավոր է վերցնել path-ից" })
  @Post("/verify")
  async verify(@Body() user: Verify, @Res() res: Response) {
    try {
      const data = await this.userService.verify(user);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "հնարավորություն է տալիս վերցնել բոլոր user-ի տվյալները" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ description: "հնարավորություն է տալիս վերցնել user-ի տվյալը ըստ id-ի" })
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Get(':id')
  // async findOneBy(@Param('id') id: number, @Res() res: Response) {
  //   try {
  //     const data = await this.userService.findOneById(id)
  //     return res.status(HttpStatus.OK).json(data)
  //   } catch (e) {
  //     return res.status(HttpStatus.OK).json({
  //       error: e.message
  //     })
  //   }
  // }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ description: "հնարավորություն է տալիս փոփոխել user-ի password" })
  @Patch('/us/changepassword')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.changePassword(changePassword, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "հնարավորություն է տալիս փոփոխել user-ի տվյալները -> name, surname" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const data = await this.userService.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }


  @HttpCode(HttpStatus.OK)
  @Patch('/us/forgotPassword')
  async forgotPassword(
    @Body() forgotPassword: ForgotPassword,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.forgotPassword(forgotPassword)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Patch('/us/resetPassword/:email')
  async resetPassword(
    @Body() resetPassword: ResetPassword,
    @Param("email") email: string,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.resetPassword(resetPassword, email)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }


  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս ջնջել user-ին" })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }
}
