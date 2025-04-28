import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인 하기
   */
  @Post('/')
  @HttpCode(200)
  @ApiTags('Auth')
  @ApiResponse({ status: 400, description: 'email, password validation fail' })
  @ApiResponse({ status: 401, description: 'Wrong email or password' })
  @ApiResponse({ status: 403, description: 'No admin permission' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);

    return { token };
  }
}
