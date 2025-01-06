import { Module } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { UserHistoryController } from './user-history.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [UserHistoryService],
  controllers: [UserHistoryController],
})
export class UserHistoryModule {}
