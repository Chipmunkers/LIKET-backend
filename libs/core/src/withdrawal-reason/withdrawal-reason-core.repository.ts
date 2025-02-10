import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateWithdrawalReasonInput } from 'libs/core/withdrawal-reason/input/create-withdrawal.input';
import { DeleteReasonSelectField } from 'libs/core/withdrawal-reason/model/prisma/delete-reason-select-field';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class WithdrawalReasonCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * INSERT user_delete_reason
   *
   * @author jochongs
   */
  public async createWithdrawalReason(
    idx: number,
    input: CreateWithdrawalReasonInput,
  ): Promise<DeleteReasonSelectField> {
    return await this.txHost.tx.deleteUserReason.create({
      select: {
        idx: true,
        contents: true,
        DeleteUserType: {
          select: {
            idx: true,
            name: true,
          },
        },
        User: {
          select: {
            email: true,
            nickname: true,
            profileImgPath: true,
            createdAt: true,
          },
        },
      },
      data: {
        idx,
        typeIdx: input.typeIdx,
        contents: input.contents,
      },
    });
  }
}
