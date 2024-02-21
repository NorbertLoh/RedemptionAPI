import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';

import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    MulterModule.register({
        dest: './upload',
      }),
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
