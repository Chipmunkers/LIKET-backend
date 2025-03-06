import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewReportCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}
}
