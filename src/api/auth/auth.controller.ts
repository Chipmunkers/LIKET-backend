import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/LoginDto';
import { LoginTokenDto } from './dto/response/LoginTokenDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // sample
  public async login(loginDto: LoginDto): Promise<LoginTokenDto> {
    const token = await this.authService.login(loginDto);

    const loginResponseDto = LoginTokenDto.setToken(token);

    return loginResponseDto;
  }
}
