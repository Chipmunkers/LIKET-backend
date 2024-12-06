import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class TempCultureContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * RawTempContentEntity를 통해 temp content 저장하기
   *
   * @author jochongs
   */
  public async insertTempContentByRawTempContent() {}
}
