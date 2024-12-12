import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

/**
 * @author jochongs
 *
 * @deprecated
 */
export class AppGlobalSetting {
  static setup(app: INestApplication) {
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
