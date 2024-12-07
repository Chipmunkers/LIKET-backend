import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { TempContentEntity } from './entity/temp-content.entity';

@Injectable()
export class TempContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * TempContentEntity를 통해 temp content 저장하기
   *
   * @author jochongs
   */
  public async insertTempContent(tempEntity: TempContentEntity) {
    await this.prisma.$transaction(async (tx) => {
      const location = await tx.tempContentLocation.create({
        data: {
          address: tempEntity.location.address,
          detailAddress: tempEntity.location.detailAddress,
          region1Depth: tempEntity.location.region1Depth,
          region2Depth: tempEntity.location.region2Depth,
          hCode: tempEntity.location.hCode,
          bCode: tempEntity.location.bCode,
          positionX: tempEntity.location.positionX,
          positionY: tempEntity.location.positionY,
        },
      });

      await tx.tempCultureContent.create({
        data: {
          locationIdx: location.idx,
          genreIdx: tempEntity.genreIdx,
          ageIdx: tempEntity.ageIdx,
          performId: tempEntity.id,
          title: tempEntity.title,
          description: tempEntity.description,
          websiteLink: tempEntity.websiteLink,
          startDate: tempEntity.startDate,
          endDate: tempEntity.endDate,
          openTime: tempEntity.openTime,
          isFee: tempEntity.isFee,
          isReservation: tempEntity.isReservation,
          isPet: tempEntity.isPet,
          isParking: tempEntity.isParking,
          TempContentImg: {
            createMany: {
              data: tempEntity.imgList.map((img) => ({
                imgPath: img,
              })),
            },
          },
        },
      });
    });
  }
}
