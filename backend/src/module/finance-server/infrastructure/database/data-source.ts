//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, InboxEntity,
    ],
    schema: process.env.DB_POSTGRES_FINANCE_SCHEMA || 'finance_schema',
    synchronize: false,
    migrations: ['dist/module/order-server/infrastructure/database/migrations/*{.ts,.js}'],
};

const financeDataSource = new DataSource(options);

export { financeDataSource, options };