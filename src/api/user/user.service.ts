import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SignUpDto } from './dto/request/SignUpDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public signUp: (signUpDto: SignUpDto) => Promise<string>;
}
