import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTosDto } from './dto/request/CreateTosDto';
import { UpdateTosDto } from './dto/request/UpdateTosDto';
import { TosEntity } from './entity/TosEntity';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 약관 모두 보기
   */
  public getTosAll: () => Promise<TosEntity<'summary', 'user'>>;

  /**
   * 약관 자세히보기
   */
  public getTosByIdx: () => Promise<TosEntity<'detail', 'user'>>;

  // Admin

  /**
   * 관리자용 약관 모두보기
   */
  public getTosAllForAdmin: () => Promise<TosEntity<'summary', 'admin'>[]>;

  /**
   * 관리자용 약관 자세히보기
   */
  public getTosByIdxForAdmin: (
    idx: number,
  ) => Promise<TosEntity<'detail', 'admin'>>;

  /**
   * 약관 생성하기
   */
  public createTos: (createDto: CreateTosDto) => Promise<void>;

  /**
   * 약관 수정하기
   */
  public updateTos: (idx: number, updateDto: UpdateTosDto) => Promise<void>;

  /**
   * 약관 삭제하기
   */
  public deleteTos: (idx: number) => Promise<void>;
}
