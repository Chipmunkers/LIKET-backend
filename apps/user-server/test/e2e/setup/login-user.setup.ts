import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../../src/api/auth/auth.service';

export class TestLoginUser {
  private readonly _accessToken: string;
  private readonly _refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }
}

export class TestLoginUsers {
  private readonly _user1: TestLoginUser;
  private readonly _user2: TestLoginUser;

  constructor(user1: TestLoginUser, user2: TestLoginUser) {
    this._user1 = user1;
    this._user2 = user2;
  }

  get user1(): TestLoginUser {
    return this._user1;
  }

  get user2(): TestLoginUser {
    return this._user2;
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

    const authorUser = this.createLoginUser(
      await authService.login({
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      }),
    );
    const otherUser = this.createLoginUser(
      await authService.login({
        email: 'user2@gmail.com',
        pw: 'aa12341234**',
      }),
    );

    return new TestLoginUsers(authorUser, otherUser);
  }

  private static createLoginUser({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): TestLoginUser {
    return new TestLoginUser(accessToken, refreshToken);
  }
}
