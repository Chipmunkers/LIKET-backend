import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { SocialProvider } from '../strategy/social-provider.enum';

/**
 * 등록된 소셜 로그인 Provider를 검증하는 메서드입니다.
 *
 * @author jochongs
 */
export class SocialProviderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!Object.values(SocialProvider).includes(value)) {
      throw new BadRequestException('invalid provider');
    }

    return value;
  }
}
