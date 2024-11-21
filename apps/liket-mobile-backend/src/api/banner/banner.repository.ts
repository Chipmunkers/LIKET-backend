import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class BannerRepository {
  constructor(
    private readonly prisma: PrismaProvider,
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
