import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from 'libs/core/user/exception/AlreadyExistEmailException';
import { InvalidPwError } from 'libs/core/user/exception/InvalidPwError';
import { CreateUserInput } from 'libs/core/user/input/create-user.input';
import { UpdateUserInput } from 'libs/core/user/input/update-user.input';
import { UserModel } from 'libs/core/user/model/user.model';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { HashService } from 'libs/modules/hash/hash.service';
import { Prisma } from '@prisma/client';
import { UserNotFoundError } from 'libs/core/user/exception/UserNotFoundException';

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

  /**
   * 사용자 정보를 업데이트하는 메서드
   *
   * @author jochongs
   *
   * @param idx 업데이트할 사용자 식별자
   * @returns 업데이트 후, 사용자 정보
   *
   * @throws {UserNotFoundException} Error - idx에 해당하는 사용자를 찾을 수 없는 경우
   */
  @Transactional()
  public async updateUserByIdx(
    idx: number,
    updateInput: UpdateUserInput,
  ): Promise<UserModel> {
    try {
      const updatedUser = await this.userCoreRepository.updateUserByIdx(idx, {
        ...updateInput,
        encryptedPw: updateInput.pw
          ? await this.hashService.hashPw(updateInput.pw)
          : undefined,
      });

      return UserModel.fromPrisma(updatedUser);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new UserNotFoundError(idx, 'Cannot found user');
        }
      }

      throw err;
    }
  }
}
