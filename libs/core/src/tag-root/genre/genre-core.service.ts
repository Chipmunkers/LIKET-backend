import { Injectable } from '@nestjs/common';
import { GenreCoreRepository } from 'libs/core/tag-root/genre/genre-core.repository';

@Injectable()
export class GenreCoreService {
  constructor(private readonly genreCoreRepository: GenreCoreRepository) {}
}
