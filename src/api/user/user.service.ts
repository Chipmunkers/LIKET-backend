import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SignUpDto } from './dto/SignUpDto';
import { UserListPagenationDto } from './dto/UserListPaginationDto';
import { UpdatePwDto } from './dto/UpdatePwDto';
import { UserEntity } from './entity/UserEntity';
import { MyInfoEntity } from './entity/MyInfoEntity';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public signUp: (signUpDto: SignUpDto) => Promise<string>;

  public getMyInfo: (userIdx: number) => Promise<MyInfoEntity>;

  public getUserByIdx: (userIdx: number) => Promise<UserEntity<'my', 'admin'>>;

  public getUserAll: (
    pagenation: UserListPagenationDto,
  ) => Promise<{ user: UserEntity<'my', 'admin'>[]; count: number }>;

  public updateProfile: (
    idx: number,
    updateDto: UpdateProfileDto,
  ) => Promise<void>;

  public updatePw: (idx: number, updateDto: UpdatePwDto) => Promise<void>;
}
