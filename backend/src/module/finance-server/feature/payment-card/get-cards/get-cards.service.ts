import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";

@Injectable()
export class GetCardsService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async getCards(user: UserEntity) {
        return {
            data: await this.financeRepo.findUserCards(user.uuid),
            message: "Cards fetched successfully"
        }
    }
}