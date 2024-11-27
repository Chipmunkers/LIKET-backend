import { Gender } from '../../user/model/Gender';
import { SocialProvider } from '../strategy/social-provider.enum';

/**
 * @author jochongs
 */
export class SocialLoginUser {
  public id: string;
  public provider: SocialProvider;
  public nickname: string;
  public email: string;
  public gender?: Gender;
  public birth?: string;

  constructor(data: SocialLoginUser) {
    Object.assign(this, data);
  }
}
