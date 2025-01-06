import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { Type } from 'libs/common';
import { ITestHelper } from 'libs/testing';

/**
 * Admin-Server E2E 테스트 헬퍼
 *
 * @author jochongs
 */
export class TestHelper extends ITestHelper {
  public static create(RootModule: Type) {
    return new TestHelper(RootModule);
  }

  public async appSetup(): Promise<void> {
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }

  public getAdminUser() {}
}
