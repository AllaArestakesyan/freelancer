import {
  Controller,
  Get,
  UseGuards,
  Post,

  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
  HttpCode,
  Req,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { HasRoles } from './auth/has-roles.decorator';
import { Role } from './user/role/role.enum';
import { RolesGuard } from './auth/roles.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user/user.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';
import { Login } from './user/dto/login-user.dto';

@ApiTags('Auth*')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userSerevice: UserService,
    private authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    description:
      'հարկավոր է մուտքագրել username և password, որպես պատասխան ստանում ենք access_token',
  })
  async login(@Body() us: Login, @Req() req) {
    console.log(us);
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  @ApiResponse({
    description: `profesion և salary դաշտերը լրացնում ենք միյան այն դեպքում, երբ տվյալ մարդը գրանցվում է որպես freelancer։\n
  description դաշտը լրացնում ենք միյան այն դեպքում, երբ տվյալ մարդը գրանցվում է որպես customer\n
  Կարող ենք գրանցում որպես admin(role = 0), customer(role = 1) կամ freelancer(role = 2),\n
   տվյալ էջում կա միայն մեկ admin, էջում գրանցվելիս մարդ ունի ընտրության 2 հնարավորություն customer կամ freelancer`,
  })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userSerevice.create(createUserDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description:
      'ըստ access_token -ի վերադարձնում է login եղած մարդու տվյալները',
  })
  @Get('profile')
  async getProfile(@Req() req, @Res() res: Response) {
    try {
      console.log('User--', req.user);

      const data = await this.userSerevice.findOne(req.user.username);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    description:
      'ըստ լոգին եղած մարդու տվյալների իր accessToken ջնջում է բազայից',
  })
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    try {
      console.log('User=>', req.user);
      const data = await this.authService.logout(req.user.userId)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message,
      });
    }
  }
}
