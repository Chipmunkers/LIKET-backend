import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Notice } from '@prisma/client';
import { NoticePageableDto } from './dto/notice-pageable.dto';

@Injectable()
export class NoticeRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 공지사항 여러개를 SELECT하는 메서드
   *
   * @author jochongs
   *
   * @param pageable 공지사항 Pageable
   */
  public selectNoticeAll(pageable: NoticePageableDto) {
    return this.prisma.notice.findMany({
      where: {
        deletedAt: null,
        activatedAt: {
          not: null,
        },
      },
      orderBy: [
        {
          pinnedAt: {
            sort: 'desc',
            nulls: 'last',
          },
        },
        {
          activatedAt: 'desc',
        },
      ],
      take: 10,
      skip: (pageable.page - 1) * 10,
    });
  }

  /**
   * 공지사항 하나 SELECT하는 메서드
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public selectNoticeByIdx(idx: number): Promise<Notice | null> {
    return this.prisma.notice.findUnique({
      where: {
        idx,
        deletedAt: null,
        activatedAt: {
          not: null,
        },
      },
    });
  }
}
