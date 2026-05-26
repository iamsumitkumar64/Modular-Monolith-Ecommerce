import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetPayHistoryService {
    constructor(
        private readonly repository: FinanceRepository,
    ) { }

    async getPayHistories(user: UserEntity) {
        const history = await this.repository.findHistories(user.uuid);

        return {
            data: history,
            message: "Payment history fetched successfully"
        };
    }
}