import { Module } from '@nestjs/common';
import { EmailCertService } from './email-cert.service';
import { EmailCertController } from './email-cert.controller';
import { EmailerModule } from '../../common/module/emailer/emailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailJwtConfig from './config/email-jwt.config';
import { EmailJwtService } from './email-jwt.service';
import { EmailCertRepository } from './email-cert.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [
    PrismaModule,
    EmailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(emailJwtConfig)],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('emailJwt'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailCertService, EmailJwtService, EmailCertRepository],
  controllers: [EmailCertController],
  exports: [EmailJwtService],
})
export class EmailCertModule {}
