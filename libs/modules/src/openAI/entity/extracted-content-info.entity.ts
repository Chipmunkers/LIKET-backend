/**
 * 이미지로부터 컨텐츠 정보를 추출한 결과물
 *
 * 모든 string 필드는 빈 문자열이 출력될 수 있음에 주의
 *
 * @author jochongs
 */
export class ExtractedContentInfoEntity {
  public title: string;
  public genre: string;
  public address: string;
  public openTime: string;
  public startDate: string;
  public endDate: string;
  public detailedAddress: string;
  public isFee: boolean;
  public isReservation: boolean;
  public isParking: boolean;
  public isPet: boolean;

  constructor(data: ExtractedContentInfoEntity) {
    Object.assign(this, data);
  }

  public static from(
    data: ExtractedContentInfoEntity,
  ): ExtractedContentInfoEntity {
    return new ExtractedContentInfoEntity({
      title: data.title,
      genre: data.genre,
      address: data.address,
      openTime: data.openTime,
      startDate: data.startDate,
      endDate: data.endDate,
      detailedAddress: data.detailedAddress,
      isFee: data.isFee,
      isReservation: data.isReservation,
      isParking: data.isParking,
      isPet: data.isPet,
    });
  }
}
