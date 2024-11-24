import { Injectable } from '@nestjs/common';
import { Notice } from '@prisma/client';
import { NoticePageableDto } from './dto/notice-pageable.dto';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class NoticeRepository {
  constructor(private readonly prisma: PrismaProvider) {}

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
