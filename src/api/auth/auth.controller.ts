import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/local-login.dto';
import { LoginResponseDto } from './dto/response/local-login-response.dto';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { Request, Response } from 'express';
import { SocialProvider } from './strategy/social-provider.enum';
import { SocialProviderPipe } from './pipe/social-provider.pipe';
import cookieConfig from './config/cookie.config';
import { Cookies } from '../../common/decorator/cookies.decorator';
import { InvalidRefreshTokenException } from '../../common/module/login-jwt/exception/InvalidRefreshTokenException';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Logger('AuthController') private readonly logger: LoggerService,
  ) {}

  /**
   * 로그인하기
   */
  @Post('/local')
  @HttpCode(200)
  @Exception(400, 'Invalid body format')
  @Exception(401, 'Wrong email or password')
  @Exception(418, 'Suspended user')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginToken = await this.authService.login(loginDto);
    res.cookie('refreshToken', loginToken.refreshToken, cookieConfig());

    return { token: loginToken.accessToken };
  }

  /**
   * 소셜 로그인 시도
   */
  @Get('/:provider')
  @HttpCode(200)
  public async socialLogin(
    @Param('provider', SocialProviderPipe) provider: SocialProvider,
    @Res() res: Response,
  ) {
    const url = this.authService.getSocialLoginUrl(provider);
    res.redirect(url);
  }

  /**
   * 소셜 로그인 콜백 API
   */
  @Get('/:provider/callback')
  @HttpCode(200)
  public async socialLoginCallback(
    @Param('provider', SocialProviderPipe) provider: SocialProvider,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.socialLogin(req, res, provider);
  }

  /**
   * Access Token 재발급하기, 소셜 로그인 시 발급되는 refresh token은 body로 전송
   */
  @Post('/access-token')
  @HttpCode(200)
  @Exception(401, 'Invalid refresh token', InvalidRefreshTokenException)
  public async reissueAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken') refreshToken?: string,
    @Body('refreshToken') bodyRefreshToken?: string,
  ): Promise<string> {
    if (bodyRefreshToken) {
      res.cookie('refreshToken', bodyRefreshToken, cookieConfig());
    }

    return await this.authService.reissueAccessToken(
      res,
      refreshToken || bodyRefreshToken || '',
    );
  }

  /**
   * 로그아웃하기
   */
  @Delete('/')
  @HttpCode(201)
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken') refreshToken?: string,
  ) {
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
  }
}
