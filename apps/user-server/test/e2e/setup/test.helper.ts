import { ValidationPipe } from '@nestjs/common';
import { LoginSetting, TestLoginUsers } from './login-user.setup';
import { ITestHelper } from 'libs/testing';
import * as cookieParser from 'cookie-parser';
import { Type } from 'libs/common';

/**
 * User-Server E2E 테스트 헬퍼
 *
 * @author jochongs
 */
export class TestHelper extends ITestHelper {
  private loginUsers: TestLoginUsers;

  public static create(RootModule: Type) {
    return new TestHelper(RootModule);
  }

  async appSetup(): Promise<void> {
    this.loginUsers = await LoginSetting.init(this.app);
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }

  public getLoginUsers() {
    return this.loginUsers;
  }
}
