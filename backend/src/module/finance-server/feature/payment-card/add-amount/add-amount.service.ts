import { BadRequestException, Injectable } from "@nestjs/common";
import { PaymentHistoryTypeEnum } from "src/module/finance-server/domain/payment-history/payment.enum";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";

@Injectable()
export class AddAmountService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async addAmount(user: UserEntity, amount: number) {
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
            type: PaymentHistoryTypeEnum.TOPUP,
            description: 'Account top-up',
        });

        return {
            data: saved,
            message: "Amount added to account"
        };
    }
}