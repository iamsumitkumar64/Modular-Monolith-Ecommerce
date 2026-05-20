import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { PayDto } from "./pay-dto";
import { PaymentHistoryTypeEnum } from "src/module/finance-server/domain/payment-history/payment.type.enum";

@Injectable()
export class PayService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async pay(user: UserEntity, body: PayDto) {
        const amount = Number(body.amount);
        // amount should be reasonlabe
        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        // check is card exists with user
        const isCardExists = await this.financeRepo.findCard(user.uuid, body.card_uuid);
        if (!isCardExists) {
            throw new BadRequestException("Card not found");
        }

        let account = await this.financeRepo.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepo.createAccount({ user_uuid: user.uuid, balance: 0 });
        }

        // amount is too much to pay than in user account
        if (account.balance < amount) {
            throw new BadRequestException("Insufficient balance in account");
        }

        // deduct amount from account
        account.balance -= amount;
        const saved = await this.financeRepo.saveAccount(account);

        // make payment history
        await this.financeRepo.createHistory({
            user_uuid: user.uuid,
            amount,
            type: PaymentHistoryTypeEnum.PAYMENT,
            card_uuid: isCardExists.uuid,
            description: `Paid with card ${isCardExists.uuid}`,
        });

        return {
            data: saved,
            message: "Payment processed and account updated"
        };
    }
}