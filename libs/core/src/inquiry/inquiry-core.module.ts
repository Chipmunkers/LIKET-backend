import { Module } from '@nestjs/common';
import { InquiryCoreRepository } from 'libs/core/inquiry/inquiry-core.repository';
import { InquiryCoreService } from 'libs/core/inquiry/inquiry-core.service';

@Module({
  imports: [],
  providers: [InquiryCoreService, InquiryCoreRepository],
  exports: [InquiryCoreService],
})
export class InquiryCoreModule {}
