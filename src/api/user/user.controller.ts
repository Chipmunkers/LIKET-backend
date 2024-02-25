import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/SignUpDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { SignUpResponseDto } from './dto/response/SignUpResponseDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Sign Up API
   * @summary Sign Up API
   *
   * @tag User
   */
  @Post('/local')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'Invalid email auth token')
  @TypedException<ExceptionDto>(409, 'Duplicated email or nickname')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async localSignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignUpResponseDto> {
    const token = await this.userService.signUp(signUpDto);

    return { token };
  }
}
