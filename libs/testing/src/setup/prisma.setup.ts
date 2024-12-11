import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { PrismaProvider } from 'libs/modules';

export class PrismaSetup {
  private readonly prisma: PrismaProvider;
  private readonly prismaTestingHelper: PrismaTestingHelper<PrismaProvider>;

  private constructor() {
    if (this.prismaTestingHelper) {
      return;
    }

    this.prisma = new PrismaProvider();
    this.prismaTestingHelper = new PrismaTestingHelper(this.prisma);
    this.prisma = this.prismaTestingHelper.getProxyClient();
  }

  public async BEGIN() {
    await this.prismaTestingHelper.startNewTransaction();
  }

  public ROLLBACK() {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }

  public getPrisma() {
    return this.prisma;
  }

  static setup() {
    return new PrismaSetup();
  }
}
