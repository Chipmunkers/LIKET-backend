import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { TempContentEntity } from './entity/temp-content.entity';

@Injectable()
export class TempContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public async selectTempContentById(id: string) {
    return await this.prisma.tempCultureContent.findUnique({
      where: {
        performId: id,
      },
    });
  }

  /**
   * TempContentEntity를 통해 temp content 저장하기
   *
   * @author jochongs
   */
  public async insertTempContent(tempEntity: TempContentEntity) {
    return await this.prisma.$transaction(async (tx) => {
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

      return await tx.tempCultureContent.create({
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

  /**
   * TempContentEntity를 Update 하는 메서드
   *
   * @author jochongs
   */
  public async updateTempContentByIdx(
    idx: number,
    locationIdx: number,
    tempEntity: TempContentEntity,
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.tempContentLocation.update({
        where: {
          idx: locationIdx,
        },
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

      return await tx.tempCultureContent.update({
        where: {
          idx,
        },
        data: {
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
            deleteMany: {},
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

  /**
   * ! process.env.MODE 가 develop일 때만 작동합니다.
   *
   * @author jochongs
   */
  public async insertContentByTempContentEntityForDevelop(
    tempEntity: TempContentEntity,
  ) {
    if (process.env.MODE !== 'develop') {
      return;
    }

    return await this.prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          address: tempEntity.location.address,
          detailAddress: tempEntity.location.detailAddress || 'Empty',
          region1Depth: tempEntity.location.region1Depth,
          region2Depth: tempEntity.location.region2Depth,
          hCode: tempEntity.location.hCode,
          bCode: tempEntity.location.bCode,
          sidoCode: tempEntity.location.bCode.substring(0, 2),
          sggCode: tempEntity.location.bCode.substring(2, 5),
          legCode: tempEntity.location.bCode.substring(5, 8),
          riCode: tempEntity.location.bCode.substring(8, 10),
          positionX: tempEntity.location.positionX,
          positionY: tempEntity.location.positionY,
        },
      });

      await tx.cultureContent.create({
        data: {
          genreIdx: tempEntity.genreIdx,
          userIdx: 1, // Admin
          locationIdx: createdLocation.idx,
          ageIdx: tempEntity.ageIdx || 1,
          Style: {
            createMany: {
              data: [
                {
                  styleIdx: 1,
                },
                {
                  styleIdx: 2,
                },
              ],
            },
          },
          ContentImg: {
            createMany: {
              data: tempEntity.imgList.map((img) => ({
                imgPath: img,
              })),
            },
          },
          title: tempEntity.title,
          description: tempEntity.description || 'Empty',
          websiteLink: tempEntity.websiteLink,
          startDate: tempEntity.startDate,
          endDate: tempEntity.endDate || new Date('2028-01-01'),
          openTime: tempEntity.openTime,
          isFee: tempEntity.isFee,
          isReservation: tempEntity.isReservation,
          isParking: tempEntity.isParking,
          isPet: tempEntity.isPet,
        },
      });
    });
  }

  /**
   * @author jochongs
   */
  public async selectContentByPerformId(id: string) {
    return await this.prisma.cultureContent.findFirst({
      where: {
        performId: id,
        deletedAt: null,
      },
    });
  }
}
