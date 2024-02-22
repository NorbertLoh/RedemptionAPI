import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
import { EventsModule } from './events/events.module';
import { StaffsModule } from './staffs/staffs.module';
import { RedemptionModule } from './redemption/redemption.module';

dotenv.config();

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDB,
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    StaffsModule,
    RedemptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
