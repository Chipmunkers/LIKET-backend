import { PrismaProvider } from 'libs/modules';

/**
 * 시딩 헬퍼 추상 클래스.
 * extends해서 사용하기를 기대합니다.
 *
 * @author jochongs
 */
export abstract class ISeedHelper<TInput = any, TOutput = any> {
  protected readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  public abstract seed(input: TInput): Promise<TOutput>;

  public abstract seedAll(input: TInput[]): Promise<TOutput[]>;
}
