import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userServ: UserService) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userServ.findOneForLogin(username);
    console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    console.log('user=>', user);
    const payload = {
      email: user.email,
      role: user.role,
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    await this.userServ.updateAaccessToken(user.id, accessToken)
    return {
      access_token: accessToken,
      role: user.role,
    };
  }
  async logout(user: User) {
    console.log('user=>', user);
    const payload = {
      email: user.email,
      role: user.role,
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    await this.userServ.deleteAaccessToken(user.id, accessToken)
    return true
  }
}
