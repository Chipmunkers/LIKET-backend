import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // sample
  public async login(loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);

    return { token };
  }
}
