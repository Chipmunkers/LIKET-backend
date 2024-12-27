import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { TempContentEntity } from './entity/temp-content.entity';
import { CultureContent } from '@prisma/client';
import { ExternalAPIs } from 'apps/batch-server/src/content-cron/external-api.enum';

@Injectable()
export class CultureContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public async selectCultureContentById(id: `${ExternalAPIs}-${string}`) {
    return await this.prisma.cultureContent.findFirst({
      where: {
        performId: id,
        deletedAt: null,
      },
    });
  }

  /**
   * 활성화된 채로 들어감.
   *
   * @author jochongs
   *
   * @param tempContent 임시 컨텐츠
   * @param contentId 컨텐츠 아이디. 현재 db 컬럼은 perform_id로 잘못 명시되어있음.
   */
  public async insertCultureContentWithContentId(
    tempContent: TempContentEntity,
    contentId: `${ExternalAPIs}-${string}`,
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
          performId: contentId,
          title: tempContent.title,
          userIdx: 1, // TODO: 관리자 인덱스인 점을 명시해야함
          description: tempContent.description,
          websiteLink: tempContent.websiteLink,
          startDate: tempContent.startDate,
          endDate: tempContent.endDate,
          openTime: tempContent.openTime,
          isFee: tempContent.isFee,
          isReservation: tempContent.isReservation,
          isPet: tempContent.isPet,
          isParking: tempContent.isParking,
          acceptedAt: new Date(),
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
