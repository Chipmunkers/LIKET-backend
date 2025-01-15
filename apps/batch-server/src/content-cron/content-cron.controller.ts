import { Body, Controller, Post } from '@nestjs/common';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { InsertContentDto } from 'apps/batch-server/src/content-cron/dto/insert-content.dto';

@Controller('/content')
export class ContentCronController {
  constructor(private readonly contentCronService: ContentCronService) {}

  /**
   * 컨텐츠 id를 통해 등록하기
   *
   * @author jochongs
   */
  @Post('/')
  public async upsertContentById(@Body() dto: InsertContentDto): Promise<void> {
    await this.contentCronService.insertContentByToken(dto);
  }
}
