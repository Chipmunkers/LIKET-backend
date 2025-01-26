import { Injectable } from '@nestjs/common';
import { LoginUser } from 'apps/user-server/src/api/auth/model/login-user';
import { UpdateUserInterestDto } from 'apps/user-server/src/api/user-interest/dto/update-interest.dto';
import { InterestTagEntity } from 'apps/user-server/src/api/user-interest/entity/interest-tag.entity';
import { UserInterestRepository } from 'apps/user-server/src/api/user-interest/user-interest.repository';

@Injectable()
export class UserInterestService {
  constructor(
    private readonly userInterestRepository: UserInterestRepository,
  ) {}

  /**
   * 사용자의 관심 태그를 조회하는 메서드
   *
   * @author jochongs
   */
  public async getUserInterestByIdx(userIdx: number) {
    return InterestTagEntity.createEntity(
      await this.userInterestRepository.selectUserInterestByIdx(userIdx),
    );
  }

  /**
   * 사용자 관심 태그 추가/수정 메서드
   *
   * @author jochongs
   */
  public async updateUserInterest(
    updateInterestDto: UpdateUserInterestDto,
    loginUser: LoginUser,
  ): Promise<void> {
    return await this.userInterestRepository.updateUserInterest(
      updateInterestDto,
      loginUser,
    );
  }
}
