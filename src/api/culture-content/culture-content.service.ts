import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateContentRequestDto } from './dto/CreateContentRequestDto';
import { ContentRequestListPagenationDto } from './dto/ContentRequestListPagenationDto';
import { UpdateContentDto } from './dto/UpdateContentDto';
import { ContentListPagenationDto } from './dto/ContentListPagenationDto';
import { ContentEntity } from './entity/ContentEntity';

@Injectable()
export class CultureContentService {
  constructor(private readonly prisma: PrismaService) {}

  // Content ==================================================

  /**
   * 컨텐츠 자세히보기
   */
  public getContentByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ContentEntity<'detail', 'user'>>;

  /**
   * 컨텐츠 요청 목록 보기
   */
  public getContentAll: (
    pagenation: ContentListPagenationDto,
    userIdx: number,
  ) => Promise<ContentEntity<'summary', 'user'>[]>;

  // Content Request ==========================================

  /**
   * 컨텐츠 요청 자세히보기
   */
  public getContentRequestByIdx: (
    idx: number,
  ) => Promise<ContentEntity<'detail', 'admin'>>;

  /**
   * 컨텐츠 요청 목록 보기
   */
  public getContentRequestAll: (
    pagenation: ContentRequestListPagenationDto,
  ) => Promise<{
    contentList: ContentEntity<'summary', 'admin'>[];
    count: number;
  }>;

  /**
   * 컨텐츠 요청하기
   */
  public createContentRequest: (
    userIdx: number,
    createDto: CreateContentRequestDto,
  ) => Promise<number>;

  /**
   * 컨텐츠 요청 수정하기
   */
  public updateContentRequest: (
    idx: number,
    updateDto: UpdateContentDto,
  ) => Promise<void>;

  /**
   * 컨텐츠 요청 삭제하기
   */
  public deleteContentRequest: (idx: number) => Promise<void>;

  /**
   * 요청 수락하기
   */
  public acceptContentRequest: (idx: number) => Promise<void>;

  /**
   * 비활성화 하기
   */
  public deactivateContent: (idx: number) => Promise<void>;
}
