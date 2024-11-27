import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { PrismaProvider } from 'libs/modules';

export class TosRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(TosRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
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

  /**
   * @author jochongs
   */
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
