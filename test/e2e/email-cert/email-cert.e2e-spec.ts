import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/api/auth/auth.service';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { EmailerService } from '../../../src/common/module/emailer/emailer.service';
import * as request from 'supertest';
import { EmailCertType } from '../../../src/api/email-cert/model/email-cert-type';
import { MailerService } from '@nestjs-modules/mailer';

describe('Email Cert (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;

  let mailerService: MailerService;

  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
    prisma.$transaction = async (callback) => {
      if (Array.isArray(callback)) {
        return await Promise.all(callback);
      }

      return callback(prisma);
    };
    await prisma.$queryRaw`BEGIN`;

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = appModule.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    app.use(cookieParser(process.env.COOKIE_SECRET));

    await app.init();

    mailerService = appModule.get(MailerService);
  });

  afterEach(async () => {
    await prisma.$queryRaw`ROLLBACK`;
    await prisma.$disconnect();
    await appModule.close();
    await app.close();
  });

  describe('POST /email-cert/send', () => {
    it('Success', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: 'abc123@naver.com',
        type: EmailCertType.SIGN_UP,
      };

      await request(app.getHttpServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(201);
    });

    it('Invalid email', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: '123', // Invalid email
        type: EmailCertType.SIGN_UP,
      };

      await request(app.getHttpServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(400);
    });

    it('Invalid type', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const sendDto = {
        email: 'abc123@naver.com',
        type: 999, // Invalid type
      };

      await request(app.getHttpServer())
        .post('/email-cert/send')
        .send(sendDto)
        .expect(400);
    });

    it('Error external library', async () => {
      jest.spyOn(mailerService, 'sendMail').mockImplementation(async () => {
        throw new Error('Unexpected error occurred');
      });

      const sendDto = {
        email: 'abc123@naver.com',
        type: EmailCertType.SIGN_UP,
      };

      await request(app.getHttpServer())
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

      jest
        .spyOn(prisma.emailCertCode, 'findFirst')
        .mockResolvedValue({ code: correctCode } as any);

      await request(app.getHttpServer())
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
      jest
        .spyOn(prisma.emailCertCode, 'findFirst')
        .mockResolvedValue({ code: correctCode } as any);

      await request(app.getHttpServer())
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

      await request(app.getHttpServer())
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

      await request(app.getHttpServer())
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

      await request(app.getHttpServer())
        .post('/email-cert/check')
        .send(checkDto)
        .expect(400);
    });

    it('Send sign up but check wrong type', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

      const correctCode = '123123';
      const email = 'abc123@naver.com';
      const sendDto = {
        email: email,
        type: EmailCertType.SIGN_UP,
      };

      prisma.emailCertCode.create = jest.fn().mockImplementation(async () => {
        await prisma.emailCertCode.create({
          data: {
            type: sendDto.type,
            email: email,
            code: correctCode,
          },
        });

        // 이메일 번호 발송
        await request(app.getHttpServer())
          .post('/email-cert/send')
          .send(sendDto)
          .expect(201);

        const checkDto = {
          email,
          type: EmailCertType.FIND_PW,
          code: correctCode,
        };

        await request(app.getHttpServer())
          .post('/email-cert/check')
          .send(checkDto)
          .expect(404);
      });
    });
  });
});
