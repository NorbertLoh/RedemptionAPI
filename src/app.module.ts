import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv'

// import

import { EventsModule } from './events/events.module';
import { StaffsModule } from './staffs/staffs.module';
import { RedemptionModule } from './redemption/redemption.module';

dotenv.config();

@Module({
  imports: [
    EventsModule,
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: process.env.USER,
    //   password: process.env.PASSWORD,
    //   database: 'gift_redemption',
    //   entities: [],
    //   synchronize: false,
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'singapore-postgres.render.com',
      port: 5432,
      username: "redemption_user",
      password: "oFlDDHkhUqOvFS8g3Knva0Dx2bUCUNzb",
      database: 'redemption',
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
