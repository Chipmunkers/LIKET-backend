import { INestApplication } from '@nestjs/common';
import { AuthService } from 'apps/admin-server/src/api/auth/auth.service';
import { TokenService } from 'apps/admin-server/src/common/token/token.service';

/**
 * @author jochongs
 */
export class TestLoginUser {
  readonly idx: number;
  readonly isAdmin: boolean;
  readonly accessToken: string;

  constructor(data: TestLoginUser) {
    Object.assign(this, data);
  }
}

/**
 * @author jochongs
 */
export class TestLoginHelper {
  private readonly adminUser: TestLoginUser;

  private constructor(adminUser: TestLoginUser) {
    this.adminUser = adminUser;
  }

  public getAdminUser1() {
    return this.adminUser;
  }

  /**
   * TestHelper 클래스 내부에서만 호출하십시오.
   */
  static async init(app: INestApplication) {
    const adminUser = await TestLoginHelper.login(
      app,
      'admin',
      'aa12341234**',
      true,
    );

    return new TestLoginHelper(adminUser);
  }

  private static async login(
    app: INestApplication,
    email: string,
    pw: string,
    isAdmin: boolean,
  ): Promise<TestLoginUser> {
    const authService = app.get(AuthService);
    const tokenService = app.get(TokenService);

    const accessToken = await authService.login({ email, pw });
    const tokenPayload = tokenService.verifyLoginAccessToken(accessToken);
    return new TestLoginUser({
      idx: tokenPayload.idx,
      isAdmin,
      accessToken,
    });
  }
}
