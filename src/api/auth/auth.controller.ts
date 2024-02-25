import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { LoginResponseDto } from './dto/response/LoginResponseDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login API.
   * @summary Login API.
   *
   * @tag Auth
   */
  @Post('/local')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid email or password format')
  @TypedException<ExceptionDto>(401, 'Wrong email or password')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);

    return { token };
  }
}
