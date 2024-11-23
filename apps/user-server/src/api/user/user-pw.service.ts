import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { HashService } from '../../common/module/hash/hash.service';
import { FindPwDto } from './dto/find-pw.dto';
import { EmailJwtService } from '../email-cert/email-jwt.service';
import { EmailCertType } from '../email-cert/model/email-cert-type';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { UserRepository } from './user.repository';
import { LoginUser } from '../auth/model/login-user';
import { ResetPwDto } from './dto/reset-pw.dto';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { InvalidCurrentPasswordException } from './exception/InvalidCurrentPasswordException';

@Injectable()
export class UserPwService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly emailJwtService: EmailJwtService,
    private readonly userRepository: UserRepository,
    @Logger(UserPwService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 비밀번호 찾기
   */
  public async findPw(findPwDto: FindPwDto) {
    const email = await this.emailJwtService.verify(
      findPwDto.emailToken,
      EmailCertType.FIND_PW,
    );

    const user = await this.userService.getUserByEmail(email);

    await this.updatePw(user.idx, findPwDto.pw);

    return;
  }

  /**
   * 사용자 비밀번호 변경하기
   */
  public async resetLoginUserPw(
    loginUser: LoginUser,
    resetDto: ResetPwDto,
  ): Promise<void> {
    const user = await this.userRepository.selectUserByIdx(loginUser.idx);

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    if (!this.hashService.comparePw(resetDto.currPw, user.pw || '')) {
      throw new InvalidCurrentPasswordException('Wrong password');
    }

    await this.updatePw(loginUser.idx, resetDto.resetPw);
  }

  /**
   * 비밀번호 변경하기
   */
  public async updatePw(idx: number, pw: string): Promise<void> {
    await this.userService.getUserByIdx(idx);

    await this.userRepository.updateUserPwByIdx(
      idx,
      this.hashService.hashPw(pw),
    );

    return;
  }
}
