import { Injectable } from '@nestjs/common';
import { GetContentPagerbleDto } from './dto/request/get-content-all-pagerble.dto';
import { ContentEntity } from './entity/content.entity';
import { CreateCultureContentDto } from './dto/request/create-culture-content.dto';
import { UpdateCultureContentDto } from './dto/request/update-culture-content.dto';
import { SummaryContentEntity } from './entity/summary-content.entity';
import { ContentNotFoundException } from './exception/ContentNotFoundException';
import { AlreadyActiveContentException } from './exception/AlreadyActiveContentException';
import { AlreadyDeactiveContentException } from './exception/AlreadyDeactiveContentException';
import {
  InstagramFeedEntity,
  InstagramService,
  KakaoAddressEntity,
  KakaoAddressService,
  OpenAIService,
  PrismaProvider,
  S3Service,
  UploadedFileEntity,
} from 'libs/modules';
import { Prisma } from '@prisma/client';
import { ContentFromInstagramEntity } from 'apps/admin-server/src/api/culture-content/entity/content-from-instagram.entity';
import * as uuid from 'uuid';
import { UtilService } from 'apps/admin-server/src/common/util/util.service';
import { Style } from 'libs/core/tag-root/style/constant/style';
import { Age } from 'libs/core/tag-root/age/constant/age';
import { SummaryContentFromInstagramEntity } from 'apps/admin-server/src/api/culture-content/entity/summary-content-from-instagram.entity';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly instagramService: InstagramService,
    private readonly s3Service: S3Service,
    private readonly utilService: UtilService,
    private readonly openAIService: OpenAIService,
    private readonly kakaoAddressService: KakaoAddressService,
  ) {}

  getContentAll: (pagerble: GetContentPagerbleDto) => Promise<{
    contentList: SummaryContentEntity[];
    count: number;
  }> = async (pagerble) => {
    const where: Prisma.CultureContentWhereInput = {
      genreIdx: pagerble.genre,
      acceptedAt: this.generateAccept(pagerble.accept),
      ...this.generateOpenState(pagerble.state),
      title:
        pagerble.searchby === 'title'
          ? {
              contains: pagerble.search || '',
            }
          : undefined,
      User: {
        nickname:
          pagerble.searchby === 'user'
            ? {
                contains: pagerble.search || '',
              }
            : undefined,
        deletedAt: null,
      },
      deletedAt: null,
    };

    const [contentList, count] = await this.prisma.$transaction([
      this.prisma.cultureContent.findMany({
        include: {
          User: {
            include: {
              BlockReason: {
                orderBy: {
                  idx: 'desc',
                },
              },
            },
          },
          ContentImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          Genre: true,
          Style: {
            include: {
              Style: true,
            },
            where: {
              Style: {
                deletedAt: null,
              },
            },
          },
          Age: true,
          Location: true,
        },
        where,
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.cultureContent.count({ where }),
    ]);

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
      count,
    };
  };

  private generateOpenState(
    state?: GetContentPagerbleDto.OpenState,
  ): Prisma.CultureContentWhereInput {
    if (!state) {
      return {};
    }

    if (state === 'soon-open') {
      return {
        startDate: {
          gt: new Date(),
        },
        OR: [
          {
            endDate: {
              gt: new Date(),
            },
          },
          {
            endDate: null,
          },
        ],
      };
    }

    if (state === 'continue' || state === 'soon-end') {
      return {
        startDate: {
          lte: new Date(),
        },
        OR: [
          {
            endDate: {
              gte: new Date(),
            },
          },
          {
            endDate: null,
          },
        ],
      };
    }

    // end
    return {
      startDate: {
        lte: new Date(),
      },
      endDate: {
        lte: new Date(),
      },
    };
  }

  private generateAccept(
    state?: boolean,
  ): Prisma.CultureContentWhereInput['acceptedAt'] {
    if (state === undefined) {
      return undefined;
    }

    if (state) {
      return {
        not: null,
      };
    }

    return null;
  }

  getContentByIdx: (idx: number) => Promise<ContentEntity> = async (idx) => {
    const content = await this.prisma.cultureContent.findUnique({
      include: {
        User: {
          include: {
            BlockReason: {
              orderBy: {
                idx: 'desc',
              },
            },
          },
        },
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
      },
      where: {
        idx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Canoot find culture content');
    }

    return ContentEntity.createEntity(content);
  };

  createContent: (
    userIdx: number,
    createDto: CreateCultureContentDto,
  ) => Promise<ContentEntity> = async (userIdx, createDto) => {
    const createdContent = await this.prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          address: createDto.location.address,
          detailAddress: createDto.location.detailAddress,
          region1Depth: createDto.location.region1Depth,
          region2Depth: createDto.location.region2Depth,
          hCode: createDto.location.hCode,
          bCode: createDto.location.bCode,
          positionX: createDto.location.positionX,
          positionY: createDto.location.positionY,
          sidoCode: createDto.location.bCode.substring(0, 2),
          sggCode: createDto.location.bCode.substring(2, 5),
          legCode: createDto.location.bCode.substring(5, 8),
          riCode: createDto.location.bCode.substring(8, 10),
        },
      });

      const requestedCultureContent = await tx.cultureContent.create({
        include: {
          User: {
            include: {
              BlockReason: {
                orderBy: {
                  idx: 'desc',
                },
              },
            },
          },
          ContentImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          Genre: true,
          Style: {
            include: {
              Style: true,
            },
            where: {
              Style: {
                deletedAt: null,
              },
            },
          },
          Age: true,
          Location: true,
        },
        data: {
          genreIdx: createDto.genreIdx,
          userIdx: userIdx,
          locationIdx: createdLocation.idx,
          ageIdx: createDto.ageIdx,
          Style: {
            createMany: {
              data: createDto.styleIdxList.map((style) => ({
                styleIdx: style,
              })),
            },
          },
          ContentImg: createDto.imgList?.length
            ? {
                createMany: {
                  data: createDto.imgList.map((img) => ({
                    imgPath: img.path,
                  })),
                },
              }
            : undefined,
          title: createDto.title,
          description: createDto.description,
          websiteLink: createDto.websiteLink,
          startDate: createDto.startDate,
          endDate: createDto.endDate,
          openTime: createDto.openTime,
          isFee: createDto.isFee,
          isReservation: createDto.isReservation,
          isParking: createDto.isParking,
          isPet: createDto.isPet,
          acceptedAt: null,
        },
      });

      return requestedCultureContent;
    });

    return ContentEntity.createEntity(createdContent);
  };

  updateContentByIdx: (
    idx: number,
    updateDto: UpdateCultureContentDto,
  ) => Promise<void> = async (idx, updateDto) => {
    await this.prisma.$transaction(async (tx) => {
      const content = await tx.cultureContent.update({
        select: {
          locationIdx: true,
        },
        where: {
          idx,
        },
        data: {
          title: updateDto.title,
          description: updateDto.description,
          websiteLink: updateDto.websiteLink,
          ContentImg: {
            updateMany: {
              where: {
                deletedAt: null,
              },
              data: {
                deletedAt: new Date(),
              },
            },
            createMany: updateDto.imgList
              ? {
                  data: updateDto.imgList.map((img) => ({
                    imgPath: img.path,
                  })),
                }
              : undefined,
          },
          genreIdx: updateDto.genreIdx,
          ageIdx: updateDto.ageIdx,
          Style: {
            deleteMany: {},
            createMany: {
              data: updateDto.styleIdxList.map((styleIdx) => ({ styleIdx })),
            },
          },
          startDate: updateDto.startDate,
          endDate: updateDto.endDate,
          openTime: updateDto.openTime,
          isFee: updateDto.isFee,
          isParking: updateDto.isParking,
          isReservation: updateDto.isReservation,
          isPet: updateDto.isPet,
        },
      });

      await tx.location.update({
        where: {
          idx: content.locationIdx,
        },
        data: {
          address: updateDto.location.address,
          detailAddress: updateDto.location.detailAddress,
          region1Depth: updateDto.location.region1Depth,
          region2Depth: updateDto.location.region2Depth,
          hCode: updateDto.location.hCode,
          bCode: updateDto.location.bCode,
          positionX: updateDto.location.positionX,
          positionY: updateDto.location.positionY,
          sidoCode: updateDto.location.bCode.substring(0, 2),
          sggCode: updateDto.location.bCode.substring(2, 5),
          legCode: updateDto.location.bCode.substring(5, 8),
          riCode: updateDto.location.bCode.substring(8, 10),
        },
      });
    });

    return;
  };

  deleteContentByIdx: (idx: number) => Promise<void> = async (idx) => {
    try {
      await this.prisma.cultureContent.update({
        where: {
          idx,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (err) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    return;
  };

  activateContentByIdx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.$transaction(async (tx) => {
      const content = await this.prisma.cultureContent.findUnique({
        where: {
          idx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
      });

      if (!content) {
        throw new ContentNotFoundException('Cannot find culture content');
      }

      if (content.acceptedAt) {
        throw new AlreadyActiveContentException(
          'Already activated culture content',
        );
      }

      await this.prisma.cultureContent.update({
        where: {
          idx,
        },
        data: {
          acceptedAt: new Date(),
        },
      });
    });

    return;
  };

  deactivateContentByIdx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.$transaction(async (tx) => {
      const content = await this.prisma.cultureContent.findUnique({
        where: {
          idx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
      });

      if (!content) {
        throw new ContentNotFoundException('Cannot find culture content');
      }

      if (!content.acceptedAt) {
        throw new AlreadyDeactiveContentException(
          'Already deactivated culture content',
        );
      }

      await this.prisma.cultureContent.update({
        where: {
          idx,
        },
        data: {
          acceptedAt: null,
        },
      });
    });

    return;
  };

  /**
   * get culture content basic info from instagram feed
   *
   * @author jochongs
   */
  public async getCultureContentInfoFromInstagramBasicInfo(
    code: string,
  ): Promise<SummaryContentFromInstagramEntity> {
    const instagramFeedEntity =
      await this.instagramService.getInstagramFeedData(code);

    const uploadedImgList = await this.uploadImgs(instagramFeedEntity.images);

    return SummaryContentFromInstagramEntity.from(
      instagramFeedEntity.caption,
      uploadedImgList.map(({ path }) => path),
    );
  }

  /**
   * Get culture content info from instagram feed
   *
   * @author jochongs
   */
  public async getCultureContentInfoFromInstagram(
    code: string,
  ): Promise<ContentFromInstagramEntity> {
    const instagramFeedEntity =
      await this.instagramService.getInstagramFeedData(code);

    const uploadedImgList = await this.uploadImgs(instagramFeedEntity.images);

    const contentInfo = await this.openAIService.extractContentInfo(
      instagramFeedEntity,
      uploadedImgList.map((img) => img.url),
    );

    const kakaoLocation = await this.getContentLocation(contentInfo.address);
    const styleAndAge = await this.getStyleAndAgeFromAI(
      instagramFeedEntity,
      uploadedImgList,
    );

    return ContentFromInstagramEntity.fromInstagram(
      instagramFeedEntity,
      contentInfo,
      kakaoLocation,
      styleAndAge?.styleIdxList || null,
      uploadedImgList,
      styleAndAge?.ageIdx || null,
    );
  }

  private async getContentLocation(
    address: string,
  ): Promise<KakaoAddressEntity | null> {
    if (!address) return null;

    try {
      const response = await this.kakaoAddressService.searchAddress(address);
      return response.documents[0].address;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async uploadImgs(imgList: string[]): Promise<UploadedFileEntity[]> {
    const uploadedImgList: UploadedFileEntity[] = [];

    for (let i = 0; i < imgList.length; i++) {
      uploadedImgList.push(
        await this.s3Service.uploadFileToS3ByUrl(imgList[i], {
          filename:
            uuid.v4() +
            '-' +
            this.utilService.generateRandomNumericString(6) +
            '.png',
          path: 'culture-content',
        }),
      );
    }

    return uploadedImgList;
  }

  private async getStyleAndAgeFromAI(
    contentInfo: InstagramFeedEntity,
    uploadedImgList: UploadedFileEntity[],
  ): Promise<{
    styleIdxList: Style[];
    ageIdx: Age;
  } | null> {
    try {
      return await this.openAIService.extractStyleAndAge(
        contentInfo,
        uploadedImgList.map(({ url }) => url),
      );
    } catch (err) {
      return null;
    }
  }
}
