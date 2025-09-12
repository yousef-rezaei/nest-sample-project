import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    const user = await this.userService.findUserByEmail(registerAuthDto.email);
    if (user) {
      throw new HttpException('User already exists', 400);
    }
    registerAuthDto.password = await bcrypt.hash(registerAuthDto.password, 10);
    return await this.userService.createUser(registerAuthDto);
  }
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findUserByEmail(loginAuthDto.email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordMath = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );
    console.log(isPasswordMath);
    if (!isPasswordMath) {
      throw new HttpException('Wrong password', 400);
    }

    const accessTocken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      accessTocken,
    };
  }
}
