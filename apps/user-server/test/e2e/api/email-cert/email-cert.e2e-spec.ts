import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { EmailCertType } from '../../../../src/api/email-cert/model/email-cert-type';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { TestHelper } from '../../setup/test.helper';
import { PrismaProvider } from '../../../../../../libs/modules/src';

describe('Email Cert (e2e)', () => {
  const test = TestHelper.create();

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /email-cert/send', () => {
    it('Success', async () => {
      const mailerService = test.get(MailerService);

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: 'abc123@naver.com',
        type: EmailCertType.SIGN_UP,
      };

      await request(test.getServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(201);
    });

    it('Invalid email', async () => {
      const mailerService = test.get(MailerService);

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: '123', // Invalid email
        type: EmailCertType.SIGN_UP,
      };

      await request(test.getServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(400);
    });

    it('Invalid type', async () => {
      const mailerService = test.get(MailerService);

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: 'abc123@naver.com',
        type: 999, // Invalid type
      };

      await request(test.getServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(400);
    });

    it('Error external library', async () => {
      const mailerService = test.get(MailerService);

      jest.spyOn(mailerService, 'sendMail').mockImplementation(async () => {
        throw new Error('Unexpected error occurred');
      });

      const sendDto = {
        email: 'abc123@naver.com',
        type: EmailCertType.SIGN_UP,
      };

      await request(test.getServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(500);
    });
  });

  describe('POST /email-cert/check', () => {
    it('Success', async () => {
      const correctCode = '123123';
      const email = 'abc123@naver.com';
      const checkDto = {
        email,
        type: EmailCertType.SIGN_UP,
        code: correctCode,
      };

      test.get(PrismaProvider).emailCertCode.findFirst = jest
        .fn()
        .mockResolvedValue({ code: correctCode });

      await request(test.getServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(201);
    });

    it('Wrong code', async () => {
      const wrongCode = '999999'; // Wrong code
      const email = 'abc123@naver.com';
      const checkDto = {
        email,
        type: EmailCertType.SIGN_UP,
        code: wrongCode,
      };

      const correctCode = '123123';
      test.get(PrismaProvider).emailCertCode.findFirst = jest
        .fn()
        .mockResolvedValue({ code: correctCode });

      await request(test.getServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(404);
    });

    it('Expired code', async () => {
      const email = 'abc123@naver.com';
      const checkDto = {
        email,
        type: EmailCertType.SIGN_UP,
        code: '999999',
      };

      // Expired code

      await request(test.getServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(404);
    });

    it('Invalid email', async () => {
      const email = '1231231'; // Invalid email
      const checkDto = {
        email,
        type: EmailCertType.SIGN_UP,
        code: '999999',
      };

      await request(test.getServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(400);
    });

    it('Invalid type', async () => {
      const email = '1231231'; // Invalid email
      const checkDto = {
        email,
        type: 123,
        code: '999999',
      };

      await request(test.getServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(400);
    });

    it('Send sign up but check wrong type', async () => {
      const mailerService = test.get(MailerService);

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const correctCode = '123123';
      const email = 'abc123@naver.com';
      const sendDto = {
        email: email,
        type: EmailCertType.SIGN_UP,
      };

      test.get(PrismaProvider).emailCertCode.create = jest
        .fn()
        .mockImplementation(async () => {
          await test.get(PrismaProvider).emailCertCode.create({
            data: {
              type: sendDto.type,
              email: email,
              code: correctCode,
            },
          });

          // 이메일 번호 발송
          await request(test.getServer())
            .post('/email-cert/send')
            .send(sendDto)
            .expect(201);

          const checkDto = {
            email,
            type: EmailCertType.FIND_PW,
            code: correctCode,
          };

          await request(test.getServer())
            .post('/email-cert/check')
            .send(checkDto)
            .expect(404);
        });
    });
  });
});
