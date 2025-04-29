import { Injectable } from '@nestjs/common';
import { AlreadyActivatedNoticeException } from 'libs/core/notice/exception/AlreadyActivatedNoticeException';
import { AlreadyDeactivatedNoticeException } from 'libs/core/notice/exception/AlreadyDeactivatedNoticeException';
import { AlreadyPinnedNoticeException } from 'libs/core/notice/exception/AlreadyPinnedNoticeException';
import { AlreadyUnpinnedNoticeException } from 'libs/core/notice/exception/AlreadyUnpinnedNoticeException';
import { NoticeNotFoundException } from 'libs/core/notice/exception/NoticeNotFoundException';
import { CreateNoticeInput } from 'libs/core/notice/input/create-notice.input';
import { FindNoticeAllInput } from 'libs/core/notice/input/find-notice-all.input';
import { UpdateNoticeInput } from 'libs/core/notice/input/update-notice.input';
import { NoticeModel } from 'libs/core/notice/model/notice.model';
import { SummaryNoticeModel } from 'libs/core/notice/model/summary-notice.model';
import { NoticeCoreRepository } from 'libs/core/notice/notice-core.repository';

@Injectable()
export class NoticeCoreService {
  constructor(private readonly noticeCoreRepository: NoticeCoreRepository) {}

  /**
   * 공지사항 목록보기
   *
   * @author jochongs
   */
  public async findNoticeAll(
    input: FindNoticeAllInput,
  ): Promise<SummaryNoticeModel[]> {
    return (await this.noticeCoreRepository.selectNoticeAll(input)).map(
      SummaryNoticeModel.fromPrisma,
    );
  }

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   *
   * @param idx 공지사항 식별자
   */
  public async findNoticeByIdx(idx: number): Promise<NoticeModel | null> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    return notice && NoticeModel.fromPrisma(notice);
  }

  /**
   * 공지사항 추가하기
   *
   * @author jochongs
   */
  public async createNotice(input: CreateNoticeInput): Promise<NoticeModel> {
    return NoticeModel.fromPrisma(
      await this.noticeCoreRepository.insertNotice(input),
    );
  }

  /**
   * 공지사항 수정하기
   *
   * @author jochongs
   *
   * @param idx 수정할 공지사항
   */
  public async updateNoticeByIdx(
    idx: number,
    input: UpdateNoticeInput,
  ): Promise<void> {
    return await this.noticeCoreRepository.updateNoticeByIdx(idx, input);
  }

  /**
   * 공지사항 삭제하기
   *
   * @author jochongs
   *
   * @param idx 삭제할 공지사항
   */
  public async deleteNoticeByIdx(idx: number): Promise<void> {
    return await this.noticeCoreRepository.softDeleteNoticeByIdx(idx);
  }

  /**
   * 공지사항 활성화하기
   *
   * @author jochongs
   *
   * @param idx 활성화할 공지사항
   *
   * @throws {NoticeNotFoundException} 404 - 공지사항이 존재하지 않는 경우
   * @throws {AlreadyActivatedNoticeException} 409 - 이미 활성화된 공지사항인 경우
   */
  public async activateNoticeByIdx(idx: number): Promise<void> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find notice');
    }

    if (notice.activatedAt) {
      throw new AlreadyActivatedNoticeException('Already activated notice');
    }

    return await this.noticeCoreRepository.updateNoticeActivatedAtByIdx(
      idx,
      new Date(),
    );
  }

  /**
   * 공지사항 비활성화하기
   *
   * @author jochongs
   *
   * @param idx 비활성화할 공지사항
   *
   * @throws {NoticeNotFoundException} 404 - 공지사항이 존재하지 않는 경우
   * @throws {AlreadyDeactivatedNoticeException} 409 - 공지사항이 이미 비활성화 되어있는 경우
   */
  public async deactivateNoticeByIdx(idx: number): Promise<void> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find notice');
    }

    if (!notice.activatedAt) {
      throw new AlreadyDeactivatedNoticeException('Already deactivated notice');
    }

    return await this.noticeCoreRepository.updateNoticeActivatedAtByIdx(
      idx,
      null,
    );
  }

  /**
   * 공지사항 고정하기
   *
   * @author jochongs
   *
   * @param idx 고정할 공지사항
   *
   * @throws {NoticeNotFoundException} 404 - 공지사항이 존재하지 않는 경우
   * @throws {AlreadyPinnedNoticeException} 409 - 이미 고정된 공지사항인 경우
   */
  public async pinNoticeByIdx(idx: number): Promise<void> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find notice');
    }

    if (notice.pinnedAt) {
      throw new AlreadyPinnedNoticeException('Already pinned notice');
    }

    return await this.noticeCoreRepository.updateNoticePinnedAtByIdx(
      idx,
      new Date(),
    );
  }

  /**
   * 공지사항 고정 해제하기
   *
   * @author jochongs
   *
   * @param idx 고정 해제할 공지사항
   *
   * @throws {NoticeNotFoundException} 404 - 공지사항이 존재하지 않는 경우
   * @throws {AlreadyUnpinnedNoticeException} 409 - 이미 고정 해제된 공지사항인 경우
   */
  public async unpinNoticeByIdx(idx: number): Promise<void> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find notice');
    }

    if (!notice.pinnedAt) {
      throw new AlreadyUnpinnedNoticeException('Already unpinned notice');
    }

    return await this.noticeCoreRepository.updateNoticePinnedAtByIdx(idx, null);
  }
}
