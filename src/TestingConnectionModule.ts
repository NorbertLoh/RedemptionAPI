import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv'
dotenv.config();

export const TypeORMMySqlTestingModule = (entities: any[]) =>
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.PGHOST,
        port: 5432,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDB,
        entities: [],
        synchronize: false,
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false }
    });