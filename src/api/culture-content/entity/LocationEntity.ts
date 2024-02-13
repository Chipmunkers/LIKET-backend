import { Location } from '@prisma/client';

export class LocationEntity<T extends 'summary' | 'detail' = 'detail'>
  implements Location
{
  idx: undefined;

  constructor(
    public region1Depth: string,
    public region2Depth: string,
    public detailAddress: T extends 'detail' ? string : undefined,
    public address: T extends 'detail' ? string : undefined,
    public positionX: T extends 'detail' ? number : undefined,
    public positionY: T extends 'detail' ? number : undefined,
    public hCode: T extends 'detail' ? string : undefined,
    public bCode: T extends 'detail' ? string : undefined,
  ) {}

  static createLocation(data: Location): LocationEntity {
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
}
