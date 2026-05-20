import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";

@Injectable()
export class GetAccountService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async getAccount(user: UserEntity) {
        let account = await this.financeRepo.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepo.createAccount({ user_uuid: user.uuid, balance: 0 });
        }
        return {
            data: account,
            message: "Account fetched successfully"
        };
    }
}