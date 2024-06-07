import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/local-login.dto';
import { LoginResponseDto } from './dto/response/local-login-response.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verif-code.dto';
import { CheckEmailVerificationCodeDto } from './dto/check-email-verif-code.dto';
import { CheckEmailVerificationCodeResponseDto } from './dto/response/check-email-verif-code-repsonse.dto';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Logger('AuthController') private readonly logger: LoggerService,
  ) {}

  /**
   * 로그인하기
   */
  @Post('/local')
  @ApiTags('Auth')
  @HttpCode(200)
  @Exception(400, 'Invalid body format')
  @Exception(401, 'Wrong email or password')
  @Exception(403, 'Suspended user')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);

    return { token };
  }

  /**
   * 이메일 인증번호 발송하기
   */
  @Post('/email/code/send')
  @ApiTags('Auth')
  @HttpCode(201)
  @Exception(400, 'Invalid body format')
  public async sendEmailVerficationCode(
    @Body() sendDto: SendEmailVerificationCodeDto,
  ): Promise<void> {
    await this.authService.sendEmailVerificationCode(sendDto);

    return;
  }

  /**
   * 이메일 인증번호 확인하기
   */
  @Post('/email/code/check')
  @ApiTags('Auth')
  @HttpCode(200)
  @Exception(400, 'Invalid body format')
  @Exception(404, 'Wrong verification code')
  public async checkEmailVerficationCode(
    @Body() checkDto: CheckEmailVerificationCodeDto,
  ): Promise<CheckEmailVerificationCodeResponseDto> {
    const token = await this.authService.checkEmailVerificatioCode(checkDto);

    return {
      token,
    };
  }
}
