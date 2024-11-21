import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class BannerRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(BannerRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectBannerAll() {
    this.logger.log(this.selectBannerAll, 'SELECT active banner');
    return this.prisma.activeBanner.findMany({
      include: {
        Banner: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }
}
