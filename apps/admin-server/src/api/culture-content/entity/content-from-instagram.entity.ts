import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { ContentEntity } from 'apps/admin-server/src/api/culture-content/entity/content.entity';
import { LocationEntity } from 'apps/admin-server/src/api/culture-content/entity/location.entity';
import { TagEntity } from 'apps/admin-server/src/api/culture-content/entity/tag.entity';
import { Age } from 'libs/core/tag-root/age/constant/age';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';
import {
  ExtractedContentInfoEntity,
  InstagramFeedEntity,
  KakaoAddressEntity,
  UploadedFileEntity,
} from 'libs/modules';

export class ContentFromInstagramEntity extends IntersectionType(
  PartialType(
    PickType(ContentEntity, [
      'title',
      'description',
      'openTime',
      'imgList',
      'location',
    ] as const),
  ),
  PickType(ContentEntity, [
    'isFee',
    'isParking',
    'isPet',
    'isReservation',
  ] as const),
) {
  public genreIdx?: Genre;
  public styleList: Style[];
  public age?: Age;
  public endDate?: string;
  public startDate?: string;

  constructor(data: ContentFromInstagramEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromInstagram(
    feed: InstagramFeedEntity,
    extractedContentInfoEntity: ExtractedContentInfoEntity,
    kakaoLocation: KakaoAddressEntity | null,
    styleList: Style[] | null,
    uploadedImgList: UploadedFileEntity[],
    age: Age | null,
  ): ContentFromInstagramEntity {
    const location = kakaoLocation
      ? LocationEntity.fromKakaoAddress(kakaoLocation)
      : undefined;

    if (location) {
      location.detailAddress = extractedContentInfoEntity.detailedAddress;
    }

    return new ContentFromInstagramEntity({
      title: extractedContentInfoEntity.title
        ? extractedContentInfoEntity.title
        : undefined,
      description: feed.caption ? feed.caption : undefined,
      styleList: styleList ? styleList : [],
      age: age ? age : undefined,
      endDate: extractedContentInfoEntity.endDate,
      startDate: extractedContentInfoEntity.startDate,
      genreIdx: extractedContentInfoEntity.genre
        ? (Number(extractedContentInfoEntity.genre) as Genre)
        : undefined,
      isFee: extractedContentInfoEntity.isFee,
      isPet: extractedContentInfoEntity.isPet,
      isParking: extractedContentInfoEntity.isParking,
      isReservation: extractedContentInfoEntity.isReservation,
      imgList: uploadedImgList.map(({ path }) => path),
      location: location,
    });
  }
}
