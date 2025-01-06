import { Injectable } from '@nestjs/common';
import { NoticeEntity } from './entity/notice.entity';
import { NoticeNotFoundException } from './exception/NoticeNotFoundException';
import { SummaryNoticeEntity } from './entity/summary-notice.entity';
import { Prisma as PrismaType } from '@prisma/client';
import { NoticePageableDto } from './dto/request/notice-pageable.dto';
import { CreateNoticeDto } from './dto/request/create-notice.dto';
import { UpdateNoticeDto } from './dto/request/update-notice.dto';
import { AlreadyActivatedNoticeException } from './exception/AlreadyActivatedNoticeException';
import { AlreadyDeactivatedNoticeException } from './exception/AlreadyDeactivatedNoticeException';
import { AlreadyPinnedNoticeException } from './exception/AlreadyPinnedNoticeException';
import { AlreadyNotPinnedNoticeException } from './exception/AlreadyNotPinnedNoticeException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 공지사항 하나를 가져오는 메서드
   *
   * @author jochongs
   *
   * @param idx 공지시항 인덱스
   */
  public async getNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const notice = await this.prisma.notice.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find notice');
    }

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 목록 보기
   *
   * @author jochongs
   *
   * @param pageable 공지사항 Pageable
   */
  public async getNoticeAll(pageable: NoticePageableDto): Promise<{
    noticeList: SummaryNoticeEntity[];
    count: number;
  }> {
    const where: PrismaType.NoticeWhereInput = {
      deletedAt: null,
      title: pageable.search
        ? {
            contains: pageable.search,
          }
        : undefined,
      activatedAt: pageable.state
        ? pageable.state === 'active'
          ? {
              not: null,
            }
          : null
        : undefined,
      pinnedAt:
        pageable.state === 'pin'
          ? {
              not: null,
            }
          : undefined,
    };

    const [noticeList, count] = await this.prisma.$transaction([
      this.prisma.notice.findMany({
        where,
        orderBy: {
          idx: pageable.order,
        },
        take: 10,
        skip: (pageable.page - 1) * 10,
      }),
      this.prisma.notice.count({ where }),
    ]);

    return {
      noticeList: noticeList.map((notice) =>
        SummaryNoticeEntity.createEntity(notice),
      ),
      count,
    };
  }

  /**
   * 공지사항 생성하기
   *
   * @author jochongs
   *
   * @param createDto 공지사항 생성 DTO
   */
  public async createNotice(createDto: CreateNoticeDto): Promise<NoticeEntity> {
    const notice = await this.prisma.notice.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 수정하기
   *
   * @author jochongs
   *
   * @parma idx 공지사항 인덱스
   * @param updateDto 공지사항 수정 DTO
   */
  public async updateNoticeByIdx(
    idx: number,
    updateDto: UpdateNoticeDto,
  ): Promise<NoticeEntity> {
    await this.getNoticeByIdx(idx);

    const notice = await this.prisma.notice.update({
      where: {
        idx,
      },
      data: {
        title: updateDto.title,
        contents: updateDto.contents,
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 삭제하기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async deleteNoticeByIdx(idx: number): Promise<NoticeEntity> {
    await this.getNoticeByIdx(idx);

    const notice = await this.prisma.notice.update({
      where: {
        idx,
      },
      data: {
        deletedAt: null,
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 활성화하기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async activateNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const findNotice = await this.getNoticeByIdx(idx);

    if (findNotice.activatedAt) {
      throw new AlreadyActivatedNoticeException('Already activated notice');
    }

    const notice = await this.prisma.notice.update({
      where: {
        idx,
      },
      data: {
        activatedAt: new Date(),
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 비활성하기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async deactivateNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const findNotice = await this.getNoticeByIdx(idx);

    if (!findNotice.activatedAt) {
      throw new AlreadyDeactivatedNoticeException('Already deactivated notice');
    }

    const notice = await this.prisma.notice.update({
      where: { idx },
      data: {
        activatedAt: null,
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 고정하기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async pinNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const findNotice = await this.getNoticeByIdx(idx);

    if (findNotice.pinnedAt) {
      throw new AlreadyPinnedNoticeException('Already pinned notice');
    }

    const notice = await this.prisma.notice.update({
      where: { idx },
      data: {
        pinnedAt: new Date(),
      },
    });

    return NoticeEntity.createEntity(notice);
  }

  /**
   * 공지사항 해제하기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async unpinNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const findNotice = await this.getNoticeByIdx(idx);

    if (!findNotice.pinnedAt) {
      throw new AlreadyNotPinnedNoticeException('Already unpinned notice');
    }

    const notice = await this.prisma.notice.update({
      where: { idx },
      data: {
        pinnedAt: null,
      },
    });

    return NoticeEntity.createEntity(notice);
  }
}
