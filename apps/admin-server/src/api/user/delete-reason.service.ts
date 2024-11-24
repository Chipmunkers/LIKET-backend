import { Injectable } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma.service';
import { GetDeleteReasonPagerbleDto } from './dto/request/get-delete-reason-pagerble.dto';
import { DeleteReasonEntity } from './entity/delete-reason.entity';
import { DeleteUserTypeEntity } from './entity/delete-type.entity';
import { DeleteUserReasonNotFoundException } from './exception/DeleteUserReasonNotFoundException';

@Injectable()
export class DeleteReasonService {
  constructor(private readonly prisma: Prisma) {}

  getDeleteUserTypeAll: () => Promise<DeleteUserTypeEntity[]> = async () => {
    const deleteUserTypeList = await this.prisma.deleteUserType.findMany();

    return deleteUserTypeList.map((type) => DeleteUserTypeEntity.createEntity(type));
  };

  getDeleteReasonAll: (pagerble: GetDeleteReasonPagerbleDto) => Promise<{
    reasonList: DeleteReasonEntity[];
    count: number;
  }> = async (pagerble) => {
    const [reasonList, count] = await this.prisma.$transaction([
      this.prisma.deleteUserReason.findMany({
        include: {
          DeleteUserType: true,
        },
        where: {
          typeIdx: pagerble.type,
          contents:
            pagerble.searchby === 'contents'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.deleteUserReason.count({
        where: {
          typeIdx: pagerble.type,
          contents:
            pagerble.searchby === 'contents'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
        },
      }),
    ]);

    return {
      reasonList: reasonList.map((reason) => DeleteReasonEntity.createEntity(reason)),
      count,
    };
  };

  getDeleteReasonByIdx: (idx: number) => Promise<DeleteReasonEntity> = async (idx) => {
    const deleteUserReason = await this.prisma.deleteUserReason.findUnique({
      include: {
        DeleteUserType: true,
      },
      where: {
        idx,
      },
    });

    if (!deleteUserReason) {
      throw new DeleteUserReasonNotFoundException('Cannot find delete user reason');
    }

    return DeleteReasonEntity.createEntity(deleteUserReason);
  };
}
