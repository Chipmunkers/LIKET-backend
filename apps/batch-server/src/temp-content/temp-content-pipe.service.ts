import { Injectable } from '@nestjs/common';
import { RawTempContentEntity } from './entity/raw-temp-content.entity';

@Injectable()
export class TempContentPipeService {
  constructor() {}

  /**
   * RawTempContent를 통해 TempContentEntity를 만드는 메서드
   *
   * @author jochongs
   */
  public async createTempContentEntity(rawEntity: RawTempContentEntity) {}
}
