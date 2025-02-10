import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from 'libs/core/user/exception/AlreadyExistEmailException';
import { InvalidPwError } from 'libs/core/user/exception/InvalidPwError';
import { CreateUserInput } from 'libs/core/user/input/create-user.input';
import { UserModel } from 'libs/core/user/model/user.model';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { HashService } from 'libs/modules/hash/hash.service';

@Injectable()
export class UserCoreService {
  constructor(
    private readonly userCoreRepository: UserCoreRepository,
    private readonly hashService: HashService,
  ) {}

  /**
   * 사용자를 생성하는 메서드
   *
   * @author jochongs
   *
   * @returns 생성한 사용자
   *
   * @throws {AlreadyExistEmailException} 409 - 이미 해당 이메일로 가입된 계정이 존재하는 경우
   * @throws {InvalidPwError} Error - provider가 local인데 비밀번호가 존재하지 않는 경우
   */
  @Transactional()
  public async createUser(
    createUserInput: CreateUserInput,
  ): Promise<UserModel> {
    const sameEmailUser = await this.userCoreRepository.selectUserByEmail(
      createUserInput.email,
    );

    if (sameEmailUser) {
      throw new AlreadyExistEmailException(
        `The email(${createUserInput.email} is already signed up`,
      );
    }

    if (createUserInput.provider === 'local' && !createUserInput.pw) {
      throw new InvalidPwError(
        `A User(${createUserInput.email}) attempt to signup without password`,
      );
    }

    const encryptedPw = createUserInput.pw
      ? await this.hashService.hashPw(createUserInput.pw)
      : null;

    const createdUser = await this.userCoreRepository.insertUser({
      ...createUserInput,
      encryptedPw,
    });

    return UserModel.fromPrisma(createdUser);
  }
}
