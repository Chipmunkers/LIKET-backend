import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { TempContentEntity } from './entity/temp-content.entity';
import { CultureContent } from '@prisma/client';

@Injectable()
export class CultureContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  public async insertCultureContent(
    tempContent: TempContentEntity,
  ): Promise<CultureContent> {
    return await this.prisma.$transaction(async (tx) => {
      const location = await tx.location.create({
        data: {
          address: tempContent.location.address,
          detailAddress: tempContent.location.detailAddress,
          region1Depth: tempContent.location.region1Depth,
          region2Depth: tempContent.location.region2Depth,
          hCode: tempContent.location.hCode,
          bCode: tempContent.location.bCode,
          positionX: tempContent.location.positionX,
          positionY: tempContent.location.positionY,
          sidoCode: tempContent.location.bCode.substring(0, 2),
          sggCode: tempContent.location.bCode.substring(2, 5),
          legCode: tempContent.location.bCode.substring(5, 8),
          riCode: tempContent.location.bCode.substring(8, 10),
        },
      });

      return await tx.cultureContent.create({
        data: {
          locationIdx: location.idx,
          genreIdx: tempContent.genreIdx,
          ageIdx: tempContent.ageIdx,
          performId: tempContent.id,
          title: tempContent.title,
          description: tempContent.description,
          websiteLink: tempContent.websiteLink,
          startDate: tempContent.startDate,
          endDate: tempContent.endDate,
          openTime: tempContent.openTime,
          isFee: tempContent.isFee,
          isReservation: tempContent.isReservation,
          isPet: tempContent.isPet,
          isParking: tempContent.isParking,
          Style: {
            createMany: {
              data: tempContent.styleIdxList.map((styleIdx) => ({ styleIdx })),
            },
          },
          ContentImg: {
            createMany: {
              data: tempContent.imgList.map((img) => ({
                imgPath: img,
              })),
            },
          },
        },
      });
    });
  }
}
