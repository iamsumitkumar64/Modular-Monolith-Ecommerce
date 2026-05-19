//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { PaymentAccountEntity } from "../../domain/payment-account/payment-account.entity";
import { PaymentCardEntity } from "../../domain/payment-card/payment-card.entity";
import { PaymentHistoryEntity } from "../../domain/payment-history/payment-history.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity,
        InboxEntity,
        PaymentAccountEntity,
        PaymentCardEntity,
        PaymentHistoryEntity,
    ],
    schema: process.env.DB_POSTGRES_FINANCE_SCHEMA || 'finance_schema',
    synchronize: true,
    migrations: ['dist/module/order-server/infrastructure/database/migrations/*{.ts,.js}'],
};

const financeDataSource = new DataSource(options);

export { financeDataSource, options };