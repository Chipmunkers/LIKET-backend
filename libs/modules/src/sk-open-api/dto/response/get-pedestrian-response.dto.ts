import { PedestrianFeature } from 'libs/modules/sk-open-api/type/pedestrian-feature';

export class GetPedestrianResponseDto {
  type: 'FeatureCollection';
  features: PedestrianFeature[];
}
