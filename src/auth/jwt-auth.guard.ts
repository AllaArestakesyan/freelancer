import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super()
  }


  // canActivate(context: ExecutionContext) {
  //   console.log("context=>", context.switchToHttp().getRequest().headers.authorization);
  //   this.token = context.switchToHttp().getRequest().headers.authorization
  //   return super.canActivate(context);
  // }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      console.log(authToken);
      const resp = await this.authService.validateToken(authToken);
      request.decodedData = resp;
      const us = await this.authService.findOneById(resp.userId)
      console.log("resp===>", resp, us);
      if (!us || us.accessToken != authToken) {
        throw new UnauthorizedException();
      }
      return super.canActivate(context);
    } catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
  }

  handleRequest(err, user, info) {
    console.log("user=>......", user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user
  }
}
