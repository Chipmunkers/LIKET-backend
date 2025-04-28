import { AppModule } from 'apps/admin-server/src/app.module';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';
import { HashService } from 'libs/modules/hash/hash.service';
import { UserSeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Auth (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const userSeedHelper = test.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /auth', () => {
    it('Success with admin user', async () => {
      const pw = 'test-password';
      const email = 'admin_account@gmail.com';

      const hashService = new HashService();

      const adminUser = await userSeedHelper.seed({
        email: email,
        pw: await hashService.hashPw(pw),
        isAdmin: true,
      });

      const response = await request(test.getServer())
        .post('/auth')
        .send({
          email: adminUser.email,
          pw: pw,
        })
        .expect(200);

      const responseBody = response.body;

      expect(responseBody.token).not.toBeUndefined();
    });

    it('Fail - no admin auth', async () => {
      const pw = 'test-password';
      const email = 'admin_account@gmail.com';

      const hashService = new HashService();

      const adminUser = await userSeedHelper.seed({
        email: email,
        pw: await hashService.hashPw(pw),
        isAdmin: false, // ! no admin auth
      });

      await request(test.getServer())
        .post('/auth')
        .send({
          email: adminUser.email,
          pw: pw,
        })
        .expect(403);
    });

    it('Fail - wrong password', async () => {
      const pw = 'test-password';
      const email = 'admin_account@gmail.com';

      const hashService = new HashService();

      const adminUser = await userSeedHelper.seed({
        email,
        pw: await hashService.hashPw(pw),
        isAdmin: true,
      });

      await request(test.getServer())
        .post('/auth')
        .send({
          email: adminUser.email,
          pw: 'wrong-password',
        })
        .expect(401);
    });

    it('Fail - wrong email', async () => {
      const pw = 'test-password';
      const email = 'admin_account@gmail.com';

      const hashService = new HashService();

      const adminUser = await userSeedHelper.seed({
        email,
        pw: await hashService.hashPw(pw),
        isAdmin: true,
      });

      await request(test.getServer())
        .post('/auth')
        .send({
          email: 'wrong-email',
          pw: 'wrong-password',
        })
        .expect(401);
    });
  });
});
