import { InterestAgeEntity } from 'apps/user-server/src/api/user-interest/entity/interest-age.entity';
import { InterestGenreEntity } from 'apps/user-server/src/api/user-interest/entity/interest-genre.entity';
import { InterestLocationEntity } from 'apps/user-server/src/api/user-interest/entity/interest-location.entity';
import { InterestStyleEntity } from 'apps/user-server/src/api/user-interest/entity/interest-style.entity';
import { UserWithInterest } from 'apps/user-server/src/api/user-interest/entity/prisma-type/user-with-interest';

/**
 * @author jochongs
 */
export class InterestTagEntity {
  genreList: InterestGenreEntity[];
  styleList: InterestStyleEntity[];
  ageList: InterestAgeEntity[];
  locationList: InterestLocationEntity[];

  constructor(data: InterestTagEntity) {
    Object.assign(this, data);
  }

  static createEntity(interest: UserWithInterest): InterestTagEntity {
    return new InterestTagEntity({
      genreList: interest.InterestGenre.map((genre) =>
        InterestGenreEntity.createEntity(genre),
      ),
      styleList: interest.InterestStyle.map((style) =>
        InterestStyleEntity.createEntity(style),
      ),
      ageList: interest.InterestAge.map((age) =>
        InterestAgeEntity.createEntity(age),
      ),
      locationList: interest.InterestLocation.map((location) =>
        InterestLocationEntity.createEntity(location),
      ),
    });
  }
}
