import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SignUpDto } from './dto/request/SignUpDto';
import { Prisma, User } from '@prisma/client';
import { UserListPagenationDto } from './dto/request/UserListPaginationDto';
import { UpdateProfileDto } from './dto/response/UpdateProfileDto';
import { UserDto } from './dto/response/UserDto';
import { UpdatePwDto } from './dto/request/UpdatePwDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public signUp: (signUpDto: SignUpDto) => Promise<string>;

  public getUserByIdx: (userIdx: number) => Promise<UserDto>;

  public getUserAll: (
    pagenation: UserListPagenationDto,
  ) => Promise<{ user: UserDto[]; count: number }>;

  public updateProfile: (
    idx: number,
    updateDto: UpdateProfileDto,
  ) => Promise<void>;

  public updatePw: (idx: number, updateDto: UpdatePwDto) => Promise<void>;
}
