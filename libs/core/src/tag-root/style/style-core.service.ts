import { Injectable } from '@nestjs/common';
import { StyleCoreRepository } from 'libs/core/tag-root/style/style-core.repository';

@Injectable()
export class StyleCoreService {
  constructor(private readonly styleCoreRepository: StyleCoreRepository) {}
}
