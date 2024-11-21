import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailCertService } from './email-cert.service';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailCertCodeDto } from './dto/request/send-email-cert-code.dto';
import { CheckEmailCertCodeDto } from './dto/request/check-email-cert-code.dto';
import { CheckEmailCertCodeResponseDto } from './dto/response/check-email-cert-code.dto';
import { Exception } from '../../common/decorator/exception.decorator';

@Controller('email-cert')
@ApiTags('Email Certification')
export class EmailCertController {
  constructor(private readonly emailCertService: EmailCertService) {}

  /**
   * 이메일 인증번호 발송하기
   */
  @Post('/send')
  @Exception(400, 'Invalid body')
  async sendEmailCertCode(
    @Body() sendDto: SendEmailCertCodeDto,
  ): Promise<void> {
    await this.emailCertService.sendCertCode(sendDto.email, sendDto.type);
  }

  /**
   * 이메일 인증번호 확인하기
   */
  @Post('/check')
  @Exception(400, 'Invalid body')
  @Exception(404, 'Wrong verification code')
  async checkEmailCertCode(
    @Body() checkDto: CheckEmailCertCodeDto,
  ): Promise<CheckEmailCertCodeResponseDto> {
    const token = await this.emailCertService.checkCertCode(
      checkDto.email,
      checkDto.code,
      checkDto.type,
    );

    return { token };
  }
}
