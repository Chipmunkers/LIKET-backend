import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SendEmailVerificationCodeDto } from './dto/SendEmailVerificationCodeDto';
import { CheckEmailVerificationCodeDto } from './dto/CheckEmailVerificationCodeDto';
import { HashService } from '../../common/service/hash.service';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  public login: (loginDto: LoginDto) => Promise<string>;

  public sendEmailVerificationCode: (
    sendDto: SendEmailVerificationCodeDto,
  ) => Promise<void>;

  public checkEmailVerificatioCode: (
    checkDto: CheckEmailVerificationCodeDto,
  ) => Promise<boolean>;

  public verifyEmailAuthToken: (emailToken: string) => boolean;

  public signEmailAuthToken: (email: string) => string;
}
