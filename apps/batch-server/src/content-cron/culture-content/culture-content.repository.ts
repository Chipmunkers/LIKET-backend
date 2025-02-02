import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { TempContentEntity } from './entity/temp-content.entity';
import { CultureContent } from '@prisma/client';
import { ExternalAPIs } from 'apps/batch-server/src/content-cron/external-api.enum';
import { UpdateContentInfo } from 'apps/batch-server/src/content-cron/external-apis/kopis/type/UpdateContentInfo';

@Injectable()
export class CultureContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public async selectCultureContentById(id: `${ExternalAPIs}-${string}`) {
    return await this.prisma.cultureContent.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * 컨텐츠 아이디를 식별 값을 통해 컨텐츠를 삽입하는 메서드
   * !주의: 해당 메서드에서 content id 중복 여부를 확인하지 않습니다.
   * !주의: 컨텐츠는 항상 활성화된 채로 들어감
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
          id: contentId,
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

  /**
   * @author jochongs
   */
  public async updateContentById(
    updateContentInfo: UpdateContentInfo,
    contentId: `${ExternalAPIs}-${string}`,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const content = await tx.cultureContent.findFirstOrThrow({
        where: { id: contentId },
      });

      await tx.cultureContent.update({
        where: {
          idx: content.idx,
        },
        data: {
          startDate: updateContentInfo.startDate,
          endDate: updateContentInfo.endDate,
          openTime: updateContentInfo.openTime,
          description: updateContentInfo.description,
        },
      });

      await tx.location.update({
        where: {
          idx: content.locationIdx,
        },
        data: {
          address: updateContentInfo.location.address,
          detailAddress: updateContentInfo.location.detailAddress,
          region1Depth: updateContentInfo.location.region1Depth,
          region2Depth: updateContentInfo.location.region2Depth,
          hCode: updateContentInfo.location.hCode,
          bCode: updateContentInfo.location.bCode,
          positionX: updateContentInfo.location.positionX,
          positionY: updateContentInfo.location.positionY,
          sidoCode: updateContentInfo.location.bCode.substring(0, 2),
          sggCode: updateContentInfo.location.bCode.substring(2, 5),
          legCode: updateContentInfo.location.bCode.substring(5, 8),
          riCode: updateContentInfo.location.bCode.substring(8, 10),
        },
      });
    });
  }

  /**
   * 모든 컨텐츠를 가져오는 메서드
   *
   * !주의: 개수 제한이 없습니다.
   *
   * @author jochongs
   */
  public async selectCultureContentByExternalApiKey(key: ExternalAPIs) {
    return await this.prisma.cultureContent.findMany({
      select: {
        idx: true,
        id: true,
      },
      where: {
        deletedAt: null,
        id: {
          startsWith: key,
        },
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }
}
