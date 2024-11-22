import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

export class TosRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(TosRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectTosAll() {
    this.logger.log(this.selectTosAll, 'SELECT tos');
    return this.prisma.tos.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }

  public selectTosByIdx(idx: number) {
    this.logger.log(this.selectTosByIdx, `SELECT tos WHERE idx = ${idx}`);
    return this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
