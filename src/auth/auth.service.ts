import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import Codes from 'src/entities/codes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service'; // ← requires MailModule

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Codes)
    private readonly codeRepo: Repository<Codes>,
    private readonly mailService: MailService, // remove if you’re not using email yet
  ) {}

  async register(dto: RegisterAuthDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userService.findUserByEmail(email);
    if (user) throw new HttpException('User already exists', 400);

    dto.email = email;
    dto.password = await bcrypt.hash(dto.password, 10);
    const created = await this.userService.createUser(dto);

    try {
      await this.mailService.sendWelcome(email, (created as any)?.first_name);
    } catch (e) {
      console.error('[MAIL][WELCOME] ERROR', e?.response || e?.message || e);
      // optionally ignore or rethrow based on your policy
    }

    return created;
  }

  async login(dto: LoginAuthDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new HttpException('User not found', 404);

    // If client sent an OTP, verify it
    if (dto.code !== undefined && dto.code !== null) {
      const codeValue = Number(dto.code);
      if (Number.isNaN(codeValue)) throw new HttpException('Invalid code', 400);

      const rec = await this.codeRepo.findOne({
        where: { email, code: codeValue, is_used: false },
      });
      if (!rec) throw new HttpException('Code is not valid', 400);

      // mark used
      rec.is_used = true;
      await this.codeRepo.save(rec);

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });
      return { message: 'Login successful', accessToken };
    }

    // Otherwise, generate & send a fresh OTP
    const otp = await this.generateOtpCode();

    await this.codeRepo.save({
      email,
      code: otp,
      is_used: false,
    });

    // Send via email (comment out if not ready)
    await this.mailService.sendOtp(email, otp, 'login');
    console.log(`OTP for ${email}: ${otp}`); // for demo only

    // For production, DO NOT return the code in the response
    return { message: 'Verification code sent' };
  }

  // Generate a 5-digit code that does not currently exist
  private async generateOtpCode(): Promise<number> {
    while (true) {
      const otp = this.getRandomCode();
      const exists = await this.codeRepo.findOne({ where: { code: otp } });
      if (!exists) return otp;
    }
  }

  private getRandomCode(): number {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
