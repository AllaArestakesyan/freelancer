import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userServise:UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const us = await this.userServise.findOneById(payload.userId)
    console.log("payload",payload, us);

    return {
      userId: payload.userId,
      username: payload.email,
      role: payload.role,
      freelacer: payload.freelacer,
      customer: payload.customer,
      accessToken:us.accessToken
    };
  }
}
