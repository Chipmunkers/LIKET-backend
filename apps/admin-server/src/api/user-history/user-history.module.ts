import { Module } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { UserHistoryController } from './user-history.controller';

@Module({
  providers: [UserHistoryService],
  controllers: [UserHistoryController],
})
export class UserHistoryModule {}
