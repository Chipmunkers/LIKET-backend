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
import { UserProvider } from 'libs/core/user/constant/user-provider.constant';
import { CreateWithdrawalReasonInput } from 'libs/core/withdrawal-reason/input/create-withdrawal.input';
import { WithdrawalReasonModel } from 'libs/core/withdrawal-reason/model/withdrawal-reason.model';
import { WithdrawalReasonCoreService } from 'libs/core/withdrawal-reason/withdrawal-reason.service';

@Injectable()
export class UserCoreService {
  constructor(
    private readonly userCoreRepository: UserCoreRepository,
    private readonly hashService: HashService,
    private readonly withdrawalCoreService: WithdrawalReasonCoreService,
  ) {}

  /**
   * idx를 통해 user를 찾는 메서드
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  @Transactional()
  public async findUserByIdx(idx: number): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserByIdx(idx);

    return user ? UserModel.fromPrisma(user) : null;
  }

  /**
   * id와 provider를 통해 user를 찾는 메서드
   *
   * @author jochongs
   *
   * @param snsId 소셜사 제공 식별자
   * @param provider 소셜사
   */
  @Transactional()
  public async findUserBySnsId(
    snsId: string,
    provider: UserProvider,
  ): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserById(snsId, provider);

    return user ? UserModel.fromPrisma(user) : null;
  }

  /**
   * email을 통해 user를 찾는 메서드
   *
   * @author jochongs
   *
   * @param email 사용자 이메일
   */
  @Transactional()
  public async findUserByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserByEmail(email);

    return user ? UserModel.fromPrisma(user) : null;
  }

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

  /**
   * 회원탈퇴 메서드
   *
   * @author jochongs
   *
   * @param idx 삭제할 사용자 식별자
   */
  @Transactional()
  public async withdrawalUserByIdx(
    idx: number,
    reasonInput: CreateWithdrawalReasonInput,
  ): Promise<WithdrawalReasonModel> {
    await this.userCoreRepository.softDeleteUserByIdx(idx);
    return await this.withdrawalCoreService.createWithdrawalReason(
      idx,
      reasonInput,
    );
  }

  /**
   * 사용자가 작성한 리뷰 개수 가져오기
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  @Transactional()
  public async getReviewCountByUserIdx(idx: number): Promise<number> {
    return await this.userCoreRepository.selectReviewCountByUserIdx(idx);
  }

  /**
   * 사용자가 누른 좋아요 개수 가져오기
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  @Transactional()
  public async getContentLikeCountByUserIdx(idx: number): Promise<number> {
    return await this.userCoreRepository.selectCultureContentLikeCountByUserIdx(
      idx,
    );
  }

  /**
   * 최근 로그인 기록 수정하기
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  @Transactional()
  public async updateUserLastLoginByIdx(idx: number): Promise<void> {
    return await this.userCoreRepository.updateUserLastLoginByIdx(
      idx,
      new Date(),
    );
  }
}
