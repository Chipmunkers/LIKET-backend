import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoginJwtRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(LoginJwtRepository.name) private readonly logger: LoggerService,
  ) {}

  public async find(refreshToken: string) {
    this.logger.log(this.find, 'SELECT refresh token');
    return this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiredAt: null,
      },
    });
  }

  public async delete(refreshToken: string): Promise<void> {
    this.logger.log(this.delete, 'UPDATE refresh token to be expired');
    try {
      await this.prisma.refreshToken.update({
        where: {
          token: refreshToken,
          expiredAt: null,
        },
        data: {
          expiredAt: new Date(),
        },
      });
    } catch (err) {
      this.logger.error(this.delete, 'Error occurred', err);
    }
  }

  public async save(userIdx: number, refreshToken: string): Promise<void> {
    this.logger.log(this.save, `INSERT refresh token | user = ${userIdx}`);
    await this.prisma.refreshToken.create({
      data: {
        userIdx,
        token: refreshToken,
      },
    });
  }
}
