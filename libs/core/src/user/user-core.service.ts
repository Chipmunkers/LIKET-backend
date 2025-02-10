import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'libs/core/user/inputs/create-user.input';
import { UserModel } from 'libs/core/user/model/user.model';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';

@Injectable()
export class UserCoreService {
  constructor(private readonly userCoreRepository: UserCoreRepository) {}

  /**
   * 사용자를 생성하는 메서드
   *
   * @author jochongs
   *
   * @returns 생성한 사용자
   */
  @Transactional()
  public createUser(createUserInput: CreateUserInput) {}
}
