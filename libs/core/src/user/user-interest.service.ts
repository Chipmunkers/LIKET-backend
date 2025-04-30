import { Injectable } from '@nestjs/common';
import { UpdateUserInterestInput } from 'libs/core/user/input/update-user-interest.input';
import { UserInterestCoreRepository } from 'libs/core/user/user-interest.repository';

@Injectable()
export class UserInterestCoreService {
  constructor(
    private readonly userInterestCoreRepository: UserInterestCoreRepository,
  ) {}

  /**
   * idx
   *
   * @author jochongs
   */
  public async updateUserInterestByIdx(
    idx: number,
    input: UpdateUserInterestInput,
  ): Promise<void> {}
}
