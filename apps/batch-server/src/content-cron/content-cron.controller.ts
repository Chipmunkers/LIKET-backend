import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { InsertContentDto } from 'apps/batch-server/src/content-cron/dto/insert-content.dto';
import { SignContentTokenDto } from 'apps/batch-server/src/content-cron/dto/sign-content-token.dto';
import { StartContentCronDto } from 'apps/batch-server/src/content-cron/dto/start-content-cron.dto';
import { Response } from 'express';

@Controller('/content')
export class ContentCronController {
  constructor(private readonly contentCronService: ContentCronService) {}

  /**
   * 컨텐츠 id를 통해 등록하기
   *
   * @author jochongs
   */
  @Post('/')
  public async upsertContentById(
    @Body() dto: InsertContentDto,
  ): Promise<'insert' | 'update'> {
    return await this.contentCronService.insertContentByToken(dto);
  }

  /**
   * 컨텐츠 id와 key를 통해 컨텐츠 토큰을 발급하는 메서드
   */
  @Post('/token')
  public async signToken(@Body() dto: SignContentTokenDto): Promise<string> {
    return await this.contentCronService.signContentToken(dto);
  }

  /**
   * 컨텐츠 cron 작업을 실행하는 메서드
   */
  @Post('/cron/all')
  public async startContentCronAll(
    @Res({ passthrough: true }) res: Response,
    @Body()
    startContentCronDto: StartContentCronDto,
  ) {
    if (
      !startContentCronDto.pw ||
      startContentCronDto.pw !== 'liket-password'
    ) {
      throw new BadRequestException('invalid password');
    }

    res.end();
    try {
      await this.contentCronService.saveContentFromExternalAPI();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * !주의: Kopis 컨텐츠 전부 꺼내서 다시 API로 데이터 업데이트하는 메서드입니다. 절대 쓰지마세요.
   *
   * @author jochongs
   */
  @Post('/recron/kopis/all')
  public async recronAllKopisContents(
    @Res({ passthrough: true }) res: Response,
    @Body()
    startContentCronDto: StartContentCronDto,
  ) {
    if (
      !startContentCronDto.pw ||
      startContentCronDto.pw !== 'liket-password0908'
    ) {
      throw new BadRequestException('invalid password');
    }

    res.end();
    try {
      await this.contentCronService.recronKPContentsAll();
    } catch (err) {
      console.log(err);
    }
  }
}
