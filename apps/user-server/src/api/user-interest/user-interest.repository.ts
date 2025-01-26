import { Injectable } from '@nestjs/common';
import { LoginUser } from 'apps/user-server/src/api/auth/model/login-user';
import { UpdateUserInterestDto } from 'apps/user-server/src/api/user-interest/dto/update-interest.dto';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserInterestRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public async selectUserInterestByIdx(idx: number) {
    return await this.prisma.user.findUniqueOrThrow({
      select: {
        InterestGenre: true,
        InterestAge: true,
        InterestLocation: true,
        InterestStyle: true,
      },
      where: { idx },
    });
  }

  /**
   * @author jochongs
   */
  public async updateUserInterest(
    updateInterestDto: UpdateUserInterestDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const userIdx = loginUser.idx;

    await this.prisma.$transaction([
      this.prisma.interestGenre.deleteMany({ where: { userIdx } }),
      this.prisma.interestStyle.deleteMany({ where: { userIdx } }),
      this.prisma.interestAge.deleteMany({ where: { userIdx } }),
      this.prisma.interestLocation.deleteMany({ where: { userIdx } }),
      this.prisma.interestGenre.createMany({
        data: updateInterestDto.genreList.map((genreIdx) => ({
          userIdx,
          genreIdx,
        })),
      }),
      this.prisma.interestStyle.createMany({
        data: updateInterestDto.styleList.map((styleIdx) => ({
          userIdx,
          styleIdx,
        })),
      }),
      this.prisma.interestAge.createMany({
        data: updateInterestDto.ageList.map((ageIdx) => ({
          userIdx,
          ageIdx,
        })),
      }),
      this.prisma.interestLocation.createMany({
        data: updateInterestDto.locationList.map((bCode) => ({
          userIdx,
          bCode,
        })),
      }),
    ]);
  }
}
