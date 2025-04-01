import { Injectable } from '@nestjs/common';
import { NoticeCoreRepository } from 'libs/core/notice/notice-core.repository';

@Injectable()
export class NoticeCoreService {
  constructor(private readonly noticeCoreRepository: NoticeCoreRepository) {}
}
