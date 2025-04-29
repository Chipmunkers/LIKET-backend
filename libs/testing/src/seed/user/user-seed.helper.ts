import { faker } from '@faker-js/faker';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { UserInput } from 'libs/testing/seed/user/type/user.input';
import { UserOutput } from 'libs/testing/seed/user/type/user.output';

export class UserSeedHelper extends ISeedHelper<UserInput, UserOutput> {
  public async seed(input: UserInput): Promise<UserOutput> {
    const filledInput = this.getFilledInput(input);

    const result = await this.prisma.user.create({
      data: {
        email: filledInput.email,
        isAdmin: filledInput.isAdmin,
        pw: filledInput.pw,
        nickname: filledInput.nickname,
        reportCount: filledInput.reportCount,
        gender: filledInput.gender,
        birth: filledInput.birth,
        snsId: filledInput.snsId,
        provider: filledInput.provider,
        profileImgPath: filledInput.profileImgPath,
        loginAt: filledInput.loginAt,
        deletedAt: filledInput.deletedAt,
        blockedAt: filledInput.blockedAt,
      },
    });

    return {
      idx: result.idx,
      email: result.email,
      isAdmin: result.isAdmin,
      pw: result.pw,
      nickname: result.nickname,
      reportCount: result.reportCount,
      gender: result.gender,
      birth: result.birth,
      snsId: result.snsId,
      provider: result.provider,
      profileImgPath: result.profileImgPath,
      loginAt: result.loginAt,
      deletedAt: result.deletedAt,
      blockedAt: result.blockedAt,
    };
  }

  private getFilledInput(input: UserInput): DeepRequired<UserInput> {
    return {
      email: input.email,
      isAdmin: input.isAdmin ?? false,
      pw: input.pw ?? faker.string.alphanumeric({ length: 10 }),
      nickname: input.nickname ?? faker.word.words(1),
      reportCount: input.reportCount ?? 0,
      gender: input.gender ?? null,
      birth: input.birth ?? null,
      snsId: input.snsId ?? null,
      provider: input.provider ?? 'local',
      profileImgPath: input.profileImgPath ?? null,
      loginAt: input.loginAt ?? null,
      deletedAt: input.deletedAt ?? null,
      blockedAt: input.blockedAt ?? null,
    };
  }
}
