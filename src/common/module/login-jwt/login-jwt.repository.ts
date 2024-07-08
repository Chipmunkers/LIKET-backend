import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoginJwtRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async find(refreshToken: string) {
    return this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiredAt: null,
      },
    });
  }

  public async delete(refreshToken: string): Promise<void> {
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
      // Ignore
    }
  }

  public async save(userIdx: number, refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userIdx,
        token: refreshToken,
      },
    });
  }
}
