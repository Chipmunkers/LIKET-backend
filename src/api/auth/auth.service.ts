import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SendEmailVerificationCodeDto } from './dto/request/SendEmailVerificationCodeDto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
}
