import { Injectable } from '@nestjs/common';
import { TosCoreRepository } from 'libs/core/tos/tos-core.repository';

@Injectable()
export class TosCoreService {
  constructor(private readonly tosCoreRepository: TosCoreRepository) {}
}
