import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "../../infrastructure/repository/finance.repo";

@Injectable()
export class PaymentService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async getCards(user: any) {
        return {
            data: await this.financeRepo.findCards(user.uuid),
            message: "Cards fetched successfully"
        }
    }

    async addCard(user: any, body: any) {
        const payload = {
            ...body,
            user_uuid: user.uuid,
        };

        const card = await this.financeRepo.createCard(payload);
        return {
            data: card,
            message: "Card added successfully"
        };
    }

    async deleteCard(user: any, uuid: string) {
        await this.financeRepo.deleteCard(user.uuid, uuid);
        return {
            message: "Card deleted successfully"
        };
    }

    async getAccount(user: any) {
        let account = await this.financeRepo.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepo.createAccount({ user_uuid: user.uuid, balance: 0 });
        }
        return {
            data: account,
            message: "Account fetched successfully"
        };
    }

    async addAmount(user: any, amount: number) {
        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        let account = await this.financeRepo.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepo.createAccount({ user_uuid: user.uuid, balance: 0 });
        }

        account.balance += amount;
        const saved = await this.financeRepo.saveAccount(account);
        await this.financeRepo.createHistory({
            user_uuid: user.uuid,
            amount,
            type: 'topup',
            description: 'Account top-up',
        });

        return {
            data: saved,
            message: "Amount added to account"
        };
    }

    async getHistories(user: any) {
        return {
            data: await this.financeRepo.findHistories(user.uuid),
            message: "Payment history fetched successfully"
        };
    }

    async pay(user: any, body: any) {
        const amount = Number(body.amount);
        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        let cardUuid = body.card_uuid;
        if (!cardUuid) {
            if (!body.card || !body.card.card_number || !body.card.name_on_card) {
                throw new BadRequestException("Card information is required");
            }
            const card = await this.financeRepo.createCard({
                user_uuid: user.uuid,
                name_on_card: body.card.name_on_card,
                card_number: body.card.card_number,
                expiry_month: body.card.expiry_month || '',
                expiry_year: body.card.expiry_year || '',
            });
            cardUuid = card.uuid;
        }

        let account = await this.financeRepo.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepo.createAccount({ user_uuid: user.uuid, balance: 0 });
        }

        account.balance += amount;
        const saved = await this.financeRepo.saveAccount(account);

        await this.financeRepo.createHistory({
            user_uuid: user.uuid,
            amount,
            type: 'payment',
            card_uuid: cardUuid,
            description: `Paid with card ${cardUuid}`,
        });

        return {
            data: saved,
            message: "Payment processed and account updated"
        };
    }
}
