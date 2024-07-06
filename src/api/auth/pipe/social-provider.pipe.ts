import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { SocialProvider } from '../strategy/social-provider.enum';

export class SocialProviderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!Object.values(SocialProvider).includes(value)) {
      throw new BadRequestException('invalid provider');
    }

    return value;
  }
}
