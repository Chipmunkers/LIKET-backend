import { faker } from '@faker-js/faker';
import {
  AGE,
  DeepRequired,
  GENRE,
  getRandomValueFromConstant,
  getRandomValuesFromConstant,
  STYLE,
} from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';

type CultureContentInput = {
  genreIdx?: number;
  ageIdx?: number;
  userIdx: number;
  styleIdxList?: number[];
  imgList?: string[];
  location?: {
    address?: string;
    detailAddress?: string;
    region1Depth?: string;
    region2Depth?: string;
    hCode?: string;
    bCode?: string;
    positionX?: number;
    positionY?: number;
    sidoCode?: string;
    sggCode?: string;
    legCode?: string;
    riCode?: string;
  };
  performId?: string | null;
  title?: string;
  description?: string | null;
  websiteLink?: string;
  startDate?: Date;
  endDate?: Date | null;
  viewCount?: number;
  openTime?: string;
  isFee?: boolean;
  isReservation?: boolean;
  isPet?: boolean;
  isParking?: boolean;
  likeCount?: number;
  acceptedAt?: Date | null;
  deletedAt?: Date | null;
};

type CultureContentOutput = DeepRequired<CultureContentInput> & { idx: number };

/**
 * @author jochongs
 */
export class CultureContentSeedHelper extends ISeedHelper<
  CultureContentInput,
  CultureContentOutput
> {
  public async seed(input: CultureContentInput): Promise<CultureContentOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const createdCultureContent = await this.prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          address: filledInput.location.address,
          detailAddress: filledInput.location.detailAddress,
          region1Depth: filledInput.location.region1Depth,
          region2Depth: filledInput.location.region2Depth,
          hCode: filledInput.location.hCode,
          bCode: filledInput.location.bCode,
          positionX: filledInput.location.positionX,
          positionY: filledInput.location.positionY,
          sidoCode: filledInput.location.sidoCode,
          sggCode: filledInput.location.sggCode,
          legCode: filledInput.location.legCode,
          riCode: filledInput.location.riCode,
        },
      });

      return await this.prisma.cultureContent.create({
        include: {
          Location: true,
          ContentImg: true,
          Style: true,
        },
        data: {
          genreIdx: filledInput.genreIdx,
          ageIdx: filledInput.ageIdx,
          userIdx: filledInput.userIdx,
          Style: {
            createMany: {
              data: filledInput.styleIdxList.map((styleIdx) => ({ styleIdx })),
            },
          },
          ContentImg: {
            createMany: {
              data: filledInput.imgList.map((imgPath) => ({
                imgPath,
              })),
            },
          },
          locationIdx: createdLocation.idx,
          performId: filledInput.performId,
          title: filledInput.title,
          description: filledInput.description,
          websiteLink: filledInput.websiteLink,
          startDate: filledInput.startDate,
          endDate: filledInput.endDate,
          viewCount: filledInput.viewCount,
          openTime: filledInput.openTime,
          isFee: filledInput.isFee,
          isReservation: filledInput.isReservation,
          isPet: filledInput.isPet,
          isParking: filledInput.isParking,
          likeCount: filledInput.likeCount,
          acceptedAt: filledInput.acceptedAt,
          deletedAt: filledInput.deletedAt,
        },
      });
    });

    return {
      idx: createdCultureContent.idx,
      genreIdx: createdCultureContent.genreIdx,
      ageIdx: createdCultureContent.ageIdx,
      userIdx: createdCultureContent.userIdx,
      location: createdCultureContent.Location,
      styleIdxList: createdCultureContent.Style.map((style) => style.styleIdx),
      imgList: createdCultureContent.ContentImg.map((img) => img.imgPath),
      performId: createdCultureContent.performId,
      title: createdCultureContent.title,
      description: createdCultureContent.description,
      websiteLink: createdCultureContent.websiteLink,
      startDate: createdCultureContent.startDate,
      endDate: createdCultureContent.endDate,
      viewCount: createdCultureContent.viewCount,
      openTime: createdCultureContent.openTime,
      isFee: createdCultureContent.isFee,
      isReservation: createdCultureContent.isReservation,
      isPet: createdCultureContent.isPet,
      isParking: createdCultureContent.isParking,
      likeCount: createdCultureContent.likeCount,
      acceptedAt: createdCultureContent.acceptedAt,
      deletedAt: createdCultureContent.deletedAt,
    };
  }

  public async seedAll(
    inputList: CultureContentInput[],
  ): Promise<CultureContentOutput[]> {
    return await Promise.all(inputList.map((input) => this.seed(input)));
  }

  private getRandomGenre() {
    return getRandomValueFromConstant(GENRE);
  }

  private getRandomStyles() {
    const randomCount = Math.floor(Math.random() * 3) + 1; // 1 ~ 3

    return getRandomValuesFromConstant(STYLE, randomCount);
  }

  private async getFilledInputValue(
    input: CultureContentInput,
  ): Promise<DeepRequired<CultureContentInput>> {
    const randomHCode = input.location?.hCode ?? this.getRandomCode();
    const randomBCode = input.location?.bCode ?? this.getRandomCode();

    return {
      genreIdx: input.genreIdx ?? this.getRandomGenre(),
      ageIdx: input.ageIdx ?? this.getRandomAge(),
      styleIdxList: input.styleIdxList ?? this.getRandomStyles(),
      imgList: input.imgList ?? this.getRandomImgLIst(),
      userIdx: input.userIdx,
      location: {
        address: input.location?.address ?? faker.location.streetAddress(),
        detailAddress:
          input.location?.detailAddress ?? faker.location.buildingNumber(),
        region1Depth: input.location?.region1Depth ?? faker.lorem.slug(2),
        region2Depth: input.location?.region2Depth ?? faker.lorem.slug(2),
        hCode: randomHCode,
        bCode: randomBCode,
        positionX: input.location?.positionX ?? faker.location.longitude(),
        positionY: input.location?.positionY ?? faker.location.latitude(),
        sidoCode: randomBCode.substring(0, 2),
        sggCode: randomBCode.substring(2, 5),
        legCode: randomBCode.substring(5, 8),
        riCode: randomBCode.substring(8, 10),
      },
      performId: null,
      title: input.title ?? faker.lorem.slug(2),
      description: input.description ?? null,
      websiteLink: input.websiteLink ?? faker.internet.url(),
      startDate: input.startDate ?? this.getRandomStartDate(),
      endDate: input.endDate ?? null,
      viewCount: input.viewCount || 0,
      openTime: input.openTime ?? faker.lorem.slug(2),
      isFee: input.isFee ?? faker.datatype.boolean(),
      isReservation: input.isReservation ?? faker.datatype.boolean(),
      isPet: input.isPet ?? faker.datatype.boolean(),
      isParking: input.isParking ?? faker.datatype.boolean(),
      likeCount: input.likeCount ?? 0,
      acceptedAt: input.acceptedAt ?? null,
      deletedAt: input.deletedAt ?? null,
    };
  }

  private getRandomCode() {
    return Array.from({ length: 10 }, () =>
      faker.number.int(9).toString(),
    ).join('');
  }

  private getRandomAge() {
    return getRandomValueFromConstant(AGE);
  }

  private getRandomStartDate() {
    const date = new Date();
    const oneYearAgoDate = new Date();

    oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1);

    return faker.date.between({
      from: oneYearAgoDate,
      to: date,
    });
  }

  private getRandomImgLIst(): string[] {
    const randomCount = Math.floor(Math.random() * 10) + 1; // 1 ~ 10

    return Array.from({ length: randomCount }).map(
      () => `/${faker.lorem.word()}/${faker.lorem.word()}`,
    );
  }
}
