import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateContentRequestDto } from './dto/request/CreateContentRequestDto';
import { CultureContentRequestDto } from './dto/response/ContentRequestDto';
import { ContentRequestListPagenationDto } from './dto/request/ContentRequestListPagenationDto';
import { UpdateContentDto } from './dto/request/UpdateContentDto';
import { ContentDto } from './dto/response/ContentDto';
import { SummaryContentDto } from './dto/response/SummaryContentDto';
import { ContentListPagenationDto } from './dto/request/ContentListPagenationDto';

@Injectable()
export class CultureContentService {
  constructor(private readonly prisma: PrismaService) {}

  // Content ==================================================

  /**
   * 컨텐츠 자세히보기
   */
  public getContentByIdx: (idx: number, userIdx: number) => Promise<ContentDto>;

  /**
   * 컨텐츠 요청 목록 보기
   */
  public getContentAll: (
    pagenation: ContentListPagenationDto,
    userIdx: number,
  ) => Promise<SummaryContentDto[]>;

  // Content Request ==========================================

  /**
   * 컨텐츠 요청 자세히보기
   */
  public getContentRequestByIdx: (
    idx: number,
  ) => Promise<CultureContentRequestDto>;

  /**
   * 컨텐츠 요청 목록 보기
   */
  public getContentRequestAll: (
    pagenation: ContentRequestListPagenationDto,
  ) => Promise<{
    contentList: CultureContentRequestDto[];
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
