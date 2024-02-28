import { Location } from '@prisma/client';

export class LocationEntity<T extends 'summary' | 'detail' = 'detail'> {
  public region1Depth: string;
  public region2Depth: string;
  public detailAddress: T extends 'detail' ? string : undefined;
  public address: T extends 'detail' ? string : undefined;
  public positionX: T extends 'detail' ? number : undefined;
  public positionY: T extends 'detail' ? number : undefined;
  public hCode: T extends 'detail' ? string : undefined;
  public bCode: T extends 'detail' ? string : undefined;

  constructor(
    region1Depth: string,
    region2Depth: string,
    detailAddress: T extends 'detail' ? string : undefined,
    address: T extends 'detail' ? string : undefined,
    positionX: T extends 'detail' ? number : undefined,
    positionY: T extends 'detail' ? number : undefined,
    hCode: T extends 'detail' ? string : undefined,
    bCode: T extends 'detail' ? string : undefined,
  ) {
    this.region1Depth = region1Depth;
    this.region2Depth = region2Depth;
    this.detailAddress = detailAddress;
    this.address = address;
    this.positionX = positionX;
    this.positionY = positionY;
    this.hCode = hCode;
    this.bCode = bCode;
  }

  static createDetailLocation(data: Location): LocationEntity<'detail'> {
    return new LocationEntity(
      data.region1Depth,
      data.region2Depth,
      data.detailAddress,
      data.address,
      data.positionX,
      data.positionY,
      data.hCode,
      data.bCode,
    );
  }

  static createSummaryLocation(data: Location): LocationEntity<'summary'> {
    return new LocationEntity<'summary'>(
      data.region1Depth,
      data.region2Depth,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}
