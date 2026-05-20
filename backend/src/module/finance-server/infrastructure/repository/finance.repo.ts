import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { PaymentCardEntity } from "../../domain/payment-card/payment-card.entity";
import { PaymentAccountEntity } from "../../domain/payment-account/payment-account.entity";
import { PaymentHistoryEntity } from "../../domain/payment-history/payment-history.entity";

@Injectable()
export class FinanceRepository {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_FINANCE_SCHEMA || 'finance_schema')
        private readonly dataSource: DataSource,
    ) { }

    getCardRepository() {
        return this.dataSource.getRepository(PaymentCardEntity);
    }

    getAccountRepository() {
        return this.dataSource.getRepository(PaymentAccountEntity);
    }

    getHistoryRepository() {
        return this.dataSource.getRepository(PaymentHistoryEntity);
    }

    async findUserCards(user_uuid: string) {
        return await this.getCardRepository().find({
            where: { user_uuid },
            order: { created_at: "DESC" }
        });
    }

    async findCard(user_uuid: string, uuid: string) {
        return await this.getCardRepository().findOne({
            where: { uuid, user_uuid },
            order: { created_at: "DESC" }
        });
    }

    async createCard(payload: Partial<PaymentCardEntity>) {
        const repo = this.getCardRepository();
        const card = repo.create(payload);
        return await repo.save(card);
    }

    async deleteCard(user_uuid: string, uuid: string) {
        return await this.getCardRepository().delete({ uuid, user_uuid });
    }

    async findAccount(user_uuid: string) {
        return await this.getAccountRepository().findOne({ where: { user_uuid } });
    }

    async createAccount(payload: Partial<PaymentAccountEntity>) {
        const repo = this.getAccountRepository();
        const account = repo.create(payload);
        return await repo.save(account);
    }

    async saveAccount(account: PaymentAccountEntity) {
        return await this.getAccountRepository().save(account);
    }

    async createHistory(payload: Partial<PaymentHistoryEntity>) {
        const repo = this.getHistoryRepository();
        const history = repo.create(payload);
        return await repo.save(history);
    }

    async findHistories(user_uuid: string) {
        return await this.getHistoryRepository().find({
            where: { user_uuid },
            order: { created_at: "DESC" }
        });
    }
}
