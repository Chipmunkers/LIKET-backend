import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/local-login.dto';
import { LoginResponseDto } from './dto/response/local-login-response.dto';
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
}
