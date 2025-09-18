import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import Codes from 'src/entities/codes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Codes)
    private code_repository: Repository<Codes>,
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
    // const isPasswordMath = await bcrypt.compare(
    //   loginAuthDto.password,
    //   user.password,
    // );
    // console.log(isPasswordMath);
    // if (!isPasswordMath) {
    //   throw new HttpException('Wrong password', 400);
    // }
    if (loginAuthDto.code) {
      // check if code is exist in database and is valid
      const checkCode = await this.code_repository.findOne({
        where: {
          code: loginAuthDto.code,
          email: loginAuthDto.email,
          is_used: false,
        },
      });
      if (checkCode) {
        await this.code_repository.update(checkCode, { is_used: true });
        const accessToken = this.jwtService.sign({
          sub: user.id,
          email: user.email,
        });
        return {
          message: 'Login successful',
          accessToken,
        };
      } else {
        throw new HttpException('Code is not valid', 400);
      }
    } else {
      //generate 5 digit code that is not exist in database
      const otp = await this.generateOtpCode();
      // Save otp code in database
      this.code_repository.save({
        code: otp,
        email: loginAuthDto.email,
      });
      // send otp code to user
      return { code: otp };
    }
  }

  async generateOtpCode() {
    //generate 5 digit code that is not exist in database
    let code: number | null = null;
    while (!code) {
      const fiveDigitCode = this.getRandomCode();
      const checkCode = await this.code_repository.findOne({
        where: {
          code: fiveDigitCode,
        },
      });
      if (!checkCode) {
        code = fiveDigitCode;
        break;
      }
    }
    return code;
  }

  getRandomCode() {
    const min = 10000;
    const max = 99999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
  }
}
