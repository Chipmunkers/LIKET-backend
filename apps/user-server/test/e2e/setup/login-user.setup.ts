import { INestApplication } from '@nestjs/common';
import { AuthService } from 'apps/user-server/src/api/auth/auth.service';
import { LoginJwtService } from 'apps/user-server/src/common/module/login-jwt/login-jwt.service';

export class TestLoginUser {
  private readonly _accessToken: string;
  private readonly _refreshToken: string;
  private readonly _idx: number;

  constructor(accessToken: string, refreshToken: string, idx: number) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this._idx = idx;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  get idx(): number {
    return this._idx;
  }
}

export class TestLoginUsers {
  private readonly userList: TestLoginUser[] = [];

  private readonly _user1: TestLoginUser;
  private readonly _user2: TestLoginUser;

  constructor(user1: TestLoginUser, user2: TestLoginUser) {
    this._user1 = user1;
    this._user2 = user2;
    this.userList.push(user1);
    this.userList.push(user2);
  }

  get user1(): TestLoginUser {
    return this._user1;
  }

  get user2(): TestLoginUser {
    return this._user2;
  }

  /**
   * 첫 번째 파라미터의 유저 idx값이 아닌 사용자를 가져오는 메서드
   *
   * @author jochongs
   *
   * @param idx 사용자인덱스
   */
  public not(idx: number): TestLoginUser {
    for (const user of this.userList) {
      if (user.idx !== idx) return user;
    }

    throw new Error('Login users did not setup');
  }
}

export class LoginSetting {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * testLoginUsers를 내부에서 검사할 이유가 없을 것 같다고 판단하여 deprecated되었습니다.
   * 대신, init 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static async setup(
    testLoginUsers: TestLoginUsers,
    app: INestApplication,
  ): Promise<TestLoginUsers> {
    if (testLoginUsers) {
      return testLoginUsers;
    }

    return await this.createTestLoginUsers(app);
  }

  static async init(app: INestApplication) {
    return await this.createTestLoginUsers(app);
  }

  private static async createTestLoginUsers(
    app: INestApplication,
  ): Promise<TestLoginUsers> {
    const authService = app.get(AuthService);
    const jwtService = app.get(LoginJwtService);

    const user1TokenSet = await authService.login({
      email: 'user1@gmail.com',
      pw: 'aa12341234**',
    });

    const user1TokenPayload = await jwtService.verify(
      user1TokenSet.accessToken,
    );

    const user2TokenSet = await authService.login({
      email: 'user2@gmail.com',
      pw: 'aa12341234**',
    });

    const user2TokenPayload = await jwtService.verify(
      user2TokenSet.accessToken,
    );

    const user1 = this.createLoginUser({
      ...user1TokenSet,
      idx: user1TokenPayload.idx,
    });
    const user2 = this.createLoginUser({
      ...user2TokenSet,
      idx: user2TokenPayload.idx,
    });

    return new TestLoginUsers(user1, user2);
  }

  private static createLoginUser({
    accessToken,
    refreshToken,
    idx,
  }: {
    accessToken: string;
    refreshToken: string;
    idx: number;
  }): TestLoginUser {
    return new TestLoginUser(accessToken, refreshToken, idx);
  }
}
