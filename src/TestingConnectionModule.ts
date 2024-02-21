import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
dotenv.config();

export const TypeORMMySqlTestingModule = (entities: any[]) =>
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: 'gift_redemption',
        entities: [],
        synchronize: false,
        autoLoadEntities: true,
    });