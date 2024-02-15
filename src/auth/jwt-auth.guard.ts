import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private token: string) {
    super()
  }


  canActivate(context: ExecutionContext) {
    console.log("context=>", context.switchToHttp().getRequest().headers.authorization);
    this.token = context.switchToHttp().getRequest().headers.authorization
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    console.log("user=>......", user, this.token);
    if (err || !user || "Bearer "+user.accessToken!=this.token) {
      throw err || new UnauthorizedException();
    }
    return user
  }
}
