import { Injectable } from '@nestjs/common';
import { HashService } from '../../common/hash/hash.service';
import { TokenService } from '../../common/token/token.service';
import { LoginDto } from './dto/request/login.dto';
import { AdminPermissionRequiredException } from './exception/AdminPermissionRequiredException';
import { InvalidEmailOrPwException } from './exception/InvalidEmailOrPwException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaProvider,
    private readonly hashService: HashService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const adminUser = await this.prisma.user.findFirst({
      select: {
        idx: true,
        pw: true,
        isAdmin: true,
      },
      where: {
        email: loginDto.email,
      },
    });

    if (!adminUser) {
      throw new InvalidEmailOrPwException('Invalid email or password');
    }

    if (!(await this.hashService.comparePw(loginDto.pw, adminUser.pw || ''))) {
      throw new InvalidEmailOrPwException('Invalid email or password');
    }

    if (!adminUser.isAdmin) {
      throw new AdminPermissionRequiredException('Admin permission required');
    }

    return this.tokenService.signLoginAccessToken({
      idx: adminUser.idx,
    });
  }
}
