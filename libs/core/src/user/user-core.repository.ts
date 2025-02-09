import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserCoreRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public async insertUser() {}
}
