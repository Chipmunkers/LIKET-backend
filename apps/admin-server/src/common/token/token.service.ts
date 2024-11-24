import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenException } from './exception/InvalidTokenException';
import { LoginPayloadDto } from './dto/loign-payload.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signLoginAccessToken(payload: LoginPayloadDto): string {
    return this.jwtService.sign(payload, {
      expiresIn: '14d',
    });
  }

  verifyLoginAccessToken(token: string): LoginPayloadDto {
    try {
      return this.jwtService.verify<LoginPayloadDto>(token);
    } catch (err) {
      throw new InvalidTokenException('Invalid login access token');
    }
  }
}
