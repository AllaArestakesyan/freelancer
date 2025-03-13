import { Controller, Get, UseGuards, Post, Request, Body, UploadedFile, UseInterceptors, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { HasRoles } from './auth/has-roles.decorator';
import { Role } from './user/role/role.enum';
import { RolesGuard } from './auth/roles.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user/user.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';
import { Login } from './user/dto/login-user.dto';

@ApiTags("Auth*")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly userSerevice: UserService,
    private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiResponse({ description: "հարկավոր է մուտքագրել username և password, որպես պատասխան ստանում ենք access_token" })
  async login(@Body() us: Login, @Request() req) {
    console.log(us);
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/register")
  @ApiResponse({
    description: `profesion և salary դաշտերը լրացնում ենք միյան այն դեպքում, երբ տվյալ մարդը գրանցվում է որպես freelancer։\n
  description դաշտը լրացնում ենք միյան այն դեպքում, երբ տվյալ մարդը գրանցվում է որպես customer\n
  Կարող ենք գրանցում որպես admin(role = 0), customer(role = 1) կամ freelancer(role = 2),\n
   տվյալ էջում կա միայն մեկ admin, էջում գրանցվելիս մարդ ունի ընտրության 2 հնարավորություն customer կամ freelancer`})
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userSerevice.create(createUserDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ description: "ըստ access_token -ի վերադարձնում է login եղած մարդու տվյալները" })
  @Get('profile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userSerevice.findOne(req.user.username)
      return res.status(HttpStatus.OK).json({ user: data })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }
}