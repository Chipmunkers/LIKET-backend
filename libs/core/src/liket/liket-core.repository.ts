import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class LiketCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}
}
